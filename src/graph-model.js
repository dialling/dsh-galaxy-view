/**
 * Pure galaxy model: workspace/session projection, spiral-arm seeding, camera
 * math and picking. No DOM, no React, no canvas — so it can be checked in Node
 * (scripts/selfcheck.mjs) and embedded in the client bundle by
 * scripts/build.mjs (which strips the `export ` keywords).
 *
 * The look follows the "cinematic 3D graph" school (Obsidian's Galaxy View):
 * a flattened spiral disc seen through a perspective camera, luminous nodes,
 * faint filaments, slow rotation.
 */

const TAU = Math.PI * 2;
/** Spiral arms. Two arms with a long twist read as a galaxy; three look bushy. */
const ARMS = 2;
/** How far an arm follows out; controls how tightly the arms coil. */
const TWIST = 4.3;
/** Shape knobs the control panel exposes (arms / twist / thickness / spread). */
const SHAPE = { arms: ARMS, twist: TWIST, thickness: 1, spread: 1 };
/** Hue ring for workspace stars; a workspace keeps one hue for its whole life. */
const HUES = [180, 36, 265, 208, 158, 330, 96, 190, 12];
/** Spokes drawn from one workspace to its conversations; older ones keep their body, not the wire. */
const SPOKE_CAP = 32;

/** Stable string hash (FNV-1a) → [0,1). Deterministic seeding per node id. */
function hash01(text) {
	let value = 2166136261;
	for (let index = 0; index < text.length; index += 1) {
		value ^= text.charCodeAt(index);
		value = Math.imul(value, 16777619);
	}
	return (value >>> 0) / 4294967296;
}

/** Last path segment of a workspace path. */
function basename(path) {
	if (typeof path !== "string" || path === "") return "";
	const parts = path.split(/[\\/]+/).filter((part) => part !== "" && part !== ".");
	return parts.length === 0 ? path : parts[parts.length - 1];
}

/** Milliseconds of an ISO timestamp, or 0. */
function timeOf(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value !== "string") return 0;
	const parsed = Date.parse(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Project the client stores into galaxy members.
 *
 * Folders are Host Workspaces; sessions hang off the workspace that owns them.
 * A session no workspace claims is attached by exact `cwd` when possible and
 * otherwise to a per-directory folder, so nothing silently disappears.
 *
 * @param workspaces - `workspaces.list` snapshot (`items`, `archivedSessionIds`).
 * @param sessions - `sessions.list` snapshot (`ids`, `byId`).
 * @param options - `{ showArchived, hidden, only, showOrphans, showEmpty, filter }`;
 *   `filter` uses the {@link parseFilter} syntax and drops conversations that fail it.
 * @returns `{ nodes, links, stats }`; node ids are `ws:<id>` or the session id.
 */
function buildGraph(workspaces, sessions, options) {
	const showArchived = options?.showArchived === true;
	const hidden = options?.hidden instanceof Set ? options.hidden : new Set(Array.isArray(options?.hidden) ? options.hidden : []);
	const only = typeof options?.only === "string" && options.only !== "" ? options.only : null;
	const showOrphans = options?.showOrphans === true;
	const showEmpty = options?.showEmpty === true;
	const filter = parseFilter(options?.filter);
	const blockedPaths = new Set();
	const items = Array.isArray(workspaces?.items) ? workspaces.items : [];
	const summaries = sessions?.byId !== undefined && sessions?.byId !== null ? sessions.byId : {};
	const archived = new Set(Array.isArray(workspaces?.archivedSessionIds) ? workspaces.archivedSessionIds : []);
	const now = Date.now();
	const nodes = [];
	const links = [];
	const folders = [];
	const claimed = new Set();
	const folderByPath = new Map();

	const addFolder = (workspace) => {
		const node = {
			id: `ws:${workspace.workspaceId}`,
			kind: "folder",
			workspaceId: workspace.workspaceId,
			label: typeof workspace.title === "string" && workspace.title !== "" ? workspace.title : basename(workspace.path),
			path: typeof workspace.path === "string" ? workspace.path : "",
			hue: HUES[folders.length % HUES.length],
			hueIndex: folders.length,
			count: 0,
			spokes: 0,
			orphan: false,
			order: folders.length,
			index: nodes.length
		};
		folders.push(node);
		nodes.push(node);
		if (node.path !== "") folderByPath.set(node.path, node);
		return node;
	};

	const addSession = (summary, folder) => {
		if (filter !== null) {
			const label = typeof summary.displayTitle === "string" && summary.displayTitle !== "" ? summary.displayTitle : summary.id;
			const fields = {
				name: `${label} ${typeof summary.title === "string" ? summary.title : ""} ${folder?.label ?? ""}`,
				path: `${typeof summary.cwd === "string" ? summary.cwd : ""} ${folder?.path ?? ""}`
			};
			if (!filterAccepts(filter, fields)) return null;
		}
		const updatedAt = timeOf(summary.updatedAt);
		const ageDays = updatedAt === 0 ? 30 : Math.max(0, (now - updatedAt) / 86400000);
		const recency = Math.max(0, 1 - Math.log10(ageDays + 1) / 2.2);
		const node = {
			id: summary.id,
			kind: "session",
			label: typeof summary.displayTitle === "string" && summary.displayTitle !== "" ? summary.displayTitle : summary.id,
			title: typeof summary.title === "string" ? summary.title : "",
			cwd: typeof summary.cwd === "string" ? summary.cwd : "",
			parentId: typeof summary.parentId === "string" ? summary.parentId : "",
			running: summary.running === true,
			archived: archived.has(summary.id),
			blank: summary.blank === true,
			current: (summary.retainedBy?.mainView ?? 0) > 0,
			updatedAt,
			recency,
			hue: folder === undefined ? HUES[0] : folder.hue,
			hueIndex: folder === undefined ? 0 : folder.hueIndex,
			folderId: folder === undefined ? "" : folder.id,
			index: nodes.length
		};
		nodes.push(node);
		claimed.add(summary.id);
		if (folder !== undefined) {
			// A sun with eighty conversations does not need eighty spokes: past SPOKE_CAP the
			// oldest ones drop their wire (the body stays). The overview reads as clusters
			// instead of a starburst, and 聚焦 still reaches every star through the selection.
			if (folder.spokes < SPOKE_CAP) {
				folder.spokes += 1;
				links.push({ a: folder.index, b: node.index, kind: "member" });
			}
			folder.count += 1;
		}
		return node;
	};

	for (const workspace of items) {
		if (workspace === null || typeof workspace !== "object") continue;
		if (only !== null && workspace.workspaceId !== only) {
			if (typeof workspace.path === "string") blockedPaths.add(workspace.path);
			continue;
		}
		if (hidden.has(workspace.workspaceId) || hidden.has(`ws:${workspace.workspaceId}`)) {
			if (typeof workspace.path === "string") blockedPaths.add(workspace.path);
			continue;
		}
		const folder = addFolder(workspace);
		const sessionIds = Array.isArray(workspace.sessionIds) ? workspace.sessionIds : [];
		for (const sessionId of sessionIds) {
			const summary = summaries[sessionId];
			if (summary === undefined || summary === null || claimed.has(sessionId)) continue;
			if (archived.has(sessionId) && !showArchived) continue;
			addSession(summary, folder);
		}
	}

	const ids = Array.isArray(sessions?.ids) ? sessions.ids : [];
	for (const sessionId of ids) {
		const summary = summaries[sessionId];
		if (summary === undefined || summary === null || claimed.has(sessionId)) continue;
		if (archived.has(sessionId) && !showArchived) continue;
		const cwd = typeof summary.cwd === "string" ? summary.cwd : "";
		let folder = folderByPath.get(cwd);
		if (folder === undefined) {
			// Sessions that no workspace claims only become a sun when asked for;
			// ones whose workspace was filtered out stay hidden with it.
			if (!showOrphans || only !== null || cwd === "" || blockedPaths.has(cwd)) continue;
			folder = addFolder({ workspaceId: `cwd:${cwd}`, path: cwd, title: basename(cwd) || cwd });
			folder.orphan = true;
		}
		if (only !== null && folder.workspaceId !== only) continue;
		if (hidden.has(folder.workspaceId) || hidden.has(folder.id)) continue;
		addSession(summary, folder);
	}

	if (!showEmpty) {
		const keep = nodes.filter((node) => node.kind !== "folder" || node.count > 0);
		if (keep.length !== nodes.length) {
			const remap = new Map(keep.map((node) => [nodes.indexOf(node), keep.indexOf(node)]));
			const keptLinks = [];
			for (const link of links) {
				if (!remap.has(link.a) || !remap.has(link.b)) continue;
				keptLinks.push({ ...link, a: remap.get(link.a), b: remap.get(link.b) });
			}
			nodes.length = 0;
			keep.forEach((node, position) => {
				node.index = position;
				nodes.push(node);
			});
			links.length = 0;
			keptLinks.forEach((link) => links.push(link));
		}
	}

	// Session → parent session edges (fork / subagent lineage), only between drawn stars.
	const byId = new Map(nodes.map((node) => [node.id, node]));
	for (const node of nodes) {
		if (node.kind !== "session" || node.parentId === "") continue;
		const parent = byId.get(node.parentId);
		if (parent === undefined || parent.kind !== "session") continue;
		links.push({ a: parent.index, b: node.index, kind: "lineage", faint: true });
	}

	// Palette slots go by size, as in Galaxy View's assignFolderHues: the busiest
	// workspaces take the first, most distinct colours; ties keep workspace order.
	nodes
		.filter((node) => node.kind === "folder")
		.sort((left, right) => right.count - left.count || left.order - right.order)
		.forEach((folder, rank) => {
			folder.hueIndex = rank;
			folder.hue = HUES[rank % HUES.length];
		});
	for (const node of nodes) {
		if (node.kind !== "session" || node.folderId === "") continue;
		const folder = byId.get(node.folderId);
		if (folder === undefined) continue;
		node.hueIndex = folder.hueIndex;
		node.hue = folder.hue;
	}

	const sessionCount = nodes.reduce((total, node) => total + (node.kind === "session" ? 1 : 0), 0);
	const drawnFolders = nodes.reduce((total, node) => total + (node.kind === "folder" ? 1 : 0), 0);
	const allSessions = Object.keys(summaries).length;
	return {
		nodes,
		links,
		stats: { folders: drawnFolders, sessions: sessionCount, hiddenFolders: Math.max(0, items.length - drawnFolders), totalSessions: allSessions }
	};
}



/** Every silhouette the galaxy can take. A preset is mostly this choice. */
const LAYOUTS = ["spiral", "rings", "field", "system", "helix", "web", "plate", "tree", "memory", "sphere"];

/**
 * Spiral arms run from SPIRAL_INNER to SPIRAL_OUTER. The inner radius keeps the core
 * sparse (only faint dust reaches the middle); radius grows with √t so stars spread
 * evenly by arc length instead of crowding the short inner turns.
 */
const SPIRAL_INNER = 0.36;
const SPIRAL_OUTER = 1;
const RING_RADII = [0.34, 0.56, 0.78, 1];
/**
 * 浑天: an armillary sphere. `SPHERE_CIRCLES` rings of the same radius, each tilted to its own
 * plane — concentric about the centre, their union a ball — and each spinning inside its own
 * plane. That is what "同心圆环，各自旋转一定角度，形成球" looks like in 3D.
 */
const SPHERE_RADIUS = 1;
const SPHERE_CIRCLES = 5;
/** One orthonormal pair (u, v) per ring: the plane it lies in. */
const SPHERE_PLANES = (() => {
	const norm = ([x, y, z]) => {
		const length = Math.hypot(x, y, z) || 1;
		return [x / length, y / length, z / length];
	};
	const cross = ([ax, ay, az], [bx, by, bz]) => [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
	const rotate = (vector, axis, angle) => {
		const [x, y, z] = vector;
		const [ux, uy, uz] = axis;
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const dot = x * ux + y * uy + z * uz;
		return [
			x * cos + (uy * z - uz * y) * sin + ux * dot * (1 - cos),
			y * cos + (uz * x - ux * z) * sin + uy * dot * (1 - cos),
			z * cos + (ux * y - uy * x) * sin + uz * dot * (1 - cos)
		];
	};
	const golden = Math.PI * (3 - Math.sqrt(5));
	const planes = [];
	for (let ring = 0; ring < SPHERE_CIRCLES; ring += 1) {
		// Start from a ring in the XZ plane, tilt it by its own share of the golden angle, then
		// swing the whole plane about Y, so no two rings share a plane.
		const tilt = (ring * golden) / 2;
		const swing = (ring * TAU) / SPHERE_CIRCLES;
		const u = rotate([1, 0, 0], [0, 1, 0], swing);
		const v = rotate([0, 1, 0], [0, 1, 0], swing);
		const uu = norm(rotate(u, norm(cross(u, v)), tilt));
		const vv = norm(rotate(v, norm(cross(u, v)), tilt));
		planes.push([uu, vv]);
	}
	return planes;
})();
/** Radians per second for the innermost→outermost ring's own spin (alternating direction). */
const SPHERE_ORBIT = 0.035;
const HELIX_RADIUS = 0.66;
const HELIX_HEIGHT = 1.4;
const HELIX_TURNS = 1.6;
/** Plate: a cube of cells, half-width so the corner cells sit near radius 1. */
const CUBE_HALF = 0.6;

/**
 * 星树: the main limbs. Two per arm (2–8), spread over the whole sphere on a golden
 * spiral so the tree reaches every side. Each main limb carries a fan of workspace
 * limbs, which is what closes the empty gaps a handful of spokes used to leave.
 */
function treeSectors(arms) {
	return Math.max(2, Math.min(8, Math.round(arms ?? 2) * 2));
}

function treeDirection(branch, branches) {
	const lift = 1 - (2 * (branch + 0.5)) / branches;
	const ring = Math.sqrt(Math.max(0, 1 - lift * lift));
	// Even azimuths, stratified heights: golden-angle azimuths on four limbs leave one
	// horizontal axis long and the other short, which shows as a tree that leans.
	const turn = (branch / branches) * TAU;
	return { x: Math.cos(turn) * ring, y: lift, z: Math.sin(turn) * ring };
}

/**
 * 星树 layout: one limb per workspace, fanned off a main limb so a handful of limbs read
 * as a tree instead of a dozen equal spokes with bare sky between them. Main limbs are
 * dealt the workspaces by *mass* (heaviest first, round-robin), so the busiest
 * workspaces land on different mains instead of piling onto the two equatorial ones —
 * which is what made the tree look flat and lopsided.
 *
 * @param folders - the galaxy's workspaces, each with its `count` of conversations.
 * @returns `[{ direction, tangent, bitangent, sector, slot }]` per folder, in folder order.
 */
function treePlan(folders, arms, salt) {
	// 星树 is a pure starburst now: every workspace gets its own ray out of the common centre,
	// spread over the sphere by the golden angle, so nothing is fanned off a "main limb" any
	// more — the limbs all leave the origin and the heaviest ones simply reach further.
	const plan = new Array(folders.length);
	const golden = Math.PI * (3 - Math.sqrt(5));
	folders.forEach((folder, index) => {
		// Golden-spiral directions: even over the sphere for any count, no leaning axis.
		const lift = 1 - (2 * (index + 0.5)) / Math.max(1, folders.length);
		const ring = Math.sqrt(Math.max(0, 1 - lift * lift));
		const turn = index * golden + (hash01(`${folder.id}:ray${salt}`) - 0.5) * 0.18;
		const direction = normalize({ x: Math.cos(turn) * ring, y: lift, z: Math.sin(turn) * ring });
		const frame = treeFrame(direction);
		plan[index] = { direction, tangent: frame.tangent, bitangent: frame.bitangent, sector: index, slot: 0 };
	});
	return plan;
}

/**
 * 巡飞的 Agent: a session that is working right now leaves its seat and circles the outside of the
 * shell — a tilted great circle at AGENT_ORBIT × the shell radius, so it reads as "working, above
 * everything else" instead of as one more dot in a cluster. Blinking is the client's job (it owns
 * the frame clock); this only moves the body.
 */
const GOLDEN_ANGLE = 2.399963229728653;
const AGENT_ORBIT = 1.16;
const AGENT_SPEED = 0.42;

/**
 * 每颗一个轨道面: each agent gets its own great circle, rotated by two index-derived angles, so two
 * working sessions never share a plane and cannot cross at the same point.
 */
function agentPlane(node) {
	const tilt = 0.42;
	const baseU = { x: Math.cos(tilt), y: Math.sin(tilt), z: 0 };
	const raw = { x: -Math.sin(tilt) * 0.34, y: Math.cos(tilt) * 0.34, z: 0.94 };
	const length = Math.hypot(raw.x, raw.y, raw.z);
	const baseV = { x: raw.x / length, y: raw.y / length, z: raw.z / length };
	const index = node.index ?? 0;
	// Two independent rotations: the plane's roll and its inclination.
	const roll = index * GOLDEN_ANGLE;
	const incline = (index * 1.7) % Math.PI;
	const rotateZ = (v, a) => ({ x: v.x * Math.cos(a) - v.y * Math.sin(a), y: v.x * Math.sin(a) + v.y * Math.cos(a), z: v.z });
	const tiltAroundX = (v, a) => ({ x: v.x, y: v.y * Math.cos(a) - v.z * Math.sin(a), z: v.y * Math.sin(a) + v.z * Math.cos(a) });
	return { u: rotateZ(baseU, roll), v: rotateZ(baseV, roll) };
}

function agentBasis() {
	// One shared tilted plane for every travelling agent: they pass each other instead of
	// crossing at random angles, which is what makes the ring read as a track.
	const tilt = 0.42;
	const u = { x: Math.cos(tilt), y: Math.sin(tilt), z: 0 };
	// Orthogonal to u, then normalised, so the track is an exact circle rather than a slight oval.
	const raw = { x: -Math.sin(tilt) * 0.34, y: Math.cos(tilt) * 0.34, z: 0.94 };
	const length = Math.hypot(raw.x, raw.y, raw.z);
	return { u, v: { x: raw.x / length, y: raw.y / length, z: raw.z / length } };
}

/**
 * How busy one working agent is, 0…1: a session that wrote 2 s ago is producing, one that has
 * not moved for a minute is waiting on something. Speed and light follow this, so a stalled
 * agent crawls dimly and a busy one laps quickly and bright.
 */
function agentBusyness(node, now) {
	const idleSeconds = Math.max(0, (now - (node.updatedAt ?? 0)) / 1000);
	// A session that is still `running` is working even when it has been quiet for minutes (a long
	// build, a big edit): it keeps most of its light. Only an idle session decays on the 30 s curve.
	const decay = node.running === true ? 240 : 30;
	const activity = 1 / (1 + idleSeconds / decay);
	return Math.max(0, Math.min(1, 0.3 + 0.7 * activity));
}

/**
 * 回归: when an agent stops working it glides from the track back to its seat instead of
 * teleporting. `RETURN_SECONDS` is short enough to read as "done" and long enough to follow the
 * body; the position is an ease-out so it arrives softly, not braking at the last frame.
 */
const RETURN_SECONDS = 1.2;
const LAUNCH_SECONDS = 1.6;
/** Acceleration (world units/s²) at which the soft body is fully stretched. */
const AGENT_ACCEL_SOFT = 0.9;
/** Seconds for the tail to grow to full length behind the body. */
const AGENT_TAIL_GROW = 0.9;
/** Seconds on the lane before the tail starts recording (the owner wanted it later). */
const AGENT_TAIL_DELAY = 3.5;
/** How far the lane angle leads during the exit, in radians. */
const LAUNCH_LEAD = 0.12;

/**
 * 出发: the flight out. The agent glides from its seat onto the track instead of appearing there —
 * which is also what gives the exit its stretch, the same way the return does.
 */
function startAgentLaunch(node, seconds, peers = [], shellRadius = 1) {
	node.launchFrom = node.seat ?? { x: node.x, y: node.y, z: node.z };
	node.launchAt = seconds;
	// 起步点: hash of the id, pushed to the emptiest slot when another agent is already out.
	node.agentPhase = agentPhaseFor(node, peers);
	node.agentAngle = node.agentPhase;
	// The lane point is frozen HERE. Recomputing it per frame made the target drift while the body
	// chased it — the sudden bend in the exit.
	const { u, v } = agentPlane(node);
	const angle = node.agentAngle + LAUNCH_LEAD;
	const radius = shellRadius * AGENT_ORBIT;
	node.launchTo = {
		x: (u.x * Math.cos(angle) + v.x * Math.sin(angle)) * radius,
		y: (u.y * Math.cos(angle) + v.y * Math.sin(angle)) * radius,
		z: (u.z * Math.cos(angle) + v.z * Math.sin(angle)) * radius
	};
	// 从座位开始: a new flight starts with an empty tail, so nothing is drawn before the body moves.
	// 拖尾 starts empty: the first sample is the seat itself, taken the moment the body moves.
	node.agentTrail = [];
	node.agentTail = 0;
}

function stepAgentLaunches(galaxy, seconds, shellRadius) {
	if (galaxy === null) return;
	const radius = shellRadius * AGENT_ORBIT;
	for (const node of galaxy.nodes) {
		if (node.launchFrom === undefined) continue;
		const { u, v } = agentPlane(node);
		const t = Math.min(1, (seconds - node.launchAt) / LAUNCH_SECONDS);
		// Smootherstep: zero velocity AND zero acceleration at both ends, so the exit starts and lands
		// without the little kick smoothstep gives at the handoff.
		const ease = t * t * t * (t * (t * 6 - 15) + 10);
		// The lane angle leads a little during the flight, so the handoff to orbitAgents is continuous
		// instead of the body arriving at a stale angle and then jumping to the integrated one.
		const lane = node.agentAngle ?? (node.agentPhase ?? 0);
		const angle = lane + (LAUNCH_LEAD * ease);
		const target = {
			x: (u.x * Math.cos(angle) + v.x * Math.sin(angle)) * radius,
			y: (u.y * Math.cos(angle) + v.y * Math.sin(angle)) * radius,
			z: (u.z * Math.cos(angle) + v.z * Math.sin(angle)) * radius
		};
		const from = node.launchFrom;
		const at = spiralLeg(from, target, ease, LAUNCH_SECONDS);
		node.x = at.x;
		node.y = at.y;
		node.z = at.z;
		// 水滴形: fastest in the middle of the flight, which is exactly where it stretches most.
		// 软体 in the exit: the drop deforms with how fast it is travelling along the path, and with
		// the progress so the middle of the flight is the most stretched.
		const moved = node.agentPrev === undefined ? 0 : Math.hypot(node.x - node.agentPrev.x, node.y - node.agentPrev.y, node.z - node.agentPrev.z);
		node.agentStretch = Math.max(Math.min(0.55, moved * 60), Math.sin(Math.PI * t) * 0.55);
		if (t >= 1) {
			node.launchFrom = undefined;
			node.launchAt = undefined;
			node.launchTo = undefined;
			node.agentOrbit = true;
			// Continue the lap from exactly where the body landed.
			node.agentAngle = (node.agentPhase ?? 0) + LAUNCH_LEAD;
			node.agentAt = seconds;
			node.agentStretch = 0.06;
			// 上轨之后才生成尾焰: the tail begins here, empty, and grows as the lap records.
			node.agentTrail = [];
			node.agentTail = 0;
			node.agentLaneSince = seconds;
		}
		// No tail on the way out (the owner asked for it to start once the body is on the lane): the
		// launch records nothing, and the handoff opens an empty one.
	}
}

function startAgentReturn(node, seconds, from = null) {
	// The lap's history is dropped here: keeping it drew a straight chord from the lane to the seat,
	// which read as the tail suddenly fanning out.
	node.agentTrail = [];
	node.agentTail = 0;
	// A session can finish while the body is still climbing out; the return then starts from that
	// point instead of being skipped (which left the body to pop back onto its seat).
	node.launchFrom = undefined;
	node.launchAt = undefined;
	// `from` lets a caller hand over where the body actually was: after a graph rebuild the node
	// object sits at its layout seat again, so its own x/y/z is not the track.
	node.returningFrom = from ?? { x: node.x, y: node.y, z: node.z };
	node.returningTo = node.seat ?? { x: node.x, y: node.y, z: node.z };
	node.returningAt = seconds;
	node.agentOrbit = false;
}

function stepAgentReturns(galaxy, seconds) {
	if (galaxy === null) return;
	for (const node of galaxy.nodes) {
		if (node.returningFrom === undefined) continue;
		const t = Math.min(1, (seconds - node.returningAt) / RETURN_SECONDS);
		const ease = 1 - Math.pow(1 - t, 3);
		const from = node.returningFrom;
		const to = node.returningTo;
		const at = spiralLeg(from, to, ease, RETURN_SECONDS);
		node.x = at.x;
		node.y = at.y;
		node.z = at.z;
		// 水滴形 on the way home: the same sin curve, so entry and exit match.
		// 变回原形: the drop relaxes as it lands instead of arriving still stretched.
		node.agentStretch = Math.sin(Math.PI * t) * 0.55;
		recordAgentTrail(node, seconds);
		if (t >= 1) {
			node.agentTail = 0;
			node.agentTrail = undefined;
			node.agentStretch = 0;
			node.agentBusy = undefined;
			node.agentQuietSince = undefined;
			node.agentSeenUpdatedAt = undefined;
			node.returningFrom = undefined;
			node.returningTo = undefined;
			node.returningAt = undefined;
			node.seat = undefined;
			delete node.agentBusy;
		}
	}
}


/**
 * 拖尾 history. The array starts EMPTY when a flight begins and every sample is a position the body
 * has already occupied, so the drawn path can only ever trail behind it — a tail can never appear
 * before the body, and nothing survives from a previous flight.
 */
const AGENT_TRAIL_KEEP_SECONDS = 3;

function recordAgentTrail(node, seconds) {
	// 尾焰生成时间延后: nothing is recorded before the body is on the lane, nor in its first
	// AGENT_TAIL_DELAY seconds there. A rebuilt node loses the stamp, so adopt one lazily —
	// otherwise the recorder would bail forever and the tail would never appear.
	if (node.agentLaneSince === undefined) {
		if (node.agentOrbit !== true) return;
		node.agentLaneSince = seconds;
	}
	if (seconds - node.agentLaneSince < AGENT_TAIL_DELAY) return;
	const trail = node.agentTrail ?? (node.agentTrail = []);
	const last = trail[trail.length - 1];
	if (last === undefined || Math.hypot(node.x - last.x, node.y - last.y, node.z - last.z) > 0.002) {
		trail.push({ x: node.x, y: node.y, z: node.z, t: seconds });
	}
	// Bound the buffer by age: the renderer picks its own window, this only stops it growing.
	while (trail.length > 2 && trail[0].t < seconds - AGENT_TRAIL_KEEP_SECONDS) trail.shift();
}

/**
 * 螺旋飞行: one leg of an agent's trip, solved as a body under drag with conserved angular momentum.
 *   r(t)  = r0 · e^(λt)              λ > 0 climbs out, λ < 0 spirals home
 *   θ'(t) = L / r²                   so it sweeps faster where the radius is small
 * The direction rolls on the great-circle plane through both endpoints and lands exactly on `to`.
 * @returns `{ x, y, z }` at progress `t` (0…1 over `seconds`).
 */
function spiralLeg(from, to, t, seconds) {
	const radiusFrom = Math.hypot(from.x, from.y, from.z);
	const radiusTo = Math.hypot(to.x, to.y, to.z);
	if (!(radiusFrom > 1e-3) || !(radiusTo > 1e-3) || seconds <= 0 || Math.abs(Math.log(radiusTo / radiusFrom)) < 1e-6) {
		// No usable direction or no radial travel: a straight ease is the only sensible answer.
		return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t, z: from.z + (to.z - from.z) * t };
	}
	const lambda = Math.log(radiusTo / radiusFrom) / seconds;
	const radius = radiusFrom * Math.exp(lambda * t * seconds);
	const fromDir = normalise(from);
	const toDir = normalise(to);
	const dot = Math.max(-1, Math.min(1, fromDir.x * toDir.x + fromDir.y * toDir.y + fromDir.z * toDir.z));
	const total = Math.acos(dot);
	// Normalised sweep: the ∫e^(∓2λt) from 0 to t over the same integral to `seconds`.
	const spread = 1 - Math.exp(-2 * lambda * t * seconds);
	const spreadEnd = 1 - Math.exp(-2 * lambda * seconds) || 1;
	const sweep = spread / spreadEnd;
	let dir = fromDir;
	if (total > 1e-4) {
		const cross = { x: fromDir.y * toDir.z - fromDir.z * toDir.y, y: fromDir.z * toDir.x - fromDir.x * toDir.z, z: fromDir.x * toDir.y - fromDir.y * toDir.x };
		const crossLength = Math.hypot(cross.x, cross.y, cross.z);
		if (crossLength > 1e-6) {
			const n = { x: cross.x / crossLength, y: cross.y / crossLength, z: cross.z / crossLength };
			const side = { x: n.y * fromDir.z - n.z * fromDir.y, y: n.z * fromDir.x - n.x * fromDir.z, z: n.x * fromDir.y - n.y * fromDir.x };
			const phi = total * sweep;
			dir = {
				x: fromDir.x * Math.cos(phi) + side.x * Math.sin(phi),
				y: fromDir.y * Math.cos(phi) + side.y * Math.sin(phi),
				z: fromDir.z * Math.cos(phi) + side.z * Math.sin(phi)
			};
		}
	}
	return { x: dir.x * radius, y: dir.y * radius, z: dir.z * radius };
}

/** Unit vector of a point, safe at the origin. */
function normalise(point) {
	const length = Math.hypot(point.x, point.y, point.z) || 1;
	return { x: point.x / length, y: point.y / length, z: point.z / length };
}


/**
 * 起步点随机: the phase comes from a hash of the session id, then — when other agents are already
 * flying — it is nudged to the one of twelve slots whose nearest neighbour is furthest away, so two
 * starts can never land on the same point of the lane.
 */
function agentPhaseFor(node, peers = []) {
	const base = hash01(`agent-phase:${node.id ?? ""}`) * TAU;
	const taken = peers
		.filter((peer) => peer !== node && peer.id !== node.id)
		.map((peer) => peer.agentAngle ?? peer.agentPhase)
		.filter((angle) => typeof angle === "number");
	if (taken.length === 0) return base;
	const gapTo = (angle) => Math.min(...taken.map((other) => Math.abs(Math.atan2(Math.sin(angle - other), Math.cos(angle - other)))));
	let best = base;
	let bestGap = gapTo(base);
	for (let slot = 1; slot < 12; slot += 1) {
		const candidate = base + (slot / 12) * TAU;
		const gap = gapTo(candidate);
		if (gap > bestGap) {
			bestGap = gap;
			best = candidate;
		}
	}
	return best;
}

function orbitAgents(galaxy, seconds, shellRadius, now = Date.now(), speedScale = 1) {
	if (galaxy === null || !(shellRadius > 0)) return;
	const radius = shellRadius * AGENT_ORBIT;
	for (const node of galaxy.nodes) {
		if (node.running !== true || node.launchFrom !== undefined) continue;
		const { u, v } = agentPlane(node);
		// The phase comes from the node's index, spread by the golden angle — a hash of the id
		// put two agents 0.004 rad apart when their ids ended in the same letter.
		if (node.agentPhase === undefined) node.agentPhase = agentPhaseFor(node, galaxy.nodes);
		// 忙碌程度: drives both how fast it laps and how bright its pulse is.
		const raw = agentBusyness(node, now);
		// Low-passed: `updatedAt` moves in bursts, and feeding the raw value to the tail's window made
		// it jump between lengths every second — the tail looked broken up. (Smoothing uses the frame
		// delta, which is computed a few lines down; the previous frame's is kept on the node.)
		const frameDelta = Math.min(0.1, Math.max(0, seconds - (node.agentAt ?? seconds)));
		// ~2.5 s time constant: brightness drifts with the work, it does not flicker with each write.
		const smoothing = node.agentBusy === undefined ? 1 : 1 - Math.exp(-frameDelta / 2.5);
		node.agentBusy = node.agentBusy === undefined ? raw : node.agentBusy + (raw - node.agentBusy) * smoothing;
		const busy = node.agentBusy;
		// The seat it leaves: the return animation glides back to this, not to a re-laid-out spot.
		if (node.seat === undefined) node.seat = { x: node.x, y: node.y, z: node.z };
		// 匀速: the angle is INTEGRATED, not recomputed as `phase + t · speed`. With a variable speed
		// (it follows 忙碌程度, which changes as the session writes) multiplying the whole elapsed
		// time made the body jump ahead or backwards whenever the rate changed — the uneven lap.
		if (node.agentAngle === undefined) node.agentAngle = node.agentPhase;
		const dt = Math.min(0.1, Math.max(0, seconds - (node.agentAt ?? seconds)));
		node.agentAt = seconds;
		const targetSpeed = AGENT_SPEED * (0.55 + 0.9 * busy) * speedScale;
		node.agentSpeed = node.agentSpeed === undefined ? targetSpeed : node.agentSpeed + (targetSpeed - node.agentSpeed) * Math.min(1, dt * 3);
		node.agentAngle += dt * node.agentSpeed;
		const angle = node.agentAngle;
		// 软体/屋顶效果: the drop deforms with ACCELERATION — a body that starts moving, turns or speeds
		// up stretches along its motion; a steady cruise relaxes back to round.
		// A rebuild can drop the previous position for one frame. Treating that as "speed 0" produced a
		// huge acceleration spike, which snapped the drop — that was the flicker. With no previous
		// frame the shape keeps its current value, and every change is slew-limited.
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		node.x = (u.x * cos + v.x * sin) * radius;
		node.y = (u.y * cos + v.y * sin) * radius;
		node.z = (u.z * cos + v.z * sin) * radius;
		node.agentOrbit = true;
		// The shape is measured AFTER the move: comparing the previous position with the new one is the
		// only way to see real speed and acceleration. (Measured before it, every frame read 0 and the
		// drop never deformed.)
		// Vector acceleration, not just |Δspeed|: a body circling at a constant speed is still
		// accelerating towards the centre, which is what keeps the drop softly stretched on the lane.
		const havePrevious = node.agentPrev !== undefined && node.agentVel !== undefined && dt > 0;
		const velocityOf = (to, from) => ({
			x: (to.x - from.x) / dt,
			y: (to.y - from.y) / dt,
			z: (to.z - from.z) / dt
		});
		let accel = 0;
		if (dt > 0) {
			const vel = node.agentPrev === undefined ? { x: 0, y: 0, z: 0 } : velocityOf(node, node.agentPrev);
			if (havePrevious) accel = Math.hypot(vel.x - node.agentVel.x, vel.y - node.agentVel.y, vel.z - node.agentVel.z) / dt;
			node.agentVel = vel;
		}
		const current = node.agentStretch ?? 0.06;
		const targetStretch = havePrevious ? 0.06 + 0.94 * Math.min(1, accel / AGENT_ACCEL_SOFT) : current;
		// Hard ceiling as well as a time-based rate: a long frame (or a paused tab) must not allow a
		// big shape jump in one step.
		const slew = Math.min(0.08, Math.max(0.02, dt * 2.5));
		node.agentStretch = current + Math.max(-slew, Math.min(slew, targetStretch - current));
			node.agentTail = Math.min(1, (node.agentTail ?? 0) + dt / AGENT_TAIL_GROW);
		// Recorded last, so the newest sample is exactly where the body is: the path can only extend
		// backwards from it.
		recordAgentTrail(node, seconds);
	}
}

/** Two unit vectors perpendicular to a spoke, for forks and twigs. */
function treeFrame(direction) {
	const tangent = normalize(cross(direction, Math.abs(direction.y) > 0.95 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 }));
	return { tangent, bitangent: cross(direction, tangent) };
}

/**
 * The 极简 web's silhouette: a ball squashed and leaned so it reads as an irregular
 * body (wide and tall, shallow, one shoulder raised) rather than a perfect sphere.
 * Shallow depth keeps the projected density even instead of piling up in the middle.
 */
function webBody(x, y, z, thickness) {
	const bulge = 1 + 0.22 * Math.sin(x * 3.1 + 0.6) * Math.cos(z * 2.3);
	return { x: x * 1.18 * bulge, y: (y * 1.24 + x * 0.24) * Math.min(1.4, thickness), z: z * 0.62 * bulge };
}

/** Cells per cube edge: at least 2, enough that side³ holds every sun. */
function cubeSide(count) {
	return Math.max(2, Math.ceil(Math.cbrt(Math.max(1, count))));
}

/** Interleave the bits of a cell's x/y/z (Z-order), so a run of consecutive codes is a compact block. */
function mortonCode(x, y, z) {
	let code = 0;
	for (let bit = 0; bit < 10; bit += 1) code += (((x >> bit) & 1) + ((y >> bit) & 1) * 2 + ((z >> bit) & 1) * 4) * 8 ** bit;
	return code;
}

/**
 * 方阵: every star (suns and conversations alike) on one side³ lattice filling the
 * cube. Cells are walked in Z-order and each workspace takes a consecutive run, so
 * a workspace reads as a solid block of the cube with its sun in the middle of it.
 * @returns cells per edge, for the dust grid.
 */
function latticeCube(nodes, folders, thickness) {
	const order = [];
	const bySun = new Map(folders.map((folder) => [folder.id, []]));
	const loose = [];
	for (const node of nodes) {
		if (node.kind !== "session") continue;
		(bySun.get(node.folderId) ?? loose).push(node);
	}
	for (const folder of folders) {
		const members = bySun.get(folder.id).sort((left, right) => right.updatedAt - left.updatedAt);
		const middle = Math.floor(members.length / 2);
		order.push(...members.slice(0, middle), folder, ...members.slice(middle));
	}
	order.push(...loose);
	const side = cubeSide(order.length);
	const cells = [];
	for (let z = 0; z < side; z += 1) for (let y = 0; y < side; y += 1) for (let x = 0; x < side; x += 1) cells.push([x, y, z]);
	cells.sort((left, right) => mortonCode(...left) - mortonCode(...right));
	const cell = (2 * CUBE_HALF) / (side - 1);
	const lift = Math.min(1.5, thickness);
	order.forEach((node, index) => {
		const [x, y, z] = cells[Math.min(cells.length - 1, Math.floor(((index + 0.5) * cells.length) / order.length))];
		node.x = x * cell - CUBE_HALF;
		node.y = (y * cell - CUBE_HALF) * lift;
		node.z = z * cell - CUBE_HALF;
	});
	return side;
}

/** 太阳系's orbital pace: ω = K / r^1.5, set so the inner planet laps in about 42 s. */
const SYSTEM_KEPLER = 0.026;

/** 太阳系: the innermost and outermost planetary orbits, in galaxy units. */
const SYSTEM_INNER = 0.3;
const SYSTEM_OUTER = 1.02;

function spiralRadius(t) {
	const share = Math.max(0, Math.min(1, t));
	return Math.sqrt(SPIRAL_INNER * SPIRAL_INNER + (SPIRAL_OUTER * SPIRAL_OUTER - SPIRAL_INNER * SPIRAL_INNER) * share);
}

/** Arms wind 1.8x the twist per unit radius, so each arm sweeps ~280° and the outer turns cover every side of the disc. */
function spiralAngle(arm, arms, radius, twist) {
	return (arm / arms) * TAU + radius * 1.8 * (twist + (arm % 2 === 1 ? 0.42 : 0));
}

/**
 * Split every spiral arm into one stretch per folder, longer for busier folders, so
 * a workspace's conversations trail along its arm instead of balling up at its sun.
 * @param counts - session count per folder, in folder order.
 * @param arms - arm count; folder `i` rides arm `i % arms`.
 * @returns `[{ t0, t1 }]` per folder, as shares of its arm (0 = inner end).
 */
function spiralSegments(counts, arms) {
	const weights = counts.map((count) => 0.6 + Math.pow(Math.max(0, count), 0.8));
	const totals = new Array(arms).fill(0);
	weights.forEach((weight, index) => {
		totals[index % arms] += weight;
	});
	const cursor = new Array(arms).fill(0);
	return weights.map((weight, index) => {
		const arm = index % arms;
		const t0 = cursor[arm] / totals[arm];
		cursor[arm] += weight;
		return { t0, t1: cursor[arm] / totals[arm] };
	});
}

/**
 * 双螺旋: split the workspaces between the two strands so both strands carry about the
 * same number of *stars*, not the same number of workspaces — one workspace with forty
 * conversations weighs as much as forty small ones, which is why alternating by index
 * left one strand thin. Greedy: heaviest first, each to the lighter strand. Inside a
 * strand the workspaces keep their order and are spread evenly along it, so both
 * strands fill from end to end.
 *
 * @param folders - the galaxy's workspaces, each with its `count` of conversations.
 * @returns `[{ strand, t }]` per folder, in folder order.
 */
/** 记忆库's numbers, so the galaxy can borrow the look: three arms, one swirl, a core ring. */
const MEMORY_LAYOUT_ARMS = 3;
const MEMORY_LAYOUT_SWIRL = 2.2;
/** Dots the memory library puts on one call ring; 极简 uses the same ring size. */
const MEMORY_DOTS_PER_RING = 16;

/**
 * 极简（记忆库样式）: the memory library keeps *two* ranks — instruction files in the core,
 * skills on three arms, each skill's calls in a small ring around it. The galaxy has the
 * same two levels once its calls and skills are read as conversations and workspaces:
 * workspaces ride the arms (ranked by how many conversations they hold, dealt round-robin
 * across three arms, the way skills are ranked by call count) and each workspace's
 * conversations sit in a small ring around it. Nothing belongs in the core.
 *
 * @param nodes - every graph node.
 * @returns `{ arms, folder: Map<id, {arm, depth}>, rings }`.
 */
/**
 * 星环: which ring a workspace belongs to, and where on it.
 *
 * Rings are dealt **by weight**, snake-fashion (0,1,2,3,3,2,1,0…): a workspace with eighty
 * conversations counts as much as eight small ones, so no ring ends up with one straggler
 * while its neighbour carries a hundred bodies. Each ring's workspaces then take an even
 * seat around the circle, so a whole ring is always populated.
 *
 * @param folders - every workspace node.
 * @returns `{ ring: Map<id, number>, seat: Map<id, { index, total }> }`.
 */
function ringPlan(folders) {
	const ring = new Map();
	const seat = new Map();
	const byWeight = folders
		.slice()
		.sort((left, right) => (right.count ?? 0) - (left.count ?? 0) || String(left.id).localeCompare(String(right.id)));
	const perRing = RING_RADII.map(() => 0);
	const last = RING_RADII.length - 1;
	byWeight.forEach((folder, order) => {
		const cycle = Math.floor(order / RING_RADII.length);
		const step = order % RING_RADII.length;
		const index = cycle % 2 === 0 ? step : last - step;
		ring.set(folder.id, index);
		seat.set(folder.id, { index: perRing[index], total: 0 });
		perRing[index] += 1;
	});
	for (const [id, entry] of seat) seat.set(id, { index: entry.index, total: perRing[ring.get(id)] ?? 1 });
	return { ring, seat };
}

function memoryPlan(nodes) {
	const folders = nodes
		.filter((node) => node.kind === "folder")
		.slice()
		.sort((left, right) => (right.count ?? 0) - (left.count ?? 0) || String(left.id).localeCompare(String(right.id)));
	const rings = Math.max(1, Math.ceil(folders.length / MEMORY_LAYOUT_ARMS));
	const map = new Map();
	folders.forEach((folder, index) => {
		const rank = Math.floor(index / MEMORY_LAYOUT_ARMS);
		map.set(folder.id, { arm: index % MEMORY_LAYOUT_ARMS, depth: (rank + 0.6) / rings });
	});
	return { arms: MEMORY_LAYOUT_ARMS, folder: map, rings };
}

function helixPlan(folders) {
	const weight = folders.map((folder) => 1 + Math.max(0, folder.count ?? 0));
	const load = [0, 0];
	const strandOf = new Array(folders.length);
	const heaviest = folders.map((_, index) => index).sort((left, right) => weight[right] - weight[left] || left - right);
	for (const index of heaviest) {
		const strand = load[0] <= load[1] ? 0 : 1;
		strandOf[index] = strand;
		load[strand] += weight[index];
	}
	const plan = new Array(folders.length);
	for (const strand of [0, 1]) {
		const members = heaviest.filter((index) => strandOf[index] === strand).sort((left, right) => left - right);
		members.forEach((index, position) => {
			plan[index] = { strand, t: members.length <= 1 ? 0.5 : (position + 0.5) / members.length };
		});
	}
	return plan;
}

/**
 * One folder position for a given silhouette.
 *
 * Every layout keeps the same contract — the outermost body sits near radius 1 — so
 * the shell framing, picking, tracking and the dust layer all keep working without
 * knowing which shape is on screen.
 *
 * @param layout - one of {@link LAYOUTS}.
 * @param index - folder ordinal.
 * @param count - total folders, used to spread the sequence.
 * @param salt - re-roll seed.
 * @param folderId - id, for stable jitter.
 * @param shape - resolved shape numbers (`arms`, `twist`, `thickness`, `spread`).
 * @param segment - spiral only: the folder's `{ t0, t1 }` stretch of its arm (helix: its strand plan).
 * @param stars - this workspace's own star count (1 + its conversations), for layouts weighted by mass.
 * @returns position plus the resolved radius, arm/blot index and what its members need.
 */
function placeFolder(layout, index, count, salt, folderId, shape, segment, stars) {
	const jitter = hash01(`${folderId}:${salt}`) - 0.5;
	const jitterY = hash01(`${folderId}:h${salt}`) - 0.5;
	const { arms, twist, thickness } = shape;
	const lift = (scale) => jitterY * scale * thickness;

	if (layout === "memory") {
		// 极简: a workspace rides an arm exactly as a skill does — ranked by weight, dealt
		// across three arms, walking outward as the ranks fill.
		const seat = shape.memoryPlan?.folder.get(folderId) ?? { arm: index % MEMORY_LAYOUT_ARMS, depth: 0.6 };
		const arm = (seat.arm * TAU) / MEMORY_LAYOUT_ARMS;
		const angle = arm + seat.depth * MEMORY_LAYOUT_SWIRL + jitter * 0.48;
		const radius = 0.5 + 0.5 * seat.depth;
		return { x: Math.cos(angle) * radius, y: (hash01(`memory:${folderId}:y`) - 0.5) * 0.05, z: Math.sin(angle) * radius, radius, arm: seat.arm, angle, ring: undefined };
	}

	if (layout === "rings" || layout === "sphere") {
		// Clean concentric orbits: no arm twist at all, four rings deep. Ring and seat come from
		// `ringPlan` (dealt by weight, spread evenly), so every ring is filled.
		const ringIndex = shape.ringPlan?.ring.get(folderId) ?? index % RING_RADII.length;
		const seat = shape.ringPlan?.seat.get(folderId) ?? { index, total: Math.max(1, Math.ceil(count / RING_RADII.length)) };
		const angle = (seat.index / Math.max(1, seat.total)) * TAU + jitter * 0.06;
		if (layout === "sphere") {
			// 极简: the seat is an angle on this ring's own plane.
			const [u, v] = SPHERE_PLANES[ringIndex];
			const radius = SPHERE_RADIUS;
			return {
				x: (Math.cos(angle) * u[0] + Math.sin(angle) * v[0]) * radius,
				y: (Math.cos(angle) * u[1] + Math.sin(angle) * v[1]) * radius * Math.min(1.5, thickness),
				z: (Math.cos(angle) * u[2] + Math.sin(angle) * v[2]) * radius,
				radius,
				arm: ringIndex,
				angle,
				ring: ringIndex
			};
		}
		const radius = RING_RADII[ringIndex];
		return { x: Math.cos(angle) * radius, y: lift(0.02), z: Math.sin(angle) * radius, radius, arm: ringIndex, angle, ring: ringIndex };
	}

	if (layout === "field") {
		// 深空场: no structure at all — every body sits at its own depth, spread evenly
		// through a wide ball (cube-root radius, so the rim is no denser than the middle)
		// with the vertical axis eased in, which reads as a field rather than a cloud.
		// Golden-angle azimuths and stratified depth keep the suns spread evenly around
		// the ball (a handful of hashed azimuths clumps), while the radius still comes
		// from a hash so the filling looks scattered rather than geometric.
		const golden = Math.PI * (3 - Math.sqrt(5));
		const azimuth = index * golden + jitter * 1.2;
		const cosine = Math.max(-1, Math.min(1, 1 - (2 * (index + 0.5)) / Math.max(1, count) + jitterY * 0.18));
		const depth = hash01(`${folderId}:field:depth`);
		const ring = Math.sqrt(Math.max(0, 1 - cosine * cosine));
		const radius = 0.26 + 0.74 * Math.cbrt(depth);
		const flatten = 0.62 + 0.38 * Math.min(1.6, thickness);
		return {
			x: Math.cos(azimuth) * ring * radius,
			y: cosine * radius * flatten * 0.8,
			z: Math.sin(azimuth) * ring * radius,
			radius,
			arm: index % arms
		};
	}

	if (layout === "system") {
		// 太阳系: one planet per workspace, each on its own orbit between the inner and
		// outer band, phased by the golden angle so no two planets ever line up. Almost
		// coplanar — just enough inclination to read as 3D.
		const orbit = count <= 1 ? 0.5 : SYSTEM_INNER + ((SYSTEM_OUTER - SYSTEM_INNER) * index) / (count - 1);
		const angle = index * Math.PI * (3 - Math.sqrt(5)) + jitter * 0.5;
		const lift = Math.sin(index * 1.9 + jitter * 6) * 0.02 * Math.min(1.5, thickness);
		return { x: Math.cos(angle) * orbit, y: lift, z: Math.sin(angle) * orbit, radius: orbit, orbit, angle, arm: index % arms };
	}

	if (layout === "helix") {
		// Two strands climbing a cylinder; `segment` is the balanced strand plan, so the
		// stars are split by weight and each strand runs its own length end to end.
		const strand = segment?.strand ?? index % 2;
		const t = segment?.t ?? (count <= 1 ? 0.5 : index / (count - 1));
		const angle = t * TAU * HELIX_TURNS + strand * Math.PI + jitter * 0.05;
		const height = HELIX_HEIGHT * Math.max(0.6, Math.min(1.5, thickness));
		return { x: Math.cos(angle) * HELIX_RADIUS, y: (t - 0.5) * height, z: Math.sin(angle) * HELIX_RADIUS, radius: HELIX_RADIUS, arm: strand, t, strand, height };
	}

	if (layout === "web") {
		// Obsidian's 极简 force graph: busy suns nearer the middle, small ones further
		// out, all inside one lumpy body (see webBody).
		const share = count <= 1 ? 0 : index / (count - 1);
		const lift01 = 1 - 2 * hash01(`${folderId}:web${salt}`);
		const ring = Math.sqrt(Math.max(0, 1 - lift01 * lift01));
		const turn = index * Math.PI * (3 - Math.sqrt(5)) + jitter * 0.6;
		const radius = 0.16 + 0.56 * Math.sqrt(share);
		const point = webBody(Math.cos(turn) * ring * radius, lift01 * radius, Math.sin(turn) * ring * radius, thickness);
		return { ...point, radius, arm: index % arms };
	}

	if (layout === "plate") {
		// A solid cube of cells: side³ slots, the suns spread evenly through all of
		// them (stride sampling) so every face and the middle are populated.
		const side = cubeSide(count);
		const slots = side ** 3;
		const slot = Math.min(slots - 1, Math.floor(((index + 0.5) * slots) / Math.max(1, count)));
		const cell = (2 * CUBE_HALF) / (side - 1);
		const x = (slot % side) * cell - CUBE_HALF;
		const y = (Math.floor(slot / side) % side) * cell - CUBE_HALF;
		const z = Math.floor(slot / (side * side)) * cell - CUBE_HALF;
		return { x, y: y * Math.min(1.5, thickness), z, radius: Math.hypot(x, y, z), arm: index % arms, cell };
	}

	if (layout === "tree") {
		// 星树: one limb per workspace, fanned off a main limb, and its sun sits lower
		// on that limb the more stars it carries — a heavy limb is long, a light one is
		// a short twig, so the tree reads as mass rather than as equal spokes.
		const fallbackDirection = treeDirection(index % treeSectors(arms), treeSectors(arms));
		const limb = shape.treePlan?.[index] ?? { direction: fallbackDirection, ...treeFrame(fallbackDirection), sector: index % treeSectors(arms) };
		const share = Math.min(1, Math.sqrt(Math.max(1, stars ?? 1) / Math.max(1, shape.treeMax ?? 1)));
		// Every ray leaves the centre: a light workspace's sun sits close to it, a heavy one's
		// further out, and the conversations continue along the same ray.
		const radius = 0.34 + 0.42 * share;
		const swing = (0.02 + 0.03 * share) * Math.min(1.6, thickness);
		const phase = hash01(`${folderId}:twig${salt}`) * TAU;
		const sideways = Math.cos(phase) * swing;
		const sideways2 = Math.sin(phase) * swing;
		return {
			x: limb.direction.x * radius + limb.tangent.x * sideways + limb.bitangent.x * sideways2,
			y: limb.direction.y * radius + limb.tangent.y * sideways + limb.bitangent.y * sideways2,
			z: limb.direction.z * radius + limb.tangent.z * sideways + limb.bitangent.z * sideways2,
			radius,
			arm: limb.sector,
			direction: limb.direction,
			tangent: limb.tangent,
			bitangent: limb.bitangent,
			phase
		};
	}

	// Spiral: suns sit in the middle of their own stretch of an arm.
	const arm = index % arms;
	const stretch = segment ?? spiralSegments(new Array(count).fill(1), arms)[index];
	const radius = spiralRadius((stretch.t0 + stretch.t1) / 2);
	const angle = spiralAngle(arm, arms, radius, twist) + jitter * 0.04;
	return { x: Math.cos(angle) * radius, y: lift(0.04), z: Math.sin(angle) * radius, radius, arm, t0: stretch.t0, t1: stretch.t1 };
}

/** Sum of two uniforms, centred: a soft-edged spread in [-1, 1]. */
function tri(a, b) {
	return a + b - 1;
}

/**
 * One conversation around its workspace sun, following the silhouette: along the arm,
 * the ring, the strand or the branch; around each planet in the system; the field carries no skeleton at all
 * beams; thrown wide through a ball for the web; inside its own small cube for the plate.
 *
 * @param layout - one of {@link LAYOUTS}.
 * @param hub - the sun's {@link placeFolder} result (before re-centring).
 * @param members - sessions of that sun.
 * @param u - seven independent uniforms for this star.
 * @param shape - resolved shape numbers.
 * @returns position before re-centring.
 */
function placeSession(layout, hub, members, u, shape, seat) {
	const { arms, twist, thickness, spread } = shape;
	const reach = Math.sqrt(Math.max(1, members));
	const loose = Math.min(spread, 1.8);

	if (layout === "memory") {
		// 极简: a conversation is a call dot, on exactly the memory library's ring — sixteen
		// to a ring, rings at 0.05 and 0.085, then the same 0.07 spacing outward when a
		// workspace holds more conversations than the memory map ever draws. The memory map
		// caps at sixteen and reports the rest; the galaxy has to draw every conversation,
		// so it keeps stacking rings instead of hiding them.
		const ordinal = seat?.index ?? 0;
		const ringIndex = Math.floor(ordinal / MEMORY_DOTS_PER_RING);
		const radius = 0.05 + 0.035 * (ringIndex % 2) + 0.07 * Math.floor(ringIndex / 2);
		const spin = u[1];
		const angle = ((ordinal % MEMORY_DOTS_PER_RING) / MEMORY_DOTS_PER_RING) * TAU + spin * 1.4;
		return {
			x: hub.x + Math.cos(angle) * radius,
			y: hub.y + (u[2] - 0.5) * 0.03,
			z: hub.z + Math.sin(angle) * radius
		};
	}

	if (layout === "rings" || layout === "sphere") {
		// A workspace's conversations fan over a wider arc than before, so a ring with three
		// workspaces no longer reads as three beads with long empty stretches between them.
		const length = (0.13 + 0.1 * reach) * loose;
		const angle = hub.angle + ((u[0] - 0.5) * 2 * length) / Math.max(0.2, hub.radius);
		// 星环's bodies ride *on* their ring line: the helix weave (see orbitRings) supplies
		// the visible spread, so the radial scatter here stays tiny.
		const radius = hub.radius + tri(u[1], u[2]) * (0.012 + 0.002 * reach) * loose;
		if (layout === "sphere") {
			// Along the ring, a hair inside it, so the ring itself stays legible.
			const [cu, cv] = SPHERE_PLANES[hub.ring] ?? SPHERE_PLANES[0];
			const along = angle;
			const radial = (SPHERE_RADIUS - 0.008 - tri(u[3], u[4]) * 0.012) / SPHERE_RADIUS;
			const point = (t) => [Math.cos(t) * cu[0] + Math.sin(t) * cv[0], Math.cos(t) * cu[1] + Math.sin(t) * cv[1], Math.cos(t) * cu[2] + Math.sin(t) * cv[2]];
			const [px, py, pz] = point(along);
			return { x: px * SPHERE_RADIUS * radial, y: py * SPHERE_RADIUS * Math.min(1.5, thickness) * radial, z: pz * SPHERE_RADIUS * radial };
		}
		const spread = 0.03;
		return { x: Math.cos(angle) * radius, y: hub.y + tri(u[3], u[4]) * spread * thickness, z: Math.sin(angle) * radius };
	}

	if (layout === "field") {
		// Each workspace is a small galaxy in the field: its conversations sit in a
		// loose 3D shell around the sun, sized by how many there are.
		const ring = u[0] * TAU;
		const cosine = u[1] * 2 - 1;
		const radius = (0.045 + 0.022 * reach) * loose;
		const planar = Math.sqrt(Math.max(0, 1 - cosine * cosine));
		return {
			x: hub.x + Math.cos(ring) * planar * radius,
			y: hub.y + cosine * radius * 0.8,
			z: hub.z + Math.sin(ring) * planar * radius
		};
	}

	if (layout === "system") {
		// Moons sit on a small shell around the planet — a little 星壳, not a flat disc, so
		// each planet reads as a cluster of stars from any camera angle. Two shells keep a
		// busy workspace from crowding into one dotted ring.
		const shell = u[2] < 0.62 ? 0 : 1;
		const turn = u[0] * TAU;
		const cosine = u[1] * 2 - 1;
		// Held inside the gap to the next orbit: with many workspaces the orbits are barely
		// 0.05 apart, and a wider shell would smear into the neighbouring planet's.
		const radius = Math.min(0.14, (0.05 + 0.02 * reach) * loose, (shape.orbitGap ?? 0.3) * 1.6) * (shell === 0 ? 1 : 1.45);
		const planar = Math.sqrt(Math.max(0, 1 - cosine * cosine));
		return {
			x: hub.x + Math.cos(turn) * planar * radius,
			y: hub.y + cosine * radius,
			z: hub.z + Math.sin(turn) * planar * radius
		};
	}

	if (layout === "helix") {
		const t = Math.max(0, Math.min(1, hub.t + (u[0] - 0.5) * 2 * (0.02 + 0.008 * reach) * loose));
		const angle = t * TAU * HELIX_TURNS + hub.strand * Math.PI;
		const radius = HELIX_RADIUS + tri(u[1], u[2]) * 0.04 * loose;
		return { x: Math.cos(angle) * radius, y: (t - 0.5) * hub.height + tri(u[3], u[4]) * 0.02, z: Math.sin(angle) * radius };
	}

	if (layout === "web") {
		// Each conversation lands most of the way from its sun to a random spot of the
		// body, so the stars fill the volume evenly (as a settled force graph does) and
		// links from every sun cross it as one open web; a small sun keeps its stars closer.
		const pull = Math.min(0.88, 0.55 + 0.04 * reach) * Math.min(1.15, loose);
		const [bx, by, bz] = onSphere(u[1], u[2], 0.95 * Math.cbrt(u[0]));
		const spot = webBody(bx, by, bz, thickness);
		const [fx, fy, fz] = onSphere(u[3], u[4], 0.05 * u[5]);
		return { x: hub.x + (spot.x - hub.x) * pull + fx, y: hub.y + (spot.y - hub.y) * pull + fy, z: hub.z + (spot.z - hub.z) * pull + fz };
	}

	if (layout === "plate") {
		// Each sun's conversations fill a small cube of their own, snapped to a 3×3×3
		// sub-grid so the cell reads as a block, not a puff.
		const half = Math.min(hub.cell * 0.32, (0.035 + 0.012 * reach) * loose);
		const snap = (value) => (Math.round(value * 2) / 2) * half * 2 + (value - 0.5) * half * 0.18;
		return { x: hub.x + snap(u[0]) - half, y: hub.y + (snap(u[1]) - half) * Math.min(1.5, thickness), z: hub.z + snap(u[2]) - half };
	}

	if (layout === "tree") {
		// The sun sits partway out on its limb and its conversations run on past it to the
		// tip, so a branch is a limb of length, not a puff around one star. The tube widens
		// with radius, and every third star takes a twig: a wider lateral throw at its own
		// angle, which is what fills the sky between neighbouring limbs.
		const from = Math.min(0.98, hub.radius + 0.04);
		const radius = Math.min(1.05, from + (1.05 - from) * Math.pow(u[0], 0.7));
		const twig = u[6] < 0.34;
		const turn = hub.phase + (twig ? 0.9 + u[3] * 1.7 : u[1] * 0.5);
		const width = (0.03 + 0.085 * radius) * thickness * loose * (twig ? 1.7 : 1) * (0.3 + 0.7 * Math.sqrt(u[2]));
		const side = { x: hub.tangent.x * Math.cos(turn) + hub.bitangent.x * Math.sin(turn), y: hub.tangent.y * Math.cos(turn) + hub.bitangent.y * Math.sin(turn), z: hub.tangent.z * Math.cos(turn) + hub.bitangent.z * Math.sin(turn) };
		return { x: hub.direction.x * radius + side.x * width, y: hub.direction.y * radius + side.y * width, z: hub.direction.z * radius + side.z * width };
	}

	// Spiral: anywhere along the sun's stretch, a little past both ends, with the
	// arm widening outward and one star in ten straying into the gaps between arms.
	const span = hub.t1 - hub.t0;
	const pad = Math.min(0.04, span * 0.15);
	const along = spiralRadius(hub.t0 - pad + (span + 2 * pad) * u[0]);
	const stray = u[6] < 0.1 ? 2 : 1;
	const width = (0.05 + 0.1 * along) * spread * stray;
	// Capped just past the arm's end: one far straggler would set the extent and so shrink the whole disc inside the shell.
	const radius = Math.max(0.12, Math.min(SPIRAL_OUTER * 1.06, along + tri(u[1], u[2]) * width));
	const angle = spiralAngle(hub.arm, arms, along, twist) + (u[3] - 0.5) * 0.16;
	return {
		x: Math.cos(angle) * radius,
		y: tri(u[4], u[5]) * (0.07 + 0.06 * along) * thickness,
		z: Math.sin(angle) * radius
	};
}

/**
 * One dust grain for a given silhouette.
 *
 * Folders are too few to describe a shape on their own (fifteen points cannot read
 * as a cube), so the haze carries the volume: a box, a shell, annuli, strands,
 * blobs, a sheet or spokes. Spiral keeps its own arm lanes elsewhere.
 *
 * @param layout - one of {@link LAYOUTS}.
 * @param index - grain ordinal.
 * @param salt - re-roll seed.
 * @param shape - resolved shape numbers.
 * @returns position.
 */
function placeDust(layout, index, salt, shape) {
	const streams = [
		hash01(`${layout}:${index}:${salt}:a`),
		hash01(`${layout}:${index}:${salt}:bb`),
		hash01(`${layout}:${index}:${salt}:ccc`),
		hash01(`${layout}:${index}:${salt}:dddd`),
		hash01(`${layout}:${index}:${salt}:eeeee`),
		hash01(`${layout}:${index}:${salt}:ffffff`)
	];
	let cursor = 0;
	const rnd = () => streams[cursor++ % streams.length];
	const { arms, thickness } = shape;
	const thin = (scale) => (rnd() - 0.5) * scale * thickness;

	if (layout === "field") {
		const ring = rnd() * TAU;
		const cosine = rnd() * 2 - 1;
		const planar = Math.sqrt(Math.max(0, 1 - cosine * cosine));
		const radius = 0.3 + 0.7 * Math.cbrt(rnd());
		return { x: Math.cos(ring) * planar * radius, y: cosine * radius * 0.8, z: Math.sin(ring) * planar * radius };
	}
	if (layout === "system") {
		// A third of the grains light the sun at the centre; the rest are zodiacal dust
		// lying in the ecliptic with the planets.
		const angle = rnd() * TAU;
		if (rnd() < 0.34) {
			// The sun is a ball, not a fried egg: cube-root radius so the volume is even.
			const lift = rnd() * 2 - 1;
			const ring = Math.sqrt(Math.max(0, 1 - lift * lift));
			const radius = Math.cbrt(rnd()) * 0.15;
			return { x: Math.cos(angle) * ring * radius, y: lift * radius * 0.92, z: Math.sin(angle) * ring * radius };
		}
		const radius = 0.24 + rnd() * 0.82;
		return { x: Math.cos(angle) * radius, y: (rnd() - 0.5) * 0.02 * thickness, z: Math.sin(angle) * radius };
	}
	if (layout === "helix") {
		const strand = rnd() > 0.5 ? 1 : 0;
		const t = rnd();
		const angle = t * TAU * HELIX_TURNS + strand * Math.PI;
		const radius = HELIX_RADIUS + (rnd() - 0.5) * 0.06;
		return { x: Math.cos(angle) * radius, y: (t - 0.5) * HELIX_HEIGHT * Math.max(0.6, Math.min(1.5, thickness)), z: Math.sin(angle) * radius };
	}
	if (layout === "rings") {
		const ring = Math.floor(rnd() * RING_RADII.length);
		const radius = RING_RADII[ring] + (rnd() - 0.5) * 0.05;
		const angle = rnd() * TAU;
		return { x: Math.cos(angle) * radius, y: thin(0.03), z: Math.sin(angle) * radius };
	}
	if (layout === "web") {
		const [x, y, z] = onSphere(rnd(), rnd(), 0.85 * Math.cbrt(rnd()));
		return webBody(x, y, z, thickness);
	}
	if (layout === "plate") {
		// Haze along the cube's grid lines (the same lattice the stars sit on): two
		// coordinates on a grid plane, one free.
		const side = Math.min(12, shape.cube ?? 4);
		const grid = () => (Math.floor(rnd() * side) / (side - 1)) * 2 * CUBE_HALF - CUBE_HALF;
		const free = (rnd() * 2 - 1) * CUBE_HALF;
		const axis = Math.floor(rnd() * 3) % 3;
		const a = grid();
		const b = grid();
		const point = axis === 0 ? { x: free, y: a, z: b } : axis === 1 ? { x: a, y: free, z: b } : { x: a, y: b, z: free };
		return { x: point.x, y: point.y * Math.min(1.5, thickness), z: point.z };
	}
	if (layout === "tree") {
		// Haze follows the same limbs the stars do, so the tree has bark, not just dots.
		const sectors = treeSectors(arms);
		const limbs = shape.treeLimbs ?? [];
		const picked = limbs.length === 0 ? null : limbs[Math.floor(rnd() * limbs.length) % limbs.length];
		const sector = treeDirection(Math.floor(rnd() * sectors), sectors);
		const axis = picked ?? { direction: sector, ...treeFrame(sector) };
		const radius = 0.18 + rnd() * 0.86;
		const turn = rnd() * TAU;
		const width = rnd() * (0.032 + 0.095 * radius) * thickness;
		return {
			x: axis.direction.x * radius + (axis.tangent.x * Math.cos(turn) + axis.bitangent.x * Math.sin(turn)) * width,
			y: axis.direction.y * radius + (axis.tangent.y * Math.cos(turn) + axis.bitangent.y * Math.sin(turn)) * width,
			z: axis.direction.z * radius + (axis.tangent.z * Math.cos(turn) + axis.bitangent.z * Math.sin(turn)) * width
		};
	}
	const radius = Math.pow(rnd(), 0.55) * 1.02;
	const angle = rnd() * TAU;
	return { x: Math.cos(angle) * radius, y: thin(0.04 + radius * 0.06), z: Math.sin(angle) * radius };
}

/**
 * Faint structural lines that name the silhouette: rings, a wireframe shell, two
 * strands, a box, a sheet, spokes, or nothing for the spiral (its arms already read).
 *
 * @param layout - one of {@link LAYOUTS}.
 * @param offset - the galaxy's re-centring shift and scale (`galaxy.offset`), so the guides sit on the body.
 * @returns array of polylines in world space.
 */
function layoutGuides(layout, offset, arms, orbits) {
	const lines = layoutGuideLines(layout, arms, orbits);
	const ox = offset?.x ?? 0;
	const oy = offset?.y ?? 0;
	const oz = offset?.z ?? 0;
	const scale = offset?.scale ?? 1;
	if (ox === 0 && oy === 0 && oz === 0 && scale === 1) return lines;
	return lines.map((line) => line.map(([x, y, z]) => [(x - ox) * scale, (y - oy) * scale, (z - oz) * scale]));
}

function layoutGuideLines(layout, arms, orbits) {
	const ring = (radius, segments = 96) => {
		const points = [];
		for (let i = 0; i <= segments; i += 1) {
			const angle = (i / segments) * TAU;
			points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
		}
		return points;
	};

	if (layout === "rings") return RING_RADII.map((radius) => ring(radius));
	if (layout === "sphere") {
		// The skeleton *is* the rings: one polyline per plane.
		return SPHERE_PLANES.map(([u, v]) => {
			const points = [];
			for (let step = 0; step <= 96; step += 1) {
				const t = (step / 96) * TAU;
				points.push([
					(Math.cos(t) * u[0] + Math.sin(t) * v[0]) * SPHERE_RADIUS,
					(Math.cos(t) * u[1] + Math.sin(t) * v[1]) * SPHERE_RADIUS,
					(Math.cos(t) * u[2] + Math.sin(t) * v[2]) * SPHERE_RADIUS
				]);
			}
			return points;
		});
	}
	if (layout === "plate") {
		// The cube's twelve edges.
		const h = CUBE_HALF;
		const lines = [];
		for (const a of [-h, h]) {
			for (const b of [-h, h]) {
				lines.push([[-h, a, b], [h, a, b]]);
				lines.push([[a, -h, b], [a, h, b]]);
				lines.push([[a, b, -h], [a, b, h]]);
			}
		}
		return lines;
	}
	if (layout === "field") {
		// A deep field has no skeleton: the scatter is the shape.
		return [];
	}
	if (layout === "system") {
		// One orbit line per planet, at the radius that planet was placed on.
		return (orbits ?? []).map((radius) => ring(radius, 128));
	}
	if (layout === "helix") {
		const strands = [];
		for (const strand of [0, 1]) {
			const points = [];
			for (let i = 0; i <= 120; i += 1) {
				const t = i / 120;
				const angle = t * TAU * HELIX_TURNS + strand * Math.PI;
				points.push([Math.cos(angle) * HELIX_RADIUS, (t - 0.5) * HELIX_HEIGHT, Math.sin(angle) * HELIX_RADIUS]);
			}
			strands.push(points);
		}
		return strands;
	}
	if (layout === "tree") {
		// The main limbs only: the fan of workspace limbs is drawn by the stars themselves.
		const sectors = treeSectors(arms);
		const lines = [];
		for (let sector = 0; sector < sectors; sector += 1) {
			const direction = treeDirection(sector, sectors);
			lines.push([[0, 0, 0], [direction.x, direction.y, direction.z]]);
		}
		return lines;
	}
	return [];
}

/** Dust speck radius: haze is finer than the lane. */
function dustSize(haze, index) {
	return haze ? 0.4 + hash01(`dust:${index}:s`) * 0.7 : 0.5 + hash01(`dust:${index}:s`) * 1.2;
}

/** No layout reaches past this radius, whatever the shape sliders say. */
const GALAXY_REACH = 1.5;

/**
 * Lay out every member for the chosen silhouette, in units where the outermost sun
 * sits near radius 1. Stars fill the inner ~0.7 of the shell (shell = 1.22·extent).
 *
 * Pure function of ids and counts: the same data always yields the same galaxy,
 * so the picture is stable across reloads and no solver has to run.
 *
 * @param graph - output of {@link buildGraph}.
 * @param seed - bump to re-roll jitter (the "re-layout" button).
 * @returns `{ nodes, links, dust, extent, offset }`.
 */
function createGalaxy(graph, seed, shape) {
	const salt = typeof seed === "number" ? seed : 1;
	const arms = Math.max(1, Math.min(4, Math.round(shape?.arms ?? SHAPE.arms)));
	const twist = Math.max(1, Math.min(9, shape?.twist ?? SHAPE.twist));
	const thickness = Math.max(0.15, Math.min(3, shape?.thickness ?? SHAPE.thickness));
	const spread = Math.max(0.3, Math.min(2.4, shape?.spread ?? SHAPE.spread));
	const layout = LAYOUTS.includes(shape?.layout) ? shape.layout : "spiral";
	const shapeNumbers = { arms, twist, thickness, spread };
	const nodes = graph.nodes;
	const folders = nodes.filter((node) => node.kind === "folder");
	// 太阳系 orbit spacing, known before anything is placed: a moon disc has to stay
	// inside the gap to the next orbit.
	if (layout === "system") shapeNumbers.orbitGap = folders.length > 1 ? (SYSTEM_OUTER - SYSTEM_INNER) / (folders.length - 1) : 0.32;
	// 极简 ranks conversations globally (by activity), so the plan is made once, before
	// any folder is placed.
	if (layout === "memory") shapeNumbers.memoryPlan = memoryPlan(nodes);
	if (layout === "rings" || layout === "sphere") shapeNumbers.ringPlan = ringPlan(folders);
	if (layout === "tree") {
		shapeNumbers.treeMax = Math.max(1, ...folders.map((folder) => folder.count ?? 1));
		shapeNumbers.treePlan = treePlan(folders, arms, salt);
	}
	// 极简 draws the memory library itself: its bodies already sit where the memory map puts
	// them, and re-placing them through a galaxy layout would be a second, different guess.
	// Only the extent/offset pass below runs, which is a uniform scale and translation.
	const keepPlaced = graph.fromMemory === true;
	const golden = Math.PI * (3 - Math.sqrt(5));
	const segments = layout === "spiral" && !keepPlaced ? spiralSegments(folders.map((folder) => folder.count), arms) : [];
	const strands = layout === "helix" ? helixPlan(folders) : [];
	const placements = new Map();

	folders.forEach((folder, index) => {
		if (keepPlaced) {
			// Positions come from the memory map; only the render size is ours to set.
			folder.size = 2.5 + Math.min(2.6, Math.sqrt(folder.count ?? 1) * 0.26);
			folder.arm = 0;
			return;
		}
		const placed = placeFolder(layout, index, folders.length, salt, folder.id, shapeNumbers, layout === "helix" ? strands[index] : segments[index], folder.count);
		placements.set(folder.id, { ...placed, members: folder.count });
		folder.x = placed.x;
		folder.y = placed.y;
		folder.z = placed.z;
		folder.arm = placed.arm;
		folder.discRadius = placed.radius;
		// 双螺旋 keeps which strand a workspace landed on (and where along it), so the
		// balance is checkable and its conversations can be attributed to a strand.
		folder.strand = placed.strand;
		folder.t = placed.t;
		// 星环: one colour per ring, so the ring a body rides is part of its identity.
		folder.ring = placed.ring;
		folder.ringBaseY = placed.y;
		folder.strandIndex = layout === "rings" ? (hash01(`${folder.id}:strand`) < 0.5 ? 0 : 1) : undefined;
		folder.hueIndex = layout === "rings" && Number.isFinite(placed.ring) ? placed.ring : folder.hueIndex;
		folder.hue = layout === "rings" && Number.isFinite(placed.ring) ? HUES[placed.ring % HUES.length] : folder.hue;
		folder.size = 2.5 + Math.min(2.6, Math.sqrt(folder.count) * 0.26);
	});

	// 极简: each conversation needs its ordinal inside its workspace — the memory library's
	// call dots are numbered within their skill.
	const ordinals = new Map();
	for (const node of nodes) {
		if (node.kind !== "session") continue;
		if (keepPlaced) {
			node.size = 0.85 + (node.recency ?? 0.5) * 0.6;
			node.arm = 0;
			continue;
		}
		const hub = placements.get(node.folderId);
		const u = hashStreams(`star|${node.id}|${salt}`, 7);
		node.size = 0.85 + node.recency * 0.6 + (node.running ? 0.28 : 0);
		if (hub === undefined) {
			const angle = u[0] * TAU;
			const radius = 0.35 + u[1] * 0.5;
			node.x = Math.cos(angle) * radius;
			node.z = Math.sin(angle) * radius;
			node.y = (u[2] - 0.5) * 0.08 * thickness;
			node.size = 1.05 + node.recency * 0.55;
			continue;
		}
		const placed = placeSession(layout, hub, hub.members, u, shapeNumbers, layout === "memory" ? { index: (ordinals.get(node.folderId) ?? 0) + (ordinals.set(node.folderId, (ordinals.get(node.folderId) ?? 0) + 1), 0) } : undefined);
		node.x = placed.x;
		node.y = placed.y;
		node.z = placed.z;
		node.arm = hub.arm;
		node.ring = hub.ring;
		// The weave needs a home height and a strand; hash them, so a body keeps its strand
		// for the whole session and the two helixes stay evenly filled.
		node.ringBaseY = node.y;
		node.strandIndex = u[5] < 0.5 ? 0 : 1;
		if (layout === "rings" && Number.isFinite(hub.ring)) {
			node.hueIndex = hub.ring;
			node.hue = HUES[hub.ring % HUES.length];
		}
	}
	if (layout === "plate") shapeNumbers.cube = latticeCube(nodes, folders, thickness);
	if (layout === "tree") shapeNumbers.treeLimbs = shapeNumbers.treePlan.map(({ direction, tangent, bitangent }) => ({ direction, tangent, bitangent }));

	// Off-disc shapes are not mass-symmetric (six branches, five blobs, a partly
	// filled grid), so the body would hang off the middle of the shell and gets
	// re-centred on its suns here. The spiral is centred on its core by construction
	// and must keep it: shifting a two-arm disc to its own midpoint halves it.
	let offsetX = 0;
	let offsetY = 0;
	let offsetZ = 0;
	if (layout !== "spiral" && layout !== "plate" && layout !== "system" && layout !== "rings" && folders.length > 0) {
		for (const folder of folders) {
			offsetX += folder.x;
			offsetY += folder.y;
			offsetZ += folder.z;
		}
		offsetX /= folders.length;
		offsetY /= folders.length;
		offsetZ /= folders.length;
		for (const node of nodes) {
			node.x -= offsetX;
			node.y -= offsetY;
			node.z -= offsetZ;
		}
	}

	// Wide spread or tall thickness can push stragglers far out; pull the whole body
	// (dust and guides too) back inside the reach the shell can still frame.
	let reach = 0;
	for (const node of nodes) reach = Math.max(reach, Math.hypot(node.x, node.y, node.z));
	const shrink = reach > GALAXY_REACH ? GALAXY_REACH / reach : 1;
	if (shrink !== 1) {
		for (const node of nodes) {
			node.x *= shrink;
			node.y *= shrink;
			node.z *= shrink;
		}
	}

	// Dust: the diffuse body of whatever shape is on screen. Rendered as sub-pixel
	// haze, never clickable. Spiral gets its arm lanes; every other layout samples
	// the same placement function, so the haze inherits the silhouette for free.
	const dust = [];
	// 记忆库 has no grains at all — one haze sprite behind the disc — so 极简 draws none.
	if (layout !== "spiral" && layout !== "memory") {
		// More grains than the disc needs: a cube or a shell has no arm to concentrate
		// the haze, so the volume only reads when it is dense enough to be continuous.
		for (let index = 0; index < 5600; index += 1) {
			const placed = placeDust(layout, index, salt, shapeNumbers);
			const haze = hash01(`dust:${index}:haze`) > 0.72;
			dust.push({
				x: (placed.x - offsetX) * shrink,
				y: (placed.y - offsetY) * shrink,
				z: (placed.z - offsetZ) * shrink,
				hue: HUES[index % HUES.length],
				alpha: haze ? 0.028 + hash01(`dust:${index}:a`) * 0.05 : 0.05 + hash01(`dust:${index}:a`) * 0.1,
				size: dustSize(haze, index)
			});
		}
	}
	for (let index = 0; layout === "spiral" && index < 3200; index += 1) {
		const arm = index % arms;
		const haze = hash01(`dust:${index}:haze`) > 0.72;
		const share = Math.pow(hash01(`dust:${index}:t`), 0.55);
		const radius = 0.06 + 1 * share;
		// Wobble the lane slightly so the arm has texture instead of a razor line.
		const lane = (hash01(`dust:${index}:lane`) - 0.5) * (haze ? 0.5 : 0.09);
		const angle = spiralAngle(arm, arms, radius, twist) + lane;
		dust.push({
			x: Math.cos(angle) * radius * shrink,
			z: Math.sin(angle) * radius * shrink,
			y: (hash01(`dust:${index}:y`) - 0.5) * (0.03 + radius * 0.07) * thickness * shrink,
			hue: HUES[(arm * 3 + (haze ? 1 : 0)) % HUES.length],
			alpha: haze ? 0.03 + hash01(`dust:${index}:a`) * 0.05 : 0.06 + hash01(`dust:${index}:a`) * 0.14,
			size: dustSize(haze, index)
		});
	}
	// Diffuse disc: faint grains between the arms so the galaxy reads as a
	// continuous sheet of stars rather than two isolated crescents.
	for (let index = 0; layout === "spiral" && index < 1100; index += 1) {
		const radius = Math.pow(hash01(`field:${index}:r`), 0.5) * 1.02;
		const angle = hash01(`field:${index}:a`) * TAU;
		dust.push({
			x: Math.cos(angle) * radius * shrink,
			z: Math.sin(angle) * radius * shrink,
			y: (hash01(`field:${index}:y`) - 0.5) * (0.04 + radius * 0.08) * thickness * shrink,
			hue: 252 + (hash01(`field:${index}:h`) - 0.5) * 70,
			alpha: 0.018 + hash01(`field:${index}:a2`) * 0.05,
			size: 0.5 + hash01(`field:${index}:s`) * 1
		});
	}

	// 太阳系's sun: a warm ball of grains at the origin, the body every orbit circles.
	// Brighter than the spiral's core dust, because here it is the subject.
	for (let index = 0; layout === "system" && index < 220; index += 1) {
		const angle = hash01(`sun:${index}:a`) * TAU;
		const lift = Math.acos(Math.max(-1, Math.min(1, 1 - 2 * hash01(`sun:${index}:y`))));
		const radius = Math.pow(hash01(`sun:${index}:r`), 2.2) * 0.12;
		const planar = Math.sin(lift);
		dust.push({
			x: Math.cos(angle) * planar * radius,
			z: Math.sin(angle) * planar * radius,
			y: Math.cos(lift) * radius,
			hue: 42 + (hash01(`sun:${index}:h`) - 0.5) * 10,
			alpha: 0.05 + hash01(`sun:${index}:a2`) * 0.08,
			size: 0.8 + hash01(`sun:${index}:s`) * 1.2
		});
	}

	// A faint scatter where the spiral arms converge, at half the old alpha: a bright
	// nucleus reads as a white blob sitting on top of the view. Spiral only: the other
	// layouts are re-centred on their stars, so grains fixed at the origin would
	// pile up in the middle of a shape that has nothing there.
	for (let index = 0; layout === "spiral" && index < 110; index += 1) {
		const angle = hash01(`core:${index}:a`) * TAU;
		const radius = Math.pow(hash01(`core:${index}:r`), 1.8) * 0.16;
		dust.push({
			x: Math.cos(angle) * radius,
			z: Math.sin(angle) * radius,
			y: (hash01(`core:${index}:y`) - 0.5) * 0.03 * thickness,
			hue: 46,
			alpha: 0.01 + hash01(`core:${index}:a2`) * 0.025,
			size: 0.6 + hash01(`core:${index}:s`) * 0.9
		});
	}

	// The shell is drawn at 1.22·extent, so every star stays inside it with margin.
	let extent = 0.2;
	for (const node of nodes) extent = Math.max(extent, Math.hypot(node.x, node.y, node.z));
	// 太阳系 keeps its own polar coordinates per body, so the orbit is a pure function of
	// time: the planet about the sun, the moons about their planet. Nothing accumulates,
	// so a paused or throttled frame cannot drift the system out of shape.
	if (layout === "system") {
		for (const folder of folders) {
			folder.orbitRadius = Math.hypot(folder.x, folder.z);
			folder.orbitAngle = Math.atan2(folder.z, folder.x);
		}
		for (const node of nodes) {
			if (node.kind !== "session") continue;
			const host = folders.find((folder) => folder.id === node.folderId);
			if (host === undefined) continue;
			node.spinRadius = Math.hypot(node.x - host.x, node.z - host.z);
			node.spinAngle = Math.atan2(node.z - host.z, node.x - host.x);
			node.spinLift = node.y - host.y;
		}
	}

	const orbits = layout === "system" ? folders.map((folder) => folder.orbit * shrink) : [];
	return { nodes, links: graph.links, dust, extent: Math.min(1.7, extent), golden, orbits, offset: { x: offsetX, y: offsetY, z: offsetZ, scale: shrink } };
}

/**
 * 太阳系's revolution: planets travel around the sun at a Kepler-ish speed (inner fast,
 * outer slow) and every moon circles its planet on top of that, so the clusters read as
 * orbiting rather than as a painted disc.
 *
 * Positions are recomputed from each body's stored polar coordinates and the elapsed
 * time, never integrated, so the system cannot drift and any frame stays reproducible.
 *
 * @param galaxy - output of {@link createGalaxy} (system layout only).
 * @param seconds - scene time.
 */
/** 星环's pace: inner rings lap faster; the innermost takes about 1.9 min per lap. */
const RING_ORBIT = 0.015;
/** Twists of the double helix per lap, and how far off the ring line a body weaves. */
const RING_HELIX_TURNS = 3;
const RING_HELIX_LIFT = 0.05;

/**
 * 星环's motion: every body travels along its own ring, weaving above and below the ring
 * line in two strands of a double helix — so the rings read as two interleaved helixes
 * turning rather than as a plate of beads.
 *
 * Positions are recomputed from each body's stored polar seat and the elapsed time, never
 * integrated, so the picture cannot drift and any frame is reproducible.
 *
 * @param galaxy - output of {@link createGalaxy}.
 * @param seconds - scene time.
 */
function orbitRings(galaxy, seconds) {
	for (const node of galaxy.nodes) {
		if (node.ring === undefined || !Number.isFinite(node.ring)) continue;
		const radius = Math.hypot(node.x, node.z);
		if (radius < 1e-6) continue;
		// The base angle is the *placed* one, stored once. Reading it back off the live
		// position (as this used to) folds the clock into it every frame: each call added
		// `seconds · speed` to an angle that already held it, so the ring span faster and
		// faster the longer the view stayed open.
		const base = Number.isFinite(node.ringAngle) ? node.ringAngle : (node.ringAngle = Math.atan2(node.z, node.x));
		const speed = RING_ORBIT / Math.pow(Math.max(0.2, radius), 1.2);
		const travelled = seconds * speed;
		const angle = base + travelled;
		// Two strands, half a twist apart, each weaving around the ring line.
		const strand = Number.isFinite(node.strandIndex) ? node.strandIndex : 0;
		const weave = Math.sin(travelled * RING_HELIX_TURNS * TAU + (strand === 0 ? 0 : Math.PI));
		node.x = Math.cos(angle) * radius;
		node.z = Math.sin(angle) * radius;
		node.y = (node.ringBaseY ?? 0) + weave * RING_HELIX_LIFT;
	}
}

/**
 * 极简's armillary spin: every body turns inside its own ring's plane, alternating direction,
 * so the rings visibly rotate through one another instead of the whole ball turning as a
 * block.
 */
function orbitSphere(galaxy, seconds) {
	for (const node of galaxy.nodes) {
		const ring = node.ring;
		if (ring === undefined || !Number.isFinite(ring)) continue;
		const plane = SPHERE_PLANES[ring] ?? SPHERE_PLANES[0];
		// The placed angle is the phase: recovered from the node's position inside its plane.
		if (node.spherePhase === undefined) {
			node.spherePhase = Math.atan2(
				node.x * plane[1][0] + node.y * plane[1][1] + node.z * plane[1][2],
				node.x * plane[0][0] + node.y * plane[0][1] + node.z * plane[0][2]
			);
		}
		const base = 0;
		const speed = (ring % 2 === 0 ? 1 : -1) * (SPHERE_ORBIT / (1 + ring * 0.35));
		const angle = base + seconds * speed + node.spherePhase;
		const radial = Math.hypot(node.x, node.y, node.z) / Math.max(1e-6, SPHERE_RADIUS);
		node.x = (Math.cos(angle) * plane[0][0] + Math.sin(angle) * plane[1][0]) * SPHERE_RADIUS * radial;
		node.y = (Math.cos(angle) * plane[0][1] + Math.sin(angle) * plane[1][1]) * SPHERE_RADIUS * radial;
		node.z = (Math.cos(angle) * plane[0][2] + Math.sin(angle) * plane[1][2]) * SPHERE_RADIUS * radial;
	}
}

function orbitSystem(galaxy, seconds) {
	const planets = [];
	for (const node of galaxy.nodes) {
		if (node.kind !== "folder" || node.orbitRadius === undefined) continue;
		// ω ∝ r^-1.5, scaled so the innermost planet laps in about 42 s.
		const speed = SYSTEM_KEPLER / Math.pow(Math.max(0.12, node.orbitRadius), 1.5);
		const angle = node.orbitAngle + seconds * speed;
		node.x = Math.cos(angle) * node.orbitRadius;
		node.z = Math.sin(angle) * node.orbitRadius;
		planets.push(node);
	}
	for (const node of galaxy.nodes) {
		if (node.kind !== "session" || node.spinRadius === undefined) continue;
		const host = planets.find((planet) => planet.id === node.folderId);
		if (host === undefined) continue;
		// A moon keeps its own turn around the planet, faster than the planet's lap.
		const speed = (SYSTEM_KEPLER / Math.pow(Math.max(0.12, host.orbitRadius), 1.5)) * 2.6;
		const angle = node.spinAngle + seconds * speed;
		node.x = host.x + Math.cos(angle) * node.spinRadius;
		node.y = host.y + node.spinLift;
		node.z = host.z + Math.sin(angle) * node.spinRadius;
	}
}

/**
 * A fresh orbit camera. `yaw` spins around Y, `pitch` tilts the disc, `distance`
 * dollies along the view axis.
 * @param overrides - partial camera fields.
 * @returns camera state.
 */
function createCamera(overrides) {
	return {
		yaw: 0.55,
		pitch: 0.62,
		distance: 2.9,
		target: { x: 0, y: 0, z: 0 },
		fov: 0.82,
		...overrides ?? {}
	};
}

/**
 * Camera position and orthonormal basis for one frame.
 * @param camera - camera state.
 * @returns `{ eye, right, up, forward }` unit vectors plus the eye point.
 */
function cameraBasis(camera) {
	const cosPitch = Math.cos(camera.pitch);
	const sinPitch = Math.sin(camera.pitch);
	const cosYaw = Math.cos(camera.yaw);
	const sinYaw = Math.sin(camera.yaw);
	const eye = {
		x: camera.target.x + camera.distance * cosPitch * sinYaw,
		y: camera.target.y + camera.distance * sinPitch,
		z: camera.target.z + camera.distance * cosPitch * cosYaw
	};
	const forward = normalize({
		x: camera.target.x - eye.x,
		y: camera.target.y - eye.y,
		z: camera.target.z - eye.z
	});
	// Both axes are written out from yaw and pitch instead of from `cross(forward, worldUp)`:
	// that cross product vanishes when the camera looks straight up or down, which is why
	// pitch used to be locked to a band. Analytic axes stay exact at every angle, so the
	// camera can go over the poles and keep turning (the scene rolls with it).
	const right = { x: cosYaw, y: 0, z: -sinYaw };
	const up = { x: -sinPitch * sinYaw, y: cosPitch, z: -sinPitch * cosYaw };
	return { eye, forward, right, up };
}

/** Vector helpers kept local so the bundle stays dependency-free. */
function normalize(vector) {
	const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
	return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
}

function cross(a, b) {
	return {
		x: a.y * b.z - a.z * b.y,
		y: a.z * b.x - a.x * b.z,
		z: a.x * b.y - a.y * b.x
	};
}

/**
 * Project one world point into screen space.
 * @param point - `{ x, y, z }` in galaxy units.
 * @param basis - output of {@link cameraBasis}.
 * @param viewport - `{ width, height }` in CSS pixels.
 * @returns `{ x, y, depth, scale }` or null when behind the camera.
 */
function projectPoint(point, basis, viewport) {
	const dx = point.x - basis.eye.x;
	const dy = point.y - basis.eye.y;
	const dz = point.z - basis.eye.z;
	const depth = dx * basis.forward.x + dy * basis.forward.y + dz * basis.forward.z;
	if (depth <= 0.08) return null;
	const focal = (Math.min(viewport.width, viewport.height) * 0.5) / Math.tan(0.41);
	const side = (dx * basis.right.x + dy * basis.right.y + dz * basis.right.z) / depth;
	const lift = (dx * basis.up.x + dy * basis.up.y + dz * basis.up.z) / depth;
	return {
		x: viewport.width * 0.5 + side * focal,
		y: viewport.height * 0.5 - lift * focal,
		depth,
		scale: focal / depth
	};
}

/**
 * Distance that frames the whole galaxy for a given field of view.
 * @param extent - galactic radius.
 * @param fov - vertical field of view in radians.
 * @returns camera distance.
 */
function fitDistance(extent, fov) {
	const half = Math.tan((fov ?? 0.82) / 2);
	return Math.max(1.2, (Math.max(0.3, extent) * 1.55) / half);
}

/** Neighbour index set for hover highlighting (folders, members, lineage). */
function neighboursOf(graph) {
	const map = new Map();
	const add = (from, to) => {
		if (!map.has(from)) map.set(from, new Set());
		map.get(from).add(to);
	};
	for (const link of graph.links) {
		const a = graph.nodes[link.a];
		const b = graph.nodes[link.b];
		if (a === undefined || b === undefined) continue;
		add(a.id, b.id);
		add(b.id, a.id);
	}
	return map;
}

/**
 * Sky shell: a thin, uniform shell of grains around the galaxy (unit radius, so the
 * renderer scales it by the scene's shell radius). Every grain draws as a hard square
 * of a fixed CSS size, so the arrays are flat and pre-sorted by (class, tint) bucket:
 * the renderer fills each bucket with one path and allocates nothing per frame.
 */
const SKY_RADIUS = 1;
const SKY_CLASSES = [
	{ count: 5200, size: 1.2 },
	{ count: 1800, size: 2 },
	{ count: 500, size: 3 }
];
/**
 * On-screen tints, each a faint colour rather than plain white: cool white, silver,
 * a rare pale warm one, faint rose, pale blue, ivory, and a near-white bright one
 * (L-class only). Warm grains stay scarce and pale so the shell never reads yellow.
 */
const SKY_TINTS = [
	[190, 198, 214],
	[204, 206, 212],
	[216, 206, 192],
	[210, 202, 206],
	[164, 180, 214],
	[212, 210, 204],
	[220, 220, 216]
];
const SKY_BRIGHT_TINT = 6;
const SKY_BUCKETS = SKY_CLASSES.length * SKY_TINTS.length;

/** murmur3 finaliser: spreads one FNV-1a seed into independent streams. */
function mix32(value) {
	let mixed = value >>> 0;
	mixed ^= mixed >>> 16;
	mixed = Math.imul(mixed, 0x85ebca6b);
	mixed ^= mixed >>> 13;
	mixed = Math.imul(mixed, 0xc2b2ae35);
	mixed ^= mixed >>> 16;
	return mixed >>> 0;
}

/**
 * Several uniforms in [0, 1) from one key. Keys that differ by a single character
 * correlate under FNV-1a, so streams are derived from one hash instead of from
 * sibling keys like `${key}:a` / `${key}:b`.
 */
function hashStreams(text, count) {
	const seed = Math.floor(hash01(text) * 4294967296);
	const out = new Array(count);
	for (let index = 0; index < count; index += 1) out[index] = mix32(seed + Math.imul(index + 1, 0x9e3779b9)) / 4294967296;
	return out;
}

/**
 * Flat, bucket-sorted grain arrays from a class table and a placement function.
 * @param classes - `[{ count, size }]` in draw order.
 * @param key - hash namespace, distinct per grain set.
 * @param place - `(streams, classIndex) => [x, y, z]` from four uniforms.
 * @param brightShare - share of the last class drawn in the bright tint.
 */
function createGrainSet(classes, key, place, brightShare) {
	const grains = [];
	let serial = 0;
	classes.forEach((klass, classIndex) => {
		for (let index = 0; index < klass.count; index += 1) {
			serial += 1;
			const streams = hashStreams(`${key}/${serial}`, 7);
			const [x, y, z] = place(streams, classIndex);
			const pick = streams[4];
			let tint = pick < 0.4 ? 0 : pick < 0.62 ? 1 : pick < 0.66 ? 2 : pick < 0.72 ? 3 : pick < 0.92 ? 4 : 5;
			if (classIndex === classes.length - 1 && streams[6] < brightShare) tint = SKY_BRIGHT_TINT;
			grains.push({ x, y, z, keep: streams[5], cls: classIndex, tint, bucket: classIndex * SKY_TINTS.length + tint });
		}
	});
	grains.sort((left, right) => left.bucket - right.bucket);
	const count = grains.length;
	const set = {
		count,
		sizes: classes.map((klass) => klass.size),
		x: new Float32Array(count),
		y: new Float32Array(count),
		z: new Float32Array(count),
		keep: new Float32Array(count),
		cls: new Uint8Array(count),
		tint: new Uint8Array(count),
		bucketStart: new Int32Array(SKY_BUCKETS),
		bucketEnd: new Int32Array(SKY_BUCKETS),
		large: []
	};
	set.bucketStart.fill(count);
	grains.forEach((grain, index) => {
		set.x[index] = grain.x;
		set.y[index] = grain.y;
		set.z[index] = grain.z;
		set.keep[index] = grain.keep;
		set.cls[index] = grain.cls;
		set.tint[index] = grain.tint;
		set.bucketStart[grain.bucket] = Math.min(set.bucketStart[grain.bucket], index);
		set.bucketEnd[grain.bucket] = index + 1;
		if (grain.cls === classes.length - 1) set.large.push(index);
	});
	return set;
}

/** Uniform direction from two uniforms, at radius `radius`. */
function onSphere(u, v, radius) {
	const angle = u * TAU;
	const lift = v * 2 - 1;
	const ring = Math.sqrt(Math.max(0, 1 - lift * lift));
	return [Math.cos(angle) * ring * radius, lift * radius, Math.sin(angle) * ring * radius];
}

/**
 * Build the sky shell: uniform directions, radius in a thin `[0.95, 1.05]` band.
 * @returns flat grain arrays (see {@link createGrainSet}); 3% of the L class are bright.
 */
function createSkyShell() {
	return createGrainSet(SKY_CLASSES, "sky-shell-grain", ([u, v, w]) => onSphere(u, v, SKY_RADIUS * (0.95 + 0.1 * w)), 0.03);
}

/**
 * Field stars: a sparse inner volume of the same hard squares (the reference's
 * parallax layer), `r = Rv·(0.3 + 0.7·∛u)` so nothing piles up at the centre.
 * Unit radius is the shell's. Rv spans the node cloud (~0.7 of the shell): a thin
 * shell alone projects twice as dense at the limb as in the middle, and this layer
 * evens the disc out; a tighter volume reads as a central clump instead.
 */
const FIELD_RADIUS = 0.7;
const FIELD_CLASSES = [
	{ count: 546, size: 1.2 },
	{ count: 234, size: 2 }
];
function createFieldStars() {
	return createGrainSet(FIELD_CLASSES, "field-star-grain", ([u, v, w]) => onSphere(u, v, FIELD_RADIUS * (0.3 + 0.7 * Math.cbrt(w))), 0);
}

/**
 * Drifting field stars (Galaxy View `buildFieldStars`): up to 2000 points scattered
 * through a volume around the galaxy, `r = V·(0.3 + 0.7·∛u)`, sized by distance so
 * they parallax against the shell while the camera moves. Unit volume radius; the
 * renderer scales it and draws the first `1200·density` of them.
 * @returns `{ count, x, y, z, tint }` with tint 0 cool, 1 warm, 2 blue.
 */
const DRIFT_STARS = 2000;
function createDriftStars() {
	const x = new Float32Array(DRIFT_STARS);
	const y = new Float32Array(DRIFT_STARS);
	const z = new Float32Array(DRIFT_STARS);
	const tint = new Uint8Array(DRIFT_STARS);
	const mixA = new Float32Array(DRIFT_STARS);
	for (let index = 0; index < DRIFT_STARS; index += 1) {
		const [u, v, w, pick, mix] = hashStreams(`drift-star/${index}`, 5);
		const [px, py, pz] = onSphere(u, v, 0.3 + 0.7 * Math.cbrt(w));
		x[index] = px;
		y[index] = py;
		z[index] = pz;
		tint[index] = pick < 0.85 ? 0 : pick < 0.89 ? 1 : 2;
		mixA[index] = mix;
	}
	return { count: DRIFT_STARS, x, y, z, tint, mix: mixA };
}

/**
 * Deep sky: stars at infinity (unit directions only), so they stay around the frame
 * however far the camera pulls back. Mostly 1 px, some 1.5, a few 2.
 * @returns `{ count, x, y, z, size, tint, glow }`.
 */
const DEEP_SKY_STARS = 5200;
function createDeepSky() {
	const x = new Float32Array(DEEP_SKY_STARS);
	const y = new Float32Array(DEEP_SKY_STARS);
	const z = new Float32Array(DEEP_SKY_STARS);
	const size = new Float32Array(DEEP_SKY_STARS);
	const tint = new Uint8Array(DEEP_SKY_STARS);
	const glow = new Float32Array(DEEP_SKY_STARS);
	for (let index = 0; index < DEEP_SKY_STARS; index += 1) {
		const [u, v, s, pick, light] = hashStreams(`deep-sky/${index}`, 5);
		const [px, py, pz] = onSphere(u, v, 1);
		x[index] = px;
		y[index] = py;
		z[index] = pz;
		size[index] = s < 0.7 ? 1 : s < 0.94 ? 1.5 : 2;
		tint[index] = pick < 0.82 ? 0 : pick < 0.86 ? 1 : 2;
		glow[index] = 0.35 + 0.65 * light;
	}
	return { count: DEEP_SKY_STARS, x, y, z, size, tint, glow };
}

/**
 * Parse the filter syntax shared with Galaxy View's note filter: words are ANDed,
 * `-word` excludes, `path:x` matches only paths, `file:x` / `name:x` only names,
 * `"two words"` is one phrase. Case-insensitive.
 * @returns `null` for an empty query, else `{ terms: [{ negate, field, value }] }`.
 */
function parseFilter(query) {
	if (typeof query !== "string" || query.trim() === "") return null;
	const terms = [];
	const pattern = /(-?)(?:(path|file|name):)?(?:"([^"]*)"?|(\S+))/gi;
	let match;
	while ((match = pattern.exec(query)) !== null) {
		if (match[0] === "") {
			pattern.lastIndex += 1;
			continue;
		}
		const value = (match[3] ?? match[4] ?? "").toLowerCase();
		if (value === "" || value === "-") continue;
		const field = match[2] === undefined ? "any" : match[2].toLowerCase() === "path" ? "path" : "name";
		terms.push({ negate: match[1] === "-", field, value });
	}
	return terms.length === 0 ? null : { terms };
}

/** True when `{ name, path }` (lower- or mixed-case strings) satisfies a parsed filter. */
function filterAccepts(parsed, fields) {
	if (parsed === null || parsed === undefined) return true;
	const name = String(fields?.name ?? "").toLowerCase();
	const path = String(fields?.path ?? "").toLowerCase();
	return parsed.terms.every((term) => {
		const hit = term.field === "path" ? path.includes(term.value) : term.field === "name" ? name.includes(term.value) : name.includes(term.value) || path.includes(term.value);
		return term.negate ? !hit : hit;
	});
}

/**
 * Keep at most `cap` stars: every sun, then the most linked and most recent
 * conversations (the mobile tier's 1500-node cap). Links are remapped.
 */
function capGraph(graph, cap) {
	if (!Number.isFinite(cap) || graph.nodes.length <= cap) return graph;
	const degree = new Array(graph.nodes.length).fill(0);
	for (const link of graph.links) {
		degree[link.a] += 1;
		degree[link.b] += 1;
	}
	const ranked = graph.nodes
		.map((node, index) => ({ node, index }))
		.sort((left, right) => {
			const folder = (right.node.kind === "folder" ? 1 : 0) - (left.node.kind === "folder" ? 1 : 0);
			return folder || degree[right.index] - degree[left.index] || (right.node.updatedAt ?? 0) - (left.node.updatedAt ?? 0) || left.index - right.index;
		})
		.slice(0, cap)
		.sort((left, right) => left.index - right.index);
	const remap = new Map(ranked.map((entry, position) => [entry.index, position]));
	const nodes = ranked.map((entry, position) => {
		entry.node.index = position;
		return entry.node;
	});
	const links = graph.links.filter((link) => remap.has(link.a) && remap.has(link.b)).map((link) => ({ ...link, a: remap.get(link.a), b: remap.get(link.b) }));
	return { ...graph, nodes, links, capped: graph.nodes.length };
}

/**
 * Shortest link path between two node indices (breadth-first, undirected).
 * @returns node indices from `from` to `to`, or `null` when they are not connected.
 */
function shortestPath(graph, from, to) {
	const count = graph.nodes.length;
	if (from < 0 || to < 0 || from >= count || to >= count) return null;
	if (from === to) return [from];
	const adjacency = Array.from({ length: count }, () => []);
	for (const link of graph.links) {
		adjacency[link.a].push(link.b);
		adjacency[link.b].push(link.a);
	}
	const previous = new Int32Array(count).fill(-1);
	previous[from] = from;
	const queue = [from];
	for (let head = 0; head < queue.length; head += 1) {
		const at = queue[head];
		for (const next of adjacency[at]) {
			if (previous[next] !== -1) continue;
			previous[next] = at;
			if (next === to) {
				const path = [to];
				for (let step = to; step !== from; step = previous[step]) path.push(previous[step]);
				return path.reverse();
			}
			queue.push(next);
		}
	}
	return null;
}
export {	ARMS,
	SHAPE,
	HUES,
	AGENT_ORBIT,
	AGENT_SPEED,
	LAUNCH_SECONDS,
	RETURN_SECONDS,
	startAgentLaunch,
	stepAgentLaunches,
	startAgentReturn,
	stepAgentReturns,
	agentPlane,
	agentPhaseFor,
	recordAgentTrail,
	orbitAgents,
	SPOKE_CAP,
	hash01,
	basename,
	timeOf,
	buildGraph,
	createGalaxy,
	createCamera,
	cameraBasis,
	projectPoint,
	LAYOUTS,
	placeFolder,
	placeSession,
	spiralSegments,
	spiralRadius,
	SPIRAL_INNER,
	SPIRAL_OUTER,
	GALAXY_REACH,
	placeDust,
	layoutGuides,
	fitDistance,
	normalize,
	cross,
	neighboursOf,
	SKY_RADIUS,
	SKY_CLASSES,
	SKY_TINTS,
	SKY_BRIGHT_TINT,
	SKY_BUCKETS,
	mix32,
	hashStreams,
	createGrainSet,
	orbitRings,
	orbitSphere,
	orbitSystem,
	createSkyShell,
	FIELD_RADIUS,
	FIELD_CLASSES,
	createFieldStars,
	DRIFT_STARS,
	createDriftStars,
	DEEP_SKY_STARS,
	createDeepSky,
	parseFilter,
	filterAccepts,
	capGraph,
	shortestPath
};

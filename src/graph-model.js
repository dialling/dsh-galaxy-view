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
const HUES = [265, 208, 158, 28, 330, 96, 190, 12];

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
 * @param options - `{ showArchived }`.
 * @returns `{ nodes, links, stats }`; node ids are `ws:<id>` or the session id.
 */
function buildGraph(workspaces, sessions, options) {
	const showArchived = options?.showArchived === true;
	const hidden = options?.hidden instanceof Set ? options.hidden : new Set(Array.isArray(options?.hidden) ? options.hidden : []);
	const only = typeof options?.only === "string" && options.only !== "" ? options.only : null;
	const showOrphans = options?.showOrphans === true;
	const showEmpty = options?.showEmpty === true;
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
			links.push({ a: folder.index, b: node.index, kind: "member" });
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
		links.push({ a: parent.index, b: node.index, kind: "lineage" });
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
const LAYOUTS = ["spiral", "rings", "lattice", "bubble", "helix", "clusters", "plate", "tree"];

/**
 * Spiral arms run from SPIRAL_INNER to SPIRAL_OUTER. The inner radius keeps the core
 * sparse (only faint dust reaches the middle); radius grows with √t so stars spread
 * evenly by arc length instead of crowding the short inner turns.
 */
const SPIRAL_INNER = 0.36;
const SPIRAL_OUTER = 1;
const RING_RADII = [0.34, 0.56, 0.78, 1];
const LATTICE_SPAN = 0.9;
const LATTICE_LIFT = 0.7;
const HELIX_RADIUS = 0.66;
const HELIX_HEIGHT = 1.4;
const HELIX_TURNS = 1.6;
const CLUSTER_BLOBS = 5;
const CLUSTER_RADIUS = 0.62;
const CLUSTER_LIFT = 0.16;

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

/** Lattice slot `index`: grid points ordered by distance from the middle, so any count fills a ball. */
function latticeSlot(index, count) {
	let half = 1;
	while ((2 * half + 1) ** 3 < count) half += 1;
	const points = [];
	for (let gx = -half; gx <= half; gx += 1) {
		for (let gy = -half; gy <= half; gy += 1) {
			for (let gz = -half; gz <= half; gz += 1) points.push([gx, gy, gz]);
		}
	}
	points.sort((a, b) => a[0] * a[0] + a[1] * a[1] + a[2] * a[2] - (b[0] * b[0] + b[1] * b[1] + b[2] * b[2]));
	return { grid: points[index % points.length], half };
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
 * @param segment - spiral only: the folder's `{ t0, t1 }` stretch of its arm.
 * @returns position plus the resolved radius, arm/blot index and what its members need.
 */
function placeFolder(layout, index, count, salt, folderId, shape, segment) {
	const jitter = hash01(`${folderId}:${salt}`) - 0.5;
	const jitterY = hash01(`${folderId}:h${salt}`) - 0.5;
	const { arms, twist, thickness } = shape;
	const lift = (scale) => jitterY * scale * thickness;

	if (layout === "rings") {
		// Clean concentric orbits: no arm twist at all, four rings deep.
		const ring = index % RING_RADII.length;
		const radius = RING_RADII[ring];
		const angle = (index / Math.max(1, Math.ceil(count / RING_RADII.length))) * TAU + jitter * 0.06;
		return { x: Math.cos(angle) * radius, y: lift(0.02), z: Math.sin(angle) * radius, radius, arm: ring, angle };
	}

	if (layout === "lattice") {
		// A crystal: grid points nearest the middle first, then a breath of jitter.
		const { grid, half } = latticeSlot(index, count);
		const cell = LATTICE_SPAN / half;
		const x = grid[0] * cell;
		const y = grid[1] * cell * LATTICE_LIFT;
		const z = grid[2] * cell;
		return { x: x + jitter * 0.015, y: y + jitterY * 0.015, z: z + jitter * 0.015, radius: Math.hypot(x, z), arm: index % 2, grid, half, cell };
	}

	if (layout === "bubble") {
		// A hollow shell: every body equidistant from the core.
		const lift01 = count <= 1 ? 0.5 : (index + 0.5) / count;
		const phi = Math.acos(Math.max(-1, Math.min(1, 1 - 2 * lift01)));
		const theta = index * Math.PI * (3 - Math.sqrt(5));
		const radius = 0.92 + jitter * 0.05;
		const direction = { x: Math.sin(phi) * Math.cos(theta), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(theta) };
		return { x: direction.x * radius, y: direction.y * radius * 0.86, z: direction.z * radius, radius, arm: index % arms, direction };
	}

	if (layout === "helix") {
		// Two strands climbing a cylinder.
		const strand = index % 2;
		const t = count <= 1 ? 0.5 : index / (count - 1);
		const angle = t * TAU * HELIX_TURNS + strand * Math.PI + jitter * 0.05;
		const height = HELIX_HEIGHT * Math.max(0.6, Math.min(1.5, thickness));
		return { x: Math.cos(angle) * HELIX_RADIUS, y: (t - 0.5) * height, z: Math.sin(angle) * HELIX_RADIUS, radius: HELIX_RADIUS, arm: strand, t, strand, height };
	}

	if (layout === "clusters") {
		// A handful of loose blobs — galaxies in a small group, stacked at two heights.
		const blob = index % CLUSTER_BLOBS;
		const centreAngle = (blob / CLUSTER_BLOBS) * TAU;
		const centre = {
			x: Math.cos(centreAngle) * CLUSTER_RADIUS,
			y: (blob % 2 === 0 ? CLUSTER_LIFT : -CLUSTER_LIFT) * thickness,
			z: Math.sin(centreAngle) * CLUSTER_RADIUS
		};
		const offset = 0.16;
		return {
			x: centre.x + jitter * offset,
			y: centre.y + lift(0.1),
			z: centre.z + jitterY * offset,
			radius: CLUSTER_RADIUS,
			arm: blob
		};
	}

	if (layout === "plate") {
		// A flat sheet: a rectangular rank and file, almost no depth.
		const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
		const gx = index % cols;
		const gz = Math.floor(index / cols);
		const rows = Math.max(1, Math.ceil(count / cols));
		const half = 0.95;
		const x = cols === 1 ? 0 : (gx / (cols - 1)) * 2 * half - half;
		const z = rows === 1 ? 0 : (gz / (rows - 1)) * 2 * half - half;
		return { x: x + jitter * 0.03, y: lift(0.02), z: z + jitterY * 0.03, radius: Math.hypot(x, z), arm: index % arms };
	}

	if (layout === "tree") {
		// Radiating branches: a trunk of spokes, each carrying its own length.
		const branches = Math.max(3, Math.min(7, arms * 3));
		const branch = index % branches;
		const depth = Math.floor(index / branches);
		const depthCount = Math.max(1, Math.ceil(count / branches));
		const radius = 0.3 + (0.72 * (depth + 1)) / depthCount;
		const angle = (branch / branches) * TAU + jitter * 0.22 + jitter * 0.16;
		return {
			x: Math.cos(angle) * radius,
			y: lift(0.03) + (1 - radius) * 0.05,
			z: Math.sin(angle) * radius,
			radius,
			arm: branch,
			angle
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
 * the ring, the strand or the branch; across the bubble surface; along the lattice
 * beams; inside a loose ball for clusters; within the sheet for the plate.
 *
 * @param layout - one of {@link LAYOUTS}.
 * @param hub - the sun's {@link placeFolder} result (before re-centring).
 * @param members - sessions of that sun.
 * @param u - seven independent uniforms for this star.
 * @param shape - resolved shape numbers.
 * @returns position before re-centring.
 */
function placeSession(layout, hub, members, u, shape) {
	const { arms, twist, thickness, spread } = shape;
	const reach = Math.sqrt(Math.max(1, members));
	const loose = Math.min(spread, 1.8);

	if (layout === "rings") {
		const length = (0.08 + 0.06 * reach) * loose;
		const angle = hub.angle + ((u[0] - 0.5) * 2 * length) / hub.radius;
		const radius = hub.radius + tri(u[1], u[2]) * (0.03 + 0.004 * reach) * loose;
		return { x: Math.cos(angle) * radius, y: hub.y + tri(u[3], u[4]) * 0.03 * thickness, z: Math.sin(angle) * radius };
	}

	if (layout === "lattice") {
		// Members run out along the grid beams toward the neighbouring points (never
		// past the outer face), so the stars draw the crystal's edges.
		const axis = Math.floor(u[0] * 3) % 3;
		const coordinate = hub.grid[axis];
		let sign = u[1] < 0.5 ? -1 : 1;
		if (Math.abs(coordinate + sign) > hub.half) sign = -sign;
		const run = hub.cell * (0.1 + 0.36 * Math.pow(u[2], 0.8)) * Math.min(1.2, loose) * sign;
		const point = { x: hub.x, y: hub.y, z: hub.z };
		if (axis === 0) point.x += run;
		else if (axis === 1) point.y += run * LATTICE_LIFT;
		else point.z += run;
		const fuzz = 0.012 * loose;
		return { x: point.x + (u[3] - 0.5) * fuzz, y: point.y + (u[4] - 0.5) * fuzz, z: point.z + (u[5] - 0.5) * fuzz };
	}

	if (layout === "bubble") {
		const n = hub.direction;
		const tangent = normalize(Math.abs(n.y) > 0.95 ? { x: 1, y: 0, z: 0 } : cross(n, { x: 0, y: 1, z: 0 }));
		const bitangent = cross(n, tangent);
		const tilt = (0.08 + 0.04 * reach) * loose * Math.sqrt(u[0]);
		const turn = u[1] * TAU;
		const sinTilt = Math.sin(tilt);
		const radius = hub.radius + (u[2] - 0.5) * 0.04;
		const dx = n.x * Math.cos(tilt) + (tangent.x * Math.cos(turn) + bitangent.x * Math.sin(turn)) * sinTilt;
		const dy = n.y * Math.cos(tilt) + (tangent.y * Math.cos(turn) + bitangent.y * Math.sin(turn)) * sinTilt;
		const dz = n.z * Math.cos(tilt) + (tangent.z * Math.cos(turn) + bitangent.z * Math.sin(turn)) * sinTilt;
		return { x: dx * radius, y: dy * radius * 0.86, z: dz * radius };
	}

	if (layout === "helix") {
		const t = Math.max(0, Math.min(1, hub.t + (u[0] - 0.5) * 2 * (0.02 + 0.008 * reach) * loose));
		const angle = t * TAU * HELIX_TURNS + hub.strand * Math.PI;
		const radius = HELIX_RADIUS + tri(u[1], u[2]) * 0.04 * loose;
		return { x: Math.cos(angle) * radius, y: (t - 0.5) * hub.height + tri(u[3], u[4]) * 0.02, z: Math.sin(angle) * radius };
	}

	if (layout === "clusters") {
		const radius = (0.05 + 0.024 * reach) * loose * Math.cbrt(u[0]);
		const [dx, dy, dz] = onSphere(u[1], u[2], radius);
		return { x: hub.x + dx, y: hub.y + dy * 0.8 * Math.min(1.5, thickness), z: hub.z + dz };
	}

	if (layout === "plate") {
		const length = (0.06 + 0.028 * reach) * loose;
		return { x: hub.x + tri(u[0], u[1]) * length, y: hub.y + (u[2] - 0.5) * 0.02 * thickness, z: hub.z + tri(u[3], u[4]) * length };
	}

	if (layout === "tree") {
		const radius = Math.max(0.12, hub.radius + (u[0] - 0.5) * 2 * (0.05 + 0.028 * reach) * loose);
		const side = tri(u[1], u[2]) * (0.03 + 0.006 * reach) * loose;
		const sinA = Math.sin(hub.angle);
		const cosA = Math.cos(hub.angle);
		return {
			x: cosA * radius + sinA * side,
			y: tri(u[3], u[4]) * 0.025 * thickness + (1 - radius) * 0.05,
			z: sinA * radius - cosA * side
		};
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

	if (layout === "lattice") {
		const span = LATTICE_SPAN;
		return { x: (rnd() * 2 - 1) * span, y: (rnd() * 2 - 1) * span * LATTICE_LIFT, z: (rnd() * 2 - 1) * span };
	}
	if (layout === "bubble") {
		const lift = rnd() * 2 - 1;
		const ring = Math.sqrt(Math.max(0, 1 - lift * lift));
		const angle = rnd() * TAU;
		const radius = 0.9 + rnd() * 0.06;
		return { x: Math.cos(angle) * ring * radius, y: lift * radius * 0.86, z: Math.sin(angle) * ring * radius };
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
	if (layout === "clusters") {
		const blob = Math.floor(rnd() * CLUSTER_BLOBS);
		const centreAngle = (blob / CLUSTER_BLOBS) * TAU;
		const jitterX = (rnd() - 0.5) * 0.36;
		const jitterZ = (rnd() - 0.5) * 0.36;
		return {
			x: Math.cos(centreAngle) * CLUSTER_RADIUS + jitterX,
			y: (rnd() - 0.5) * 0.3 + (blob % 2 === 0 ? CLUSTER_LIFT : -CLUSTER_LIFT) * thickness,
			z: Math.sin(centreAngle) * CLUSTER_RADIUS + jitterZ
		};
	}
	if (layout === "plate") {
		return { x: (rnd() * 2 - 1) * 0.95, y: thin(0.02), z: (rnd() * 2 - 1) * 0.95 };
	}
	if (layout === "tree") {
		const branches = Math.max(3, Math.min(7, arms * 3));
		const branch = Math.floor(rnd() * branches);
		const radius = 0.24 + rnd() * 0.82;
		const angle = (branch / branches) * TAU;
		const side = (rnd() - 0.5) * 0.06;
		return {
			x: Math.cos(angle) * radius + Math.sin(angle) * side,
			y: thin(0.03) + (1 - radius) * 0.05,
			z: Math.sin(angle) * radius - Math.cos(angle) * side
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
function layoutGuides(layout, offset) {
	const lines = layoutGuideLines(layout);
	const ox = offset?.x ?? 0;
	const oy = offset?.y ?? 0;
	const oz = offset?.z ?? 0;
	const scale = offset?.scale ?? 1;
	if (ox === 0 && oy === 0 && oz === 0 && scale === 1) return lines;
	return lines.map((line) => line.map(([x, y, z]) => [(x - ox) * scale, (y - oy) * scale, (z - oz) * scale]));
}

function layoutGuideLines(layout) {
	const ring = (radius, segments = 96) => {
		const points = [];
		for (let i = 0; i <= segments; i += 1) {
			const angle = (i / segments) * TAU;
			points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
		}
		return points;
	};

	if (layout === "rings") return RING_RADII.map((radius) => ring(radius));
	if (layout === "plate") {
		const lines = [];
		for (let i = -3; i <= 3; i += 1) {
			const offset = (i / 3) * 0.95;
			lines.push([[-0.95, 0, offset], [0.95, 0, offset]]);
			lines.push([[offset, 0, -0.95], [offset, 0, 0.95]]);
		}
		return lines;
	}
	if (layout === "lattice") {
		// A box wireframe reads as random beams from most angles, so the grid itself
		// is the structure: one short cross per lattice point.
		const span = LATTICE_SPAN;
		const marks = [];
		for (const x of [-span, 0, span]) {
			for (const y of [-span * LATTICE_LIFT, 0, span * LATTICE_LIFT]) {
				for (const z of [-span, 0, span]) {
					if (x === 0 && y === 0 && z === 0) continue;
					marks.push([[x - 0.035, y, z], [x + 0.035, y, z]]);
					marks.push([[x, y - 0.035, z], [x, y + 0.035, z]]);
					marks.push([[x, y, z - 0.035], [x, y, z + 0.035]]);
				}
			}
		}
		return marks;
	}
	if (layout === "bubble") {
		const guides = [];
		for (const tilt of [0, Math.PI / 3, -Math.PI / 3]) {
			const points = [];
			for (let i = 0; i <= 96; i += 1) {
				const angle = (i / 96) * TAU;
				const ring = Math.cos(angle) * 0.92;
				const rise = Math.sin(angle) * 0.92;
				points.push([ring, rise * Math.sin(tilt), rise * Math.cos(tilt)]);
			}
			guides.push(points);
		}
		return guides;
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
		const lines = [];
		for (let branch = 0; branch < 6; branch += 1) {
			const angle = (branch / 6) * TAU;
			lines.push([[0, 0, 0], [Math.cos(angle) * 1, 0, Math.sin(angle) * 1]]);
		}
		return lines;
	}
	if (layout === "clusters") {
		const lines = [];
		for (let blob = 0; blob < CLUSTER_BLOBS; blob += 1) {
			const centreAngle = (blob / CLUSTER_BLOBS) * TAU;
			const height = blob % 2 === 0 ? CLUSTER_LIFT : -CLUSTER_LIFT;
			const points = [];
			for (let i = 0; i <= 48; i += 1) {
				const angle = (i / 48) * TAU;
				points.push([Math.cos(centreAngle) * CLUSTER_RADIUS + Math.cos(angle) * 0.2, height + Math.sin(angle) * 0.12, Math.sin(centreAngle) * CLUSTER_RADIUS + Math.sin(angle) * 0.2]);
			}
			lines.push(points);
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
	const golden = Math.PI * (3 - Math.sqrt(5));
	const segments = layout === "spiral" ? spiralSegments(folders.map((folder) => folder.count), arms) : [];
	const placements = new Map();

	folders.forEach((folder, index) => {
		const placed = placeFolder(layout, index, folders.length, salt, folder.id, shapeNumbers, segments[index]);
		placements.set(folder.id, { ...placed, members: folder.count });
		folder.x = placed.x;
		folder.y = placed.y;
		folder.z = placed.z;
		folder.arm = placed.arm;
		folder.discRadius = placed.radius;
		folder.size = 2.5 + Math.min(2.6, Math.sqrt(folder.count) * 0.26);
	});

	for (const node of nodes) {
		if (node.kind !== "session") continue;
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
		const placed = placeSession(layout, hub, hub.members, u, shapeNumbers);
		node.x = placed.x;
		node.y = placed.y;
		node.z = placed.z;
		node.arm = hub.arm;
	}

	// Off-disc shapes are not mass-symmetric (six branches, five blobs, a partly
	// filled grid), so the body would hang off the middle of the shell and gets
	// re-centred on its suns here. The spiral is centred on its core by construction
	// and must keep it: shifting a two-arm disc to its own midpoint halves it.
	let offsetX = 0;
	let offsetY = 0;
	let offsetZ = 0;
	if (layout !== "spiral" && folders.length > 0) {
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
	if (layout !== "spiral") {
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
	return { nodes, links: graph.links, dust, extent: Math.min(1.7, extent), golden, offset: { x: offsetX, y: offsetY, z: offsetZ, scale: shrink } };
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
	const right = normalize(cross(forward, { x: 0, y: 1, z: 0 }));
	const up = cross(right, forward);
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
	{ count: 2600, size: 1.2 },
	{ count: 900, size: 2 },
	{ count: 250, size: 3 }
];
/** Muted on-screen tints: neutral, light neutral, grey-blue, warm, bright (L-class only). */
const SKY_TINTS = [
	[191, 192, 196],
	[203, 203, 204],
	[155, 161, 176],
	[206, 196, 179],
	[210, 211, 212]
];
const SKY_BRIGHT_TINT = 4;
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
			let tint = pick < 0.42 ? 0 : pick < 0.62 ? 1 : pick < 0.88 ? 2 : 3;
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

export {	ARMS,
	SHAPE,
	HUES,
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
	createSkyShell,
	FIELD_RADIUS,
	FIELD_CLASSES,
	createFieldStars
};

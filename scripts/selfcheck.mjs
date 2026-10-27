/**
 * Minimal runnable check for the galaxy model and the produced bundle.
 *
 * No framework: `node scripts/selfcheck.mjs`. Exits non-zero on the first failed
 * expectation, so it is usable as a `prepack` gate.
 */
import { createServer } from "node:http";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { zstdCompressSync } from "node:zlib";
import assert from "node:assert/strict";

import {
	SKY_BUCKETS,
	SKY_CLASSES,
	SPOKE_CAP,
	orbitAgents,
	SKY_RADIUS,
	SKY_TINTS,
	buildGraph,
	cameraBasis,
	createCamera,
	createGalaxy,
	createFieldStars,
	createDriftStars,
	createSkyShell,
	DRIFT_STARS,
	FIELD_RADIUS,
	capGraph,
	filterAccepts,
	fitDistance,
	layoutGuides,
	neighboursOf,
	orbitRings,
	orbitSphere,
	orbitSystem,
	parseFilter,
	projectPoint,
	shortestPath
} from "../src/graph-model.js";
import { DEFAULTS, DEFAULT_THEME, LANGUAGES, PRESERVED_KEYS, PRESETS, QUALITIES, SETTINGS_VERSION, SIZE_BY, THEMES, linkColorRgb, migrateSettings } from "../src/settings.js";
import { PHYSICS_DEFAULTS, PHYSICS_KEYS, createSimulation, physicsOf, reheatSimulation, settleSimulation, simulationSettled, stepSimulation, writeSimulation } from "../src/physics.js";
import { BRIGHTNESS_MAX, HALO_INNER, HALO_OUTER, STAR_LIGHTNESS, quantiseDiameter, STAR_PEAK, bloomGate, bloomLuminance, bloomSpan, bloomSpanGain, brightnessGain, createNebula, discColour, discSample, innerHaloAlpha, linkEnd, linkShade, linkTint, relativeLuminance, rgbToHsl, srgbToOklab, starPlateau } from "../src/stars.js";
import { DOC_HUES, MEMORY_ARMS, MEMORY_CHANNEL, MEMORY_DOTS, MEMORY_SWIRL, SKILL_HUES, buildMemoryGraph, formatBytes } from "../src/memory.js";
import { CHANNEL, createMemoryStore, memoryRpc, routeHandler } from "../lib/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ── fixtures: two workspaces, one orphan session, one fork, one archived ── */

const workspaces = {
	phase: "ready",
	items: [
		{ workspaceId: "w1", path: "/Users/me/alpha", title: "alpha", sessionIds: ["s1", "s2", "s3"], createdAt: "2026-10-01T00:00:00Z" },
		{ workspaceId: "w2", path: "/Users/me/beta", title: "beta", sessionIds: ["s4"], createdAt: "2026-10-02T00:00:00Z" }
	],
	archivedSessionIds: ["s3"]
};

const sessions = {
	phase: "ready",
	ids: ["s1", "s2", "s3", "s4", "s5"],
	byId: {
		s1: { id: "s1", displayTitle: "Design the graph", cwd: "/Users/me/alpha", retainedBy: { mainView: 1 }, running: true, updatedAt: "2026-10-24T00:00:00Z" },
		s2: { id: "s2", displayTitle: "Fork of graph", cwd: "/Users/me/alpha", parentId: "s1", updatedAt: "2026-10-23T00:00:00Z" },
		s3: { id: "s3", displayTitle: "Old archived one", cwd: "/Users/me/alpha", updatedAt: "2026-09-01T00:00:00Z" },
		s4: { id: "s4", displayTitle: "Beta work", cwd: "/Users/me/beta", updatedAt: "2026-10-22T00:00:00Z" },
		s5: { id: "s5", displayTitle: "Unclaimed but under beta", cwd: "/Users/me/beta", updatedAt: "2026-10-21T00:00:00Z" }
	}
};

const graph = buildGraph(workspaces, sessions, { showArchived: false });
const ids = graph.nodes.map((node) => node.id);

assert.equal(graph.stats.folders, 2, "two workspace folders, no orphan folder");
assert.equal(graph.stats.sessions, 4, "archived session hidden by default");
assert.ok(ids.includes("ws:w1") && ids.includes("ws:w2"), "folder ids are namespaced");
assert.ok(!ids.includes("s3"), "archived session excluded without showArchived");
assert.ok(ids.includes("s5"), "unclaimed session attached by cwd");
assert.equal(graph.nodes.find((node) => node.id === "s1").current, true, "current session flagged");
assert.ok(
	graph.links.some((link) => link.kind === "lineage" && graph.nodes[link.a].id === "s1" && graph.nodes[link.b].id === "s2"),
	"fork lineage edge present"
);
assert.equal(graph.links.filter((link) => link.kind === "member").length, 4, "one membership edge per drawn session");
// 连线密度: a big workspace keeps only its newest SPOKE_CAP wires; the bodies all stay.
{
	const counts = [3, 60];
	const ws = { items: counts.map((n, i) => ({ workspaceId: `cw${i}`, path: `/c/${i}`, title: `c${i}`, sessionIds: Array.from({ length: n }, (_, j) => `cs${i}-${j}`) })), archivedSessionIds: [] };
	const ss = { ids: [], byId: {} };
	for (const w of ws.items) for (const id of w.sessionIds) { ss.ids.push(id); ss.byId[id] = { id, displayTitle: id, cwd: w.path, updatedAt: "2026-10-24T00:00:00Z" }; }
	const capped = buildGraph(ws, ss, {});
	const members = capped.links.filter((link) => link.kind === "member");
	assert.equal(members.length, 3 + SPOKE_CAP, `a 60-conversation workspace draws ${SPOKE_CAP} spokes, not 60`);
	assert.equal(capped.nodes.filter((node) => node.kind === "session").length, 63, "every body is still drawn");
	assert.ok(capped.links.every((link) => link.kind !== "lineage" || link.faint === true), "lineage edges are marked as context");
}

const withArchived = buildGraph(workspaces, sessions, { showArchived: true });
assert.equal(withArchived.stats.sessions, 5, "showArchived reveals the archived session");
{
	const swapped = buildGraph({ ...workspaces, items: [workspaces.items[1], workspaces.items[0]] }, sessions, { showArchived: true });
	const slotOf = (id) => swapped.nodes.find((node) => node.id === id).hueIndex;
	assert.deepEqual([slotOf("ws:w1"), slotOf("ws:w2")], [0, 1], "palette slots go by conversation count, not workspace order");
	assert.ok(swapped.nodes.filter((node) => node.kind === "session" && node.folderId === "ws:w1").every((node) => node.hueIndex === 0), "conversations share their sun's slot");
}

/* ── filters: hidden, isolate, orphans, empty suns ───────────────────────── */

const hiddenGraph = buildGraph(workspaces, sessions, { hidden: ["w1"] });
assert.equal(hiddenGraph.stats.folders, 1, "hidden workspace leaves the disc");
assert.equal(hiddenGraph.stats.sessions, 2, "hiding a workspace takes its own sessions with it");

const onlyGraph = buildGraph(workspaces, sessions, { only: "w1" });
assert.equal(onlyGraph.stats.folders, 1, "isolate keeps a single sun");
assert.equal(onlyGraph.stats.sessions, 2, "isolate keeps only that workspace's stars");

const drifted = {
	phase: "ready",
	ids: sessions.ids.concat(["s9"]),
	byId: { ...sessions.byId, s9: { id: "s9", displayTitle: "Drifted off", cwd: "/Users/me/gamma", updatedAt: "2026-10-20T00:00:00Z" } }
};
const orphanGraph = buildGraph(workspaces, drifted, {});
assert.equal(orphanGraph.stats.folders, 2, "orphans stay out unless asked for");
const withOrphans = buildGraph(workspaces, drifted, { showOrphans: true });
assert.equal(withOrphans.stats.folders, 3, "orphan toggle adds the unclaimed folder");
assert.ok(
	withOrphans.nodes.some((node) => node.kind === "folder" && node.orphan === true),
	"the unclaimed folder is flagged as an orphan"
);

const noEmpty = buildGraph(
	{ items: workspaces.items.concat([{ workspaceId: "w9", path: "/empty", title: "empty", sessionIds: [] }]), archivedSessionIds: [] },
	sessions,
	{}
);
assert.equal(noEmpty.stats.folders, 2, "empty workspaces are dropped by default");
const withEmpty = buildGraph(
	{ items: workspaces.items.concat([{ workspaceId: "w9", path: "/empty", title: "empty", sessionIds: [] }]), archivedSessionIds: [] },
	sessions,
	{ showEmpty: true }
);
assert.equal(withEmpty.stats.folders, 3, "empty toggle draws the idle sun");

/* ── galaxy: deterministic, inside the shell, two arms, sparse core ──────── */

/* The renderer draws the sky shell at 1.22 x extent (clamped to [1, 2.1]). */
const shellOf = (built) => Math.min(2.1, Math.max(1, built.extent * 1.22));
const radius3 = (node) => Math.hypot(node.x, node.y, node.z);

const galaxy = createGalaxy(graph, 1);
const again = createGalaxy(graph, 1);
assert.deepEqual(
	galaxy.nodes.map((node) => [node.x, node.y, node.z]),
	again.nodes.map((node) => [node.x, node.y, node.z]),
	"the same data always yields the same galaxy"
);

for (const node of galaxy.nodes) {
	assert.ok([node.x, node.y, node.z].every(Number.isFinite), `finite position for ${node.id}`);
	assert.ok(radius3(node) <= galaxy.extent + 1e-9 && radius3(node) <= shellOf(galaxy) * 0.85, `inside the shell for ${node.id}`);
	assert.ok(Math.abs(node.y) <= 0.14, `moderate disc thickness for ${node.id}`);
	assert.ok(Math.hypot(node.x, node.z) >= 0.12, `sparse core: ${node.id} stays off the centre`);
	assert.ok(node.size > 0, `positive star size for ${node.id}`);
	assert.ok(Number.isFinite(node.hueIndex), `palette slot for ${node.id}`);
}
assert.equal(galaxy.dust.length, 4410, "spiral dust, diffuse disc and core glow");

/* The panel's shape sliders must actually move the disc. createGalaxy writes the
 * positions onto the graph's own nodes, so snapshot before reshaping. */
const before = galaxy.nodes.map((node) => [node.x, node.y, node.z]);
const shaped = createGalaxy(graph, 1, { arms: 3, twist: 6, thickness: 0.4, spread: 1.6 });
assert.notDeepEqual(
	shaped.nodes.map((node) => [node.x, node.y, node.z]),
	before,
	"shape parameters rearrange the arms"
);
for (const node of shaped.nodes) {
	assert.ok(Math.abs(node.y) <= 0.14 * 0.4 + 0.01, `thickness 0.4 flattens ${node.id}`);
	assert.ok(radius3(node) <= shaped.extent + 1e-9, `inside the shell after reshaping ${node.id}`);
}
assert.equal(createGalaxy(graph, 1, { arms: 3 }).nodes.filter((node) => node.kind === "folder").map((node) => node.arm).sort().join(","), "0,1", "three arms still fit two suns");
assert.ok(galaxy.extent > 0.5 && galaxy.extent <= 1.25, `extent within the unit disc (${galaxy.extent.toFixed(2)})`);

const folders = galaxy.nodes.filter((node) => node.kind === "folder").sort((a, b) => a.discRadius - b.discRadius);
assert.equal(folders.length, 2, "two suns");
assert.ok(folders[0].discRadius <= folders[1].discRadius, "suns run outward along the arms");
assert.ok(new Set(folders.map((folder) => folder.arm)).size >= 1, "suns take arm slots");

/* A workspace-sized fixture: fifteen suns, two of them very busy, like a real
 * install. The cloud must fill the inner ~0.7 of the shell (r95 ≈ shell / 1.45). */
const bigCounts = [2, 5, 1, 1, 5, 3, 78, 3, 3, 15, 10, 1, 2, 103, 10];
const bigWorkspaces = { items: [], archivedSessionIds: [] };
const bigSessions = { ids: [], byId: {} };
bigCounts.forEach((count, folderIndex) => {
	const sessionIds = [];
	for (let index = 0; index < count; index += 1) {
		const id = `big-${folderIndex}-${index}`;
		sessionIds.push(id);
		bigSessions.ids.push(id);
		bigSessions.byId[id] = { id, displayTitle: id, cwd: `/w/${folderIndex}`, updatedAt: "2026-10-20T00:00:00Z" };
	}
	bigWorkspaces.items.push({ workspaceId: `bw${folderIndex}`, path: `/w/${folderIndex}`, title: `w${folderIndex}`, sessionIds });
});
const bigGraph = buildGraph(bigWorkspaces, bigSessions, {});
const percentile = (values, share) => values.slice().sort((a, b) => a - b)[Math.floor(values.length * share)];
const bigShapes = [
	{},
	{ arms: 3 },
	{ arms: 4 },
	{ twist: 1 },
	{ twist: 9 },
	{ thickness: 0.15 },
	{ thickness: 3 },
	{ spread: 0.3 },
	{ spread: 2.4 },
	...["rings", "field", "system", "helix", "web", "plate", "tree"].map((layout) => ({ layout })),
	...["rings", "field", "system", "helix", "web", "plate", "tree"].map((layout) => ({ layout, spread: 2.4, thickness: 3 }))
];
{
	const tree = createGalaxy(bigGraph, 1, { layout: "tree" });
	const spreadOf = (axis) => Math.sqrt(tree.nodes.reduce((sum, node) => sum + node[axis] * node[axis], 0) / tree.nodes.length);
	const [sx, sy, sz] = ["x", "y", "z"].map(spreadOf);
	assert.ok(sy >= 0.6 * Math.max(sx, sz), `tree reaches up and down as far as sideways (rms x ${sx.toFixed(2)} y ${sy.toFixed(2)} z ${sz.toFixed(2)})`);
	const suns = tree.nodes.filter((node) => node.kind === "folder");
	assert.ok(suns.some((node) => node.y > 0.3) && suns.some((node) => node.y < -0.3), "tree suns sit above and below the middle");
	// 星树放射: every body lies on a ray from the centre — a workspace's conversations share its
	// direction (cosine ≈ 1), and no body sits closer to the middle than the innermost ray.
	{
		const sunsOf = new Map(suns.map((sun) => [sun.id, sun]));
		const rays = tree.nodes
			.filter((node) => node.kind === "session" && sunsOf.has(node.folderId))
			.map((node) => {
				const sun = sunsOf.get(node.folderId);
				const a = [node.x, node.y, node.z];
				const b = [sun.x, sun.y, sun.z];
				const la = Math.hypot(...a);
				const lb = Math.hypot(...b);
				return (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (la * lb || 1);
			});
		const mean = rays.reduce((sum, value) => sum + value, 0) / Math.max(1, rays.length);
		assert.ok(mean > 0.9, `star radiate: conversations follow their workspace's ray (cos ${mean.toFixed(2)})`);
		const nearest = Math.min(...tree.nodes.map((node) => Math.hypot(node.x, node.y, node.z)));
		assert.ok(nearest > 0.2, `nothing collapses into the centre (nearest body at ${nearest.toFixed(2)})`);
	}
	const cube = createGalaxy(bigGraph, 1, { layout: "plate" });
	const cubeSuns = cube.nodes.filter((node) => node.kind === "folder");
	const ys = new Set(cubeSuns.map((node) => (node.y + cube.offset.y / (cube.offset.scale || 1)).toFixed(3)));
	assert.ok(ys.size >= 2 && Math.max(...cube.nodes.map((node) => Math.abs(node.y))) > 0.3, "方阵 is a solid cube: suns on several layers, not one sheet");
	assert.equal(layoutGuides("plate", null).length, 12, "方阵 guides are the cube's twelve edges");
	const minimal = migrateSettings({ settingsVersion: SETTINGS_VERSION, preset: "clusters", layout: "clusters" }).settings;
	assert.ok(minimal.preset === "minimal" && minimal.layout === "web" && minimal.bloomStrength === PRESETS.minimal.bloomStrength && minimal.backdrop === false, "a stored 星团 becomes 矩阵 (the preset that used to be 浑天)");
	const fromLattice = migrateSettings({ settingsVersion: SETTINGS_VERSION, preset: "lattice", layout: "lattice" }).settings;
	assert.ok(fromLattice.preset === "deepfield" && fromLattice.layout === "sphere" && fromLattice.linkOpacity === PRESETS.deepfield.linkOpacity, "a stored 晶格 becomes 浑天 (the armillary sphere)");
	assert.equal(migrateSettings({ settingsVersion: SETTINGS_VERSION, layout: "nonsense" }).settings.layout, DEFAULTS.layout, "an unknown layout falls back instead of becoming a disc");

	/* 双螺旋: the two strands carry the same number of stars, not the same number of workspaces. */
	const helix = createGalaxy(bigGraph, 1, { layout: "helix" });
	const helixHosts = new Map(helix.nodes.filter((node) => node.kind === "folder").map((node) => [node.id, node]));
	const strandStars = [0, 0];
	const strandSuns = [0, 0];
	const strandT = [[], []];
	for (const node of helix.nodes) {
		const strand = node.kind === "folder" ? node.strand : helixHosts.get(node.folderId).strand;
		if (node.kind === "folder") {
			strandSuns[strand] += 1;
			strandT[strand].push(node.t);
		} else strandStars[strand] += 1;
	}
	const strandTotal = [strandStars[0] + strandSuns[0], strandStars[1] + strandSuns[1]];
	assert.ok(Math.abs(strandTotal[0] - strandTotal[1]) <= Math.max(2, 0.06 * Math.max(...strandTotal)), `双螺旋 strands carry equal star counts (${strandTotal.join(" / ")})`);
	const byWeight = helix.nodes.filter((node) => node.kind === "folder").slice().sort((left, right) => right.count - left.count);
	assert.notEqual(byWeight[0].strand, byWeight[1].strand, "the two busiest workspaces ride different strands");
	assert.ok(byWeight[0].count > 4 * (byWeight[byWeight.length - 1].count + 1), "the fixture really is uneven, so the check above means something");
	for (const strand of [0, 1]) {
		assert.ok(strandSuns[strand] >= 1, `strand ${strand} has workspaces`);
		assert.ok(Math.min(...strandT[strand]) < 0.3 && Math.max(...strandT[strand]) > 0.7, `strand ${strand} runs the whole height (${Math.min(...strandT[strand]).toFixed(2)}..${Math.max(...strandT[strand]).toFixed(2)})`);
	}

	/* 太阳系: planets on their own orbits, moons clustered around each planet. */
	const system = createGalaxy(bigGraph, 1, { layout: "system" });
	const planets = system.nodes.filter((node) => node.kind === "folder").slice().sort((left, right) => Math.hypot(left.x, left.z) - Math.hypot(right.x, right.z));
	assert.ok(planets.length >= 2, "太陽系 places one planet per workspace");
	const orbits = planets.map((node) => Math.hypot(node.x, node.z));
	assert.ok(orbits.every((radius, index) => index === 0 || radius > orbits[index - 1] + 0.02), `planet orbits are strictly nested (${orbits.map((r) => r.toFixed(2)).join(", ")})`);
	assert.ok(orbits[0] >= 0.28 && orbits[orbits.length - 1] <= 1.05, "orbits stay between the inner and outer band");
	assert.equal(system.orbits.length, planets.length, "the galaxy carries one orbit radius per planet for the guide lines");
	assert.equal(layoutGuides("system", null, 2, system.orbits).length, planets.length, "太阳系 draws one orbit line per planet");
	const moons = system.nodes.filter((node) => node.kind === "session");
	const hostOf = new Map(planets.map((node) => [node.id, node]));
	assert.ok(moons.every((moon) => Math.hypot(moon.x - hostOf.get(moon.folderId).x, moon.z - hostOf.get(moon.folderId).z) < 0.13), "every moon orbits inside its planet's own patch of space");
	// 太阳系 moons are a small shell around their planet, not a flat disc: every moon is
	// the same distance from its planet whichever axis you measure on.
	const moonsInShell = moons.map((moon) => {
		const host = hostOf.get(moon.folderId);
		return Math.hypot(moon.x - host.x, moon.y - host.y, moon.z - host.z);
	});
	const shellRadii = [...new Set(moonsInShell.map((radius) => Math.round(radius * 100)))];
	assert.ok(shellRadii.length >= 2, `moons sit on at least two shells (${shellRadii.length} distinct radii)`);
	assert.ok(moons.every((moon) => Math.abs(moon.y - hostOf.get(moon.folderId).y) >= 0), "moons may leave the planet's plane");
	const outOfPlane = moons.filter((moon) => Math.abs(moon.y - hostOf.get(moon.folderId).y) > 0.012).length;
	assert.ok(outOfPlane > moons.length * 0.4, `most moons are off the ecliptic plane, so the cluster is a ball (${outOfPlane}/${moons.length})`);
	assert.equal(migrateSettings({ settingsVersion: SETTINGS_VERSION, preset: "bubble", layout: "bubble" }).settings.preset, "system", "a stored 球壳 becomes 太阳系");

	/* 星环: rings are dealt by weight and centred on the origin, so no ring is a straggler and
	 * the guide circles sit exactly where the bodies are. */
	{
		const counts = [12, 4, 1, 2, 1, 60, 30, 1, 1, 78, 40, 1, 2, 11];
		const ws = { items: counts.map((n, i) => ({ workspaceId: `gw${i}`, path: `/g/${i}`, title: `g${i}`, sessionIds: Array.from({ length: n }, (_, j) => `gs${i}-${j}`) })), archivedSessionIds: [] };
		const ss = { ids: [], byId: {} };
		for (const w of ws.items) for (const id of w.sessionIds) { ss.ids.push(id); ss.byId[id] = { id, displayTitle: id, cwd: w.path, updatedAt: "2026-10-24T00:00:00Z" }; }
		const rings = createGalaxy(buildGraph(ws, ss, {}), 1, { layout: "rings" });
		const groups = new Map();
		for (const node of rings.nodes) {
			if (node.ring === undefined) continue;
			if (!groups.has(node.ring)) groups.set(node.ring, []);
			groups.get(node.ring).push(node);
		}
		const sizes = [...groups.values()].map((list) => list.length);
		const most = Math.max(...sizes);
		const least = Math.min(...sizes);
		assert.ok(least > most * 0.4, `every ring carries bodies (${sizes.join("/")})`);
		// Each ring keeps its own radius, so the guide circles coincide with the bodies.
		for (const [ring, list] of groups) {
			const radii = list.map((node) => Math.hypot(node.x, node.z));
			const spread = Math.max(...radii) - Math.min(...radii);
			assert.ok(spread < 0.12, `ring ${ring} stays on its circle (${spread.toFixed(3)} spread)`);
			const sectors = new Set(list.map((node) => Math.floor(((Math.atan2(node.z, node.x) + Math.PI) / (Math.PI * 2)) * 8)));
			assert.ok(sectors.size >= 6, `ring ${ring} covers most of the circle (${sectors.size}/8 sectors)`);
		}
	}

	/* 星环's clock: one stored base angle, then time × speed — never read off the live position,
	 * which folded the clock into the angle every frame and let the ring accelerate. */
	{
		// Its own graph: createGalaxy reuses the node objects, so sharing `bigGraph` here would
		// move the 太阳系 fixture the next block measures.
		const counts = [3, 5];
		const ws = { items: counts.map((n, i) => ({ workspaceId: `cw${i}`, path: `/c/${i}`, title: `c${i}`, sessionIds: Array.from({ length: n }, (_, j) => `cs${i}-${j}`) })), archivedSessionIds: [] };
		const ss = { ids: [], byId: {} };
		for (const w of ws.items) for (const id of w.sessionIds) { ss.ids.push(id); ss.byId[id] = { id, displayTitle: id, cwd: w.path, updatedAt: "2026-10-24T00:00:00Z" }; }
		const rings = createGalaxy(buildGraph(ws, ss, {}), 1, { layout: "rings" });
		const star = rings.nodes.find((node) => node.ring !== undefined);
		const at = (t) => {
			orbitRings(rings, t);
			return Math.atan2(star.z, star.x);
		};
		const step = (from, to) => {
			let delta = Math.abs(at(to) - at(from));
			if (delta > Math.PI) delta = Math.PI * 2 - delta;
			return delta;
		};
		const first = step(1, 2);
		const later = step(20, 21);
		assert.ok(Math.abs(first - later) < first * 0.05, `星环 holds one speed over time (${((first * 180) / Math.PI).toFixed(2)}°/s early, ${((later * 180) / Math.PI).toFixed(2)}°/s at 20 s)`);
		assert.ok(first > 0 && first < 0.2, `and it is slow: ${((Math.PI * 2) / first).toFixed(0)} s per lap`);
	}

	/* 太阳系 revolves: planets about the sun, moons about their planet, from the clock. */
	const before = system.nodes.map((node) => [node.x, node.z]);
	const moonsBefore = moons.map((moon) => Math.hypot(moon.x - hostOf.get(moon.folderId).x, moon.y - hostOf.get(moon.folderId).y, moon.z - hostOf.get(moon.folderId).z));
	const near = (left, right) => left.length === right.length && left.every(([x, z], index) => Math.abs(x - right[index][0]) < 1e-9 && Math.abs(z - right[index][1]) < 1e-9);
	orbitSystem(system, 0);
	assert.ok(near(system.nodes.map((node) => [node.x, node.z]), before), "the orbit is a pure function of time: t=0 is the placed galaxy");
	orbitSystem(system, 10);
	const planetsMoved = planets.filter((planet, index) => Math.hypot(planet.x - before[index][0], planet.z - before[index][1]) > 1e-6).length;
	assert.ok(planetsMoved >= planets.length - 1, `planets travel around the sun (${planetsMoved}/${planets.length} moved in 10 s)`);
	const moonsAfter = moons.map((moon) => Math.hypot(moon.x - hostOf.get(moon.folderId).x, moon.y - hostOf.get(moon.folderId).y, moon.z - hostOf.get(moon.folderId).z));
	assert.ok(moonsAfter.every((radius, index) => Math.abs(radius - moonsBefore[index]) < 1e-9), "moons keep their shell while they circle their planet");
	orbitSystem(system, 0);
	assert.ok(near(system.nodes.map((node) => [node.x, node.z]), before), "rewinding the clock puts every body back, so nothing integrates");

	/* Camera: a free 360° orbit needs an orthonormal basis at every pitch, poles included. */
	for (const degrees of [0, 45, 89, 90, 91, 135, 180, -90, -170]) {
		const basis = cameraBasis(createCamera({ distance: 3, pitch: (degrees * Math.PI) / 180, yaw: 0.7 }));
		const length = (v) => Math.hypot(v.x, v.y, v.z);
		const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
		const axes = [basis.right, basis.up, basis.forward];
		assert.ok(axes.every((v) => [v.x, v.y, v.z].every(Number.isFinite)), `camera basis is finite at pitch ${degrees}°`);
		assert.ok(axes.every((v) => Math.abs(length(v) - 1) < 1e-9), `camera axes are unit length at pitch ${degrees}°`);
		assert.ok(Math.abs(dot(basis.right, basis.up)) < 1e-9 && Math.abs(dot(basis.right, basis.forward)) < 1e-9 && Math.abs(dot(basis.up, basis.forward)) < 1e-9, `camera axes stay orthogonal at pitch ${degrees}°`);
		const point = projectPoint({ x: 0.5, y: 0.2, z: -0.3 }, basis, { width: 1000, height: 700 });
		assert.ok(point !== null && Number.isFinite(point.x) && Number.isFinite(point.y), `stars still project at pitch ${degrees}°`);
	}

	/* 星环: every body knows its ring, each ring takes its own palette slot, and the
	 * whole picture turns along the ring lines in a double helix. */
	{
		const rings = createGalaxy(bigGraph, 1, { layout: "rings" });
		const bodies = rings.nodes.filter((node) => node.ring !== undefined);
		assert.ok(bodies.length > 0, "星环 tags every body with its ring");
		const hues = new Map();
		for (const node of bodies) if (!hues.has(node.ring)) hues.set(node.ring, node.hueIndex);
		assert.equal(new Set(hues.values()).size, hues.size, "each ring owns its own palette slot");
		const body = bodies.find((node) => node.kind === "session" && node.ring === 0);
		const raw = () => Math.hypot(body.x, body.z);
		orbitRings(rings, 0);
		const start = { radius: raw(), y: body.y, angle: Math.atan2(body.z, body.x) };
		orbitRings(rings, 3);
		const mid = { radius: raw(), y: body.y, angle: Math.atan2(body.z, body.x) };
		orbitRings(rings, 8);
		const end = { radius: raw(), y: body.y, angle: Math.atan2(body.z, body.x) };
		assert.ok([start, mid, end].every((frame) => Math.abs(frame.radius - start.radius) < 1e-9), "a body keeps its ring radius while it travels");
		assert.ok(Math.abs(end.angle - start.angle) > 0.2, "a body travels along its ring");
		assert.ok(Math.max(start.y, mid.y, end.y) - Math.min(start.y, mid.y, end.y) > 0.02, "and weaves above and below the ring line");
		const strands = new Set(bodies.map((node) => node.strandIndex));
		assert.deepEqual([...strands].sort(), [0, 1], "both strands of the helix are populated");
		orbitRings(rings, 0);
		assert.ok(Math.abs(raw() - start.radius) < 1e-9, "rewinding the clock puts the rings back");
	}

	/* 极简（记忆库样式）: the memory library's two ranks — bodies on three arms, their own
	 * satellites in a small ring around each, nothing in the core and no dust. */
	{
		const map = createGalaxy(bigGraph, 1, { layout: "memory" });
		const suns = map.nodes.filter((node) => node.kind === "folder");
		const stars = map.nodes.filter((node) => node.kind === "session");
		const centre = map.offset ?? { x: 0, z: 0 };
		const radial = (node) => Math.hypot(node.x - centre.x, node.z - centre.z);
		assert.ok(suns.every((node) => radial(node) >= 0.45 && radial(node) <= 1.05), "极简 puts every workspace on an arm, as 记忆库 puts its skills");
		// No workspace in the core; a satellite of an inner-arm workspace may lean in past
		// 0.3, exactly as a memory-library call ring does.
		const inCore = stars.filter((node) => radial(node) <= 0.3).length;
		assert.ok(inCore < stars.length * 0.1, `the core stays nearly empty (${inCore}/${stars.length} satellites lean in)`);
		assert.equal(layoutGuides("memory", null, 2).length, 0, "极简 draws no skeleton, like 记忆库");
		assert.equal(map.dust.length, 0, "极简 draws no dust grains: 记忆库 is bare black behind one haze");
		// A conversation is a call dot: it stays inside its workspace's own 0.02–0.3 ring,
		// so the links are short satellites instead of spokes from the middle.
		const sunIds = new Set(suns.map((node) => node.id));
		const host = new Map(suns.map((node) => [node.id, node]));
		const satellite = stars.filter((node) => sunIds.has(node.folderId)).map((node) => {
			const hub = host.get(node.folderId);
			return Math.hypot(node.x - hub.x, node.y - hub.y, node.z - hub.z);
		});
		assert.ok(satellite.length > stars.length * 0.6, `most conversations orbit their own workspace (${satellite.length}/${stars.length})`);
		// The memory library's own call-ring radii: 16 dots to a ring, rings at 0.05 / 0.085.
		assert.ok(Math.max(...satellite) < 0.34, `every conversation sits inside its workspace's ring (max ${Math.max(...satellite).toFixed(2)})`);
		// Both of the memory library's rings show up, and nothing else inside 0.1.
		const ringRadii = [...new Set(satellite.filter((radius) => radius < 0.1).map((radius) => Math.round(radius * 1000) / 1000))];
		const nearRing = (radius, target) => Math.abs(radius - target) < 0.02;
		assert.ok(ringRadii.every((radius) => nearRing(radius, 0.05) || nearRing(radius, 0.085)), `极简 rides 记忆库's 0.05 / 0.085 call rings (${ringRadii.slice(0, 4).join(", ")})`);
		const spokes = map.links
			.map((link) => {
				const a = map.nodes[link.a];
				const b = map.nodes[link.b];
				return a === undefined || b === undefined ? 0 : Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
			})
			.sort((left, right) => left - right);
		assert.ok(spokes[spokes.length - 1] < 0.34, `极简's links are short satellites, not spokes (longest ${spokes[spokes.length - 1].toFixed(2)})`);
		// Three balanced arms by workspace weight.
		const sorted = suns.slice().sort((left, right) => (right.count ?? 0) - (left.count ?? 0) || String(left.id).localeCompare(String(right.id)));
		const dealt = [0, 0, 0];
		sorted.forEach((node, index) => { dealt[index % 3] += 1; });
		assert.ok(Math.max(...dealt) - Math.min(...dealt) <= 1, `极简's three arms take the workspaces in turn (${dealt.join("/")})`);
	}

	/* 深空场: an even scatter with no skeleton — the field's whole point. */
	const field = createGalaxy(bigGraph, 1, { layout: "field" });
	assert.equal(layoutGuides("field", null, 2).length, 0, "深空场 draws no guides");
	const axisSpread = (axis) => Math.sqrt(field.nodes.reduce((sum, node) => sum + node[axis] * node[axis], 0) / field.nodes.length);
	const [fx, fy, fz] = ["x", "y", "z"].map(axisSpread);
	assert.ok(fx > 0.3 && fz > 0.3, `深空场 is wide in both horizontal axes (rms ${fx.toFixed(2)}, ${fz.toFixed(2)})`);
	assert.ok(fy > 0.4 * Math.max(fx, fz), `深空场 has real depth (rms y ${fy.toFixed(2)})`);
	const fieldSuns = field.nodes.filter((node) => node.kind === "folder");
	const layers = new Set(fieldSuns.map((node) => Math.round(node.y * 20)));
	assert.ok(layers.size >= Math.min(8, fieldSuns.length), `深空场 suns sit at their own depths (${layers.size} layers for ${fieldSuns.length} suns)`);
	const flatRing = Math.hypot(fieldSuns[0].x, fieldSuns[0].z);
	assert.ok(flatRing > 0.1, "no sun sits on the origin");
	assert.ok(layoutGuides("tree", null, 2).every((line) => Math.abs(Math.hypot(...line[1]) - 1) < 1e-9) && layoutGuides("tree", null, 2).some((line) => Math.abs(line[1][1]) > 0.5), "tree guides are 3D spokes");
}
for (const shape of bigShapes) {
	const label = JSON.stringify(shape);
	const built = createGalaxy(bigGraph, 1, shape);
	const first = built.nodes.map((node) => [node.x, node.y, node.z]);
	assert.deepEqual(createGalaxy(bigGraph, 1, shape).nodes.map((node) => [node.x, node.y, node.z]), first, `${label}: deterministic`);
	const shell = shellOf(built);
	assert.ok(built.extent > 0.5 && built.extent <= 1.7, `${label}: extent ${built.extent.toFixed(2)} in range`);
	for (const node of built.nodes) {
		assert.ok([node.x, node.y, node.z].every(Number.isFinite), `${label}: finite ${node.id}`);
		assert.ok(radius3(node) <= shell * 0.85, `${label}: ${node.id} inside the shell`);
	}
	const r95 = percentile(built.nodes.map(radius3), 0.95) / shell;
	assert.ok(r95 >= 0.55 && r95 <= 0.82, `${label}: node cloud r95 ${r95.toFixed(2)} of the shell`);
	if (shape.layout === undefined) {
		const thick = Math.max(0.15, Math.min(3, shape.thickness ?? 1));
		assert.ok(built.nodes.every((node) => Math.abs(node.y) <= 0.14 * thick + 0.01), `${label}: disc thickness follows the slider`);
		const bigFolders = built.nodes.filter((node) => node.kind === "folder");
		const armsUsed = new Set(bigFolders.map((node) => node.arm)).size;
		assert.equal(armsUsed, Math.round(shape.arms ?? 2), `${label}: one arm per arm slot`);
		const core = built.nodes.filter((node) => Math.hypot(node.x, node.z) < 0.15 * shell).length / built.nodes.length;
		assert.ok(core <= 0.04, `${label}: sparse core (${(core * 100).toFixed(1)}% within 0.15 R)`);
		for (let arm = 0; arm < armsUsed; arm += 1) {
			const radii = bigFolders.filter((node) => node.arm === arm).map((node) => node.discRadius);
			assert.ok(radii.every((value, index) => index === 0 || value >= radii[index - 1]), `${label}: suns run outward along arm ${arm}`);
		}
		const innerSuns = bigFolders.filter((node) => node.discRadius < 0.36).length;
		assert.equal(innerSuns, 0, `${label}: suns spread along the arms, none packed inside r 0.36`);
		const innerStars = built.nodes.filter((node) => Math.hypot(node.x, node.z) < 0.36).length / built.nodes.length;
		assert.ok(innerStars <= 0.1, `${label}: stars spread along the arms (${(innerStars * 100).toFixed(1)}% inside r 0.36)`);
	}
}
/* ── camera: orthonormal basis, everything in front, framed ──────────────── */

const viewport = { width: 1280, height: 800 };
const camera = createCamera({ distance: fitDistance(galaxy.extent, 0.82) * 1.04 });
const basis = cameraBasis(camera);
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
assert.ok(Math.abs(dot(basis.right, basis.forward)) < 1e-6, "right ⟂ forward");
assert.ok(Math.abs(dot(basis.up, basis.forward)) < 1e-6, "up ⟂ forward");
assert.ok(Math.abs(dot(basis.right, basis.up)) < 1e-6, "right ⟂ up");
assert.ok(camera.distance > galaxy.extent, "camera sits outside the disc");

let onScreen = 0;
for (const node of galaxy.nodes) {
	const point = projectPoint(node, basis, viewport);
	assert.ok(point !== null, `node ${node.id} stays in front of the camera`);
	assert.ok(point.depth > 0, "depth is positive");
	onScreen += point.x > -200 && point.x < viewport.width + 200 && point.y > -200 && point.y < viewport.height + 200 ? 1 : 0;
}
assert.equal(onScreen, galaxy.nodes.length, "the whole galaxy is framed");

const center = projectPoint({ x: 0, y: 0, z: 0 }, basis, viewport);
assert.ok(Math.hypot(center.x - viewport.width / 2, center.y - viewport.height / 2) < 1e-6, "the core projects to the viewport centre");
assert.equal(neighboursOf(galaxy).get("s1").has("s2"), true, "neighbour index carries lineage");

/* ── sky shell: thin band, independent streams, bucketed ─────────────────── */

const sky = createSkyShell();
assert.equal(sky.count, SKY_CLASSES.reduce((sum, klass) => sum + klass.count, 0), "sky shell holds every class");
assert.deepEqual(SKY_CLASSES.map((klass) => klass.count), [5200, 1800, 500], "sky densities 5200/1800/500 (half drawn at the default 球壳密度)");
assert.deepEqual(SKY_CLASSES.map((klass) => klass.size), [1.2, 2, 3], "sky squares are 1.2/2/3 CSS px");
const skyOctants = new Array(8).fill(0);
const skyGrid = new Array(36).fill(0);
for (let index = 0; index < sky.count; index += 1) {
	const radius = Math.hypot(sky.x[index], sky.y[index], sky.z[index]);
	assert.ok(radius >= SKY_RADIUS * 0.95 - 1e-5 && radius <= SKY_RADIUS * 1.05 + 1e-5, `sky grain ${index} sits in the thin shell (${radius.toFixed(3)})`);
	skyOctants[(sky.x[index] > 0 ? 1 : 0) + (sky.y[index] > 0 ? 2 : 0) + (sky.z[index] > 0 ? 4 : 0)] += 1;
	// Equal-area cells: azimuth x cos(polar). Correlated hash keys show up here as stripes.
	const azimuth = (Math.atan2(sky.z[index], sky.x[index]) + Math.PI) / (2 * Math.PI);
	const lift = (sky.y[index] / radius + 1) / 2;
	skyGrid[Math.min(5, Math.floor(lift * 6)) * 6 + Math.min(5, Math.floor(azimuth * 6))] += 1;
	if (index > 0) assert.ok(sky.cls[index] * SKY_TINTS.length + sky.tint[index] >= sky.cls[index - 1] * SKY_TINTS.length + sky.tint[index - 1], "sky grains are sorted by bucket");
}
const octantMean = sky.count / 8;
for (const count of skyOctants) assert.ok(Math.abs(count - octantMean) / octantMean < 0.1, `sky octants balanced (${skyOctants.join(",")})`);
const gridMean = sky.count / 36;
const gridCv = Math.sqrt(skyGrid.reduce((sum, count) => sum + (count - gridMean) ** 2, 0) / 36) / gridMean;
assert.ok(gridCv < 0.12, `sky 6x6 direction histogram is flat (cv ${gridCv.toFixed(3)})`);
assert.ok(Math.min(...skyGrid) > gridMean * 0.7, "no empty or starved sky cell");
for (let bucket = 0; bucket < SKY_BUCKETS; bucket += 1) {
	for (let index = sky.bucketStart[bucket]; index < sky.bucketEnd[bucket]; index += 1) {
		assert.equal(sky.cls[index] * SKY_TINTS.length + sky.tint[index], bucket, "bucket ranges hold their own grains");
	}
}
const keepSorted = Array.from(sky.keep).sort((a, b) => a - b);
assert.ok(Math.abs(keepSorted[Math.floor(sky.count * 0.3)] - 0.3) < 0.03, "thinning rank is uniform");
assert.ok(sky.large.length === 500 && sky.large.every((index) => sky.cls[index] === 2), "twinkle candidates are the L class");
for (const hue of [0, 30, 60, 120, 180, 200, 240, 280, 320]) {
	for (const touched of [false, true]) {
		const end = linkEnd(starPlateau(hue), touched);
		const [lightness, a, b] = srgbToOklab(end);
		assert.ok(Math.abs(lightness - (touched ? 0.84 : 0.74)) < 0.01 && Math.hypot(a, b) <= (touched ? 0.095 : 0.07) + 0.004, `link end at ${hue}° has the shared OKLCH lightness and capped chroma`);
		assert.ok(relativeLuminance(end) > 0.3, `link end at ${hue}° stays bright`);
	}
}
{
	const green = [0x5a, 0x9a, 0x40];
	assert.deepEqual(linkShade(green, 1), green, "连线亮度 1 leaves the colour alone");
	const [base] = srgbToOklab(green);
	const [dim] = srgbToOklab(linkShade(green, 0.5));
	const [lifted, la, lb] = srgbToOklab(linkShade(green, 1.4));
	assert.ok(dim < base - 0.2 && lifted > base + 0.05, "连线亮度 darkens below 1 and lifts above it");
	assert.ok(Math.hypot(la, lb) > 0.06, "a lifted green link stays green");
	assert.ok(Math.min(...linkShade(green, 2.5)) >= 245, "连线亮度 2.5 is near white");
}
assert.ok(SKY_TINTS.some(([r, , b]) => r - b > 15), "the shell carries a faint warm tint");
assert.ok(SKY_TINTS.every(([r, , b]) => r - b <= 30), "no shell tint is strongly yellow or orange");
for (const [r, g, b] of SKY_TINTS) {
	assert.ok(Math.max(r, g, b) <= 230, "sky tints never reach pure white");
	assert.ok((Math.max(r, g, b) - Math.min(r, g, b)) / Math.max(r, g, b) < 0.35, "sky tints are faint colours, never saturated (S < 0.35)");
}
const field = createFieldStars();
assert.equal(field.count, 780, "field stars: 780 inner grains");
for (let index = 0; index < field.count; index += 1) {
	const radius = Math.hypot(field.x[index], field.y[index], field.z[index]);
	assert.ok(radius >= FIELD_RADIUS * 0.3 - 1e-5 && radius <= FIELD_RADIUS + 1e-5, "field stars stay in their hollow inner volume");
}
const skyTwin = createSkyShell();
assert.deepEqual(Array.from(skyTwin.x.slice(0, 50)), Array.from(sky.x.slice(0, 50)), "sky shell is deterministic");

/* ── settings: versioned migration, palette, i18n ─────────────────────────── */
const oldFormat = {
	preset: "galaxy",
	theme: "hubble",
	field: 0.2,
	shellGlow: 1.8,
	brightness: 0.9,
	bloom: 0.9,
	quality: "low",
	hidden: ["w2", 7],
	filterText: "abc",
	lens: "running",
	orphans: true,
	empty: true,
	autoOrbit: false,
	tour: true,
	only: "w1"
};
const migrated = migrateSettings(oldFormat);
assert.equal(migrated.migrated, true, "a stored object without a version migrates");
assert.equal(migrated.settings.settingsVersion, SETTINGS_VERSION, "migration stamps the current version");
for (const key of Object.keys(DEFAULTS)) {
	if (PRESERVED_KEYS.includes(key) || key === "settingsVersion") continue;
	assert.deepEqual(migrated.settings[key], DEFAULTS[key], `migration resets visual key ${key}`);
}
assert.equal(migrated.settings.theme, DEFAULT_THEME, "migration lands on the new default theme");
assert.deepEqual(migrated.settings.hidden, ["w2"], "migration keeps hidden (string ids only)");
assert.equal(migrated.settings.only, "w1", "migration keeps the isolate pin");
assert.equal(migrated.settings.filterText, "abc", "migration keeps the name filter");
assert.equal(migrated.settings.lens, "running", "migration keeps the lens");
assert.equal(migrated.settings.orphans, true, "migration keeps orphans");
assert.equal(migrated.settings.empty, true, "migration keeps empty");
assert.equal(migrated.settings.autoOrbit, false, "migration keeps autoOrbit");
assert.equal(migrated.settings.tour, true, "migration keeps tour");
assert.ok(!("settingsVersion" in oldFormat), "migration does not mutate its input");

const userChanged = { ...migrated.settings, theme: "neon", brightness: 0.8 };
const second = migrateSettings(JSON.parse(JSON.stringify(userChanged)));
assert.equal(second.migrated, false, "a current-version object does not migrate again");
assert.equal(second.settings.theme, "neon", "user theme choice survives after migration");
assert.equal(second.settings.brightness, 0.8, "user slider survives after migration");

for (const junk of [null, undefined, "garbage", 42, [1, 2]]) {
	const result = migrateSettings(junk);
	assert.deepEqual(result.settings, DEFAULTS, `unusable stored value ${JSON.stringify(junk)} falls back to defaults`);
}
const healed = migrateSettings({ settingsVersion: SETTINGS_VERSION, hidden: ["w1"], only: "w1" });
assert.equal(healed.settings.only, null, "an isolate pin on a hidden workspace is dropped");
assert.deepEqual(healed.settings.hidden, [], "and that workspace is unhidden");
assert.equal(healed.migrated, true, "the healed state is written back");
const healedOld = migrateSettings({ hidden: ["w1"], only: "w1", theme: "neon" });
assert.equal(healedOld.settings.only, null, "healing still applies during a version migration");

assert.equal(PRESETS.galaxy.theme, DEFAULT_THEME, "the default preset uses the default theme");
assert.equal(PRESETS[DEFAULTS.preset].layout, DEFAULTS.layout, "default preset and layout agree");
assert.equal(DEFAULTS.layout, "spiral", "default layout is the spiral");
const isCool = (hue) => hue >= 140 && hue <= 270;
const isWarm = (hue) => hue <= 60 || hue >= 300;
const deepHues = THEMES[DEFAULT_THEME].hues;
assert.ok(deepHues.length >= 8, "default palette has at least eight slots");
assert.equal(THEMES[DEFAULT_THEME].tones.length, deepHues.length, "default palette has one tone per slot");
deepHues.forEach((hue, index) => {
	assert.ok(index % 2 === 0 ? isCool(hue) : isWarm(hue), `default palette slot ${index} (${hue}°) alternates cool/warm`);
});
for (const name of ["hubble", "neon", "sunset", "cyber", "matrix", "aurora"]) {
	assert.notDeepEqual(THEMES[name].hues, deepHues, `${name} keeps its own palette`);
}

const clientSource = readFileSync(join(root, "src/client.js"), "utf8");
const dictionaryKeys = (name) => {
	const start = clientSource.indexOf(`const ${name} = {`);
	assert.ok(start >= 0, `dictionary ${name} present`);
	const body = clientSource.slice(start, clientSource.indexOf("\n};", start));
	return new Set([...body.matchAll(/^\t"([^"]+)":/gm)].map((match) => match[1]));
};
const zhKeys = dictionaryKeys("zh");
const enKeys = dictionaryKeys("en");
assert.deepEqual([...zhKeys].filter((key) => !enKeys.has(key)), [], "every zh key has an en entry");
assert.deepEqual([...enKeys].filter((key) => !zhKeys.has(key)), [], "every en key has a zh entry");
const usedKeys = new Set([...clientSource.matchAll(/\bt\(\s*"([^"]+)"/g)].map((match) => match[1]));
for (const match of clientSource.matchAll(/\bt\([^()]*\?\s*"([^"]+)"\s*:\s*"([^"]+)"/g)) {
	usedKeys.add(match[1]);
	usedKeys.add(match[2]);
}
for (const name of Object.keys(THEMES)) usedKeys.add(`theme.${name}`);
for (const name of Object.keys(PRESETS)) usedKeys.add(`preset.${name}`);
for (const key of usedKeys) assert.ok(zhKeys.has(key) && enKeys.has(key), `t("${key}") is in both dictionaries`);
assert.equal(clientSource.split("const linkColor = {").length - 1, 0, "no stray single-colour filament palette (links use linkLookFor)");
{
	const renderAt = clientSource.indexOf("function renderScene(");
	const render = clientSource.slice(renderAt, clientSource.indexOf("\n}\n", renderAt));
	const starsAt = render.indexOf("// Stars, far to near");
	const starPass = render.slice(starsAt, render.indexOf("// Captions:", starsAt));
	assert.ok(starsAt >= 0, "renderScene has the star pass");
	assert.ok(!render.includes("createRadialGradient"), "renderScene builds no radial gradients per frame (stars and halos are cached sprites)");
	assert.ok(render.split("createLinearGradient").length - 1 === 1 && render.includes("const gradientOf = (a, b, index, colours)"), "the only per-frame gradient is the link colour ramp");
	assert.ok(!clientSource.includes("glowSprite"), "no node-scaled glowSprite skirt");
	assert.ok(!/rgba\(6,\s*8,\s*14/.test(clientSource), "no dark outline strokes around star bodies");
	assert.ok(!/hsla?\(\$\{[^}]+\},\s*(8[5-9]|9\d|100)%/.test(starPass), "no saturated (S >= 85%) solid star bodies");
	assert.ok(starPass.includes("discSprite(") && starPass.includes("haloSprite(entry.hue, HALO_INNER"), "bodies are cached disc sprites with fixed-px halos");
	const linkAt = render.indexOf("// Links (recipe §3)");
	const linkPass = render.slice(linkAt, starsAt);
	assert.ok(linkAt >= 0 && linkPass.includes('globalCompositeOperation = "source-over"') && linkPass.includes("lineWidth = (Math.max(1, dprNow * 1.1) / dprNow) * widthScale"), "links: source-over, ~1.1 CSS px times 连线粗细");
	assert.ok(linkPass.includes("const restingLinks = chosen !== null || route !== null || settings.showLinks !== false;") && linkPass.includes("const showResting = linkScale > 0 && restingLinks;") && linkPass.includes("if (gradientLinks && showResting)") && linkPass.includes("showResting && !gradientLinks;"), "显示连线 off hides resting links (gradient and solid) unless a star or route is chosen");
	assert.ok(linkPass.split("for (let pass = lastPass; pass >= 0").length - 1 === 2, "both link paths walk the classes from lastPass down");
	assert.ok(linkPass.includes("const lastPass = chosen !== null || route !== null ? 1 : linkAlpha.length - 1;"), "a selection drops the dimmed (unrelated) link class");
	assert.ok(linkPass.includes("if (restingAlpha(pass) >= 0.999)") && linkPass.includes("context.drawImage(target.canvas, 0, 0, width, height)") && !linkPass.includes('"lighten"'), "opaque link classes stroke straight onto the frame; a translucent one lands once from a source-over layer");
	assert.ok(render.includes('context.imageSmoothingQuality = "low";') && !clientSource.includes('imageSmoothingQuality = "high"'), "no bicubic resampling: it leaked into every sprite draw and cost most of the frame");
	assert.ok(!linkPass.includes('"lighter"'), "links are never additive");
	assert.ok(/entry\.dot|dot: /.test(render) && /projected\.push\(\{ node, x: point\.x, y: point\.y, depth: point\.depth, radius, dot:/.test(render), "projected entries carry the drawn dot");
	assert.ok(!/state\.trackNode !== null && state\.cam\.distance </.test(render), "no proximity bloom around the tracked star");
	assert.ok(!/Nucleus|nucleus\(/.test(render), "no nucleus / central light draw");
	const loopAt = clientSource.indexOf("const frame = (now) =>");
	const loop = clientSource.slice(loopAt, clientSource.indexOf("loopRef.current.ensure = ", loopAt));
	assert.ok(/try \{[\s\S]*renderScene\(canvas, state\);[\s\S]*state\.drawMs = [\s\S]*\} catch \(error\)/.test(loop), "the frame loop catches render exceptions and records drawMs");
	assert.ok(!clientSource.includes("bakeNebula") && render.includes("paintHaze(context, state, theme, skyBasis, reveal, budget);") && !/\bday\b/.test(clientSource), "no screen-space veil spots or vignette; every theme uses world haze, and the daylight branch is gone");
}
assert.ok(Object.values(THEMES).every((theme) => theme.base === "#000000"), "every theme sits on a pure black plane");

/* ── stars, links, haze: the Galaxy View node recipe ─────────────────────── */
for (const name of Object.keys(THEMES)) {
	for (const [slot, hue] of THEMES[name].hues.entries()) {
		const tone = THEMES[name].tones?.[slot] ?? null;
		const plateau = starPlateau(hue, undefined, tone);
		const [, s, l] = rgbToHsl(...plateau);
		assert.ok(Math.max(...plateau) <= STAR_PEAK, `${name} ${hue}°: plateau peak <= ${STAR_PEAK}`);
		// The recipe's plateau is L 0.66; it is lifted to 0.72 because at these sizes the
		// reference's darker plate read as glass rather than as a solid star.
		assert.ok(tone === null ? s >= 0.6 && s <= 0.9 && l >= 0.5 && l <= 0.76 : s >= 0.3 && s <= 0.92 && l >= 0.6 && l <= 0.88, `${name} ${hue}°: plateau S/L in the lifted band (${s.toFixed(2)}, ${l.toFixed(2)})`);
		const centre = discColour(plateau, discSample(0)[1]);
		const lum = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;
		assert.ok(lum(centre) > lum(plateau) && Math.max(...centre) <= 252, `${name} ${hue}°: white-hot core lighter than the plateau, never pure white`);
		const link = linkTint(plateau, plateau);
		// The wire sits at L 0.81 (the reference's 0.76 read too grey, 0.84 read too bright):
		// bright threads that still sit under the stars.
		assert.ok(Math.abs(rgbToHsl(...link)[2] - 0.81) < 0.01 && Math.abs(rgbToHsl(...link)[1] - s * 0.4) < 0.04, `${name} ${hue}°: link tint keeps 0.4× saturation on a near-white wire`);
	}
}
assert.deepEqual(discSample(0.5), [0, 0], "disc alpha reaches 0 at the rim");
assert.equal(discSample(0.45)[0], 1, "disc is solid to 0.9 rd");
assert.ok(discSample(0)[1] > 0.7 && discSample(0.05)[1] > discSample(0.12)[1] && discSample(0.12)[1] > discSample(0.24)[1] && discSample(0.5)[1] === 0, "white mix falls off from the centre and is spent well before the rim");
assert.ok(Math.abs(innerHaloAlpha(3) - 0.72) < 1e-9 && Math.abs(innerHaloAlpha(1.5) - 0.18) < 1e-9, "inner halo alpha 0.72·min(1,(rd/3)²)");
assert.deepEqual([HALO_INNER.sigma, HALO_OUTER.sigma], [3.4, 11], "halos are fixed sigma 3.4 / 11 CSS px");

/* 星体亮度 is SETTLED — the owner approved this exact look (2026-10). These numbers are a
 * gate, not a preference: if a change trips them, the change is what is wrong. Ask first. */
assert.equal(STAR_LIGHTNESS, 0.72, "settled: body plateau lightness");
assert.equal(STAR_PEAK, 250, "settled: body peak channel");
assert.equal(Math.round(brightnessGain(0.5) * 1e6) / 1e6, 1, "settled: 亮度 0.5 is exactly neutral");
assert.equal(Math.round(brightnessGain(1.6) * 100) / 100, 2.32, "settled: 亮度 top end is 2.32×");
assert.deepEqual(discSample(0.25), [1, 0], "settled: disc profile (opaque to 0.96 of the radius, no white left at half radius)");
// 星体 colour ramp, owner-specified: a small white-hot core that fades into the body's own
// hue, opaque throughout. White must not creep past ~a quarter of the radius.
assert.equal(discSample(0.47)[0], 1, "settled: the body is opaque out to 94% of the radius");
assert.equal(discSample(0.49)[0], 1, "opaque material: the disc holds full alpha to 98% of the radius");
assert.equal(discSample(0.5)[0], 0, "and closes over the last 2% as an antialiased edge");
assert.ok(discSample(0.31)[1] <= 0.02, "settled: the white core is gone by 62% of the radius");
assert.ok(discSample(0.125, 0.92)[1] > 0.1 && discSample(0.125, 0.92)[1] < 0.6, "settled: a quarter of the way out the body is mostly its own colour");
assert.ok(discSample(0, 0.92)[1] >= 0.9 && discSample(0, 0.92)[1] <= 0.95, "settled: the very centre is white-hot, not pure white");
const cyanLink = linkTint(starPlateau(184), starPlateau(184));
assert.ok(Math.hypot(cyanLink[0] - 193, cyanLink[1] - 218, cyanLink[2] - 220) < 12, `cyan link is a near-white teal, brighter than the reference's rgb(177,209,211) (${cyanLink})`);
const nebula = createNebula(1.4, starPlateau(184), starPlateau(38));
assert.equal(nebula.sprites.length, 144, "nebula: 6 centres x 24 billboards");
assert.equal(nebula.colours.length, 6, "nebula: one cached colour per centre");
assert.deepEqual(createNebula(1.4, starPlateau(184), starPlateau(38)), nebula, "nebula is deterministic");
assert.ok(nebula.colours.every((colour) => Math.max(...colour) <= 90), "nebula colours stay dark (L 0.2)");
assert.equal(createGalaxy(graph, 1, { layout: "rings" }).dust.filter((grain) => grain.hue === 46 && Math.hypot(grain.x, grain.z) < 0.17).length, 0, "core dust is spiral-only");
{
	const skyStart = clientSource.indexOf("// Sky shell: hard squares");
	const skyEnd = clientSource.indexOf("const basis = skyBasis;", skyStart);
	assert.ok(skyStart >= 0 && skyEnd > skyStart, "renderScene has the sky shell pass");
	const skyPass = clientSource.slice(skyStart, skyEnd);
	const painterStart = clientSource.indexOf("function paintGrainSquares(");
	const painter = clientSource.slice(painterStart, clientSource.indexOf("\n}\n", painterStart));
	assert.ok(painterStart >= 0 && skyPass.includes("paintGrainSquares(context, SKY,"), "the shell pass paints squares through paintGrainSquares");
	assert.ok(!skyPass.includes("createRadialGradient") && !painter.includes("createRadialGradient"), "the shell pass builds no gradients");
	assert.ok(painter.includes("context.rect(") && painter.includes("Math.ceil(px * dpr - lead)") && painter.includes("Math.ceil(px * dpr + deviceSize - lead)"), "shell grains fill the device pixels a WebGL point would cover");
	assert.ok(!/focal \/ depth|scale \*/.test(painter), "shell sizes are not distance-attenuated");
	assert.ok(!/new |\[\]|\{ /.test(painter.slice(painter.indexOf("for (let grain"))), "the grain loop allocates nothing");
	assert.ok(!/fillStyle = "#fff/i.test(skyPass), "shell never fills pure white");
}
/* ── 记忆库's look is SETTLED (owner-approved). The numbers are a gate, not taste:
 * if a change trips them, the change is what is wrong. Ask before restyling. ────────── */
assert.equal(MEMORY_ARMS, 3, "settled: 记忆库 rides three arms");
assert.equal(MEMORY_SWIRL, 2.2, "settled: 记忆库's arm swirl");
assert.equal(MEMORY_DOTS, 16, "settled: call dots drawn per skill");
assert.deepEqual(Object.keys(SKILL_HUES).sort(), ["bundled", "custom", "extension", "project-agents", "project-dsh", "user-agents", "user-dsh", "vendor"], "settled: skill hue table");
assert.deepEqual(DOC_HUES, { global: 44, rule: 34, agents: 48, workspace: 52, legacy: 30 }, "settled: document hue table");
assert.ok(clientSource.includes('hazeSprite(theme.nucleus, "nebula")') && clientSource.includes("haloSprite(node.hue, HALO_INNER, dpr, null)") && clientSource.includes("discSprite(node.hue,"), "settled: 记忆库 bodies are star sprites over one centre haze");
assert.ok(clientSource.includes("frame.globalAlpha = 0.16 * (1 + 0.12 * Math.sin((state.clock ?? 0) * 0.7));") && clientSource.includes("const alpha = 1;"), "settled: 记忆库's haze (now breathing) and its opaque bodies");
// The memory map's selection ring is the body's own outline, not a wide white circle.
assert.ok(clientSource.includes("frame.arc(entry.x, entry.y, dot * 0.72 + 3, 0, Math.PI * 2);"), "记忆库's selection ring hugs the body");
// 记忆库 移动: the look is the approved one (paint-on-demand, no drift, no pulse); what it gained
// is the ability to look at the map from anywhere.
assert.ok(!clientSource.includes("camera.yaw += Math.min(0.12, elapsed / 1000)") && !clientSource.includes("state.stopped = true;"), "the idle drift and its ticker are gone");
assert.ok(clientSource.includes("pan: event.shiftKey || event.button === 2") && clientSource.includes("camera.target = {"), "shift-drag (or right-drag) slides the map");
assert.ok(clientSource.includes('event.key === "ArrowLeft"') && clientSource.includes("const slide = (right, up) =>"), "arrows slide it, R recentres, +/− zoom");
// Glow raised 10% on request (0.3/0.42 → 0.33/0.462); that new value is the settled one now.
assert.ok(clientSource.includes('node.kind === "doc" ? 0.33 : 0.462'), "settled: 记忆库's body glow, +10% as asked");

/* ── settings v4: the shipped look moved to the near-white wire + wide bloom ── */
assert.equal(SETTINGS_VERSION, 16, "settings version 16: the GPU-bodies switch reaches existing installs");
assert.equal(DEFAULTS.gpuGlow, true, "GPU bodies are on by default");
assert.equal(PRESETS.minimal.linkWidth, 0.6, "矩阵 draws its links at 0.6, 30% below 银河's 0.85");
assert.equal(PRESETS.system.mist, 0, "太阳系 draws no cluster clouds");
assert.equal(PRESETS.system.veil, 0.3, "and gets 星云天幕 0.3 instead, so it still has depth");
assert.equal(PRESETS.plate.mist, 0.37, "方阵 clusters at 0.37");
assert.equal(PRESETS.system.bloomStrength, 0.28, "太阳系 blooms at 0.28, not 0.5");
assert.equal(PRESETS.galaxy.bloomStrength, 0.38, "and every other preset sits at 0.38");
assert.equal(PRESETS.system.threshold, 0.3, "and only the brightest moons bloom");
assert.equal(PRESETS.deepfield.layout, "sphere", "极简 draws the spherical rings");

/* 极简 is an armillary sphere: equal-radius rings in their own planes, each turning in place. */
{
	const counts = [12, 4, 1, 2, 1, 60, 30, 1, 1, 78, 40, 1, 2, 11];
	const ws = { items: counts.map((n, i) => ({ workspaceId: `sw${i}`, path: `/s/${i}`, title: `s${i}`, sessionIds: Array.from({ length: n }, (_, j) => `ss${i}-${j}`) })), archivedSessionIds: [] };
	const ss = { ids: [], byId: {} };
	for (const w of ws.items) for (const id of w.sessionIds) { ss.ids.push(id); ss.byId[id] = { id, displayTitle: id, cwd: w.path, updatedAt: "2026-10-24T00:00:00Z" }; }
	const globe = createGalaxy(buildGraph(ws, ss, {}), 1, { layout: "sphere" });
	const ringsOf = new Map();
	for (const node of globe.nodes) {
		if (node.ring === undefined) continue;
		if (!ringsOf.has(node.ring)) ringsOf.set(node.ring, []);
		ringsOf.get(node.ring).push(node);
	}
	const sizes = [...ringsOf.values()].map((list) => list.length);
	assert.ok(Math.min(...sizes) > Math.max(...sizes) * 0.4, `every ring carries bodies (${sizes.join("/")})`);
	for (const [ring, list] of ringsOf) {
		const radii = list.map((node) => Math.hypot(node.x, node.y, node.z));
		assert.ok(Math.max(...radii) - Math.min(...radii) < 0.06, `ring ${ring} keeps its radius (${(Math.max(...radii) - Math.min(...radii)).toFixed(3)})`);
	}
	const before = globe.nodes.map((node) => [node.x, node.y, node.z]);
	orbitSphere(globe, 5);
	const moved = globe.nodes.filter((node, index) => Math.hypot(node.x - before[index][0], node.y - before[index][1], node.z - before[index][2]) > 1e-6).length;
	assert.ok(moved > globe.nodes.length * 0.9, `the rings spin in place (${moved}/${globe.nodes.length} moved)`);
	const radiiAfter = globe.nodes.map((node, index) => Math.abs(Math.hypot(node.x, node.y, node.z) - Math.hypot(...before[index])));
	assert.ok(Math.max(...radiiAfter) < 1e-6, "and every body stays on its sphere");
	assert.equal(layoutGuides("sphere", null, 2).length, 5, "the skeleton is the five rings");
}
assert.equal(DEFAULTS.brightness, 0.5, "星体亮度 defaults to 0.5 (the neutral gain)");
assert.equal(BRIGHTNESS_MAX, 2.4, "and the slider runs to 2.4");
assert.equal(brightnessGain(0.5).toFixed(2), "1.00", "0.5 is the neutral point of the gain curve (0.10 at 0, 3.28 at the ceiling)");
// 银河's look is the reference every other preset shares; only 极简 keeps its own.
const LOOK_KEYS = ["brightness", "bloomStrength", "bloom", "threshold", "nodeSize", "linkWidth", "linkOpacity", "linkBrightness", "linkCurve", "twinkle"];
// 太阳系 owns its bloom on purpose: its moons sit in tight shells, and 银河's 0.5 stacked into
// one white blob there (see the crowd fade in the halo pass).
const LOOK_VARIANTS = { system: ["bloomStrength", "threshold"], minimal: ["linkWidth"] };
for (const [id, preset] of Object.entries(PRESETS)) {
	if (id === "galaxy" || id === "deepfield") continue;
	for (const key of LOOK_KEYS) {
		if ((LOOK_VARIANTS[id] ?? []).includes(key)) continue;
		assert.equal(preset[key], PRESETS.galaxy[key], `${id}.${key} follows 银河`);
	}
}
assert.equal(PRESETS.deepfield.nodeSize, 0.85, "极简 keeps its own body size");
assert.equal(PRESETS.deepfield.linkCurve, 0.3, "and its own wire curve");
assert.ok(DEFAULTS.linkCurve > 0.6 && DEFAULTS.linkOpacity >= 0.18 && DEFAULTS.bloomStrength >= 0.34 && DEFAULTS.bloomStrength <= 0.45, "the shipped bloom is wide but measured: 0.38, down from 0.5");
assert.equal(DEFAULTS.dust, 0, "dust lanes are off by default so bodies stay crisp");
for (const key of PHYSICS_KEYS) assert.equal(DEFAULTS[key], PHYSICS_DEFAULTS[key], `physics default ${key} matches the force layer`);
for (const [id, preset] of Object.entries(PRESETS)) {
	for (const key of Object.keys(preset)) assert.ok(Object.prototype.hasOwnProperty.call(DEFAULTS, key), `preset ${id} key ${key} is a setting`);
	assert.deepEqual(Object.keys(preset).sort(), Object.keys(PRESETS.galaxy).sort(), `preset ${id} owns the same keys as galaxy`);
}
{
	const junk = migrateSettings({ settingsVersion: SETTINGS_VERSION, sizeBy: "huge", quality: "ultra", language: "fr", selectionDepth: 7, panelWidth: 9999, panelSections: { look: false, bad: 3 }, repel: "x" });
	assert.equal(junk.settings.sizeBy, DEFAULTS.sizeBy, "unknown sizeBy falls back");
	assert.equal(junk.settings.visual, undefined, "the daylight-mode key is gone");
	assert.equal(junk.settings.quality, DEFAULTS.quality, "unknown quality falls back");
	assert.equal(junk.settings.language, DEFAULTS.language, "unknown language falls back");
	assert.equal(junk.settings.selectionDepth, 2, "selection depth is 1 or 2");
	assert.equal(junk.settings.panelWidth, 480, "panel width clamps to 240-480");
	assert.deepEqual(junk.settings.panelSections, { look: false }, "panel sections keep booleans only");
	assert.equal(junk.settings.repel, DEFAULTS.repel, "non-numeric physics value falls back");
	assert.ok(SIZE_BY.includes("links") && QUALITIES.includes("mobile") && LANGUAGES.includes("en"), "enums carry the new choices");
	const keepsPanel = migrateSettings({ settingsVersion: 2, language: "en", panelWidth: 360, selectionDepth: 1, theme: "neon" });
	assert.equal(keepsPanel.settings.language, "en", "migration keeps the language");
	assert.equal(keepsPanel.settings.panelWidth, 360, "migration keeps the panel width");
	assert.equal(keepsPanel.settings.selectionDepth, 1, "migration keeps the selection depth");
	assert.equal(keepsPanel.settings.theme, DEFAULT_THEME, "migration still resets the look");
}
{
	assert.deepEqual(linkColorRgb("#46D4dc"), [70, 212, 220], "hex link colours parse");
	assert.equal(linkColorRgb("auto"), null, "auto is not a custom colour");
	assert.equal(linkColorRgb("#fff"), null, "short hex is rejected");
	const links = migrateSettings({ settingsVersion: SETTINGS_VERSION, linkColor: "red", linkWidth: 99, linkCurve: -1, showLinks: "no" });
	assert.equal(links.settings.linkColor, "auto", "a bad link colour falls back to auto");
	assert.equal(links.settings.linkWidth, 4, "link width clamps to 0.2-4");
	assert.equal(migrateSettings({ settingsVersion: SETTINGS_VERSION, linkBrightness: 9 }).settings.linkBrightness, 2.5, "link brightness clamps to 0.3-2.5");
	assert.equal(migrateSettings({ settingsVersion: SETTINGS_VERSION, linkBrightness: "x" }).settings.linkBrightness, DEFAULTS.linkBrightness, "a bad link brightness falls back to the shipped value");
	for (const [name, preset] of Object.entries(PRESETS)) assert.ok(Number.isFinite(preset.linkBrightness), `preset ${name} sets 连线亮度`);
	assert.equal(links.settings.linkCurve, 0, "link curve clamps to 0-2");
	assert.equal(links.settings.showLinks, true, "a non-boolean 显示连线 falls back to on");
	assert.equal(migrateSettings({ settingsVersion: SETTINGS_VERSION, linkColor: "#cfd8e8" }).settings.linkColor, "#cfd8e8", "a custom link colour survives");
	assert.equal(migrateSettings({ settingsVersion: 1, showLinks: false }).settings.showLinks, false, "显示连线 survives a version migration");
}

/* ── filter syntax, mobile cap, shortest path, drift stars ───────────────── */
{
	assert.equal(parseFilter("   "), null, "empty filter parses to null");
	const parsed = parseFilter('graph -fork path:alpha "two words"');
	assert.deepEqual(parsed.terms, [
		{ negate: false, field: "any", value: "graph" },
		{ negate: true, field: "any", value: "fork" },
		{ negate: false, field: "path", value: "alpha" },
		{ negate: false, field: "any", value: "two words" }
	], "filter terms: plain, negated, field, phrase");
	assert.ok(filterAccepts(parseFilter("design"), { name: "Design the graph", path: "/x" }), "plain word matches the name");
	assert.ok(!filterAccepts(parseFilter("-design"), { name: "Design the graph", path: "/x" }), "negated word excludes");
	assert.ok(!filterAccepts(parseFilter("name:alpha"), { name: "beta", path: "/alpha" }), "name: ignores the path");
	assert.ok(filterAccepts(parseFilter("path:alpha"), { name: "beta", path: "/alpha" }), "path: matches the path");
	const filtered = buildGraph(workspaces, sessions, { filter: "graph" });
	assert.deepEqual(filtered.nodes.filter((node) => node.kind === "session").map((node) => node.id).sort(), ["s1", "s2"], "buildGraph applies the filter to conversations");
	const excluded = buildGraph(workspaces, sessions, { filter: "-fork" });
	assert.ok(!excluded.nodes.some((node) => node.id === "s2") && excluded.nodes.some((node) => node.id === "s1"), "a negated term drops matching conversations");
	const pathOnly = buildGraph(workspaces, sessions, { filter: "path:beta" });
	assert.deepEqual(pathOnly.nodes.filter((node) => node.kind === "session").map((node) => node.id).sort(), ["s4", "s5"], "path: keeps conversations under that path");

	const capped = capGraph(buildGraph(bigWorkspaces, bigSessions, {}), 60);
	assert.equal(capped.nodes.length, 60, "capGraph keeps exactly the cap");
	assert.equal(capped.nodes.filter((node) => node.kind === "folder").length, bigCounts.length, "capGraph keeps every sun");
	assert.ok(capped.links.every((link) => link.a >= 0 && link.b >= 0 && link.a < 60 && link.b < 60), "capGraph remaps links into range");
	assert.equal(capGraph(graph, Infinity), graph, "no cap returns the graph untouched");

	const fresh = buildGraph(workspaces, sessions, {});
	const indexOf = (id) => fresh.nodes.findIndex((node) => node.id === id);
	assert.equal(shortestPath(fresh, indexOf("s2"), indexOf("s5")), null, "conversations in different workspaces share no link path");
	const inside = shortestPath(fresh, indexOf("s2"), indexOf("ws:w1"));
	assert.ok(inside !== null && inside[0] === indexOf("s2") && inside[inside.length - 1] === indexOf("ws:w1"), "a path runs from start to end");
	assert.deepEqual(shortestPath(fresh, indexOf("s1"), indexOf("s1")), [indexOf("s1")], "a star is its own path");

	const drift = createDriftStars();
	assert.equal(drift.count, DRIFT_STARS, "drift stars: fixed count");
	assert.ok(Array.from(drift.x).every(Number.isFinite), "drift stars are finite");
	assert.deepEqual(Array.from(createDriftStars().x.slice(0, 20)), Array.from(drift.x.slice(0, 20)), "drift stars are deterministic");
}

/* ── physics: defaults settle near the layout, sliders bend it, all finite ── */
{
	const homeGraph = buildGraph(bigWorkspaces, bigSessions, {});
	const laid = createGalaxy(homeGraph, 1);
	const home = laid.nodes.map((node) => [node.x, node.y, node.z]);
	const reach = shellOf(laid) * 0.86;
	const run = (params) => {
		const sim = createSimulation(laid.nodes, laid.links);
		settleSimulation(sim, params, reach, 400);
		return sim;
	};
	const drift = (sim) => {
		let sum = 0;
		for (let index = 0; index < sim.count; index += 1) sum += Math.hypot(sim.pos[index * 3] - home[index][0], sim.pos[index * 3 + 1] - home[index][1], sim.pos[index * 3 + 2] - home[index][2]);
		return sum / sim.count;
	};
	const settled = run(physicsOf(DEFAULTS));
	assert.ok(simulationSettled(settled), "default physics settles within 400 ticks");
	assert.ok(Array.from(settled.pos).every(Number.isFinite), "settled positions are finite");
	assert.ok(drift(settled) < 0.05, `defaults stay on the analytic layout (mean drift ${drift(settled).toFixed(4)})`);
	for (let index = 0; index < settled.count; index += 1) {
		assert.ok(Math.hypot(settled.pos[index * 3], settled.pos[index * 3 + 1], settled.pos[index * 3 + 2]) <= reach + 1e-9, "simulation keeps stars inside the reach");
	}
	const spread = (sim) => {
		let sum = 0;
		for (let index = 0; index < sim.count; index += 1) sum += Math.hypot(sim.pos[index * 3], sim.pos[index * 3 + 2]);
		return sum / sim.count;
	};
	const flatness = (sim) => {
		let sum = 0;
		for (let index = 0; index < sim.count; index += 1) sum += Math.abs(sim.pos[index * 3 + 1]);
		return sum / sim.count;
	};
	assert.ok(spread(run({ ...PHYSICS_DEFAULTS, centerPull: 0.2 })) < spread(settled), "a stronger centre pull shrinks the body");
	assert.ok(flatness(run({ ...PHYSICS_DEFAULTS, flatten: 0.8 })) <= flatness(settled) + 1e-9, "more flatten thins the disc");
	assert.ok(drift(run({ ...PHYSICS_DEFAULTS, repel: 400 })) > drift(settled), "more repel moves stars further from home");
	assert.ok(drift(run({ ...PHYSICS_DEFAULTS, spiral: 0.1 })) > drift(settled), "spiral swirl bends the layout");
	for (const extreme of [{ repel: 20, linkDistance: 20, linkStrength: 0.1, centerPull: 0, flatten: 0, coreGravity: -0.1, spiral: 0 }, { repel: 400, linkDistance: 200, linkStrength: 2, centerPull: 0.2, flatten: 0.8, coreGravity: 0.3, spiral: 0.1 }]) {
		assert.ok(Array.from(run(extreme).pos).every(Number.isFinite), `extreme physics stays finite (${JSON.stringify(extreme)})`);
	}
	reheatSimulation(settled, 0.5);
	assert.ok(!simulationSettled(settled) && stepSimulation(settled, physicsOf(DEFAULTS), reach), "reheat wakes a settled simulation");
	const warm = new Map(laid.nodes.map((node, index) => [node.id, [settled.pos[index * 3], settled.pos[index * 3 + 1], settled.pos[index * 3 + 2]]]));
	const warmed = createSimulation(laid.nodes, laid.links, warm);
	assert.ok(warmed.alpha < 1, "a warm start begins cooler");
	const target = laid.nodes.map((node) => ({ ...node }));
	writeSimulation(warmed, target);
	assert.equal(target[0].x, warmed.pos[0], "writeSimulation copies positions onto nodes");
}

/* ── client wiring: sidebar intercept, keyboard flight, panel controls ───── */
{
	assert.ok(/ui\.openSession = openSessionInGalaxy/.test(clientSource) && /if \(own\) ui\.openSession = original;\n\t+else delete ui\.openSession;/.test(clientSource), "sidebar clicks are intercepted and the original opener is restored on dispose");
	assert.ok(/!opening && source === "explicit-session"/.test(clientSource), "the plugin's own opens bypass the intercept");
	assert.ok(clientSource.includes("stepForces(state);") && clientSource.includes("advanceRoute(state);"), "stepScene runs physics and the route");
	// WASD flight is gone for good: no keys, no flyer, no hint advertising it.
	assert.ok(!/flyByKeys|state\.keys|WASD/.test(clientSource), "no keyboard flight is left (keys, flyer or hint)");
	// 星体不透明: the disc is opaque material, brightness dims by colour/light, and the memory
	// map draws every body at full alpha too.
	// 完全不透明: every body is drawn at alpha 1 — bands, 亮度 and the lens only change its
	// colour, never its opacity.
	assert.ok(clientSource.includes("context.globalAlpha = blink;\n\t\tcontext.drawImage(spriteImage(sprite.canvas), bodyX, bodyY, side, side);") && !clientSource.includes("bodyAlpha * bandAlpha"), "a body is drawn opaque — `blink` is 1 for everything except a working agent");
	assert.ok(!/globalAlpha = bodyAlpha \* Math\.min\(1, bodyGain\)/.test(clientSource), "亮度 never thins a body");
	assert.ok(clientSource.includes("STAR_LIGHTNESS * bodyDim"), "the low end of 亮度 darkens the body's colour instead");
	assert.ok(clientSource.includes("const alpha = 1;"), "the memory map draws opaque bodies as well");
	// 星空 ⇄ 记忆库: one surface changing, not two screens swapping.
	assert.ok(clientSource.includes('canvas.toDataURL("image/png")') && clientSource.includes('className: "dgv-view-dissolve"'), "switching views dissolves the outgoing frame over the incoming one");
	for (const key of [...PHYSICS_KEYS, "nodeSize", "linkWidth", "linkOpacity", "linkBrightness", "linkCurve", "twinkle", "fieldStars", "dust", "bloomStrength", "tourSpeed"]) {
		assert.ok(clientSource.includes(`slide("${key}"`), `the panel has a slider for ${key}`);
	}
}

/* ── bloom controls: 辉光范围 / 阈值 ───────────────────────────────────────── */

{
	// 辉光范围: a wider halo is drawn bigger AND kept as bright, so the slider reads.
	assert.ok(bloomSpan(0) < bloomSpan(0.44) && bloomSpan(0.44) < bloomSpan(1), "span grows with 辉光范围");
	assert.ok(Math.abs(bloomSpanGain(0.44) - 1) < 0.02, "the shipped span is the neutral one, so the presets keep their look");
	assert.ok(bloomSpanGain(0) > 0.2 && bloomSpanGain(0) < 0.3, "a tight halo is not washed out");
	assert.ok(bloomSpanGain(1) > 1.8, "a wide halo gets the area gain that keeps it as bright");
	for (let bloom = 0; bloom <= 1.0001; bloom += 0.1) assert.ok(Number.isFinite(bloomSpanGain(bloom)), `span gain is finite at ${bloom.toFixed(1)}`);

	// 阈值: a body blooms above the threshold; mass is zoom-independent.
	assert.ok(bloomLuminance(1.5) > bloomLuminance(0.8) && bloomLuminance(1.5) <= 1, "a sun is brighter than a session");
	assert.equal(bloomLuminance(0.55), 0, "the smallest body sits at 0");
	assert.equal(bloomGate(0.8, 0), 1, "threshold 0 blooms everything");
	assert.ok(bloomGate(0.6, 0.5) < bloomGate(0.6, 0.2), "a higher threshold blooms less");
	assert.ok(bloomGate(0.8, 1) < 0.01, "threshold 1 blooms nothing");
	assert.ok(bloomGate(0.9, 0.6) > bloomGate(0.6, 0.6), "brighter bodies survive a high threshold");
	for (let threshold = 0; threshold <= 1.0001; threshold += 0.1) assert.ok(bloomGate(0.7, threshold) >= 0 && bloomGate(0.7, threshold) <= 1, `gate stays 0..1 at ${threshold.toFixed(1)}`);
}

/* ── memory library: the map, the store and the wire ─────────────────────── */

assert.equal(CHANNEL, MEMORY_CHANNEL, "the client and the Node half agree on the channel");

/* The map: mass follows call count, calls orbit their skill, docs stay in the core. */
{
	const docs = [
		{ name: "AGENTS.md", path: "/h/AGENTS.md", scope: "global", group: "global", size: 4096, mtimeMs: 1, readOnly: false },
		{ name: "coding.md", path: "/h/rules/coding.md", scope: "rule", group: "global", size: 2048, mtimeMs: 2, readOnly: false }
	];
	const skills = [
		{ name: "cad", source: "user-dsh", description: "CAD parts", path: "/h/skills/cad/SKILL.md", readOnly: false },
		{ name: "rare", source: "bundled", description: "once", path: "/h/skills/rare/SKILL.md", readOnly: true },
		{ name: "idle", source: "user-dsh", description: "", path: "/h/skills/idle/SKILL.md", readOnly: false }
	];
	const calls = [];
	for (let index = 0; index < 20; index += 1) calls.push({ skill: "cad", callId: `c${index}`, time: 1000 + index, sessionId: `s${index % 3}`, title: `cad ${index}`, cwd: "/w" });
	calls.push({ skill: "rare", callId: "r1", time: 5000, sessionId: "s1", title: "one" });
	calls.push({ skill: "ghost", callId: "g1", time: 6000, sessionId: "s1", title: "gone" });

	const map = buildMemoryGraph({ docs, skills, calls });
	const body = (name) => map.nodes.find((node) => node.id === `skill:${name}`);
	assert.equal(map.nodes.filter((node) => node.kind === "doc").length, 2, "every document is drawn");
	assert.ok(body("cad").mass > body("rare").mass, "a busier skill is a bigger body");
	assert.ok(body("idle").mass >= 0.34 && body("idle").mass < body("rare").mass, "an unused skill still draws, smallest");
	assert.equal(body("cad").calls, 20, "the body carries its call count");
	assert.equal(body("cad").sessions, 3, "and the sessions those calls came from");
	assert.equal(map.stats.calls, 22, "every call counts, drawn or not");
	assert.equal(map.stats.hiddenCalls, 4, "past 16 dots a skill reports the rest instead of drawing them");
	assert.equal(map.links.length, 16 + 1 + 1, "one link per drawn call dot");
	assert.equal(map.stats.missingSkills, 1, "a called skill missing from disk still appears");
	assert.ok(body("ghost").missing === true && body("ghost").path === null, "the missing skill is marked and has no file");
	for (const node of map.nodes.filter((item) => item.kind === "call" && item.skill === "cad")) {
		const gap = Math.hypot(node.x - body("cad").x, node.z - body("cad").z);
		assert.ok(gap > 0.02 && gap < 0.3, "call dots sit in a ring around their own skill");
	}
	for (const node of map.nodes.filter((item) => item.kind === "doc")) assert.ok(Math.hypot(node.x, node.z) < 0.34, "instruction files stay in the core");
	// Colour: a skill with no known source still gets its own hue. Folding on the label or
	// on `hash01` (which neighbours similar strings) left the map almost single-coloured.
	const sourceless = [
		...["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"].map((name) => ({ name: `skill-${name}`, source: "", description: "", path: `/h/skills/${name}/SKILL.md`, readOnly: false }))
	];
	const colourful = buildMemoryGraph({ docs: [], skills: sourceless, calls: [] });
	const hues = new Set(colourful.nodes.filter((node) => node.kind === "skill").map((node) => node.hue));
	assert.ok(hues.size >= 5, `sourceless skills still spread across the palette (${hues.size} hues for ${sourceless.length} skills)`);
	const again = buildMemoryGraph({ docs, skills, calls });
	assert.deepEqual(
		again.nodes.map((node) => [node.id, node.x, node.y, node.z]),
		map.nodes.map((node) => [node.id, node.x, node.y, node.z]),
		"the same library always lays out the same way"
	);
	assert.equal(formatBytes(512), "512 B", "bytes format");
	assert.equal(formatBytes(2048), "2 KB", "kilobytes format");
	assert.equal(formatBytes(3 * 1024 * 1024), "3 MB", "megabytes format");
	assert.deepEqual(buildMemoryGraph({}).stats, { docs: 0, skills: 0, calls: 0, missingSkills: 0, hiddenCalls: 0, bodies: 0 }, "an empty host draws nothing and does not throw");
}

/* The store: discovery, front matter, call history across frames, read and write. */
{
	const tmp = mkdtempSync(join(tmpdir(), "dgv-memory-"));
	const home = join(tmp, "home");
	const dshHome = join(home, ".dsh");
	const agentsHome = join(tmp, "agents");
	const work = join(tmp, "work");
	mkdirSync(join(dshHome, "rules"), { recursive: true });
	mkdirSync(join(dshHome, "skills", "alpha"), { recursive: true });
	mkdirSync(join(dshHome, "skills", "beta"), { recursive: true });
	mkdirSync(work, { recursive: true });
	mkdirSync(join(tmp, "agents", "skills", "gamma"), { recursive: true });
	writeFileSync(join(dshHome, "AGENTS.md"), "# house rules\n\nbe brief\n");
	writeFileSync(join(dshHome, "prompt-inject.md"), "inject a line\n");
	writeFileSync(join(dshHome, "rules", "one.md"), "rule one\n");
	writeFileSync(join(work, "README.md"), "readme\n");
	writeFileSync(join(dshHome, "skills", "alpha", "SKILL.md"), "---\nname: alpha\ndescription: >\n  folded words\n  more words\n---\nbody\n");
	writeFileSync(join(dshHome, "skills", "beta", "SKILL.md"), '---\nname: "beta"\ndescription: \'quoted words\'\n---\nbody\n');
	writeFileSync(join(agentsHome, "skills", "gamma", "SKILL.md"), "---\nname: gamma\ndescription: plain\n---\nbody\n");

	// One session, plain text: a title and two skill calls, one repeated call id.
	const sessionDir = join(dshHome, "sessions", "ws-1", "sess-1");
	mkdirSync(sessionDir, { recursive: true });
	const header = { type: "session", version: 4, id: "sess-1", cwd: work, createdAt: 1 };
	const lines = [
		JSON.stringify(header),
		JSON.stringify({ type: "session/title", data: { title: "first work" } }),
		JSON.stringify({ type: "tool/call", seq: 4, time: 30, data: { callId: "call-1", name: "skill", arguments: JSON.stringify({ name: "alpha" }) } }),
		JSON.stringify({ type: "tool/call", seq: 5, time: 40, data: { callId: "call-2", name: "skill", arguments: { name: "beta" } } }),
		JSON.stringify({ type: "tool/call", seq: 6, time: 50, data: { callId: "call-2", name: "skill", arguments: { name: "beta" } } }),
		JSON.stringify({ type: "tool/call", seq: 7, time: 60, data: { callId: "call-9", name: "read", arguments: {} } })
	];
	writeFileSync(join(sessionDir, "session.v4.jsonl"), `${lines.join("\n")}\n`);

	// A second session written as appended zstd frames, like the live host does.
	const zstdDir = join(dshHome, "sessions", "ws-1", "sess-2");
	mkdirSync(zstdDir, { recursive: true });
	const frame = (record) => zstdCompressSync(Buffer.from(`${JSON.stringify(record)}\n`));
	writeFileSync(
		join(zstdDir, "session.v5.jsonl.zstd"),
		Buffer.concat([
			frame({ type: "session", version: 5, id: "sess-2", cwd: work, createdAt: 2 }),
			frame({ type: "tool/call", seq: 2, time: 70, data: { callId: "call-3", name: "skill", arguments: JSON.stringify({ name: "gamma" }) } })
		])
	);

	const store = createMemoryStore({ homes: { home, dshHome, dshHomes: [dshHome], agentsHome, bundledSkills: null } });
	const listed = await store.list();
	const docNames = listed.docs.map((item) => item.name).sort();
	assert.deepEqual(docNames, ["AGENTS.md", "README.md", "one.md", "prompt-inject.md"], "instruction files, rules and the workspace readme are found");
	const skillByName = new Map(listed.skills.map((item) => [item.name, item]));
	assert.deepEqual([...skillByName.keys()].sort(), ["alpha", "beta", "gamma"], "skills are found across the dsh home and the shared agents home");
	assert.equal(skillByName.get("alpha").description, "folded words more words", "folded front matter is folded");
	assert.equal(skillByName.get("beta").description, "quoted words", "quoted front matter is unquoted");
	assert.equal(skillByName.get("alpha").source, "user-dsh", "the skill's source is recorded");
	assert.equal(skillByName.get("gamma").source, "user-agents", "a shared skill keeps its own source");
	assert.deepEqual(listed.workspaces, [{ path: work, sessions: 2 }], "workspace roots come from session headers, counted");

	const history = await store.calls();
	assert.equal(history.sessions, 2, "both sessions are scanned");
	assert.ok(history.zstd === true, "zstd support reported");
	assert.deepEqual(history.calls.map((call) => call.skill).sort(), ["alpha", "beta", "gamma"], "skill calls only, one per call id, zstd frames decoded");
	assert.equal(history.calls.find((call) => call.skill === "alpha").title, "first work", "a call carries its session title");
	assert.equal(history.calls.find((call) => call.skill === "alpha").rootSessionId, "sess-1", "a call carries its root session");

	const file = await store.read({ path: join(dshHome, "AGENTS.md") });
	assert.equal(file.content, "# house rules\n\nbe brief\n", "a listed file reads back verbatim");
	assert.equal(file.readOnly, false, "a home file is writable");
	const saved = await store.write({ path: join(dshHome, "AGENTS.md"), content: "# house rules\n\nbe brief\n", baseMtimeMs: file.mtimeMs });
	assert.ok(saved.mtimeMs >= file.mtimeMs, "a save reports the new timestamp");
	assert.equal(readFileSync(join(dshHome, "AGENTS.md"), "utf8"), "# house rules\n\nbe brief\n", "a save writes the content through");
	await assert.rejects(
		() => store.write({ path: join(dshHome, "AGENTS.md"), content: "stale", baseMtimeMs: file.mtimeMs - 100000 }),
		(error) => error.code === "conflict",
		"a stale base timestamp is refused as a conflict"
	);
	assert.equal(readFileSync(join(dshHome, "AGENTS.md"), "utf8"), "# house rules\n\nbe brief\n", "a refused save leaves the file alone");
	await assert.rejects(() => store.read({ path: join(tmp, "hosts") }), (error) => error.code === "forbidden", "a path discovery never found is refused");
	await assert.rejects(() => store.read({ path: "relative.md" }), (error) => error.code === "invalid-request", "a relative path is refused");
	await assert.rejects(() => store.write({ path: join(dshHome, "AGENTS.md"), content: 42 }), (error) => error.code === "invalid-request", "a non-string body is refused");

	/* The wire: the browser's client-request envelope in, a server-response out. */
	const handler = memoryRpc(store);
	const server = createServer((req, res) => routeHandler(CHANNEL, handler, () => ({ requestRejection: () => undefined }))(req, res));
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	const port = server.address().port;
	const post = async (endpoint, payload, extra = {}) => {
		const response = await fetch(`http://127.0.0.1:${port}${CHANNEL}/${endpoint}`, {
			method: "POST",
			headers: { "content-type": "application/json", ...extra },
			body: JSON.stringify({ type: "client-request", rpcId: "11111111-1111-4111-8111-111111111111", method: endpoint, payload })
		});
		return { status: response.status, body: await response.json().catch(() => null) };
	};
	const wire = await post("memory.list", {});
	assert.equal(wire.status, 200, "the route answers 200");
	assert.equal(wire.body.type, "server-response", "the envelope is a server response");
	assert.equal(wire.body.rpcId, "11111111-1111-4111-8111-111111111111", "the rpc id is echoed, so the caller can correlate");
	assert.ok(wire.body.result.ok === true && Array.isArray(wire.body.result.value.docs), "the browser half gets the listing it expects");
	const unknown = await post("memory.nope", {});
	assert.equal(unknown.body.result.ok, false, "an unknown endpoint fails inside the envelope");
	assert.equal(unknown.body.result.error.code, "not-found", "and says why");
	const fenced = createServer((req, res) => routeHandler(CHANNEL, handler, () => ({ requestRejection: () => 403 }))(req, res));
	await new Promise((resolve) => fenced.listen(0, "127.0.0.1", resolve));
	const fencedResponse = await fetch(`http://127.0.0.1:${fenced.address().port}${CHANNEL}/memory.list`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ type: "client-request", rpcId: "2", method: "memory.list", payload: {} })
	});
	assert.equal(fencedResponse.status, 403, "the Host/Origin fence rejects a foreign caller");
	const getResponse = await fetch(`http://127.0.0.1:${port}${CHANNEL}/memory.list`);
	assert.equal(getResponse.status, 405, "only POST is served");
	await new Promise((resolve) => server.close(resolve));
	await new Promise((resolve) => fenced.close(resolve));
	rmSync(tmp, { recursive: true, force: true });
}

/* ── bundle shape: the client loader contract ────────────────────────────── */

const bundle = readFileSync(join(root, "lib/client.js"), "utf8");
assert.ok(bundle.includes("window.__ModuleLoader__.load({"), "bundle registers through the client module loader");
assert.ok(bundle.includes('id: "dsh-galaxy-view"'), "bundle id matches the package name");
assert.ok(bundle.includes("exports.apply = apply"), "bundle exports the plugin body");
assert.ok(bundle.includes("exports.inject = inject"), "bundle declares its services");
assert.ok(bundle.includes("conversation.session.header.actions"), "header toggle is registered");
assert.ok(bundle.includes('key: PANEL_ID'), "graph main panel is registered");
assert.ok(bundle.includes("data-plugin-css"), "styles are injected once per page");
assert.ok(bundle.includes("createGalaxy") && bundle.includes("cameraBasis"), "galaxy model is inlined");
assert.ok(bundle.includes("SKY_RADIUS") && bundle.includes("sparkSprite"), "shell ships as cached sprites");
assert.ok(bundle.includes("layoutGuides") && bundle.includes("placeDust"), "layouts ship their own placement and guides");
assert.ok(bundle.includes("shellSize") && bundle.includes("shellGlow"), "shell size and brightness are settings");
assert.ok(!bundle.includes("children: {"), "no illegal children declaration on the main slot");
assert.ok(bundle.includes("dgv-inside-glow"), "interior skin present");
assert.ok(bundle.includes("buildMemoryGraph") && bundle.includes("MEMORY_CHANNEL"), "the memory map and its channel are inlined");
assert.ok(bundle.includes("GraphPanel") && bundle.includes('className: "dgv-mem-canvas"'), "the panel serves both views and the memory map draws to its own canvas");
for (const endpoint of ["memory.list", "memory.calls", "memory.read", "memory.write"]) {
	assert.ok(bundle.includes(`"${endpoint}"`), `the client calls ${endpoint}`);
}
assert.ok(/connection\.rpc\.call\(MEMORY_CHANNEL/.test(bundle), "the memory view goes through the host's authenticated RPC caller");
/* Enter flow: every folder trigger warps, the clock survives stalls, the overlay waits
 * for the target, and the interior takes the palette hue the warp was given. */
{
	const warpBody = bundle.slice(bundle.indexOf("function playWarp("), bundle.indexOf("\n}\n", bundle.indexOf("function playWarp(")));
	assert.ok(/Math\.min\(34, /.test(warpBody), "the warp clock clamps each frame's step");
	assert.ok(warpBody.includes(".then(onArrive)") && /if \(!ready && clock >= holdAt\)/.test(warpBody), "the warp holds until the target has settled");
	assert.ok(!warpBody.includes("createRadialGradient") && !warpBody.includes('"lighter"'), "the warp paints no glow ball");
	assert.ok(bundle.includes("const enterWorkspace = (node) => warpInto(") && !/onOpenWorkspace\?\.\(star|onOpenWorkspace\?\.\(cardNode|onOpenWorkspace\?\.\(node\.workspaceId\);/.test(bundle), "every workspace trigger goes through the warp");
	assert.ok(/const openWorkspace = \(workspaceId, look\)[\s\S]{0,240}paintSafely\(look\)/.test(bundle), "opening a workspace paints the interior");
	assert.ok(bundle.includes("if (warpState.opaque) {"), "the galaxy loop pauses under an opaque warp");
}
/* Links bow as in the reference linkCurves.ts, and the batched pass must add every curve to its path. */
{
	const bowBody = bundle.slice(bundle.indexOf("function bowControl("), bundle.indexOf("\n}\n", bundle.indexOf("function bowControl(")));
	assert.ok(bowBody.includes("0.32) * curve * Math.hypot(") && bowBody.includes('"lineage" ? 0.18'), "link bow is 0.32 x curve x edge length, lineage 0.18 x curve");
	assert.ok(/mr > 1e-3 \? \[mx \/ mr, my \/ mr, mz \/ mr\]/.test(bowBody), "bow direction is the full 3D midpoint direction with a fallback");
	const traceBody = bundle.slice(bundle.indexOf("function traceLink("), bundle.indexOf("\n}\n", bundle.indexOf("function traceLink(")));
	assert.ok(/context\.moveTo\(a\._p\.x, a\._p\.y\);/.test(traceBody) && traceBody.includes("context.lineTo(b._p.x, b._p.y)") && traceBody.includes("context.quadraticCurveTo(control.x, control.y, b._p.x, b._p.y)"), "traceLink draws straight at curve 0, else a quadratic bow");
	assert.ok(/traceLink\(target, a, b, link, viewport, basis, scale, curve\);\n\t+drawn \+= 1;/.test(bundle), "the batched link pass adds each curve to its path");
	assert.ok(!/linkFade = [^;]*bodyGain/.test(bundle), "星体亮度 no longer drags 连线亮度 with it");
	assert.ok(bundle.includes("bloomGate(bloomLuminance(starMass("), "阈值 gates each body by its own mass");
	assert.ok(bundle.includes("bloomSpanGain(settings.bloom)"), "辉光范围 also carries the area gain");
	assert.ok(bundle.includes("state.fade = { canvas: snapshot") && bundle.includes("1 - easeInOutCubic(progress)"), "外观切换 keeps the outgoing frame and dissolves it");
	assert.ok(/if \(id !== settings\.preset\) controlsRef\.current\?\.transition\?\.\(\);/.test(bundle), "only a real preset change starts the dissolve");
	assert.ok(bundle.includes("const layout = typeof useLayoutEffect === \"function\" ? useLayoutEffect : useEffect;"), "the header measures in the commit, not after the first paint");
	// Top-left, clear of the window buttons: a fixed band from the window's edge, not a
	// measurement of every host button (that kept pushing the wordmark towards the middle).
	// The window buttons are measured (this app's lights sit around 50–105 of the viewport,
	// not the stock 16–70), and the whole inset is capped so the wordmark stays in the corner.
	assert.ok(bundle.includes("const LIGHTS_EDGE = mac ? 112 : 16;") && bundle.includes("const CAP = 160;"), "the header reserves the window-button band with a hard cap");
	assert.ok(bundle.includes("Math.min(CAP, hostReach(box) + 8)") && bundle.includes("widest = Math.max(widest,"), "the band is measured, capped, and never shrinks so the wordmark cannot shift twice");
	// The host's plugin button is an svg in a div, not a <button>: hit testing finds it.
	assert.ok(bundle.includes("document.elementsFromPoint") && bundle.includes("querySelectorAll(\"button, [role='button'], a, svg\")"), "the chrome band is found by hit testing, with a tag scan as fallback");
	// The sky shell must be a sphere around the body: a camera-relative shell is a
	// backdrop, and diving into a star would drag it along instead of entering it.
	assert.ok(!bundle.includes("skyTarget"), "shell grains are no longer placed relative to the camera target");
	assert.ok(!/paintGrainSquares\(context, (SKY|FIELD), shellRadius, [^,]+, skyTarget/.test(bundle), "both grain layers project at their own world position");
	// The interior is a room, not a speckled ball: no rim in frame, one dot size, even alpha.
	assert.ok(bundle.includes('settings.layout === "field" || settings.layout === "system"'), "深空场 and 太阳系 are drawn as placed, with no force field pulling them into a blob");
	assert.ok(bundle.includes('settings.layout === "memory"') && bundle.includes("const placed = settings.layout === \"plate\""), "极简 (the memory-map preset) is placed too, not simulated");
	assert.ok(bundle.includes("const spots = [") && bundle.includes("left: anchorX + gap"), "the star card steps around its star instead of covering it");
	assert.ok(bundle.includes("const anchorX = tracking ? bounds.width / 2 : screenX"), "a tracked body's card anchors where the dive leaves it — the stage centre");
	// A sidebar click never opens the stock view while the galaxy is up: if the star is not
	// drawn, the page unhides/unpins/uncaps it and then dives.
	assert.ok(bundle.includes("if (revealRef.current?.(target) === true) return;"), "the sidebar interceptor asks the page to reveal the star");
	assert.ok(bundle.includes("const revealStar = useCallback(") && bundle.includes("pendingStar.current = sessionId"), "and the page records a pending dive");
	assert.ok(bundle.includes('filterText: ""') && bundle.includes("setShowArchived(true)"), "revealing clears the name filter and shows archived when needed");
	assert.ok(bundle.includes("controlsRef.current?.focus?.(pending)") && bundle.includes("enterRef.current?.(pending)"), "the dive *and* the entry happen once the rebuilt graph contains the star");
	assert.ok(bundle.includes("if (enterRef.current?.(target) === true) return;"), "a drawn star is entered inside the starfield, not in the stock page");
	// The page must not touch the interceptor's refs directly: they live in run()'s closure, so
	// a module-scope component referencing them throws on render (that was the black screen).
	{
		const lines = clientSource.split("\n");
		const panelAt = lines.findIndex((line) => line.startsWith("function GraphPanel(props)"));
		const applyAt = lines.findIndex((line) => line.startsWith("function apply(ctx)"));
		const leaks = lines.slice(panelAt, applyAt).filter((line) => /\b(revealRef|enterRef)\b/.test(line) && !/props\.sidebar/.test(line));
		assert.deepEqual(leaks, [], "GraphPanel reaches the sidebar bridge through props, never through run()'s refs");
		assert.ok(bundle.includes("sidebar: { revealRef, enterRef }"), "and run() publishes that bridge to the page");
		// A declaration the bridge slices cut once already: 节点上限 has to exist before the memo.
		assert.ok(clientSource.includes('const nodeCap = qualityBudget(settings, "high").nodeCap;'), "nodeCap is declared before the graph memo uses it");
	}
	// The wheel has no ceiling: 缩放倍率 is the owner's. Only a floor above zero remains.
	assert.ok(bundle.includes("const ZOOM_FLOOR = 0.002;") && bundle.includes("Math.max(ZOOM_FLOOR, from * Math.exp(delta * 0.0065))"), "the zoom is unbounded apart from a floor above zero");
	assert.ok(!bundle.includes("maxDistance"), "no distance clamp is left");
	assert.ok(bundle.includes("card === null &&\n\t\t\thover !== null"), "no tooltip while a card is open");
	// 星体亮度 is settled (owner-approved): these two live in the bundle, not the model.
	assert.ok(bundle.includes("const BODY_CORE_LIFT = 0.42;"), "settled: the standing core light every body gets");
	// 球壳辉光 is a real control: two sliders, read by the shell pass.
	assert.ok(bundle.includes('slide("shellBloom", "slider.shellBloom", 0, 2, 0.05)') && bundle.includes('slide("shellBloomBlur", "slider.shellBloomBlur", 0, 6, 0.5)'), "the panel has 球壳辉光 and 辉光扩散");
	assert.ok(bundle.includes("const haloSize = (SKY_HALO_RADIUS + clamp(settings.shellBloomBlur, 0, 6)) * 2;") && bundle.includes("const glowAlpha = Math.min(1, 0.12 * bloom * shellAlpha);"), "the shell pass reads both: bloom sets the halo alpha, blur its radius");
	// The owner's picked pair leads the palette: teal-cyan 180° and amber-gold 36°.
	assert.ok(THEMES.deepfield.hues[0] === 180 && THEMES.deepfield.hues[1] === 36, "the picked teal and gold are slots 0 and 1");
	for (const [id, theme] of Object.entries(THEMES)) {
		if (theme.tones === undefined) continue; // themes without an explicit tone table use the saturation rule
		assert.equal(theme.hues.length, theme.tones.length, `${id} hues and tones stay parallel`);
	}
	assert.deepEqual(starPlateau(180).map((v) => v > 100), [true, true, true], "180° still reads as a star plateau");
	// 星环's circles are the silhouette: drawn heavier and brighter than any other guide.
	assert.ok(bundle.includes('settings.layout === "rings" ? 0.9') && bundle.includes('settings.layout === "rings" ? 1.6 : structural > 0.3 ? 1.1 : 0.7'), "settled: 星环's orbits are drawn at 0.9 alpha and 1.6 px");
	assert.ok(bundle.includes("lit ? 1 : 0.92"), "settled: body core white mix");
	assert.ok(bundle.includes("(BODY_CORE_LIFT + BODY_GAIN_LIFT * Math.max(0, bodyGain - 1)) * Math.min(1, bodyGain)"), "settled: the additive pass always adds a little light");
	assert.ok(bundle.includes("discSprite(entry.hue, Math.max(1, Math.round(entry.dot * dprNow * 2) / 2), bandCore, bandLightness, entry.tone)") && bundle.includes("const bandCore = prox >= 0.66 ? (lit ? 1 : 0.92) : prox >= 0.33 ? 1 : 0.9;"), "settled: the body sprite call carries the three depth bands");
	assert.ok(bundle.includes("haloSprite(entry.hue, HALO_INNER, dprNow, entry.tone)"), "the halo carries the theme's tone");
	assert.ok(bundle.includes("node.id === hot ? 1.34 : tracked ? 1.3 : linkedToChosen ? 1.15 : 1"), "settled: the emphasis multipliers (hot 1.34 / locked 1.3 / neighbour 1.15)");
	assert.ok(bundle.includes("window.__dgvDumpBodies"), "a console handle reports what each body drew");
	assert.ok(bundle.includes("context.arc(entry.x, entry.y, entry.dot / 2 + 1.5, 0, TAU)") && bundle.includes("context.lineWidth = 1;"), "settled: the selection ring is a detached 1 px ring just outside the body");
	assert.ok(bundle.includes("const base = folder ? clamp(point.scale * 3.6 * 0.022 * 0.62, 7, 90) : clamp(point.scale * 1.3 * 0.017 * 1.4, 4, 60);"), "bodies are sized by the galaxy's own base, with a ceiling high enough for perspective");
	{
		const clampValue = (value, min, max) => Math.min(max, Math.max(min, value));
		const sideOf = (scale) => clampValue(scale * 3.6 * 0.022 * 0.62, 7, 90);
		assert.ok(sideOf(1800) > sideOf(900) && sideOf(900) > sideOf(450), `a body keeps growing with the zoom (${sideOf(450).toFixed(1)} → ${sideOf(900).toFixed(1)} → ${sideOf(1800).toFixed(1)} px)`);
	}
	// 近景 bands (owner's request): near keeps the hot coloured core, the middle distance is a
	// white core with a dimmer rim, the far sky is dark — bodies, glow and thread tints alike.
	assert.ok(bundle.includes("const bandCore = prox >= 0.66 ? (lit ? 1 : 0.92) : prox >= 0.33 ? 1 : 0.9;"), "settled: three depth bands on the body core");
	assert.ok(!bundle.includes("bandAlpha"), "settled: no band thins a body — the far band darkens its colour only");
	assert.ok(bundle.includes("const bandHalo = prox >= 0.66 ? 1 : prox >= 0.33 ? 0.55 : 0.18;"), "settled: the glow follows the bands");
	// The bands are a close-up device: in the main view (`cam.distance / fit` ≥ 1) every body
	// stays at prox 1, so the far band never dims the overview.
	{
		const clampValue = (value, min, max) => Math.min(max, Math.max(min, value));
		const overviewOf = (ratio) => clampValue((ratio - 0.55) / 0.45, 0, 1);
		const proxOf = (banded, overview) => banded + (1 - banded) * overview;
		assert.equal(overviewOf(1).toFixed(2), "1.00", "at the fitted distance the bands are off");
		assert.equal(proxOf(0, overviewOf(1)).toFixed(2), "1.00", "a far body in the overview is still full light");
		assert.ok(proxOf(0, overviewOf(0.4)) < 0.2, "and it goes dark once you dive in");
		assert.ok(bundle.includes("const overview = clamp((state.cam.distance / fitDistance - 0.55) / 0.45, 0, 1);"), "the renderer gates the bands on the camera distance");
	}
	assert.ok(bundle.includes("const k = prox >= 0.66 ? 1 : prox >= 0.33 ? 0.72 : 0.42;"), "settled: a far thread is tinted darker");
	assert.ok(!bundle.includes("BODY_DOT_SCALE"), "the fixed memory scale is gone");
	// Zoom must not mint a bitmap per frame: bodies bake on a 15-step ladder, capped at 32 px,
	// and draw at their own continuous size.
	assert.ok(bundle.includes("const bake = Math.min(32, quantiseDiameter(diameter));") && bundle.includes("const side = entry.dot;"), "bodies bake on the ladder (≤32 px) and draw at their real size");
	{
		const sizes = new Set();
		for (let dot = 2; dot <= 96; dot += 0.5) sizes.add(Math.min(32, quantiseDiameter(Math.ceil(dot * 2) / 2)));
		assert.equal(sizes.size, 15, `a whole zoom sweep needs ${sizes.size} disc bitmaps`);
	}
	assert.ok(bundle.includes('const animated = settings.layout === "system" || settings.layout === "rings" || settings.layout === "sphere";') && bundle.includes("budget.clouds && !animated"), "animated layouts never bake cluster clouds (they would stay where a planet used to be)");
	assert.ok(bundle.includes("if (innerAlpha < 0.004) continue;") && bundle.includes("if (outerAlpha < 0.004) continue;"), "invisible halos are skipped instead of filled");
	assert.ok(bundle.includes("if (lift < 0.02) continue;"), "the additive body pass is skipped when there is nothing to add");
	// Crowd fade: additive halos must not stack into one white blob in a dense clump.
	assert.ok(bundle.includes("const crowdFadeOf = (entry) => {") && bundle.includes("* crowdFadeOf(entry)"), "halos fade with local crowding");
	{
		const fade = (count) => (count <= 1 ? 1 : 1 / (1 + 0.85 * Math.pow(count - 1, 0.85)));
		assert.equal(fade(1), 1, "a lone star keeps its full glow");
		assert.ok(fade(12) * 12 < 1.7 && fade(12) > 0.1, `twelve bodies in one cell sum to ${(fade(12) * 12).toFixed(2)}× a lone halo`);
	}
	assert.ok(bundle.includes("const CAPTION_WIDTHS = new Map();"), "caption widths are cached, not measured per frame");
	// 巡飞的 Agent: a running session leaves its seat and circles outside the shell, blinking.
	{
		const ws = { items: [{ workspaceId: "aw", path: "/aw", title: "aw", sessionIds: ["run", "idle"] }], archivedSessionIds: [] };
		const ss = { ids: ["run", "idle"], byId: {
			run: { id: "run", displayTitle: "run", cwd: "/aw", updatedAt: Date.now(), running: true },
			idle: { id: "idle", displayTitle: "idle", cwd: "/aw", updatedAt: Date.now() }
		} };
		const sky = createGalaxy(buildGraph(ws, ss, {}), 1, { layout: "galaxy" });
		const shell = Math.max(...sky.nodes.map((node) => Math.hypot(node.x, node.y, node.z)));
		const agent = sky.nodes.find((node) => node.id === "run");
		const radii = [0, 1, 2, 3.7].map((t) => {
			orbitAgents(sky, t, shell);
			return Math.hypot(agent.x, agent.y, agent.z);
		});
		assert.ok(radii.every((radius) => radius > shell), `the agent flies outside the shell (${radii[0].toFixed(2)} > ${shell.toFixed(2)})`);
		assert.equal(new Set(radii.map((radius) => radius.toFixed(6))).size, 1, "on an exact circle");
		const start = { x: agent.x, y: agent.y, z: agent.z };
		orbitAgents(sky, 5.7, shell);                          // +2 s = 0.84 rad along the track
		assert.ok(Math.hypot(agent.x - start.x, agent.y - start.y, agent.z - start.z) > 0.8, "and keeps travelling along it");
		assert.equal(sky.nodes.find((node) => node.id === "idle").agentOrbit, undefined, "idle sessions stay in their seats");
		assert.ok(bundle.includes("const blink = node.running === true ? 0.55 + 0.45 *"), "with a 0.55–1 blink on body, lift and halo");
		assert.ok(clientSource.includes("orbitAgents(state.galaxy, state.time, state.shellRadius)"), "driven every frame, in every layout");
	}
	// The package is dsh-galaxy-view; a rename must not reset a tuned look.
	assert.equal(JSON.parse(readFileSync(join(root, "package.json"), "utf8")).name, "dsh-galaxy-view", "package name");
	assert.ok(bundle.includes("const LEGACY_KEYS = [[\"settings\", STORE_KEY]") && bundle.includes("dsh-graph-view:${suffix}"), "old storage keys are adopted once");
	assert.ok(bundle.includes('const STORE_KEY = "dsh-galaxy-view:settings";'), "and the new keys are the ones written");
	// Skills a plugin registers in memory (ponytail's optional ones) have no SKILL.md; the 技能
	// list used to drop them because the registry branch required a path.
	{
		const host = readFileSync(join(root, "lib", "index.js"), "utf8");
		assert.ok(host.includes('registered: true') && host.includes('group: "skills:registered"'), "the host admits pathless registry skills");
		assert.ok(!/if \(typeof summary\?\.path !== "string"\) continue;/.test(host), "and no longer skips them for lacking a path");
		const memorySource = readFileSync(join(root, "src", "memory.js"), "utf8");
		assert.ok(memorySource.includes("missing: skill.path === null && skill.registered !== true"), "a registered skill is not reported as missing");
		assert.ok(bundle.includes('t("mem.selected.registered")'), "the card says so in words");
	}
// 指令列表按工作区名标注，而不是统一的「工作区」。
assert.ok(bundle.includes("function docScopeLabel(node, t) {") && bundle.includes('basename(String(node.workspace ?? node.root ?? ""))'), "workspace-scoped docs are labelled with their workspace name");
assert.ok(bundle.includes("docScopeLabel(node, t)") && bundle.includes("docScopeLabel(selected, t)"), "the list row and the detail card both use it");
assert.ok(readFileSync(join(root, "src/memory.js"), "utf8").includes('workspace: doc.workspace ?? ""'), "the memory graph keeps the workspace path on each doc node");

	// Turning GPU 星体 off must take the batched layer off the page: leaving its canvas
	// behind froze the last frame of bodies on top of the Canvas 2D ones.
	assert.ok(bundle.includes("function dropGlowLayer(state) {") && bundle.includes("layer.canvas.remove?.();"), "the GPU layer is torn down, canvas and all");
	assert.ok(bundle.includes("if (state.settings?.gpuGlow === false || state.glowFailed === true) {") && bundle.includes("dropGlowLayer(state);"), "which the off switch and a lost context both call");

	// 中 / EN in the header, and the two dictionaries must stay in lockstep.
	assert.ok(bundle.includes('t("lang.switch")') && bundle.includes('update({ language: settings.language === "en" ? "zh" : "en" })'), "the header carries a 中 / EN switch");
	{
		const zhBlock = clientSource.slice(clientSource.indexOf("const zh = {"), clientSource.indexOf("const en = {"));
		const enBlock = clientSource.slice(clientSource.indexOf("const en = {"), clientSource.indexOf("};", clientSource.indexOf("const en = {")));
		const keysOf = (text) => [...text.matchAll(/^\t"([^"]+)":/gm)].map((match) => match[1]);
		const zhKeys = keysOf(zhBlock);
		const enKeys = keysOf(enBlock);
		assert.equal(zhKeys.length, enKeys.length, `both languages carry the same ${zhKeys.length} keys`);
		assert.deepEqual(zhKeys.filter((key) => !enKeys.includes(key)), [], "no key is Chinese-only");
	}
	// 搜索: fuzzy subsequence, ranked by score then activity — the reference modal's behaviour.
	{
		const score = (text, query) => {
			const haystack = String(text).toLowerCase();
			const at = haystack.indexOf(query);
			if (at === 0) return 1;
			if (at > 0) return 0.9 - Math.min(0.3, at / haystack.length);
			let cursor = 0;
			let gaps = 0;
			for (const letter of query) {
				const next = haystack.indexOf(letter, cursor);
				if (next === -1) return 0;
				gaps += next - cursor;
				cursor = next + 1;
			}
			return Math.max(0.05, 0.6 - gaps / haystack.length);
		};
		assert.equal(score("银河", "银"), 1, "a prefix scores 1");
		assert.ok(score("02.2 矩阵的逆", "矩阵") > score("graph-view", "gv"), "a contiguous run beats scattered letters");
		assert.ok(score("graph-view", "gv") > 0, "a subsequence (gv in graph-view) still matches");
		assert.equal(score("知识关系图谱", "krs"), 0, "but pinyin initials do not — the haystack has no Latin letters, same as the reference");
		assert.equal(score("银河", "abc"), 0, "and a miss scores 0");
	}
	assert.ok(bundle.includes("const searchHits = useMemo(") && bundle.includes("searchOpen ? activeGraph.nodes.slice()"), "an empty search box lists the busiest stars");
	// 名字只在放大后出现: the caption pass is skipped outright in the overview.
	assert.ok(bundle.includes("const labelFade = clamp((0.6 - overview) / 0.3, 0, 1);") && bundle.includes("if (labelFade > 0.01)"), "captions are gated on the zoom level");
	{
		const clampValue = (value, min, max) => Math.min(max, Math.max(min, value));
		const overviewOf = (ratio) => clampValue((ratio - 0.55) / 0.45, 0, 1);
		const fadeOf = (overview) => clampValue((0.6 - overview) / 0.3, 0, 1);
		assert.equal(fadeOf(overviewOf(1)).toFixed(2), "0.00", "no names at the fitted distance");
		assert.equal(fadeOf(overviewOf(0.6)).toFixed(2), "1.00", "and the full set once you are inside");
	}
	// galaxy-view's method: batch the whole graph into a couple of GPU draw calls. Ours is a
	// hand-written WebGL2 Points pass (no three.js dependency), and it fails open.
	assert.ok(bundle.includes('gl_PointSize = max(1.0, aSize * uDpr);'), "the GPU layer sizes points in the vertex shader");
	assert.ok(bundle.includes("smoothstep(1.0, 0.92, d) * vAlpha") && bundle.includes("exp(-3.4 * d * d)"), "bodies and halos are shaded, not sprited");
	assert.equal(bundle.split("drawArrays(gl.POINTS, 0, drawn)").length - 1, 2, "exactly two draw calls: bodies, then halos");
	assert.ok(bundle.includes("state.settings?.gpuGlow === false") && bundle.includes("if (gl === null) return null;") && bundle.includes('state.glowFailed = true') && bundle.includes("glowBodies !== null"), "WebGL missing or lost falls back to the Canvas 2D bodies");
	assert.ok(bundle.includes('if (type === "webgl2"') === false && bundle.includes('canvas.getContext("webgl2"'), "the layer asks for webgl2 first");
	assert.ok(bundle.includes("const captionFor = (entry) => Math.round(clamp((entry.dot ?? 9) * 0.72, 6.5, 10) * 2) / 2;") && bundle.includes("context.textBaseline = \"top\""), "settled: the caption follows its body (0.72 × dot, 6.5–10 px)");
	// 聚焦: a deep close-up that then orbits the subject, whatever 自动环绕 says.
	assert.ok(bundle.includes("fit * 0.06") && bundle.includes("fit * 0.17"), "a focused body comes in close (6% of the overview for a conversation, 17% for a workspace)");
	assert.ok(bundle.includes("const TRACK_ORBIT = 0.046") && bundle.includes("settings.autoOrbit || focused"), "a focused body is orbited slowly on its own, not gated behind 自动环绕");
	// 记忆库 draws with the galaxy's own sprites, not flat discs.
	assert.ok(bundle.includes("hazeSprite(theme.nucleus") && bundle.includes("haloSprite(node.hue, HALO_INNER, dpr, null)") && bundle.includes("discSprite(node.hue,"), "the memory map paints bodies as star sprites over a centre haze");
	assert.ok(!/pitch[^;]*clamp\(/.test(bundle) && bundle.includes("wrapAngle("), "pitch is free (wrapped), not clamped into a band");
	assert.ok(bundle.includes("() => 0.3, 1.4)") && bundle.includes("() => 0.18, 1.4)"), "the interior draws two even layers at one dot size");
}
/* The guides draw before the filaments, so the filament palette must be bound first:
 * a const read before its declaration throws in the temporal dead zone every frame
 * and silently kills links, stars and captions. Checked inside renderScene itself,
 * because other functions may mention the same text. */
const renderStart = bundle.indexOf("function renderScene(");
assert.ok(renderStart >= 0, "renderScene is in the bundle");
const renderEnd = bundle.indexOf("\n}\n", renderStart);
const renderBody = bundle.slice(renderStart, renderEnd);
const paletteAt = renderBody.indexOf("const [lr, lg, lb] = theme.link");
const guidesAt = renderBody.indexOf("Layout guides:");
assert.ok(paletteAt >= 0 && guidesAt >= 0, "renderScene binds the filament palette and draws the layout guides");
assert.ok(paletteAt < guidesAt, "filament palette is bound before the layout guides draw");
/* ── release packaging: metadata, files whitelist, exports, market files ──── */
{
	const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
	assert.equal(pkg.version, "0.3.0", "release version");
	assert.equal(pkg.author, "dialling", "author is dialling");
	assert.equal(pkg.repository?.url, "git+https://github.com/dialling/dsh-galaxy-view.git", "repository points at the dialling repo");
	assert.equal(pkg.homepage, "https://github.com/dialling/dsh-galaxy-view#readme", "homepage matches the repo");
	assert.equal(pkg.bugs, "https://github.com/dialling/dsh-galaxy-view/issues", "bugs matches the repo");
	assert.deepEqual(pkg.peerDependencies, { "@deepseek-ai/cordis": "^4.0.1" }, "cordis is a peer dependency");
	assert.equal(pkg.engines?.dsh, ">=0.2.1-0 <0.3.0-0", "dsh engine range includes the 0.2.1 pre-releases");
	assert.ok(pkg.engines?.node, "node engine range kept");
	assert.ok(pkg.dependencies === undefined, "zero runtime dependencies");
	assert.ok(pkg.keywords.includes("dsh-plugin"), "market keyword present");
	assert.equal(pkg.dsh?.bundle?.patch, "./cordis.patch.yml", "dsh bundle patch kept");
	assert.equal(pkg.dsh?.client?.platform, "web", "dsh client block kept");
	assert.equal(pkg.icon, "./assets/icon.svg", "top-level icon declared for the market");
	assert.ok(existsSync(join(root, pkg.icon)), "the icon file exists");
	assert.ok(statSync(join(root, pkg.icon)).size <= 256 * 1024, "the icon is ≤ 256 KiB");
	assert.deepEqual(
		[...pkg.files].sort(),
		["CHANGELOG.md", "LICENSE", "README.md", "README.en.md", "assets/icon.svg", "cordis.patch.yml", "lib", "locale"].sort(),
		"files ships only lib, locale, the readmes, LICENSE, CHANGELOG, the patch and the icon"
	);
	for (const [key, target] of Object.entries(pkg.exports)) {
		assert.ok(!key.startsWith("./src") && !target.includes("/src/"), `exports ${key} does not touch src`);
		if (target.includes("*")) assert.ok(existsSync(join(root, dirname(target))), `exports ${key} directory exists`);
		else assert.ok(existsSync(join(root, target)), `exports ${key} target exists`);
	}
	const shots = JSON.parse(readFileSync(join(root, "screenshots.json"), "utf8"));
	assert.ok(Array.isArray(shots) && shots.length >= 1 && shots.length <= 8, "screenshots.json lists 1-8 images");
	for (const shot of shots) {
		assert.ok(/^docs\/[\w.-]+\.png$/.test(shot), `${shot} is a repo-relative docs png`);
		assert.ok(existsSync(join(root, shot)), `${shot} exists`);
	}
	assert.ok(readFileSync(join(root, "CHANGELOG.md"), "utf8").includes("## 0.3.0"), "CHANGELOG has the 0.3.0 entry");
	assert.ok(/copyright \(c\) 2026 dialling/i.test(readFileSync(join(root, "LICENSE"), "utf8")), "LICENSE copyright is dialling");
	assert.ok(existsSync(join(root, "PUBLISHING.md")), "PUBLISHING.md exists");
	assert.ok(!pkg.files.some((entry) => entry.includes("PUBLISHING") || entry.includes("screenshots")), "the publishing guide and screenshots manifest are not shipped");
}
console.log(	`selfcheck ok — ${galaxy.nodes.length} stars (${graph.stats.folders} suns), ${galaxy.dust.length} dust grains, ` +
		`extent ${galaxy.extent.toFixed(2)}, camera ${camera.distance.toFixed(2)}, bundle ${bundle.length} bytes`
);

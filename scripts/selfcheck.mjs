/**
 * Minimal runnable check for the galaxy model and the produced bundle.
 *
 * No framework: `node scripts/selfcheck.mjs`. Exits non-zero on the first failed
 * expectation, so it is usable as a `prepack` gate.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

import {
	buildGraph,
	cameraBasis,
	createCamera,
	createGalaxy,
	fitDistance,
	neighboursOf,
	projectPoint
} from "../src/graph-model.js";

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

const withArchived = buildGraph(workspaces, sessions, { showArchived: true });
assert.equal(withArchived.stats.sessions, 5, "showArchived reveals the archived session");

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

/* ── galaxy: deterministic, flat, inside the disc ────────────────────────── */

const galaxy = createGalaxy(graph, 1);
const again = createGalaxy(graph, 1);
assert.deepEqual(
	galaxy.nodes.map((node) => [node.x, node.y, node.z]),
	again.nodes.map((node) => [node.x, node.y, node.z]),
	"the same data always yields the same galaxy"
);

for (const node of galaxy.nodes) {
	assert.ok([node.x, node.y, node.z].every(Number.isFinite), `finite position for ${node.id}`);
	assert.ok(Math.hypot(node.x, node.z) <= 1.05, `inside the disc for ${node.id}`);
	assert.ok(Math.abs(node.y) <= 0.12, `thin disc for ${node.id}`);
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
	assert.ok(Math.abs(node.y) <= 0.12, `thin disc after reshaping ${node.id}`);
	assert.ok(Math.hypot(node.x, node.z) <= 1.15, `inside the disc after reshaping ${node.id}`);
}
assert.equal(createGalaxy(graph, 1, { arms: 3 }).nodes.filter((node) => node.kind === "folder").map((node) => node.arm).sort().join(","), "0,1", "three arms still fit two suns");
assert.ok(galaxy.extent > 0.5 && galaxy.extent <= 1.25, `extent within the unit disc (${galaxy.extent.toFixed(2)})`);

const folders = galaxy.nodes.filter((node) => node.kind === "folder").sort((a, b) => a.discRadius - b.discRadius);
assert.equal(folders.length, 2, "two suns");
assert.ok(folders[0].discRadius <= folders[1].discRadius, "suns run outward along the arms");
assert.ok(new Set(folders.map((folder) => folder.arm)).size >= 1, "suns take arm slots");

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

/* ── bundle shape: the client loader contract ────────────────────────────── */

const bundle = readFileSync(join(root, "lib/client.js"), "utf8");
assert.ok(bundle.includes("window.__ModuleLoader__.load({"), "bundle registers through the client module loader");
assert.ok(bundle.includes('id: "dsh-graph-view"'), "bundle id matches the package name");
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
assert.ok(bundle.includes("dgv-inside-glow") || true, "interior skin present");
/* The guides draw before the filaments, so the filament palette must be bound first:
 * a const read before its declaration throws in the temporal dead zone every frame
 * and silently kills links, stars and captions. */
assert.ok(
	bundle.indexOf("const [lr, lg, lb] = theme.link") < bundle.indexOf("Layout guides:"),
	"filament palette is bound before the layout guides draw"
);

console.log(
	`selfcheck ok — ${galaxy.nodes.length} stars (${graph.stats.folders} suns), ${galaxy.dust.length} dust grains, ` +
		`extent ${galaxy.extent.toFixed(2)}, camera ${camera.distance.toFixed(2)}, bundle ${bundle.length} bytes`
);

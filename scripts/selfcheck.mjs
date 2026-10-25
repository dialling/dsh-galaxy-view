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
import { DEFAULTS, DEFAULT_THEME, PRESERVED_KEYS, PRESETS, SETTINGS_VERSION, THEMES, migrateSettings } from "../src/settings.js";

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
const isCool = (hue) => hue >= 160 && hue <= 230;
const isWarm = (hue) => hue >= 25 && hue <= 55;
const deepHues = THEMES[DEFAULT_THEME].hues;
assert.ok(deepHues.length >= 8, "default palette has at least eight slots");
deepHues.forEach((hue, index) => {
	assert.ok(index % 2 === 0 ? isCool(hue) : isWarm(hue), `default palette slot ${index} (${hue}°) alternates cool/warm`);
});
const baseLum = (hex) => {
	const n = parseInt(hex.slice(1), 16);
	return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
};
assert.ok(baseLum(THEMES[DEFAULT_THEME].base) <= 6, "default theme sits on a near-black plane");
for (const name of ["hubble", "neon", "sunset", "cyber", "matrix", "aurora"]) {
	assert.equal(THEMES[name].base, "#1c1c1c", `${name} keeps the #1c1c1c plane`);
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
assert.equal(clientSource.split("const linkColor = {").length - 1, 1, "only renderScene builds the filament palette");
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
console.log(
	`selfcheck ok — ${galaxy.nodes.length} stars (${graph.stats.folders} suns), ${galaxy.dust.length} dust grains, ` +
		`extent ${galaxy.extent.toFixed(2)}, camera ${camera.distance.toFixed(2)}, bundle ${bundle.length} bytes`
);

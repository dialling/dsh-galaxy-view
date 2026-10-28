/**
 * Render the galaxy scene to PNG with headless Chrome, one image per theme.
 *
 * The plugin's renderer is browser code inside the built bundle, so this harness loads
 * `lib/client.js` with a small patch that exposes the scene functions, builds a deterministic
 * demo graph, and paints one frame per theme at 1100×740 — the size the existing screenshots use.
 *
 * Usage: node scripts/shot.mjs [theme …]   (no arguments = every theme)
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = "/Users/a27/Library/Caches/chrome-headless-shell/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const WIDTH = 1100;
const HEIGHT = 740;
const THEMES = ["deepfield", "hubble", "neon", "sunset", "cyber", "solar", "matrix", "aurora"];

const source = readFileSync(join(root, "lib", "client.js"), "utf8");
const anchor = "exports.apply = apply;";
if (!source.includes(anchor)) throw new Error("bundle anchor changed: exports.apply = apply; not found");
const bundle = source.replace(
	anchor,
	`${anchor}\nwindow.__shot = { renderScene, createGalaxy, buildGraph, createCamera, neighboursOf, layoutGuides, DEFAULTS };`
);

const bootstrap = `
try {
const q = new URLSearchParams(location.search);
const theme = q.get("theme") ?? "deepfield";
const S = window.__shot;
const now = Date.UTC(2026, 9, 28, 4, 0, 0);
// Deterministic demo galaxy: four workspaces, uneven conversation counts, one working.
const layout = ["deepfield", "hubble", "neon", "auroora"].includes(theme) ? "spiral" : "spiral";
const counts = [14, 11, 9, 7, 6, 5, 4, 3, 2];
const workspaces = {
	items: counts.map((n, i) => ({
		workspaceId: "w" + i,
		path: "/Users/you/Projects/project-" + (i + 1),
		title: "project-" + (i + 1),
		sessionIds: Array.from({ length: n }, (_, j) => "s" + i + "-" + j)
	})),
	archivedSessionIds: []
};
const sessions = { ids: [], byId: {} };
let k = 0;
for (const w of workspaces.items) {
	for (const id of w.sessionIds) {
		sessions.byId[id] = {
			id,
			displayTitle: "conversation " + (++k),
			cwd: w.path,
			updatedAt: now - k * 900000,
			running: k === 3
		};
		sessions.ids.push(id);
	}
}
const graph = S.buildGraph(workspaces, sessions, {});
const settings = { ...S.DEFAULTS, theme, language: "zh", layout, hidden: [], only: null };
const state = {
	settings,
	galaxy: null,
	cam: S.createCamera(),
	token: 1,
	time: 0,
	reveal: 1,
	dpr: 1,
	width: ${WIDTH},
	height: ${HEIGHT},
	tier: "high",
	neighbours: S.neighboursOf(graph),
	degree: new Map(),
	route: null,
	selectedId: null,
	hoverId: null,
	trackId: null,
	overview: true,
	labelBoxes: [],
	projected: [],
	fade: undefined
};
state.galaxy = S.createGalaxy(graph, 2, { layout, arms: settings.arms, twist: settings.twist, thickness: settings.thickness, spread: settings.spread });
state.guides = S.layoutGuides(layout, state.galaxy.offset, settings.arms, state.galaxy.orbits);
state.degree = new Map([...state.neighbours].map(([id, set]) => [id, set.size]));
state.shellRadius = Math.min(2.1, Math.max(1, state.galaxy.extent * 1.22));
const canvas = document.getElementById("scene");
const context = canvas.getContext("2d");
// A few frames so the reveal bloom and the twinkle settle before the capture.
for (let frame = 0; frame < 4; frame += 1) {
	state.time = frame * 0.4;
	S.renderScene(canvas, state);
}
document.title = "ready:" + theme;
} catch (error) {
	document.title = "ERR " + (error && error.message ? error.message : error);
}
`;

const html = `<!doctype html>
<meta charset="utf-8">
<title>galaxy shot</title>
<style>html,body{margin:0;background:#05070c;overflow:hidden}canvas{display:block}</style>
<canvas id="scene" width="${WIDTH}" height="${HEIGHT}"></canvas>
<script>
// The bundle registers itself with the harness loader; nothing invokes the factory unless we do, and
// only React's element helpers are touched at module scope, so a stub is enough.
window.__ModuleLoader__ = {
	load: (module) => {
		const react = {
			Fragment: "Fragment",
			createElement: () => null,
			useState: (value) => [typeof value === "function" ? value() : value, () => {}],
			useEffect: () => {},
			useMemo: (factory) => factory(),
			useRef: (value) => ({ current: value })
		};
		module.factory((id) => (id === "react" ? react : {}));
	}
};
</script>
<script>${bundle}</script>
<script>${bootstrap}</script>
`;

const wanted = process.argv.slice(2).length > 0 ? process.argv.slice(2) : THEMES;
if (!existsSync(CHROME)) throw new Error(`no chrome-headless-shell at ${CHROME}`);
const dir = mkdtempSync(join(tmpdir(), "galaxy-shot-"));
for (const theme of wanted) {
	const page = join(dir, `shot-${theme}.html`);
	writeFileSync(page, html);
	const out = join(root, "docs", `theme-${theme}.png`);
	const run = spawnSync(
		CHROME,
		[
			"--headless",
			"--disable-gpu",
			"--hide-scrollbars",
			"--force-device-scale-factor=1",
			`--window-size=${WIDTH},${HEIGHT}`,
			"--virtual-time-budget=4000",
			`--screenshot=${out}`,
			`file://${page}?theme=${theme}`
		],
		{ encoding: "utf8" }
	);
	const ok = existsSync(out);
	console.log(`${ok ? "ok  " : "FAIL"} ${theme} → ${out}${ok ? "" : `\n${run.stderr?.slice(-400) ?? ""}`}`);
}

/**
 * Render the galaxy scene to PNG with headless Chrome, one image per shot.
 *
 * The plugin's renderer is browser code inside the built bundle, so this harness loads
 * `lib/client.js` with a small patch that exposes the scene functions, builds a synthetic
 * library, and paints one frame at 1100×740. Every image in `docs/` comes from here: the
 * workspace and conversation names are invented in this file, so no screenshot can carry
 * a real library's titles or paths.
 *
 * Usage: node scripts/shot.mjs [shot …]   (no arguments = every theme preview)
 *        node scripts/shot.mjs hero rings tree solar
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// `CHROME` overrides the binary; the default is the headless shell `npx @puppeteer/browsers
// install chrome-headless-shell@stable` drops in the per-user cache, so no absolute path of
// whoever rendered the previews last is baked into the repository.
const CHROME = process.env.CHROME ?? join(homedir(), "Library/Caches/chrome-headless-shell/chrome-headless-shell-mac-arm64/chrome-headless-shell");
const WIDTH = 1100;
const HEIGHT = 740;

/**
 * Every published image. `preset` picks a whole look (its layout included); without one the
 * shot uses the shipped defaults on the spiral; `extra` adds workspaces so the hero frame
 * is denser than a palette preview.
 */
const SHOTS = {
	"theme-deepfield": { file: "theme-deepfield.png", theme: "deepfield"  },
	"theme-hubble": { file: "theme-hubble.png", theme: "hubble"  },
	"theme-neon": { file: "theme-neon.png", theme: "neon"  },
	"theme-sunset": { file: "theme-sunset.png", theme: "sunset"  },
	"theme-cyber": { file: "theme-cyber.png", theme: "cyber"  },
	"theme-solar": { file: "theme-solar.png", theme: "solar"  },
	"theme-matrix": { file: "theme-matrix.png", theme: "matrix"  },
	"theme-aurora": { file: "theme-aurora.png", theme: "aurora"  },
	hero: { file: "galaxy.png", theme: "deepfield", preset: "galaxy", seed: 7  },
	rings: { file: "appearance-rings.png", theme: "sunset", preset: "rings"  },
	tree: { file: "appearance-tree.png", theme: "neon", preset: "tree"  },
	// 浑天 spans a ball of radius 1 and fits at a greater camera distance, so the same node size
	// lands as a bigger dot there; the other layouts step up to match its apparent body size.
	armillary: { file: "appearance-armillary.png", theme: "deepfield", preset: "deepfield", look: { nodeSize: 0.8 } }
};
const THEMES = Object.keys(SHOTS).filter((name) => name.startsWith("theme-"));

const source = readFileSync(join(root, "lib", "client.js"), "utf8");
const anchor = "exports.apply = apply;";
if (!source.includes(anchor)) throw new Error("bundle anchor changed: exports.apply = apply; not found");
const bundle = source.replace(
	anchor,
	`${anchor}\nwindow.__shot = { renderScene, createGalaxy, buildGraph, createCamera, neighboursOf, layoutGuides, DEFAULTS, PRESETS };`
);

const bootstrap = `
try {
const q = new URLSearchParams(location.search);
const theme = q.get("theme") ?? "deepfield";
const preset = q.get("preset") || null;
const seed = Number(q.get("seed") ?? 2);
const look = JSON.parse(q.get("look") ?? "{}");
const S = window.__shot;
const now = Date.UTC(2026, 9, 28, 4, 0, 0);

// Synthetic library. Neutral names on purpose: these images are published, so nothing here
// may echo a real workspace, path or conversation title.
// Counts come in pairs so spiralSegments (folder i rides arm i % arms) gives every arm
// the same number of conversations: 86 + 86 across the two arms, 172 in total.
const LIBRARY = [
	{ title: "atlas", count: 14 }, { title: "beacon", count: 14 },
	{ title: "cipher", count: 12 }, { title: "delta", count: 12 },
	{ title: "ember", count: 10 }, { title: "flux", count: 10 },
	{ title: "gravity", count: 9 }, { title: "harbor", count: 9 },
	{ title: "ion", count: 8 }, { title: "jasper", count: 8 },
	{ title: "kilo", count: 7 }, { title: "lumen", count: 7 },
	{ title: "maple", count: 6 }, { title: "nova", count: 6 },
	{ title: "opal", count: 6 }, { title: "quartz", count: 6 },
	{ title: "raven", count: 5 }, { title: "summit", count: 5 },
	{ title: "tundra", count: 4 }, { title: "umber", count: 4 },
	{ title: "vapor", count: 3 }, { title: "willow", count: 3 },
	{ title: "xenon", count: 2 }, { title: "yarrow", count: 2 }
];
const library = LIBRARY;
const TITLES = [
	"Sketch the API surface", "Fix the flaky importer", "Tighten the error copy", "Add a keyboard shortcut",
	"Profile the slow frame", "Split the render pass", "Write the migration note", "Debug the retry loop",
	"Simplify the config", "Audit the focus order", "Rewrite the parser", "Check the narrow layout",
	"Add a regression test", "Trim the startup cost", "Name the empty states", "Trace the dropped frame",
	"Plan the cache eviction", "Draft the changelog", "Review the copy deck", "Close the leaked timer",
	"Measure the cold start", "Tune the debounce", "Split the long form", "Explain the retry budget",
	"Rename the flags", "Guard the empty case", "Cache the parsed tree", "Replay the failing run",
	"Sketch the empty state", "Shorten the tooltip", "Verify the dark theme", "Settle the naming"
];
const workspaces = {
	items: library.map((w, i) => ({
		workspaceId: "w" + i,
		path: "/Users/you/Projects/" + w.title,
		title: w.title,
		sessionIds: Array.from({ length: w.count }, (_, j) => "s" + i + "-" + j)
	})),
	archivedSessionIds: []
};
const sessions = { ids: [], byId: {} };
let k = 0;
for (const w of workspaces.items) {
	for (const id of w.sessionIds) {
		sessions.byId[id] = {
			id,
			displayTitle: TITLES[k % TITLES.length],
			cwd: w.path,
			updatedAt: now - (k + 1) * 900000,
			running: k === 3 || k === 21
		};
		sessions.ids.push(id);
		k += 1;
	}
}
const graph = S.buildGraph(workspaces, sessions, {});
// Published frames use a calmer exposure than the shipped default: bodies dimmer, halos
// tighter, dots smaller, the disc wider — every one of these is a slider the panel exposes.
const LOOK = {
	brightness: 0.5, bloomStrength: 0.24, bloom: 0.35, threshold: 0.3,
	nodeSize: 0.9, spread: 1.24, linkOpacity: 0.1, linkBrightness: 0.95,
	// Deep space: field is the shell's density (it decides how many grains survive the
	// keep pass) and shellGlow their brightness. Both were at whisper level to match 浑天's
	// bare black; the owner asked for a readable shell instead.
	backdrop: true, veil: 0.05, field: 0.7, fieldStars: 0.14, shellGlow: 1.35, shellBloom: 0.4
};
const settings = { ...S.DEFAULTS, ...(preset === null ? {} : S.PRESETS[preset]), ...LOOK, ...look, theme, language: "zh" };
const layout = settings.layout ?? "spiral";
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
state.galaxy = S.createGalaxy(graph, seed, { layout, arms: settings.arms, twist: settings.twist, thickness: settings.thickness, spread: settings.spread });
state.guides = S.layoutGuides(layout, state.galaxy.offset, settings.arms, state.galaxy.orbits);
state.degree = new Map([...state.neighbours].map(([id, set]) => [id, set.size]));
state.shellRadius = Math.min(2.1, Math.max(1, state.galaxy.extent * 1.22));
const canvas = document.getElementById("scene");
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
const unknown = wanted.filter((name) => SHOTS[name] === undefined);
if (unknown.length > 0) throw new Error(`unknown shot(s): ${unknown.join(", ")} — known: ${Object.keys(SHOTS).join(", ")}`);
if (!existsSync(CHROME)) throw new Error(`no chrome-headless-shell at ${CHROME}`);

const dir = mkdtempSync(join(tmpdir(), "galaxy-shot-"));
try {
	for (const name of wanted) {
		const shot = SHOTS[name];
		const page = join(dir, `${name}.html`);
		writeFileSync(page, html);
		const out = join(root, "docs", shot.file);
		const query = new URLSearchParams({ theme: shot.theme });
		if (shot.preset !== undefined) query.set("preset", shot.preset);
		if (shot.extra !== undefined) query.set("extra", String(shot.extra));
		if (shot.seed !== undefined) query.set("seed", String(shot.seed));
		if (shot.look !== undefined) query.set("look", JSON.stringify(shot.look));
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
				`file://${page}?${query.toString()}`
			],
			{ encoding: "utf8" }
		);
		const ok = existsSync(out);
		console.log(`${ok ? "ok  " : "FAIL"} ${name} → ${out}${ok ? "" : `\n${run.stderr?.slice(-400) ?? ""}`}`);
	}
} finally {
	rmSync(dir, { recursive: true, force: true });
}

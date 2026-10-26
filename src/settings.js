import { LAYOUTS } from "./graph-model.js";

/**
 * Pure look data and the settings migration: presets, palettes, defaults.
 *
 * No DOM and no storage access, so `scripts/selfcheck.mjs` can import it directly;
 * `scripts/build.mjs` inlines it into the client bundle ahead of `src/client.js`.
 */

/**
 * Bumped whenever the shipped look changes enough that stored visual settings
 * would hide it. A stored object with an older (or missing) version keeps its
 * filters and has every visual key reset to {@link DEFAULTS} once.
 */
/**
 * 16: 高性能渲染 toggle (GPU 星体) added; 15: 矩阵's links are thinner (连线粗细 0.85 → 0.6, −30%); 14: 太阳系 no longer draws 集群云雾 (the cloud billboards were baked at the old planet
 * positions and stayed behind as coloured ghosts once the orbits moved); 13: 方阵's 集群云雾 drops to 0.37 (was 0.52); 12: every preset's 辉光强度 drops a notch (0.5 → 0.38, 极简 0.42 → 0.34, 太阳系 0.34 →
 * 0.28) because the glow read as a little too bright; 11: 太阳系's glow is calmer (辉光强度 0.34, 阈值 0.3) so a moon cluster no longer burns
 * into one white blob; 10: the daylight mode is gone (`visual` removed); 极简 is the **spherical rings** (星环's concentric circles wrapped onto a wireframe globe,
 * `layout: "sphere"`) and 星体亮度 defaults to 0.5 (the neutral gain). Bumping the version is
 * what makes an *existing* install pick this up: an upgrade resets every non-preserved key to
 * `DEFAULTS`.
 */
const SETTINGS_VERSION = 16;

/** Every theme draws on pure black; colour comes only from stars, links and world-space haze. */
const SPACE = "#000000";

/**
 * Eight hand-tuned looks. 链接透明度 per preset is Galaxy View's value for the preset
 * with the same link curve (银河 0.14, 轨道→星环 0.11, 星云→球壳 0.2, 旋臂→双螺旋 0.16,
 * 深空场→方阵 0.08, 极简→晶格 0.07, 烟火→星树 0.28; 极简 is lifted to 0.1 for its hairline links).
 * 深空场 itself now occupies the slot 晶格 used to: an unstructured scatter, its own haze
 * and no guides at all. 极简 is Galaxy View's
 * Minimal preset as a whole, matched to a screenshot of it: an open web of small light
 * yellow-green dots (a faint glow only on the bigger suns), no sky, no haze, straight
 * hairline links in a lifted green. Each one is a partial override on {@link DEFAULTS}; the parts
 * it does not mention stay as they were, which is what makes "自定义" meaningful.
 */
const PRESETS = {
	galaxy: { layout: "spiral", theme: "deepfield", brightness: 0.5, bloomStrength: 0.38, bloom: 0.58, threshold: 0.22, veil: 0.34, field: 0.7, shellSize: 1, shellGlow: 1, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0.3, dust: 0, fieldStars: 0.25, backdrop: true, arms: 2, twist: 4.3, thickness: 1, spread: 1, nodeSize: 1, linkWidth: 0.85, linkColor: "auto", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: true, twinkle: 0.5, orbitSpeed: 0.35 },
	rings: { layout: "rings", theme: "sunset", brightness: 0.5, bloomStrength: 0.38, bloom: 0.58, threshold: 0.22, veil: 0.2, field: 0.5, shellSize: 1, shellGlow: 0.85, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0.15, dust: 0, fieldStars: 0.1, backdrop: true, arms: 1, twist: 1.3, thickness: 0.5, spread: 1.2, nodeSize: 1, linkWidth: 0.85, linkColor: "auto", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: false, twinkle: 0.5, orbitSpeed: 0.4 },
	deepfield: { layout: "sphere", theme: "deepfield", brightness: 0.5, bloomStrength: 0.34, bloom: 0.5, threshold: 0.3, veil: 0, field: 0.5, shellSize: 1, shellGlow: 0.85, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0.34, dust: 0, fieldStars: 0, backdrop: false, arms: 2, twist: 3, thickness: 1, spread: 1, nodeSize: 0.85, linkWidth: 0.8, linkColor: "auto", linkOpacity: 0.2, linkBrightness: 1.05, linkCurve: 0.3, showLinks: true, twinkle: 0.3, orbitSpeed: 0.22 },
	system: { layout: "system", theme: "solar", brightness: 0.5, bloomStrength: 0.28, bloom: 0.58, threshold: 0.3, veil: 0.3, field: 0.45, shellSize: 1, shellGlow: 0.85, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0, dust: 0.34, fieldStars: 0.12, backdrop: true, arms: 2, twist: 3, thickness: 1, spread: 1, nodeSize: 1, linkWidth: 0.85, linkColor: "auto", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: true, twinkle: 0.5, orbitSpeed: 0.24 },
	helix: { layout: "helix", theme: "cyber", brightness: 0.5, bloomStrength: 0.38, bloom: 0.58, threshold: 0.22, veil: 0.18, field: 0.48, shellSize: 1, shellGlow: 0.85, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0.3, dust: 0, fieldStars: 0.3, backdrop: true, arms: 2, twist: 4, thickness: 1.1, spread: 1, nodeSize: 1, linkWidth: 0.85, linkColor: "auto", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: true, twinkle: 0.5, orbitSpeed: 0.32 },
	minimal: { layout: "web", theme: "matrix", brightness: 0.5, bloomStrength: 0.38, bloom: 0.58, threshold: 0.22, veil: 0, field: 0.5, shellSize: 1, shellGlow: 0.85, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0, dust: 0, fieldStars: 0, backdrop: false, arms: 2, twist: 3, thickness: 1, spread: 1, nodeSize: 1, linkWidth: 0.6, linkColor: "#5a9a40", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: true, twinkle: 0.5, orbitSpeed: 0.28 },
	plate: { layout: "plate", theme: "hubble", brightness: 0.5, bloomStrength: 0.38, bloom: 0.58, threshold: 0.22, veil: 0.08, field: 0.45, shellSize: 0.85, shellGlow: 0.8, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0.37, dust: 0, fieldStars: 0.1, backdrop: true, arms: 2, twist: 3, thickness: 1, spread: 0.8, nodeSize: 1, linkWidth: 0.85, linkColor: "auto", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: true, twinkle: 0.5, orbitSpeed: 0.22 },
	tree: { layout: "tree", theme: "neon", brightness: 0.5, bloomStrength: 0.38, bloom: 0.58, threshold: 0.22, veil: 0.22, field: 0.48, shellSize: 1, shellGlow: 0.85, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0.552, dust: 0, fieldStars: 0.2, backdrop: true, arms: 2, twist: 3.6, thickness: 1, spread: 1, nodeSize: 1, linkWidth: 0.85, linkColor: "auto", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: true, twinkle: 0.5, orbitSpeed: 0.3 }
};

/**
 * Palettes: node hues, nucleus tint, filament tint and the plane
 * colour (`base`) that the canvas, the warp overlay and the star interior share.
 *
 * `solar` is this plugin's own sun-and-planets palette.
 * `hues` are hue sources in degrees; the star sprite derives saturation and
 * lightness, unless `tones` gives a slot its own `[saturation, lightness]` (null =
 * the sprite default). "deepfield" is the Obsidian Galaxy View 哈勃深空 palette
 * (#46d4dc #ffc35c #d05a32 #7fd0a0 #e8d9a0 #5a9bd8 #d87fa8 #9a7fe0 #cfd8e8), its nine
 * colours reordered so cool and warm slots alternate; the tones are read off the
 * rendered reference (after its bloom), not the raw hex.
 */
const THEMES = {
	deepfield: {
		// The first two slots are the owner's picked pair (sampled from their screenshot:
		// teal-cyan ≈180° and amber-gold ≈36°), so those two colours lead the theme.
		hues: [180, 36, 183, 38, 209, 15, 144, 48, 257, 332, 218],
		tones: [null, [0.78, 0.7], null, [0.78, 0.7], null, null, [0.5, 0.68], [0.6, 0.8], [0.66, 0.72], [0.58, 0.7], [0.38, 0.84]],
		nucleus: [235, 240, 238],
		link: [150, 170, 180],
		base: SPACE
	},
	hubble: { hues: [265, 208, 158, 28, 330, 96, 190, 12], nucleus: [255, 246, 226], link: [150, 180, 235], base: SPACE },
	neon: { hues: [190, 300, 150, 50, 265, 330, 175, 210], nucleus: [220, 250, 255], link: [120, 220, 255], base: SPACE },
	sunset: { hues: [22, 342, 46, 300, 10, 40, 320, 355], nucleus: [255, 226, 180], link: [255, 190, 160], base: SPACE },
	cyber: { hues: [175, 285, 320, 200, 240, 300, 160, 265], nucleus: [210, 255, 245], link: [140, 255, 240], base: SPACE },
	// Galaxy View's 黑客帝国 green, read off its 极简 preset: three close greens only, pale bodies.
	matrix: { hues: [104, 98, 112], tones: [[0.85, 0.76], [0.8, 0.72], [0.75, 0.79]], nucleus: [220, 255, 220], link: [120, 255, 160], base: SPACE },
	aurora: { hues: [155, 190, 280, 120, 210, 300, 170, 265], nucleus: [230, 250, 240], link: [170, 240, 220], base: SPACE },
	// 太阳系: planet hues, read left to right — Mercury grey-warm, Earth blue, Mars rust,
	// Saturn gold, Uranus cyan, Neptune deep blue, then two far outliers. The warm
	// nucleus is the sun's own light.
	solar: { hues: [28, 208, 12, 46, 190, 230, 262, 330], tones: [null, null, null, [0.66, 0.76], null, null, null, null], nucleus: [255, 236, 200], link: [255, 205, 150], base: SPACE }
};

const DEFAULT_THEME = "deepfield";

/** Resolve a theme by name, falling back to the default palette. */
function themeOf(name) {
	return THEMES[name] ?? THEMES[DEFAULT_THEME];
}

/** Everything the panel can change, with the shipped defaults. */
const DEFAULTS = {
	settingsVersion: SETTINGS_VERSION,
	preset: "galaxy",
	layout: "spiral",
	theme: DEFAULT_THEME,
	/** Body and link strength. */
	brightness: 0.5,
	/** Batched WebGL bodies; off falls back to the Canvas 2D sprites. */
	gpuGlow: true,
	/** Bloom: strength (0 = no halos), radius (halo size), threshold (how bright a body must be to bloom). */
	bloomStrength: 0.38,
	bloom: 0.58,
	threshold: 0.22,
	/** Deep space: nebula veil, shell density/size/brightness, cluster mist, dust lanes, floating field stars, shell on/off. */
	veil: 0.34,
	field: 0.7,
	shellSize: 1,
	shellGlow: 1,
	/** 球壳辉光: the blurred bloom laid over the sky shell (0 = off) and its blur radius in px. */
	shellBloom: 0.5,
	shellBloomBlur: 1.5,
	mist: 0.3,
	dust: 0,
	fieldStars: 0.25,
	backdrop: true,
	arms: 2,
	twist: 4.3,
	thickness: 1,
	spread: 1,
	/** Look: node size multiplier, twinkle rate (0 = off), what sets a star's mass, palette shuffle. */
	nodeSize: 1,
	/**
	 * Links: drawn at rest (a selection always shows its own links), width multiplier,
	 * opacity, brightness (OKLab lightness: <1 darker, >1 towards white), bow
 * (0 = straight, 1 = the reference's strongest), and colour
	 * ("auto" = the mix of the two endpoint stars, else "#rrggbb").
	 */
	showLinks: true,
	linkWidth: 0.85,
	linkOpacity: 0.19,
	linkBrightness: 1.05,
	linkCurve: 0.72,
	linkColor: "auto",
	twinkle: 0.5,
	sizeBy: "activity",
	colorSeed: 0,
	/** Force layer over the analytic layout (see src/physics.js). */
	repel: 170,
	linkDistance: 55,
	linkStrength: 1.1,
	centerPull: 0.05,
	flatten: 0.55,
	coreGravity: 0.1,
	spiral: 0.02,
	autoOrbit: true,
	orbitSpeed: 0.35,
	tourSpeed: 1,
	selectionDepth: 2,
	quality: "auto",
	tour: false,
	language: "auto",
	panelWidth: 300,
	panelSections: {},
	hidden: [],
	only: null,
	orphans: false,
	empty: false,
	lens: null,
	filterText: ""
};

const SIZE_BY = ["activity", "links", "uniform"];
const QUALITIES = ["auto", "high", "low", "mobile"];
const LANGUAGES = ["auto", "zh", "en"];

/** Filter and navigation choices that survive a version migration. */
const PRESERVED_KEYS = ["showLinks", "hidden", "only", "filterText", "lens", "orphans", "empty", "autoOrbit", "tour", "language", "panelWidth", "panelSections", "selectionDepth"];
/**
 * Turn whatever was stored into a usable settings object.
 *
 * @param stored - the parsed JSON (any value; non-objects mean "nothing stored").
 * @returns `{ settings, migrated }`; `migrated` is true when the caller should
 *   write `settings` back (old version upgraded, or a stale isolate pin healed).
 */
function migrateSettings(stored) {
	if (stored === null || typeof stored !== "object" || Array.isArray(stored)) {
		return { settings: { ...DEFAULTS, hidden: [] }, migrated: false };
	}
	const version = Number.isFinite(stored.settingsVersion) ? stored.settingsVersion : 0;
	let merged;
	let migrated = false;
	if (version < SETTINGS_VERSION) {
		merged = { ...DEFAULTS };
		for (const key of PRESERVED_KEYS) {
			if (Object.prototype.hasOwnProperty.call(stored, key)) merged[key] = stored[key];
		}
		merged.settingsVersion = SETTINGS_VERSION;
		migrated = true;
	} else {
		merged = { ...DEFAULTS, ...stored };
	}
	merged.hidden = Array.isArray(merged.hidden) ? merged.hidden.filter((id) => typeof id === "string") : [];
	if (typeof merged.only !== "string") merged.only = null;
	if (typeof merged.filterText !== "string") merged.filterText = "";
	for (const key of Object.keys(DEFAULTS)) {
		if (typeof DEFAULTS[key] === "number" && !Number.isFinite(merged[key])) merged[key] = DEFAULTS[key];
		if (typeof DEFAULTS[key] === "boolean" && typeof merged[key] !== "boolean") merged[key] = DEFAULTS[key];
	}
	if (!LAYOUTS.includes(merged.layout)) merged.layout = DEFAULTS.layout;
	if (!SIZE_BY.includes(merged.sizeBy)) merged.sizeBy = DEFAULTS.sizeBy;
	if (!QUALITIES.includes(merged.quality)) merged.quality = DEFAULTS.quality;
	if (!LANGUAGES.includes(merged.language)) merged.language = DEFAULTS.language;
	if (merged.linkColor !== "auto" && linkColorRgb(merged.linkColor) === null) merged.linkColor = DEFAULTS.linkColor;
	merged.linkWidth = Math.min(4, Math.max(0.2, merged.linkWidth));
	merged.linkBrightness = Math.min(2.5, Math.max(0.3, merged.linkBrightness));
	merged.linkCurve = Math.min(2, Math.max(0, merged.linkCurve));
	merged.selectionDepth = merged.selectionDepth === 1 ? 1 : 2;
	merged.panelWidth = Math.min(480, Math.max(240, merged.panelWidth));
	merged.panelSections =
		merged.panelSections !== null && typeof merged.panelSections === "object" && !Array.isArray(merged.panelSections)
			? Object.fromEntries(Object.entries(merged.panelSections).filter(([, open]) => typeof open === "boolean"))
			: {};
	// 星团 was replaced by 极简 in the same slot.
	if (merged.preset === "clusters" || merged.layout === "clusters") {
		Object.assign(merged, PRESETS.minimal, { preset: "minimal" });
		migrated = true;
	}
	// 球壳 was replaced by 太阳系 in the same slot.
	if (merged.preset === "bubble" || merged.layout === "bubble") {
		Object.assign(merged, PRESETS.system, { preset: "system" });
		migrated = true;
	}
	// 晶格 was replaced by 深空场 in the same slot.
	if (merged.preset === "lattice" || merged.layout === "lattice") {
		Object.assign(merged, PRESETS.deepfield, { preset: "deepfield" });
		migrated = true;
	}
	// "Only this workspace" pointing at a hidden workspace leaves nothing to draw.
	// Both halves are stale (a pin survives the hide), so drop the pin and unhide it.
	if (merged.only !== null && merged.hidden.includes(merged.only)) {
		merged.hidden = merged.hidden.filter((id) => id !== merged.only);
		merged.only = null;
		migrated = true;
	}
	return { settings: merged, migrated };
}

/** A custom link colour as [r, g, b], or null for "auto" and anything that is not "#rrggbb". */
function linkColorRgb(value) {
	const match = typeof value === "string" ? /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(value) : null;
	return match === null ? null : [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
}

export { DEFAULTS, DEFAULT_THEME, LANGUAGES, PRESERVED_KEYS, PRESETS, QUALITIES, SETTINGS_VERSION, SIZE_BY, SPACE, THEMES, linkColorRgb, migrateSettings, themeOf };

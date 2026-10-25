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
const SETTINGS_VERSION = 2;

/** Default deep-space base; the original six themes keep it. */
const SPACE = "#1c1c1c";

/**
 * Eight hand-tuned looks. Each one is a partial override on {@link DEFAULTS}; the parts
 * it does not mention stay as they were, which is what makes "自定义" meaningful.
 */
const PRESETS = {
	galaxy: { layout: "spiral", theme: "deepfield", brightness: 0.5, bloom: 0.44, threshold: 0.24, veil: 0.34, field: 0.7, shellSize: 1, shellGlow: 1, mist: 0.34, backdrop: true, arms: 2, twist: 4.3, thickness: 1, spread: 1, orbitSpeed: 0.35 },
	rings: { layout: "rings", theme: "sunset", brightness: 0.48, bloom: 0.5, threshold: 0.2, veil: 0.2, field: 0.5, shellSize: 1, shellGlow: 0.85, mist: 0.4, backdrop: true, arms: 1, twist: 1.3, thickness: 0.5, spread: 1.2, orbitSpeed: 0.4 },
	lattice: { layout: "lattice", theme: "aurora", brightness: 0.46, bloom: 0.34, threshold: 0.28, veil: 0.16, field: 0.45, shellSize: 0.9, shellGlow: 0.8, mist: 0.6, backdrop: true, arms: 2, twist: 3, thickness: 1, spread: 0.9, orbitSpeed: 0.26 },
	bubble: { layout: "bubble", theme: "neon", brightness: 0.44, bloom: 0.52, threshold: 0.22, veil: 0.3, field: 0.5, shellSize: 1.15, shellGlow: 0.9, mist: 0.586, backdrop: true, arms: 2, twist: 3.4, thickness: 1, spread: 1, orbitSpeed: 0.3 },
	helix: { layout: "helix", theme: "cyber", brightness: 0.5, bloom: 0.46, threshold: 0.22, veil: 0.18, field: 0.48, shellSize: 1, shellGlow: 0.85, mist: 0.55, backdrop: true, arms: 2, twist: 4, thickness: 1.1, spread: 1, orbitSpeed: 0.32 },
	clusters: { layout: "clusters", theme: "matrix", brightness: 0.46, bloom: 0.5, threshold: 0.2, veil: 0.24, field: 0.5, shellSize: 1, shellGlow: 0.85, mist: 0.5, backdrop: true, arms: 2, twist: 3, thickness: 1, spread: 1, orbitSpeed: 0.28 },
	plate: { layout: "plate", theme: "hubble", brightness: 0.5, bloom: 0.26, threshold: 0.3, veil: 0.08, field: 0.45, shellSize: 0.85, shellGlow: 0.8, mist: 0.52, backdrop: true, arms: 2, twist: 3, thickness: 1, spread: 0.8, orbitSpeed: 0.22 },
	tree: { layout: "tree", theme: "neon", brightness: 0.48, bloom: 0.42, threshold: 0.24, veil: 0.22, field: 0.48, shellSize: 1, shellGlow: 0.85, mist: 0.552, backdrop: true, arms: 2, twist: 3.6, thickness: 1, spread: 1, orbitSpeed: 0.3 }
};

/**
 * Palettes: node hues, backdrop veils, nucleus tint, filament tint and the plane
 * colour (`base`) that the canvas, the warp overlay and the star interior share.
 *
 * `hues` are hue sources in degrees; the star sprite derives saturation and
 * lightness. "deepfield" follows the Obsidian Galaxy View reference: cool and warm
 * slots alternate by hueIndex (cool 160–230°, warm 25–55°), so with two arms the
 * even workspaces (cool) and odd ones (warm) split the arms evenly.
 */
const THEMES = {
	deepfield: { hues: [184, 38, 205, 28, 172, 46, 196, 33], veils: ["rgba(16,34,52,0.10)", "rgba(40,30,14,0.06)", "rgba(14,40,46,0.06)", "rgba(30,24,12,0.05)"], nucleus: [235, 240, 238], link: [150, 170, 180], base: "#000003", vignette: false },
	hubble: { hues: [265, 208, 158, 28, 330, 96, 190, 12], veils: ["rgba(70,58,150,0.20)", "rgba(28,76,140,0.16)", "rgba(120,56,132,0.14)", "rgba(24,104,104,0.1)"], nucleus: [255, 246, 226], link: [150, 180, 235], base: SPACE, vignette: true },
	neon: { hues: [190, 300, 150, 50, 265, 330, 175, 210], veils: ["rgba(20,90,150,0.22)", "rgba(140,40,160,0.18)", "rgba(20,130,140,0.14)", "rgba(60,40,140,0.16)"], nucleus: [220, 250, 255], link: [120, 220, 255], base: SPACE, vignette: true },
	sunset: { hues: [22, 342, 46, 300, 10, 40, 320, 355], veils: ["rgba(150,60,50,0.2)", "rgba(120,60,120,0.16)", "rgba(170,90,50,0.14)", "rgba(90,50,90,0.14)"], nucleus: [255, 226, 180], link: [255, 190, 160], base: SPACE, vignette: true },
	cyber: { hues: [175, 285, 320, 200, 240, 300, 160, 265], veils: ["rgba(20,110,120,0.22)", "rgba(110,40,150,0.2)", "rgba(30,90,160,0.16)", "rgba(140,40,110,0.12)"], nucleus: [210, 255, 245], link: [140, 255, 240], base: SPACE, vignette: true },
	matrix: { hues: [120, 140, 96, 160, 110, 132, 88, 150], veils: ["rgba(20,80,40,0.22)", "rgba(20,110,60,0.16)", "rgba(40,70,30,0.14)", "rgba(20,60,50,0.12)"], nucleus: [220, 255, 220], link: [120, 255, 160], base: SPACE, vignette: true },
	aurora: { hues: [155, 190, 280, 120, 210, 300, 170, 265], veils: ["rgba(30,110,110,0.2)", "rgba(70,60,150,0.18)", "rgba(40,130,120,0.14)", "rgba(60,110,160,0.12)"], nucleus: [230, 250, 240], link: [170, 240, 220], base: SPACE, vignette: true }
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
	brightness: 0.5,
	bloom: 0.44,
	threshold: 0.24,
	veil: 0.34,
	field: 0.7,
	shellSize: 1,
	shellGlow: 1,
	mist: 0.34,
	backdrop: true,
	arms: 2,
	twist: 4.3,
	thickness: 1,
	spread: 1,
	autoOrbit: true,
	orbitSpeed: 0.35,
	quality: "auto",
	tour: false,
	hidden: [],
	only: null,
	orphans: false,
	empty: false,
	lens: null,
	filterText: ""
};

/** Filter and navigation choices that survive a version migration. */
const PRESERVED_KEYS = ["hidden", "only", "filterText", "lens", "orphans", "empty", "autoOrbit", "tour"];

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
	// "Only this workspace" pointing at a hidden workspace leaves nothing to draw.
	// Both halves are stale (a pin survives the hide), so drop the pin and unhide it.
	if (merged.only !== null && merged.hidden.includes(merged.only)) {
		merged.hidden = merged.hidden.filter((id) => id !== merged.only);
		merged.only = null;
		migrated = true;
	}
	return { settings: merged, migrated };
}

export { DEFAULTS, DEFAULT_THEME, PRESERVED_KEYS, PRESETS, SETTINGS_VERSION, SPACE, THEMES, migrateSettings, themeOf };

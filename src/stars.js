/**
 * Pure star, link and haze look: the Galaxy View node recipe translated to Canvas 2D.
 *
 * Colour maths, the disc profile, the link tint and the haze billboards live here so
 * `scripts/selfcheck.mjs` can check them in Node. The sprite bakers at the bottom only
 * touch `document` when called; `scripts/build.mjs` inlines this file into the client
 * bundle after `src/graph-model.js` (and strips the import below).
 */
import { hash01, hashStreams } from "./graph-model.js";

/**
 * Plateau saturation and lightness of a star body. Read off a close-up Obsidian Galaxy
 * View screenshot after its tone mapping and bloom (cyan ≈ rgb(156,226,228), gold ≈
 * rgb(238,217,154), violet ≈ rgb(178,150,227)). The rim plateau is S 0.7 / L 0.66 and
 * the interior lightens toward the core ({@link discSample}). Red–orange bodies
 * sit deeper and more saturated (≈ rgb(229,105,53)), see {@link starPlateau}.
 */
const STAR_SATURATION = 0.7;
/**
 * 星体亮度 → body gain. 0.3–0.5 keeps 0.55 + 0.9·b (exactly 1 at the default 0.5); below
 * it dims toward 0.1, above it rises past 1 and the extra is drawn as an additive pass.
 * Lives here beside the constants it scales so the settled values can be checked.
 */
/** 星体亮度's ceiling, shared by the slider and the gain curve (the default sits at 1.2). */
const BRIGHTNESS_MAX = 2.4;

function brightnessGain(brightness) {
	const b = Math.min(BRIGHTNESS_MAX, Math.max(0, Number(brightness) || 0));
	if (b < 0.3) return 0.1 + 2.4 * b;
	if (b <= 0.5) return 0.55 + 0.9 * b;
	return 1 + (b - 0.5) * 1.2;
}

/** 星体亮度 is settled (owner-approved): do not retune these three without being asked. */
const STAR_LIGHTNESS = 0.72;
/** The white-hot core never reaches pure white. */
const STAR_CORE = [244, 247, 245];
/** Peak channel of a body's plateau. Settled with STAR_LIGHTNESS — see above. */
const STAR_PEAK = 250;
/** Fixed screen-space halos in CSS px, independent of the body size. */
const HALO_INNER = { sigma: 3.4, radius: 14 };
const HALO_OUTER = { sigma: 11, radius: 34 };

function starClamp01(value) {
	return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** GLSL smoothstep; `e0 > e1` gives the inverted ramp. */
function smoothstep(e0, e1, x) {
	const t = starClamp01((x - e0) / (e1 - e0));
	return t * t * (3 - 2 * t);
}

/** HSL (hue in degrees, s and l in 0–1) → [r, g, b] in 0–255. */
function hslToRgb(hue, saturation, lightness) {
	const h = (((hue % 360) + 360) % 360) / 60;
	const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
	const x = chroma * (1 - Math.abs((h % 2) - 1));
	const m = lightness - chroma / 2;
	const [r, g, b] = h < 1 ? [chroma, x, 0] : h < 2 ? [x, chroma, 0] : h < 3 ? [0, chroma, x] : h < 4 ? [0, x, chroma] : h < 5 ? [x, 0, chroma] : [chroma, 0, x];
	return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

/** [r, g, b] in 0–255 → [hue°, s, l]. */
function rgbToHsl(r, g, b) {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const lightness = (max + min) / 2;
	if (max === min) return [0, 0, lightness];
	const delta = max - min;
	const saturation = delta / (1 - Math.abs(2 * lightness - 1));
	let hue = max === rn ? ((gn - bn) / delta) % 6 : max === gn ? (bn - rn) / delta + 2 : (rn - gn) / delta + 4;
	hue *= 60;
	return [hue < 0 ? hue + 360 : hue, saturation, lightness];
}

/**
 * Body plateau colour for a hue, peak channel capped at {@link STAR_PEAK}. At night,
 * hues within ±24° of 18° (red–orange) trade up to 0.14 lightness for 0.16 saturation,
 * so they read as deep embers instead of pastel salmon.
 * @param tone - optional palette `[saturation, lightness]` for slots that are not a plain
 *   hue (cream, silver, a pale gold); it replaces the defaults and the ember shift.
 *   An explicit `lightness` still wins over the tone's lightness.
 */
function starPlateau(hue, lightness, tone) {
	const given = Number.isFinite(lightness);
	const toned = Array.isArray(tone);
	const h = (((hue % 360) + 360) % 360);
	const warm = given || toned ? 0 : smoothstep(24, 0, Math.min(Math.abs(h - 18), 360 - Math.abs(h - 18)));
	const saturation = toned ? tone[0] : STAR_SATURATION;
	const rgb = hslToRgb(hue, Math.min(1, saturation + 0.16 * warm), (given ? lightness : toned ? tone[1] : STAR_LIGHTNESS) - 0.14 * warm);
	const peak = Math.max(...rgb);
	return peak <= STAR_PEAK ? rgb : rgb.map((channel) => Math.round((channel * STAR_PEAK) / peak));
}

/**
 * Disc profile at `d = r / (2·rd)` (0 at the centre, 0.5 at the rim): solid to 0.9·rd with
 * a crisp edge to 0 at rd. The white mix falls off as `core·(1 − r/rd)^2.4` across the whole
 * disc, so a body reads as an emissive sphere (hot centre, saturated rim) rather than a
 * flat bead with a dot, as in the close-up reference.
 * @returns `[alpha, white]`, where white is the mix toward {@link STAR_CORE}.
 */
function discSample(d, core) {
	// A body is a solid disc, not a pane of glass: fully opaque out to 96% of the radius,
	// then a 4% ramp. The white-hot centre is *confined to the inner quarter of the radius*
	// and fades into the body's own colour from there — a small hot core, not a bleached
	// disc — which is what makes the body read as a star with a colour rather than a blob.
	// Opaque material: full alpha across the disc with only a 2% antialiased edge. The
	// transparency the owner objected to lived here (a 4% ramp plus brightness thinning the
	// body below); dimming is now carried by the semantic fades and the light, not by
	// making the star see-through.
	const alpha = smoothstep(0.5, 0.49, d);
	const white = (core ?? 0.75) * smoothstep(0.17, 0.01, d);
	return [alpha, white];
}

/** Colour of a disc pixel: the plateau mixed toward the core by `white`. */
function discColour(plateau, white) {
	return [0, 1, 2].map((channel) => Math.round(plateau[channel] + (STAR_CORE[channel] - plateau[channel]) * white));
}

/**
 * 辉光范围 → the halo's drawn span. The halos are baked gaussians, so drawing one
 * larger spreads the same light over more pixels and reads as "nothing happened";
 * {@link bloomSpanGain} restores the peak by the area ratio.
 */
function bloomSpan(bloom) {
	return 0.55 + (Number.isFinite(Number(bloom)) ? starClamp01(Number(bloom)) : 0) * 1.3;
}

/**
 * Alpha that keeps a wider halo as bright as the neutral span. The halos are baked
 * gaussians, so the drawn size and the alpha must move together: the gain is the
 * area ratio (span²) against the default span, so the shipped presets look exactly
 * as before while dragging 辉光范围 visibly grows or shrinks the glow.
 */
const BLOOM_NEUTRAL_SPAN = bloomSpan(0.44);
function bloomSpanGain(bloom) {
	const ratio = bloomSpan(bloom) / BLOOM_NEUTRAL_SPAN;
	return Math.min(2.6, Math.max(0.2, ratio * ratio));
}

/**
 * A body's bloom brightness from its own mass (the quantity that also sizes it), 0–1.
 * Mass rather than the projected dot, so 阈值 means the same thing at every zoom:
 * a small conversation sits low, its workspace sun sits high.
 */
function bloomLuminance(mass) {
	const value = Number.isFinite(mass) ? mass : 0;
	return starClamp01((value - 0.55) / 1.15);
}

/**
 * 阈值 → which bodies bloom, as Galaxy View means it: a body glows above the
 * threshold, with a soft ramp so dragging the slider dims the small stars first,
 * leaves only the suns, and finally nothing.
 */
function bloomGate(luminance, threshold) {
	const at = Number.isFinite(Number(threshold)) ? starClamp01(Number(threshold)) : 0;
	const low = Number.isFinite(luminance) ? starClamp01(luminance) : 0;
	return smoothstep(at - 0.22, at + 0.22, low);
}

/** Inner halo peak alpha for a body radius in CSS px: `0.6·min(1, (rd/3)²)`, standing in for the reference's bloom pass. */
function innerHaloAlpha(rd) {
	return 0.72 * Math.min(1, (rd / 3) ** 2);
}

/**
 * Link colour from its two endpoint plateaus: the mixed hue at the reference's 0.4×
 * saturation (`palette.ts linkColor`) on a light wire (`l 0.76`), so links read as
 * teal / amber threads like the bloomed Obsidian graph rather than grey.
 * `touched` is the selected tier (`s·1.2`, `l 0.8`).
 */
function linkTint(colourA, colourB, touched) {
	const [hue, saturation] = rgbToHsl((colourA[0] + colourB[0]) / 2, (colourA[1] + colourB[1]) / 2, (colourA[2] + colourB[2]) / 2);
	return touched ? hslToRgb(hue, Math.min(1, saturation * 1.2), 0.86) : hslToRgb(hue, saturation * 0.4, 0.81);
}

/** WCAG relative luminance of an sRGB colour (0 black, 1 white). */
function relativeLuminance([r, g, b]) {
	const linear = (channel) => {
		const value = channel / 255;
		return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** sRGB 0–255 → Oklab `[L, a, b]` (Björn Ottosson's matrices). */
function srgbToOklab([r, g, b]) {
	const linear = (channel) => {
		const value = channel / 255;
		return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
	};
	const [lr, lg, lb] = [linear(r), linear(g), linear(b)];
	const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
	const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
	const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
	return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

/** Oklab → linear sRGB, unclamped (a channel outside 0–1 means out of gamut). */
function oklabToLinear(lightness, a, b) {
	const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}

/** OKLCH → sRGB 0–255, shrinking chroma until the colour fits the gamut. */
function oklchToRgb(lightness, chroma, hue) {
	let c = chroma;
	let linear = oklabToLinear(lightness, c * Math.cos(hue), c * Math.sin(hue));
	for (let step = 0; step < 24 && linear.some((channel) => channel < 0 || channel > 1); step += 1) {
		c *= 0.9;
		linear = oklabToLinear(lightness, c * Math.cos(hue), c * Math.sin(hue));
	}
	return linear.map((channel) => {
		const value = Math.min(1, Math.max(0, channel));
		return Math.round(255 * (value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055));
	});
}

/** Link-end OKLCH lightness and chroma cap, resting and selected. */
const LINK_END = { lightness: 0.74, chroma: 0.07 };
const LINK_END_TOUCHED = { lightness: 0.84, chroma: 0.095 };

/**
 * One end of a gradient link: the endpoint star's own hue at one shared OKLCH
 * lightness and a capped chroma. Equal HSL lightness and saturation are neither
 * equally bright nor equally colourful: cyan read twice as bright as violet and
 * more saturated than everything else, so its links outshone the rest. Pale slots
 * (silver, cream) keep their own lower chroma.
 */
function linkEnd(colour, touched) {
	const [, a, b] = srgbToOklab(colour);
	const target = touched ? LINK_END_TOUCHED : LINK_END;
	return oklchToRgb(target.lightness, Math.min(Math.hypot(a, b), target.chroma), Math.atan2(b, a));
}

/**
 * 连线亮度 applied to a link colour in OKLab: below 1 scales lightness towards
 * black, above 1 lifts it towards white (fully white at 2.5) while keeping the
 * hue and as much chroma as the gamut allows, so a green link stays green.
 */
function linkShade(colour, brightness) {
	if (brightness === 1) return colour;
	const [lightness, a, b] = srgbToOklab(colour);
	const target = brightness < 1 ? lightness * brightness : lightness + (1 - lightness) * Math.min(1, (brightness - 1) / 1.5);
	return oklchToRgb(Math.min(1, Math.max(0, target)), Math.hypot(a, b), Math.atan2(b, a));
}

/**
 * World-space nebula billboards (recipe §4): 6 centres × 24 sprites around the core,
 * tinted between the first two palette colours. Each centre owns one colour, so the
 * renderer needs only six cached sprites; per-sprite brightness rides on alpha.
 * @param shellRadius - radius of the sky shell; the cloud spans `R = 0.4·shellRadius`.
 * @returns `{ colours: [[r,g,b]×6], sprites: [{ x, y, z, d, c, a }] }`.
 */
function createNebula(shellRadius, colourA, colourB) {
	const spread = 0.4 * shellRadius;
	const colours = [];
	const sprites = [];
	for (let centre = 0; centre < 6; centre += 1) {
		const [cu, cv, cw, cd, ct, cl] = hashStreams(`nebula-centre/${centre}`, 6);
		const mixed = [0, 1, 2].map((channel) => colourA[channel] + (colourB[channel] - colourA[channel]) * ct);
		const [hue, saturation] = rgbToHsl(mixed[0], mixed[1], mixed[2]);
		colours.push(hslToRgb(hue + (cl - 0.5) * 18, Math.min(saturation * 0.85, 0.9), 0.2));
		const lightness = 0.16 + 0.08 * cl;
		const distance = spread * (0.7 + 1.7 * cd);
		const angle = cu * Math.PI * 2;
		const cx = Math.cos(angle) * distance;
		const cz = Math.sin(angle) * distance;
		const cy = (cv - 0.5) * distance * 0.75;
		const reach = spread * (0.5 + 0.5 * cw);
		for (let index = 0; index < 24; index += 1) {
			const s = hashStreams(`nebula-sprite:${centre}:${index}`, 11);
			const big = s[9] < 0.25;
			sprites.push({
				x: cx + (s[0] + s[1] + s[2] - 1.5) * reach,
				y: cy + (s[3] + s[4] + s[5] - 1.5) * reach * 0.8,
				z: cz + (s[6] + s[7] + s[8] - 1.5) * reach,
				d: spread * (big ? 1 + 0.8 * s[10] : 0.4 + 0.5 * s[10]),
				c: centre,
				a: (lightness / 0.2) * (0.85 + 0.3 * hash01(`nebula-jitter#${centre * 24 + index}`))
			});
		}
	}
	return { colours, sprites };
}

/**
 * Cluster clouds: up to twelve of the largest workspaces with at least five stars get
 * three soft sprites at their members' centroid, in the workspace colour at L 0.46.
 * @param members - `[{ hue, points: [{x,y,z}] }]`, one entry per workspace.
 */
function createClusterClouds(members) {
	const ranked = members.filter((entry) => entry.points.length >= 5).sort((a, b) => b.points.length - a.points.length).slice(0, 12);
	const colours = [];
	const sprites = [];
	ranked.forEach((entry, cluster) => {
		const n = entry.points.length;
		const cx = entry.points.reduce((sum, point) => sum + point.x, 0) / n;
		const cy = entry.points.reduce((sum, point) => sum + point.y, 0) / n;
		const cz = entry.points.reduce((sum, point) => sum + point.z, 0) / n;
		const rms = Math.sqrt(entry.points.reduce((sum, point) => sum + (point.x - cx) ** 2 + (point.y - cy) ** 2 + (point.z - cz) ** 2, 0) / n);
		const spread = Math.max(0.05, rms);
		const [hue, saturation] = rgbToHsl(...starPlateau(entry.hue, undefined, entry.tone));
		colours.push(hslToRgb(hue, Math.min(1, saturation * 1.25), 0.46));
		for (let index = 0; index < 3; index += 1) {
			const s = hashStreams(`cluster-cloud:${entry.key}#${index}`, 4);
			sprites.push({ x: cx + (s[0] - 0.5) * spread, y: cy + (s[1] - 0.5) * spread * 0.7, z: cz + (s[2] - 0.5) * spread, d: spread * (1.6 + 0.8 * s[3]), c: cluster, a: 1 });
		}
	});
	return { colours, sprites };
}

/* ── sprite bakers (browser only, all cached) ─────────────────────────────── */

const DISC_CACHE = new Map();
const HALO_CACHE = new Map();
const HAZE_CACHE = new Map();

function starCanvas(size) {
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	return canvas;
}

const SPRITE_BITMAPS = new WeakMap();

/**
 * The drawable for a baked sprite canvas: its ImageBitmap once ready, the canvas until
 * then. Small canvases stay CPU-backed, and Chrome re-uploads such a source for each
 * drawImage onto the GPU frame; a few hundred halos and bodies a frame cost tens of ms.
 * An ImageBitmap is uploaded once and stays resident.
 */
function spriteImage(canvas) {
	const known = SPRITE_BITMAPS.get(canvas);
	if (known !== undefined) return known === null ? canvas : known;
	SPRITE_BITMAPS.set(canvas, null);
	if (typeof createImageBitmap === "function") {
		createImageBitmap(canvas).then(
			(bitmap) => SPRITE_BITMAPS.set(canvas, bitmap),
			() => {}
		);
	}
	return canvas;
}

/**
 * Body sprite baked at its exact device size with 4×4 supersampling, so a 2–5 px
 * disc keeps its soft rim and white core instead of being minified from a big bitmap.
 * @param diameter - drawn diameter in device px (quantised to 0.5 by the caller).
 * @param lightness - optional plateau lightness; omitted means {@link STAR_LIGHTNESS}.
 * @returns `{ canvas, size }` with `size` the sprite side in device px.
 */
/**
 * The sprite ladder. A body's diameter is snapped to one of these before it is baked, so a
 * deep zoom cannot mint a new bitmap every frame (0.5 px steps up to 90 px meant ~180 distinct
 * sizes per hue, each a fresh 4×4-supersampled bake — that is what made the dive stutter).
 */
const STAR_DIAMETERS = [2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96];

/** Nearest ladder diameter, never below 2 px. */
function quantiseDiameter(diameter) {
	const want = Math.max(2, Math.ceil(diameter));
	for (const step of STAR_DIAMETERS) if (step >= want) return step;
	return STAR_DIAMETERS[STAR_DIAMETERS.length - 1];
}

function discSprite(hue, diameter, core, lightness, tone) {
	const key = `${hue}|${diameter}|${core}|${lightness ?? ""}|${tone ?? ""}`;
	const hit = DISC_CACHE.get(key);
	if (hit !== undefined) return hit;
	// One bitmap per ladder step, never one per zoom frame: a disc above 32 px is a smooth
	// radial gradient, so scaling the 32 px bake up is indistinguishable from baking at 96 px
	// and costs 9× less — and the size can stay continuous instead of snapping.
	const bake = Math.min(32, quantiseDiameter(diameter));
	const size = bake + 2;
	const canvas = starCanvas(size);
	const paint = canvas.getContext("2d");
	const image = paint.createImageData(size, size);
	const plateau = starPlateau(hue, lightness, tone);
	const centre = size / 2;
	// 4×4 samples buy the soft rim on a 2–10 px disc; above that the rim is several pixels wide
	// on its own, so 2×2 (1× past 40 px) is the same pixels for a fraction of the bake.
	const supersample = size > 40 ? 1 : size > 20 ? 2 : 4;
	const samples = supersample * supersample;
	for (let y = 0; y < size; y += 1) {
		for (let x = 0; x < size; x += 1) {
			let alpha = 0;
			let r = 0;
			let g = 0;
			let b = 0;
			for (let sy = 0; sy < supersample; sy += 1) {
				for (let sx = 0; sx < supersample; sx += 1) {
					const d = Math.hypot(x + (sx + 0.5) / supersample - centre, y + (sy + 0.5) / supersample - centre) / bake;
					const [a, white] = discSample(d, core);
					if (a <= 0) continue;
					const [cr, cg, cb] = discColour(plateau, white);
					alpha += a;
					r += cr * a;
					g += cg * a;
					b += cb * a;
				}
			}
			const at = (y * size + x) * 4;
			if (alpha > 0) {
				image.data[at] = Math.round(r / alpha);
				image.data[at + 1] = Math.round(g / alpha);
				image.data[at + 2] = Math.round(b / alpha);
			}
			image.data[at + 3] = Math.round((alpha / samples) * 255);
		}
	}
	paint.putImageData(image, 0, 0);
	const sprite = { canvas, size };
	DISC_CACHE.set(key, sprite);
	return sprite;
}

/** Gaussian halo in the star hue at L 50% (the tone's saturation when given), `sigma`/`radius` in CSS px, baked per dpr. */
function haloSprite(hue, halo, dpr, tone) {
	const key = `${hue}|${halo.sigma}|${dpr}|${tone ?? ""}`;
	const hit = HALO_CACHE.get(key);
	if (hit !== undefined) return hit;
	const size = Math.max(4, Math.round(halo.radius * 2 * dpr));
	const canvas = starCanvas(size);
	const paint = canvas.getContext("2d");
	const image = paint.createImageData(size, size);
	const [r, g, b] = hslToRgb(hue, Array.isArray(tone) ? tone[0] : STAR_SATURATION, 0.5);
	const centre = size / 2;
	const sigma = halo.sigma * dpr;
	for (let y = 0; y < size; y += 1) {
		for (let x = 0; x < size; x += 1) {
			const d2 = (x + 0.5 - centre) ** 2 + (y + 0.5 - centre) ** 2;
			const at = (y * size + x) * 4;
			image.data[at] = r;
			image.data[at + 1] = g;
			image.data[at + 2] = b;
			image.data[at + 3] = d2 < centre * centre ? Math.round(255 * Math.exp(-d2 / (2 * sigma * sigma))) : 0;
		}
	}
	paint.putImageData(image, 0, 0);
	HALO_CACHE.set(key, canvas);
	return canvas;
}

/**
 * Soft haze billboard in one colour. `kind` "nebula" uses `exp(−2.6r²) − 0.0743`
 * over r = 0…1, "cloud" uses `exp(−10d²) − 0.0821` over d = 0…0.5.
 */
function hazeSprite(colour, kind) {
	const key = `${kind}|${colour.join(",")}`;
	const hit = HAZE_CACHE.get(key);
	if (hit !== undefined) return hit;
	const size = 64;
	const canvas = starCanvas(size);
	const paint = canvas.getContext("2d");
	const image = paint.createImageData(size, size);
	const floor = kind === "cloud" ? Math.exp(-10 * 0.25) : Math.exp(-2.6);
	for (let y = 0; y < size; y += 1) {
		for (let x = 0; x < size; x += 1) {
			const r = Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) / (size / 2);
			const value = kind === "cloud" ? Math.exp(-10 * (r / 2) ** 2) : Math.exp(-2.6 * r * r);
			const alpha = r >= 1 ? 0 : Math.max(0, (value - floor) / (1 - floor));
			const at = (y * size + x) * 4;
			image.data[at] = colour[0];
			image.data[at + 1] = colour[1];
			image.data[at + 2] = colour[2];
			image.data[at + 3] = Math.round(alpha * 255);
		}
	}
	paint.putImageData(image, 0, 0);
	HAZE_CACHE.set(key, canvas);
	return canvas;
}

export {
	BRIGHTNESS_MAX,
	STAR_SATURATION,
	STAR_LIGHTNESS,
	STAR_DIAMETERS,
	quantiseDiameter,
	brightnessGain,
	STAR_CORE,
	STAR_PEAK,
	HALO_INNER,
	HALO_OUTER,
	smoothstep,
	hslToRgb,
	rgbToHsl,
	starPlateau,
	discSample,
	discColour,
	innerHaloAlpha,
	bloomSpan,
	bloomSpanGain,
	bloomLuminance,
	bloomGate,
	linkTint,
	linkEnd,
	linkShade,
	relativeLuminance,
	srgbToOklab,
	createNebula,
	createClusterClouds,
	discSprite,
	haloSprite,
	spriteImage,
	hazeSprite
};

/**
 * Pure star, link and haze look: the Galaxy View node recipe translated to Canvas 2D.
 *
 * Colour maths, the disc profile, the link tint and the haze billboards live here so
 * `scripts/selfcheck.mjs` can check them in Node. The sprite bakers at the bottom only
 * touch `document` when called; `scripts/build.mjs` inlines this file into the client
 * bundle after `src/graph-model.js` (and strips the import below).
 */
import { hash01, hashStreams } from "./graph-model.js";

/** Plateau saturation and lightness of a star body (recipe: S 55–70%, L 72–78%). */
const STAR_SATURATION = 0.62;
const STAR_LIGHTNESS = 0.75;
/** The white-hot core never reaches pure white. */
const STAR_CORE = [235, 240, 238];
const STAR_PEAK = 235;
/** Fixed screen-space halos in CSS px, independent of the body size. */
const HALO_INNER = { sigma: 3, radius: 12 };
const HALO_OUTER = { sigma: 10, radius: 28 };

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

/** Body plateau colour for a hue, peak channel capped at {@link STAR_PEAK}. */
function starPlateau(hue) {
	const rgb = hslToRgb(hue, STAR_SATURATION, STAR_LIGHTNESS);
	const peak = Math.max(...rgb);
	return peak <= STAR_PEAK ? rgb : rgb.map((channel) => Math.round((channel * STAR_PEAK) / peak));
}

/**
 * Disc profile at `d = r / (2·rd)` (0 at the centre, 0.5 at the rim), identical to the
 * reference point-sprite shader: full to 0.84·rd, soft to 0 at rd, white core within 0.36·rd.
 * @returns `[alpha, white]`, where white is the mix toward {@link STAR_CORE}.
 */
function discSample(d, core) {
	return [smoothstep(0.5, 0.42, d), (core ?? 0.55) * smoothstep(0.18, 0, d)];
}

/** Colour of a disc pixel: the plateau mixed toward the core by `white`. */
function discColour(plateau, white) {
	return [0, 1, 2].map((channel) => Math.round(plateau[channel] + (STAR_CORE[channel] - plateau[channel]) * white));
}

/** Inner halo peak alpha for a body radius in CSS px: `0.32·min(1, (rd/3)²)`. */
function innerHaloAlpha(rd) {
	return 0.32 * Math.min(1, (rd / 3) ** 2);
}

/**
 * Link colour from its two endpoint plateaus: mix, then desaturate and darken
 * (`s·0.4`, `l ≤ 0.35`). `touched` is the selected tier (`s·1.2`, `l 0.62`).
 */
function linkTint(colourA, colourB, touched) {
	const [hue, saturation, lightness] = rgbToHsl((colourA[0] + colourB[0]) / 2, (colourA[1] + colourB[1]) / 2, (colourA[2] + colourB[2]) / 2);
	return touched ? hslToRgb(hue, Math.min(1, saturation * 1.2), 0.62) : hslToRgb(hue, saturation * 0.4, Math.min(lightness, 0.35));
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
 * Cluster clouds: up to ten of the largest workspaces with at least eight stars get
 * three soft sprites at their members' centroid, in the workspace colour at L 0.40.
 * @param members - `[{ hue, points: [{x,y,z}] }]`, one entry per workspace.
 */
function createClusterClouds(members) {
	const ranked = members.filter((entry) => entry.points.length >= 8).sort((a, b) => b.points.length - a.points.length).slice(0, 10);
	const colours = [];
	const sprites = [];
	ranked.forEach((entry, cluster) => {
		const n = entry.points.length;
		const cx = entry.points.reduce((sum, point) => sum + point.x, 0) / n;
		const cy = entry.points.reduce((sum, point) => sum + point.y, 0) / n;
		const cz = entry.points.reduce((sum, point) => sum + point.z, 0) / n;
		const rms = Math.sqrt(entry.points.reduce((sum, point) => sum + (point.x - cx) ** 2 + (point.y - cy) ** 2 + (point.z - cz) ** 2, 0) / n);
		const spread = Math.max(0.05, rms);
		const [hue, saturation] = rgbToHsl(...starPlateau(entry.hue));
		colours.push(hslToRgb(hue, Math.min(1, saturation * 1.25), 0.4));
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

/**
 * Body sprite baked at its exact device size with 4×4 supersampling, so a 2–5 px
 * disc keeps its soft rim and white core instead of being minified from a big bitmap.
 * @param diameter - drawn diameter in device px (quantised to 0.5 by the caller).
 * @returns `{ canvas, size }` with `size` the sprite side in device px.
 */
function discSprite(hue, diameter, core) {
	const key = `${hue}|${diameter}|${core}`;
	const hit = DISC_CACHE.get(key);
	if (hit !== undefined) return hit;
	const size = Math.ceil(diameter) + 2;
	const canvas = starCanvas(size);
	const paint = canvas.getContext("2d");
	const image = paint.createImageData(size, size);
	const plateau = starPlateau(hue);
	const centre = size / 2;
	for (let y = 0; y < size; y += 1) {
		for (let x = 0; x < size; x += 1) {
			let alpha = 0;
			let r = 0;
			let g = 0;
			let b = 0;
			for (let sy = 0; sy < 4; sy += 1) {
				for (let sx = 0; sx < 4; sx += 1) {
					const d = Math.hypot(x + (sx + 0.5) / 4 - centre, y + (sy + 0.5) / 4 - centre) / diameter;
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
			image.data[at + 3] = Math.round((alpha / 16) * 255);
		}
	}
	paint.putImageData(image, 0, 0);
	const sprite = { canvas, size };
	DISC_CACHE.set(key, sprite);
	return sprite;
}

/** Gaussian halo in the star hue at L 50%, `sigma`/`radius` in CSS px, baked per dpr. */
function haloSprite(hue, halo, dpr) {
	const key = `${hue}|${halo.sigma}|${dpr}`;
	const hit = HALO_CACHE.get(key);
	if (hit !== undefined) return hit;
	const size = Math.max(4, Math.round(halo.radius * 2 * dpr));
	const canvas = starCanvas(size);
	const paint = canvas.getContext("2d");
	const image = paint.createImageData(size, size);
	const [r, g, b] = hslToRgb(hue, STAR_SATURATION, 0.5);
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
	STAR_SATURATION,
	STAR_LIGHTNESS,
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
	linkTint,
	createNebula,
	createClusterClouds,
	discSprite,
	haloSprite,
	hazeSprite
};

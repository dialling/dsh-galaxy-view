/**
 * The "enter the star" transition.
 *
 * The overlay lives on `document.body`, not inside the plugin's slot, because the
 * main panel is swapped underneath it while the target opens. Phases run on a
 * clock that advances by at most 34 ms per frame, so a main-thread stall delays
 * them instead of skipping them, and the overlay only fades once the caller's
 * `onArrive` promise has settled and two more frames have painted.
 */

/** `opaque` pauses the galaxy loop; `stop` is the running transition, if any. */
const warpState = { opaque: false, stop: null };

function warpClamp(value, low, high) {
	return value < low ? low : value > high ? high : value;
}

function warpCubic(value) {
	const t = 1 - warpClamp(value, 0, 1);
	return 1 - t * t * t;
}

/**
 * Play the transition once.
 *
 * @param {{ hue: number, base?: string, x?: number, y?: number, reverse?: boolean, onArrive?: () => unknown }} options
 *   `hue` is the star's palette hue; `base` the theme's plane colour; `x`/`y` the
 *   star's page position the flight starts from; `reverse` plays the short way back
 *   out. `onArrive` runs once, when the overlay is opaque; the overlay stays until
 *   the promise it returns settles.
 */
function playWarp(options) {
	const onArrive = typeof options.onArrive === "function" ? options.onArrive : () => undefined;
	if (typeof document === "undefined") {
		onArrive();
		return null;
	}
	warpState.stop?.();
	const base = typeof options.base === "string" ? options.base : "#1c1c1c";
	const hue = Number.isFinite(options.hue) ? options.hue : 200;
	const reverse = options.reverse === true;
	const still = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	// [opaque by, arrive, hold until ready, fade start, fade length] in clock ms.
	const [opaqueAt, arriveAt, holdAt, fadeAt, fadeMs] = still ? [200, 200, 200, 200, 380] : reverse ? [220, 220, 220, 520, 450] : [280, 300, 720, 1720, 650];
	const flies = !still && !reverse;

	const host = document.createElement("div");
	host.dataset.dgvWarp = "";
	host.style.cssText = `position:fixed;inset:0;z-index:2147483600;pointer-events:none;opacity:0;background:${base}`;
	const canvas = document.createElement("canvas");
	canvas.style.cssText = "display:block;width:100%;height:100%";
	host.appendChild(canvas);
	document.body.appendChild(host);
	const context = canvas.getContext("2d");
	const ratio = Math.min(window.devicePixelRatio || 1, 2);
	let width = 1;
	let height = 1;
	const size = () => {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = Math.round(width * ratio);
		canvas.height = Math.round(height * ratio);
	};
	size();
	const originX = Number.isFinite(options.x) ? options.x : width / 2;
	const originY = Number.isFinite(options.y) ? options.y : height / 2;

	// Flight: a tunnel of fine points that stretch into 1 px streaks as they pass.
	const FLIGHT = still ? 0 : 420;
	const fx = new Float32Array(FLIGHT);
	const fy = new Float32Array(FLIGHT);
	const fz = new Float32Array(FLIGHT);
	const fpx = new Float32Array(FLIGHT);
	const fpy = new Float32Array(FLIGHT);
	const spawn = (index, depth) => {
		const angle = Math.random() * Math.PI * 2;
		const radius = 0.12 + Math.random() * 0.88;
		fx[index] = Math.cos(angle) * radius;
		fy[index] = Math.sin(angle) * radius;
		fz[index] = depth;
		fpx[index] = NaN;
	};
	for (let index = 0; index < FLIGHT; index += 1) spawn(index, 0.15 + Math.random() * 0.85);

	// Landing: a golden-spiral shell of hard squares (1.2 / 2 / 3 CSS px).
	const SHELL = still ? 0 : 1700;
	const sx = new Float32Array(SHELL);
	const sy = new Float32Array(SHELL);
	const sz = new Float32Array(SHELL);
	const ss = new Float32Array(SHELL);
	const golden = Math.PI * (3 - Math.sqrt(5));
	for (let index = 0; index < SHELL; index += 1) {
		const y = 1 - (index / (SHELL - 1)) * 2;
		const ring = Math.sqrt(Math.max(0, 1 - y * y));
		sx[index] = Math.cos(golden * index) * ring;
		sy[index] = y;
		sz[index] = Math.sin(golden * index) * ring;
		const pick = (index * 0.618034) % 1;
		ss[index] = pick < 0.7 ? 1.2 : pick < 0.92 ? 2 : 3;
	}
	const flightColour = (tint) => `hsl(${hue}, ${Math.round(18 + 34 * tint)}%, ${Math.round(86 - 10 * tint)}%)`;
	const shellColour = `hsl(${hue}, 60%, 72%)`;

	let clock = 0;
	let waited = 0;
	let last = performance.now();
	let frame = 0;
	let arrived = false;
	let ready = false;

	const finish = () => {
		cancelAnimationFrame(frame);
		window.removeEventListener("resize", size);
		host.remove();
		warpState.opaque = false;
		if (warpState.stop === finish) warpState.stop = null;
	};

	const paint = (now) => {
		const step = Math.min(34, Math.max(0, now - last));
		last = now;
		if (!ready && clock >= holdAt) waited += step;
		else clock += step;
		if (waited > 6000) ready = true;

		if (!arrived && clock >= arriveAt) {
			arrived = true;
			Promise.resolve()
				.then(onArrive)
				.catch((error) => console.warn("graph-view: warp target failed", error))
				.then(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
				.then(() => {
					ready = true;
				});
		}

		const opacity = clock < fadeAt ? warpCubic(clock / opaqueAt) : 1 - warpClamp((clock - fadeAt) / fadeMs, 0, 1);
		host.style.opacity = opacity.toFixed(3);
		warpState.opaque = opacity >= 0.95;
		if (clock >= fadeAt + fadeMs) {
			finish();
			return;
		}

		context.setTransform(1, 0, 0, 1, 0, 0);
		context.globalAlpha = 1;
		context.fillStyle = base;
		context.fillRect(0, 0, canvas.width, canvas.height);
		const lead = warpCubic(clock / 520);
		const cx = (originX + (width / 2 - originX) * lead) * ratio;
		const cy = (originY + (height / 2 - originY) * lead) * ratio;

		const flightLeft = flies ? 1 - warpClamp((clock - holdAt) / 260, 0, 1) : 0;
		if (flightLeft > 0) {
			const rush = 0.3 + 4.4 * Math.min(1, clock / 700) ** 2;
			const focal = Math.min(width, height) * 0.36 * ratio;
			const tint = warpClamp(clock / holdAt, 0, 1);
			context.strokeStyle = context.fillStyle = flightColour(tint);
			context.lineWidth = ratio;
			for (let index = 0; index < FLIGHT; index += 1) {
				fz[index] -= (step / 1000) * rush;
				if (fz[index] <= 0.04) spawn(index, 1);
				const px = cx + (fx[index] / fz[index]) * focal;
				const py = cy + (fy[index] / fz[index]) * focal;
				const close = warpClamp(1.1 - fz[index], 0, 1);
				context.globalAlpha = (0.12 + close * 0.7) * flightLeft * Math.min(1, clock / 160);
				if (fpx[index] === fpx[index]) {
					const trail = Math.min(1, (26 * ratio) / (Math.hypot(px - fpx[index], py - fpy[index]) + 0.01));
					context.beginPath();
					context.moveTo(px + (fpx[index] - px) * trail, py + (fpy[index] - py) * trail);
					context.lineTo(px, py);
					context.stroke();
				}
				const side = Math.max(1, Math.round((1 + close) * ratio));
				context.fillRect(Math.round(px - side / 2), Math.round(py - side / 2), side, side);
				fpx[index] = px;
				fpy[index] = py;
			}
		}

		// Reveal wave from the centre outward (delay 0.55·rank, window 0.45), the halo
		// pulsing from 1.8 down to 1.
		const reveal = reverse ? 1 - warpClamp(clock / 520, 0, 1) : warpClamp((clock - holdAt) / 950, 0, 1);
		if (SHELL > 0 && reveal > 0) {
			const glow = reverse ? 1 : 1.8 - 0.8 * warpClamp((clock - holdAt) / 1300, 0, 1);
			const radius = Math.min(width, height) * 0.44 * ratio;
			const spin = clock * 0.00022;
			const cos = Math.cos(spin);
			const sin = Math.sin(spin);
			context.fillStyle = shellColour;
			for (let index = 0; index < SHELL; index += 1) {
				const x = sx[index] * cos - sz[index] * sin;
				const z = sx[index] * sin + sz[index] * cos;
				const y = sy[index] * 0.94 + z * 0.34;
				const depth = (z * 0.94 - sy[index] * 0.34 + 1) / 2;
				const local = warpClamp((reveal - 0.55 * Math.min(1, Math.hypot(x, y))) / 0.45, 0, 1);
				if (local <= 0) continue;
				const grow = warpCubic(local);
				context.globalAlpha = Math.min(0.95, (0.32 + 0.5 * depth) * glow * Math.min(1, local * 2));
				const side = Math.max(1, Math.round(ss[index] * ratio));
				context.fillRect(Math.round(cx + x * radius * grow - side / 2), Math.round(cy + y * radius * grow - side / 2), side, side);
			}
		}
		frame = requestAnimationFrame(paint);
	};

	window.addEventListener("resize", size);
	warpState.stop = finish;
	frame = requestAnimationFrame(paint);
	return finish;
}

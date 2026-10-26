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

/** Landing shell: 1700 golden-spiral hard squares (1.2 / 2 / 3 CSS px), shared by the warp and the star interior. */
const SHELL_DOTS = 1700;
let shellGeometry = null;
function warpShell() {
	if (shellGeometry !== null) return shellGeometry;
	const sx = new Float32Array(SHELL_DOTS);
	const sy = new Float32Array(SHELL_DOTS);
	const sz = new Float32Array(SHELL_DOTS);
	const ss = new Float32Array(SHELL_DOTS);
	const golden = Math.PI * (3 - Math.sqrt(5));
	for (let index = 0; index < SHELL_DOTS; index += 1) {
		const y = 1 - (index / (SHELL_DOTS - 1)) * 2;
		const ring = Math.sqrt(Math.max(0, 1 - y * y));
		sx[index] = Math.cos(golden * index) * ring;
		sy[index] = y;
		sz[index] = Math.sin(golden * index) * ring;
		const pick = (index * 0.618034) % 1;
		ss[index] = pick < 0.7 ? 1.2 : pick < 0.92 ? 2 : 3;
	}
	shellGeometry = { sx, sy, sz, ss };
	return shellGeometry;
}

/**
 * Spin of the landing shell from the wall clock, so the warp's shell and the star
 * interior's shell are the same sphere at the same angle when one hands over to the other.
 */
function shellSpin(now) {
	return (now % 2.6e7) * 0.00022;
}

/**
 * Paint the shell centred at (cx, cy) in device px. `alphaOf(local, depth)` gives each
 * dot's alpha from its reveal share (1 = fully out) and depth (0 back, 1 front).
 * `dot` pins every square to one CSS size instead of the three-tier landing sizes,
 * for a shell that has to sit still behind a conversation.
 *
 * `bend` adds a perspective divide: front dots spread out and back dots close in, so a
 * shell approached from outside has depth instead of reading as a flat disc of dots.
 * At 0 the projection is the plain orthographic one a room seen from its centre wants.
 */
function paintShell(context, cx, cy, radius, ratio, spin, reveal, alphaOf, dot, bend) {
	const { sx, sy, sz, ss } = warpShell();
	const cos = Math.cos(spin);
	const sin = Math.sin(spin);
	for (let index = 0; index < SHELL_DOTS; index += 1) {
		const x = sx[index] * cos - sz[index] * sin;
		const z = sx[index] * sin + sz[index] * cos;
		const y = sy[index] * 0.94 + z * 0.34;
		const depth = (z * 0.94 - sy[index] * 0.34 + 1) / 2;
		const local = reveal >= 1 ? 1 : warpClamp((reveal - 0.55 * Math.min(1, Math.hypot(x, y))) / 0.45, 0, 1);
		if (local <= 0) continue;
		const grow = warpCubic(local);
		context.globalAlpha = alphaOf(local, depth);
		const side = dot === undefined ? Math.max(1, Math.round(ss[index] * ratio)) : Math.max(1, Math.round(dot * ratio));
		// depth runs 0 at the back to 1 at the front; the divide pushes the near face out.
		const near = bend > 0 ? 1 / (1 - bend * (depth * 2 - 1)) : 1;
		const reach = radius * grow * near;
		context.fillRect(Math.round(cx + x * reach - side / 2), Math.round(cy + y * reach - side / 2), side, side);
	}
}

/**
 * The star interior's backdrop: the sky you are now inside. The sphere is wider than
 * the viewport so its rim is never in view, every dot is the same size and the same
 * alpha (two layers, turning at different rates), because three landing sizes and a
 * depth-shaded alpha read as a speckled ball rather than a room. Drawn with `screen`
 * so it only lights the dark plane. Returns a stop function.
 */
function mountInteriorShell(parent, hue) {
	if (typeof document === "undefined") return () => undefined;
	const canvas = document.createElement("canvas");
	canvas.className = "dgv-inside-shell";
	parent.appendChild(canvas);
	const context = canvas.getContext("2d");
	const ratio = Math.min(window.devicePixelRatio || 1, 2);
	const still = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const colour = `hsl(${hue}, 60%, 72%)`;
	let frame = 0;
	let last = 0;
	const paint = (now) => {
		frame = still ? 0 : requestAnimationFrame(paint);
		// 30 fps is plenty for a turn this slow and halves the cost behind a live chat.
		if (!still && now - last < 32) return;
		last = now;
		const width = window.innerWidth;
		const height = window.innerHeight;
		if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
			canvas.width = Math.round(width * ratio);
			canvas.height = Math.round(height * ratio);
		}
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.globalAlpha = 1;
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = colour;
		// 0.52 × the diagonal puts the sphere's rim outside the frame in every aspect
		// ratio, so the dots fill the window evenly instead of clustering into a disc.
		const radius = Math.hypot(width, height) * 0.52 * ratio;
		const centreX = (width / 2) * ratio;
		const centreY = (height / 2) * ratio;
		// The sphere is 2.4× wider now, so the same angular rate would sweep the dots
		// across the frame 2.4× faster; halving it keeps the drift reading as slow.
		const spin = shellSpin(now) * 0.45;
		paintShell(context, centreX, centreY, radius, ratio, spin, 1, () => 0.3, 1.4);
		// A second, slower sphere a shade dimmer: two even layers read as depth, where
		// one layer of varied dots read as noise.
		paintShell(context, centreX, centreY, radius, ratio, spin * 0.37 + 1.2, 1, () => 0.18, 1.4);
	};
	frame = requestAnimationFrame(paint);
	return () => {
		cancelAnimationFrame(frame);
		canvas.remove();
	};
}

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
	const base = typeof options.base === "string" ? options.base : "#000000";
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

	const SHELL = still ? 0 : SHELL_DOTS;
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
			// The shell is flown *into*: it starts as a ball you approach from outside and
			// grows until its rim leaves the frame — which is exactly where the interior's
			// room takes over (same radius, spin, dot size and alpha), so the hand-over is
			// invisible instead of jumping to a second, differently-shaped shell.
			const wrap = warpCubic(reveal);
			const ball = Math.min(width, height) * 0.3 * ratio;
			const room = Math.hypot(width, height) * 0.52 * ratio;
			context.fillStyle = shellColour;
			paintShell(
				context,
				cx,
				cy,
				ball + (room - ball) * wrap,
				ratio,
				shellSpin(now) * 0.45,
				reveal,
				(local, depth) => Math.min(0.95, ((0.32 + 0.5 * depth) * glow * Math.min(1, local * 2)) * (1 - wrap) + 0.3 * wrap),
				1.4,
				0.42 * (1 - wrap)
			);
		}
		frame = requestAnimationFrame(paint);
	};

	window.addEventListener("resize", size);
	warpState.stop = finish;
	frame = requestAnimationFrame(paint);
	return finish;
}

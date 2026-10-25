/**
 * The "enter the star" transition.
 *
 * Opening a conversation from the galaxy should feel like flying into it: a shell
 * of white points around the camera stretches into accelerating lines, the flight
 * turns the colour of the star, and it lands inside a hollow sphere of that colour
 * while the conversation comes up underneath.
 *
 * The overlay lives on `document.body`, not inside the plugin's slot, because the
 * harness swaps the main panel as the conversation opens — the transition has to
 * survive that swap long enough to dissolve over the chat.
 */

const WARP_BASE = "#1c1c1c";

/** Clamp helper kept local so the bundle has no cross-module constant clashes. */
function warpClamp(value, low, high) {
	return value < low ? low : value > high ? high : value;
}

/** Ease-out so the flight spends its speed early and settles softly. */
function warpEase(value) {
	const t = warpClamp(value, 0, 1);
	return 1 - (1 - t) * (1 - t);
}

/**
 * Play the transition once.
 *
 * @param {{ hue: number, onArrive?: () => void, sped?: number }} options
 *   `hue` is the star's hue in degrees; `onArrive` runs at the moment the camera
 *   is inside the sphere (so the chat is already mounted when the shell fades).
 */
function playWarp(options) {
	if (typeof document === "undefined") {
		options.onArrive?.();
		return null;
	}

	const still = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const scale = still ? 0.45 : 1;
	const travelEnd = 640 * scale;
	const shellStart = 470 * scale;
	const arriveAt = 900 * scale;
	const fadeStart = 980 * scale;
	const fadeEnd = 1520 * scale;

	const host = document.createElement("div");
	host.dataset.dgvWarp = "";
	host.style.cssText = [
		"position:fixed",
		"inset:0",
		"z-index:2147483000",
		"pointer-events:none",
		`background:${WARP_BASE}`
	].join(";");

	const canvas = document.createElement("canvas");
	canvas.style.cssText = "display:block;width:100%;height:100%";
	host.appendChild(canvas);
	document.body.appendChild(host);

	const ratio = Math.min(window.devicePixelRatio || 1, 2);
	let width = window.innerWidth;
	let height = window.innerHeight;
	const sizeCanvas = () => {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = Math.round(width * ratio);
		canvas.height = Math.round(height * ratio);
	};
	sizeCanvas();

	const context = canvas.getContext("2d");
	const rainbow = warpClamp(options.hue, 0, 360);

	// ── phase 1: a shell of points around the camera, then a flight ──────────
	const flight = [];
	const flightCount = Math.round(1100 * (still ? 0.4 : 1));
	for (let index = 0; index < flightCount; index += 1) {
		const angle = Math.random() * Math.PI * 2;
		const radius = 0.08 + Math.random() * 0.92;
		flight.push({
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius,
			z: 0.15 + Math.random() * 0.85,
			px: 0,
			py: 0
		});
	}

	// ── phase 3: the hollow sphere the flight lands inside ───────────────────
	const shell = [];
	const shellCount = Math.round(1500 * (still ? 0.5 : 1));
	const golden = Math.PI * (3 - Math.sqrt(5));
	for (let index = 0; index < shellCount; index += 1) {
		const y = 1 - (index / Math.max(1, shellCount - 1)) * 2;
		const ring = Math.sqrt(Math.max(0, 1 - y * y));
		shell.push({ x: Math.cos(golden * index) * ring, y, z: Math.sin(golden * index) * ring, seed: Math.random() });
	}

	const started = performance.now();
	let arrived = false;
	let frame = 0;
	let last = started;

	const finish = () => {
		cancelAnimationFrame(frame);
		window.removeEventListener("resize", sizeCanvas);
		if (!arrived) {
			arrived = true;
			options.onArrive?.();
		}
		host.remove();
	};

	const paint = (now) => {
		const elapsed = now - started;
		const dt = Math.min(0.05, (now - last) / 1000);
		last = now;

		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		context.globalCompositeOperation = "source-over";
		context.fillStyle = WARP_BASE;
		context.fillRect(0, 0, width, height);

		const cx = width / 2;
		const cy = height / 2;
		const focal = Math.min(width, height) * 0.62;

		// Flight: points rush past, each one drawing its own light trail.
		if (elapsed < travelEnd + 260) {
			const progress = warpEase(elapsed / travelEnd);
			const rush = 0.22 + 5.2 * progress * progress;
			const fade = 1 - warpClamp((elapsed - travelEnd) / 220, 0, 1);
			context.globalCompositeOperation = "lighter";
			for (const star of flight) {
				star.z -= dt * rush;
				if (star.z <= 0.03) {
					const angle = Math.random() * Math.PI * 2;
					const radius = 0.1 + Math.random() * 0.9;
					star.x = Math.cos(angle) * radius;
					star.y = Math.sin(angle) * radius;
					star.z = 1;
					star.px = 0;
					star.py = 0;
				}
				const sx = cx + (star.x / star.z) * focal * 0.5;
				const sy = cy + (star.y / star.z) * focal * 0.5;
				const close = warpClamp(1.15 - star.z, 0, 1);
				const alpha = warpClamp(close * 0.9 + 0.05, 0, 0.92) * fade;
				if (star.px !== 0 || star.py !== 0) {
					context.strokeStyle = `rgba(255,255,255,${alpha * 0.75})`;
					context.lineWidth = 0.5 + close * 1.9;
					context.beginPath();
					context.moveTo(star.px, star.py);
					context.lineTo(sx, sy);
					context.stroke();
				}
				context.fillStyle = `rgba(255,255,255,${alpha})`;
				context.beginPath();
				context.arc(sx, sy, 0.6 + close * 1.7, 0, Math.PI * 2);
				context.fill();
				star.px = sx;
				star.py = sy;
			}
		}

		// Landing: the flight settles into a hollow sphere in the star's colour.
		if (elapsed > shellStart) {
			const reveal = warpClamp((elapsed - shellStart) / (arriveAt - shellStart), 0, 1);
			const spin = (elapsed - shellStart) * 0.00035;
			const cos = Math.cos(spin);
			const sin = Math.sin(spin);
			const radius = Math.min(width, height) * 0.46;
			context.globalCompositeOperation = "lighter";
			for (const dot of shell) {
				const x = dot.x * cos - dot.z * sin;
				const z = dot.x * sin + dot.z * cos;
				const depth = warpClamp((z + 1) / 2, 0, 1);
				const pop = warpClamp(reveal * 1.35 - dot.seed * 0.35, 0, 1);
				if (pop <= 0.01) continue;
				const sx = cx + x * radius;
				const sy = cy + dot.y * radius;
				const alpha = pop * (0.1 + depth * 0.5);
				context.fillStyle = `hsla(${rainbow}, 92%, ${62 + depth * 16}%, ${alpha})`;
				context.beginPath();
				context.arc(sx, sy, 0.9 + depth * 1.5, 0, Math.PI * 2);
				context.fill();
			}
			// A soft core of the same hue, so the middle never reads as a hole.
			const core = context.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.72);
			core.addColorStop(0, `hsla(${rainbow}, 92%, 68%, ${0.1 * reveal})`);
			core.addColorStop(0.55, `hsla(${rainbow}, 92%, 60%, ${0.045 * reveal})`);
			core.addColorStop(1, "rgba(28,28,28,0)");
			context.fillStyle = core;
			context.fillRect(0, 0, width, height);
		}

		if (!arrived && elapsed >= arriveAt) {
			arrived = true;
			options.onArrive?.();
		}

		if (elapsed >= fadeStart) {
			const out = warpClamp(1 - (elapsed - fadeStart) / (fadeEnd - fadeStart), 0, 1);
			host.style.opacity = String(out);
			if (out <= 0.001) {
				finish();
				return;
			}
		}

		frame = requestAnimationFrame(paint);
	};

	window.addEventListener("resize", sizeCanvas);
	frame = requestAnimationFrame(paint);

	return () => {
		if (!arrived) {
			arrived = true;
			options.onArrive?.();
		}
		finish();
	};
}

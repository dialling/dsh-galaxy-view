/**
 * Batched GPU glow layer: every body in one draw call, every halo in a second.
 *
 * The reference implementation (galaxy-view) puts the whole scene into one `THREE.Points`
 * plus one `LineSegments` — under ten draw calls for the entire graph — which is why a
 * thousand nodes never stutter there. This is the same idea without a three.js dependency:
 * one `gl.POINTS` draw for the bodies, one for the halos, all per-node numbers (position,
 * size, colour, core mix, alpha) packed into a single interleaved buffer per frame. The disc
 * look lives in the fragment shader — white-hot core over the hue, soft rim — so there is no
 * sprite atlas and no per-body `drawImage`.
 *
 * Everything fails open: if WebGL is unavailable or a shader refuses to compile, `create` returns
 * null and the Canvas 2D path keeps drawing exactly as before.
 */

const VERTEX = `
attribute vec2 aPos;
attribute float aSize;
attribute vec3 aColour;
attribute float aCore;
attribute float aAlpha;
attribute float aKind;
varying vec3 vColour;
varying float vCore;
varying float vAlpha;
varying float vKind;
uniform float uDpr;
void main() {
	vColour = aColour;
	vCore = aCore;
	vAlpha = aAlpha;
	vKind = aKind;
	gl_PointSize = max(1.0, aSize * uDpr);
	gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision mediump float;
varying vec3 vColour;
varying float vCore;
varying float vAlpha;
varying float vKind;
void main() {
	// gl_PointCoord runs 0..1 with y down; d = 0 at the centre, 1 at the rim.
	vec2 uv = gl_PointCoord - 0.5;
	float d = length(uv) * 2.0;
	if (d > 1.0) discard;
	float alpha;
	vec3 colour;
	if (vKind < 0.5) {
		// Body: an opaque disc with a 4%-wide soft rim and a white-hot core, the same recipe the
		// Canvas 2D disc uses (0.92 white mix, smooth plateau).
		alpha = smoothstep(1.0, 0.92, d) * vAlpha;
		float core = smoothstep(0.62, 0.0, d);
		colour = mix(vColour, vec3(1.0), clamp(vCore * core, 0.0, 1.0));
	} else {
		// Halo: gaussian falloff, drawn additively.
		alpha = exp(-3.4 * d * d) * (1.0 - smoothstep(0.82, 1.0, d)) * vAlpha;
		colour = vColour;
	}
	if (alpha < 0.004) discard;
	gl_FragColor = vec4(colour * alpha, alpha);
}
`;

/** Floats per vertex: pos(2) size(1) colour(3) core(1) alpha(1) kind(1). */
const STRIDE = 9;

function compile(gl, type, source) {
	const shader = gl.createShader(type);
	if (shader === null) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) !== true) {
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

/**
 * @returns {{canvas: HTMLCanvasElement, draw: Function, resize: Function, dispose: Function} | null}
 */
function createGlowLayer() {
	if (typeof document === "undefined") return null;
	let canvas = null;
	let gl = null;
	try {
		canvas = document.createElement("canvas");
		gl = canvas.getContext("webgl2", { alpha: true, antialias: false, depth: false, premultipliedAlpha: true, powerPreference: "high-performance" });
		if (gl === null) gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, premultipliedAlpha: true });
	} catch (error) {
		return null;
	}
	if (gl === null) return null;
	const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
	const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
	if (vertex === null || fragment === null) return null;
	const program = gl.createProgram();
	if (program === null) return null;
	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);
	gl.linkProgram(program);
	if (gl.getProgramParameter(program, gl.LINK_STATUS) !== true) return null;
	gl.useProgram(program);
	gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

	const buffer = gl.createBuffer();
	if (buffer === null) return null;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	const attribute = (name, size, offset) => {
		const at = gl.getAttribLocation(program, name);
		if (at < 0) return;
		gl.enableVertexAttribArray(at);
		gl.vertexAttribPointer(at, size, gl.FLOAT, false, STRIDE * 4, offset * 4);
	};
	attribute("aPos", 2, 0);
	attribute("aSize", 1, 2);
	attribute("aColour", 3, 3);
	attribute("aCore", 1, 6);
	attribute("aAlpha", 1, 7);
	attribute("aKind", 1, 8);
	const dprAt = gl.getUniformLocation(program, "uDpr");
	let data = new Float32Array(STRIDE * 4096);
	let capacity = 4096;

	const ensure = (vertices) => {
		if (vertices <= capacity) return;
		capacity = Math.max(vertices, capacity * 2);
		data = new Float32Array(STRIDE * capacity);
	};

	const draw = (bodies, halos, width, height, dpr, background) => {
		if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
			canvas.width = Math.max(1, Math.round(width * dpr));
			canvas.height = Math.max(1, Math.round(height * dpr));
		}
		gl.viewport(0, 0, canvas.width, canvas.height);
		if (background !== null) {
			gl.clearColor(background[0], background[1], background[2], 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
		} else {
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.uniform1f(dprAt, dpr);
		let drawn = 0;
		const pack = (list, kind) => {
			for (const entry of list) {
				// CSS px → clip space, y flipped (canvas origin is top-left).
				data[drawn * STRIDE] = (entry.x / width) * 2 - 1;
				data[drawn * STRIDE + 1] = 1 - (entry.y / height) * 2;
				data[drawn * STRIDE + 2] = entry.size;
				data[drawn * STRIDE + 3] = entry.colour[0];
				data[drawn * STRIDE + 4] = entry.colour[1];
				data[drawn * STRIDE + 5] = entry.colour[2];
				data[drawn * STRIDE + 6] = kind === 0 ? entry.core : 0;
				data[drawn * STRIDE + 7] = entry.alpha;
				data[drawn * STRIDE + 8] = kind;
				drawn += 1;
			}
		};
		ensure(bodies.length);
		pack(bodies, 0);
		gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, drawn * STRIDE), gl.DYNAMIC_DRAW);
		gl.drawArrays(gl.POINTS, 0, drawn);
		if (halos.length > 0) {
			// Halos add light on top instead of covering it.
			gl.blendFunc(gl.ONE, gl.ONE);
			drawn = 0;
			ensure(halos.length);
			pack(halos, 1);
			gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, drawn * STRIDE), gl.DYNAMIC_DRAW);
			gl.drawArrays(gl.POINTS, 0, drawn);
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		}
	};

	const dispose = () => {
		try {
			gl.deleteBuffer(buffer);
			gl.deleteProgram(program);
			gl.deleteShader(vertex);
			gl.deleteShader(fragment);
		} catch (error) {
			// Losing the context on unload is normal; nothing to clean up.
		}
		canvas.remove();
	};

	return { canvas, draw, dispose };
}

export { createGlowLayer, STRIDE as GLOW_STRIDE };

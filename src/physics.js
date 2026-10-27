/**
 * Force layer over the analytic layout: the seven Galaxy View physics sliders
 * (repel, link distance, link strength, centre pull, flatten, core gravity, spiral)
 * integrated d3-force style (velocity decay 0.6, alpha decay 1 − 0.001^(1/300)).
 *
 * Every star is anchored to its analytic home, so the silhouette a preset picked
 * survives. The forces that would otherwise collapse or explode that silhouette act
 * as deviations from the shipped defaults, so the default settings settle on the
 * analytic layout (lightly de-clumped by repel) and each slider bends it from there.
 * Pure: no DOM; `scripts/build.mjs` inlines it, `scripts/selfcheck.mjs` imports it.
 */

const PHYSICS_DEFAULTS = { repel: 170, linkDistance: 55, linkStrength: 1.1, centerPull: 0.05, flatten: 0.55, coreGravity: 0.1, spiral: 0.02 };
const PHYSICS_KEYS = Object.keys(PHYSICS_DEFAULTS);
const SIM_ALPHA_DECAY = 1 - Math.pow(0.001, 1 / 300);
const SIM_ALPHA_MIN = 0.001;
const SIM_VELOCITY_KEEP = 0.4;
const SIM_ANCHOR = 0.1;
/** Repel 170 pushes two stars 0.03 apart by ~0.0017 per tick at alpha 1. */
const SIM_REPEL_UNIT = 3e-7;
const SIM_REPEL_REACH = 0.45;
const SIM_REPEL_FLOOR = 0.012;

function physicsOf(settings) {
	const params = {};
	for (const key of PHYSICS_KEYS) params[key] = Number.isFinite(settings?.[key]) ? settings[key] : PHYSICS_DEFAULTS[key];
	return params;
}

/**
 * Seed a simulation from galaxy nodes (their current x/y/z are the analytic homes).
 * @param warm - optional `Map(id → [x, y, z])` of positions from the previous run.
 */
function createSimulation(nodes, links, warm) {
	const count = nodes.length;
	const home = new Float64Array(count * 3);
	const pos = new Float64Array(count * 3);
	const vel = new Float64Array(count * 3);
	const degree = new Float64Array(count).fill(0);
	let warmed = 0;
	nodes.forEach((node, index) => {
		home[index * 3] = node.x;
		home[index * 3 + 1] = node.y;
		home[index * 3 + 2] = node.z;
		const seen = warm?.get(node.id);
		const from = Array.isArray(seen) && seen.every(Number.isFinite) ? seen : [node.x, node.y, node.z];
		if (from !== seen) pos.set([node.x, node.y, node.z], index * 3);
		else {
			pos.set(from, index * 3);
			warmed += 1;
		}
	});
	const kept = links.filter((link) => link.a >= 0 && link.b >= 0 && link.a < count && link.b < count && link.a !== link.b);
	const la = new Int32Array(kept.length);
	const lb = new Int32Array(kept.length);
	const rest = new Float64Array(kept.length);
	kept.forEach((link, index) => {
		la[index] = link.a;
		lb[index] = link.b;
		degree[link.a] += 1;
		degree[link.b] += 1;
		const dx = home[link.b * 3] - home[link.a * 3];
		const dy = home[link.b * 3 + 1] - home[link.a * 3 + 1];
		const dz = home[link.b * 3 + 2] - home[link.a * 3 + 2];
		rest[index] = Math.max(0.004, Math.hypot(dx, dy, dz));
	});
	let degreeSum = 0;
	for (let index = 0; index < count; index += 1) {
		degree[index] = Math.max(1, degree[index]);
		degreeSum += degree[index];
	}
	return {
		count,
		home,
		pos,
		vel,
		degree,
		meanDegree: count === 0 ? 1 : degreeSum / count,
		la,
		lb,
		rest,
		alpha: warmed > count * 0.6 ? 0.3 : 1,
		ticks: 0,
		limit: Infinity
	};
}

/** Wake a settled simulation (after a slider moved). */
function reheatSimulation(sim, alpha) {
	sim.alpha = Math.max(sim.alpha, alpha);
}

function simulationSettled(sim) {
	return sim.alpha < SIM_ALPHA_MIN;
}

/**
 * Many-body repulsion: direct pairs up to 800 stars; beyond that a uniform grid
 * (cell = reach) so only pairs within SIM_REPEL_REACH are visited.
 */
function applyRepel(sim, strength, alpha) {
	if (strength <= 0) return;
	const { count, pos, vel } = sim;
	const reach2 = SIM_REPEL_REACH * SIM_REPEL_REACH;
	const floor2 = SIM_REPEL_FLOOR * SIM_REPEL_FLOOR;
	const k = strength * alpha;
	const pair = (i, j) => {
		const dx = pos[i * 3] - pos[j * 3];
		const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
		const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
		const d2 = dx * dx + dy * dy + dz * dz;
		if (d2 >= reach2) return;
		if (d2 === 0) {
			const jitter = ((i * 7919 + j) % 13) / 13 - 0.5;
			vel[i * 3] += jitter * 1e-4;
			vel[j * 3] -= jitter * 1e-4;
			return;
		}
		const w = k / Math.max(d2, floor2);
		vel[i * 3] += dx * w;
		vel[i * 3 + 1] += dy * w;
		vel[i * 3 + 2] += dz * w;
		vel[j * 3] -= dx * w;
		vel[j * 3 + 1] -= dy * w;
		vel[j * 3 + 2] -= dz * w;
	};
	if (count <= 800) {
		for (let i = 0; i < count; i += 1) for (let j = i + 1; j < count; j += 1) pair(i, j);
		return;
	}
	const cell = SIM_REPEL_REACH;
	const side = Math.ceil(8 / cell);
	const half = side >> 1;
	const cellOf = new Int32Array(count);
	const counts = new Int32Array(side * side * side + 1);
	const clampCell = (value) => Math.max(0, Math.min(side - 1, Math.floor(value / cell) + half));
	for (let i = 0; i < count; i += 1) {
		const c = (clampCell(pos[i * 3]) * side + clampCell(pos[i * 3 + 1])) * side + clampCell(pos[i * 3 + 2]);
		cellOf[i] = c;
		counts[c + 1] += 1;
	}
	for (let c = 1; c < counts.length; c += 1) counts[c] += counts[c - 1];
	const order = new Int32Array(count);
	const fill = counts.slice(0, -1);
	for (let i = 0; i < count; i += 1) order[fill[cellOf[i]]++] = i;
	for (let i = 0; i < count; i += 1) {
		const c = cellOf[i];
		const cz = c % side;
		const cy = ((c - cz) / side) % side;
		const cx = Math.floor(c / (side * side));
		for (let ox = -1; ox <= 1; ox += 1) {
			const x = cx + ox;
			if (x < 0 || x >= side) continue;
			for (let oy = -1; oy <= 1; oy += 1) {
				const y = cy + oy;
				if (y < 0 || y >= side) continue;
				for (let oz = -1; oz <= 1; oz += 1) {
					const z = cz + oz;
					if (z < 0 || z >= side) continue;
					const other = (x * side + y) * side + z;
					for (let slot = counts[other]; slot < counts[other + 1]; slot += 1) {
						const j = order[slot];
						if (j > i) pair(i, j);
					}
				}
			}
		}
	}
}
/**
 * One tick. Returns true while the simulation is still moving.
 * @param params - physics slider values (see {@link PHYSICS_DEFAULTS}).
 * @param reach - stars are kept inside this radius so the shell still frames them.
 */
function stepSimulation(sim, params, reach) {
	if (simulationSettled(sim) || sim.count === 0) return false;
	const alpha = sim.alpha;
	const { count, home, pos, vel, degree, la, lb, rest } = sim;
	const p = { ...PHYSICS_DEFAULTS, ...params };

	// Links: d3 forceLink with rest = analytic length × (distance / 55) and strength
	// min(1, mult·0.5 / min(endpoint degree)), split by degree bias.
	const lengthScale = Math.min(2.5, Math.max(0.1, p.linkDistance / PHYSICS_DEFAULTS.linkDistance));
	for (let index = 0; index < la.length; index += 1) {
		const a = la[index];
		const b = lb[index];
		let dx = pos[b * 3] + vel[b * 3] - pos[a * 3] - vel[a * 3];
		let dy = pos[b * 3 + 1] + vel[b * 3 + 1] - pos[a * 3 + 1] - vel[a * 3 + 1];
		let dz = pos[b * 3 + 2] + vel[b * 3 + 2] - pos[a * 3 + 2] - vel[a * 3 + 2];
		const d = Math.hypot(dx, dy, dz) || 1e-6;
		const strength = Math.min(1, (Math.max(0, p.linkStrength) * 0.5) / Math.min(degree[a], degree[b]));
		const l = ((d - rest[index] * lengthScale) / d) * alpha * strength;
		dx *= l;
		dy *= l;
		dz *= l;
		const bias = degree[a] / (degree[a] + degree[b]);
		vel[b * 3] -= dx * bias;
		vel[b * 3 + 1] -= dy * bias;
		vel[b * 3 + 2] -= dz * bias;
		vel[a * 3] += dx * (1 - bias);
		vel[a * 3 + 1] += dy * (1 - bias);
		vel[a * 3 + 2] += dz * (1 - bias);
	}

	applyRepel(sim, Math.max(0, p.repel) * SIM_REPEL_UNIT, alpha);

	// Anchor + centre pull + flatten: one linear spring per axis toward A·home, so a
	// pull above the default shrinks the body and one below lets it swell.
	const centre = p.centerPull - PHYSICS_DEFAULTS.centerPull;
	const flatten = (p.flatten - PHYSICS_DEFAULTS.flatten) * 0.12;
	const springXZ = Math.max(0.025, SIM_ANCHOR + centre);
	const springY = Math.max(0.025, SIM_ANCHOR + centre + flatten);
	// Core gravity and spiral swirl, Galaxy View's galaxyForces.ts in unit radius.
	const core = (p.coreGravity - PHYSICS_DEFAULTS.coreGravity) * 0.25;
	const swirl = (p.spiral - PHYSICS_DEFAULTS.spiral) * 0.6;
	for (let index = 0; index < count; index += 1) {
		const at = index * 3;
		const x = pos[at];
		const y = pos[at + 1];
		const z = pos[at + 2];
		vel[at] += (home[at] * SIM_ANCHOR - x * springXZ) * alpha;
		vel[at + 1] += (home[at + 1] * SIM_ANCHOR - y * springY) * alpha;
		vel[at + 2] += (home[at + 2] * SIM_ANCHOR - z * springXZ) * alpha;
		const r = Math.hypot(x, z);
		if (r > 1e-4 && core !== 0) {
			const weight = Math.min(3, Math.max(0.3, degree[index] / sim.meanDegree));
			const pull = core * weight * alpha;
			vel[at] -= x * pull;
			vel[at + 2] -= z * pull;
		}
		if (r > 1e-3 && swirl !== 0) {
			const k = (swirl * alpha) / (1 + r / 0.8);
			vel[at] += -z * k;
			vel[at + 2] += x * k;
		}
	}

	for (let index = 0; index < count; index += 1) {
		const at = index * 3;
		vel[at] *= SIM_VELOCITY_KEEP;
		vel[at + 1] *= SIM_VELOCITY_KEEP;
		vel[at + 2] *= SIM_VELOCITY_KEEP;
		pos[at] += vel[at];
		pos[at + 1] += vel[at + 1];
		pos[at + 2] += vel[at + 2];
		const radius = Math.hypot(pos[at], pos[at + 1], pos[at + 2]);
		if (Number.isFinite(reach) && radius > reach) {
			const pull = reach / radius;
			pos[at] *= pull;
			pos[at + 1] *= pull;
			pos[at + 2] *= pull;
		}
	}
	sim.alpha += (0 - sim.alpha) * SIM_ALPHA_DECAY;
	sim.ticks += 1;
	return !simulationSettled(sim);
}

/** Copy simulated positions back onto the galaxy nodes. */
function writeSimulation(sim, nodes) {
	for (let index = 0; index < sim.count && index < nodes.length; index += 1) {
		const node = nodes[index];
		// A working agent is placed by `orbitAgents` every frame. Writing the simulation's copy
		// back would drag it off the track to its old seat and back — a per-frame flicker that
		// read as the body vanishing for a second.
		if (node.running === true) continue;
		node.x = sim.pos[index * 3];
		node.y = sim.pos[index * 3 + 1];
		node.z = sim.pos[index * 3 + 2];
	}
}

/** Run to rest synchronously (selfcheck and tests). */
function settleSimulation(sim, params, reach, maxTicks = 400) {
	while (sim.ticks < maxTicks && stepSimulation(sim, params, reach));
	return sim;
}

export {
	PHYSICS_DEFAULTS,
	PHYSICS_KEYS,
	SIM_ALPHA_DECAY,
	createSimulation,
	physicsOf,
	reheatSimulation,
	settleSimulation,
	simulationSettled,
	stepSimulation,
	writeSimulation
};

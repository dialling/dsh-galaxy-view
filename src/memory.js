/**
 * The memory library as a galaxy: instruction files, skills and the skill calls
 * found in session logs, laid out in one deterministic disc.
 *
 * Pure model only — no DOM, no host calls. `scripts/build.mjs` inlines this into
 * the client bundle; `scripts/selfcheck.mjs` imports it directly.
 *
 * Reading: the core holds the instruction files (they bind every conversation),
 * skills ride the arms ordered by how often they were called, and each call is a
 * small star circling the skill it loaded. Bodies never move between renders for
 * the same input, so the picture is a stable map rather than a new cloud.
 */
import { hash01 } from "./graph-model.js";

/** The one authenticated RPC channel the Node half serves. */
const MEMORY_CHANNEL = "/dsh-galaxy-view";

/**
 * 记忆库's look is SETTLED — the owner approved it (2026-10) and asked that it not be
 * restyled. These constants, the mass table and the hue tables below are the picture:
 * change them only on an explicit request, and change the gate in `scripts/selfcheck.mjs`
 * with them.
 */
const MEMORY_ARMS = 3;
const MEMORY_SWIRL = 2.2;
/** Dots drawn per skill; past this the count is reported, not drawn. */
const MEMORY_DOTS = 16;
/** Calls that make a skill body reach full mass. */
const MEMORY_FULL_CALLS = 12;

/** Hue by where a skill comes from, so the source reads at a glance. */
const SKILL_HUES = {
	"user-dsh": 190,
	"user-agents": 202,
	"project-dsh": 162,
	"project-agents": 150,
	vendor: 228,
	extension: 218,
	bundled: 212,
	custom: 204
};

/**
 * Fallback hues for a skill with no known source: the 哈勃深空 palette, picked by the
 * skill's own name so it gets the same colour every time. Without this every skill
 * without a `source` fell back to one cyan and the map read as a single-colour blob.
 */
const SKILL_FALLBACK_HUES = [183, 38, 209, 15, 144, 48, 257, 332, 218];

/** Hue by what a document is: global instructions warm, workspace ones cooler. */
const DOC_HUES = { global: 44, rule: 34, agents: 48, workspace: 52, legacy: 30 };

/**
 * FNV-1a over the id: `hash01` folds similar strings into neighbouring values, so a run
 * of ids (`…-0`, `…-1`, …) landed in the same palette slot and the map came out almost
 * single-coloured. This scatters neighbours instead.
 */
function hueSlot(key) {
	let hash = 2166136261;
	for (let index = 0; index < key.length; index += 1) {
		hash ^= key.charCodeAt(index);
		hash = Math.imul(hash, 16777619) >>> 0;
	}
	return hash % SKILL_FALLBACK_HUES.length;
}

/** Stable hue for a skill: its source when that is known, otherwise its id. */
function skillHue(skill) {
	const bySource = SKILL_HUES[skill.source];
	if (bySource !== undefined) return bySource;
	// Keyed on the id, not the label: a skill synthesised from a call record has no label
	// of its own, and keying on that gave every one of them the same colour.
	return SKILL_FALLBACK_HUES[hueSlot(String(skill.id ?? skill.name ?? ""))];
}

const mass = { skill: 0.34, doc: 0.42, call: 0.12 };

/** `1.4 KB` / `42 KB` / `1.2 MB`, in the units the host locale would use. */
function formatBytes(bytes) {
	const value = Number(bytes);
	if (!Number.isFinite(value) || value < 0) return "";
	if (value < 1024) return `${Math.round(value)} B`;
	if (value < 1024 * 1024) return `${Math.round(value / 102.4) / 10} KB`;
	return `${Math.round(value / 104857.6) / 10} MB`;
}

/** Skill body mass: square-rooted call count so one hot skill does not swallow the disc. */
function skillMass(count) {
	return Math.min(1, Math.max(0, count) / MEMORY_FULL_CALLS) ** 0.5;
}

/**
 * Lay out the memory library.
 * @param input - `{ docs, skills, calls }` as the Node half reports them.
 * @returns `{ nodes, links, stats, extent }` — nodes carry world position, kind,
 * label, mass, hue and the metadata the panel and editor need.
 */
function buildMemoryGraph(input) {
	const docs = Array.isArray(input?.docs) ? input.docs : [];
	const skills = Array.isArray(input?.skills) ? input.skills : [];
	const calls = Array.isArray(input?.calls) ? input.calls : [];

	/* ── call history, grouped by skill name ─────────────────────────────── */

	const history = new Map();
	for (const call of calls) {
		const name = typeof call?.skill === "string" ? call.skill : "";
		if (name === "") continue;
		let entry = history.get(name);
		if (entry === undefined) {
			entry = { count: 0, last: 0, sessions: new Set(), list: [] };
			history.set(name, entry);
		}
		entry.count += 1;
		entry.last = Math.max(entry.last, Number(call.time) || 0);
		if (typeof call.sessionId === "string") entry.sessions.add(call.sessionId);
		entry.list.push(call);
	}

	/* ── skill bodies ───────────────────────────────────────────────────── */

	const byName = new Map();
	for (const skill of skills) {
		const name = typeof skill?.name === "string" ? skill.name : "";
		if (name === "") continue;
		const known = byName.get(name);
		if (known === undefined) byName.set(name, { ...skill, copies: 1 });
		else known.copies += 1;
	}
	const nodes = [];
	const skillNodes = new Map();
	const ranked = [...byName.values()].sort((left, right) => (history.get(right.name)?.count ?? 0) - (history.get(left.name)?.count ?? 0) || String(left.name).localeCompare(String(right.name)));
	// A skill that was called but is no longer on disk still belongs on the map.
	for (const name of history.keys()) {
		if (byName.has(name)) continue;
		ranked.push({ name, source: "missing", description: "", path: null, readOnly: true, copies: 0 });
	}
	const rings = Math.max(1, Math.ceil(ranked.length / MEMORY_ARMS));
	ranked.forEach((skill, index) => {
		const entry = history.get(skill.name);
		const count = entry?.count ?? 0;
		const rank = Math.floor(index / MEMORY_ARMS);
		const depth = (rank + 0.6) / rings;
		const arm = (index % MEMORY_ARMS) * ((Math.PI * 2) / MEMORY_ARMS);
		const jitter = hash01(`skill:${skill.name}`);
		const angle = arm + depth * MEMORY_SWIRL + (jitter - 0.5) * 0.48;
		const radius = 0.5 + 0.5 * depth;
		const node = {
			id: `skill:${skill.name}`,
			kind: "skill",
			label: skill.name,
			name: skill.name,
			x: Math.cos(angle) * radius,
			z: Math.sin(angle) * radius,
			y: (hash01(`drop:${skill.name}`) - 0.5) * 0.05,
			mass: mass.skill + (1 - mass.skill) * skillMass(count),
			hue: skillHue(skill),
			calls: count,
			last: entry?.last ?? 0,
			sessions: entry?.sessions.size ?? 0,
			source: skill.source ?? "",
			description: skill.description ?? "",
			path: skill.path ?? null,
			readOnly: skill.readOnly !== false,
			// A runtime-registered skill has no file, which is not the same as a missing one.
			registered: skill.registered === true,
			missing: skill.path === null && skill.registered !== true,
			copies: skill.copies ?? 1
		};
		nodes.push(node);
		skillNodes.set(skill.name, node);
	});

	/* ── instruction files, in the core ─────────────────────────────────── */

	docs.forEach((doc, index) => {
		const angle = (index / Math.max(1, docs.length)) * Math.PI * 2 + 0.42;
		const radius = 0.14 + 0.16 * hash01(`doc:${doc.path}:r`);
		nodes.push({
			id: `doc:${doc.path}`,
			kind: "doc",
			label: doc.name,
			name: doc.name,
			x: Math.cos(angle) * radius,
			z: Math.sin(angle) * radius,
			y: (hash01(`doc:${doc.path}:y`) - 0.5) * 0.04,
			mass: mass.doc,
			hue: DOC_HUES[doc.scope] ?? 44,
			scope: doc.scope ?? "",
			group: doc.group ?? "",
			root: doc.root ?? "",
			// the workspace a project-scoped instruction file belongs to, so the list can name it
			workspace: doc.workspace ?? "",
			path: doc.path,
			size: doc.size ?? 0,
			mtimeMs: doc.mtimeMs ?? 0,
			readOnly: doc.readOnly === true,
			missing: false
		});
	});

	/* ── one small star per call, circling its skill ─────────────────────── */

	const links = [];
	const shown = new Map();
	let hiddenCalls = 0;
	for (const [name, entry] of history) {
		const host = skillNodes.get(name);
		const pool = entry.list.slice().sort((left, right) => (Number(right.time) || 0) - (Number(left.time) || 0));
		for (const call of pool) {
			const used = shown.get(name) ?? 0;
			if (used >= MEMORY_DOTS) {
				hiddenCalls += 1;
				continue;
			}
			shown.set(name, used + 1);
			const spin = hash01(`call:${call.callId ?? `${name}:${used}`}`);
			const angle = (used / MEMORY_DOTS) * Math.PI * 2 + spin * 1.4;
			// A ring around the body itself, so the dot orbits the skill it loaded.
			const ring = 0.05 + 0.035 * (used % 2);
			const node = {
				id: `call:${call.callId ?? `${name}:${used}`}`,
				kind: "call",
				label: call.title ?? name,
				name,
				x: host.x + Math.cos(angle) * ring,
				z: host.z + Math.sin(angle) * ring,
				y: host.y + (spin - 0.5) * 0.03,
				mass: mass.call,
				hue: host.hue,
				skill: name,
				sessionId: call.sessionId ?? "",
				cwd: call.cwd ?? "",
				time: Number(call.time) || 0
			};
			nodes.push(node);
			links.push({ a: node.id, b: host.id, kind: "call" });
		}
	}

	let extent = 0.14;
	for (const node of nodes) extent = Math.max(extent, Math.hypot(node.x, node.z));

	const missingSkills = ranked.filter((skill) => skill.path === null).length;
	return {
		nodes,
		links,
		stats: {
			docs: docs.length,
			skills: ranked.length - missingSkills,
			calls: [...history.values()].reduce((total, entry) => total + entry.count, 0),
			missingSkills,
			hiddenCalls,
			bodies: nodes.length
		},
		extent: Math.min(1.4, extent)
	};
}

export { DOC_HUES, MEMORY_ARMS, MEMORY_CHANNEL, MEMORY_DOTS, MEMORY_SWIRL, SKILL_HUES, buildMemoryGraph, formatBytes };

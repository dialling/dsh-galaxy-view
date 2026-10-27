/**
 * Node half of dsh-galaxy-view: the AI memory library behind the 记忆库 view.
 *
 * The browser half draws the galaxy; this half lists what shapes the agent's
 * behaviour (instruction files, rules, skills) and how often each skill was
 * called, and reads and writes those files for the in-view editor. It serves
 * one authenticated RPC channel on the host web server, the same way dsh-ppt
 * does. Only files that discovery itself found can be read or written.
 */
import { createReadStream, promises as fs } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import zlib from "node:zlib";

const name = "dsh-galaxy-view";
// Deliberately not the plugin id: `/dsh-galaxy-view/*` is the web server's asset path for
// this plugin, so a POST there is answered 405 before the memory route is reached.
const CHANNEL = "/dsh-galaxy-view-rpc";
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ZSTD_MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]);
const INSTRUCTION_NAMES = ["AGENTS.md", "AGENTS.local.md", "CLAUDE.md", "CLAUDE.local.md"];
const HOME_DOC_NAMES = [...INSTRUCTION_NAMES, "prompt-inject.md"];
const WORKSPACE_DOC_NAMES = [...INSTRUCTION_NAMES, "README.md"];
const SESSION_FILE = /^session(?:\.v(\d+))?\.jsonl(\.zstd)?$/;

class MemoryError extends Error {
	constructor(code, message, details = {}) {
		super(message);
		this.code = code;
		this.details = details;
	}
}

const ok = (value) => ({ ok: true, value });
const fail = (error) => ({
	ok: false,
	error: {
		code: error instanceof MemoryError ? error.code : "internal",
		message: error instanceof Error ? error.message : String(error),
		details: error instanceof MemoryError ? error.details : {}
	}
});

const yieldNow = () => new Promise((resolve) => setImmediate(resolve));

async function statOrNull(target) {
	try {
		return await fs.stat(target);
	} catch {
		return null;
	}
}

async function realOrNull(target) {
	try {
		return await fs.realpath(target);
	} catch {
		return null;
	}
}

async function readDirOrEmpty(target) {
	try {
		return await fs.readdir(target, { withFileTypes: true });
	} catch {
		return [];
	}
}

/** DSH home, the legacy `~/.dsh`, and the shared `~/.agents` root, as the host resolves them. */
function resolveHomes(env = process.env) {
	const home = homedir();
	const pick = (value, fallback) => path.resolve(typeof value === "string" && value.trim() !== "" ? value : fallback);
	const dshHome = pick(env.DSH_HOME, path.join(home, ".dsh"));
	const legacyHome = path.join(home, ".dsh");
	const agentsHome = pick(env.DSH_AGENTS_HOME, path.join(home, ".agents"));
	const bundledSkills = typeof env.DSH_BUNDLED_SKILL_DIR === "string" && env.DSH_BUNDLED_SKILL_DIR !== "" ? path.resolve(env.DSH_BUNDLED_SKILL_DIR) : null;
	return { home, dshHome, dshHomes: [...new Set([dshHome, legacyHome])], agentsHome, bundledSkills };
}

/**
 * Pull `name` and `description` out of a SKILL.md front matter: plain, quoted
 * and folded/literal block values. Anything fancier falls back to the folder name.
 */
function parseFrontMatter(text) {
	const match = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/.exec(text);
	if (match === null) return {};
	const lines = match[1].split(/\r?\n/);
	const out = {};
	for (let index = 0; index < lines.length; index += 1) {
		const line = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(lines[index]);
		if (line === null) continue;
		const key = line[1];
		let value = line[2].trim();
		if (/^[>|][+-]?$/.test(value)) {
			const block = [];
			while (index + 1 < lines.length && (/^\s+\S/.test(lines[index + 1]) || lines[index + 1].trim() === "")) block.push(lines[(index += 1)].trim());
			value = block.join(value.startsWith(">") ? " " : "\n").trim();
		} else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}
		if (key === "name" || key === "description") out[key] = value;
	}
	return out;
}

/**
 * Decode every complete zstd frame from `offset` on. Session logs are appended
 * one frame at a time; Node's one-shot decoder stops after the first frame, so
 * frames are split on the magic number (a slice that fails to decode was a
 * false split and grows to the next one). Yields to the event loop as it goes.
 * @returns `{ text, offset }` where `offset` is where the next undecoded frame starts.
 */
async function decodeFrames(buffer, offset) {
	const starts = [];
	for (let at = buffer.indexOf(ZSTD_MAGIC, offset); at >= 0; at = buffer.indexOf(ZSTD_MAGIC, at + 1)) starts.push(at);
	if (starts.length === 0) return { text: "", offset };
	starts.push(buffer.length);
	const out = [];
	let first = 0;
	let consumed = starts[0];
	for (let next = 1; next < starts.length; next += 1) {
		try {
			out.push(zlib.zstdDecompressSync(buffer.subarray(starts[first], starts[next])));
			first = next;
			consumed = starts[next];
		} catch {
			/* a false split inside a frame, or a frame still being written */
		}
		if (next % 400 === 0) await yieldNow();
	}
	return { text: Buffer.concat(out).toString("utf8"), offset: consumed };
}

/** First JSON line of a session log (its header), without reading the whole file. */
async function readSessionHeader(file) {
	const compressed = file.endsWith(".zstd");
	if (compressed && typeof zlib.createZstdDecompress !== "function") return null;
	return await new Promise((resolve) => {
		const source = createReadStream(file);
		const stream = compressed ? source.pipe(zlib.createZstdDecompress()) : source;
		let text = "";
		let done = false;
		const finish = (value) => {
			if (done) return;
			done = true;
			source.destroy();
			if (stream !== source) stream.destroy();
			resolve(value);
		};
		stream.on("data", (chunk) => {
			text += chunk.toString("utf8");
			const end = text.indexOf("\n");
			if (end >= 0 || text.length > 65536) {
				try {
					finish(JSON.parse(end >= 0 ? text.slice(0, end) : text));
				} catch {
					finish(null);
				}
			}
		});
		stream.on("end", () => {
			try {
				finish(text.trim() === "" ? null : JSON.parse(text.split("\n", 1)[0]));
			} catch {
				finish(null);
			}
		});
		stream.on("error", () => finish(null));
		source.on("error", () => finish(null));
	});
}

/** The newest-format log in one session directory (`session.v4…` beats `session.jsonl…`). */
async function sessionFileIn(directory) {
	let best = null;
	for (const entry of await readDirOrEmpty(directory)) {
		if (!entry.isFile()) continue;
		const match = SESSION_FILE.exec(entry.name);
		if (match === null) continue;
		const version = match[1] === undefined ? 0 : Number(match[1]);
		if (best === null || version > best.version) best = { file: path.join(directory, entry.name), version };
	}
	return best?.file ?? null;
}

/**
 * Discovery plus a per-file incremental cache of skill calls. One instance lives
 * for the plugin's lifetime.
 */
function createMemoryStore(options = {}) {
	const homes = options.homes ?? resolveHomes();
	const skillsService = options.skills ?? (() => undefined);
	const sessionCache = new Map();
	const headerCwd = new Map();
	let allowed = new Map();
	let scan = null;

	/** Every session directory under every DSH home: `{ dir, file }`. */
	const sessionDirs = async () => {
		const found = [];
		for (const dshHome of homes.dshHomes) {
			const root = path.join(dshHome, "sessions");
			for (const workspace of await readDirOrEmpty(root)) {
				if (!workspace.isDirectory()) continue;
				for (const session of await readDirOrEmpty(path.join(root, workspace.name))) {
					if (!session.isDirectory()) continue;
					const dir = path.join(root, workspace.name, session.name);
					const file = await sessionFileIn(dir);
					if (file !== null) found.push({ dir, file });
				}
			}
		}
		return found;
	};

	/** Read one log, reusing what an earlier scan decoded when the file only grew. */
	const scanSession = async ({ dir, file }) => {
		const stat = await statOrNull(file);
		if (stat === null) return null;
		let entry = sessionCache.get(dir);
		if (entry !== undefined && entry.file === file && entry.size === stat.size && entry.mtimeMs === stat.mtimeMs) return entry;
		const grew = entry !== undefined && entry.file === file && stat.size > entry.size;
		if (!grew) entry = { file, size: 0, mtimeMs: 0, offset: 0, carry: "", id: "", cwd: "", parentId: "", title: "", createdAt: 0, updatedAt: 0, calls: [], callIds: new Set() };
		let text;
		if (file.endsWith(".zstd")) {
			if (typeof zlib.zstdDecompressSync !== "function") return null;
			const buffer = await fs.readFile(file);
			const decoded = await decodeFrames(buffer, entry.offset);
			text = decoded.text;
			entry.offset = decoded.offset;
		} else {
			const buffer = await fs.readFile(file);
			text = buffer.subarray(entry.offset).toString("utf8");
			entry.offset = buffer.length;
		}
		const lines = (entry.carry + text).split("\n");
		entry.carry = lines.pop() ?? "";
		for (const line of lines) {
			if (line === "") continue;
			const kind = /^\{"type":"([^"]+)"/.exec(line)?.[1];
			if (kind !== "session" && kind !== "session/title" && kind !== "tool/call") continue;
			if (kind === "tool/call" && !line.includes('"name":"skill"')) continue;
			let record;
			try {
				record = JSON.parse(line);
			} catch {
				continue;
			}
			if (kind === "session") {
				entry.id = typeof record.id === "string" ? record.id : entry.id;
				entry.cwd = typeof record.cwd === "string" ? record.cwd : entry.cwd;
				entry.parentId = typeof record.parentSession === "string" ? record.parentSession : typeof record.parentSession?.id === "string" ? record.parentSession.id : entry.parentId;
				entry.createdAt = Number.isFinite(record.createdAt) ? record.createdAt : entry.createdAt;
			} else if (kind === "session/title") {
				if (typeof record.data?.title === "string") entry.title = record.data.title;
			} else {
				const data = record.data ?? {};
				let skill = "";
				try {
					const args = typeof data.arguments === "string" ? JSON.parse(data.arguments) : data.arguments;
					skill = typeof args?.name === "string" ? args.name : "";
				} catch {
					skill = /"name"\s*:\s*"([^"]+)"/.exec(String(data.arguments ?? ""))?.[1] ?? "";
				}
				const callId = typeof data.callId === "string" ? data.callId : `${record.seq}`;
				if (skill === "" || entry.callIds.has(callId)) continue;
				entry.callIds.add(callId);
				entry.calls.push({ skill, callId, time: Number.isFinite(record.time) ? record.time : 0 });
			}
		}
		entry.size = stat.size;
		entry.mtimeMs = stat.mtimeMs;
		entry.updatedAt = stat.mtimeMs;
		if (entry.id === "") entry.id = path.basename(dir);
		sessionCache.set(dir, entry);
		return entry;
	};

	/** All sessions with their skill calls; concurrent callers share one pass. */
	const scanSessions = () => {
		scan ??= (async () => {
			try {
				const sessions = [];
				for (const target of await sessionDirs()) {
					try {
						const entry = await scanSession(target);
						if (entry !== null) sessions.push(entry);
					} catch {
						/* one unreadable log never hides the rest */
					}
					await yieldNow();
				}
				return sessions;
			} finally {
				scan = null;
			}
		})();
		return scan;
	};

	/** Workspace roots: every directory a session ran in (headers only, cheap). */
	const workspaceRoots = async () => {
		const roots = new Map();
		for (const target of await sessionDirs()) {
			const cached = sessionCache.get(target.dir);
			let cwd = cached !== undefined && cached.file === target.file ? cached.cwd : headerCwd.get(target.file);
			if (cwd === undefined) {
				const header = await readSessionHeader(target.file);
				cwd = typeof header?.cwd === "string" ? header.cwd : "";
				if (header !== null) headerCwd.set(target.file, cwd);
			}
			if (cwd === "" || cwd === "/" || path.resolve(cwd) === homes.home) continue;
			roots.set(path.resolve(cwd), (roots.get(path.resolve(cwd)) ?? 0) + 1);
		}
		return roots;
	};

	/** Docs and skills on disk right now; also refreshes the read/write allowlist. */
	const discover = async () => {
		const docs = [];
		const skills = [];
		const seen = new Set();
		const nextAllowed = new Map();
		const readOnlyRoot = typeof process.resourcesPath === "string" ? path.resolve(process.resourcesPath) : null;
		const admit = async (file, record) => {
			const real = await realOrNull(file);
			if (real === null || seen.has(real)) return null;
			const stat = await statOrNull(real);
			if (stat === null || !stat.isFile()) return null;
			seen.add(real);
			const readOnly = (readOnlyRoot !== null && real.startsWith(`${readOnlyRoot}${path.sep}`)) || /\.app\/Contents\//.test(real);
			const item = { ...record, path: path.resolve(file), realPath: real, size: stat.size, mtimeMs: stat.mtimeMs, readOnly };
			nextAllowed.set(item.path, item);
			nextAllowed.set(real, item);
			return item;
		};

		for (const [index, dshHome] of homes.dshHomes.entries()) {
			const scope = index === 0 ? "global" : "legacy";
			for (const fileName of HOME_DOC_NAMES) {
				const item = await admit(path.join(dshHome, fileName), { kind: "doc", group: "global", scope, name: fileName, root: dshHome });
				if (item !== null) docs.push(item);
			}
			const rules = (await readDirOrEmpty(path.join(dshHome, "rules"))).filter((entry) => entry.isFile() && entry.name.endsWith(".md")).sort((a, b) => a.name.localeCompare(b.name));
			for (const entry of rules) {
				const item = await admit(path.join(dshHome, "rules", entry.name), { kind: "doc", group: "global", scope: "rule", name: entry.name, root: dshHome });
				if (item !== null) docs.push(item);
			}
		}
		for (const fileName of INSTRUCTION_NAMES) {
			const item = await admit(path.join(homes.agentsHome, fileName), { kind: "doc", group: "global", scope: "agents", name: fileName, root: homes.agentsHome });
			if (item !== null) docs.push(item);
		}

		const workspaces = await workspaceRoots();
		for (const [cwd] of [...workspaces].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
			for (const fileName of WORKSPACE_DOC_NAMES) {
				const item = await admit(path.join(cwd, fileName), { kind: "doc", group: `ws:${cwd}`, scope: "workspace", name: fileName, root: cwd, workspace: cwd });
				if (item !== null) docs.push(item);
			}
		}

		const addSkillRoot = async (root, source, group, extra = {}) => {
			for (const entry of (await readDirOrEmpty(root)).sort((a, b) => a.name.localeCompare(b.name))) {
				if (entry.name.startsWith(".")) continue;
				const full = path.join(root, entry.name);
				const isDir = entry.isDirectory() || (entry.isSymbolicLink() && (await statOrNull(full))?.isDirectory() === true);
				const file = isDir ? path.join(full, "SKILL.md") : entry.name.endsWith(".md") ? full : null;
				if (file === null) continue;
				let head = "";
				try {
					const handle = await fs.open(file, "r");
					try {
						const { buffer, bytesRead } = await handle.read(Buffer.alloc(8192), 0, 8192, 0);
						head = buffer.subarray(0, bytesRead).toString("utf8");
					} finally {
						await handle.close();
					}
				} catch {
					continue;
				}
				const meta = parseFrontMatter(head);
				if (!isDir && meta.name === undefined) continue;
				const skillName = meta.name ?? entry.name;
				const item = await admit(file, { kind: "skill", group, source, name: skillName, description: meta.description ?? "", root, ...extra });
				if (item !== null) skills.push(item);
			}
		};
		for (const [cwd] of workspaces) {
			await addSkillRoot(path.join(cwd, ".dsh", "skills"), "project-dsh", `ws:${cwd}`, { workspace: cwd });
			await addSkillRoot(path.join(cwd, ".agents", "skills"), "project-agents", `ws:${cwd}`, { workspace: cwd });
		}
		for (const dshHome of homes.dshHomes) await addSkillRoot(path.join(dshHome, "skills"), "user-dsh", "skills:user");
		await addSkillRoot(path.join(homes.agentsHome, "skills"), "user-agents", "skills:user");
		for (const dshHome of homes.dshHomes) {
			for (const vendor of await readDirOrEmpty(path.join(dshHome, "vendor"))) {
				if (vendor.isDirectory()) await addSkillRoot(path.join(dshHome, "vendor", vendor.name, "skills"), "vendor", "skills:extension");
			}
			await addSkillRoot(path.join(dshHome, "redteam", "skills"), "extension", "skills:extension");
		}
		if (homes.bundledSkills !== null) await addSkillRoot(homes.bundledSkills, "bundled", "skills:extension");
		// Whatever the host's skill registry knows that the walk above missed: custom roots, and
		// the skills a plugin registers in memory alone (ponytail's optional skills ship no file).
		const registry = skillsService();
		const registeredNames = new Set(skills.map((skill) => skill.name));
		if (registry !== undefined && typeof registry.list === "function") {
			try {
				for (const summary of await registry.list({})) {
					if (typeof summary?.name !== "string" || summary.name === "" || registeredNames.has(summary.name)) continue;
					if (typeof summary.path !== "string") {
						// Registered at runtime: no path, so nothing to read or edit, but it belongs in
						// the 技能 list — leaving it out made the map disagree with the model's catalog.
						registeredNames.add(summary.name);
						skills.push({
							kind: "skill",
							group: "skills:registered",
							source: summary.source ?? summary.provider ?? "registered",
							name: summary.name,
							description: summary.description ?? "",
							path: null,
							size: 0,
							mtimeMs: 0,
							readOnly: true,
							registered: true,
							copies: 1
						});
						continue;
					}
					registeredNames.add(summary.name);
					const item = await admit(summary.path, { kind: "skill", group: "skills:extension", source: summary.source ?? "custom", name: summary.name, description: summary.description ?? "", root: path.dirname(path.dirname(summary.path)) });
					if (item !== null) skills.push(item);
				}
			} catch {
				/* the registry is a bonus, never a requirement */
			}
		}
		allowed = nextAllowed;
		return { docs, skills, workspaces: [...workspaces].map(([cwd, sessions]) => ({ path: cwd, sessions })) };
	};

	const publicItem = ({ realPath, ...item }) => item;

	/** Instruction files, rules and skills (no call history: that is `calls`). */
	const list = async () => {
		const found = await discover();
		return {
			homes: { dsh: homes.dshHome, agents: homes.agentsHome },
			docs: found.docs.map(publicItem),
			skills: found.skills.map(publicItem),
			workspaces: found.workspaces
		};
	};

	/** Every skill call in every session log, newest first. */
	const calls = async () => {
		const sessions = await scanSessions();
		const byId = new Map(sessions.map((entry) => [entry.id, entry]));
		const rootOf = (entry) => {
			let current = entry;
			for (let hop = 0; hop < 16 && current.parentId !== "" && byId.has(current.parentId); hop += 1) current = byId.get(current.parentId);
			return current;
		};
		const out = [];
		for (const entry of sessions) {
			if (entry.calls.length === 0) continue;
			const root = rootOf(entry);
			for (const call of entry.calls) {
				out.push({ skill: call.skill, callId: call.callId, time: call.time, sessionId: entry.id, rootSessionId: root.id, title: root.title || entry.title, cwd: entry.cwd });
			}
		}
		out.sort((a, b) => b.time - a.time);
		return { calls: out, sessions: sessions.length, zstd: typeof zlib.zstdDecompressSync === "function" };
	};

	/** Look a path up in the allowlist, refreshing discovery once on a miss. */
	const lookup = async (target) => {
		if (typeof target !== "string" || target === "" || !path.isAbsolute(target)) throw new MemoryError("invalid-request", "path must be an absolute path");
		const key = path.resolve(target);
		let item = allowed.get(key);
		if (item === undefined) {
			await discover();
			item = allowed.get(key);
		}
		if (item === undefined) throw new MemoryError("forbidden", "this file is not part of the memory library", { path: key });
		return item;
	};

	const read = async (payload) => {
		const item = await lookup(payload?.path);
		const stat = await statOrNull(item.realPath);
		if (stat === null || !stat.isFile()) throw new MemoryError("not-found", "the file no longer exists", { path: item.path });
		if (stat.size > MAX_FILE_BYTES) throw new MemoryError("too-large", "the file is too large to edit here", { size: stat.size });
		const content = await fs.readFile(item.realPath, "utf8");
		return { path: item.path, realPath: item.realPath, content, mtimeMs: stat.mtimeMs, size: stat.size, readOnly: item.readOnly };
	};

	/**
	 * Replace a file's content. Refuses when the file changed since `baseMtimeMs`
	 * (unless `force`), writes through symlinks to the real file, and swaps a
	 * sibling temp file in so a crash never leaves half a file.
	 */
	const write = async (payload) => {
		const item = await lookup(payload?.path);
		if (typeof payload?.content !== "string") throw new MemoryError("invalid-request", "content must be a string");
		if (Buffer.byteLength(payload.content, "utf8") > MAX_FILE_BYTES) throw new MemoryError("too-large", "the content is too large", {});
		if (item.readOnly) throw new MemoryError("read-only", "this file ships inside the app and cannot be edited", { path: item.path });
		const stat = await statOrNull(item.realPath);
		if (stat === null || !stat.isFile()) throw new MemoryError("not-found", "the file no longer exists", { path: item.path });
		if (payload.force !== true && (!Number.isFinite(payload.baseMtimeMs) || Math.abs(stat.mtimeMs - payload.baseMtimeMs) > 1)) {
			throw new MemoryError("conflict", "the file changed on disk since it was opened", { mtimeMs: stat.mtimeMs });
		}
		const directory = path.dirname(item.realPath);
		const temp = path.join(directory, `.${path.basename(item.realPath)}.dgv-${process.pid}-${Date.now().toString(36)}.tmp`);
		try {
			await fs.writeFile(temp, payload.content, { encoding: "utf8", mode: stat.mode & 0o777 });
			await fs.chmod(temp, stat.mode & 0o777);
			await fs.rename(temp, item.realPath);
		} catch (error) {
			await fs.rm(temp, { force: true }).catch(() => {});
			throw new MemoryError("write-failed", error instanceof Error ? error.message : String(error), { path: item.path });
		}
		const after = await fs.stat(item.realPath);
		item.mtimeMs = after.mtimeMs;
		item.size = after.size;
		return { path: item.path, mtimeMs: after.mtimeMs, size: after.size };
	};

	return { list, calls, read, write, discover, homes };
}

/** Channel handler: endpoint name → `{ ok, value }` or `{ ok: false, error }`. */
function memoryRpc(store) {
	return async (endpoint, payload) => {
		try {
			switch (endpoint) {
				case "memory.list":
					return ok(await store.list());
				case "memory.calls":
					return ok(await store.calls());
				case "memory.read":
					return ok(await store.read(payload));
				case "memory.write":
					return ok(await store.write(payload));
				default:
					return fail(new MemoryError("not-found", `dsh-galaxy-view endpoint ${endpoint} was not found`));
			}
		} catch (error) {
			return fail(error);
		}
	};
}

/** HTTP route for the browser's Connection RPC caller (POST `<channel>/<endpoint>`). */
function routeHandler(channel, handler, connectionOf) {
	return async (req, res) => {
		if (req.method !== "POST") {
			res.setHeader("Allow", "POST");
			res.writeHead(405);
			res.end();
			return;
		}
		const connection = connectionOf();
		const rejection = typeof connection?.requestRejection === "function" ? connection.requestRejection(req) : 403;
		if (rejection !== undefined) {
			res.writeHead(rejection);
			res.end(rejection === 401 ? "unauthorized" : "forbidden");
			return;
		}
		const chunks = [];
		let received = 0;
		for await (const chunk of req) {
			received += chunk.length;
			if (received > MAX_BODY_BYTES) {
				res.writeHead(413);
				res.end("payload too large");
				return;
			}
			chunks.push(chunk);
		}
		let body;
		try {
			body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
		} catch {
			res.writeHead(400);
			res.end("body is not JSON");
			return;
		}
		const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
		const endpoint = pathname.startsWith(`${channel}/`) ? pathname.slice(channel.length + 1) : "";
		const result = await handler(endpoint, body?.payload);
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ type: "server-response", rpcId: body?.rpcId, result }));
	};
}

/**
 * Read a service without making it a hard dependency: `ctx.get` answers
 * `undefined` instead of throwing when the service is absent.
 */
function safeGet(ctx, service) {
	try {
		return ctx.get(service);
	} catch {
		return undefined;
	}
}

/** The web server is this half's one required service; it owns the route table. */
const inject = ["webServer"];

function apply(ctx) {
	const store = createMemoryStore({ skills: () => safeGet(ctx, "skills") });
	const handler = memoryRpc(store);
	// The route is registered here rather than through `connection.rpc.handle`: that
	// adapter registers on the connection service's own context, which injects one
	// service (`credentials`) and not `webServer`, so on this host it throws
	// "cannot get property webServer without inject" and takes this fiber down with
	// it. The fence is still the host's: `requestRejection` is resolved per request
	// from the live connection service, and answers 403 when there is none.
	ctx.effect(
		() => ctx.webServer.register({ kind: "prefix", path: CHANNEL, handler: routeHandler(CHANNEL, handler, () => safeGet(ctx, "connection")) }),
		"dsh-galaxy-view: memory rpc route"
	);
}

export { CHANNEL, MemoryError, apply, createMemoryStore, decodeFrames, inject, memoryRpc, name, parseFrontMatter, readSessionHeader, resolveHomes, routeHandler };

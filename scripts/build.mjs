/**
 * Bundle the browser half into `lib/client.js`.
 *
 * The harness client loader executes a plugin bundle as
 *
 *     window.__ModuleLoader__.load({ id, factory: (require) => { … } })
 *
 * and every module body stays inside that factory so CSS and module-scope state
 * are materialized on first import. This script inlines `src/styles.css`,
 * `src/settings.js`, `src/graph-model.js`, `src/stars.js` and `src/warp.js` into `src/client.js` and wraps the result — no bundler, no
 * dependencies, nothing to keep in sync by hand.
 *
 * Usage: node scripts/build.mjs
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const packageName = packageJson.name;

/** Read a source file, normalized to LF so produced bundles are byte-stable. */
function source(relativePath) {
	return readFileSync(join(root, relativePath), "utf8").replace(/\r\n/g, "\n");
}

/** Strip ESM keywords from a module meant to be embedded in the factory scope. */
function inlineModel(text) {
	return text
		.replace(/^import \{[^}]*\} from "[^"]+";\n?/gm, "")
		.replace(/^export \{[^}]*\};\n?/gm, "")
		.replace(/^export (?=(?:async )?function |const |let |class )/gm, "")
		.trim();
}

/** Emit a style tag once per page, the same way the built-in client bundles do. */
function stylePrelude(css) {
	const tagId = `${packageName}/styles.css`;
	return [
		`		const css = ${JSON.stringify(css)};`,
		`		const tagId = ${JSON.stringify(tagId)};`,
		"		if (typeof document !== \"undefined\" && document.querySelector(\"style[data-plugin-css=\" + JSON.stringify(tagId) + \"]\") === null) {",
		"			const tag = document.createElement(\"style\");",
		`			tag.dataset.plugin = ${JSON.stringify(packageName)};`,
		"			tag.dataset.pluginCss = tagId;",
		"			tag.textContent = css;",
		"			document.head.appendChild(tag);",
		"		}"
	].join("\n");
}

const look = inlineModel(source("src/settings.js"));
const model = inlineModel(source("src/graph-model.js"));
const stars = inlineModel(source("src/stars.js"));
const warp = inlineModel(source("src/warp.js"));
const client = source("src/client.js").trim();
const css = source("src/styles.css");

const bundle = [
	"// dsh-graph-view — generated client bundle. Do not edit: change src/ and run",
	"// `node scripts/build.mjs` instead.",
	"window.__ModuleLoader__.load({",
	`	id: ${JSON.stringify(packageName)},`,
	"	factory: (require) => {",
	"		var module = { exports: {} };",
	"		var exports = module.exports;",
	"		Object.defineProperty(exports, Symbol.toStringTag, { value: \"Module\" });",
	"",
	stylePrelude(css),
	"",
	"		// ── src/settings.js ────────────────────────────────────────────",
	look,
	"",
	"		// ── src/graph-model.js ─────────────────────────────────────────",
	model,
	"",
	"		// ── src/stars.js ───────────────────────────────────────────────",
	stars,
	"",
	"		// ── src/warp.js ────────────────────────────────────────────────",
	warp,
	"",
	"		// ── src/client.js ──────────────────────────────────────────────",
	client,
	"",
	"		return module.exports;",
	"	}",
	"});",
	""
].join("\n");

mkdirSync(join(root, "lib"), { recursive: true });
writeFileSync(join(root, "lib/client.js"), bundle);

// The bundle is one function body: a duplicate top-level `const` is a parse error
// that would take the whole client boot down, so gate every build on a parse.
const syntax = spawnSync(process.execPath, ["--check", join(root, "lib/client.js")], { encoding: "utf8" });
if (syntax.status !== 0) {
	console.error(syntax.stderr.trim());
	throw new Error("lib/client.js does not parse; fix the duplicate identifier above");
}

const digest = createHash("sha256").update(bundle).digest("hex").slice(0, 16);
console.log(`lib/client.js  ${bundle.length} bytes  sha256:${digest}`);
console.log(`  settings ${look.length}  model ${model.length}  stars ${stars.length}  warp ${warp.length}  client ${client.length}  css ${css.length}`);

/**
 * Local development helper: mount this checkout into a running dsh profile.
 *
 * It does two idempotent things and nothing else:
 *   1. symlink `<profile>/node_modules/dsh-galaxy-view` → this package;
 *   2. make sure `<profile>/cordis.patch.yml` carries one insert row for it
 *      (the file is backed up before the first edit).
 *
 * Usage: node scripts/install-into-profile.mjs [--profile <dir>]
 */
import { copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, readlinkSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const packageName = packageJson.name;

const flag = process.argv.indexOf("--profile");
const profile = flag === -1
	? process.env.DSH_PROFILE_DIR ?? join(homedir(), "Library/Application Support/dsh-desktop/harness/profiles/web")
	: resolve(process.argv[flag + 1]);

if (!existsSync(profile)) {
	console.error(`profile not found: ${profile}`);
	process.exit(1);
}

/* 1. node_modules entry ---------------------------------------------------- */

const modulesDir = join(profile, "node_modules");
mkdirSync(modulesDir, { recursive: true });
const linkPath = join(modulesDir, packageName);
let linked = "kept";
const isLink = (() => {
	try {
		return lstatSync(linkPath).isSymbolicLink();
	} catch {
		return false;
	}
})();
if (existsSync(linkPath) || isLink) {
	const target = isLink ? resolve(dirname(linkPath), readlinkSync(linkPath)) : null;
	if (target !== root) {
		rmSync(linkPath, { recursive: true, force: true });
		symlinkSync(root, linkPath, "dir");
		linked = "replaced";
	}
} else {
	symlinkSync(root, linkPath, "dir");
	linked = "created";
}

/* 2. patch row ------------------------------------------------------------- */

const patchPath = join(profile, "cordis.patch.yml");
const current = existsSync(patchPath) ? readFileSync(patchPath, "utf8") : "";
const marker = "# dsh-galaxy-view: mounted from a local checkout";
let next = current;
let patched = "already present";
if (!current.includes(`name: '${packageName}'`) && !current.includes(`name: "${packageName}"`)) {
	const block = [
		"",
		marker,
		"- insert:",
		`    - id: ${packageName}`,
		`      name: '${packageName}'`,
		""
	].join("\n");
	if (current !== "") copyFileSync(patchPath, `${patchPath}.pre-graph-view.bak`);
	next = `${current.replace(/\s*$/, "\n")}${block}`;
	writeFileSync(patchPath, next);
	patched = "inserted";
}

console.log(`profile  ${profile}`);
console.log(`link     ${linkPath} → ${root} (${linked})`);
console.log(`patch    ${patchPath} (${patched})`);
console.log("next     restart or reload the dsh app so the loader picks the row up");

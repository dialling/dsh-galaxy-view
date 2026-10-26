# Publishing dsh-graph-view

Everything below is manual and done by you, the maintainer. Nothing in this
repo publishes, pushes or creates anything on its own. `PUBLISHING.md` is not
shipped in the npm tarball.

## Pre-flight

- `npm run check` is green (build with the syntax gate + selfcheck, including
  the packaging assertions).
- `npm pack --dry-run` lists only `lib`, `locale`, both READMEs, `LICENSE`,
  `CHANGELOG.md`, `cordis.patch.yml` and `assets/icon.svg` (about 0.3 MB).

## Checklist (in order)

1. **Create the public GitHub repo** `dialling/dsh-graph-view` and push:

   ```bash
   gh repo create dialling/dsh-graph-view --public --source . --remote origin
   git push -u origin main
   ```

2. **Add the GitHub topic** `dsh-plugin` — the market requires it:

   ```bash
   gh repo edit dialling/dsh-graph-view --add-topic dsh-plugin
   ```

3. **Publish to npm.** The market prefers a repository-verified npm package,
   and `repository` already points at the repo, so this is the primary install
   path. `prepack` rebuilds the bundle and re-runs selfcheck first:

   ```bash
   npm login        # once
   npm publish
   ```

4. **(Optional) GitHub release `v0.3.0`.** Attach the `npm pack` tarball as
   `dsh-graph-view-0.3.0.tgz` for the tarball install path; the release notes
   double as the market's "what changed" link.

5. **Open the market pull request — at least 1 day after the repo was
   created** (market rule; younger repos are rejected). Fork
   `awesome-dsh-plugin/awesome-dsh-plugin`, add the file
   `data/plugins/dialling__dsh-graph-view.yml` with the block below, and open
   the PR (at most 3 plugin entries per PR).

## Market entry: `data/plugins/dialling__dsh-graph-view.yml`

Ready to paste:

```yaml
url: https://github.com/dialling/dsh-graph-view
name: dialling/dsh-graph-view
category: ui
description:
  en: "Cinematic 3D galaxy graph: workspaces become suns on spiral arms, conversations become stars, with eight layouts, a warp transition into workspaces, and one header button back to the stock interface."
  zh: "把工作区与对话画成三维星系：工作区是旋臂上的恒星，对话是星点；八种布局、进入工作区的跃迁动画，顶栏一键切回原版界面。"
icon: https://raw.githubusercontent.com/dialling/dsh-graph-view/main/assets/icon-180.png
```

Notes:

- The market card title and short description come from
  `locale/{en,zh}.json` → `meta.title` / `meta.description`; keep the yml
  description consistent with them (a maintainer checks it against the code).
- `screenshots.json` at the repo root lists the gallery images
  (`docs/*.png`). The market reads them from the GitHub repo, so the docs
  images deliberately do not ship in the npm tarball.
- `assets/icon-180.png` is the square catalog icon served from the repo; the
  in-app icon is `assets/icon.svg` via the package.json `icon` field.

## Before testing a market install (important)

The development setup loads this same plugin id from your local checkout. If it
stays in place, the market install loads **twice under the same id**. Remove
the dev mount first:

1. Delete the symlink:

   ```bash
   rm "$HOME/Library/Application Support/dsh-desktop/harness/profiles/web/node_modules/dsh-graph-view"
   ```

2. Remove the patch row from
   `$HOME/Library/Application Support/dsh-desktop/harness/profiles/web/cordis.patch.yml`:
   delete the block that starts with the comment
   `# dsh-graph-view: mounted from a local checkout` together with its
   `- insert:` lines. (Or restore the `cordis.patch.yml.pre-graph-view.bak`
   backup written next to it on first install.)

3. Restart DSH (or reopen the window), then install `dsh-graph-view` from the
   market and test.

To go back to development afterwards, run
`node scripts/install-into-profile.mjs` again — it recreates the symlink and
the patch row idempotently.

## Updates

The market offers an update only when `version` increases: bump `package.json`,
add a `CHANGELOG.md` entry, run `npm publish`, done. The market entry yml does
not need a new PR for routine updates.

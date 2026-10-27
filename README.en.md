# dsh-galaxy-view · Galaxy view

[中文](README.md) · **English**

Every workspace and conversation in DeepSeek Harness, drawn as a **three-dimensional
galaxy** inside a hollow shell of hard white dots: workspaces are suns on spiral
arms, conversations are small sharp stars orbiting them, and fork/subagent lineage
draws a thin filament. The camera orbits on its own; drag to take over, scroll to
dolly. Click a star and the view warps into that conversation or workspace; the
**回到星系 / Back to the galaxy** capsule brings you back out.

The visual direction follows Obsidian's [Galaxy View](https://community.obsidian.md/plugins/galaxy-view)
(a cinematic 3D graph in the NASA Eyes style): a pure black sky, a crisp dot sphere,
small cool-and-warm stars, and very thin, faint links.

![The galaxy view](docs/galaxy.png)

## Install

**From the DSH plugin market** (once published): search `dsh-galaxy-view`.

**From npm into a profile:**

```bash
cd "$DSH_HOME/profiles/web"
pnpm add dsh-galaxy-view        # or: npm install dsh-galaxy-view
```

`dsh.bundle.patch` inserts the loader row; restart the app (or reopen the window).

**Manual, from a local checkout (development):**

```bash
node scripts/install-into-profile.mjs                       # default web profile
node scripts/install-into-profile.mjs --profile PATH        # explicit profile
```

The script symlinks this package into `<profile>/node_modules/` and appends one
`insert` row to `<profile>/cordis.patch.yml` (backed up first, idempotent).

Once installed, a 星空 button appears at the right of the header in any conversation; it opens
the galaxy, and 原版界面 (or the capsule inside a star) takes you back. Pick a preset card in the
left panel to change the look.

## The look

- **Sky shell.** One hollow sphere of dense **hard square dots** (2600 grains at
  1.2 px, 900 at 2 px, 250 at 3 px, in five muted near-white tints), with a clean,
  readable rim and an even spread — no soft light blobs. Each grain fills exactly
  the pixels a WebGL point of its size would, so while the camera cruises the
  small grains pop between 1 and 2 px and the sky shimmers like the reference;
  a still view stays still.
  780 field stars fill the interior so the disc never reads hollow. Dot sizes are
  fixed on screen and scale with the *shell size* slider.
- **Stars.** Bright, opaque solid discs with a crisp edge and a white-hot centre
  that never clips to pure white, plus a tight coloured halo — at overview
  distance conversations draw at 4–9 px and workspaces at 7–16 px, growing up to
  15 px and 24 px close up (workspaces scale with their conversation count).
  Selecting a star only lightly dims the others. No dark
  outlines, no plastic glow.
- **Colour.** The default **Deep Field** theme is Galaxy View's Hubble palette:
  cyan, gold, blue, rust, green, cream, violet, pink and silver, cool and warm in
  turn, with cream and silver kept pale. As in Galaxy View, the workspaces with
  the most conversations take the first colours, so the big ones never share one.
  Every theme (Deep Field, Hubble, Neon, Sunset, Cyber, Matrix, Aurora) draws on
  pure black (`#000000`); colour comes only from the stars, the links and the
  world-space haze, never from a tinted backdrop.
- **Links.** Bright wires about 1.1 px wide, each a gradient from one star's
  colour to the other's, so a link between a blue and a gold star turns bluer
  near the blue end and more golden near the gold end. Every hue is drawn at the
  same brightness, and overlapping links do not add up. They bow gently away from
  the centre like the reference, and only real relationships are drawn:
  workspace→conversation membership and parent→child lineage. The **Links**
  button in the header shows or hides them; clicking a conversation keeps only
  its own links in either state, and the Links section sets their width, opacity,
  bow and colour (star colours, a swatch, or any colour).
- **Composition.** The stars fill the sphere interior instead of bunching at the
  centre: the spiral shows two clear arms with a sparse middle, and all eight
  layouts spread into the same volume while staying recognisable. The overview
  always frames the whole shell, so the rim is never cropped.
- **No centre light.** No central light ball and no bloom wash — at rest, during a
  dive, or during the warp. The centre holds only 110 faint dust grains.

## The eight layouts

A preset switches the whole geometry, not just numbers: star positions, dust and
the faint guide skeleton all follow the layout.

| Preset | Layout | Reads as |
| --- | --- | --- |
| Galaxy 银河 | `spiral` | the two-armed disc with a sparse core |
| Rings 星环 | `rings` | four concentric orbits, one colour per ring, no links; every body travels its own ring in a double helix |
| Armillary 浑天 | `sphere` | an armillary sphere: five same-radius rings, each tilted into its own plane (golden-angle spread) so their union is a ball; bodies dealt onto the rings by weight and seated evenly, each ring spinning inside its own plane |
| Solar system 太阳系 | `system` | a spherical sun of warm dust at the centre, one planet per workspace on its own nested orbit, each planet wrapped in its conversations as a small spherical shell of stars — and the whole system revolves: planets around the sun (inner fast, outer slow), moons around their planet |
| Helix 双螺旋 | `helix` | two strands climbing 1.6 turns; workspaces are split between the strands by star count, so both carry the same number of stars and each runs the full height |
| Matrix 矩阵 | `web` | one lumpy ball of green dots and straight links, no glow and no backdrop |
| Cube 方阵 | `plate` | a solid cube: every star on one lattice, each workspace a block of it, the twelve edges drawn |
| Tree 星树 | `tree` | a pure starburst: every workspace owns a ray out of the origin, spread over the sphere by the golden angle, and a heavier workspace reaches further; its conversations continue along the same ray in a tube that widens (a third of them on twigs) |

| Armillary | Rings | Tree |
| --- | --- | --- |
| *(recapture pending)* | ![Rings](docs/appearance-rings.png) | ![Tree](docs/appearance-tree.png) |

## Reading the galaxy

| On screen | Meaning |
| --- | --- |
| coloured sun | one workspace; hue fixed by workspace order, dot grows with its conversation count |
| stars around a sun | that workspace's conversations; running ones pulse |
| faint thread | membership; fork / subagent to parent is a brighter bowed thread |
| drifting dust | arms and a diffuse disc (the *dust lanes* slider, off by default) — backdrop, not clickable |
| hard white dot sphere | the sky shell: a true 3D shell of points sharing the galaxy's camera and centred on the galaxy — diving into a star moves you *through* it instead of dragging a backdrop along |

The current session wears a white ring; archived stars are dimmer and only appear
with *Archived* on.

## Interaction

| Input | Result |
| --- | --- |
| drag | orbit, with inertia; auto-orbit resumes 1.6 s after release |
| scroll | dolly (`exp(deltaY × 0.0065)` per notch, eased in about 70 ms, quick notches add up; pulls back to about 4.5× the overview, with deep-sky stars all around) |
| click a star or sun | dives the camera onto it (a conversation to 0.12× the overview distance in 980 ms, a workspace to 0.30× in 1150 ms) and opens a small card: title, path, time, state; its neighbourhood stays bright (selection depth 1 or 2) and the rest fades, hover never dims |
| **Open** / **进入工作区 (Enter workspace)** in the card | plays the warp transition into that conversation or workspace |
| double-click a star or sun | skips the card and warps straight in |
| click a row in a workspace card | flies the camera to that conversation and selects it (double-click the row to open) |
| `Tab` / `Shift+Tab` | walk the stars, card by card; `Enter` dives to or opens the current one |
| `F` / `R` | focus the selection / back to the overview |
| `Esc` | clear focus, selection and a running connect-two route |
| header search | type a title or path, pick a hit (arrow keys + `Enter`) and the camera flies there; matches get a caption |
| a conversation in the harness sidebar | while the galaxy is open, flies to that star instead of leaving star mode (anything not drawn opens as usual) |
| Archived / Reset / Re-roll | show archived / refit the camera / new seed and re-solve the galaxy |
| ☰ | collapse / expand the left control panel; drag its right edge to resize (240–480 px) |

![Tracking a star](docs/tracked.png)

**The warp.** Entering a star first dives toward it in the live scene, then a
tunnel of fine points stretches into 1 px light trails and settles into a hollow
landing shell of hard squares in the star's own colour, revealed in a wave from
the centre outward with a halo pulse. The overlay waits for the target panel to
mount before fading, and a main-thread stall delays the phases instead of
skipping them. Inside, the landing shell stays on as the room you are now in: the
same sphere, widened past the frame so its rim is never in view, every dot the same
size and the same brightness across two slowly turning layers, with a star-coloured
rim glow and the **回到星系 / Back to the galaxy** capsule (which plays a short
reverse warp back). With `prefers-reduced-motion`, a plain crossfade replaces the
flight.

![Warp transition](docs/warp.png)

Opening the galaxy view collapses the harness sidebar so it gets the whole
window; leaving it puts the sidebar back at the width it had. If you re-open the
sidebar while in the galaxy, it is left alone on exit.

## Memory library

The **Memory** button in the header swaps the galaxy for the map of what shapes the
agent: the instruction files it reads, the skills it can load, and how often each
skill was actually called. Both views live behind the same panel, and the choice
survives a reload.

| On screen | Meaning |
| --- | --- |
| gold body in the core | one instruction file: `AGENTS.md`, `CLAUDE.md`, `prompt-inject.md`, a `rules/*.md`, a workspace `README.md` |
| cyan body on an arm | one skill; the hue says where it comes from (own skills / shared `~/.agents` / project / bundled), the size grows with its call count |
| small star circling a skill | one call: a session that loaded that skill; past 16 the rest are counted, not drawn |
| thin thread | call → the skill it loaded |

Click a body, or a row in the left list, to select it. The card under the list
shows what it is and where it lives, and **Open** reads the file into the editor
drawer on the right. The editor writes straight to disk: `⌘S` / `Ctrl+S` saves, a
file that changed since it was opened comes back as a conflict (*reload* or
*overwrite*), and files that ship inside the app stay read-only. Drag orbits,
scroll zooms, double-click empty space reframes, double-click a body opens it.

The Node half finds the library itself — DSH home, `~/.agents`, each workspace's
`.dsh/skills` and `.agents/skills`, vendor and extension roots, plus whatever the
host's skill registry knows — and reads the skill calls back out of every session
log, plain `.jsonl` and appended-frame `.zstd` alike. It serves one authenticated
RPC channel, `/dsh-galaxy-view`, on the host's web server, and the browser half only
ever sees paths discovery returned. Details: [docs/memory-library.md](docs/memory-library.md).

Adding this view to a DSH that is already running needs a restart: the Node half
mounts with the host process, not with the page.

## Control panel

Collapse it with ☰ in the page header; otherwise it stays docked left and scrolls.
The header holds a language switch (follow the host / 中 / EN) and a **?** help card
with the keyboard and filter cheat sheet. Open/closed sections are remembered.

| Section | Contents |
| --- | --- |
| Look | the eight preset cards — a preset is a whole parameter set (theme, bloom, deep space, shell, arm shape, link curve, twinkle, orbit speed); hovering a card previews its look instantly, clicking one dissolves into it (the outgoing frame fades over the new sky while its stars grow in) |
| Filter | one row per workspace with its colour and conversation count; click to hide, double-click to isolate; orphan and empty-workspace toggles; a filter box with Galaxy View's syntax (words ANDed, `-word` excludes, `path:` / `name:`, `"a phrase"`) |
| Status | All / Running / Current / Subagents / Archived lenses; non-matches dim but stay clickable |
| Colour | the seven themes, shuffle colours, node size, twinkle, and size by activity / links / uniform |
| Links | show links switch (same as the header button; when off, a clicked conversation still shows its own links), link width (0.2–4×), link opacity, link brightness (0.3–2.5: above 1 lifts towards white, below 1 darkens, hue kept), link curve (0 straight to 2), and link colour: star colours, four swatches or a colour picker |
| Deep space | nebula veil, field stars, cluster mist, dust lanes, shell density, shell size, shell brightness, and the starfield switch |
| Bloom | star brightness (bodies only — links keep their own slider), bloom strength (0.5 by default: a white-hot core inside a broad soft glow), radius (the halo grows *and* keeps its peak, so a wider bloom reads as more glow) and threshold (a body blooms only above it, judged by its own size basis, so dragging right leaves just the suns) |
| Shape | arms, twist, thickness, spread — re-solves the galaxy geometry |
| Physics | repel, link distance, link strength, centre pull, flatten, core gravity, spiral — a live force layer over the layout |
| Navigation | auto-orbit switch and speed, wander and its speed, selection depth (1 or 2 hops), **connect two** (pick two stars; the camera flies the shortest link path hop by hop, through both suns when they sit in different workspaces), replay intro, reset everything, save as my preset (up to 8; double-click to rename, ↑ to reorder, × asks before deleting) |
| Advanced | quality auto / high / low / mobile (mobile turns off bloom and mist and draws at most 1500 stars) and a live `fps · ms · stars · threads · quality` line |

Every slider shows a notch at its default (the active preset's value when the
preset owns it); double-click the slider or its label to go back. Each section
header says which preset set it, shows **customised** once you change it, and
offers **↺ Restore** for just that section.

Auto-orbit cruises at Galaxy View's rate — one revolution takes about five minutes — and the panel
scales it 0.2×–3×. Hovering a star parks the drift so the target cannot slip away.
Every setting persists in `localStorage`.

**Settings migration.** The look changed enough that old visual settings would
hide it, so settings carry a version (now 3). On the first load after upgrading,
the visual keys (preset, layout, theme, sliders, shape, physics, orbit speed,
quality) reset once to the new defaults. Your filters are kept: hidden
workspaces, the isolated workspace, filter text, status lens, the orphan and
empty toggles, the auto-orbit/wander switches, the language, the panel width
and sections, and the selection depth.

## Development

```bash
npm run check     # build (with a syntax gate) + selfcheck
```

- `src/settings.js` — pure look data: presets, themes, defaults and the
  settings-version migration. No DOM, so selfcheck imports it directly.
- `src/graph-model.js` — pure: workspaces/sessions → nodes and links, the eight
  layouts (`placeFolder` / `placeDust` / `layoutGuides`), the sky-shell, field
  and drift grain sets, the filter syntax, the mobile node cap, shortest paths,
  camera basis and perspective projection. Deterministic: one FNV-1a hash with a
  murmur3 finaliser derives every random stream.
- `src/physics.js` — pure: the force layer behind the seven physics sliders,
  anchored to the analytic layout so the defaults settle on it.
- `src/stars.js` — the Galaxy View node recipe in Canvas 2D: the disc profile,
  plateau colours, halo alphas, the link tint, and the cached sprite bakers.
- `src/client.js` — React + Canvas 2D: the render loop (nebula haze → shell →
  dust → guides → links → stars → labels), pointer interaction, the dive tweens
  and the control panel.
- `src/warp.js` — the enter-the-star transition overlay.
- `src/styles.css` — the panel UI, the star interior glow and the back capsule.
- `scripts/build.mjs` — inlines the sources into `lib/client.js` inside
  `window.__ModuleLoader__.load({ id, factory })`, no bundler, and gates the
  output on `node --check`.
- `scripts/selfcheck.mjs` — geometry, camera, migration, i18n parity, packaging
  and bundle locks (4410 spiral dust grains, TDZ ordering, no `children` on the
  main slot, …).

### Renderer notes

- **Shell grains** are hard device-pixel squares covering the pixels a WebGL point
  would (centres within `size/2`), at fixed CSS sizes
  (1.2 / 2 / 3 px × *shell size*), drawn as one batched path per bucket in muted
  tints; nothing is allocated per grain and no gradient is created per frame.
- **Star bodies** are cached disc sprites baked at their exact device size with
  4×4 supersampling: a rim plateau at saturation 0.7 / lightness 0.66
  (red–orange deeper and more saturated) with the peak channel capped at 240,
  solid to 0.9 of the radius, a white mix that falls off as `0.75·(1 − r/rd)^2.4`
  from the centre (an emissive sphere, not a flat bead), and two fixed
  screen-space halos (σ 3 px and σ 10 px, the inner one at `0.6·min(1, (r/3)²)`).
- **Links** use `source-over` at one device pixel (1.5 on Retina, so they
  stay visible); the control point is the
  world midpoint pushed along its direction from the origin by
  `0.32 × curve × length` (membership) or `0.18 × curve` (lineage; *link curve*
  defaults to 0.35, 0 draws straight lines), with a perpendicular fallback near
  the origin; the tint is the mixed endpoint hue at the reference's `s × 0.4` on a light
  wire (`l 0.76`) at alpha 0.85 (lineage 0.95) for link opacity 0.14, scaled by the
  slider; each preset carries Galaxy View's link opacity (0.07–0.28).
- **Dust** on the spiral is exactly 4410 grains (3200 along the arms, 1100 in a
  diffuse disc, 110 faint grains at the core); the other layouts fill their own
  volume and are re-centred on their stars first.
- **Camera:** the overview distance is `fitDistance(shellRadius, fov) × 0.86`
  with `shellRadius = extent × 1.22`, and 回中心 / Reset use the same fit, so the
  rim is always fully framed.
- **Quality tiers:** low draws a third of the dust and half the stars at DPR 1,
  mid half the dust at DPR 2, high everything; auto steps down above 19 ms frame
  cost and back up below 14.5 ms, with 1.5 s of hysteresis. The HUD's `ms` is
  the real headroom (fps is capped by vsync).

Zero runtime dependencies: only the loader-provided `react` plus the existing
`ctx.slots / ctx.locale / ctx.sessions / ctx.workspaces / ctx.uiWorkspace / ctx.layout`.

## How it differs from Galaxy View (on purpose)

- Nodes are **workspaces / conversations**, not note files; edges are ownership
  and lineage, not `[[links]]`.
- The layout is **analytic** first (per-layout placement + jitter; same data
  always yields the same galaxy). The physics sliders drive a force layer on the
  main thread that is anchored to that layout, so the defaults keep the preset's
  silhouette and each slider bends it from there; it steps inside a ~4 ms budget
  per frame and sleeps once settled.
- The panel mirrors Galaxy View's sections but drives workspace/conversation
  data: sessions have no tags, so the tag lens became a status lens, and there are
  no unresolved links, ghost nodes or 2D-graph import.
- Workspaces are separate link components (a conversation links only to its own
  workspace), so *connect two* across workspaces flies through both suns.
- The node look is the reference recipe — soft-edged disc with a white-hot core
  and fixed halos — rebuilt as cached Canvas 2D sprites instead of a three.js
  point shader, so "threshold" trades the solid core against the halo rather than
  cutting a real luminance threshold.

## Publishing

The package is ready for the DSH community market; publishing itself is manual.
In order:

1. Create the public repo `dialling/dsh-galaxy-view` and push `main`.
2. Add the GitHub topic `dsh-plugin`.
3. `npm login`, then `npm publish` (`prepack` rebuilds and self-checks first).
4. Optionally cut a `v0.3.0` GitHub release.
5. Once the repo is at least a day old, open the market pull request against
   `awesome-dsh-plugin/awesome-dsh-plugin`.

The full checklist, the ready-to-paste market entry, and how to remove the
local dev mount before testing a market install are in
[PUBLISHING.md](PUBLISHING.md).

## License

MIT

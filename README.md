# dsh-graph-view · Starfield / galaxy view

Every workspace and conversation in DeepSeek Harness, drawn as a **three-dimensional
galaxy** inside a hollow shell of hard white dots: workspaces are suns on spiral
arms, conversations are small sharp stars orbiting them, and fork/subagent lineage
draws a thin filament. The camera orbits on its own; drag to take over, scroll to
dolly. Click a star and the view warps into that conversation or workspace; the
**回到星系 / Back to the galaxy** capsule brings you back out.

The visual direction follows Obsidian's [Galaxy View](https://community.obsidian.md/plugins/galaxy-view)
(a cinematic 3D graph in the NASA Eyes style): a near-black sky, a crisp dot sphere,
small cool-and-warm stars, and very thin, faint links.

![The galaxy view](docs/galaxy.png)

## The look

- **Sky shell.** One hollow sphere of dense, pixel-snapped **hard square dots**
  (2600 grains at 1.2 px, 900 at 2 px, 250 at 3 px, in five muted near-white
  tints), with a clean, readable rim and an even spread — no soft light blobs.
  780 field stars fill the interior so the disc never reads hollow. Dot sizes are
  fixed on screen and scale with the *shell size* slider.
- **Stars.** Small, sharp solid discs with a soft edge and a white-hot centre that
  never clips to pure white, plus a tiny fixed-pixel halo — conversations draw at
  2–5 px, workspaces at 2.4–4.6 px, so dense clusters stay separable. No dark
  outlines, no plastic glow.
- **Colour.** The default **Deep Field** theme alternates cool (cyan, blue-white)
  and warm (gold, orange) hues by workspace, so each spiral arm carries both.
  Its base is near-black (`#000003`); the other six themes (Hubble, Neon, Sunset,
  Cyber, Matrix, Aurora) keep their own palettes on the classic `#1c1c1c` base.
- **Links.** Very thin (one device pixel), very faint threads tinted by the mix of
  their two endpoint colours, desaturated and darkened. They bow gently away from
  the centre like the reference, and only real relationships are drawn:
  workspace→conversation membership and parent→child lineage.
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
| Rings 星环 | `rings` | four concentric orbits, nearly flat |
| Lattice 晶格 | `lattice` | a 3×3×3 rank and file with grid marks |
| Bubble 球壳 | `bubble` | a hollow shell with three great circles |
| Helix 双螺旋 | `helix` | two strands climbing 1.6 turns |
| Clusters 星团 | `clusters` | five tight blobs around the core |
| Plate 薄阵 | `plate` | a flat sheet, thickness 0.02 |
| Tree 星树 | `tree` | six radiating branches, deeper each step |

| Lattice | Rings | Tree |
| --- | --- | --- |
| ![Lattice](docs/appearance-lattice.png) | ![Rings](docs/appearance-rings.png) | ![Tree](docs/appearance-tree.png) |

## Reading the galaxy

| On screen | Meaning |
| --- | --- |
| coloured sun | one workspace; hue fixed by workspace order, dot grows with its conversation count |
| stars around a sun | that workspace's conversations; running ones pulse |
| faint thread | membership; fork / subagent to parent is a brighter bowed thread |
| drifting dust | arms and a diffuse disc — backdrop, not clickable |
| hard white dot sphere | the sky shell: a true 3D shell of points sharing the galaxy's camera |

The current session wears a white ring; archived stars are dimmer and only appear
with *Archived* on.

## Interaction

| Input | Result |
| --- | --- |
| drag | orbit, with inertia; auto-orbit resumes 1.6 s after release |
| scroll | dolly (`exp(deltaY × 0.0028)` per notch, clamped to 0.26–7×) |
| click a star or sun | dives the camera onto it (a conversation to 0.12× the overview distance in 980 ms, a workspace to 0.30× in 1150 ms) and opens a small card: title, path, time, state |
| **Open** / **进入工作区 (Enter workspace)** in the card | plays the warp transition into that conversation or workspace |
| double-click a star or sun | skips the card and warps straight in |
| click a row in a workspace card | flies the camera to that conversation and selects it (double-click the row to open) |
| `Tab` / `Shift+Tab` | walk the stars, card by card; `Enter` dives to or opens the current one |
| `Esc` | clear focus and selection |
| search | filter by title/path; matches get a ring and a caption |
| Archived / Reset / Re-roll | show archived / refit the camera / new seed and re-solve the galaxy |
| ☰ | collapse / expand the left control panel |

![Tracking a star](docs/tracked.png)

**The warp.** Entering a star first dives toward it in the live scene, then a
tunnel of fine points stretches into 1 px light trails and settles into a hollow
landing shell of hard squares in the star's own colour, revealed in a wave from
the centre outward with a halo pulse. The overlay waits for the target panel to
mount before fading, and a main-thread stall delays the phases instead of
skipping them. Inside the workspace or conversation you get a star-coloured
inner glow and the **回到星系 / Back to the galaxy** capsule, which plays a short
reverse warp back. With `prefers-reduced-motion`, a plain crossfade replaces the
flight.

![Warp transition](docs/warp.png)

Opening the starfield collapses the harness sidebar so the galaxy gets the whole
window; leaving it puts the sidebar back at the width it had. If you re-open the
sidebar while in the galaxy, it is left alone on exit.

## Control panel

Collapse it with ☰ in the page header; otherwise it stays docked left and scrolls.

| Section | Contents |
| --- | --- |
| Look | the eight preset cards — a preset is a whole parameter set (theme, bloom, backdrop, shell, arm shape, orbit speed) |
| Filter | one row per workspace with its colour and conversation count; click to hide, double-click to isolate; orphan and empty-workspace toggles; filter by name |
| Status | All / Running / Current / Subagents / Archived lenses; non-matches dim but stay clickable |
| Colour | the seven themes (Deep Field, Hubble, Neon, Sunset, Cyber, Matrix, Aurora) with a `customised / revert` marker |
| Deep space | nebula veil, shell density, shell size, shell brightness and cluster mist sliders plus a backdrop switch |
| Bloom | intensity, radius and threshold; double-click a label to restore the preset value |
| Shape | arms, twist, thickness, spread — re-solves the galaxy geometry |
| Navigation | auto-orbit switch and speed, wander (glides to recently active conversations), replay intro, reset everything, save as my preset (up to 8, in `localStorage`), and the saved list |
| Advanced | quality auto/high/low (low draws less dust and fewer stars at a lower DPR) and a live `fps · ms · stars · threads · quality` line |

Auto-orbit ships slow — one revolution takes about fifteen minutes — and the panel
scales it 0.2×–3×. Hovering a star parks the drift so the target cannot slip away.
Every setting persists in `localStorage`.

**Settings migration (upgrading to 0.2.0).** The look changed enough that old
visual settings would hide it, so settings carry a version. On the first load
after upgrading, the visual keys (preset, layout, theme, sliders, shape, orbit
speed, quality) reset once to the new defaults. Your filters are kept: hidden
workspaces, the isolated workspace, search text, status lens, the orphan and
empty toggles, and the auto-orbit/wander switches.

## Install

**From the DSH plugin market** (once published): search `dsh-graph-view`.

**From npm into a profile:**

```bash
cd "$DSH_HOME/profiles/web"
pnpm add dsh-graph-view        # or: npm install dsh-graph-view
```

`dsh.bundle.patch` inserts the loader row; restart the app (or reopen the window).

**Manual, from a local checkout (development):**

```bash
node scripts/install-into-profile.mjs                       # default web profile
node scripts/install-into-profile.mjs --profile PATH        # explicit profile
```

The script symlinks this package into `<profile>/node_modules/` and appends one
`insert` row to `<profile>/cordis.patch.yml` (backed up first, idempotent).

## Development

```bash
npm run check     # build (with a syntax gate) + selfcheck
```

- `src/settings.js` — pure look data: presets, themes, defaults and the
  settings-version migration. No DOM, so selfcheck imports it directly.
- `src/graph-model.js` — pure: workspaces/sessions → nodes and links, the eight
  layouts (`placeFolder` / `placeDust` / `layoutGuides`), the sky-shell and field
  grain sets, camera basis and perspective projection. Deterministic: one FNV-1a
  hash with a murmur3 finaliser derives every random stream.
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

- **Shell grains** are hard, device-pixel-snapped squares at fixed CSS sizes
  (1.2 / 2 / 3 px × *shell size*), drawn as one batched path per bucket in muted
  tints; nothing is allocated per grain and no gradient is created per frame.
- **Star bodies** are cached disc sprites baked at their exact device size with
  4×4 supersampling: plateau saturation 0.62 / lightness 0.75 with the peak
  channel capped at 235, a white-hot core within 0.36 of the radius, and two
  fixed screen-space halos (σ 3 px and σ 10 px, the inner one at
  `0.32·min(1, (r/3)²)`).
- **Links** use `source-over` at `lineWidth = 1/dpr`; the control point is the
  world midpoint pushed along its direction from the origin by
  `0.32 × 0.35 × length` (membership) or `0.18 × 0.35` (lineage), with a
  perpendicular fallback near the origin; the tint is the endpoint mix,
  desaturated (`s × 0.4`) and darkened (`l ≤ 0.35`).
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
- The layout is **analytic** (per-layout placement + jitter; same data always
  yields the same galaxy), so there is no force simulation and no worker to keep
  it smooth. The trade-off is that there are no live physics sliders.
- The panel mirrors Galaxy View's sections (presets, filter, status lens, colour,
  deep space, bloom, shape, navigation, advanced, stats) but drives
  workspace/conversation data: sessions have no tags, so the tag lens became a
  status lens, and there is no "connect two notes", so that slot became Wander.
- The node look is the reference recipe — soft-edged disc with a white-hot core
  and fixed halos — rebuilt as cached Canvas 2D sprites instead of a three.js
  point shader, so "threshold" trades the solid core against the halo rather than
  cutting a real luminance threshold.
- Always dark: this *is* the night sky.

## Publishing

The package is ready for the DSH community market; publishing itself is manual.
In order:

1. Create the public repo `dialling/dsh-graph-view` and push `main`.
2. Add the GitHub topic `dsh-plugin`.
3. `npm login`, then `npm publish` (`prepack` rebuilds and self-checks first).
4. Optionally cut a `v0.2.0` GitHub release.
5. Once the repo is at least a day old, open the market pull request against
   `awesome-dsh-plugin/awesome-dsh-plugin`.

The full checklist, the ready-to-paste market entry, and how to remove the
local dev mount before testing a market install are in
[PUBLISHING.md](PUBLISHING.md).

## License

MIT

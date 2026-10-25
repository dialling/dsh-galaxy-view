# dsh-graph-view · Starfield / galaxy view

Every workspace and conversation in DeepSeek Harness, drawn as a **three-dimensional
galaxy**: workspaces are haloed suns on spiral arms, conversations are stars orbiting
them, fork/subagent lineage draws a filament. The camera orbits on its own, drag to
take over, scroll to dolly. Click a star to open that conversation; click
**Original UI** to go back to the stock interface.

The visual direction follows Obsidian's [Galaxy View](https://community.obsidian.md/plugins/galaxy-view)
(the NASA Eyes style of cinematic 3D graph): deep-space backdrop, luminous nodes,
desaturated filaments, a slowly turning starfield.

![screenshot](docs/screenshot.png)

## What it adds to the stock UI

- One row in the sidebar panel list (**Starfield**), which opens the galaxy as a
  `main` panel.
- One button in the conversation header (**Stars**, next to the mode chip).
- **Original UI** inside the galaxy page = `layout.selectPanel(null)`.

Nothing else changes: the three-column frame, session list and chat renderer are the
stock ones.

## Reading the galaxy

| On screen | Meaning |
| --- | --- |
| haloed sun | one workspace; hue fixed by workspace order, halo grows with its conversation count |
| stars around a sun | that workspace's conversations; newer is brighter and bigger, running ones pulse |
| faint filament | membership; fork / subagent to parent is a brighter curved thread |
| warm core | galactic nucleus where the arms converge |
| drifting dust | spiral arms, diffuse disc and field stars — backdrop, not clickable |

The deep-space plane is Obsidian's dark-theme `--color-base-00: #1C1C1C` — canvas,
panel and header share the same black, so the view does not read as another app's
blue-black night sky.

Stars are a 1–2 px coloured core under a very faint halo, so dense clusters stay
separable instead of blooming into white; brightness, halo radius and threshold
are all adjustable and default to a restrained 0.5.

The current session wears a white ring; archived stars are dimmer and only appear
with *Archived* on.

## Interaction

| Input | Result |
| --- | --- |
| drag | orbit, with inertia; auto-orbit resumes 1.6 s after release |
| scroll | dolly (0.8–7×) |
| click a star or sun | opens a small card: title, path, time and state, with Open / Enter workspace |
| Open in the card | plays the enter-the-star transition first: the white shell of points stretches into accelerating light trails, settles into a hollow sphere in that star's colour, and the conversation comes up inside it |
| Open in the card | open that conversation and leave the galaxy |
| double-click a star or sun | skip the card and open directly |
| click a row in a workspace card | fly the camera to that conversation and select it (double-click the row to open) |
| `Tab` / `Shift+Tab` | walk the stars, card by card; `Enter` opens the current card |
| search | filter by title/path, matches get a ring and a caption |
| Archived / Reset / Re-roll | show archived / default camera / new seed and re-solve the disc |
| ☰ | collapse / expand the left control panel |

Opening the starfield collapses the harness sidebar so the galaxy gets the whole
window; leaving it (original UI, or clicking a star to open a conversation) puts it
back at the width it had. If you re-open the sidebar while in the galaxy, it is left
alone on exit.
| `Esc` | clear focus and selection |

Auto-orbit ships slow — one revolution takes about fifteen minutes — and the panel
scales it 0.2×–3×. Hovering a star parks the drift so the target cannot slip away.

## Control panel

Collapse it with ☰ in the page header; otherwise it stays docked left and scrolls.

| Section | Contents |
| --- | --- |
| Look | eight presets — Galaxy, Spiral, Orbits, Deep field, Nebula, Minimal, Fireworks, Supernova. A preset is a whole parameter set (palette, bloom, backdrop, arm shape, orbit speed) |
| Filter | one row per workspace with its colour and conversation count; click to hide, double-click to isolate; orphan and empty-workspace toggles; filter by name |
| Status | All / Running / Current / Subagents / Archived lenses; non-matches dim but stay clickable |
| Colour | six palettes (Hubble, Neon, Sunset, Cyber, Matrix, Aurora) with a `customised / revert` marker |
| Deep space | nebula veil, field stars and cluster mist sliders plus a backdrop switch |
| Bloom | intensity, radius and threshold; double-click a label to restore the preset value |
| Shape | arms, twist, thickness, spread — re-solves the galaxy geometry |
| Navigation | auto-orbit switch and speed, wander (glides to recently active conversations), replay intro, reset everything, save as my preset (up to 8, in `localStorage`), and the saved list |
| Advanced | quality auto/high/low (low draws less dust and field stars at a lower DPR) and a live `fps · stars · threads · quality` line |

Every setting persists in `localStorage`.

## Install

From the plugin market (once published): search `dsh-graph-view`.

Into a profile:

```bash
cd "$DSH_HOME/profiles/web"
pnpm add dsh-graph-view
```

`dsh.bundle.patch` inserts the loader row; restart the app (or reopen the window).

Local checkout (development):

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

- `src/graph-model.js` — pure: stores → stars and edges, arm seeding, camera basis and
  perspective projection, framing, neighbour index. Runs in Node, which is how
  `scripts/selfcheck.mjs` asserts determinism, disc thinness, everything in front of the
  camera, and that framing lands on screen.
- `src/client.js` — React + Canvas 2D: glow sprites, baked nebula backdrop, pointer
  interaction, tooltip. Additive blending (`globalCompositeOperation = "lighter"`)
  gives bloom without any post-processing pass.
- `src/styles.css` — two worlds: the header button (theme tokens) and the galaxy page
  (always deep space).
- `scripts/build.mjs` — wraps the three sources in
  `window.__ModuleLoader__.load({ id, factory })`, no bundler, and gates the output on
  `node --check` so a duplicate top-level `const` can never ship.

Zero runtime dependencies: only the loader-provided `react` plus the existing
`ctx.slots / ctx.locale / ctx.sessions / ctx.workspaces / ctx.uiWorkspace / ctx.layout`.

## How it differs from Galaxy View (on purpose)

- Nodes are **workspaces / conversations**, not note files; edges are ownership and
  lineage, not `[[links]]`.
- The layout is **analytic** (arms + jitter; same data always yields the same galaxy),
  so there is no force simulation and no worker to keep it smooth. The trade-off is that
  there are no live physics sliders.
- The panel mirrors Galaxy View's sections (presets, filter, status lens, colour, deep
  space, bloom, shape, navigation, advanced, stats) but drives workspace/conversation
  data: sessions have no tags, so the tag lens became a status lens, and there is no
  "connect two notes", so that slot became Wander.
- Bloom is additive canvas sprites rather than a post-processing pass, so "threshold"
  controls the ratio of halo to hard core, not a real luminance cut.
- Always dark: this *is* the night sky.

## Publishing

```bash
npm run prepack      # build + selfcheck
npm publish
```

`dsh.bundle.patch`, `dsh.client`, `files`, `keywords` and `repository` are set;
`locale/{zh,en}.json` carry the market-card copy.

## License

MIT

## Appearance presets: eight geometries

| Preset | Layout | Reads as |
| --- | --- | --- |
| Galaxy | `spiral` | the two-armed disc (Obsidian's galaxy view) |
| Rings | `rings` | four concentric orbits, no arms, nearly flat |
| Lattice | `lattice` | a 3×3×3 rank and file with grid marks |
| Bubble | `bubble` | a hollow shell with three great circles |
| Helix | `helix` | two strands climbing 1.6 turns |
| Clusters | `clusters` | five tight blobs around the core |
| Plate | `plate` | a flat sheet, thickness 0.02 |
| Tree | `tree` | six radiating branches, deeper each step |

A preset switches `layout`, not just numbers: `placeFolder(layout, …)` places the bodies, `placeDust(layout, …)` fills the same volume with haze (a cube, a shell, four annuli…), and `layoutGuides(layout)` draws the faint skeleton. Eight geometries, not eight twists of one.


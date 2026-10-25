# Changelog

## 0.2.0 — 2026-10-25

Visual retune to the Obsidian Galaxy view reference, plus release packaging for
the DSH community market.

- **Sky shell:** one hollow sphere of dense, pixel-snapped hard dots
  (2600/900/250 grains in three size classes) with a clean, readable rim and an
  even 6×6 distribution; 780 field stars inside it.
- **Stars:** small, sharp, solid disc sprites with fixed-pixel halos —
  conversations 2–5 px, workspaces 2.4–4.6 px — in a new default cyan/gold
  palette on a near-black plane. The six other themes are unchanged.
- **Links:** thin, faint, desaturated threads bowed like the reference
  (membership and fork lineage only), never additive.
- **Centre cleanup:** no central light ball anywhere, at rest or during a dive;
  core dust stays at 110 grains with halved alpha.
- **Composition:** stars fill the sphere instead of bunching at the centre in
  all eight layouts (银河, 星环, 晶格, 球壳, 双螺旋, 星团, 薄阵, 星树), and the
  overview fit always frames the whole shell.
- **Warp restore:** entering a workspace plays the stall-safe warp transition
  again (white point shell stretches into light trails, settles into a hollow
  sphere in the workspace's colour), and links bow along the reference curve.
- **Settings migration:** stored visual settings reset once to the new defaults
  (`settingsVersion`); filters — hidden workspaces, isolation, search text,
  lens, orphans, empty — are kept.
- **Packaging:** author `dialling`, repository/homepage/bugs at
  `github.com/dialling/dsh-graph-view`, peer dependency on
  `@deepseek-ai/cordis ^4.0.1`, `engines.dsh >=0.2.1-0 <0.3.0-0`, a package
  icon, `screenshots.json`, and the npm `files` list trimmed to the shipped
  runtime (about 0.3 MB instead of 2.8 MB).

## 0.1.0

Initial build: 3D galaxy graph for DeepSeek Harness — workspaces as suns on
spiral arms, conversations as stars, eight layouts, and one header button back
to the stock UI.

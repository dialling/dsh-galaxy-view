# Changelog

## 0.3.0 — 2026-10-26

- **Docs and interface languages.** `README.md` is now the **Chinese** readme GitHub shows
  first, with `README.en.md` for English and a `中文 · English` banner at the top of both
  (`README.zh.md` is gone; the npm tarball ships both). The galaxy gained a **中 / EN** button in
  its control row that flips the whole interface in one click — the panel's locale chip still
  offers 跟随 (follow the app). `selfcheck` now asserts the two dictionaries carry the same
  **237** keys and that no key is Chinese-only.
- **记忆库 reverted to the approved look; only movement was added.** The last three changes to
  the memory scene are undone — the 40 fps ticker with its idle camera drift, the per-body pulse,
  the breathing haze, the drag-time dpr 1 / caption skip, and the corner control row all go. What
  stays is the map exactly as approved (paint-on-demand at `dpr ≤ 2.5`, captions on) plus a way to
  look at it from anywhere: **shift-drag or right-drag slides the view** (the camera keeps its
  angle), **arrow keys** nudge it, **+/−** zoom a step (0.4–24), **R** recentres. A pan gesture no
  longer resolves as a click. The wider working tree (every other improvement from this session) is
  untouched — only `MemoryScene` changed.
- **New 高级 → GPU 星体 switch** (`gpuGlow`, on by default). Turning it off makes
  `glowLayerFor` return null, so the Canvas 2D sprites draw the bodies exactly as they did before
  the batched GPU pass existed. It exists to isolate a shader/GPU problem from a layout problem:
  if the picture comes back with it off, the fault is in `src/gpu.js`, not in the scene.
  `SETTINGS_VERSION` 16.
- **记忆库 has the star view's basic controls.** A control row in the corner (回中心 / ＋ / −) and the
  same keys: **R** recentre, **+** / **−** zoom a step, **Space** pause or resume the drift,
  **Esc** clear the selection. Drag, wheel, click-to-select, double-click-to-open and the hover tip
  were already there; `state.rest` gates the drift so Space really stops it, and the key listener
  is removed with the scene.
- **记忆库 drags with the pointer now.** The frame cost, not the event handling, was the lag: the
  map painted at `dpr ≤ 2.5` with captions on every frame. While a drag is live it renders at
  **dpr 1** (six times fewer pixels to fill) and skips the caption pass entirely, its ticker runs
  at **60 fps** instead of the idle 40, and `pointerup` marks the scene dirty so one full-detail
  repaint lands the moment the pointer is released. The idle drift still pauses during a drag.
- **搜索 brought up to the reference's behaviour.** Ours was a substring filter over the header
  box; the reference plugin (`src/view/SearchModal.ts`) matches *fuzzy* and shows the busiest
  stars when the box is empty. Both are in now: `fuzzyScore` scores a contiguous run highest
  (prefix 1.00, mid-string 0.60–0.90) and falls back to an in-order subsequence (a miss scores 0),
  a node takes the best of label / path / cwd, and results sort by score then by activity
  (`count + degree/2`). Opening the box lists the eight busiest stars as a 星座导览. Pinyin
  initials still do not match (no Latin letters in the haystack) — the reference behaves the same.
- **记忆库 有动效了.** The memory map painted on demand and sat perfectly still. It now runs a
  throttled ticker (~40 fps) that drives three things from one `state.clock`: the camera drifts
  on a slow orbit (`yaw += 0.06 rad/s`, paused while you drag), every body's halo pulses
  (`1 ± 0.18` on its own `hash01(id)` phase, so nothing blinks in unison) and the centre haze
  breathes (`0.16 × (1 ± 0.12)`). The ticker stops with the scene (`state.stopped`), and dragging
  still suspends the drift.
- **The locked ring is no longer a big white circle.** Both rings came down: 银河's selection ring
  `dot/2 + 3.5 → dot/2 + 1.5`, 记忆库's `dot × 2.4 → dot × 0.72 + 3` — it now hugs the body
  instead of floating a wide circle around it.
- **矩阵's links are 30% thinner.** 连线粗细 0.85 → **0.6**, i.e. the drawn width drops from
  ~0.94 CSS px to **0.66** (the 1.1 px base × 连线粗细), which suits the matrix theme's hairline
  web instead of reading as wires. `SETTINGS_VERSION` 15, and `LOOK_VARIANTS` now lets `minimal`
  own `linkWidth` the way `system` owns its bloom.
- **Fix: 太阳系's coloured cloud ghosts.** The cluster-cloud billboards (`createClusterClouds`)
  are baked from node positions once and cached on `{galaxy, theme, seed, shell, simEpoch}` — not
  on the clock. 太阳系 moves its planets (`orbitSystem`, 0.49 world units in 12 s on the fixture),
  so every baked cloud stayed behind where its planet had been: the "残留云雾". Animated layouts
  (`system`, `rings`, `sphere`) no longer bake clouds at all — they keep the nebula dome, which
  does not depend on node positions. 太阳系 also sets 集群云雾 to **0** and gains
  **星云天幕 0.2 → 0.3** so the picture still has depth without the ghosts.
  `SETTINGS_VERSION` 14.
- **No names in the overview.** The caption pass is gated on the same proximity factor the depth
  bands use: `labelFade = clamp((0.6 − overview) / 0.3, 0, 1)`, and the whole loop is skipped when
  it is 0. At the fitted distance nothing is labelled; names start at ~0.8× of the fitted distance
  (alpha 0.15), half strength at 0.75×, full from 0.6× inward — so the macro view is a clean star
  field and the names arrive when you zoom to read them.
- **方阵's 集群云雾 (cluster mist) is 0.37** (was 0.52) at the owner's request; every other
  preset keeps its own value (泰和 0.3, 星环 0.15, 浑天 0.34, 太阳系 0.32, 双螺旋 0.3, 矩阵 0,
  星树 0.552). `SETTINGS_VERSION` 13 so existing installs pick it up.
- **星树 radiates from one centre.** The old plan fanned the workspaces off a handful of
  "main limbs" (2·arms sectors, heaviest dealt round-robin), which read as a tree leaning on one
  side. Every workspace now gets **its own ray out of the origin**, spread over the sphere by the
  golden angle, and its conversations continue along that same ray: measured cosine between a
  conversation and its workspace direction **0.994**, suns at radius 0.39–0.76 (0.34 + 0.42·share,
  so a heavy limb reaches further), nothing closer to the middle than 0.39. `treeDirection` and
  `treeSectors` remain only as the fallback when a plan is missing.
- **极简 renamed to 浑天** (English: *Armillary*), because that is what it now draws — an
  armillary sphere of five same-radius rings, each turning in its own plane. The preset id
  stays `deepfield` (stored settings and `SETTINGS_VERSION` untouched); only the label, the
  subtitle (浑天仪 · 同心环各自旋转), the README tables and the source comments changed.
- **缩放倍率 is unbounded.** Both stops are gone: the far clamp (`fit × 7`, floor 22) and the
  near one (0.26) — the wheel multiplies freely in both directions, with a single `ZOOM_FLOOR`
  of 0.002 so a zero distance can never be reached (there is no view direction for it). At the
  extremes the scene behaves as the maths allows: past the near plane the bodies behind you drop
  out, and pulled far back the whole galaxy is a dot.
- **Fewer wires, same graph.** Two changes to *which* links are drawn. (1) A workspace wires at
  most **32** of its conversations (`SPOKE_CAP`, its newest); past that a sun drew eighty spokes
  and the view read as a starburst — every body still stays, and 聚焦 still reaches all of them.
  (2) `lineage` edges (a conversation to its parent) are marked `faint` and drawn **only when they
  touch the selection or the hover**: they cross the picture between distant stars and are
  context, not skeleton. On the 14-workspace / 244-conversation fixture the drawn set drops
  **298 → 224** edges, and the overview shows 162 spokes instead of 244.
- **辉光 turned down one notch everywhere.** `gleam` gain is `bloomStrength / 0.35`, so the
  shipped values move as follows: 银河/星环/双螺旋/矩阵/方阵/星树 0.5 → **0.38** (gain 1.43 → 1.09,
  ×0.76), 极简 0.42 → **0.34**, 太阳系 0.34 → **0.28** on top of its crowd fade. Both halo passes
  and the GPU shader read the same gain, so bodies, halos and the globe's glow all drop together;
  `SETTINGS_VERSION` 12 for existing installs. The 辉光强度 slider still runs 0–2, so anyone who
  wants the old brightness can pull it back to 0.5.
- **Fix: 太阳系's orange moon cluster burned into one white blob.** Additive halos stack, and the
  preset's shells put a dozen moons inside a few dozen pixels. Halos now share their light by
  screen cell (36 px): a body's glow is multiplied by `1 / (1 + 0.85·(n−1)^0.85)`, so a lone star
  keeps 1.00 while twelve in one cell sum to **1.59×** a single halo instead of 12× (forty:
  1.99×). The preset also gets its own calmer bloom — 辉光强度 0.5 → **0.34**, 阈值 0.22 → **0.3** —
  and `SETTINGS_VERSION` 11 pushes both to existing installs. `LOOK_KEYS` now lets `system` own
  those two keys instead of inheriting 银河's.
- **Bodies and halos now cost two GPU draw calls, not two per star.** This is the method the
  reference plugin (`longwind1984/galaxy-view`) uses — its `AggregateRenderer` keeps the whole
  scene under ten draw calls (`1×Points` for every node, `1×LineSegments` for every link,
  `3×Points` for the sky, bloom as a post pass), which is why a thousand nodes never stutter.
  Ours is the same idea without the three.js dependency: `src/gpu.js` is a hand-written WebGL2
  `POINTS` pass with the disc (white-hot core over the hue) and the gaussian halo living in the
  fragment shader — no sprite atlas, no per-body `drawImage`, no second additive pass. Per frame
  the page packs one interleaved vertex buffer and issues **one draw for bodies, one for
  halos**. Measured with a stubbed GL context: **1 200 bodies + 1 200 halos → 2 draw calls /
  2 400 vertices**, and a WebGL-less browser gets `null` from `createGlowLayer()`, leaving the
  Canvas 2D path untouched. A lost context disposes the layer and flags `glowFailed` so the
  fallback takes over instead of throwing.
- **The dive no longer stutters.** Four fixes, all measurable. (1) `discSprite` used to bake a
  4×4-supersampled bitmap for *every* 0.5 px diameter — up to 173 distinct sizes per hue once
  the ceiling went to 90 px. Bodies now bake on a **15-step ladder capped at 32 px** and draw at
  their own continuous size: a whole zoom sweep needs **15 bitmaps / 33 520 samples**, against
  38 416 samples for a *single* 96 px bake before. (2) Off-stage bodies and halos are skipped
  **before** the bake, so a close-up only touches what is on screen. (3) Halos whose alpha is
  under 0.004 and body lifts under 0.02 are no longer filled — they were invisible and still
  full-size. (4) `measureText` is cached per (weight, size, text) and the caption collision scan
  is capped at 240 boxes. Frame cost on the fixture: overview 1.50 ms, mid 1.47 ms, deep 0.72 ms.
- **Fix: the page threw on render, which is what the black screen was.** Two causes, both from
  my own edits: `GraphPanel` referenced `revealRef` / `enterRef`, which live in `run(ctx)`'s
  closure — a `ReferenceError` on first render; and a patch had cut
  `const nodeCap = qualityBudget(…)`, so the graph memo threw `nodeCap is not defined`. The page
  now receives the two refs through `inject({ sidebar })`, and `nodeCap` is back before the
  memo. Proven by mounting the panel under jsdom against the real bundle: **14 212 bytes of DOM,
  canvas present, zero render-time errors** (the same probe printed both ReferenceErrors before
  the fix). Gated: `GraphPanel` may not mention those refs except through `props.sidebar`.
- **Fix: a sidebar click dived but never entered, leaving a black pane.** The interceptor
  returned as soon as `focus()` succeeded, so the conversation was never opened and the harness
  panel stayed empty. It now dives **and** enters: `enterRef` (the page's `enterStar`) paints
  the star interior and opens the live conversation, so the click lands inside the starfield;
  the reveal-then-enter path runs the same sequence for a star that had to be unhidden first.
  If neither hook answers, the click still falls back to the stock opener rather than doing
  nothing.
- **日光模式 removed.** The `visual: "space" | "day"` setting, its two chips (深空模式 / 日光模式),
  the paper plane (`#f6f4ef`), the ink link styles, `STAR_DAY_LIGHTNESS` and every `day ? …`
  branch in the renderer (22 sites: backdrop fill, bloom gate, sky, haze, dust, guides, links,
  body lights, captions) are gone. Bodies, links and guides now have one material. The
  `.dgv-page-day` CSS rules, both i18n strings, `VISUALS` and the README/doc passages went with
  it; `SETTINGS_VERSION` 10 drops the stale key from stored settings.
- **A sidebar click stays in the galaxy even when the star is not drawn.** The interceptor
  used to give up (and open the stock session) whenever `focus()` said no — a workspace
  hidden by the filter, a 只看 pin on another workspace, 归档 off, or a star dropped by the
  node cap. Now it asks the page to *reveal* the star: the page unhides that workspace, drops
  the pin when it is not the pinned one, clears the name filter, turns 归档 on — whichever is
  hiding it — records the pending id, and the dive fires as soon as the rebuilt graph contains
  it (`controlsRef.current.focus(pending)`). Only a page with no scene at all falls through to
  the stock view.
- **极简 redesigned properly: an armillary sphere.** Not latitude bands — `SPHERE_CIRCLES = 5`
  rings of the *same* radius (1.0), each tilted into its own plane by its share of the golden
  angle, so their union is a ball and you see concentric circles from every direction. Bodies
  are dealt onto the rings by weight (85/68/57/48 on the standard fixture), seated evenly, and
  each ring turns **inside its own plane** (`orbitSphere`, alternating direction, 0.035 rad/s
  falling off with the ring index) instead of the whole globe rotating as one block. The
  skeleton is the five rings themselves. Measured: every body keeps its sphere radius exactly
  (`max |Δr| < 1e-6` after 5 s), all 258 bodies move, guides 5.
- **星体亮度 defaults to 0.5** (the neutral point of the gain curve: gain 1.00), in `DEFAULTS`
  and in all eight presets; the slider still runs to 2.4. `SETTINGS_VERSION` 8 so an existing
  install picks it up.
- **Bodies are fully opaque now.** `globalAlpha` for the body draw is a hard `1` — the fade
  for a selection (`0.92 / 0.82`), the 状态透镜 (`0.32`), the reveal wave and the far band's
  `0.42` no longer touch a body's opacity; every band is carried by **colour** instead (the
  far band still halves its lightness, 亮度 still darkens it, the lens still dims the links).
  The additive pass keeps `min(1, lift)` so 亮度's upper half still adds light without ever
  making a body translucent. Gated: the bundle must draw with
  `globalAlpha = 1; drawImage(spriteImage(sprite.canvas), …)` and must not contain
  `bodyAlpha * bandAlpha` or `bodyAlpha * Math.min(1, bodyGain)`.
- **Perf: the shell glow was quadratic.** Building the halo list per frame and then calling
  `bright.includes(grain)` inside the same loop meant **500 × 500 = 250 000 array scans every
  frame** (500 is the largest grain class) on top of the sprite draws — the stutter. The pass
  now walks the bucket ranges directly through one `drawGlow` closure: **250 000 → 0**
  comparisons, one allocation fewer per link (`fadeChannels` tints in place), and no temporary
  array per frame.
- **Fix: body size stopped following the zoom past 24 px.** `base` clamped at 24 px for a
  workspace and 15 for a conversation, so in 太阳系 (and anywhere else) a planet stopped
  growing once you pushed in — no perspective. The ceilings are now **90 / 60 px**, which
  keeps the fitted view exactly as it was (9.8 px at scale 200) and lets a close-up grow:
  22.1 px at scale 450, 31.4 at 640, 63.8 at 1300, 88.4 at 1800. The floors (7 / 4 px) are
  unchanged, so nothing becomes sub-pixel.
- **The depth bands are a close-up device now.** In the main view (`cam.distance / fit` ≥ 1)
  every body keeps `prox = 1`, so nothing is dimmed by distance and the overview stays at full
  light; the near/mid/far shading fades in as you dive (overview factor 0.78 at 0.9×, 0.44 at
  0.75×, 0 below 0.55× of the fitted distance). Measured: a far body's `prox` is 1.00 at the
  overview and < 0.2 once the camera is at 0.4×, and a selection still forces its own band.
- **The owner's picked pair leads the palette.** Sampled from their screenshot, the two
  dominant body colours are **teal-cyan ≈180°** and **amber-gold ≈36°** (measured mean
  rgb(151,215,219) and rgb(226,201,142) on the bright pixels). Both are now slots **0 and 1**
  of the 银河 theme (and of the workspace hue ring `HUES`), so the first workspaces in every
  view wear them: slot 0 renders rgb(134,234,234), slot 1 rgb(238,190,119). The rest of the
  palette is unchanged, and every theme keeps `hues.length === tones.length`.
- **星环: rings are dealt by weight, centred on the origin, and drawn as real orbits.**
  Three things were wrong. The ring a workspace landed on came from `index % 4`, so one ring
  carried **157** bodies while the outermost had **7** — that is the "外环没有星体". The
  layout was also passed through the re-centring pass (which exists for lopsided shapes), so
  the bodies sat off the origin while the guide circles stayed on it, and an evenly seated
  pair of workspaces per ring now fills the circle (covered sectors per ring: 8/8, 7/8, 6/8,
  7/8). Measured on a 14-workspace / 244-conversation fixture: ring populations
  **20/157/74/7 → 85/68/57/48**, every ring on its own radius (spread < 0.12), and the
  orbits themselves are drawn at 0.9 alpha / 1.6 px so the rings read as rings instead of
  vanishing under the shell.
- **The zoom-out limit is wider.** `maxDistance` went from `fit × 4.5` (floor 14) to
  **`fit × 7` (floor 22)**: on the settled fixture that is 14 → **22**, so the wheel can pull
  back about 1.6× further and the whole body shrinks to a small disc. The near limit (0.26)
  is untouched.
- **球壳辉光 redone as a per-grain bloom.** Blurring the whole shell into a quarter-size
  layer and laying it back turned the sky into a grey smear. The blur pass is gone: the
  largest class of grains (all tints) and the twinkler now get one soft halo sprite each,
  under their squares, `0.12 × 球壳辉光 × shellGlow` at `SKY_HALO_RADIUS + 辉光扩散` px. The
  grains stay crisp, the glow stays soft, and the two sliders still drive it
  (球壳辉光 to 2 doubles the halo alpha, 辉光扩散 up to 6 px widens it).
- **球壳辉光 is adjustable.** Two new settings with sliders under 深空背景: **球壳辉光**
  (`shellBloom`, 0–2, default 0.5) sets the bloom's strength — 0 turns it off — and
  **辉光扩散** (`shellBloomBlur`, 0–6 px, default 1.5) sets the blur radius. Both are in
  `DEFAULTS` and in all eight presets, so 还原 restores the shipped 0.5 / 1.5.
- **球壳辉光: the whole sky shell blooms now, not just its brightest grains.** After the shell
  and the inner field are painted, the same grains are drawn once into a quarter-size layer
  and laid back over the sky at `0.5 × shellAlpha × shellGlow` with a 1.5 px blur and
  `lighter`. One small extra pass plus one upscaled draw — far cheaper than a halo sprite per
  grain, and it scales with 球壳亮度, so turning that slider to 0 removes it.
- **Fix: a selected body in the back of the view was drawn as a dark star.** The bands are
  depth-based, so a selection that happened to be far from the camera fell into the far band
  (0.42 alpha, ×0.5 lightness) and read as "not highlighted". The selected body, the locked
  one and their neighbours are now forced into the **near** band whatever their depth, the
  locked body scales 1.3 (hot 1.34, neighbour 1.15), and the ring also shows for the tracked
  body. Measured: the same far body at alpha **1.00 / light 9.05** when locked against
  **0.42 / 4.29** when not.
- **近景 shading: three depth bands, on bodies, glow and threads.** Each projected body now
  carries `prox` (1 = closest to the camera) normalised over the frame's depth range, and a
  band is picked from it: **near** (≥0.66) keeps the hot core at full colour and the full
  bloom; **mid** (0.33–0.66) becomes a *pure white core* (`1.0`) on a slightly dimmer rim
  (`STAR_LIGHTNESS × 0.86`) with 55% of the glow; **far** (<0.33) drops to `× 0.5` lightness,
  0.42 body alpha and 18% of the glow, so the distant sky goes dark. A thread is tinted by the
  same bands (×1 / ×0.72 / ×0.42), which lands a far link in its own colour bucket — the link
  batching is untouched. Measured on the fixture: `prox` spans 0.00 → 1.00, body light
  9.44 (near) against 4.65 (the same frame with the far band applied).
- **Captions scale with their body, not with a fixed size.** At 9 px they read as too large in
  the wide shot (small dots) and right in a close-up, so the size is now `0.72 × dot`
  clamped 6.5–10 px: a 6–8 px star gets 6.5 px of text, a 12 px star 8.6, a 16 px star 10, and
  a zoomed body stays at 10. Verified at draw time — the canvas receives
  `500 6.5px ui-sans-serif …` in the overview frame.
- **Captions down to 9 px** (`CAPTION_PX`, 10 px for the focus cluster) at the owner's
  request; verified at draw time — the canvas receives `500 9px ui-sans-serif …`. One constant
  now governs it.
- **Fix: 星环 span faster the longer the view stayed open.** `orbitRings` read its base angle
  off the body's *live* position and added `time · speed` to it, so every frame folded the
  whole clock into the angle again — the ring compounded and accelerated without bound (which
  is why it read as "1/5 of a circle per second" on screen while the constant said 108 s per
  lap). The placed angle is now stored once (`node.ringAngle`) and the angle is
  `base + time · speed`: measured **3.25°/s at 1 s and 3.25°/s at 20 s** — one speed,
  ~111 s per lap. Gated in `selfcheck` with a fixture of its own, since `createGalaxy`
  reuses node objects.
- **星体亮度 defaults to 1.2, and the slider now runs to 2.4.** `BRIGHTNESS_MAX` (shared by
  the slider and the gain curve) replaces the old hard 1.6 ceiling; every preset's default
  `brightness` is 1.2 (`brightnessGain` 1.84, against 1.14 at the old 0.62). Measured body
  light on the fixture: **10.6 at 1.2** (8.42 at 0.62, 5.81 at 0), and the top of the range
  reaches gain 3.28. `SETTINGS_VERSION` 7 makes existing installs pick it up.
- **Fix: captions were drawn twice too large on a Retina display.** The caption font was
  `10.5 * dprNow`, but the scene context already carries `setTransform(dpr, …)`, so the size
  was applied twice (21 px on a 2× display). It is `10.5` CSS px again, with 11.5 px for the
  focus cluster, matching the rest of the plugin's text.
- **Fix: the revert left three undefined identifiers, so every frame threw.** The restored
  caption pass referenced `ordered` and `searchHits` (the memory-era pass it replaced never
  had them) and the body push referenced `hueBucket`, which had been renamed to
  `dustHueBucket` — `ReferenceError` on the first frame, caught by the renderer's
  "frame failed, retrying next frame" guard, which is why the canvas stayed empty. All three
  are fixed and a frame now renders: 15 bodies, body light 8.42 at the default 亮度 (the
  pre-excursion value), 10 halos at 63 px, body widths 6.0–16.0 px.
- **The memory-library excursion is reverted: bodies and links are the galaxy's own again.**
  Everything from that stretch is gone — `BODY_DOT_SCALE`, `BODY_HALO_ALPHA`, the fixed
  0.462 halo, the 0.8/0.45 cores, the "no light at the default 亮度" rule, the ring at
  `dot·2.4`, the captions beside the body, the `memory` mass table — and the renderer is back
  on its measured parameters: sizes `base(7–24 / 4–15) · STAR_SCALE · √starMass · 节点大小`
  with the 1.34 / 1.15 emphasis, cores `lit ? 1 : 0.92` on `STAR_LIGHTNESS · bodyDim`, the
  additive core pass (`BODY_CORE_LIFT` 0.42), the bloom halos (`innerHaloAlpha`, 阈值 gate,
  2.6× focus, outer halo 0.022) blended with `lighten`, the body fades 0.92 / 0.82, the 1 px
  detached ring at `dot/2 + 3.5`, the 10.5 px caption under the body and the 15° hue bucket.
- **Every preset looks like 银河, and keeps its own sky.** `brightness`, `bloomStrength`,
  `bloom`, `threshold`, `nodeSize`, `linkWidth`, `linkOpacity`, `linkBrightness`, `linkCurve`
  and `twinkle` are 银河's in all eight presets (极简 keeps its own documented look); the
  `veil` / `mist` / `dust` / `fieldStars` / `backdrop` values are each preset's own again.
  `SETTINGS_VERSION` 6 makes an existing install pick this up.
- **极简 is a layout again, not the memory scene.** The `MemoryScene` mount, its stage CSS,
  the `wantsMemory` state and both converters (`memoryGraphToGalaxy`,
  `galaxyGraphToMemoryMap`) are deleted; 极简 draws with the galaxy renderer in the `memory`
  layout — workspaces on the three arms (0.54–1.01), conversations on the 0.05 / 0.085 rings
  (max 0.052), no dust, no guides.
- **Bodies 1.5× larger.** `BODY_DOT_SCALE` 300 → **450** (both renderers read the same
  constant, so 星空 and 记忆库 grow together): a workspace with four conversations is now
  **15.8 px** (was 10.5), twelve conversations 19.6 px, and a conversation dot stays 4 px.
  Halos and the selection ring follow the dot, so their proportions are unchanged.
- **Why an existing install kept looking different: stored settings.** Presets changed but
  the stored values win, so `fieldStars: 0.25 / dust / mist / veil / backdrop: true` stayed on
  screen. `SETTINGS_VERSION` is now **5** and `DEFAULTS` carries the bare sky as well, so the
  upgrade resets every non-preserved key and an existing install finally shows what the code
  draws. A workspace's mass is the memory library's table verbatim
  (`0.34 + 0.66·√(children/12)`), so a workspace with four conversations and a skill with four
  calls are both **10.54 px** — measured from the screenshots: body centre 194–230, glow ring
  matching once the crop stops including a neighbour dot.
- **The body scale is pinned, and every preset's sky is bare.** Screenshotted both views in
  headless Chrome (real canvas, same fixture: one workspace, four conversations) and the
  remaining difference was never the body: it was the **sky shell**. With the live
  projection scale, the galaxy's wide shot put every body on the 2.6 px floor while the
  memory map's tight framing drew 8–20 px ones — so `BODY_DOT_SCALE = 300` now fixes the
  scale in **both** renderers (a workspace and a skill of equal mass are the same px:
  5.13 / 7.11 / 8.55 / 11.25 / 13.05 for mass 0.12 / 0.34 / 0.5 / 0.8 / 1.0). Every preset
  also ships `fieldStars: 0, dust: 0, mist: 0, veil: 0, backdrop: false`, so the thousands
  of white shell grains that read as "different stars" are gone and the background is the
  memory library's bare black. The 星海 / 云雾 sliders still bring them back.
  Screenshots: `docs/shot-memory.png`, `docs/shot-galaxy.png`, zoomed body pair
  `docs/body-pixels.png`.
- **The periphery matches 记忆库 too, not just the sprite.** Everything the table marked as
  different is now the memory library's value:
  **dot** `max(1.6, rest)` with a single ×1.25 while hot (rest was 1.34×, neighbours 1.4×,
  hot 1.5×), and `rest` itself now uses the memory mass — a workspace's
  `0.34 + 0.66·√(count/16)`, a conversation `0.12` — instead of starMass;
  **body alpha** 1 always, with only the halo taking the selection's ×0.3 (the 0.82/0.92
  body fades are gone; 状态透镜 still fades its excluded bodies at 0.32, on purpose);
  **the additive brightness pass is deleted** — `BODY_CORE_LIFT`/`BODY_GAIN_LIFT` with it —
  so 星体亮度 no longer touches a body at all (measured: body width 6.0–16.0 px and body
  light 6.524 identical at 亮度 0 / 0.62, where it used to move them);
  **ring** `dot·2.4`, 1.2 px, rgba(235,242,255,0.85) at 0.85, only while hot;
  **captions** 11 px beside the body at `x + dot + 6`, 0.5 alpha (0.95 hot), 24-character
  truncation — 记忆库's rule, not the galaxy's below-the-body 10.5 px.
- **Every body is drawn highlighted, not just the clicked one.** The owner's read was right:
  only the hovered/selected body got the emphasis boost (1.34×) and everything else was
  drawn at 1×, so an untouched star looked softer and fainter than a chosen one. The rest
  state now carries **1.34×**, a focused neighbour 1.4× and the hovered/selected body 1.5×
  — measured body widths 5.0–16.0 → **6.0–21.0 px** with the same sprites, so the picture
  keeps the memory library's material and gains the highlighted size. A console handle
  `__dgvDumpBodies()` now reports what each body actually drew (`dot`, `hue`, dim `level`,
  `lens`) so a real frame can be compared against these numbers instead of guessed at.
- **The two body pipelines are now the same code path.** Three differences were left in how
  a body is *drawn*, not in what it looks like on paper: the galaxy **bucketed the hue to
  15°** (`hueBucket`) so a 183° body rendered at 180° — rgb(134,229,234) against the memory
  library's rgb(134,234,234); it drew the disc with **`source-over`** where 记忆库 uses
  **`lighter`**, so the disc replaced its own glow instead of adding to it; and the sprite
  call differed in three arguments (min diameter, `tone`, `lightness`). All three are gone:
  the body uses the palette's exact hue, blends with `lighter`, and calls
  `discSprite(hue, max(4, round(dot·dpr·2)/2), core, bodyLightnessNow, null)` with
  `bodyLightnessNow = undefined` at the default 亮度 — verified **byte-identical** baked
  pixels for the same body (8 px, core 0.8: alphaSum 50, mean luminance 0.794, max alpha
  255 in both). Bucketing survives only for the dust specks.
- **The body *style* is the memory library's — same sprite, same call.** The remaining
  differences between a 记忆库 body and a star body were in the call itself, not the colour:
  the galaxy capped the smallest body at **1 px** (记忆库 never draws under **4**), passed
  the theme's `tone` (记忆库 passes `null`), and passed an explicit lightness where 记忆库
  passes `undefined`. All three now match:
  `discSprite(hue, max(4, round(dot·dpr·2)/2), core, bodyLightnessNow, null)` with
  `bodyLightnessNow = undefined` at the default 亮度 — so the two renderers share the *same
  cached sprite*, not two lookalikes (verified: `starPlateau(hue)` and
  `starPlateau(hue, 0.72)` produce the same rgb, and the core of a workspace body is
  rgb(222,243,243) in both). Satellites are now 4–4.6 px, matching a memory call dot.
  亮度 below the default still darkens the body's colour; above it, the additive pass adds
  light. Layout, links and the sky stay the preset's own — this is the body style only.
- **The body design is 极简's, all of it — not just the core colour.** The previous pass only
  moved the core whiteness and the standing light, which is a subtle change and invisible in
  极简 itself (that preset is drawn by the memory scene). The remaining differences are gone
  too, so every preset now draws a body the way the memory library does:
  **sizes** `scale·0.03·(0.45+mass)` clamped 2.6–22 px for a workspace and `scale·0.0075`
  clamped 1–4.6 px for a conversation (the old rule was `base·√mass` up to 24 px);
  **glow** one inner halo per carrier at the fixed **0.462** on `max(8, dot·6)` px, and
  none at all around a conversation (the old bloom used `innerHaloAlpha`, a mass gate, a
  running pulse, a 2.6× focus multiplier and an outer halo). Measured on the fixture: 11
  bodies at 5.0–16.0 px with 16 px halos, body light 3.69 at the default brightness.
  Halos therefore no longer follow 辉光强度 / 辉光范围 / 阈值 and a focused body no longer
  brightens its own glow — the selection ring still marks it.
- **Every preset now draws its bodies with 极简's material.** The galaxy renderer used a
  near-white 0.92 (selected 1.0) core plus a standing additive light pass; 极简's memory
  recipe is a 0.8 core for a carrier and 0.45 for a satellite on the same plateau
  lightness, with no extra light at the default 星体亮度. That recipe is now what
  `renderScene` uses for **all** presets: core rgb(222,243,243) / 0.928 luminance for a
  workspace and rgb(184,237,239) / 0.868 for a conversation (was 0.951), and the body
  light at the default brightness drops 8.42 → **6.01** — the same amount 极简 carries. The
  slider still works above neutral (`max(0, gain − 1)` drives the additive pass: 5.6 / 6.01
  / 8.66 / 10.6 at 亮度 0 / 0.62 / 1 / 1.6). Halos, sizes, selection emphasis and the
  presets themselves are untouched — this is the body material only. The settled-look gate
  moves with it (core 0.8 / 0.45, no standing lift), since the owner asked for the change.
- **极简 keeps the memory library's look, but shows the galaxy's content again.** The
  style stays exactly as it is — the preset still renders with the memory library's own
  `MemoryScene` — while the bodies are **workspaces and conversations** again, mapped into
  the memory map's two levels by `galaxyGraphToMemoryMap`: a workspace becomes an arm body
  (ranked by its conversation count and dealt round-robin across three arms), each
  conversation a satellite on the library's 0.05 / 0.085 rings (sixteen to a ring), and
  the core stays empty. No memory-library RPC is involved any more (`memory.list` is back to
  one call site: the memory page's own loader). The picture sits in the middle of the
  stage: the arms are built around the origin the camera aims at, and centring on the mean
  position was deliberately *not* done — the arms hold unequal numbers of bodies, so the
  mean would drag the disc off-centre (measured bbox centre 0.14, −0.00 on the
  fifteen-workspace fixture). Verified: 15 workspaces / 242 conversations → 15 arm bodies
  at radius 0.56–0.96, satellites within 0.34, extent 1.01, one `.dgv-mem-canvas` and no
  `.dgv-canvas`.
- **极简 now *is* the memory library, not a copy of it.** Copying the data and the
  positions was not enough: the two pictures were drawn by different renderers, so the
  body sizes, the palette mapping, the haze, the labels and the camera framing all drifted.
  The preset now mounts the memory library's **own `MemoryScene`** in the galaxy stage
  (`.dgv-mem-stage-galaxy`), fed the same `buildMemoryGraph` output — same component, same
  data, same camera, so the two pictures cannot diverge. Verified in the mounted panel:
  under 极简 there is exactly one `.dgv-mem-canvas` and **no** `.dgv-canvas`.
- **The wordmark no longer sits under the host's plugin icon.** The band was measured by
  scanning `button`/`[role=button]`/`a`; the host draws its plugin button as an **svg inside
  a div**, so the scan never saw it and the inset stayed at 112 — leaving that icon on top
  of the `M` in `memory`. The band is now found by **hit testing**
  (`document.elementsFromPoint` across the strip) with an `svg`-aware tag scan as the
  fallback, and the cap rises to 160 so the measured clearance is honoured. Verified with
  the icon stubbed at 118–146: inset **154** at mount (16 px earlier it was 112), and it
  stays 154 when the chrome leaves.
- **极简 is now a literal copy of the memory library.** It used to re-derive a "memory-like"
  arrangement from the workspace graph; it now draws the memory library's own data —
  `memoryGraphToGalaxy(buildMemoryGraph({docs, skills, calls}))` — with **the memory map's
  exact positions** (verified: max drift 0.00e+0 against the source map, after only the
  uniform re-centre and scale), the same bodies (instruction files, skills, every call as
  its own star), the same call links, the same per-body hues, and no dust. A skill or file
  becomes a `folder` and a call a `session` of that folder, so selection, tracking, labels
  and the link tiers all keep working. The graph is marked `fromMemory`, which tells
  `createGalaxy` to keep the given positions instead of running a galaxy layout over them.
  The preset's search, legend, header stats and loading state follow the memory data, so
  they no longer report the workspace counts while the memory library is on screen.
- **The corner holds the wordmark and nothing else.** The unexplained glyph button at the
  top-left was our own 控制栏 (panel) toggle — a bare `☰` with no label, so it read as a
  mysterious plus. It is now a labelled **控制栏** chip in the tool row beside 搜索 / 记忆库,
  with `aria-pressed`, and the header's corner renders no button at all.
- **Top-left inset actually clears this app's window buttons.** The previous fix assumed the
  stock macOS light band (16–70 of the viewport); this app hides its title bar, so its three
  lights sit around 50–105 and the ☰ still landed on them. The band is now the larger of a
  112 px macOS floor and the *measured* reach of any host button in that strip (+8), with a
  hard **124 px cap** so the wordmark cannot slide towards the middle, and the measured
  reach never shrinks (a button appearing or leaving cannot shift it twice). Verified with
  the host band stubbed at 20–110: inset **118 px** at mount and 118 px after the buttons
  left.
- **极简 now follows 记忆库's actual rule.** It was built as "workspaces in the core,
  conversations on three arms", which is the *wrong two levels*: the memory library keeps
  instruction files in the core and **skills on the arms with their own calls ringed
  around them**, and its links are 0.05–0.09 long satellites, not spokes. Measured on the
  old build: links up to **1.18**, workspace radial 0.15–0.28 (all in the core), 5600 dust
  grains. Rebuilt as the same two ranks: workspaces ride the arms (0.54–1.01, ranked by
  conversation count, dealt round-robin across three), each workspace's conversations sit
  on the memory map's **exact call rings** — 16 to a ring, rings at 0.05 and 0.085, the
  same 0.07 spacing outward for the workspaces bigger than the memory map ever draws —
  the core stays empty and there is **no dust**. Now: links median 0.05 / max 0.09, the
  same as the memory library's, and the ring radii measured 0.050/0.051/0.052 against its
  0.050–0.052.
- **星环 turns at half speed.** `RING_ORBIT` 0.03 → **0.015**: the innermost ring laps in
  about 124 s instead of 57 s (outer 130 s), and a body sweeps 0.58 rad in 10 s instead of
  1.16.
- **记忆库's body glow +10%**, at the owner's request: the halo alpha goes 0.3 → **0.33**
  for an instruction file and 0.42 → **0.462** for a skill, both exactly ×1.1. Nothing else
  in the settled memory look moved (the gate now pins the raised pair instead of the old
  one, so the next change still has to be asked for).
- **星环 became a helix of coloured rings.** Three changes, all in that preset. It draws
  **no links** (`showLinks: false` on the preset, so the 连线 button shows it off too).
  Each ring takes its **own palette slot** — ring 0…3 read 265 / 208 / 158 / 28 on the
  sunset palette — and the ring *circles* are tinted to match, the same slot their bodies
  take. And every body **travels along its ring in a double helix**: `orbitRings()` keeps
  the radius fixed (measured r 0.4567 at t = 0 / 2 / 6 s), advances the angle (θ −0.02 →
  0.59 rad in 6 s) and weaves ±0.05 above and below the line on two half-a-twist-apart
  strands. The radial scatter at placement drops to ±0.01 so bodies hug the line, and the
  motion is a pure function of the clock — rewinding puts every ring back.
- **极简 is now the 记忆库's picture, and 矩阵 is the old 极简.** The 深空场 slot
  (`deepfield`) keeps its id — stored settings still land on it — but its layout is the new
  `memory`: conversations ranked by activity and dealt round-robin across **three arms**
  (0.49–1.03 of the disc, arms 81/81/80 on the fifteen-workspace fixture), workspaces
  holding the **warm core** (0.17–0.30) the way the memory library's instruction files do,
  no skeleton, no sky shell, centre mist on, thin bright links — the memory map's own
  recipe. The preset that used to be called 极简 (`minimal`, the matrix look) is **矩阵**
  now. 记忆库 itself is untouched and its look is **settled**: the canvas carries the
  owner-approved note, and `scripts/selfcheck.mjs` pins `MEMORY_ARMS` 3, `MEMORY_SWIRL` 2.2,
  `MEMORY_DOTS` 16, both hue tables, the haze alpha 0.16, the opaque-body line and the
  three sprite calls — a restyle fails the gate instead of sliding through.
- **星空 ⇄ 记忆库 now connect.** Switching views replaced one screen with another in a
  single frame. The outgoing view's last frame is now frozen (`canvas.toDataURL`) into an
  overlay that dissolves — full opacity to 0 with a 1.02 scale — over the incoming view
  for 500 ms, so the switch reads as one surface changing. It costs one snapshot and no
  second animation loop (keeping both views mounted for a CSS cross-fade would double
  the per-frame work); a tainted canvas falls back to the plain switch, and
  `prefers-reduced-motion` collapses the dissolve to 1 ms. Verified both directions:
  galaxy → memory dissolves `dgv-canvas` while the memory view is already mounted, and
  back dissolves `dgv-mem-canvas`; the overlay clears afterwards and the target view is
  alive.
- **Every body is opaque.** The disc held alpha to 96% of its radius and then ramped;
  亮度 multiplied that alpha (as low as 0.1), which is what still made a star look
  see-through. The material is now full alpha across the whole disc with a 2%
  antialiased edge (opaque coverage 96% → **98%**), the base pass draws at
  `min(1, bodyAlpha)` with no brightness factor, and 亮度's low end instead **darkens the
  body's own colour** (`STAR_LIGHTNESS × bodyDim`, neutral from 0.5 up, so the settled
  look is unchanged) and scales the additive light pass. Measured: body alpha sum is 7.7
  at 亮度 0, 0.5 and 1 alike — the bodies no longer thin out. The memory map draws every
  body at alpha 1 as well: depth is carried by size, and a selection takes the *halo* away
  from the rest of the map instead of making those stars translucent. Semantic fades still
  fade (状态透镜, archived, the reveal wave) — those are deliberate states, not material.
- **WASD 平飞 removed.** The owner does not want it: the key set, the `state.keys` /
  `state.shift` bookkeeping, the `flyByKeys` stepper and its `stepScene` call are gone, and
  the hint no longer advertises it (`拖拽旋转 · 滚轮推拉 · 点击星体选中，双击进入`). `F`
  (focus the selection) and `R` (back to the overview) stay — `F`/`R`/`Escape` are the only
  keys the view binds now. The selfcheck fails if `flyByKeys`, `state.keys` or the string
  `WASD` ever comes back.
- **聚焦 reads as a subject.** Three fixes on the same complaint. The tooltip no longer
  survives a click — a card and a cursor tip describing the same body overlapped, so the
  tip is suppressed while a card is open (verified: tip up before the click, absent with
  the card). The card itself now anchors on the *stage centre* while a body is tracked:
  the dive lands the body in the middle, so a card placed against the click point ended
  up over it (verified: body at 500,350 after the dive, card at 596,290, no overlap 3/3).
  And the focus lights its own cluster: the focused star's halo ×2.6 and its direct
  neighbours ×1.5 (halo light 2.79 → 4.03, +44%), their bodies 1.34× / 1.15×, the links
  touching the focus at 1.6× width and full alpha, and those stars get **bold labels at
  full opacity** whatever the depth fade says (labels drawn 1 → 3).
- **Bodies are solid, with a small white-hot core.** The disc was opaque to 94% of its
  radius with a 6% ramp, and the white mix spread across the whole face (`(1 − d/0.5)^1.8`),
  so a body read as a bleached blob with a glassy edge. It is now opaque to **96%** (a 4%
  ramp), and the white is confined to the **inner quarter of the radius**
  (`smoothstep(0.17, 0.01, d)` against the radius), fading into the body's own colour from
  there: measured on the 183° palette, centre rgb(235,246,244) → 24% out rgb(157,233,236)
  → beyond 32% the plateau rgb(134,229,234), all at alpha 1. White covers 22% of the radius
  (the owner asked for about 25%) and 96% of the disc is fully opaque. Mean area luminance
  0.747 → 0.718, i.e. the star is not brighter — the white simply moved into a smaller
  core. Every number of this look stays under the settled gate in `scripts/selfcheck.mjs`.
- **右上角不再挤在一起.** The tool row (`搜索 / 记忆库 / 连线 / 归档 / 复位 / 重排 /
  原版界面`) was a plain flex row: with 12 px Chinese labels the chips hit their
  min-content width, could not shrink, and overflowed each other at the right edge. The
  row now wraps (`flex-wrap: wrap`, `row-gap`) and every chip is `flex: 0 0 auto`, while
  the search field gives way first (`width: clamp(130px, 17vw, 210px)`).
- **连线暗一档.** The wire's OKLab lightness drops 0.84 → 0.81 (measured rgb(203,224,226)
  → rgb(193,218,220)) and the resting class alpha 1 → 0.9, so the threads sit under the
  stars instead of competing with them. The shipped defaults follow (0.22 → 0.19
  opacity, 1.15 → 1.05 brightness).
- **星体亮度 is settled.** The owner approved this exact look, so the numbers are pinned
  as a gate rather than kept as a taste: `STAR_LIGHTNESS` 0.72, `STAR_PEAK` 250, core
  white mix 0.92 / 1, `BODY_CORE_LIFT` 0.42, the disc profile, and `brightnessGain`
  (exactly 1.0 at 亮度 0.5, 2.32 at the top) — all asserted in `scripts/selfcheck.mjs`
  under a comment that says asking first beats retuning. `brightnessGain` moved into
  `src/stars.js` beside the constants it scales so the gate can import it.
- **聚焦 is a close-up that then orbits.** The dive stopped at 12% of the overview distance
  for a conversation and 30% for a workspace; it now comes to **6% / 17%** — measured
  3.64 → 0.22 units, a 16.7× zoom, with the subject held exactly centred. And a focused
  body is orbited: the camera turns around it at 0.046 rad/s (one lap in 2.3 min) from the
  moment the glide lands, independent of 自动环绕 (that switch is about the overview) and of
  the 1.6 s idle gate — so the cluster reads in the round instead of from one fixed angle.
- **Matched to the reference image: white-hot bodies, bright bowed wires.**
  星体: the core white mix goes 0.75 → 0.92 (lit 0.9 → 1), so a body's centre lands at
  rgb(235,245,244) / 0.949 luminance instead of a coloured plate; the bloom is wider and
  stronger — halo sigma 3→3.4 and 10→11, radii 12→14 and 28→34, inner alpha 0.6→0.72,
  辉光强度 0.35→0.5 and 辉光范围 0.44→0.58. 连线: the wire is near-white now (L 0.76 →
  0.84, measured rgb(203,224,226) on the cyan palette instead of 177,209,211), thinner
  (0.85), brighter (0.22 opacity, 连线亮度 1.15) and visibly bowed (连线弯曲 0.35 → 0.72),
  which is what the reference's arcs are. `SETTINGS_VERSION` goes to 4 so the shipped
  look actually reaches stored settings — filters, selection, language and panel width
  survive, the visual keys reset once (the preset returns to 银河).
- **记忆库's map is drawn like the galaxy instead of like a scatter plot.** Bodies were
  flat `arc` discs in one flat `hsl` with hard 3× halos, and — worse — every skill without
  a known `source` (which is most of them) fell back to a single cyan `198`, so the whole
  map came out one colour. Skills now take their hue from the 哈勃深空 palette keyed on
  their id through FNV-1a (`hash01` folds neighbouring strings, so `…-0`, `…-1` landed in
  the same slot: 22 of 30 skills shared one hue; now 9 hues, largest share 5 of 30).
  The bodies are the same baked star sprites the star view uses — `discSprite` for the
  body, `haloSprite` for the bloom, a `hazeSprite` nebula behind the core so the disc has
  a centre of gravity — and the links are tinted from both endpoints like the galaxy's.
  Instruction files stay warm and bright, skills carry their own hue, calls are small
  flat sparks that do not bloom.
- **Star bodies read solid, not like glass.** Three things made them look transparent:
  the plateau was the reference's L 0.66, the rim faded over the last 10% of the radius,
  and the white core was narrow. The plateau is L 0.72 with the peak channel at 250 (was
  240), the rim ramps over 6% instead of 10%, and the white mix falls off as
  `(1 − d/0.5)^1.8` instead of `^2.4`. Measured on the disc itself (area-weighted luminance
  over the sprite, 8 theme hues): fully opaque pixels 91% → 95%, mean luminance 0.685 →
  0.747, and the darkest hue (15°) 0.536 → 0.609. The selfcheck's plateau band moved with
  it (L ≤ 0.76, centre ≤ 252) so the check still states the calibration instead of being
  loosened around it.
- **The wordmark is back in the corner.** The header reserved the reach of every host
  button in the top-left band (`measured reach + 10`), which came out around 120 px and
  pushed `galaxy` towards the middle. It now keeps the content at a fixed 88 px from the
  *window's* left edge — clear of the three traffic lights (~16–70) and nothing else — and
  falls back to the 16 px padding where there are none (the web GUI), with three platform
  signals so an embedded browser cannot miss the Mac. Being a fixed band rather than a
  measurement, folding the sidebar cannot slide it either: measured 88 px at mount and
  88 px after the host's buttons came and went.
- **The star card steps around its star.** It was placed `left: click + 18`, `top: click − 24`,
  i.e. squarely on the body it describes (and while tracking, only 84 px aside from a
  centred star). Four candidate spots are tried — right, left, below, above, each with a
  30 px gap (96 px while tracking) — and the first that fits inside the stage wins, with
  clamping as the last resort. Verified over six stars: none covered, cards landing 30 px
  to the side.
- **Brighter bodies, smaller stars where they were wrong.** 星体亮度 already drives the
  body's light, but the standing lift was too small: it is 0.42 of the body's own alpha
  now, so the same frame carries 7.7 body alpha (was 5.6 before any lift) while links
  stay put. 太阳系 body size drops 0.9 → 0.62 and its moon shells grow (radius capped by
  1.6× the orbit gap, up to 0.14 instead of 0.72× / 0.075) — 0.054 → 0.086 in the
  fifteen-workspace fixture — so a cluster reads as a shell of small stars rather than a
  tight blob. 极简 goes the other way: 0.55 → 0.8, its dots were too small to read.
- **太阳系 is a system, not a plate.** Three things were still flat. Each planet's
  conversations now sit on a small *spherical shell* around it (golden-spiral directions,
  two shells), so a cluster reads as a 星壳 from any camera angle instead of a disc seen
  edge-on. The sun's own grains are a ball too (`cbrt` volume, spherical lift) rather
  than a 0.03-thick slab, and the zodiacal band stays the only flat part. And the system
  revolves: `orbitSystem()` recomputes every body from its stored polar coordinates and
  the scene clock — planets at ω ∝ r^-1.5 (inner laps in 40 s, outer in 249 s at the
  fixture's 0.30–1.02 orbits), moons around their planet at 2.6× their planet's pace —
  never integrating, so rewinding the clock reproduces the galaxy exactly and a
  throttled frame cannot drift it. Moon shell radii stay constant while they circle
  (measured over 9 s).
- **星环 shows its rings.** The guide skeleton was drawn at one faint weight for every
  layout, which left 星环's four orbits invisible. Structure that *is* the silhouette now
  carries its own weight: 星环 0.52 at 1.1 px, 方阵 0.42, 太阳系 0.34, the rest unchanged
  at 0.2.
- **Free 360° orbit.** Pitch was locked to 0.08–1.45 rad (≈5°–83°) because the camera
  basis took `right = cross(forward, worldUp)`: that cross product collapses to zero when
  the camera looks straight up or down, so the view flipped or broke at the poles. Both
  axes are now written out from yaw and pitch (`right = (cosYaw, 0, −sinYaw)`,
  `up = (−sinPitch·sinYaw, cosPitch, −sinPitch·cosYaw)`) — identical inside the old band,
  exact everywhere else. Pitch wraps instead of clamping, so a drag keeps turning: over
  the top, the scene rolls with the camera and keeps going. Verified at 0 / 45 / 89 / 90 /
  91 / 135 / 180 / −90 / −170°: every axis finite and unit length, all three pairs
  orthogonal to 1e-9, and stars still project. The memory map keeps its own gentle band —
  it is a flat constellation, not the galaxy.
- **巡游 glides smoothly.** Three separate causes of the stutter-and-jump:
  the glide's progress was measured on `state.time`, a scene clock that advances by the
  *clamped* frame delta — so on a slow frame the move slowed down and then stepped
  further per frame (measured mid-glide: 1896 ms of wall clock, 1056 ms of scene clock,
  a 44% disagreement), while the wall clock is what the eye sees. Every camera glide is
  now stamped with `performance.now()` and eased against it. The three following eases
  (`tracking`, the 回中心 glide, the dolly) used `min(1, seconds * k)`, which closes half
  the remaining gap in one 64 ms frame; they are `1 - exp(-seconds * k)` now, the same
  smoothing at any frame length. And 巡游 no longer lights each stop through the
  selection spotlight: the tour used to dim every other star and filter the links at
  every stop, re-diming the whole sky every few seconds. Sampled over 9 s of tour: 234
  gliding frames, worst step 4.3× the median (the cubic ease's own ends), zero
  teleport-sized jumps, and the glide clock reads wall time 1:1.
- **A click can no longer freeze the rotation.** The cruise only runs while
  `state.drag === null`, and a drag was cleared solely by the canvas's own pointerup —
  so any gesture that ended elsewhere (released over the panel or a card, cancelled by
  the browser for a trackpad gesture, or a window that lost focus mid-press) left the
  drag set and the camera parked until the next press. The scene now nets
  `pointerup`, `pointercancel` and `blur` on the window, clearing a live gesture
  without resolving a click (the canvas still does that). Measured: baseline cruise
  0.0152 rad per 700 ms; press-and-release-off-canvas now leaves `drag === null` and
  the same 0.015 turn; a drag deliberately left hanging still turns 0.00000 rad in
  600 ms, which is the bug reproduced.
- **星树 is one limb per workspace.** The layout had 6–14 equal spokes and dropped
  every conversation on a *random* spoke at a random radius, so each branch was a
  hairline of one star width (0.012–0.047 units) and the sky between spokes stayed
  empty. Now the tree has a few main limbs (`2 × 旋臂数`, evenly spaced in azimuth and
  stratified in height — golden-angle azimuths on four limbs left one horizontal axis
  long and the tree leaning), dealt the workspaces **by mass**, heaviest first; every
  workspace is then its own limb, fanned ±0.5 rad off its main limb, with its sun
  partway out (0.38–0.70 by mass) and its conversations running to the tip at 1.05 in a
  tube that widens with radius (0.03 + 0.085·r, i.e. 2.4× the old width at the rim),
  a third of them taking a twig. Haze follows the same limbs. Measured on the fixture
  with two giant workspaces (78 and 103 conversations): rms spread 0.51 / 0.49 / 0.48
  across x/y/z (was 0.62 / 0.27 / 0.55 — the tree leaned), extent 1.08–1.12, and 15
  limbs instead of 8 spokes.
- **星体亮度 now moves a body's light, not just its opacity.** A star disc is baked at
  `STAR_PEAK` (240) already, so scaling alpha saturates at 1 and every star kept the
  brightness it had — which is what made the slider feel tied to 连线亮度. Each body now
  gets a standing additive core pass (0.2 of its own alpha) plus the slider's own lift
  above 1, so the same frame carries body light 2.1 → 6.6 → 9.6 → 10.6 across
  星体亮度 0 / 0.5 / 1 / 1.6 while the link strokes stay at exactly 4.0 for every value,
  and 连线亮度 leaves the bodies untouched (both measured). No coupling in the code: the
  ceiling was in the baked sprite.
- **状态透镜 now dims stars, not just links.** The lens reused the selection's dim
  level, and that level only steps bodies back to 0.82 (the reference's deep floor
  would black out everything around a selected conversation) — while a dimmed link
  class drops to 0.45. So clicking 运行中 / 子智能体 visibly changed the *links* and left
  the bodies alone: measured on a six-star frame, links went to 0.45× and star discs to
  0.82×. The lens now fades its excluded bodies on its own factor (0.32) — same frame,
  star disc alpha sum 5.6 → 2.2 with the excluded discs capped at 0.32, halos −68%,
  and the matching star still at 1. A selection keeps its gentle 0.82, so picking a
  star still leaves the sky readable.
- **双螺旋 splits its strands by stars, not by workspaces.** Alternating workspaces
  between the two strands (`index % 2`) balanced the *workspaces* and nothing else: with
  one workspace holding forty conversations and a dozen holding one, one strand ended up
  with most of the sky. A strand plan now weighs each workspace by its star count
  (itself plus its conversations), assigns heaviest-first to the lighter strand, and then
  spreads that strand's workspaces evenly along its own length. On a realistic spread
  (41 / 22 / 14 / 9 / 6 / 4 / 3 / 2 / 2 / 1 / 1 / 1 / 0 / 0 / 0 conversations) the two
  strands now carry 60 / 58 stars — 3.3% apart, and 60/58 is as close as an integral
  split of 118 gets — where alternating would have produced a lopsided helix. Both
  strands run the full height (t 0.08..0.92) instead of one of them bunching at the
  bottom. Workspaces are exposed on the node as `strand` and `t`, so the balance is
  checkable.
- **The landing shell is flown into, not faded in behind.** The warp drew the shell at
  a fixed `0.44 × min(width, height)` with a straight orthographic projection, so it sat
  inside the frame as a flat disc of dots — a background — and then handed over to an
  interior room that was 2.4× wider, which read as a second shell appearing. It now
  starts as a ball you approach (`0.30 × min`) and grows to the interior's own room
  (`0.52 × the diagonal`) as it reveals, with a perspective divide (front dots ×1.72,
  back ×0.70, fading to 0 as it wraps) so the near face has depth instead of a flat
  disc. Dot size, spin rate and alpha converge on the interior's values too, so the
  final landing frame is dot-for-dot identical to the first room frame — measured: 1700
  dots, identical positions/sizes/alpha, mean radius 445 → 1499 px while wrapping.
- **球壳 is now 太阳系 / Solar system.** A new `system` layout: a warm sun of dust at the
  centre, then one planet per workspace, each on its own nested orbit between 0.30
  and 1.02 units, phased by the golden angle so no two line up, with a few hundredths
  of inclination so it reads as 3D. Every planet is circled by its own conversations
  as moons in a thin disc on two shells — the disc is capped at 72% of the orbit gap,
  so with fifteen workspaces (0.05 apart) the moons stay inside their own planet's
  patch instead of smearing into the next orbit. Guide lines are the orbit rings
  themselves, one per planet. The preset uses a new `solar` palette (Mercury grey-warm,
  Earth blue, Mars rust, Saturn gold, Uranus cyan, Neptune blue…) with a sunlit nucleus,
  zodiacal dust at 0.34 and no force simulation — orbits that physics would spiral into
  the sun. A stored 球壳 migrates to 太阳系.
- **晶格 is now Obsidian's 深空场 / Deep field.** The 晶格 preset and its `lattice`
  layout are gone; the slot carries the reference's unstructured deep-field look
  instead. A new `field` layout scatters workspaces through a wide ball — golden-angle
  azimuths with stratified depth keep them even, a cube-root radius keeps the volume
  evenly filled — and each workspace is a small 3D cluster of its own conversations at
  its own depth. No guides at all: the scatter *is* the silhouette. The preset
  (theme 哈勃深空, 节点大小 0.9, 辉光强度 0.22 over a wide 0.55 radius, 阈值 0.34,
  空间浮星 0.55, hairline links at 0.6 px / 0.08 opacity, 环绕速度 0.18) sits far and
  dim, the way a deep field should. The force simulation is off for this layout, so
  the field stays a field instead of collapsing into a blob. A stored 晶格 (preset or
  layout) migrates to 深空场, and an unknown stored layout now falls back to the
  default instead of silently drawing the disc.
- **The room you enter is even.** The landing shell stayed on behind the workspace as
  the *landing* shell: three dot sizes (1.2 / 2 / 3 px), a depth-shaded alpha (0.16 →
  0.41), and a radius of `0.44 × min(width, height)`, so its rim sat inside the frame
  — a speckled ball floating in black margins. Measured on a 1600×900 / dpr 2 window,
  the dot cloud covered 100% / 88% of the frame with 3 distinct sizes and a 2.5×
  alpha swing. It is now a room: the sphere is `0.52 × the diagonal` (rim outside the
  frame at every aspect ratio), every dot is one size (1.4 CSS px, snapped to device
  pixels), and two layers turn at different rates at a constant alpha each (0.3 /
  0.18) with the drift halved to keep the sweep slow. Measured again: one size, two
  alphas, 119% × 212% coverage. The rim glow's outer stop also starts later and stays
  weaker (0.2 → 0.14 from 62%), so the dots keep one colour from the middle to the
  edges.
- **The sky shell is now a sphere around the body, not around the camera.** Every
  grain was offset by `cam.target`, so the shell travelled with the camera: diving
  into a conversation kept the same wall of dots dead centre, exactly like a
  background image. Grains now sit at their own world position, so a dive moves the
  camera *through* the sphere — the grain cloud swings off centre (500,350 → −395,−120
  in a 1000×700 frame) and its mean distance from the centre jumps 229 → 1494 px,
  with real parallax while orbiting inside. The focus pull that dimmed the shell on a
  dive was softened to match (0.72 floor instead of 0.5), since you are now inside it
  rather than in front of it.
- **The galaxy wordmark no longer jumps on open.** The header's left inset was
  measured in a passive effect, i.e. after the first paint, so the title and its
  star mark landed at 16 px and then slid right to 120 px once the host's window
  buttons were measured. The measurement now runs in the commit's layout phase
  (`useLayoutEffect`), so it is already in the first painted frame; the measured
  host reach is also kept monotone, so a sidebar button appearing or leaving later
  cannot shift the header a second time. The published `--dgv-head-h` (which the
  control panel and overlays clear) lands in the same commit, so nothing else
  settles a frame late either.
- **外观切换的衔接动画.** Clicking a preset card (or applying one of your own, or
  restoring the preset's own values) used to snap: theme, bloom, shell and layout all
  changed inside one frame. The frame that is on screen is now kept and dissolved out
  over 560 ms with a symmetric ease while the incoming look's stars grow out of the
  core, so a switch reads as a cut between two skies rather than a flicker. Only a
  real change dissolves — re-clicking the active preset, hovering a card for its live
  preview and dragging a slider stay immediate.
- **星体亮度 no longer moves the links.** 亮度 was multiplied into the resting link
  fade, so dimming the stars dimmed every thread with them. Links keep only 连线亮度
  (and 链接透明度); the star gain now touches bodies and their rings alone. Above 1
  the extra light is a second additive pass at full strength instead of a 0.6 whisper,
  so the slider reads across its whole range.
- **辉光范围 actually changes the glow.** The halos are baked gaussians: drawing one
  larger spread the same light thinner, which is why the radius slider looked dead.
  The span now carries an area gain (span², normalised to the shipped default, capped
  at 2.6×), so a wider 辉光范围 is bigger *and* brighter and a narrower one tightens
  into a small hot glow.
- **阈值 now gates each body.** It was a single multiplier on every halo. It is a
  per-body gate on the body's own mass (the quantity 大小依据 already uses, so it is
  zoom-independent): at 0 everything blooms, at 0.4 only the bigger half, at 0.6 the
  suns, at 1 nothing — measured 1745 → 1243 → 378 → 53 → 0 halo flux across the
  slider.
- **记忆库 / Memory library:** a second view behind the same panel (header switch,
  remembered across reloads). It maps what shapes the agent rather than what it
  said: instruction files as gold bodies in the core, skills as cyan bodies on the
  arms sized by how often they were called, and one small star per skill call
  circling the skill it loaded. Left list with instructions / skills / calls tabs
  and a filter; the selected body's metadata below it; a right-hand editor that
  reads and writes the real file (`⌘S` saves, a file changed since it was opened
  comes back as a conflict with *reload* / *overwrite*, app-bundled files stay
  read-only). Discovery walks the DSH home, `~/.agents`, per-workspace skill roots,
  vendor and extension roots plus the host's skill registry; call history comes out
  of every session log, `.jsonl` and appended-frame `.zstd` alike, cached per file
  so a re-read only decodes the frames that were appended.
- **One authenticated RPC channel** (`/dsh-graph-view`) carries the browser half's
  four endpoints, `memory.list`, `memory.calls`, `memory.read`, `memory.write`. It
  rides the host's own connection adapter when present (envelope validation,
  Host/Origin fence, correlated responses) and falls back to a bare HTTP route on
  an older host. Only files discovery itself returned can be read or written, writes
  go through a sibling temp file, and the editor's base timestamp turns a silent
  overwrite into a `conflict`.
- **60 fps again:** the haze pass set `imageSmoothingQuality = "high"`, and canvas
  state outlives the frame, so every later sprite draw (halos, bodies, sky
  sparks) ran a bicubic resample on the GPU. With haze or bloom on, frames took
  50–100 ms. The quality is now pinned to bilinear each frame; all eight presets
  hold 60 fps at 2× DPR in testing. Baked sprites are also drawn from
  ImageBitmaps (uploaded to the GPU once), and opaque link classes stroke
  straight onto the frame without an offscreen layer.
- **极简 matched to Galaxy View's Minimal:** an open, shallow web that fills the
  volume evenly (conversations sit most of the way from their sun to a random
  spot of the body), small light yellow-green dots (节点大小 0.55, 矩阵 hues
  98–112°), a faint glow only on the bigger suns (辉光强度 0.2), and hairline
  green links (#5a9a40, width 0.4, opacity 0.1, 连线亮度 1.4).
- **连线亮度 slider:** lifts link colours towards white (above 1) or darkens
  them (below 1) in OKLab, keeping their hue, for 跟随星色 gradients and
  custom colours alike (0.3–2.5, default 1). 连线粗细 now goes down to 0.2.
- **Gradient links:** with 跟随星色, each link shades from one star's colour
  into the other's (S ×0.8; fuller and lighter when selected), instead of one
  pale mixed tint. Each end keeps its star's hue at one shared OKLCH
  lightness (0.74, selected 0.84) with chroma capped at 0.07 (selected 0.095),
  so cyan and gold links are no brighter or more saturated than violet, blue
  and red ones. Links are also thicker (about 1.1 CSS px, 2.2
  device px on Retina) and more opaque (alpha 1 at the default link opacity).
  A custom link colour and daylight mode keep solid links.
- **Even link brightness:** resting links stroke into an offscreen layer with
  "lighten" and land on the frame once per class, so dense bundles and
  crossings are no brighter than a lone link. Links of dimmed stars (a status
  lens, a focused workspace) keep alpha 0.45 instead of 0.25.
- **Snappier zoom:** each wheel notch is stronger (`exp(deltaY × 0.0065)`) and
  the camera catches up in about 70 ms instead of 170 ms.
- **Star size:** bodies draw at 0.935× the measured Obsidian size at 节点大小 1
  (15% smaller, then 10% back up).
- **Wider sliders:** 球壳密度 now runs 0–2 (near-empty up to twice the old
  densest shell; the presets look the same) and 亮度 0.02–1.6 (much darker up to
  an additive over-bright).
- **Tinted shell grains:** the shell's dots are mostly cool white, silver and
  pale blue, with a few faint rose and ivory grains and a rare (about 4%) pale
  warm one, instead of near-white grey. Warm drift and deep-sky stars are rarer
  and paler too.
- **Deep sky follows 空间浮星:** at 0 it is gone, and its density follows the
  slider (full from 0.5). The 星空背景 switch still hides it entirely.

- **Zoom out further, stars all around:** the wheel now pulls back to about
  4.5× the overview (was a fixed 7), and a new deep-sky layer of 2600
  direction-only stars surrounds the view at any zoom. It is faint at the
  overview and fills in as you pull back, so a small distant galaxy still sits
  in a starfield instead of black. The drifting field stars also spread through
  a wider volume (3.2× the galaxy, up to 2000 points). Both follow the starfield
  switch.

- **Wordmark:** the header's star icon and 星空视图 / Starfield title give way
  to a lowercase italic serif "galaxy" filled with a slowly drifting nebula
  gradient (still at reduced motion; ink gradient in day mode).
- **Transparent header:** the page header no longer draws a strip of its own.
  It floats over the starfield, empty header space passes drags to the canvas,
  and on macOS it still steps clear of the window buttons. The panel, banners
  and star card keep below it.
- **Wander speed only sets the dwell:** 巡游速度 / tour speed now changes how
  long each stop is held (5 s at 1×); the flight between stops always takes
  2.6 s. Connect-two hops work the same way.
- **New intro:** the galaxy unfolds out of the core in a radial wave, as in
  Galaxy View: inner stars first, each easing out over the last 45% of 2.6 s,
  with links, dust, guides and cluster mist riding the same wave. The sky
  shell trails it: it condenses inward from 0.7× its radius while its grains
  fill in at random, so the sphere sparkles into place instead of popping in.
- **No work while out of sight:** the frame loop skips painting while the tab
  is hidden or the view sits mounted but undisplayed under another host page.
  A live plugin reload stops the previous bundle's frame loop.
- **Dust lanes you can see:** the 尘埃带 slider now scales grain brightness and
  size and adds a soft glow pass, so it reads from a faint haze to a dense band.
- **极简 / Minimal replaces 星团:** one lumpy ball of dots in a single green
  family, straight thicker links, no glow, no backdrop. A stored 星团 setting
  becomes 极简.
- **方阵 / Cube replaces 薄阵:** a solid cube. Every star sits on one lattice,
  each workspace fills its own block, and the twelve edges are drawn. The
  force simulation is off for this layout so the grid stays exact.
- **3D 星树:** branches radiate in every direction instead of lying in a plane.
- **Stronger cluster mist**, and a hollow dotted shell behind the page once you
  are inside a star.

- **Faster wheel zoom:** each wheel step is 1.5× stronger (`exp(deltaY × 0.0042)`)
  and steps from the pending target, so quick scrolling adds up instead of
  being eaten by the easing.
- **Link controls:** a 连线 / Links button in the header shows or hides the
  links, and a new 连线 panel section sets link width (0.5–4×), opacity, curve
  (now up to 2) and colour (star colours, four swatches or a colour picker).
  Clicking a conversation keeps only its own neighbourhood's links, whether the
  links are on or off; unrelated links are no longer drawn faintly.
- **Bigger, brighter stars:** at overview distance conversation bodies draw at
  4–9 px and workspace suns at 7–16 px (up from 2–5 px and 2.4–4.6 px), growing
  to 15 px and 24 px close up; the click target grows with them. Bodies are
  opaque to 0.9 of the radius with a crisp edge and glow from a hot centre to a
  saturated rim (S 0.7 / L 0.66) instead of reading as flat plastic beads, with
  a stronger rim halo, matching a close-up Obsidian Galaxy View capture.
  Selecting a star dims the rest only to 82–92%.
- **Visible links:** links are bright wires in the mixed endpoint colour at
  Galaxy View's 0.4× saturation (lightness 0.76, alpha 0.85, lineage 0.95 at
  the default link opacity) and 1.5 device px wide on Retina screens, where the old
  one-device-pixel threads all but vanished. Each preset now carries Galaxy
  View's link opacity (银河 0.14, 星环 0.11, 晶格 0.07, 球壳 0.2, 双螺旋 0.16,
  极简 0.16, 方阵 0.08, 星树 0.28).
- **Tour fixed:** the tour no longer slides the whole overview toward random
  stale points. Each leg glides to one of the nearest recently active
  conversations (pulling back mid-flight on long hops), holds it centred, then
  moves on; clicking, key flight, search or 复位 stops it and the button follows.
  复位 no longer snaps the orbit centre before its glide.
- **Obsidian colours:** the default 深空 theme is now Galaxy View's 哈勃深空
  palette (cyan, gold, blue, rust, green, cream, violet, pink, silver) with
  per-slot tones so cream and silver stay pale, and palette slots go by
  conversation count, so the biggest workspaces take the first colours.
- **Shimmering sky:** shell grains fill exactly the pixels a WebGL point of
  their size would, so they pop between 1 and 2 px as the camera moves, the
  shimmer of the reference sky. Auto-orbit now cruises at the reference rate
  (0.022 rad/s at the default speed).
- **Draggable star card:** drag the info card by any part that isn't a button
  to move it out of the way.
- **Pure black space:** every theme now sits on a pure `#000000` background, and
  the screen-space haze and colour veils are gone. The new daylight mode is the
  only light background.
- **Brighter stars and links:** core dust defaults to off, hovering no longer
  dims the rest of the sky, faded stars keep more of their light, and link
  threads use a brighter tint.
- **Sidebar clicks stay in the galaxy:** opening a conversation from the
  sidebar while the star view is showing flies the camera to that star instead
  of leaving the galaxy.
- **Obsidian panel controls:** a real force simulation with seven sliders
  (center pull, repel, link strength, link distance, and more), node size and size-by,
  link opacity and curve, twinkle, drifting stars, starfield, nebula and dust
  toggles, bloom, deep-space/daylight visual modes, a mobile quality tier, and
  colour shuffle.
- **Navigation:** header search with a result dropdown that flies to the
  chosen star, filter syntax and a node cap, "connect two" route highlighting
  (falls back through both suns across workspaces), keyboard flight
  (WASD/QE, Shift to speed up, F to fit, R to reset), cruise breathing, and
  tour speed.
- **Panel features:** per-section "set by preset / customised" badges with
  restore, preset hover preview, my-preset rename, reorder and delete
  confirmation, a language switch, a help card, a resizable panel, and slider
  default notches (double-click to reset).
- **Settings migration:** stored settings move to `settingsVersion` 3 with the
  new keys filled from the defaults.

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

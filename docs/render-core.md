# 渲染核心抽取：星空视图的全部绘制规则

这份文档把 `dsh-graph-view` 的渲染层从插件里**单独抽出来**写成可实现规格：坐标系、相机、每一层的算法与常量、帧循环顺序、质量分级，以及换成 WebGL 时要补什么。目标读者是要重建这套画面的人（或模型），不需要读原插件代码。

参考实现（Obsidian Galaxy view）的逆向证据在 `docs/reverse-galaxy-view.md`。

---

## 1. 坐标系与数据

- 世界坐标右手系，Y 向上。星体分布在一个以原点为球心的体积内，**最外圈半径 ≈ 0.75–1.25**（按布局不同）。
- 场景内容分四类粒子和两类图元：

| 名称 | 数量 | 说明 |
| --- | --- | --- |
| 球壳颗粒 `SKY` | 2600 + 900 + 250 | 半径 `SKY_RADIUS = 1` 的球面上，`r = 1 × (0.95 + 0.1·u)` |
| 背景浮星 `FIELD` | 546 + 234 | 体积内，`r = 0.7 × (0.3 + 0.7·∛u)` |
| 尘埃 `dust` | 4410（盘面） | 旋臂 3200 + 弥散 1100 + 核 110 |
| 星体 node | 每个工作区/对话 1 | 位置由布局函数给出 |
| 连线 link | 每条归属关系 1 | 三次数据：a、b、kind |
| 骨架 guides | 每种布局 0–26 条折线 | 仅用于非盘面布局 |

所有随机都是**确定性 hash**（FNV-1a 风格 `hash01(key)`），同一数据永远得到同一张图。

> **hash 陷阱**：只差一个字符的 key 会强相关，粒子会被拉成弧线或条纹。要用长度/前缀明显不同的 key（`…:a` / `…:bb` / `…:ccc`），或一次 hash 出多条独立流。这是本项目踩过两次的坑。

## 2. 相机与投影

```js
camera = { yaw: 0.55, pitch: 0.62, distance: 2.9, target: {x,y,z}, fov: 0.82 }  // fov 弧度，≈47°
eye = target + dir(distance),  dir 由 yaw/pitch 决定
basis = { eye, forward, right, up, focal = min(w,h)/2 / tan(fov/2) }
project(p):
  d = dot(p - eye, forward);            if (d <= 0.08) return null   // 背面剔除
  x = w/2 + dot(p - eye, right)/d * focal
  y = h/2 - dot(p - eye, up)   /d * focal
  scale = focal / d
```

- 取景距离：`fitDistance(extent) = max(1.2, extent·1.55 / tan(fov/2))`，总览再乘 `0.86`。
- **取景球半径** `shellRadius = clamp(extent × 1.22, 1, 2.1)`，球壳半径跟着它走（球壳要把形体包在里面）。
- 俯冲：`easeInOutCubic` 定时 tween，同时改 `target` 与 `distance`。落点距离是公式而不是常数：`clamp(folder ? max(0.85, fit·0.3) : max(0.34, fit·0.12), 0.26, 7)`；时长对话 980 ms、工作区 1150 ms。当前总览 `fit ≈ 3.98` 时落点约 0.48（对话）/ 1.19（工作区）。

## 3. 帧循环与层序（必须按这个顺序）

```
清屏(theme.base) → 预烘星云贴图 → 球壳光晕 sprite(lighter) → 球壳方块(source-over)
→ 浮星方块(source-over) → 霾层(lighter) → 尘埃(lighter) → 骨架线(lighter)
→ 连线(source-over) → 触及连线提亮(source-over) → 星体光晕(lighten)
→ 星体本体与选中环(source-over) → 标签
```

| # | 层 | 混合 | 关键参数 |
| --- | --- | --- | --- |
| 0 | 底色 | `source-over` | 整幅 `fillRect(theme.base)`：七套主题一律纯黑 `#000000` |
| 1 | 星云贴图 | `source-over` | 预烘的整幅位图，存在时直接 `drawImage` |
| 2 | 球壳光晕 | `lighter` | 只垫在亮星（3.0 级里的 3%）与眨眼星下面：高斯 halo sprite，α `0.12·swell·skyAlpha`（swell 是眨眼包络） |
| 3 | 球壳方块 | `source-over` | 固定像素尺寸 1.2 / 2 / 3 px（**不做距离衰减**）；α `skyAlpha = (0.5+0.5·min(1,glow))·focusPull`；同色桶合批成一条 path |
| 4 | 浮星方块 | `source-over` | 与球壳同一套固定像素尺寸（同样不做距离衰减）；α `skyAlpha×0.8`；以 −0.00048 rad/s 反向慢转 |
| 5 | 霾层 | `lighter` | 星云 billboard（「星云天幕」滑杆）+ 星团云（「集群云雾」滑杆，移动档关闭）画进 1/4 分辨率画布再放大合成；与「星空背景」开关无关 |
| 6 | 尘埃 | `lighter` | 由「尘埃带」滑杆控制，默认 0（不画）；半径 `clamp(size·step·0.016, 0.8, spiral ? 2.4 : 2)`（step = focal/depth），尺寸再乘 `0.8 + 1.6·dust`（上限随 dust 放大到 2.5 倍），α `grain.alpha·reveal·dust^0.7·3.2·min(1, 2.4/depth)`；每 7 粒加画一个 `3 + 3·dust` 倍大的柔光，α ×0.12 |
| 7 | 骨架 | `lighter`（尘埃留下的 `lighter` 仍在生效） | α `0.2·reveal·bright`，线宽 0.7 |
| 8 | 连线 | `source-over` | **1 设备像素**；三档 α `[0.32, 0.46, 0.09]`（普通/血缘/淡出），整体乘 `链接透明度 / 0.14`；二次贝塞尔控制点见 §5 |
| 9 | 触及连线 | `source-over` | 悬停/选中星体碰到的边单独提亮：α `0.85·linkFade`，**1 CSS px**，走专用亮色桶 |
| 10 | 星体光晕 | `lighten`（逐通道 max） | 内晕/外晕两枚缓存 sprite；α 内 `0.32·min(1,(rd/3)²)·gain`、外 `0.022·gain` |
| 11 | 星体本体 | `source-over` | 缓存圆盘 sprite，尺寸按 0.5 px 量化；当前/选中外加一个**分离的** 1 px 圆环（半径 `dot/2 + 3.5`） |
| 12 | 标签 | `source-over` | 10.5 px，`2.6/(depth+1.1)` 淡出（下限 0.14），矩形碰撞检测 |

要点：

- **球壳与浮星颗粒永不随距离变大**。这是"看得见球缘、颗粒锐利"的唯一原因；一旦按 `scale` 缩放就会变成模糊光斑。
- 星体光晕用 `lighten` 而不是 `lighter`：真实实现是**整图 bloom**，密集星团应该像一颗亮星那样发光，而不是叠加成一团白。
- 连线按普通/血缘/淡出细分三档，悬停或选中星体碰到的边再单独提一档亮线，是为了让主线清晰、支线退后，同时不增加 draw call。

## 4. 颗粒的绘制方式

- 球壳：按 `(尺寸级, 色相桶)` 分 15 个桶，每桶一条 `beginPath()`，内部只 `rect()`，最后 `fill()` → 每帧 15 次 fill，2600+900+250 个矩形。
- 尺寸取整到设备像素：`deviceSize = round(size·sizeScale·dpr)`，位置 `round(px·dpr)/dpr`，避免半像素糊边。
- 发光颗粒（3.0 级里 3%）额外用一枚高斯 halo sprite 垫在下层。
- 眨眼：**同时只有一颗**，1.6 s 正弦包络峰值 `×3.2`（`1 + 2.2·sin(π·t/1.6)`），泊松间隔均值 ~20 s（钳在 [1.5, 90] s，首轮 4 s 后才开始）。眨眼只放大光晕 sprite，方块本体不变。

## 5. 连线曲线

```
mid = (a + b)/2                            // 世界空间（三维）
edge = |b - a|                             // 三维边长
bow = (lineage ? 0.18 : 0.32) × curve × edge
      // curve = 「连线弯曲」滑杆，默认 0.35（参考实现的默认值）→ 默认弓高 ≈ 0.112×边长；0 时直接 lineTo
      // 血缘边的 0.18 是本插件加的特例，参考实现只有 0.32
dir = mid / |mid|                          // 完整三维"远离原点"方向
      // 中点几乎在原点（穿核对径边）时退化：取边向量在 XZ 平面的垂线 (ez, 0, −ex)/|(ex,ez)|
control = mid + dir · bow                  // 世界空间外推
屏幕坐标 = project(control)                // 外推之后再投影
path = moveTo(a) → quadraticCurveTo(control, b)
```

长边弓得更高 → 弧线绕开中心，形成轨道弧。

## 6. 布局（形状）

八种 `layout`，每种只改星体位置与尘埃体积，接口保持一致（最外圈 ≈1、Y 收在 `thickness` 内）：

| layout | 形态 | 尘埃体积 |
| --- | --- | --- |
| `spiral` | 双旋臂盘面（`spiralRadius(t)` + 臂间相位） | 旋臂 + 弥散盘 + 核 |
| `rings` | 4 道同心环 | 4 个薄环 |
| `field` | 深空场：无结构散场 | 宽球内均匀（体积均匀） |
| `system` | 太阳系：一条轨道一行星 | 轨道环 + 行星薄盘卫星 |
| `helix` | 双链 1.6 圈 | 双链 |
| `web` | 不规则球团（矩阵） | 球团内均匀 |
| `plate` | 立体方阵：全部星体按 Z 序占 side³ 格点，同一工作区连成一块；不跑力模拟 | 沿格线 |
| `tree` | 6–14 条立体辐条（黄金螺旋方向） | 辐条 |

非盘面布局要先把**母星质心平移到原点**，否则形体偏在球壳一侧（螺旋不平移，它本来就以核为中心）。

## 7. 质量分级

| tier | dustStep | starStep | dpr |
| --- | --- | --- | --- |
| low | 3 | 2 | 1 |
| auto/mid | 2 | 1 | 2 |
| high | 1 | 1 | 2 |

按实测帧耗时自动切档：`>19 ms` 降档、`>14.5 ms` 中档、`<14.5 ms` 升档，1.5 s 内不反复。HUD 显示 `fps · ms`——fps 会被刷新率封顶（60 Hz 就是 60），`ms` 才是余量。

## 8. 换成 WebGL 时要补什么

参考实现就是 WebGL（three.js），管线是 `EffectComposer(RenderPass → UnrealBloomPass → OutputPass)`。它的实际参数就是移植基线：

- **渲染器**：`WebGLRenderer({ antialias: false })`，像素比 `min(devicePixelRatio, 2)`；ACES Filmic tone mapping，曝光 `1.05`（浅色模式关闭 tone mapping）；相机 `fov 60° / near 0.5 / far 50000`；背景 `0x000003`。
- **Bloom**：UnrealBloomPass 以 strength/radius/threshold = `0.6 / 0.4 / 0.18` 构造，随后立即被设置默认值 `0.35 / 0.35 / 0.22` 覆盖（预设里 strength 范围 0–1）；浅色模式、低质量档、strength = 0 时整链关闭；开场从 `1.8×strength` 回落到设置值。
- **星体**（一个 `Points` + 自定义 shader）：
  - vertex：`gl_PointSize = min(aSize·uSizeMul·uPixelScale / max(−mv.z, 1), uMaxPoint)`，`uPixelScale = drawingBufferHeight / (2·tan(fov/2))`，`uMaxPoint = 110·dpr`；
  - fragment：白热核心 `smoothstep(0.18, 0, d)·0.55` 混白，alpha `smoothstep(0.5, 0.42, d)`，ghost `×0.45`，聚焦淡出到 `0.12`；
  - 材质：普通混合、`depthWrite: false`、`renderOrder = 1`（节点永远盖住连线）；
  - 节点世界尺寸 `2.2·(1+0.5·√degree)`，上限 6×。
- **球壳/浮星**：同样是 `Points`，但球壳 shader 里**不做** `gl_PointSize *= 1/depth`，保持固定像素（参考实现用 `sizeAttenuation: false` 达到同一效果）。
- **连线**：`LineBasicMaterial` + 顶点色，opacity `0.16`（设置默认 `0.14`），`depthWrite: false`；颜色是两端点 50/50 混合、去饱和 60%、亮度压到 ≤0.35。曲线用每边 K 段折线，在 vertex shader 里按 `(source, target, t)` 重建同一条贝塞尔，弯曲参数变化不用重传几何（参考实现的创世动画就是这么做的）。
- **背景**：加法混合的星云穹顶 + 星团云（穹顶半径 = 图半径 ×2.6）；天幕以 `0.0008 rad/s` 自转，浮星反向 ×0.6 慢转形成视差。
- **揭幕动画（`reveal`）**：按半径错峰 `0.55` 的时间窗 + 每节点 `0.45` 的窗口，位置在 shader 里 `targetPosition · scale`。

## 9. 不变量（回归检查用）

- 银河布局：`extent ≈ 0.75–1.0`，相机 `≈2.8`，全部星体都在视口内（星体数量随数据变化，不存在固定常数；selfcheck 逐星断言在屏），原点投到视口中心。
- 球壳：任何距离下颗粒屏幕尺寸不变（1.2 / 2 / 3 px），不透明度受"球壳亮度"滑杆控制。
- 帧耗时：60 Hz 屏上 `ms` 应贴 16.7 且不掉帧。
- 每层混合模式与顺序不得调换（换 `lighten`/`lighter` 会直接改变星团观感）。

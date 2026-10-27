# galaxy-view 逆向记录（REA）

对象：<https://github.com/longwind1984/galaxy-view>
方法：`git clone` 取源码 → 用仓库自带 esbuild 配置把 TS 打成真实产物 → **REA 分析该产物**（`analyze-javascript-application`），再回到源码逐项核对常量。

## 1. 产物与分析证据

REA 只接受目录 / `.asar`，所以先把产物放进一个应用目录：

```
/tmp/gv-app/package.json       {"name":"galaxy-view-bundle","main":"bundle.js"}
/tmp/gv-app/bundle.js          314934 bytes
```

打包命令（插件用 `worker:` 前缀导入 Worker 源码，需要一个小 stub 插件，否则 esbuild 解析失败）：

```
esbuild src/main.ts --bundle --format=cjs --target=es2021 \
  --external:obsidian --external:three --external:d3-force-3d \
  --external:3d-force-graph --external:three-spritetext \
  --plugins=stub-worker --outfile=.../bundle.js
```

REA 结果（`rea analyze-javascript-application /tmp/gv-app --json`，exit 0）：

| 项 | 值 |
| --- | --- |
| root artifact sha256 | `5b68c37db202d9cf…` |
| text bytes read | 315 008 |
| parsed JS files | 1（0 parse failures，0 invalid UTF‑8） |
| visited AST nodes | **49 036** |
| findings | 58 |
| graph | 25 nodes / 59 edges（`imports` 50、`contains` 4、`exposes` 2、`loads` 2、`maps_to` 1） |
| node kinds | javascript-module 18、artifact 2、javascript-asset 1、electron-main 1、package 1、endpoint 1、**worker 1** |
| coverage | partial（不含运行时可达性、注册与默认值） |

> 注：上表的产物数字来自首次 REA 运行；2026-10-25 复核时未重跑该工具，只逐项回源码核对了常量。

REA 从产物里直接点出的外部依赖，就是渲染管线的骨架：

```
three
three/examples/jsm/controls/OrbitControls.js
three/examples/jsm/postprocessing/EffectComposer.js
three/examples/jsm/postprocessing/RenderPass.js
three/examples/jsm/postprocessing/UnrealBloomPass.js
three/examples/jsm/postprocessing/OutputPass.js
d3-force-3d
obsidian
worker: new Worker(this.url)
```

即：**EffectComposer(RenderPass → UnrealBloomPass → OutputPass)** 后处理链 + **OrbitControls** 轨道相机 + **d3-force-3d 在 Web Worker 里跑布局**。REA 的 limitations 明确写着这些是从语法推导、运行时未证明——所以下面凡是运行期行为，都以源码为准再核一遍。

## 2. 源码层的关键常量（逐文件核对）

### 球壳天幕 `src/render/starfield.ts`

| 事实 | 值 |
| --- | --- |
| 三个尺寸级 | `{2600, 1.2} {900, 2.0} {250, 3.0}` → 3 个 draw call |
| 数量随档位 | 每级 `count ×= 档位 scale`，下限 50（`starfield.ts:124`） |
| 壳半径 | `shellRadius = graphRadiusEstimate × 6.5`（`AggregateRenderer.ts:147`） |
| 大小是否随距离 | **否**，`sizeAttenuation: false`（固定像素） |
| 半径 | `shellRadius × (0.95 + 0.1·rand)` |
| 分布 | `theta = 2π·rand`、`phi = acos(2·rand−1)` → 球面均匀 |
| 颜色 | 85% `lerp(#9da8c4 → #ffffff)`、10% `#ffe9c9`、5% `#bfd3ff` |
| HDR 提亮 | 仅 size≥3.0 级里有 3% 概率 `×1.8`，独占 bloom |
| 不透明度 | `opacity: 0.55`，`depthWrite: false`，`renderOrder = -1` |
| 眨眼 | **只有 3.0 级会眨**，同时最多一颗；泊松间隔均值 `6/freq` 秒、钳在 `[1.5, 90]` s，首次等待 3 s（`starfield.ts:43,74`）；1.6 s 正弦包络峰值 `×3.2`（`1 + 2.2·sin(π·t/1.6)`） |

### 背景浮星 `buildFieldStars`

`count = 1200 × density`，`size = 2.4`、`sizeAttenuation: true`、`opacity 0.6`、颜色 `×0.75`，半径 `R·(0.3 + 0.7·∛rand)`（立方根采样 → 体积均匀，避开中心 30%），其中 `R = graphRadiusEstimate × 2.4`（`AggregateRenderer.ts:713`）。运行时它相对天幕**反向 ×0.6 慢转**，造出视差（`AggregateRenderer.ts:788`）。

### 布局 `src/layout/galaxyForces.ts`

不是解析螺旋，而是两个 d3 力：

- `forceRadialCore`：柱面半径 `r` 上拉向中轴，力度 `strength·degW·alpha·r / 200`，`degW = clamp(degree/mean, 0.3, 3)` → 度数高的沉核，形成致密亮核与径向密度梯度。
- `forceSpiral`：切向推力 **`Δv = (−z, x)·strength·alpha·swirl`**（代码写作单位切向 `(−z/r, x/r)` 再乘回 `r`，两相抵消，**不除以 r**），`swirl = 1/(1 + r/160)` → 内快外慢，冷却期把盘梳成对数旋臂（`galaxyForces.ts:54-58`）。

**结论：它的旋臂是力场收敛出来的，不是公式画的。** 我们目前是解析螺旋 + 会话沿切向拖尾，形状相似但密度梯度的来源不同。

### 连线 `src/render/linkCurves.ts`

二次曲线（每边 K 段折线逼近），**控制点 = 边中点沿"远离原点"方向外推**。弓高 = `CURVE_BOW(0.32) × 曲率滑杆 × 边长`，滑杆 `linkCurve` 默认 `0.35`（`settings.ts:98`）→ **默认弓高 ≈ 0.112×边长**。方向是完整三维 `mid/|mid|`；中点几乎在原点（穿核对径边）时退化为边向量在 XZ 平面的垂线（`linkCurves.ts:113-132`）。**参考实现没有血缘（lineage）特例**——dsh 那边的 0.18 系数是自家加的。长边拱得更高 → 弧线绕开亮核，NASA Eyes 式轨道弧。

### 相机 `src/interactions/CameraDirector.ts` + `src/constants.ts`

- 取景：`dist = max(fitRadius,1) / sin(vfov/2) × FRAMING_MARGIN`，`FRAMING_MARGIN = 1.5`（`CameraDirector.ts:13`）；视线方向 `(cos(elev), sin(elev), 0.35)` 归一化后落到质心，**默认仰角 18°**。
- 巡航：`angularSpeed 0.022 rad/s`；仰角呼吸是锚点 φ 上叠加 **±8° 正弦**（周期 `90 s`），结果钳在 `[0.05, π−0.05]`（`CameraDirector.ts:417-421`）；半径 `4%` / `60 s` 呼吸；拖动后 `6 s` 恢复、`2 s` 渐入。
- 飞达节点：距离 `nodeRadius × 12`，钳 `[40, 140]`；方位角偏 `15°`；时长 **`min(max(800 + 0.45·travel, 800), 1800)` ms**（travel 为飞行距离，`CameraDirector.ts:300`），`easeInOutCubic`。

### 渲染器与 bloom `src/render/AggregateRenderer.ts` + `src/constants.ts`

| 事实 | 值 |
| --- | --- |
| 渲染器 | `antialias: false`，像素比 `min(devicePixelRatio, 2)`（`:137-138`） |
| tone mapping | ACES Filmic，曝光 `1.05`；浅色模式关闭（`:139-140`、`:671`） |
| 相机 | `fov 60°`、`near 0.5`、`far 50000`（`:145`）；背景 `0x000003`（`constants.ts:9`） |
| bloom 构造值 | strength/radius/threshold = `0.6 / 0.4 / 0.18`（`constants.ts:10`） |
| bloom 生效默认 | 设置立即覆盖为 `0.35 / 0.35 / 0.22`（`settings.ts:96`，`:818-822` 应用） |
| bloom 关闭条件 | 浅色模式、低质量档、strength = 0（`:822`） |
| 预设范围 | strength 0–1（`render/stylePresets.ts:35-85`） |
| 开场 | bloom 从 `1.8×strength` 回落到设置值（`GraphController.ts:321-331`） |

### 星体 shader `src/render/shaders.ts`

- 点大小：`gl_PointSize = min(aSize·uSizeMul·uPixelScale / max(−mv.z, 1), uMaxPoint)`（`:39`），`uMaxPoint = 110·dpr`（`AggregateRenderer.ts:216`）。
- 片元：白热核心 `smoothstep(0.18, 0, d)·0.55` 混白；alpha `smoothstep(0.5, 0.42, d)`；ghost `×0.45`；聚焦淡出到 `0.12`（`:51-63`，aDim 权重见 `AggregateRenderer.ts:572`）。
- 材质：普通混合、`depthWrite: false`、`renderOrder = 1`（节点永远盖住连线，`AggregateRenderer.ts:206-224`）。
- 节点尺寸：`2.2·(1+0.5·√degree)`，上限 6×（`constants.ts:4-6`）。

### 连线材质与颜色

`LineBasicMaterial` + 顶点色，opacity `0.16`（设置默认 `0.14`），`depthWrite: false`（`AggregateRenderer.ts:248-253`、`constants.ts:11`、`settings.ts:98`）。颜色 = 两端点色 50/50 混合 → 去饱和 60%（`s×0.4`）、亮度压到 ≤0.35（`render/palette.ts:110`）。

### 背景运动与星云

天幕以 `0.0008 rad/s` 自转（`constants.ts:33`）。另有加法混合的星云穹顶与星团云（`render/nebula.ts:91,242`），穹顶半径 = 图半径 `×2.6`（`AggregateRenderer.ts:701`）。

### 创世动画 `src/render/reveal.ts` + `shaders.ts`

`revealScale`：前 `55%` 时间按半径错峰，后 `45%` 是每节点窗口，`1-(1-t)³`；位置在 vertex shader 里按 `targetPosition * scale` 缩放，链接在 shader 里按同一 `t` 重建曲线。

## 3. 与我们实现的对照

| 项 | galaxy-view | dsh-galaxy-view 现状 | 差距 |
| --- | --- | --- | --- |
| 球壳尺寸 | 固定 1.2/2.0/3.0 px（`sizeAttenuation: false`） | 固定 1.2/2/3 px（`SKY_CLASSES` + `paintGrainSquares`） | 已对齐 |
| 球壳不透明度 | 0.55 | 由「球壳亮度」滑杆控制，α = `(0.5+0.5·min(1,glow))·focusPull` | 参数可再对 |
| 眨眼 | 单颗、泊松、1.6 s、峰值 ×3.2 | 已移植：单颗泊松眨眼（`src/client.js:1489-1523`），只放大光晕 sprite | 已对齐 |
| 连线弯曲 | 世界空间、三维 `mid/|mid|` 方向、`0.32×滑杆×边长`（默认 ≈0.112×边长） | 已移植（`bowControl`，同公式、曲率由「连线弯曲」滑杆 `linkCurve` 控制，默认 0.35），另加血缘档 0.18 | 已对齐（血缘档为 dsh 独有） |
| 布局 | d3 力场收敛 | 解析螺旋/环/晶格… | 有意不同 |
| 取景 | `r/sin(vfov/2)×1.5`，仰角 18° | `fitDistance()×0.86` | 近似，未逐项对 |
| 巡航呼吸 | 仰角 ±8°/90 s，半径 4%/60 s | 仅 yaw 匀速 | **待移植** |
| 发光 | UnrealBloomPass（真后处理，生效默认 0.35/0.35/0.22） | Canvas 2D 叠 sprite 近似 | **架构差异，无法等价** |
| 背景氛围 | 加法混合星云穹顶（×2.6）+ 星团云 | 1/4 分辨率霾层（星云 billboard + 星团云，`lighter`） | 技术不同、观感近似 |

## 4. 没做与做不到

- **UnrealBloomPass 无法等价**：REA 证明它是 three 的后处理 pass（多级降采样 + 高斯 + 合成）。Canvas 2D 只能靠叠加 sprite 近似；要真 bloom 得换 WebGL 渲染路径（大改，且要自己写 composer）。
- REA 的 coverage 是 `partial`：运行时注册、默认值、实际可达性未证明；本文所有运行期结论都来自源码复核。
- 本次没有做浏览器内验证：DSH 桌面版的 GUI 会话 token 已过期（`dsh web authentication required`），CDP 截图需用户重新给出当前 URL 后再跑。

/**
 * Browser half of the graph-view plugin — a cinematic 3D galaxy with a control panel.
 *
 * Visual direction follows Obsidian's Galaxy View: workspaces are luminous suns on
 * spiral arms, conversations are stars, filaments join a fork to its parent, and a
 * perspective camera orbits a slowly turning starfield.
 *
 * Nothing else in the harness changes: the galaxy is one `main` panel plus one header
 * button, and the stock conversation view is one click away.
 *
 * Plain, dependency-free bundle source: `require` is the client module loader's shim,
 * every element is built with `react.createElement`, and the module is wrapped into
 * `window.__ModuleLoader__.load({...})` by `scripts/build.mjs`.
 */
const react = require("react");
const { useCallback, useEffect, useMemo, useRef, useState } = react;
const h = react.createElement;

const NS = "graph";
const PANEL_ID = "graph";
const STORE_KEY = "dsh-graph-view:settings";
const PRESET_KEY = "dsh-graph-view:presets";
const EMPTY_SESSIONS = { phase: "loading", ids: [], byId: {} };
const EMPTY_WORKSPACES = { phase: "loading", items: [], archivedSessionIds: [] };

/* ------------------------------------------------------------------ *
 * Dictionaries
 * ------------------------------------------------------------------ */

const zh = {
	"panel": "星空图谱",
	"toggle": "星空",
	"toggle.title": "切换到星空视图",
	"title": "星空视图",
	"subtitle": "工作区与对话的三维星系",
	"search.placeholder": "搜索工作区或对话…",
	"action.relayout": "重排",
	"action.fit": "复位",
	"action.archived": "归档",
	"action.archivedOn": "含归档",
	"action.stock": "原版界面",
	"chat.back": "回到星系",
	"chat.hint": "这颗星体里的对话 · 直接输入即可",
	"stat": "{folders} 个工作区 · {sessions} 个对话",
	"kind.folder": "工作区",
	"kind.session": "对话",
	"empty.title": "还没有可绘制的星体",
	"empty.hint": "在左侧新建一个文件夹对话，它就会成为星系里的一颗星。",
	"empty.filtered": "筛选后没有星体",
	"empty.filteredHint": "「只留它」或隐藏的星体把结果筛空了。",
	"empty.clear": "清除筛选",
	"loading": "正在加载工作区…",
	"state.running": "运行中",
	"state.archived": "已归档",
	"state.current": "当前",
	"time.now": "刚刚",
	"time.minutes": "{n} 分钟前",
	"time.hours": "{n} 小时前",
	"time.days": "{n} 天前",
	"a11y.canvas": "工作区与对话的三维星系图",
	"card.close": "关闭",
	"card.open": "打开",
	"card.enter": "进入工作区",
	"card.isolate": "只留这个工作区",
	"card.focus": "聚焦此工作区",
	"card.children": "{n} 个对话",
	"card.none": "这个工作区还没有对话",
	"card.hint": "点击传送 · 双击直接打开",
	"hint.orbit": "拖拽旋转 · 滚轮推拉 · 点击星体打开",
	"panel.open": "控制栏",
	"panel.close": "收起",
	"panel.notes": "{n} 个对话",
	"panel.search": "搜索",
	"panel.recenter": "回中心",
	"sec.look": "外观",
	"sec.filter": "过滤",
	"sec.status": "状态",
	"sec.color": "外观与配色",
	"sec.backdrop": "深空背景",
	"sec.bloom": "辉光",
	"sec.shape": "形态",
	"sec.motion": "导航与动效",
	"sec.advanced": "高级",
	"custom": "已自定义",
	"revert": "还原",
	"preset.galaxy": "银河",
	"preset.galaxy.sub": "致密核·隐约旋臂·星海",
	"preset.rings": "星环",
	"preset.lattice": "晶格",
	"preset.bubble": "球壳",
	"preset.helix": "双螺旋",
	"preset.clusters": "星团",
	"preset.plate": "薄阵",
	"preset.tree": "星树",
	"preset.rings.sub": "同心轨道·薄环",
	"preset.lattice.sub": "立体晶格·方阵",
	"preset.bubble.sub": "中空球面·均匀",
	"preset.helix.sub": "双链攀升·立体",
	"preset.clusters.sub": "五团聚集·紧凑",
	"preset.plate.sub": "平面阵列·极薄",
	"preset.tree.sub": "放射枝干·条理",
	"theme.deepfield": "深空",
	"theme.hubble": "哈勃",
	"theme.neon": "霓虹",
	"theme.sunset": "落日",
	"theme.cyber": "赛博",
	"theme.matrix": "矩阵",
	"theme.aurora": "极光",
	"lens.all": "全部",
	"lens.running": "运行中",
	"lens.current": "当前",
	"lens.fork": "子智能体",
	"lens.archived": "已归档",
	"filter.all": "显示全部",
	"filter.orphans": "孤星",
	"filter.empty": "空工作区",
	"filter.byName": "按名字过滤",
	"filter.hiddenNote": "点名字隐藏 · 双击只留",
	"backdrop.on": "星空背景：开",
	"backdrop.off": "星空背景：关",
	"slider.veil": "星云天幕",
	"slider.field": "球壳密度",
	"slider.shellSize": "球壳大小",
	"slider.shellGlow": "球壳亮度",
	"slider.mist": "集群云雾",
	"slider.brightness": "强度",
	"slider.bloom": "范围",
	"slider.threshold": "阈值",
	"slider.arms": "旋臂数",
	"slider.twist": "缠绕",
	"slider.thickness": "厚度",
	"slider.spread": "散布",
	"motion.auto": "自动环绕",
	"motion.autoHint": "闲置时相机绕星系慢慢漂移",
	"motion.speed": "速度",
	"motion.tour": "巡游",
	"motion.tourStart": "开始",
	"motion.tourStop": "停止",
	"motion.tourHint": "镜头自动漫游，掠过最近活跃的对话",
	"motion.replay": "重播开场动画",
	"motion.reset": "全部重置",
	"motion.save": "存为我的预设",
	"motion.mine": "我的预设",
	"quality": "质量",
	"quality.auto": "自动",
	"quality.high": "高",
	"quality.low": "低",
	"quality.hint": "自动＝按设备实时调度；低档减少星尘与浮星。",
	"stats": "{fps} fps · {ms} ms · {nodes} 星 · {links} 丝 · {quality}"
};

const en = {
	"panel": "Starfield",
	"toggle": "Stars",
	"toggle.title": "Switch to the starfield view",
	"title": "Starfield",
	"subtitle": "Workspaces and conversations as a galaxy",
	"search.placeholder": "Search workspaces or conversations…",
	"action.relayout": "Re-roll",
	"action.fit": "Reset",
	"action.archived": "Archived",
	"action.archivedOn": "Archived on",
	"action.stock": "Original UI",
	"chat.back": "Back to the galaxy",
	"chat.hint": "This star's conversation · type to continue",
	"stat": "{folders} workspaces · {sessions} conversations",
	"kind.folder": "Workspace",
	"kind.session": "Conversation",
	"empty.title": "No stars to draw yet",
	"empty.hint": "Start a conversation in a folder and it becomes a star here.",
	"empty.filtered": "Nothing survives the filters",
	"empty.filteredHint": "A pinned or hidden star left the view empty.",
	"empty.clear": "Clear filters",
	"loading": "Loading workspaces…",
	"state.running": "running",
	"state.archived": "archived",
	"state.current": "current",
	"time.now": "just now",
	"time.minutes": "{n} min ago",
	"time.hours": "{n} h ago",
	"time.days": "{n} d ago",
	"a11y.canvas": "3D galaxy of workspaces and conversations",
	"card.close": "Close",
	"card.open": "Open",
	"card.enter": "Enter workspace",
	"card.isolate": "Isolate this workspace",
	"card.focus": "Focus this workspace",
	"card.children": "{n} conversations",
	"card.none": "No conversations in this workspace yet",
	"card.hint": "click to travel · double-click to open",
	"hint.orbit": "drag to orbit · scroll to zoom · click a star to open",
	"panel.open": "Panel",
	"panel.close": "Hide",
	"panel.notes": "{n} conversations",
	"panel.search": "Search",
	"panel.recenter": "Re-center",
	"sec.look": "Look",
	"sec.filter": "Filter",
	"sec.status": "Status",
	"sec.color": "Colour",
	"sec.backdrop": "Deep space",
	"sec.bloom": "Bloom",
	"sec.shape": "Shape",
	"sec.motion": "Navigation",
	"sec.advanced": "Advanced",
	"custom": "customised",
	"revert": "revert",
	"preset.galaxy": "Galaxy",
	"preset.galaxy.sub": "dense core · hinted arms · star sea",
	"preset.rings": "星环",
	"preset.lattice": "晶格",
	"preset.bubble": "球壳",
	"preset.helix": "双螺旋",
	"preset.clusters": "星团",
	"preset.plate": "薄阵",
	"preset.tree": "星树",
	"preset.rings.sub": "同心轨道·薄环",
	"preset.lattice.sub": "立体晶格·方阵",
	"preset.bubble.sub": "中空球面·均匀",
	"preset.helix.sub": "双链攀升·立体",
	"preset.clusters.sub": "五团聚集·紧凑",
	"preset.plate.sub": "平面阵列·极薄",
	"preset.tree.sub": "放射枝干·条理",
	"theme.deepfield": "Deep Field",
	"theme.hubble": "Hubble",
	"theme.neon": "Neon",
	"theme.sunset": "Sunset",
	"theme.cyber": "Cyber",
	"theme.matrix": "Matrix",
	"theme.aurora": "Aurora",
	"lens.all": "All",
	"lens.running": "Running",
	"lens.current": "Current",
	"lens.fork": "Subagents",
	"lens.archived": "Archived",
	"filter.all": "Show all",
	"filter.orphans": "Orphans",
	"filter.empty": "Empty workspaces",
	"filter.byName": "Filter by name",
	"filter.hiddenNote": "click to hide · double-click to isolate",
	"backdrop.on": "Backdrop: on",
	"backdrop.off": "Backdrop: off",
	"slider.veil": "Nebula veil",
	"slider.field": "Shell density",
	"slider.shellSize": "Shell size",
	"slider.shellGlow": "Shell brightness",
	"slider.mist": "Cluster mist",
	"slider.brightness": "Intensity",
	"slider.bloom": "Radius",
	"slider.threshold": "Threshold",
	"slider.arms": "Arms",
	"slider.twist": "Twist",
	"slider.thickness": "Thickness",
	"slider.spread": "Spread",
	"motion.auto": "Auto-orbit",
	"motion.autoHint": "when idle the camera drifts around the galaxy",
	"motion.speed": "Speed",
	"motion.tour": "Wander",
	"motion.tourStart": "Start",
	"motion.tourStop": "Stop",
	"motion.tourHint": "glide between recently active conversations",
	"motion.replay": "Replay intro",
	"motion.reset": "Reset everything",
	"motion.save": "Save as my preset",
	"motion.mine": "My presets",
	"quality": "Quality",
	"quality.auto": "Auto",
	"quality.high": "High",
	"quality.low": "Low",
	"quality.hint": "Auto adapts live; low draws less dust and fewer field stars.",
	"stats": "{fps} fps · {ms} ms · {nodes} stars · {links} threads · {quality}"
};

/** Relative timestamp for tooltips and node metadata. */
function relativeTime(timestamp, t) {
	if (typeof timestamp !== "number" || timestamp <= 0) return "";
	const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
	if (minutes < 1) return t("time.now");
	if (minutes < 60) return t("time.minutes", { n: minutes });
	const hours = Math.round(minutes / 60);
	if (hours < 24) return t("time.hours", { n: hours });
	return t("time.days", { n: Math.round(hours / 24) });
}

/* ------------------------------------------------------------------ *
 * Presets, palettes and defaults
 * ------------------------------------------------------------------ */

const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

/**
 * Read persisted settings, ignoring anything that no longer parses. An older
 * settings version is migrated once (see migrateSettings) and written back.
 */
function loadSettings() {
	let stored = null;
	try {
		const raw = window.localStorage.getItem(STORE_KEY);
		stored = raw === null ? null : JSON.parse(raw);
	} catch (error) {
		stored = null;
	}
	const { settings, migrated } = migrateSettings(stored);
	if (migrated) saveSettings(settings);
	return settings;
}

/** Persist settings; storage failures are not worth interrupting the view for. */
function saveSettings(settings) {
	try {
		window.localStorage.setItem(STORE_KEY, JSON.stringify(settings));
	} catch (error) {
		/* private mode, quota, … */
	}
}

/** User-saved presets. */
function loadPresets() {
	try {
		const raw = window.localStorage.getItem(PRESET_KEY);
		const parsed = raw === null ? [] : JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.filter((entry) => entry !== null && typeof entry === "object" && typeof entry.name === "string") : [];
	} catch (error) {
		return [];
	}
}

/** Keys a preset owns; used to tell "customised" from "still the preset". */
const PRESET_KEYS = Object.keys(PRESETS.galaxy).concat(["preset"]);

/** True when the current look no longer equals the selected preset. */
function isCustomised(settings) {
	const preset = PRESETS[settings.preset];
	if (preset === undefined) return false;
	return Object.keys(preset).some((key) => settings[key] !== preset[key]);
}

/* ------------------------------------------------------------------ *
 * Look: glow sprites, dust sprites, nebula backdrop, field stars
 * ------------------------------------------------------------------ */

/** Round a hue to a cache bucket so a galaxy needs a handful of sprites. */
function hueBucket(hue) {
	return Math.round(hue / 15) * 15;
}

const spriteCache = new Map();
const dustCache = new Map();

/**
 * One 128px additive glow: small white core, tinted halo, transparent edge.
 * @param hue - HSL hue for the halo.
 * @param core - how opaque the centre stays (0–1).
 * @returns cached canvas sprite.
 */
function glowSprite(hue, core) {
	const key = `${hueBucket(hue)}:${core}`;
	const cached = spriteCache.get(key);
	if (cached !== undefined) return cached;
	const size = 128;
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const context = canvas.getContext("2d");
	const bucket = hueBucket(hue);
	const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
	gradient.addColorStop(0, `hsla(${bucket}, 100%, 88%, ${core})`);
	gradient.addColorStop(0.06, `hsla(${bucket}, 100%, 82%, ${core * 0.9})`);
	gradient.addColorStop(0.13, `hsla(${bucket}, 100%, 72%, ${core * 0.42})`);
	gradient.addColorStop(0.26, `hsla(${bucket}, 96%, 70%, ${core * 0.18})`);
	gradient.addColorStop(0.48, `hsla(${bucket}, 92%, 60%, ${core * 0.05})`);
	gradient.addColorStop(0.74, `hsla(${bucket}, 90%, 55%, ${core * 0.014})`);
	gradient.addColorStop(1, `hsla(${bucket}, 90%, 50%, 0)`);
	context.fillStyle = gradient;
	context.fillRect(0, 0, size, size);
	spriteCache.set(key, canvas);
	return canvas;
}

/** Cache one 24px soft speck per dust hue bucket. */
function dustSprite(hue) {
	const bucket = hueBucket(hue);
	const cached = dustCache.get(bucket);
	if (cached !== undefined) return cached;
	const size = 24;
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const context = canvas.getContext("2d");
	const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
	gradient.addColorStop(0, `hsla(${bucket}, 96%, 82%, 1)`);
	gradient.addColorStop(0.4, `hsla(${bucket}, 92%, 70%, 0.28)`);
	gradient.addColorStop(1, `hsla(${bucket}, 90%, 60%, 0)`);
	context.fillStyle = gradient;
	context.fillRect(0, 0, size, size);
	dustCache.set(bucket, canvas);
	return canvas;
}

/**
 * Bake the deep-space backdrop once per size, palette and veil strength.
 * @returns offscreen canvas.
 */
function bakeNebula(width, height, dpr, themeName, veil) {
	const theme = themeOf(themeName);
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(width * dpr));
	canvas.height = Math.max(1, Math.round(height * dpr));
	const context = canvas.getContext("2d");
	context.scale(dpr, dpr);
	context.fillStyle = theme.base;
	context.fillRect(0, 0, width, height);

	const span = Math.max(width, height);
	const spots = [
		{ x: 0.5, y: 0.5, r: 0.82 },
		{ x: 0.3, y: 0.7, r: 0.52 },
		{ x: 0.72, y: 0.3, r: 0.5 },
		{ x: 0.85, y: 0.8, r: 0.34 }
	];
	spots.forEach((spot, index) => {
		const color = theme.veils[index] ?? theme.veils[0];
		const gradient = context.createRadialGradient(spot.x * width, spot.y * height, 0, spot.x * width, spot.y * height, spot.r * span);
		gradient.addColorStop(0, color);
		gradient.addColorStop(1, "rgba(0,0,0,0)");
		context.globalAlpha = clamp(veil, 0, 1) * 0.85;
		context.fillStyle = gradient;
		context.fillRect(0, 0, width, height);
	});
	context.globalAlpha = 1;

	if (!theme.vignette) return canvas;
	// Vignette keeps the eye on the disc.
	const vignette = context.createRadialGradient(width / 2, height / 2, span * 0.25, width / 2, height / 2, span * 0.78);
	vignette.addColorStop(0, "rgba(0,0,0,0)");
	// Light touch only: the plane itself must stay Obsidian's #1c1c1c, so the corners
	// may darken a few units, not fall to black.
	vignette.addColorStop(1, "rgba(0,0,0,0.22)");
	context.fillStyle = vignette;
	context.fillRect(0, 0, width, height);
	return canvas;
}

/**
 * Sky shell: hard, pixel-snapped squares on a thin world shell (geometry in
 * `createSkyShell`). One cached Gaussian halo sprite per tint serves the handful of
 * bright L-class grains and the single twinkling star; nothing else gets a sprite.
 */
const SKY = createSkyShell();
const FIELD = createFieldStars();
const SKY_HALO_SIGMA = 3;
const SKY_HALO_RADIUS = 8;
const SPARK_CACHE = new Map();
function sparkSprite(tintIndex, dpr) {
	const key = `${tintIndex}|${dpr}`;
	const hit = SPARK_CACHE.get(key);
	if (hit !== undefined) return hit;
	const resolution = Math.max(4, Math.round(SKY_HALO_RADIUS * 2 * dpr));
	const sprite = document.createElement("canvas");
	sprite.width = resolution;
	sprite.height = resolution;
	const paint = sprite.getContext("2d");
	const image = paint.createImageData(resolution, resolution);
	const [r, g, b] = SKY_TINTS[tintIndex];
	const centre = resolution / 2;
	const sigma = SKY_HALO_SIGMA * dpr;
	for (let y = 0; y < resolution; y += 1) {
		for (let x = 0; x < resolution; x += 1) {
			const d2 = (x + 0.5 - centre) ** 2 + (y + 0.5 - centre) ** 2;
			const at = (y * resolution + x) * 4;
			image.data[at] = r;
			image.data[at + 1] = g;
			image.data[at + 2] = b;
			image.data[at + 3] = Math.round(255 * Math.exp(-d2 / (2 * sigma * sigma)) * (d2 < centre * centre ? 1 : 0));
		}
	}
	paint.putImageData(image, 0, 0);
	SPARK_CACHE.set(key, sprite);
	return sprite;
}
const SKY_STYLE_CACHE = { glow: -1, styles: [] };
/** Bucket fill styles for one shell brightness; rebuilt only when the slider moves. */
function skyStyles(glow) {
	if (SKY_STYLE_CACHE.glow === glow) return SKY_STYLE_CACHE.styles;
	// Above 1 the tints lift toward a capped near-white instead of clipping to #fff.
	const lift = clamp(glow - 1, 0, 1);
	const styles = [];
	for (let bucket = 0; bucket < SKY_BUCKETS; bucket += 1) {
		const [r, g, b] = SKY_TINTS[bucket % SKY_TINTS.length];
		const mix = (channel) => Math.round(channel + (222 - channel) * lift * 0.7);
		styles.push(`rgb(${mix(r)},${mix(g)},${mix(b)})`);
	}
	SKY_STYLE_CACHE.glow = glow;
	SKY_STYLE_CACHE.styles = styles;
	return styles;
}

/** Case-insensitive star match used by the search box and the name filter. */
function matches(node, query) {
	return (
		node.label.toLowerCase().includes(query) ||
		(typeof node.path === "string" && node.path.toLowerCase().includes(query)) ||
		(typeof node.cwd === "string" && node.cwd.toLowerCase().includes(query))
	);
}

/** Symmetric cubic ease: slow in, fast middle, slow out — the Galaxy-view glide. */
function easeInOutCubic(value) {
	const t = Math.min(1, Math.max(0, value));
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Ease-out used for the reveal bloom. */
function easeOut(value) {
	return 1 - Math.pow(1 - Math.min(1, Math.max(0, value)), 3);
}

/**
 * Overview camera distance for a shell radius. Scene setup, 回中心 and 复位 all use
 * it, so a reset frames exactly what the first view framed: the whole rim.
 */
function overviewDistance(shellRadius, fov) {
	return fitDistance(shellRadius, fov) * 0.86;
}

/**
 * Paint one grain set as hard, device-pixel-snapped squares: one path per bucket,
 * spun around world Y, projected inline. No allocation per grain.
 */
function paintGrainSquares(context, set, radius, spin, target, basis, focal, width, height, dpr, keepMax, sizeScale, styles) {
	const spinCos = Math.cos(spin);
	const spinSin = Math.sin(spin);
	const eye = basis.eye;
	const fwd = basis.forward;
	const right = basis.right;
	const up = basis.up;
	const halfW = width * 0.5;
	const halfH = height * 0.5;
	const sx = set.x;
	const sy = set.y;
	const sz = set.z;
	const keep = set.keep;
	for (let bucket = 0; bucket < SKY_BUCKETS; bucket += 1) {
		const from = set.bucketStart[bucket];
		const to = set.bucketEnd[bucket];
		if (from >= to) continue;
		const deviceSize = Math.max(1, Math.round(set.sizes[(bucket / SKY_TINTS.length) | 0] * sizeScale * dpr));
		const side = deviceSize / dpr;
		const lead = deviceSize * 0.5;
		context.fillStyle = styles[bucket];
		context.beginPath();
		for (let grain = from; grain < to; grain += 1) {
			if (keep[grain] >= keepMax) continue;
			const gx = sx[grain] * radius;
			const gz = sz[grain] * radius;
			const dx = target.x + gx * spinCos - gz * spinSin - eye.x;
			const dy = target.y + sy[grain] * radius - eye.y;
			const dz = target.z + gx * spinSin + gz * spinCos - eye.z;
			const depth = dx * fwd.x + dy * fwd.y + dz * fwd.z;
			if (depth <= 0.08) continue;
			const px = halfW + ((dx * right.x + dy * right.y + dz * right.z) / depth) * focal;
			const py = halfH - ((dx * up.x + dy * up.y + dz * up.z) / depth) * focal;
			if (px < -side || px > width + side || py < -side || py > height + side) continue;
			context.rect(Math.round(px * dpr - lead) / dpr, Math.round(py * dpr - lead) / dpr, side, side);
		}
		context.fill();
	}
}

/** Quality tier → how much work a frame may do. */
function qualityBudget(settings, auto) {
	const tier = settings.quality === "auto" ? auto : settings.quality;
	if (tier === "low") return { dustStep: 3, starStep: 2, dpr: 1, label: "low" };
	if (tier === "mid") return { dustStep: 2, starStep: 1, dpr: 2, label: "auto" };
	return { dustStep: 1, starStep: 1, dpr: 2, label: "high" };
}

/* ------------------------------------------------------------------ *
 * Scene
 * ------------------------------------------------------------------ */

/**
 * The interactive galaxy surface.
 * @param props - `graph`, settings and navigation callbacks.
 */
function GraphScene(props) {
	const { graph, settings, shapeKey, relayoutToken, onEnterSession, onOpenWorkspace, onSelectionChange, registerControls, onStats, t } = props;
	const wrapRef = useRef(null);
	const canvasRef = useRef(null);
	const tipRef = useRef(null);
	const stateRef = useRef(null);
	const loopRef = useRef({ raf: 0, ensure: () => {} });
	const [hover, setHover] = useState(null);
	const [card, setCard] = useState(null);
	const [lift, setLift] = useState(false);

	if (stateRef.current === null) {
		stateRef.current = {
			dpr: 1,
			width: 0,
			height: 0,
			cam: createCamera(),
			targetDistance: 2.9,
			fit: 2.9,
			galaxy: null,
			neighbours: new Map(),
			nebula: null,
			nebulaKey: "",
			reveal: 0,
			bloomed: false,
			spin: 0,
			time: 0,
			idleAt: 0,
			hoverId: null,
			selectedId: null,
			focusFolder: null,
			drag: null,
			moved: false,
			yawVelocity: 0,
			tour: false,
			tourAt: 0,
			tourTarget: null,
			projected: [],
			token: 0,
			keyIndex: -1,
			flyTo: null,
			guides: [],
			shellRadius: 1.2,
			trackId: null,
			trackNode: null,
			focusTween: null,
			pointerX: 0,
			pointerY: 0,
			settings,
			fps: 60,
			frameCost: 16
		};
	}
	const state = stateRef.current;
	state.settings = settings;

	/** Build (or re-roll) the galaxy when data, seed or shape changes. */
	useEffect(() => {
		const reseed = relayoutToken !== state.token;
		if (reseed) {
			state.token = relayoutToken;
			state.cam = createCamera();
			state.bloomed = false;
			state.tourTarget = null;
		}
		state.guides = layoutGuides(settings.layout);
		state.galaxy = createGalaxy(graph, state.token + 1, { layout: settings.layout, arms: settings.arms, twist: settings.twist, thickness: settings.thickness, spread: settings.spread });
		state.nodes = graph.nodes.length;
		state.links = graph.links.length;
		state.neighbours = neighboursOf(graph);
		// Frame the shell, not just the body: the ball has to be visible around the
		// stars, otherwise the shape looks like it is floating inside a full-frame haze.
		state.shellRadius = clamp(state.galaxy.extent * 1.22, 1, 2.1);
		state.fit = overviewDistance(state.shellRadius, state.cam.fov);
		state.targetDistance = state.fit;
		if (!state.bloomed) {
			state.reveal = 0.001;
			state.cam.distance = state.targetDistance * 1.35;
			state.bloomed = true;
		}
		if (!graph.nodes.some((node) => node.id === state.selectedId)) state.selectedId = null;
		if (state.focusFolder !== null && !graph.nodes.some((node) => node.id === state.focusFolder)) state.focusFolder = null;
		// A rebuilt graph hands out fresh node objects: drop the cached tracker. A new
		// silhouette also invalidates the dive — the subject has moved.
		state.trackNode = null;
		state.trackId = null;
		state.focusTween = null;
		loopRef.current.ensure();
	}, [graph, relayoutToken, shapeKey, state, settings.layout, settings.arms, settings.twist, settings.thickness, settings.spread]);

	/** Size the surface, bake the backdrop, keep the pixel ratio honest. */
	useEffect(() => {
		const canvas = canvasRef.current;
		const wrap = wrapRef.current;
		if (canvas === null || wrap === null) return;
		const resize = () => {
			const rect = wrap.getBoundingClientRect();
			const budget = qualityBudget(state.settings, state.tier ?? "high");
			const dpr = Math.min(budget.dpr, window.devicePixelRatio || 1);
			state.width = Math.max(1, Math.round(rect.width));
			state.height = Math.max(1, Math.round(rect.height));
			state.dpr = dpr;
			canvas.width = Math.round(state.width * dpr);
			canvas.height = Math.round(state.height * dpr);
			canvas.style.width = `${state.width}px`;
			canvas.style.height = `${state.height}px`;
			const key = `${state.width}x${state.height}@${dpr}:${state.settings.theme}:${state.settings.veil.toFixed(2)}:${state.settings.backdrop}`;
			if (state.nebulaKey !== key) {
				state.nebula = state.settings.backdrop ? bakeNebula(state.width, state.height, dpr, state.settings.theme, state.settings.veil) : null;
				state.nebulaKey = key;
			}
			loopRef.current.ensure();
		};
		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(wrap);
		return () => observer.disconnect();
	}, [state]);

	/** Re-bake the backdrop when the palette, veil or switch changes without a resize. */
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas === null || canvas === undefined) return;
		const key = `${state.width}x${state.height}@${state.dpr}:${settings.theme}:${settings.veil.toFixed(2)}:${settings.backdrop}`;
		if (key === state.nebulaKey) return;
		state.nebula = settings.backdrop ? bakeNebula(state.width, state.height, state.dpr, settings.theme, settings.veil) : null;
		state.nebulaKey = key;
	}, [settings.theme, settings.veil, settings.backdrop, state]);

	/** Frame loop: spin, ease, project, paint, report fps. */
	useEffect(() => {
		let last = 0;
		let reported = 0;
		const frame = (now) => {
			loopRef.current.raf = requestAnimationFrame(frame);
			const canvas = canvasRef.current;
			if (canvas === null || canvas === undefined) return;
			if (typeof document !== "undefined" && document.hidden) return;
			const delta = last === 0 ? 16 : Math.min(64, now - last);
			last = now;
			state.frameCost = state.frameCost * 0.9 + delta * 0.1;
			state.fps = Math.round(1000 / Math.max(8, state.frameCost));
			// Adaptive tier: only move when the cost is clearly outside the target band,
			// and at most every 1.5 s, so the shell never flickers between tiers.
			if (state.settings.quality === "auto" && now - (state.tierAt ?? 0) > 1500) {
				const cost = state.frameCost;
				const next = cost > 19 ? "low" : cost > 14.5 ? "mid" : "high";
				if (next !== state.tier) {
					state.tier = next;
					state.tierAt = now;
				}
			}
			stepScene(state, delta);
			if (now - reported > 900) {
				reported = now;
				onStats?.({
					fps: state.fps,
					ms: state.frameCost,
					nodes: state.nodes ?? 0,
					links: state.links ?? 0,
					quality: state.tier ?? (state.dpr >= 2 ? "high" : "low")
				});
			}
			renderScene(canvas, state);
		};
		loopRef.current.ensure = () => {
			if (loopRef.current.raf !== 0) return;
			loopRef.current.raf = requestAnimationFrame(frame);
		};
		loopRef.current.ensure();
		return () => {
			if (loopRef.current.raf !== 0) cancelAnimationFrame(loopRef.current.raf);
			loopRef.current.raf = 0;
		};
	}, [state, onStats, settings.quality]);

	/** Pointer → the star under the cursor, if any. */
	const pickStar = (event, canvas) => {
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		let best = null;
		let bestScore = Infinity;
		for (const entry of state.projected) {
			const distance = Math.hypot(entry.x - x, entry.y - y);
			// A point is 1-3 px wide: the hit area is what makes it clickable at all.
			const gate = Math.max(state.settings.layout === "spiral" ? 12 : 16, entry.radius * 0.9);
			if (distance > gate) continue;
			const score = distance / gate + entry.depth * 0.05;
			if (score < bestScore) {
				best = { node: entry.node, screenX: x, screenY: y };
				bestScore = score;
			}
		}
		return best;
	};

	/**
	 * Fly into a conversation: the galaxy hands over to the warp overlay, which
	 * reports back once the camera is inside the star's sphere so the chat is
	 * already mounted while the sphere dissolves.
	 */
	const enterSession = (node) => {
		if (node === undefined) return;
		const theme = themeOf(settings.theme);
		const index = Number.isFinite(node.hueIndex) ? node.hueIndex : 0;
		playWarp({
			hue: theme.hues[index % theme.hues.length],
			base: theme.base,
			onArrive: () => onEnterSession?.(node)
		});
	};

	/**
	 * Track one body: the camera glides onto it and keeps it centred while the
	 * galaxy turns. Workspaces (suns) frame wider than conversations, because a sun
	 * carries its whole star cluster around it.
	 * @param nodeId - node to hold.
	 */
	/** Where the camera should end up for one body: a dive, not a nudge. */
	const diveDistance = (node) => {
		const fit = state.fit ?? 3.4;
		// Conversations are small so they take a deeper dive; a workspace sun carries a
		// whole cluster, so it stops further out and lets the cluster read.
		return clamp(node.kind === "folder" ? Math.max(0.85, fit * 0.3) : Math.max(0.34, fit * 0.12), 0.26, 7);
	};

	const trackNodeById = (nodeId) => {
		const node = state.galaxy?.nodes.find((item) => item.id === nodeId);
		if (node === undefined) return;
		state.trackId = node.id;
		state.trackNode = node;
		state.flyTo = null;
		state.tour = false;
		state.idleAt = performance.now();
		const dive = diveDistance(node);
		// Timed cubic glide instead of an exponential chase: the same move reads as a
		// deliberate dive and lands instead of creeping in forever.
		state.focusTween = {
			startedAt: state.time * 1000,
			duration: node.kind === "folder" ? 1150 : 980,
			fromX: state.cam.target.x,
			fromY: state.cam.target.y,
			fromZ: state.cam.target.z,
			fromDistance: state.cam.distance,
			toX: node.x,
			toY: node.y,
			toZ: node.z,
			toDistance: dive
		};
		state.targetDistance = dive;
	};

	/** Stop tracking: draw back out to the whole galaxy with the same kind of glide. */
	const releaseTrack = () => {
		if (state.trackId === null) return;
		state.trackId = null;
		state.trackNode = null;
		state.focusTween = {
			startedAt: state.time * 1000,
			duration: 820,
			fromX: state.cam.target.x,
			fromY: state.cam.target.y,
			fromZ: state.cam.target.z,
			fromDistance: state.cam.distance,
			toX: 0,
			toY: 0,
			toZ: 0,
			toDistance: state.fit ?? 3.4
		};
		state.targetDistance = state.fit ?? 3.4;
	};

	/** Same behaviour as tracking, kept as the card's naming. */
	const flyToNode = (nodeId) => trackNodeById(nodeId);

	/** Place the info card beside a star, kept inside the stage. */
	const placeCard = (node, screenX, screenY) => {
		const width = 250;
		const height = node.kind === "folder" ? 300 : 150;
		const stage = wrapRef.current;
		const bounds = stage === null ? { width: 800, height: 600 } : stage.getBoundingClientRect();
		// While a body is tracked it sits in the middle of the stage, so the card
		// steps aside instead of covering the very thing being tracked.
		const offsetX = state.trackId === null ? 18 : screenX > bounds.width * 0.5 ? -width - 54 : 54;
		const left = Math.max(12, Math.min(bounds.width - width - 12, screenX + offsetX));
		const top = Math.max(12, Math.min(bounds.height - height - 12, screenY - 24));
		setCard({ id: node.id, left, top });
	};

	/** Pick a star from the projection by id and open its card. */
	const openCardFor = (nodeId, syncKey = true) => {
		const entry = state.projected.find((item) => item.node.id === nodeId);
		const node = graph.nodes.find((item) => item.id === nodeId);
		if (node === undefined) return;
		state.selectedId = nodeId;
		onSelectionChange?.(null);
		setCard(null);
		if (syncKey) state.keyIndex = graph.nodes.indexOf(node);
		if (entry === undefined) {
			placeCard(node, 40, 40);
			return;
		}
		placeCard(node, entry.x, entry.y);
	};

	const moveTip = (screenX, screenY) => {
		const tip = tipRef.current;
		if (tip === null || tip === undefined) return;
		const width = tip.offsetWidth || 220;
		const left = Math.min(window.innerWidth - width - 16, screenX + 16);
		tip.style.transform = `translate3d(${Math.max(8, left)}px, ${screenY + 18}px, 0)`;
	};

	const onPointerDown = (event) => {
		const canvas = event.currentTarget;
		canvas.setPointerCapture(event.pointerId);
		state.moved = false;
		state.yawVelocity = 0;
		state.drag = { x: event.clientX, y: event.clientY, yaw: state.cam.yaw, pitch: state.cam.pitch, at: performance.now() };
		state.idleAt = performance.now();
	};

	const onPointerMove = (event) => {
		const canvas = event.currentTarget;
		const rect = canvas.getBoundingClientRect();
		state.pointerX = event.clientX - rect.left;
		state.pointerY = event.clientY - rect.top;
		if (state.drag !== null) {
			const dx = event.clientX - state.drag.x;
			const dy = event.clientY - state.drag.y;
			if (Math.abs(dx) + Math.abs(dy) > 3) state.moved = true;
			state.cam.yaw = state.drag.yaw - dx * 0.0042;
			state.cam.pitch = clamp(state.drag.pitch + dy * 0.0032, 0.08, 1.45);
			state.yawVelocity = -dx * 0.0009;
			state.idleAt = performance.now();
			return;
		}
		const star = pickStar(event, canvas);
		const id = star === null ? null : star.node.id;
		if (id !== state.hoverId) {
			state.hoverId = id;
			state.hoverX = state.pointerX;
			state.hoverY = state.pointerY;
			setHover(star === null ? null : { id, kind: star.node.kind, label: star.node.label, path: star.node.path ?? star.node.cwd ?? "", meta: nodeMeta(star.node, t), hue: themeOf(state.settings.theme).hues[star.node.hueIndex % 8] });
		}
		if (star !== null) {
			// Hovering a star parks the idle cruise so the target stops drifting away.
			state.idleAt = performance.now();
			moveTip(state.pointerX, state.pointerY);
		}
		canvas.style.cursor = star === null ? (state.drag === null ? "grab" : "grabbing") : "pointer";
	};

	const endPointer = (event) => {
		const canvas = event.currentTarget;
		if (canvas.hasPointerCapture?.(event.pointerId) === true) canvas.releasePointerCapture(event.pointerId);
		const clicked = !state.moved && event.type === "pointerup";
		state.drag = null;
		if (!clicked) return;
		const star = pickStar(event, canvas);
		if (star === null) {
			state.selectedId = null;
			releaseTrack();
			setCard(null);
			onSelectionChange?.(null);
			return;
		}
		state.selectedId = star.node.id;
		// Clicking a body tracks it: the camera glides over and holds it centred.
		trackNodeById(star.node.id);
		// A mouse pick must not move the keyboard cursor: Tab then starts from the
		// first star, which is what a keyboard user expects.
		openCardFor(star.node.id, false);
	};

	const onDoubleClick = (event) => {
		const star = pickStar(event, event.currentTarget);
		if (star === null) return;
		if (star.node.kind === "folder") onOpenWorkspace?.(star.node.workspaceId);
		else enterSession(star.node);
	};

	/** Wheel dolly; non-passive so the page does not scroll. */
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas === null || canvas === undefined) return;
		const onWheel = (event) => {
			event.preventDefault();
			// A wheel mid-dive means the user is steering: hand the dolly back to them
			// but keep the subject tracked.
			state.focusTween = null;
			state.targetDistance = clamp(state.cam.distance * Math.exp(event.deltaY * 0.0028), 0.26, 7);
			state.idleAt = performance.now();
		};
		canvas.__dgvScene = state;
		canvas.addEventListener("wheel", onWheel, { passive: false });
		return () => canvas.removeEventListener("wheel", onWheel);
	}, [state]);

	/** Place a freshly mounted tooltip at the cursor. */
	useEffect(() => {
		if (hover !== null) moveTip(state.hoverX ?? state.pointerX, state.hoverY ?? state.pointerY);
	}, [hover, state]);

	/** Expose camera controls to the page header and the panel. */
	useEffect(() => {
		const fit = () => {
			state.cam.yaw = 0.55;
			state.cam.pitch = 0.62;
			state.cam.target = { x: 0, y: 0, z: 0 };
			state.fit = overviewDistance(state.shellRadius, state.cam.fov);
			state.targetDistance = state.fit;
			state.focusFolder = null;
			if (state.trackId !== null) releaseTrack();
			else {
				state.focusTween = {
					startedAt: state.time * 1000,
					duration: 780,
					fromX: state.cam.target.x,
					fromY: state.cam.target.y,
					fromZ: state.cam.target.z,
					fromDistance: state.cam.distance,
					toX: 0,
					toY: 0,
					toZ: 0,
					toDistance: state.fit
				};
			}
			state.selectedId = null;
			state.tourTarget = null;
			onSelectionChange?.(null);
		};
		registerControls?.({
			fit,
			focusFolder: (folderId) => {
				state.focusFolder = folderId;
			},
			replay: () => {
				state.reveal = 0.001;
				state.cam.distance = state.targetDistance * 1.35;
			},
			flyTo: flyToNode,
			setTour: (value) => {
				state.tour = value === true;
				state.tourAt = 0;
				if (!state.tour) state.tourTarget = null;
			}
		});
	}, [registerControls, state, onSelectionChange]);

	const onKeyDown = (event) => {
		const nodes = graph.nodes;
		if (event.key === "Escape") {
			state.selectedId = null;
			state.focusFolder = null;
			setCard(null);
			onSelectionChange?.(null);
			return;
		}
		if (event.key === "Tab" && nodes.length > 0) {
			event.preventDefault();
			const step = event.shiftKey ? -1 : 1;
			state.keyIndex = (state.keyIndex + step + nodes.length) % nodes.length;
			trackNodeById(nodes[state.keyIndex].id);
			openCardFor(nodes[state.keyIndex].id);
			return;
		}
		if (event.key === "Enter" && card !== null) {
			const node = nodes.find((item) => item.id === card.id);
			if (node === undefined) return;
			if (node.kind === "folder") onOpenWorkspace?.(node.workspaceId);
			else enterSession(node);
		}
	};

	const theme = themeOf(settings.theme);
	const cardNode = card === null ? null : graph.nodes.find((item) => item.id === card.id) ?? null;
	const cardHue = cardNode === null ? 0 : theme.hues[(Number.isFinite(cardNode.hueIndex) ? cardNode.hueIndex : 0) % theme.hues.length];
	const cardPath = cardNode === null ? "" : cardNode.kind === "folder" ? cardNode.path ?? "" : cardNode.cwd ?? "";
	const cardMeta = cardNode === null ? "" : nodeMeta(cardNode, t);
	const cardChildren =
		cardNode === null || cardNode.kind !== "folder"
			? []
			: graph.nodes.filter((item) => item.kind === "session" && item.folderId === cardNode.id).sort((left, right) => right.updatedAt - left.updatedAt);

	return h(
		"div",
		{ className: "dgv-stage", ref: wrapRef },
		h("canvas", {
			ref: canvasRef,
			className: "dgv-canvas",
			tabIndex: 0,
			role: "img",
			"aria-label": t("a11y.canvas"),
			onPointerDown,
			onPointerMove,
			onPointerUp: endPointer,
			onPointerCancel: endPointer,
			onPointerLeave: () => {
				if (state.hoverId === null) return;
				state.hoverId = null;
				setHover(null);
			},
			onDoubleClick,
			onKeyDown
		}),
		h("div", { className: "dgv-hint" }, t("hint.orbit")),
		cardNode !== null &&
			h(
				"div",
				{
					className: "dgv-card",
					style: { left: card.left, top: card.top },
					onPointerDown: (event) => event.stopPropagation()
				},
				h(
					"div",
					{ className: "dgv-card-head" },
					h("span", { className: "dgv-tip-dot", style: { background: `hsl(${cardHue}, 92%, 66%)`, boxShadow: `0 0 8px hsl(${cardHue}, 92%, 66%)` } }),
					h("span", { className: "dgv-tip-kind" }, t(cardNode.kind === "folder" ? "kind.folder" : "kind.session")),
					h("button", { type: "button", className: "dgv-panel-x", title: t("card.close"), onClick: () => { setCard(null); state.selectedId = null; } }, "×")
				),
				h("div", { className: "dgv-card-title" }, cardNode.label),
				cardPath !== "" && h("div", { className: "dgv-card-path" }, cardPath),
				cardMeta !== "" && h("div", { className: "dgv-card-meta" }, cardMeta),
				cardNode.kind === "folder" &&
					h(
						"div",
						{ className: "dgv-card-list" },
						h("div", { className: "dgv-list-note" }, t("card.children", { n: cardChildren.length }), cardChildren.length > 0 ? ` · ${t("card.hint")}` : ""),
						cardChildren.length === 0 && h("div", { className: "dgv-card-none" }, t("card.none")),
						...cardChildren.slice(0, 24).map((child) =>
							h(
								"button",
								{
									key: child.id,
									type: "button",
									className: "dgv-card-row",
									title: child.cwd,
									onClick: () => {
										flyToNode(child.id);
										openCardFor(child.id);
									},
									onDoubleClick: () => enterSession(child)
								},
								h("span", { className: `dgv-dot${child.running ? " dgv-dot-live" : ""}`, style: { background: `hsl(${themeOf(settings.theme).hues[child.hueIndex % 8]}, 92%, 66%)` } }),
								h("span", { className: "dgv-item-name" }, child.label),
								h("span", { className: "dgv-item-count" }, relativeTime(child.updatedAt, t))
							)
						)
					),
				h(
					"div",
					{ className: "dgv-card-actions" },
					h(
						"button",
						{
							type: "button",
							className: "dgv-btn dgv-btn-primary",
							onClick: () => {
								if (cardNode.kind === "folder") onOpenWorkspace?.(cardNode.workspaceId);
								else enterSession(cardNode);
							}
						},
						t(cardNode.kind === "folder" ? "card.enter" : "card.open")
					),
					cardNode.kind === "folder"
						? h(
								"button",
								{
									type: "button",
									className: "dgv-btn",
									onClick: () => {
										state.focusFolder = state.focusFolder === cardNode.id ? null : cardNode.id;
										onSelectionChange?.(state.focusFolder);
										flyToNode(cardNode.id);
									}
								},
								t("card.isolate")
							)
						: h(
								"button",
								{
									type: "button",
									className: "dgv-btn",
									onClick: () => {
										state.focusFolder = cardNode.folderId === "" ? null : cardNode.folderId;
										onSelectionChange?.(state.focusFolder);
										if (state.focusFolder !== null) flyToNode(state.focusFolder);
										setCard(null);
									}
								},
								t("card.focus")
							)
				)
			),
		hover !== null &&
			h(
				"div",
				{ className: "dgv-tip", ref: tipRef },
				h(
					"div",
					{ className: "dgv-tip-head" },
					h("span", { className: "dgv-tip-dot", style: { background: `hsl(${hover.hue}, 92%, 66%)`, boxShadow: `0 0 8px hsl(${hover.hue}, 92%, 66%)` } }),
					h("span", { className: "dgv-tip-kind" }, t(hover.kind === "folder" ? "kind.folder" : "kind.session"))
				),
				h("div", { className: "dgv-tip-title" }, hover.label),
				hover.path !== "" && h("div", { className: "dgv-tip-path" }, hover.path),
				hover.meta !== "" && h("div", { className: "dgv-tip-meta" }, hover.meta)
			)
	);
}

/** Tooltip metadata line: recency plus state flags. */
function nodeMeta(node, t) {
	const parts = [];
	const when = relativeTime(node.updatedAt, t);
	if (when !== "") parts.push(when);
	if (node.current) parts.push(t("state.current"));
	if (node.running) parts.push(t("state.running"));
	if (node.archived) parts.push(t("state.archived"));
	return parts.join(" · ");
}

/* ------------------------------------------------------------------ *
 * Simulation step + render
 * ------------------------------------------------------------------ */

/**
 * Advance the cinematic state: reveal bloom, idle spin, inertia, dolly easing, tour.
 */
function stepScene(state, delta) {
	const seconds = delta / 1000;
	const settings = state.settings;
	state.time += seconds;
	state.reveal = Math.min(1, state.reveal + seconds / 1.1);
	state.cam.distance += (state.targetDistance - state.cam.distance) * Math.min(1, seconds * 6);

	const idle = performance.now() - state.idleAt > 1600 && state.focusTween === null;
	if (settings.autoOrbit && state.drag === null && idle) {
		// Slow by default: one revolution takes minutes, not a minute and a half.
		state.cam.yaw += seconds * 0.02 * settings.orbitSpeed;
		state.yawVelocity *= 0.92;
	} else if (state.drag === null && Math.abs(state.yawVelocity) > 0.00002) {
		state.cam.yaw += state.yawVelocity;
		state.yawVelocity *= 0.9;
	}

	// Camera glide: one timed cubic tween owns both the orbit centre and the dolly,
	// so a dive lands on the star instead of asymptotically creeping towards it.
	if (state.focusTween !== null) {
		const tween = state.focusTween;
		const progress = Math.min(1, (state.time * 1000 - tween.startedAt) / tween.duration);
		const eased = easeInOutCubic(progress);
		state.cam.target.x = tween.fromX + (tween.toX - tween.fromX) * eased;
		state.cam.target.y = tween.fromY + (tween.toY - tween.fromY) * eased;
		state.cam.target.z = tween.fromZ + (tween.toZ - tween.fromZ) * eased;
		state.cam.distance = tween.fromDistance + (tween.toDistance - tween.fromDistance) * eased;
		state.flyTo = null;
		if (progress >= 1) {
			state.cam.distance = tween.toDistance;
			state.targetDistance = tween.toDistance;
			state.focusTween = null;
		}
	}

	// Tracking: hold the subject in the middle once the glide has landed, so the
	// galaxy orbits around it instead of drifting it off screen.
	if (state.trackId !== null && state.focusTween === null) {
		if (state.trackNode === null) {
			state.trackNode = state.galaxy?.nodes.find((node) => node.id === state.trackId) ?? null;
			if (state.trackNode === null) state.trackId = null;
		}
		if (state.trackNode !== null) {
			state.cam.target.x += (state.trackNode.x - state.cam.target.x) * Math.min(1, seconds * 8);
			state.cam.target.y += (state.trackNode.y - state.cam.target.y) * Math.min(1, seconds * 8);
			state.cam.target.z += (state.trackNode.z - state.cam.target.z) * Math.min(1, seconds * 8);
		}
	}

	// Teleport: glide the orbit centre onto the chosen star.
	if (state.flyTo !== null) {
		const ease = Math.min(1, seconds * 2.6);
		state.cam.target.x += (state.flyTo.x - state.cam.target.x) * ease;
		state.cam.target.y += (state.flyTo.y - state.cam.target.y) * ease;
		state.cam.target.z += (state.flyTo.z - state.cam.target.z) * ease;
		const gap = Math.hypot(state.flyTo.x - state.cam.target.x, state.flyTo.y - state.cam.target.y, state.flyTo.z - state.cam.target.z);
		if (gap < 0.004) state.flyTo = null;
	}

	// Wander: every few seconds glide to another active conversation.
	if (state.trackId !== null) {
		state.spin += seconds * 0.012;
		return;
	}
	if (state.tour && state.galaxy !== null) {
		if (state.time > state.tourAt || state.tourTarget === null) {
			state.tourAt = state.time + 5.5;
			const candidates = state.galaxy.nodes.filter((node) => node.kind === "session");
			if (candidates.length > 0) {
				const pick = candidates[Math.floor(hash01(`tour:${Math.floor(state.time)}`) * candidates.length) % candidates.length];
				state.tourTarget = { x: pick.x, y: pick.y, z: pick.z };
			}
		}
		if (state.tourTarget !== null) {
			const ease = Math.min(1, seconds * 1.1);
			state.cam.target.x += (state.tourTarget.x - state.cam.target.x) * ease;
			state.cam.target.y += (state.tourTarget.y - state.cam.target.y) * ease;
			state.cam.target.z += (state.tourTarget.z - state.cam.target.z) * ease;
		}
	} else if (state.cam.target.x !== 0 || state.cam.target.y !== 0 || state.cam.target.z !== 0) {
		const ease = Math.min(1, seconds * 1.6);
		state.cam.target.x *= 1 - ease;
		state.cam.target.y *= 1 - ease;
		state.cam.target.z *= 1 - ease;
	}
	state.spin += seconds * 0.012;
}

/** Current node hue for the active palette. */
function nodeHue(settings, node) {
	const theme = themeOf(settings.theme);
	// A star without a palette slot must not produce a NaN hue: that would make
	// createRadialGradient throw and silently kill the rest of the frame.
	const index = Number.isFinite(node.hueIndex) ? node.hueIndex : 0;
	return theme.hues[((index % theme.hues.length) + theme.hues.length) % theme.hues.length];
}

/** Paint one frame. */
function renderScene(canvas, state) {
	const context = canvas.getContext("2d");
	const settings = state.settings;
	if (context === null || state.galaxy === null) return;
	const theme = themeOf(settings.theme);
	const [lr, lg, lb] = theme.link;
	const linkColor = {
		touched: `rgba(${lr},${lg},${lb},0.85)`,
		lineage: `rgba(${lr},${lg},${lb},0.26)`,
		plain: `rgba(${lr},${lg},${lb},0.16)`
	};
	const budget = qualityBudget(settings, state.tier ?? (state.dpr >= 2 ? "high" : "low"));
	const width = state.width;
	const height = state.height;
	context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
	context.globalAlpha = 1;
	context.globalCompositeOperation = "source-over";
	context.clearRect(0, 0, width, height);
	if (state.nebula !== null) {
		context.drawImage(state.nebula, 0, 0, width, height);
	} else {
		context.fillStyle = theme.base;
		context.fillRect(0, 0, width, height);
	}

	const viewport0 = { width, height };
	const reveal = easeOut(state.reveal);
	const bright = clamp(settings.brightness * 1.15, 0.05, 1.4);
	const halo = 0.75 + settings.bloom * 1.1;
	// "阈值" hardens the sprite: above the knee the halo stops washing the core out.
	const haloAlpha = Math.max(0.15, 1 - clamp(settings.threshold, 0, 1) * 0.8);

	// Sky shell: hard squares at fixed CSS sizes (never distance-attenuated), snapped
	// to device pixels and batched into one path per (class, tint) bucket.
	const skyBasis = cameraBasis(state.cam);
	const skySpin = state.time * 0.0008;
	const skyCos = Math.cos(skySpin);
	const skySin = Math.sin(skySpin);
	const skyTarget = state.cam.target;
	const skyRadius = state.shellRadius ?? 1.2;
	const tierThin = budget.label === "low" ? 0.4 : budget.label === "auto" ? 0.7 : 1;
	const skyKeep = clamp(0.3 + clamp(settings.field, 0, 1), 0, 1) * tierThin;
	const skySize = clamp(settings.shellSize, 0.4, 2.4);
	// Kept for the dust and star passes: off the disc they draw sharper.
	const softShell = settings.layout === "spiral";
	// Focus pull: while a body is tracked the shell steps back so the subject reads.
	const proximity = clamp(state.cam.distance / 1.9, 0.5, 1);
	const focusPull = (state.trackId !== null ? 0.78 : 1) * proximity;
	const skyGlow = clamp(settings.shellGlow, 0, 2);
	const skyAlpha = (0.5 + 0.5 * Math.min(1, skyGlow)) * focusPull;
	const skyFill = skyStyles(Math.round(skyGlow * 20) / 20);
	const dprNow = state.dpr;
	{
		const eye = skyBasis.eye;
		const fwd = skyBasis.forward;
		const right = skyBasis.right;
		const up = skyBasis.up;
		const focal = (Math.min(width, height) * 0.5) / Math.tan(0.41);
		const halfW = width * 0.5;
		const halfH = height * 0.5;
		const sx = SKY.x;
		const sy = SKY.y;
		const sz = SKY.z;
		const keep = SKY.keep;

		// One L-class grain twinkles at a time, on a Poisson schedule (~20 s mean wait).
		if (state.skyTwinkle === undefined) state.skyTwinkle = { index: -1, start: 0, next: state.time + 4, serial: 0 };
		const twinkle = state.skyTwinkle;
		if (twinkle.index >= 0 && state.time - twinkle.start > 1.6) twinkle.index = -1;
		if (twinkle.index < 0 && state.time >= twinkle.next && SKY.large.length > 0) {
			twinkle.serial += 1;
			const [pick, wait] = hashStreams(`sky-twinkle/${twinkle.serial}`, 2);
			twinkle.index = SKY.large[Math.floor(pick * SKY.large.length) % SKY.large.length];
			twinkle.start = state.time;
			twinkle.next = state.time + 1.6 + clamp((-Math.log(Math.max(1e-6, wait)) * 6) / 0.3, 1.5, 90);
		}

		// Tiny halos for the bright grains and the twinkler, added under the squares.
		const brightFrom = SKY.bucketStart[(SKY_CLASSES.length - 1) * SKY_TINTS.length + SKY_BRIGHT_TINT];
		const brightTo = SKY.bucketEnd[(SKY_CLASSES.length - 1) * SKY_TINTS.length + SKY_BRIGHT_TINT];
		context.globalCompositeOperation = "lighter";
		const haloSize = SKY_HALO_RADIUS * 2;
		const brightCount = Math.max(0, brightTo - brightFrom);
		for (let slot = 0; slot <= brightCount; slot += 1) {
			const grain = slot < brightCount ? brightFrom + slot : twinkle.index;
			if (grain < 0 || keep[grain] >= skyKeep) continue;
			if (slot === brightCount && grain >= brightFrom && grain < brightTo) continue;
			const gx = sx[grain] * skyRadius;
			const gz = sz[grain] * skyRadius;
			const dx = skyTarget.x + gx * skyCos - gz * skySin - eye.x;
			const dy = skyTarget.y + sy[grain] * skyRadius - eye.y;
			const dz = skyTarget.z + gx * skySin + gz * skyCos - eye.z;
			const depth = dx * fwd.x + dy * fwd.y + dz * fwd.z;
			if (depth <= 0.08) continue;
			const px = halfW + ((dx * right.x + dy * right.y + dz * right.z) / depth) * focal;
			const py = halfH - ((dx * up.x + dy * up.y + dz * up.z) / depth) * focal;
			if (px < -haloSize || px > width + haloSize || py < -haloSize || py > height + haloSize) continue;
			const swell = grain === twinkle.index ? 1 + 2.2 * Math.sin((Math.PI * clamp(state.time - twinkle.start, 0, 1.6)) / 1.6) : 1;
			context.globalAlpha = Math.min(1, 0.12 * swell * skyAlpha);
			context.drawImage(sparkSprite(SKY.tint[grain], dprNow), px - SKY_HALO_RADIUS, py - SKY_HALO_RADIUS, haloSize, haloSize);
		}

		context.globalCompositeOperation = "source-over";
		context.globalAlpha = Math.min(1, skyAlpha);
		paintGrainSquares(context, SKY, skyRadius, skySpin, skyTarget, skyBasis, focal, width, height, dprNow, skyKeep, skySize, skyFill);
		// The inner field layer turns the other way, slower, and a shade dimmer than the shell.
		context.globalAlpha = Math.min(1, skyAlpha * 0.8);
		paintGrainSquares(context, FIELD, skyRadius, state.time * -0.00048, skyTarget, skyBasis, focal, width, height, dprNow, skyKeep, skySize, skyFill);
	}
	context.globalAlpha = 1;
	// Dust, guides and filaments below are additive.
	context.globalCompositeOperation = "lighter";

	const basis = skyBasis;
	const viewport = { width, height };
	const scale = 0.35 + 0.65 * reveal;
	const hot = state.hoverId ?? state.selectedId;
	const focusId = state.focusFolder;
	const neighbours = state.neighbours;
	const lens = settings.lens;
	const query = settings.filterText.trim().toLowerCase();

	const matchesLens = (node) => {
		if (lens === null) return true;
		if (lens === "running") return node.running === true;
		if (lens === "current") return node.current === true;
		if (lens === "fork") return typeof node.parentId === "string" && node.parentId !== "";
		if (lens === "archived") return node.archived === true;
		return true;
	};

	const isDim = (node) => {
		if (lens !== null && !matchesLens(node)) return true;
		if (focusId !== null && node.id !== focusId && node.folderId !== focusId) return true;
		if (hot !== null && node.id !== hot) {
			const set = neighbours.get(hot);
			if (set === undefined || !set.has(node.id)) return true;
		}
		return false;
	};

	const project = (x, y, z) => projectPoint({ x: x * scale, y: y * scale, z: z * scale }, basis, viewport);

	// Dust lanes: sub-pixel haze, no picking, additive.
	if (settings.mist > 0.01) {
		const dustBasis = basis;
		const eye = dustBasis.eye;
		const fwd = dustBasis.forward;
		const right = dustBasis.right;
		const up = dustBasis.up;
		const focal = (Math.min(width, height) * 0.5) / Math.tan(0.41);
		const halfW = width * 0.5;
		const halfH = height * 0.5;
		const dustAlpha = reveal * settings.mist * 3.2;
		const dustHues = theme.hues;
		for (let index = 0; index < state.galaxy.dust.length; index += budget.dustStep) {
			const grain = state.galaxy.dust[index];
			const dx = grain.x * scale - eye.x;
			const dy = grain.y * scale - eye.y;
			const dz = grain.z * scale - eye.z;
			const depth = dx * fwd.x + dy * fwd.y + dz * fwd.z;
			if (depth <= 0.08) continue;
			const step = focal / depth;
			const size = clamp(grain.size * step * 0.016, 1, softShell ? 4.6 : 2.7);
			const px = halfW + ((dx * right.x + dy * right.y + dz * right.z) / depth) * focal;
			const py = halfH - ((dx * up.x + dy * up.y + dz * up.z) / depth) * focal;
			if (px < -size || px > width + size || py < -size || py > height + size) continue;
			context.globalAlpha = grain.alpha * dustAlpha * Math.min(1, 2.4 / depth);
			context.drawImage(dustSprite(dustHues[index % dustHues.length]), px - size, py - size, size * 2, size * 2);
		}
	}
	context.globalAlpha = 1;

	// Stars: project once, keep the screen footprint for picking later.
	const projected = [];
	for (const node of state.galaxy.nodes) {
		const point = project(node.x, node.y, node.z);
		if (point === null) {
			node._p = null;
			continue;
		}
		node._p = point;
		const radius = Math.max(1.4, node.size * point.scale * (node.kind === "folder" ? 0.022 : 0.017));
		projected.push({ node, x: point.x, y: point.y, depth: point.depth, radius });
	}
	projected.sort((left, right) => right.depth - left.depth);
	state.projected = projected;

	// Proximity bloom: as the dive lands, the subject lights its own frame.
	if (state.trackNode !== null && state.cam.distance < 1.6) {
		const near = clamp((1.6 - state.cam.distance) / 1.6, 0, 1);
		const halo = Math.min(width, height) * (0.22 + near * 0.3);
		const anchor = project(state.trackNode.x, state.trackNode.y, state.trackNode.z);
		if (anchor !== null) {
			const wash = context.createRadialGradient(anchor.x, anchor.y, 0, anchor.x, anchor.y, halo);
			wash.addColorStop(0, `hsla(${state.trackNode.hue}, 92%, 70%, ${0.2 * near})`);
			wash.addColorStop(0.55, `hsla(${state.trackNode.hue}, 88%, 62%, ${0.07 * near})`);
			wash.addColorStop(1, "rgba(0,0,0,0)");
			context.globalCompositeOperation = "lighter";
			context.globalAlpha = 1;
			context.fillStyle = wash;
			context.beginPath();
			context.arc(anchor.x, anchor.y, halo, 0, TAU);
			context.fill();
		}
	}

	// Layout guides: the faint skeleton that names the silhouette (rings, strands,
	// a wireframe shell, a box, a sheet, spokes). Drawn under the filaments.
	if (state.guides.length > 0) {
		context.globalAlpha = 0.2 * reveal * bright;
		context.strokeStyle = `rgb(${lr}, ${lg}, ${lb})`;
		context.lineWidth = 0.7;
		for (const line of state.guides) {
			context.beginPath();
			let started = false;
			for (const [gx, gy, gz] of line) {
				const point = project(gx, gy, gz);
				if (point === null) {
					started = false;
					continue;
				}
				if (started) context.lineTo(point.x, point.y);
				else {
					context.moveTo(point.x, point.y);
					started = true;
				}
			}
			context.stroke();
		}
		context.globalAlpha = 1;
	}

	// Filaments: curved away from the core, faint, additive.

	for (const link of state.galaxy.links) {
		const a = state.galaxy.nodes[link.a];
		const b = state.galaxy.nodes[link.b];
		if (a === undefined || b === undefined || a._p == null || b._p == null) continue;
		const touched = hot !== null && (a.id === hot || b.id === hot);
		const dimmed = isDim(a) || isDim(b);
		const midX = (a._p.x + b._p.x) / 2;
		const midY = (a._p.y + b._p.y) / 2;
		const bow = link.kind === "lineage" ? 0.16 : 0.07;
		context.beginPath();
		context.moveTo(a._p.x, a._p.y);
		context.quadraticCurveTo(midX + (midX - width / 2) * bow, midY + (midY - height / 2) * bow, b._p.x, b._p.y);
		context.strokeStyle = touched ? linkColor.touched : link.kind === "lineage" ? linkColor.lineage : linkColor.plain;
		context.globalAlpha = (dimmed ? 0.04 : touched ? 0.72 : link.kind === "lineage" ? 0.34 : 0.2) * bright;
		context.lineWidth = touched ? 1 : 0.55;
		context.stroke();
	}
	context.globalAlpha = 1;

	// Stars, far to near: light points, not bodies. The shell owns "ball" here.
	for (const entry of projected) {
		const node = entry.node;
		const dimmed = isDim(node);
		const depthFade = Math.max(0.3, Math.min(1, 2.3 / (entry.depth + 0.9)));
		let alpha = depthFade * bright * (dimmed ? 0.14 : 1);
		if (node.archived) alpha *= 0.55;
		if (node.kind === "folder") {
			const hue = nodeHue(settings, node);
			const radius = entry.radius * halo * (softShell ? 1.15 : 0.8);
			context.globalAlpha = Math.min(1, alpha * 0.9);
			context.drawImage(glowSprite(hue, 1), entry.x - radius, entry.y - radius, radius * 2, radius * 2);
			if (!softShell) {
				// Against a white point cloud a 2 px core disappears; the sun needs body.
				const sun = clamp(entry.radius * 0.34, 2.4, 4.6);
				context.globalAlpha = Math.min(1, alpha * 1.4 + 0.3);
				context.fillStyle = `hsl(${hue}, 92%, 64%)`;
				context.beginPath();
				context.arc(entry.x, entry.y, sun, 0, TAU);
				context.fill();
				context.strokeStyle = "rgba(6,8,14,0.65)";
				context.lineWidth = 1;
				context.stroke();
				continue;
			}
			// A small solid core keeps the sun crisp instead of cottony.
			const coreRadius = Math.max(1.8, Math.min(4.2, entry.radius * 0.3));
			context.globalAlpha = Math.min(1, alpha * haloAlpha + 0.35);
			context.fillStyle = `hsla(${hue}, 98%, 80%, 1)`;
			context.beginPath();
			context.arc(entry.x, entry.y, coreRadius, 0, TAU);
			context.fill();
			continue;
		}
		const pulse = node.running ? 1 + 0.09 * Math.sin(state.time * 2.4 + hash01(node.id) * TAU) : 1;
		const radius = entry.radius * pulse * halo * 1.25;
		const hue = nodeHue(settings, node) + (hash01(`${node.id}:hue`) * 20 - 10);
		context.globalAlpha = Math.min(1, alpha * 0.62);
		context.drawImage(glowSprite(hue, node.current ? 1 : 0.9), entry.x - radius, entry.y - radius, radius * 2, radius * 2);
		if (!softShell) {
			const body = clamp(entry.radius * 0.45, 2.2, 5);
			context.globalAlpha = Math.min(1, alpha * 1.5 + 0.3);
			context.fillStyle = `hsl(${hue}, 94%, ${node.current ? 74 : 66}%)`;
			context.beginPath();
			context.arc(entry.x, entry.y, body, 0, TAU);
			context.fill();
			context.strokeStyle = "rgba(6,8,14,0.6)";
			context.lineWidth = 1;
			context.stroke();
			if (node.current) {
				context.beginPath();
				context.arc(entry.x, entry.y, entry.radius * 1.8, 0, TAU);
				context.strokeStyle = "rgba(255,255,255,0.55)";
				context.lineWidth = 1;
				context.globalAlpha = Math.min(1, alpha + 0.2);
				context.stroke();
			}
			continue;
		}
		// A ~1 px coloured centre: points stay points, dense clusters stay separable.
		const dot = clamp(entry.radius * 0.22, 0.7, 1.7);
		context.globalAlpha = Math.min(1, alpha * 1.4);
		context.fillStyle = `hsla(${hue}, 96%, 76%, 1)`;
		context.beginPath();
		context.arc(entry.x, entry.y, dot, 0, TAU);
		context.fill();
		if (node.current) {
			context.beginPath();
			context.arc(entry.x, entry.y, entry.radius * 1.8, 0, TAU);
			context.strokeStyle = `rgba(255,255,255,${0.5 * bright})`;
			context.lineWidth = 1;
			context.globalAlpha = Math.min(1, alpha + 0.15);
			context.stroke();
		}
	}
	context.globalAlpha = 1;

	// Captions: workspace names always; a session name only when it matters.
	context.globalCompositeOperation = "source-over";
	context.textAlign = "center";
	context.textBaseline = "top";
	context.font = "500 10.5px ui-sans-serif, -apple-system, 'PingFang SC', system-ui, sans-serif";
	const placed = [];
	for (const entry of projected) {
		const node = entry.node;
		const dimmed = isDim(node);
		const emphasised = node.id === hot || (query !== "" && matches(node, query));
		if (!(node.kind === "folder" || emphasised || node.current)) continue;
		const fade = Math.max(0.14, Math.min(1, 2.6 / (entry.depth + 1.1))) * (dimmed ? 0.2 : 1) * (0.6 + bright * 0.5);
		const text = node.label.length > 22 ? `${node.label.slice(0, 21)}…` : node.label;
		const labelWidth = context.measureText(text).width;
		const labelY = entry.y + Math.max(6, entry.radius) + 6;
		const box = [entry.x - labelWidth / 2 - 2, labelY - 1, labelWidth + 4, 13];
		const collides = placed.some(([x, y, w, hh]) => box[0] < x + w && x < box[0] + box[2] && box[1] < y + hh && y < box[1] + box[3]);
		if (collides) continue;
		placed.push(box);
		context.globalAlpha = fade;
		context.shadowColor = "rgba(0,0,0,0.9)";
		context.shadowBlur = 6;
		context.fillStyle = emphasised ? "rgba(232,240,255,0.92)" : "rgba(186,200,228,0.62)";
		context.fillText(text, entry.x, labelY);
	}
	state.labelBoxes = placed;
	context.shadowBlur = 0;
	context.globalAlpha = 1;
}

/* ------------------------------------------------------------------ *
 * Control panel
 * ------------------------------------------------------------------ */

/** One labelled slider row; double-click the label to restore the default. */
function Slider({ label, value, min, max, step, fallback, onChange }) {
	return h(
		"label",
		{ className: "dgv-row" },
		h(
			"span",
			{ className: "dgv-row-label", onDoubleClick: () => onChange(fallback), title: "双击还原" },
			label
		),
		h("input", { type: "range", min, max, step, value, onChange: (event) => onChange(Number(event.target.value)) }),
		h("span", { className: "dgv-row-value" }, step < 1 ? Number(value).toFixed(2) : String(value))
	);
}

/** A preset card with a live mini-swatch. */
function PresetCard({ id, label, sub, active, palette, onClick }) {
	return h(
		"button",
		{ type: "button", className: `dgv-preset${active ? " dgv-preset-on" : ""}`, onClick, title: sub },
		h(
			"span",
			{ className: "dgv-preset-art", "aria-hidden": "true" },
			...palette.map((hue, index) =>
				h("i", {
					key: hue + index,
					style: {
						left: `${12 + index * 13}%`,
						top: `${58 - index * 9}%`,
						background: `hsl(${hue}, 92%, 68%)`,
						boxShadow: `0 0 7px hsl(${hue}, 92%, 64%)`,
						opacity: 1 - index * 0.12
					}
				})
			)
		),
		h("span", { className: "dgv-preset-text" }, h("b", null, label), h("small", null, sub))
	);
}

/**
 * The left control panel modelled on Galaxy View's: presets, filters, colour,
 * backdrop, bloom, shape, navigation, advanced, and a live stats line.
 * @param props - settings plus setters and scene controls.
 */
function ControlPanel(props) {
	const { t, settings, update, applyPreset, revertPreset, themes, presets, myPresets, saveMyPreset, applyMyPreset, dropMyPreset, workspaces, stats, controls, onClose, qualityLabel } = props;
	const [open, setOpen] = useState({ look: true, filter: true, color: false, backdrop: false, bloom: false, shape: false, motion: false, advanced: false });
	const toggle = (key) => setOpen((value) => ({ ...value, [key]: !value[key] }));
	const custom = isCustomised(settings);
	const theme = themeOf(settings.theme);

	return h(
		"aside",
		{ className: "dgv-panel", "aria-label": t("panel.open") },
		h(
			"div",
			{ className: "dgv-panel-head" },
			h("span", { className: "dgv-panel-title" }, t("panel.notes", { n: stats.sessions })),
			h("span", { className: "dgv-panel-locale" }, "中"),
			h("button", { type: "button", className: "dgv-panel-x", onClick: onClose, title: t("panel.close") }, "×")
		),
		h(
			"div",
			{ className: "dgv-panel-actions" },
			h("button", { type: "button", className: "dgv-btn dgv-btn-wide", onClick: () => controls.fit() }, t("panel.recenter"))
		),
		// Presets
		h(
			"section",
			{ className: "dgv-section" },
			h("button", { type: "button", className: "dgv-section-head", onClick: () => toggle("look") }, t("sec.look"), h("span", null, open.look ? "−" : "+")),
			open.look &&
				h(
					"div",
					{ className: "dgv-presets" },
					...Object.keys(PRESETS).map((id) =>
						h(PresetCard, {
							key: id,
							id,
							label: t(`preset.${id}`),
							sub: t(`preset.${id}.sub`),
							active: settings.preset === id,
							palette: THEMES[PRESETS[id].theme].hues.slice(0, 5),
							onClick: () => applyPreset(id)
						})
					)
				)
		),
		// Filter: workspaces by colour + count
		h(
			"section",
			{ className: "dgv-section" },
			h(
				"button",
				{ type: "button", className: "dgv-section-head", onClick: () => toggle("filter") },
				t("sec.filter"),
				h("span", { className: "dgv-section-sub" }, t("filter.all")),
				h("span", null, open.filter ? "−" : "+")
			),
			open.filter &&
				h(
					"div",
					{ className: "dgv-list" },
					h("div", { className: "dgv-list-note" }, t("filter.hiddenNote")),
					...workspaces.map((workspace) =>
						h(
							"button",
							{
								key: workspace.id,
								type: "button",
								className: `dgv-item${settings.hidden.includes(workspace.workspaceId) ? " dgv-item-off" : ""}`,
								onClick: () => update({ hidden: settings.hidden.includes(workspace.workspaceId) ? settings.hidden.filter((id) => id !== workspace.workspaceId) : settings.hidden.concat(workspace.workspaceId) }),
								onDoubleClick: (event) => {
									event.preventDefault();
									update({ only: settings.only === workspace.workspaceId ? null : workspace.workspaceId });
								},
								title: workspace.path
							},
							h("span", { className: "dgv-dot", style: { background: `hsl(${theme.hues[workspace.hueIndex % 8]}, 92%, 66%)`, boxShadow: `0 0 6px hsl(${theme.hues[workspace.hueIndex % 8]}, 92%, 66%)` } }),
							h("span", { className: "dgv-item-name" }, workspace.title),
							h("span", { className: "dgv-item-count" }, workspace.count)
						)
					),
					h("div", { className: "dgv-toggles" },
						h("button", { type: "button", className: `dgv-chip${settings.orphans ? " dgv-chip-on" : ""}`, onClick: () => update({ orphans: !settings.orphans }) }, t("filter.orphans")),
						h("button", { type: "button", className: `dgv-chip${settings.empty ? " dgv-chip-on" : ""}`, onClick: () => update({ empty: !settings.empty }) }, t("filter.empty")),
						(settings.hidden.length > 0 || settings.only !== null) &&
							h("button", { type: "button", className: "dgv-chip dgv-chip-on", onClick: () => update({ hidden: [], only: null, orphans: false, empty: false }) }, t("filter.all"))
					),
					h("input", { className: "dgv-search dgv-search-block", value: settings.filterText, placeholder: t("filter.byName"), onChange: (event) => update({ filterText: event.target.value }) })
				)
		),
		// Status lens (our stand-in for tag lenses: sessions have no tags)
		h(
			"section",
			{ className: "dgv-section" },
			h("button", { type: "button", className: "dgv-section-head", onClick: () => toggle("status") }, t("sec.status"), h("span", null, open.status ? "−" : "+")),
			open.status &&
				h(
					"div",
					{ className: "dgv-toggles" },
					...["all", "running", "current", "fork", "archived"].map((lens) =>
						h(
							"button",
							{
								key: lens,
								type: "button",
								className: `dgv-chip${(lens === "all" ? settings.lens === null : settings.lens === lens) ? " dgv-chip-on" : ""}`,
								onClick: () => update({ lens: lens === "all" ? null : settings.lens === lens ? null : lens })
							},
							t(`lens.${lens}`)
						)
					)
				)
		),
		// Colour
		h(
			"section",
			{ className: "dgv-section" },
			h(
				"button",
				{ type: "button", className: "dgv-section-head", onClick: () => toggle("color") },
				t("sec.color"),
				custom ? h("span", { className: "dgv-badge" }, t("custom")) : null,
				custom ? h("span", { className: "dgv-revert", role: "button", tabIndex: 0, onClick: (event) => { event.stopPropagation(); revertPreset(); } }, t("revert")) : null,
				h("span", null, open.color ? "−" : "+")
			),
			open.color &&
				h(
					"div",
					{ className: "dgv-toggles" },
					...themes.map((name) =>
						h(
							"button",
							{ key: name, type: "button", className: `dgv-chip dgv-chip-theme${settings.theme === name ? " dgv-chip-on" : ""}`, onClick: () => update({ theme: name }) },
							h("i", { style: { background: `hsl(${THEMES[name].hues[1]}, 92%, 66%)` } }),
							t(`theme.${name}`)
						)
					)
				)
		),
		// Deep-space backdrop
		h(
			"section",
			{ className: "dgv-section" },
			h("button", { type: "button", className: "dgv-section-head", onClick: () => toggle("backdrop") }, t("sec.backdrop"), h("span", null, open.backdrop ? "−" : "+")),
			open.backdrop &&
				h(
					"div",
					{ className: "dgv-rows" },
					h(Slider, { label: t("slider.veil"), value: settings.veil, min: 0, max: 1, step: 0.01, fallback: PRESETS[settings.preset]?.veil ?? DEFAULTS.veil, onChange: (value) => update({ veil: value }) }),
					h(Slider, { label: t("slider.field"), value: settings.field, min: 0, max: 1, step: 0.01, fallback: PRESETS[settings.preset]?.field ?? DEFAULTS.field, onChange: (value) => update({ field: value }) }),
					h(Slider, { label: t("slider.shellSize"), value: settings.shellSize, min: 0.4, max: 2.4, step: 0.05, fallback: DEFAULTS.shellSize, onChange: (value) => update({ shellSize: value }) }),
					h(Slider, { label: t("slider.shellGlow"), value: settings.shellGlow, min: 0, max: 2, step: 0.05, fallback: DEFAULTS.shellGlow, onChange: (value) => update({ shellGlow: value }) }),
					h(Slider, { label: t("slider.mist"), value: settings.mist, min: 0, max: 1, step: 0.01, fallback: PRESETS[settings.preset]?.mist ?? DEFAULTS.mist, onChange: (value) => update({ mist: value }) }),
					h("button", { type: "button", className: `dgv-btn dgv-btn-wide${settings.backdrop ? " dgv-btn-on" : ""}`, onClick: () => update({ backdrop: !settings.backdrop }) }, t(settings.backdrop ? "backdrop.on" : "backdrop.off"))
				)
		),
		// Bloom
		h(
			"section",
			{ className: "dgv-section" },
			h(
				"button",
				{ type: "button", className: "dgv-section-head", onClick: () => toggle("bloom") },
				t("sec.bloom"),
				custom ? h("span", { className: "dgv-badge" }, t("custom")) : null,
				h("span", null, open.bloom ? "−" : "+")
			),
			open.bloom &&
				h(
					"div",
					{ className: "dgv-rows" },
					h(Slider, { label: t("slider.brightness"), value: settings.brightness, min: 0.05, max: 1, step: 0.01, fallback: PRESETS[settings.preset]?.brightness ?? DEFAULTS.brightness, onChange: (value) => update({ brightness: value }) }),
					h(Slider, { label: t("slider.bloom"), value: settings.bloom, min: 0, max: 1, step: 0.01, fallback: PRESETS[settings.preset]?.bloom ?? DEFAULTS.bloom, onChange: (value) => update({ bloom: value }) }),
					h(Slider, { label: t("slider.threshold"), value: settings.threshold, min: 0, max: 1, step: 0.01, fallback: PRESETS[settings.preset]?.threshold ?? DEFAULTS.threshold, onChange: (value) => update({ threshold: value }) })
				)
		),
		// Shape
		h(
			"section",
			{ className: "dgv-section" },
			h("button", { type: "button", className: "dgv-section-head", onClick: () => toggle("shape") }, t("sec.shape"), h("span", null, open.shape ? "−" : "+")),
			open.shape &&
				h(
					"div",
					{ className: "dgv-rows" },
					h(Slider, { label: t("slider.arms"), value: settings.arms, min: 1, max: 4, step: 1, fallback: DEFAULTS.arms, onChange: (value) => update({ arms: value }) }),
					h(Slider, { label: t("slider.twist"), value: settings.twist, min: 1, max: 9, step: 0.1, fallback: DEFAULTS.twist, onChange: (value) => update({ twist: value }) }),
					h(Slider, { label: t("slider.thickness"), value: settings.thickness, min: 0.2, max: 3, step: 0.05, fallback: DEFAULTS.thickness, onChange: (value) => update({ thickness: value }) }),
					h(Slider, { label: t("slider.spread"), value: settings.spread, min: 0.35, max: 2.4, step: 0.05, fallback: DEFAULTS.spread, onChange: (value) => update({ spread: value }) })
				)
		),
		// Navigation & motion
		h(
			"section",
			{ className: "dgv-section" },
			h("button", { type: "button", className: "dgv-section-head", onClick: () => toggle("motion") }, t("sec.motion"), h("span", null, open.motion ? "−" : "+")),
			open.motion &&
				h(
					"div",
					{ className: "dgv-rows" },
					h(
						"div",
						{ className: "dgv-switch-row" },
						h("span", null, h("b", null, t("motion.auto")), h("small", null, t("motion.autoHint"))),
						h("button", { type: "button", className: `dgv-switch${settings.autoOrbit ? " dgv-switch-on" : ""}`, onClick: () => update({ autoOrbit: !settings.autoOrbit }), "aria-pressed": settings.autoOrbit }, h("i"))
					),
					h(Slider, { label: t("motion.speed"), value: settings.orbitSpeed, min: 0.2, max: 3, step: 0.05, fallback: DEFAULTS.orbitSpeed, onChange: (value) => update({ orbitSpeed: value }) }),
					h(
						"div",
						{ className: "dgv-switch-row" },
						h("span", null, h("b", null, t("motion.tour")), h("small", null, t("motion.tourHint"))),
						h(
							"button",
							{ type: "button", className: "dgv-btn", onClick: () => { const next = !settings.tour; update({ tour: next }); controls.setTour(next); } },
							t(settings.tour ? "motion.tourStop" : "motion.tourStart")
						)
					),
					h("button", { type: "button", className: "dgv-btn dgv-btn-wide", onClick: () => controls.replay() }, t("motion.replay")),
					h(
						"div",
						{ className: "dgv-pair" },
						h("button", { type: "button", className: "dgv-btn", onClick: saveMyPreset }, t("motion.save")),
						h("button", { type: "button", className: "dgv-btn", onClick: () => { update({ ...DEFAULTS, preset: settings.preset }); controls.fit(); } }, t("motion.reset"))
					),
					myPresets.length > 0 &&
						h(
							"div",
							{ className: "dgv-mine" },
							h("span", { className: "dgv-list-note" }, t("motion.mine")),
							...myPresets.map((preset, index) =>
								h(
									"span",
									{ key: `${preset.name}:${index}`, className: "dgv-mine-chip" },
									h("button", { type: "button", onClick: () => applyMyPreset(preset) }, preset.name),
									h("button", { type: "button", className: "dgv-mine-x", onClick: () => dropMyPreset(index), title: "×" }, "×")
								)
							)
						)
				)
		),
		// Advanced
		h(
			"section",
			{ className: "dgv-section" },
			h("button", { type: "button", className: "dgv-section-head", onClick: () => toggle("advanced") }, t("sec.advanced"), h("span", null, open.advanced ? "−" : "+")),
			open.advanced &&
				h(
					"div",
					{ className: "dgv-rows" },
					h(
						"div",
						{ className: "dgv-toggles" },
						...["auto", "high", "low"].map((tier) =>
							h("button", { key: tier, type: "button", className: `dgv-chip${settings.quality === tier ? " dgv-chip-on" : ""}`, onClick: () => update({ quality: tier }) }, t(`quality.${tier}`))
						)
					),
					h("div", { className: "dgv-list-note dgv-list-note-block" }, t("quality.hint"))
				)
		),
		h("footer", { className: "dgv-panel-foot" }, t("stats", { fps: stats.fps, ms: (stats.ms ?? 16.6).toFixed(1), nodes: stats.nodes, links: stats.links, quality: qualityLabel }))
	);
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

/**
 * The starfield page registered as the `graph` main panel.
 * @param props - slot props: `t`, injected stores and navigation callbacks.
 */
function GraphPage(props) {
	const t = props.t;
	const useGraphSessions = props.useGraphSessions ?? null;
	const useGraphWorkspaces = props.useGraphWorkspaces ?? null;
	const sessions = useGraphSessions === null ? undefined : useGraphSessions((snapshot) => snapshot);
	const workspaces = useGraphWorkspaces === null ? undefined : useGraphWorkspaces((snapshot) => snapshot);
	const sessionSnapshot = sessions ?? EMPTY_SESSIONS;
	const workspaceSnapshot = workspaces ?? EMPTY_WORKSPACES;
	const [showArchived, setShowArchived] = useState(false);
	const [settings, setSettings] = useState(() => {
		const loaded = loadSettings();
		const next = PRESETS[loaded.preset] === undefined ? { ...loaded, preset: DEFAULTS.preset, layout: DEFAULTS.layout } : loaded;
		// loadSettings may have dropped a stale "only this workspace" pin; write the
		// healed state back so the sky does not go empty again on the next load.
		if (next.only !== loaded.only) saveSettings(next);
		return next;
	});
	const [relayoutToken, setRelayoutToken] = useState(0);
	const [focusFolder, setFocusFolder] = useState(null);
	const [myPresets, setMyPresets] = useState(loadPresets);
	const [panelOpen, setPanelOpen] = useState(true);
	const [stats, setStats] = useState({ fps: 60, ms: 16.6, nodes: 0, links: 0, sessions: 0 });
	const controlsRef = useRef(null);

	/** Step into a star: the conversation becomes the surface, the galaxy is paused behind it. */
	const enterStar = useCallback(
		(node) => {
			if (node === undefined) return;
			props.selectSession?.(node.id, node);
		},
		[props.selectSession]
	);

	/** Give the galaxy the whole window: hide the stock sidebar, put it back on exit. */
	useEffect(() => {
		const guard = props.collapseSidebar === undefined ? null : props.collapseSidebar();
		return () => {
			if (guard !== null && guard !== undefined) guard.release();
		};
	}, []);

	/** Merge an update and persist it. */
	const update = useCallback((patch) => {
		setSettings((current) => {
			const next = { ...current, ...patch };
			saveSettings(next);
			return next;
		});
	}, []);

	const applyPreset = useCallback(
		(id) => {
			const preset = PRESETS[id];
			if (preset === undefined) return;
			const next = { ...settings, ...preset, preset: id };
			setSettings(next);
			saveSettings(next);
		},
		[settings]
	);

	const revertPreset = useCallback(() => {
		const preset = PRESETS[settings.preset];
		if (preset === undefined) return;
		const next = { ...settings, ...preset };
		setSettings(next);
		saveSettings(next);
	}, [settings]);

	const saveMyPreset = useCallback(() => {
		const entry = { ...settings, name: `我的预设 ${myPresets.length + 1}` };
		delete entry.hidden;
		delete entry.only;
		const next = myPresets.concat(entry).slice(-8);
		setMyPresets(next);
		try {
			window.localStorage.setItem(PRESET_KEY, JSON.stringify(next));
		} catch (error) {
			/* storage is optional */
		}
	}, [settings, myPresets]);

	const applyMyPreset = useCallback((preset) => {
		const next = { ...settings, ...preset };
		setSettings(next);
		saveSettings(next);
	}, [settings]);

	const dropMyPreset = useCallback((index) => {
		const next = myPresets.filter((_, position) => position !== index);
		setMyPresets(next);
		try {
			window.localStorage.setItem(PRESET_KEY, JSON.stringify(next));
		} catch (error) {
			/* ignore */
		}
	}, [myPresets]);

	const graph = useMemo(
		() =>
			buildGraph(workspaceSnapshot, sessionSnapshot, {
				showArchived,
				hidden: settings.hidden,
				only: settings.only,
				showOrphans: settings.orphans,
				showEmpty: settings.empty
			}),
		[workspaceSnapshot, sessionSnapshot, showArchived, settings.hidden, settings.only, settings.orphans, settings.empty]
	);

	const workspaceRows = useMemo(() => {
		const items = Array.isArray(workspaceSnapshot.items) ? workspaceSnapshot.items : [];
		const summaries = sessionSnapshot.byId ?? {};
		return items
			.filter((workspace) => workspace !== null && typeof workspace === "object")
			.map((workspace, index) => ({
				id: `ws:${workspace.workspaceId}`,
				workspaceId: workspace.workspaceId,
				title: typeof workspace.title === "string" && workspace.title !== "" ? workspace.title : workspace.path,
				path: typeof workspace.path === "string" ? workspace.path : "",
				hueIndex: index,
				count: (Array.isArray(workspace.sessionIds) ? workspace.sessionIds : []).filter((id) => summaries[id] !== undefined).length
			}))
			.sort((left, right) => right.count - left.count);
	}, [workspaceSnapshot, sessionSnapshot]);

	const shapeKey = `${settings.layout}:${settings.arms}:${settings.twist}:${settings.thickness}:${settings.spread}`;
	const loading = workspaceSnapshot.phase === "loading" && graph.nodes.length === 0;
	const filtered =
		settings.only !== null || (Array.isArray(settings.hidden) && settings.hidden.length > 0) || settings.lens !== null || settings.filterText.trim() !== "";
	const empty = !loading && graph.nodes.length === 0;

	const registerControls = useCallback((controls) => {
		controlsRef.current = controls;
	}, []);
	const onSelectionChange = useCallback((folderId) => setFocusFolder(folderId), []);
	const onStats = useCallback((next) => {
		setStats((current) =>
			current.fps === next.fps && current.nodes === next.nodes && current.links === next.links && Math.abs((current.ms ?? 0) - (next.ms ?? 0)) < 0.2
				? current
				: next
		);
	}, []);

	const qualityLabel = settings.quality === "auto" ? t("quality.auto") : t(settings.quality === "high" ? "quality.high" : "quality.low");

	const header = h(
		"header",
		{ className: "dgv-head" },
		h(
			"div",
			{ className: "dgv-head-main" },
			h(
				"button",
				{ type: "button", className: `dgv-btn dgv-btn-icon${panelOpen ? " dgv-btn-on" : ""}`, onClick: () => setPanelOpen((value) => !value), title: t("panel.open") },
				"☰"
			),
			h("div", null, h("div", { className: "dgv-title" }, t("title")), h("div", { className: "dgv-stat" }, empty || loading ? t("subtitle") : t("stat", { folders: graph.stats.folders, sessions: graph.stats.sessions })))
		),
		h(
			"div",
			{ className: "dgv-tools" },
			h("input", {
				className: "dgv-search",
				value: settings.filterText,
				placeholder: t("search.placeholder"),
				"aria-label": t("search.placeholder"),
				onChange: (event) => update({ filterText: event.target.value })
			}),
			h("button", { type: "button", className: `dgv-btn${showArchived ? " dgv-btn-on" : ""}`, onClick: () => setShowArchived((value) => !value), title: t("action.archived") }, t(showArchived ? "action.archivedOn" : "action.archived")),
			h("button", { type: "button", className: "dgv-btn", onClick: () => controlsRef.current?.fit(), title: t("action.fit") }, t("action.fit")),
			h("button", { type: "button", className: "dgv-btn", onClick: () => setRelayoutToken((value) => value + 1), title: t("action.relayout") }, t("action.relayout")),
			focusFolder !== null &&
				h(
					"button",
					{
						type: "button",
						className: "dgv-btn dgv-btn-on",
						title: t("action.fit"),
						onClick: () => {
							setFocusFolder(null);
							controlsRef.current?.focusFolder(null);
						}
					},
					"×"
				),
			h("button", { type: "button", className: "dgv-btn dgv-btn-primary", onClick: () => props.backToChat?.() }, t("action.stock"))
		)
	);

	if (loading || empty) {
		return h(
			"div",
			{ className: "dgv-page", style: { background: themeOf(settings.theme).base } },
			header,
			h(
				"div",
				{ className: "dgv-empty" },
				h("div", { className: "dgv-empty-title" }, t(loading ? "loading" : filtered ? "empty.filtered" : "empty.title")),
				!loading && h("div", { className: "dgv-empty-hint" }, t(filtered ? "empty.filteredHint" : "empty.hint")),
				!loading && filtered && h("button", { type: "button", className: "dgv-btn dgv-btn-primary", onClick: () => update({ hidden: [], only: null, lens: null, filterText: "" }) }, t("empty.clear"))
			)
		);
	}

	return h(
		"div",
		{ className: "dgv-page", style: { background: themeOf(settings.theme).base } },
		header,
		h(
			"div",
			{ className: "dgv-body" },
			panelOpen &&
				h(ControlPanel, {
					t,
					settings,
					update,
					applyPreset,
					revertPreset,
					themes: Object.keys(THEMES),
					presets: Object.keys(PRESETS),
					myPresets,
					saveMyPreset,
					applyMyPreset,
					dropMyPreset,
					workspaces: workspaceRows,
					stats: { ...stats, sessions: graph.stats.sessions },
					controls: { fit: () => controlsRef.current?.fit(), replay: () => controlsRef.current?.replay(), setTour: (value) => controlsRef.current?.setTour(value) },
					onClose: () => setPanelOpen(false),
					qualityLabel
				}),
			h(GraphScene, {
				graph,
				settings,
				shapeKey,
				relayoutToken,
				onEnterSession: enterStar,
				onOpenWorkspace: props.openWorkspace,
				onSelectionChange,
				registerControls,
				onStats,
				t
			})
		)
	);
}

/* ------------------------------------------------------------------ *
 * Header toggle + glyph
 * ------------------------------------------------------------------ */

/** Constellation glyph, reused by the header toggle. */
function GraphGlyph({ size }) {
	const dimension = typeof size === "number" ? size : 16;
	return h(
		"svg",
		{ width: dimension, height: dimension, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
		h("path", {
			d: "M12 5.9 5.6 10.4m6.4-4.5 6.4 4.5M5.6 10.4v6.1m12.8-6.1v6.1M5.6 16.5l6.4 2.9 6.4-2.9M12 14.4v4.9",
			stroke: "currentColor",
			strokeWidth: 1.3,
			strokeLinecap: "round",
			strokeLinejoin: "round",
			opacity: 0.7
		}),
		h("circle", { cx: 12, cy: 4.8, r: 1.7, stroke: "currentColor", strokeWidth: 1.3 }),
		h("circle", { cx: 5.1, cy: 10, r: 1.6, stroke: "currentColor", strokeWidth: 1.3 }),
		h("circle", { cx: 18.9, cy: 10, r: 1.6, stroke: "currentColor", strokeWidth: 1.3 }),
		h("circle", { cx: 12, cy: 20, r: 1.7, stroke: "currentColor", strokeWidth: 1.3 })
	);
}

/**
 * The one control this plugin adds to the stock chat header.
 * @param props - slot props (`t`) plus the injected panel opener.
 */
function GraphToggle({ t, openPanel }) {
	return h(
		"button",
		{
			type: "button",
			className: "dgv-toggle",
			title: t("toggle.title"),
			"aria-label": t("toggle.title"),
			onClick: (event) => {
				event.preventDefault();
				event.stopPropagation();
				openPanel();
			}
		},
		h(GraphGlyph, { size: 15 }),
		h("span", { className: "dgv-toggle-label" }, t("toggle"))
	);
}

/* ------------------------------------------------------------------ *
 * Plugin body
 * ------------------------------------------------------------------ */

/** Services this plugin reads. */
const inject = ["slots", "locale", "sessions", "workspaces", "uiWorkspace", "layout"];

/**
 * Client entry: dictionaries, the `graph` main panel, and the header toggle.
 * @param ctx - client root context.
 */
function apply(ctx) {
	if (typeof window !== "undefined") window.__dgvApplied = "start";
	try {
		run(ctx);
		if (typeof window !== "undefined") window.__dgvApplied = "ok";
	} catch (error) {
		if (typeof window !== "undefined") window.__dgvApplyError = String((error && error.stack) || error).slice(0, 1200);
		throw error;
	}
}

/** Real body, wrapped so a failure is observable instead of silently disabling the panel. */
function run(ctx) {
	ctx.effect(() => ctx.locale.register(NS, { zh, en }), "graph-view: dictionaries");
	const t = ctx.locale.bind(NS);

	/**
	 * Collapse the harness sidebar for the duration of the galaxy.
	 *
	 * The layout service only exposes `toggleSidebar`, so the current state is read
	 * back from the rendered sidebar instead of from a flag we do not own.
	 */
	const collapseSidebar = () => {
		const measure = () => {
			if (typeof document === "undefined") return 0;
			const root = document.querySelector("[data-dsh-sidebar-root]");
			return root === null ? 0 : root.getBoundingClientRect().width;
		};
		const wasOpen = measure() > 100;
		if (wasOpen) ctx.layout.toggleSidebar();
		return {
			release: () => {
				// Only undo our own collapse: if the user re-opened it, leave it be.
				if (wasOpen && measure() <= 100) ctx.layout.toggleSidebar();
			}
		};
	};

	const openPanel = () => ctx.layout.selectPanel(PANEL_ID);
	const backToChat = () => ctx.layout.selectPanel(null);
	/** Stock behaviour: open a Session in the harness conversation panel. */
	const openSession = (sessionId) => {
		ctx.get("uiWorkspace").openSession(sessionId);
		ctx.layout.selectPanel(null);
	};

	// ── Star interior ──────────────────────────────────────────────────
	// A plugin may not declare `children` for `main.conversation` (doing so
	// aborts client module activation), so the live conversation stays in the
	// harness panel. What this adds is the inside of the star around it: a hue
	// rim over the page and our own way back out.
	let interior = null;
	const clearInterior = () => {
		if (interior === null) return;
		interior.root.remove();
		delete document.body.dataset.dgvInside;
		document.body.style.removeProperty("--dgv-inside-base");
		interior = null;
	};
	const paintInterior = (hue, label) => {
		clearInterior();
		if (typeof document === "undefined") return;
		const safeHue = Number.isFinite(hue) ? hue : 248;
		const root = document.createElement("div");
		root.className = "dgv-inside";
		root.dataset.dgvInside = "1";
		root.style.setProperty("--dgv-inside-hue", String(safeHue));
		const glow = document.createElement("div");
		glow.className = "dgv-inside-glow";
		const back = document.createElement("button");
		back.type = "button";
		back.className = "dgv-inside-back";
		back.textContent = t("chat.back");
		back.title = `${label ?? ""} · ${t("chat.back")}`;
		back.addEventListener("click", () => {
			clearInterior();
			ctx.layout.selectPanel(PANEL_ID);
		});
		root.append(glow, back);
		document.body.append(root);
		document.body.dataset.dgvInside = "1";
		document.body.style.setProperty("--dgv-inside-base", themeOf(loadSettings().theme).base);
		interior = { root };
	};

	/** Enter one star: paint its interior, then open the Session in the panel. */
	const enterStar = (sessionId, node) => {
		try {
			paintInterior(node?.hue, node?.label);
		} catch (error) {
			console.warn("graph-view: painting the star interior failed", error);
		}
		openSession(sessionId);
	};
	const selectSession = enterStar;
	const openWorkspace = (workspaceId) => {
		Promise.resolve(ctx.get("uiWorkspace").openWorkspace(workspaceId)).then(
			() => ctx.layout.selectPanel(null),
			(reason) => console.warn("graph-view: open workspace failed", reason)
		);
	};

	ctx.slots.inject("main", () =>
		ctx.slots.register(
			{
				name: "main",
				key: PANEL_ID,
				locale: NS,
				inject: () => ({
					hooks: { graphSessions: ctx.sessions.list, graphWorkspaces: ctx.workspaces.list },
					selectSession,
					clearInterior,
					openWorkspace,
					backToChat,
					collapseSidebar
				})
			},
			GraphPage
		)
	);

	// Sidebar rail row: the same panel, reachable even before a session exists.
	ctx.slots.inject("sidebar.panellist", () =>
		ctx.slots.register({ name: "sidebar.panellist", id: PANEL_ID, order: 30, label: () => t("panel"), locale: NS }, GraphGlyph)
	);

	ctx.slots.inject("conversation.session.header.actions", () =>
		ctx.slots.register({ name: "conversation.session.header.actions", id: "graph-toggle", order: 12, locale: NS, inject: () => ({ openPanel }) }, GraphToggle)
	);
}

exports.apply = apply;
exports.inject = inject;

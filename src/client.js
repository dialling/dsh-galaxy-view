/**
 * Browser half of the graph-view plugin: a cinematic 3D galaxy (workspaces as suns on
 * spiral arms, conversations as stars, look after Obsidian's Galaxy View) as one
 * `main` panel plus a header button. Dependency-free; `scripts/build.mjs` wraps this
 * into `__ModuleLoader__.load`.
 */
const react = require("react");
const { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } = react;
const h = react.createElement;

const NS = "graph";
const PANEL_ID = "graph";
const STORE_KEY = "dsh-graph-view:settings";
const PRESET_KEY = "dsh-graph-view:presets";
const VIEW_KEY = "dsh-graph-view:view";
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
	"search.placeholder": "搜索星体，回车飞过去…",
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
	"hint.orbit": "拖拽旋转 · 滚轮推拉 · 点击星体选中，双击进入",
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
	"preset.deepfield": "浑天",
	"preset.system": "太阳系",
	"preset.helix": "双螺旋",
	"preset.minimal": "矩阵",
	"preset.plate": "方阵",
	"preset.tree": "星树",
	"preset.rings.sub": "同心轨道·薄环",
	"preset.deepfield.sub": "浑天仪 · 同心环各自旋转",
	"preset.system.sub": "行星轨道 · 卫星环绕",
	"preset.helix.sub": "双链攀升·立体",
	"preset.minimal.sub": "单色矩阵 · 无辉光 · 克制",
	"preset.plate.sub": "立体方阵·规整",
	"preset.tree.sub": "放射枝干·条理",
	"theme.deepfield": "深空",
	"theme.hubble": "哈勃",
	"theme.neon": "霓虹",
	"theme.sunset": "落日",
	"theme.cyber": "赛博",
	"theme.matrix": "矩阵",
	"theme.aurora": "极光",
	"theme.solar": "太阳系",
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
	"slider.shellBloom": "球壳辉光",
	"slider.shellBloomBlur": "辉光扩散",
	"slider.mist": "集群云雾",
	"slider.brightness": "星体亮度",
	"slider.bloom": "辉光范围",
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
	"quality.hint": "自动＝按设备实时调度；低档减少浮星；移动档关闭辉光与云雾，最多绘制 1500 颗星。",
	"perf.gpu": "GPU 星体",
	"perf.gpuHint": "关闭后星体改由画布逐个绘制（更慢，但可排除显卡/着色器问题）。",
	"quality.mobile": "移动",
	"sec.physics": "力学",
	"sec.restore": "↺ 还原",
	"sec.customized": "已自定义",
	"sec.setBy": "由「{n}」设定",
	"sec.preview": "预览：{n}",
	"slider.notch": "默认 {v}",
	"slider.nodeSize": "节点大小",
	"slider.linkOpacity": "链接透明度",
		"slider.linkBrightness": "连线亮度",
	"slider.linkCurve": "连线弯曲",
	"slider.linkWidth": "连线粗细",
	"sec.links": "连线",
	"links.show": "显示连线",
	"links.showHint": "关闭后只在点击对话时显示它的相关连线",
	"links.color": "颜色",
	"links.auto": "跟随星色",
	"links.pick": "自选颜色",
	"action.links": "连线",
	"action.linksTitle": "显示或隐藏连线（点击对话时总会显示它的相关连线）",
	"slider.twinkle": "星星眨眼",
	"slider.fieldStars": "空间浮星",
	"slider.dust": "尘埃带",
	"slider.bloomStrength": "辉光强度",
	"slider.repel": "斥力",
	"slider.linkDistance": "链接距离",
	"slider.linkStrength": "链接强度",
	"slider.centerPull": "向心力",
	"slider.flatten": "扁平度",
	"slider.coreGravity": "核心引力",
	"slider.spiral": "旋涡",
	"slider.tourSpeed": "巡游速度",
	"look.shuffle": "洗牌配色",
	"look.unshuffle": "原始配色",
	"sizeBy.label": "大小依据",
	"sizeBy.activity": "活跃度",
	"sizeBy.links": "链接数",
	"sizeBy.uniform": "统一",
	"motion.depth": "关联深度",
	"motion.depthN": "{d} 层",
	"motion.connect": "连接两篇",
	"motion.connectHint": "点选两颗星，镜头沿最短链接路径逐跳飞过去",
	"motion.connectStart": "选星",
	"connect.pickStart": "连接两篇：点选起点星体",
	"connect.pickEnd": "连接两篇：点选终点星体",
	"connect.cancel": "取消",
	"notice.noPath": "这两颗星之间没有链接路径",
	"notice.viaSuns": "两颗星不在同一工作区，经由各自的工作区飞过去",
	"mine.name": "我的预设 {n}",
	"mine.rename": "双击重命名",
	"mine.up": "上移",
	"mine.del": "删除",
	"mine.confirmDel": "删除？",
	"mine.ok": "确认删除",
	"mine.cancel": "取消",
	"lang.title": "面板语言（跟随 / 中文 / English）",
	"lang.auto": "跟随",
	"lang.zh": "中",
	"lang.en": "EN",
	"help.title": "如何导航",
	"help.orbit": "左键拖 = 环绕 · 滚轮 = 缩放",
	"help.select": "点击星体 = 选中并飞过去 · 双击 = 进入 · Esc = 取消",
	"help.keys": "F = 聚焦选中 · R = 回总览 · Tab = 下一颗",
	"help.dblclick": "双击滑杆 = 回默认值",
	"help.filter": "过滤：空格分隔 = 同时满足 · -词 = 排除 · path: / name: 限定字段 · \"短语\"",
	"filter.syntax": "语法：-词 排除 · path:路径 · name:名字 · \"短语\"",
	"search.none": "没有匹配的星体",
	"panel.resize": "拖动调整宽度",
	"stats": "{fps} fps · {ms} ms · {nodes} 星 · {links} 丝 · {quality}",

	"view.galaxy": "星系",
	"view.memory": "记忆库",
	"view.toMemory": "切到记忆库：指令文件、技能与调用记录",
	"view.toGalaxy": "切回星系",
	"mem.aria": "记忆库星系图：指令文件在内核，技能在外围，调用绕着各自的技能",
	"mem.title": "记忆库",
	"mem.subtitle": "塑造智能体行为的指令、技能与调用",
	"mem.stat": "{docs} 份指令 · {skills} 个技能 · {calls} 次调用",
	"mem.loading": "正在读取记忆库…",
	"mem.scanning": "正在扫描会话日志…",
	"mem.error": "记忆库读取失败",
	"mem.retry": "重试",
	"mem.refresh": "重新读取",
	"mem.offline": "宿主没有提供 connection 服务：Node 端需要重启 DSH 后才会挂上。",
	"mem.hint": "拖 = 环绕 · 滚轮 = 缩放 · 单击 = 选中 · 双击星体 = 打开",
	"mem.tab.docs": "指令",
	"mem.tab.skills": "技能",
	"mem.tab.calls": "调用",
	"mem.filter": "筛选记忆…",
	"mem.none": "没有匹配的条目",
	"mem.row.calls": "{n} 次",
	"mem.row.missing": "磁盘上已不存在",
	"mem.row.copies": "{n} 份同名",
	"mem.open": "打开",
	"mem.selected.docs": "指令文件",
	"mem.selected.skills": "技能",
	"mem.selected.calls": "调用记录",
	"mem.selected.callsN": "{n} 次调用 · {s} 个会话 · 最近 {time}",
	"mem.selected.never": "还没被调用过",
	"mem.selected.missing": "调用记录里有它，磁盘上没有它的 SKILL.md",
	"mem.editor.readonly": "应用内置文件，只读",
	"mem.editor.save": "保存",
	"mem.editor.saving": "保存中…",
	"mem.editor.saved": "已保存 · {time}",
	"mem.editor.dirty": "有未保存的更改",
	"mem.editor.reload": "重新加载",
	"mem.editor.overwrite": "覆盖保存",
	"mem.editor.close": "关闭",
	"mem.editor.conflict": "磁盘上的文件在这次打开之后改过了：重新加载看新内容，或者直接覆盖。",
	"mem.editor.failed": "保存失败：{message}",
	"mem.editor.meta": "{n} 行 · {size}",
	"mem.scope.global": "全局",
	"mem.scope.rule": "规则",
	"mem.scope.agents": "共享",
	"mem.scope.workspace": "工作区",
	"mem.scope.legacy": "旧版"
};

const en = {
	"panel": "Starfield",
	"toggle": "Stars",
	"toggle.title": "Switch to the starfield view",
	"title": "Starfield",
	"subtitle": "Workspaces and conversations as a galaxy",
	"search.placeholder": "Search stars, Enter to fly there…",
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
	"hint.orbit": "drag to orbit · scroll to zoom · click a star to select, double-click to enter",
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
	"preset.rings": "Rings",
	"preset.deepfield": "Armillary",
	"preset.system": "Solar system",
	"preset.helix": "Helix",
	"preset.minimal": "Matrix",
	"preset.plate": "Cube",
	"preset.tree": "Tree",
	"preset.rings.sub": "concentric orbits · thin rings",
	"preset.deepfield.sub": "armillary sphere · rings turning in their own planes",
	"preset.system.sub": "planets on orbits · moons",
	"preset.helix.sub": "twin strands · climbing",
	"preset.minimal.sub": "one colour · no bloom · restrained",
	"preset.plate.sub": "solid cube array · orderly",
	"preset.tree.sub": "radial branches · orderly",
	"theme.deepfield": "Deep Field",
	"theme.hubble": "Hubble",
	"theme.neon": "Neon",
	"theme.sunset": "Sunset",
	"theme.cyber": "Cyber",
	"theme.matrix": "Matrix",
	"theme.aurora": "Aurora",
	"theme.solar": "Solar",
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
	"slider.shellBloom": "Shell glow",
	"slider.shellBloomBlur": "Glow spread",
	"slider.mist": "Cluster mist",
	"slider.brightness": "Brightness",
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
	"quality.hint": "Auto adapts live; low draws fewer field stars; mobile turns off bloom and mist and draws at most 1500 stars.",
	"perf.gpu": "GPU bodies",
	"perf.gpuHint": "Turn off to draw bodies on the canvas instead (slower, but isolates a GPU/shader problem).",
	"quality.mobile": "Mobile",
	"sec.physics": "Physics",
	"sec.restore": "↺ Restore",
	"sec.customized": "Customised",
	"sec.setBy": "Set by {n}",
	"sec.preview": "Preview: {n}",
	"slider.notch": "Default {v}",
	"slider.nodeSize": "Node size",
	"slider.linkOpacity": "Link opacity",
		"slider.linkBrightness": "Link brightness",
	"slider.linkCurve": "Link curve",
	"slider.linkWidth": "Link width",
	"sec.links": "Links",
	"links.show": "Show links",
	"links.showHint": "When off, links appear only for the conversation you click",
	"links.color": "Colour",
	"links.auto": "Star colours",
	"links.pick": "Pick a colour",
	"action.links": "Links",
	"action.linksTitle": "Show or hide links (a clicked conversation always shows its own)",
	"slider.twinkle": "Twinkle",
	"slider.fieldStars": "Field stars",
	"slider.dust": "Dust lanes",
	"slider.bloomStrength": "Strength",
	"slider.repel": "Repel",
	"slider.linkDistance": "Link distance",
	"slider.linkStrength": "Link strength",
	"slider.centerPull": "Center pull",
	"slider.flatten": "Flatten",
	"slider.coreGravity": "Core gravity",
	"slider.spiral": "Spiral",
	"slider.tourSpeed": "Tour speed",
	"look.shuffle": "Shuffle colours",
	"look.unshuffle": "Original colours",
	"sizeBy.label": "Size by",
	"sizeBy.activity": "Activity",
	"sizeBy.links": "Links",
	"sizeBy.uniform": "Uniform",
	"motion.depth": "Selection depth",
	"motion.depthN": "{d}-hop",
	"motion.connect": "Connect two",
	"motion.connectHint": "pick two stars and fly the shortest link path hop by hop",
	"motion.connectStart": "Pick",
	"connect.pickStart": "Connect two: pick the start star",
	"connect.pickEnd": "Connect two: pick the end star",
	"connect.cancel": "Cancel",
	"notice.noPath": "These two stars are not linked",
	"notice.viaSuns": "Different workspaces: flying there through both suns",
	"mine.name": "My preset {n}",
	"mine.rename": "Double-click to rename",
	"mine.up": "Move up",
	"mine.del": "Delete",
	"mine.confirmDel": "Delete?",
	"mine.ok": "Delete",
	"mine.cancel": "Cancel",
	"lang.title": "Panel language (auto / 中文 / English)",
	"lang.auto": "Auto",
	"lang.zh": "中",
	"lang.en": "EN",
	"help.title": "How to navigate",
	"help.orbit": "Left-drag = orbit · scroll = zoom",
	"help.select": "Click a star = select and fly · double-click = enter · Esc = cancel",
	"help.keys": "F = focus the selection · R = overview · Tab = next star",
	"help.dblclick": "Double-click a slider = back to its default",
	"help.filter": "Filter: words are ANDed · -word excludes · path: / name: pick a field · \"a phrase\"",
	"filter.syntax": "Syntax: -word excludes · path:x · name:x · \"a phrase\"",
	"search.none": "No matching stars",
	"panel.resize": "Drag to resize",
	"stats": "{fps} fps · {ms} ms · {nodes} stars · {links} threads · {quality}",

	"view.galaxy": "Galaxy",
	"view.memory": "Memory",
	"view.toMemory": "Switch to the memory library: instruction files, skills, call history",
	"view.toGalaxy": "Back to the galaxy",
	"mem.aria": "Memory library galaxy: instruction files in the core, skills on the arms, calls circling their skill",
	"mem.title": "Memory",
	"mem.subtitle": "Instructions, skills and calls that shape the agent",
	"mem.stat": "{docs} files · {skills} skills · {calls} calls",
	"mem.loading": "Reading the memory library…",
	"mem.scanning": "Scanning session logs…",
	"mem.error": "The memory library could not be read",
	"mem.retry": "Retry",
	"mem.refresh": "Read again",
	"mem.offline": "This host exposes no connection service: the Node half needs a DSH restart to mount.",
	"mem.hint": "Drag = orbit · scroll = zoom · click = select · double-click a body = open",
	"mem.tab.docs": "Instructions",
	"mem.tab.skills": "Skills",
	"mem.tab.calls": "Calls",
	"mem.filter": "Filter memory…",
	"mem.none": "Nothing matches",
	"mem.row.calls": "{n}×",
	"mem.row.missing": "no longer on disk",
	"mem.row.copies": "{n} copies",
	"mem.open": "Open",
	"mem.selected.docs": "Instruction file",
	"mem.selected.skills": "Skill",
	"mem.selected.calls": "Call",
	"mem.selected.callsN": "{n} calls · {s} sessions · last {time}",
	"mem.selected.never": "never called",
	"mem.selected.missing": "called in a session, but SKILL.md is gone",
	"mem.editor.readonly": "Ships with the app; read-only",
	"mem.editor.save": "Save",
	"mem.editor.saving": "Saving…",
	"mem.editor.saved": "Saved · {time}",
	"mem.editor.dirty": "Unsaved changes",
	"mem.editor.reload": "Reload",
	"mem.editor.overwrite": "Overwrite",
	"mem.editor.close": "Close",
	"mem.editor.conflict": "The file changed on disk after it was opened: reload to see it, or overwrite it.",
	"mem.editor.failed": "Save failed: {message}",
	"mem.editor.meta": "{n} lines · {size}",
	"mem.scope.global": "Global",
	"mem.scope.rule": "Rule",
	"mem.scope.agents": "Shared",
	"mem.scope.workspace": "Workspace",
	"mem.scope.legacy": "Legacy"
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

/** Fill `{name}` placeholders the way the host locale does. */
function formatText(template, vars) {
	if (typeof template !== "string") return "";
	if (vars === undefined || vars === null) return template;
	return template.replace(/\{(\w+)\}/g, (whole, name) => (Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : whole));
}

/** The panel's language choice: "auto" follows the host, "zh"/"en" use our own dictionaries. */
function translatorFor(language, hostT) {
	if (language !== "zh" && language !== "en") return hostT;
	const dict = language === "zh" ? zh : en;
	return (key, vars) => formatText(dict[key] ?? en[key] ?? key, vars);
}

/** Palette position for a workspace index; `colorSeed` (配色洗牌) permutes the positions. */
function slotAt(settings, index) {
	const count = themeOf(settings.theme).hues.length;
	const slot = ((Number.isFinite(index) ? Math.round(index) : 0) % count + count) % count;
	const seed = Number.isFinite(settings.colorSeed) ? settings.colorSeed : 0;
	if (seed === 0) return slot;
	const order = Array.from({ length: count }, (_, position) => ({ position, rank: hash01(`palette:${seed}:${position}`) })).sort((left, right) => left.rank - right.rank);
	return order[slot].position;
}

function hueAt(settings, index) {
	return themeOf(settings.theme).hues[slotAt(settings, index)];
}

/** The slot's `[saturation, lightness]` tone, or null for the sprite default. */
function toneAt(settings, index) {
	return themeOf(settings.theme).tones?.[slotAt(settings, index)] ?? null;
}

/** CSS colour of a palette slot for the DOM dots (legend, card, tooltip, search). */
function swatchCss(hue, tone) {
	return Array.isArray(tone) ? `hsl(${hue}, ${Math.round(tone[0] * 100)}%, ${Math.round(Math.max(0.66, tone[1]) * 100)}%)` : `hsl(${hue}, 92%, 66%)`;
}

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
 * Look: glow sprites, dust sprites, field stars
 * ------------------------------------------------------------------ */

/** Round a hue to a cache bucket so a galaxy needs a handful of sprites. */
/**
 * `measureText` is the expensive part of a caption, and the same few strings come back every
 * frame at two or three sizes. Cached per (weight, size, text) with a bounded map.
 */
/**
 * The GPU glow layer (see src/gpu.js): one canvas over the stage, created lazily, and dropped
 * for good if it ever fails — the Canvas 2D bodies then keep drawing as they always did.
 */
const GLOW_COLOURS = new Map();
function glowColour(hue, lightness, tone) {
	const key = `${hue}|${lightness ?? ""}|${tone ?? ""}`;
	const hit = GLOW_COLOURS.get(key);
	if (hit !== undefined) return hit;
	const [r, g, b] = starPlateau(hue, lightness, tone);
	const colour = [r / 255, g / 255, b / 255];
	if (GLOW_COLOURS.size > 4096) GLOW_COLOURS.clear();
	GLOW_COLOURS.set(key, colour);
	return colour;
}

/** Create the layer once and keep it on the stage; null when WebGL is not available. */
function glowLayerFor(state, canvas) {
	// 高性能渲染 off: the Canvas 2D sprites draw the bodies instead of the batched GPU pass.
	if (state.settings?.gpuGlow === false) return null;
	if (state.glowFailed === true) return null;
	if (state.glow !== undefined && state.glow !== null) return state.glow;
	if (typeof createGlowLayer !== "function") return null;
	const layer = createGlowLayer();
	if (layer === null) {
		state.glowFailed = true;
		return null;
	}
	layer.canvas.className = "dgv-glow";
	const host = canvas.parentElement;
	if (host !== null) host.append(layer.canvas);
	state.glow = layer;
	return layer;
}

const CAPTION_WIDTHS = new Map();
function captionWidth(context, text, size, weight) {
	const key = `${weight}|${size}|${text}`;
	const hit = CAPTION_WIDTHS.get(key);
	if (hit !== undefined) return hit;
	context.font = `${weight} ${size}px ui-sans-serif, -apple-system, "Segoe UI", sans-serif`;
	const width = context.measureText(text).width;
	if (CAPTION_WIDTHS.size > 512) CAPTION_WIDTHS.clear();
	CAPTION_WIDTHS.set(key, width);
	return width;
}

function hueBucket(hue) {
	return Math.round(hue / 15) * 15;
}

const dustCache = new Map();

/** Cache one 24px soft speck per dust hue bucket, muted like the star plateaus. */
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
	gradient.addColorStop(0, `hsla(${bucket}, 60%, 76%, 1)`);
	gradient.addColorStop(0.4, `hsla(${bucket}, 58%, 66%, 0.28)`);
	gradient.addColorStop(1, `hsla(${bucket}, 55%, 56%, 0)`);
	context.fillStyle = gradient;
	context.fillRect(0, 0, size, size);
	dustCache.set(bucket, canvas);
	return canvas;
}

/** Sky shell: hard pixel-snapped squares (geometry in `createSkyShell`); one cached halo sprite per tint for the few bright grains and the twinkler. */
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

/** Control point as in the reference `render/linkCurves.ts`: the world midpoint pushed along its direction from the origin by bow·edge (0.32×curve, lineage 0.18×curve; curve = 连线弯曲, 0.35 by default), with a horizontal-perpendicular fallback near the origin; projected afterwards. */
function bowControl(a, b, link, viewport, basis, scale, curve) {
	// `_k` is each end's intro-wave scale, so a bow unfolds with its stars.
	const ka = (a._k ?? 1) * scale;
	const kb = (b._k ?? 1) * scale;
	const mx = (a.x * ka + b.x * kb) * 0.5;
	const my = (a.y * ka + b.y * kb) * 0.5;
	const mz = (a.z * ka + b.z * kb) * 0.5;
	const ex = b.x * kb - a.x * ka;
	const ez = b.z * kb - a.z * ka;
	const bow = (link.kind === "lineage" ? 0.18 : 0.32) * curve * Math.hypot(ex, b.y * kb - a.y * ka, ez);
	const mr = Math.hypot(mx, my, mz);
	const pl = Math.hypot(ex, ez);
	const [dx, dy, dz] = mr > 1e-3 ? [mx / mr, my / mr, mz / mr] : pl > 1e-6 ? [ez / pl, 0, -ex / pl] : [1, 0, 0];
	const point = projectPoint({ x: mx + dx * bow, y: my + dy * bow, z: mz + dz * bow }, basis, viewport);
	return point === null ? { x: (a._p.x + b._p.x) * 0.5, y: (a._p.y + b._p.y) * 0.5 } : point;
}

/** Add one link to the current path: a bow for 连线弯曲 > 0, a straight segment at 0. */
function traceLink(context, a, b, link, viewport, basis, scale, curve) {
	context.moveTo(a._p.x, a._p.y);
	if (curve <= 0.001) {
		context.lineTo(b._p.x, b._p.y);
		return;
	}
	const control = bowControl(a, b, link, viewport, basis, scale, curve);
	context.quadraticCurveTo(control.x, control.y, b._p.x, b._p.y);
}
/** Offscreen layer for a translucent link class, sized to the frame in device pixels. */
function linkLayerFor(state, frame) {
	const layer = state.linkLayer ?? (state.linkLayer = document.createElement("canvas"));
	if (layer.width !== frame.width || layer.height !== frame.height) {
		layer.width = frame.width;
		layer.height = frame.height;
	}
	return layer;
}

/** Case-insensitive star match used by the search box. */
/**
 * Fuzzy subsequence match, the way the reference plugin's search modal scores: "krs" finds
 * "knowledge-relations-schema" as long as the letters appear in order. A contiguous run wins,
 * and the earlier the match starts the better, so a prefix beats a coincidence.
 * @returns a score in 0…1 (higher is better), or null when the query does not match.
 */
function fuzzyScore(text, query) {
	const haystack = String(text ?? "").toLowerCase();
	if (query === "") return null;
	const at = haystack.indexOf(query);
	if (at === 0) return 1;
	if (at > 0) return 0.9 - Math.min(0.3, at / Math.max(1, haystack.length));
	let cursor = 0;
	let gaps = 0;
	for (const letter of query) {
		const next = haystack.indexOf(letter, cursor);
		if (next === -1) return null;
		gaps += next - cursor;
		cursor = next + 1;
	}
	return Math.max(0.05, 0.6 - gaps / Math.max(1, haystack.length));
}

/** Best fuzzy score over a node's label, path and cwd (or null when nothing matches). */
function matches(node, query) {
	const scores = [node.label, node.path, node.cwd].map((field) => fuzzyScore(field, query)).filter((score) => score !== null);
	return scores.length === 0 ? 0 : Math.max(...scores);
}

/** Symmetric cubic ease: slow in, fast middle, slow out — the Galaxy-view glide. */
function easeInOutCubic(value) {
	const t = Math.min(1, Math.max(0, value));
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Intro wave, as Galaxy View's `revealScale`: the first 55% of the progress staggers
 * stars by radius, the last 45% is each star's own cubic ease out from the core.
 */
function revealScale(progress, radius, maxRadius) {
	const delay = (Math.max(0, radius) / (maxRadius > 0 ? maxRadius : 1)) * 0.55;
	const local = Math.min(1, Math.max(0, (progress - delay) / 0.45));
	return 1 - Math.pow(1 - local, 3);
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

/** Farthest wheel zoom: about 4.5× the overview, so the whole galaxy can shrink to a small patch of sky. */
/**
 * The wheel is unbounded: 缩放倍率 is the owner's to choose. The only floor is a hair above
 * zero, because a zero distance has no view direction to build a camera from.
 */
const ZOOM_FLOOR = 0.002;

/**
 * Paint one grain set as hard device-pixel squares: one path per bucket, spun around
 * the body's own Y axis, projected inline. No allocation per grain. The shell is a
 * sphere around the galaxy, not around the camera: only then does diving into a star
 * carry the camera *through* it instead of dragging a backdrop along.
 *
 * Each grain fills exactly the device pixels a WebGL point of that size would (the
 * pixel centres inside `centre ± size/2`), as Galaxy View's `PointsMaterial` sky does.
 * A 1.2 px grain therefore covers 1×1, 1×2 or 2×2 pixels depending on where it lands,
 * and while the camera moves the grains pop between those footprints: the shimmer of
 * the reference sky. A static view stays perfectly still.
 */
function paintGrainSquares(context, set, radius, spin, basis, focal, width, height, dpr, keepMax, sizeScale, styles) {
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
		const deviceSize = Math.max(1, set.sizes[(bucket / SKY_TINTS.length) | 0] * sizeScale * dpr);
		const side = deviceSize / dpr;
		const lead = deviceSize * 0.5 + 0.5;
		context.fillStyle = styles[bucket];
		context.beginPath();
		for (let grain = from; grain < to; grain += 1) {
			if (keep[grain] >= keepMax) continue;
			const gx = sx[grain] * radius;
			const gz = sz[grain] * radius;
			const dx = gx * spinCos - gz * spinSin - eye.x;
			const dy = sy[grain] * radius - eye.y;
			const dz = gx * spinSin + gz * spinCos - eye.z;
			const depth = dx * fwd.x + dy * fwd.y + dz * fwd.z;
			if (depth <= 0.08) continue;
			const px = halfW + ((dx * right.x + dy * right.y + dz * right.z) / depth) * focal;
			const py = halfH - ((dx * up.x + dy * up.y + dz * up.z) / depth) * focal;
			if (px < -side || px > width + side || py < -side || py > height + side) continue;
			const x0 = Math.ceil(px * dpr - lead);
			const y0 = Math.ceil(py * dpr - lead);
			const x1 = Math.ceil(px * dpr + deviceSize - lead);
			const y1 = Math.ceil(py * dpr + deviceSize - lead);
			context.rect(x0 / dpr, y0 / dpr, (x1 - x0) / dpr, (y1 - y0) / dpr);
		}
		context.fill();
	}
}

/** Quality tier → how much work a frame may do. */
function qualityBudget(settings, auto) {
	const tier = settings.quality === "auto" ? auto : settings.quality;
	// Mobile mirrors Galaxy View's tier: dpr 1.5, no bloom, 32% of the sky, no cluster clouds, 1500 stars.
	if (tier === "mobile") return { dustStep: 3, starStep: 2, dpr: 1.5, label: "mobile", bloom: false, clouds: false, starScale: 0.32, nodeCap: 1500 };
	if (tier === "low") return { dustStep: 3, starStep: 2, dpr: 1, label: "low", bloom: true, clouds: true, starScale: 0.4, nodeCap: Infinity };
	if (tier === "mid") return { dustStep: 2, starStep: 1, dpr: 2, label: "auto", bloom: true, clouds: true, starScale: 0.7, nodeCap: Infinity };
	return { dustStep: 1, starStep: 1, dpr: 2, label: "high", bloom: true, clouds: true, starScale: 1, nodeCap: Infinity };
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
	const [notice, setNotice] = useState(null);
	const [connectPhase, setConnectPhase] = useState(null);
	const noticeTimer = useRef(0);
	const showNotice = (text) => {
		setNotice(text);
		window.clearTimeout(noticeTimer.current);
		noticeTimer.current = window.setTimeout(() => setNotice(null), 3200);
	};
	const wrapRef = useRef(null);
	const canvasRef = useRef(null);
	const tipRef = useRef(null);
	const stateRef = useRef(null);
	const loopRef = useRef({ raf: 0, ensure: () => {} });
	const [hover, setHover] = useState(null);
	const [card, setCard] = useState(null);
	const [lift, setLift] = useState(false);
	const controlsFit = useRef(null);

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
			tourHeld: false,
			tourSeen: [],
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
			frameCost: 16,
			drawMs: 0,
			renderErrors: 0,
			degree: new Map(),
			simEpoch: 0,
			sim: null,
			route: null,
			connect: null,
			fade: null
		};
	}
	const state = stateRef.current;
	state.settings = settings;
	state.onTourEnd = props.onTourEnd;

	/** Build (or re-roll) the galaxy when data, seed or shape changes. */
	useEffect(() => {
		const reseed = relayoutToken !== state.token;
		if (reseed) {
			state.token = relayoutToken;
			state.cam = createCamera();
			state.bloomed = false;
			state.tourSeen = [];
		}
		// Warm start: a rebuilt graph of the same shape continues from the settled
		// positions, so a session update does not replay the whole relaxation.
		const previous = state.sim;
		const warm =
			previous !== null && !reseed && state.simShape === shapeKey && Array.isArray(state.simIds)
				? new Map(state.simIds.map((id, index) => [id, [previous.pos[index * 3], previous.pos[index * 3 + 1], previous.pos[index * 3 + 2]]]))
				: null;
		state.galaxy = createGalaxy(graph, state.token + 1, { layout: settings.layout, arms: settings.arms, twist: settings.twist, thickness: settings.thickness, spread: settings.spread });
		state.guides = layoutGuides(settings.layout, state.galaxy.offset, settings.arms, state.galaxy.orbits);
		state.nodes = graph.nodes.length;
		state.links = graph.links.length;
		state.neighbours = neighboursOf(graph);
		state.degree = new Map([...state.neighbours].map(([id, set]) => [id, set.size]));
		// Frame the shell, not just the body: the ball has to be visible around the
		// stars, otherwise the shape looks like it is floating inside a full-frame haze.
		state.shellRadius = clamp(state.galaxy.extent * 1.22, 1, 2.1);
		state.fit = overviewDistance(state.shellRadius, state.cam.fov);
		state.targetDistance = state.fit;
		// 方阵 is an exact lattice, 深空场 an even scatter and 太阳系 keeps its orbits: any
		// force would pull stars out of their cells, collapse the field, or spiral the
		// planets into the sun.
		// 浑天 (the armillary preset) is a composed picture like the field or the solar
		// system: the force layer would pull its three arms into one blob.
		const placed = settings.layout === "plate" || settings.layout === "field" || settings.layout === "system" || settings.layout === "memory";
		state.sim = state.galaxy.nodes.length > 4000 || placed ? null : createSimulation(state.galaxy.nodes, state.galaxy.links, warm);
		state.simIds = state.galaxy.nodes.map((node) => node.id);
		state.simShape = shapeKey;
		state.simReach = state.shellRadius * 0.86;
		if (state.sim !== null && warm !== null) writeSimulation(state.sim, state.galaxy.nodes);
		state.route = null;
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

	/** A physics slider moved: wake the force layer from where it is. */
	useEffect(() => {
		if (state.sim === null) return;
		reheatSimulation(state.sim, 0.5);
		loopRef.current.ensure();
	}, [state, settings.repel, settings.linkDistance, settings.linkStrength, settings.centerPull, settings.flatten, settings.coreGravity, settings.spiral]);

	/** Size the surface and keep the pixel ratio honest. */
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
			loopRef.current.ensure();
		};
		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(wrap);
		return () => observer.disconnect();
	}, [state]);

	/** Frame loop: spin, ease, project, paint, report fps. */
	useEffect(() => {
		let last = 0;
		let reported = 0;
		const frame = (now) => {
			if (typeof window !== "undefined" && window.__dgvBundle !== undefined && window.__dgvBundle !== BUNDLE_ID) {
				loopRef.current.raf = 0;
				return;
			}
			loopRef.current.raf = requestAnimationFrame(frame);
			const canvas = canvasRef.current;
			if (canvas === null || canvas === undefined) return;
			// Hidden tab, or the view kept mounted under another host page (display: none):
			// nothing on screen, so skip the frame's work entirely.
			if ((typeof document !== "undefined" && document.hidden) || !canvas.isConnected || canvas.clientWidth === 0) {
				last = 0;
				return;
			}
			if (warpState.opaque) {
				last = 0;
				return;
			}
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
			// A throwing frame must never escape into the host: catch it, report the
			// first failure of a burst, and let the next frame try again.
			try {
				stepScene(state, delta);
				const started = performance.now();
				renderScene(canvas, state);
				state.drawMs = state.drawMs * 0.9 + (performance.now() - started) * 0.1;
				state.failing = false;
			} catch (error) {
				state.renderErrors += 1;
				if (!state.failing && now - (state.errorLoggedAt ?? -Infinity) > 2000) {
					state.errorLoggedAt = now;
					console.error("graph-view: frame failed, retrying next frame", error);
				}
				state.failing = true;
			}
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
			const gate = Math.max(state.settings.layout === "spiral" ? 12 : 16, entry.radius * 0.9, entry.dot / 2 + 6);
			if (distance > gate) continue;
			const score = distance / gate + entry.depth * 0.05;
			if (score < bestScore) {
				best = { node: entry.node, screenX: x, screenY: y };
				bestScore = score;
			}
		}
		return best;
	};

	/** Dive toward the star, then the warp overlay opens the target and holds until it has mounted. One palette hue feeds star, warp and interior. */
	const warpInto = (node, open) => {
		if (node === undefined || warpState.stop !== null) return;
		const theme = themeOf(settings.theme);
		const look = { hue: nodeHue(settings, node), label: node.label };
		const entry = state.projected.find((item) => item.node.id === node.id);
		const rect = canvasRef.current?.getBoundingClientRect();
		trackNodeById(node.id);
		if (state.focusTween !== null) {
			state.focusTween.duration = 520;
			state.focusTween.toDistance *= 0.5;
			state.targetDistance = state.focusTween.toDistance;
		}
		playWarp({
			hue: look.hue,
			base: theme.base,
			x: entry !== undefined && rect !== undefined ? rect.left + entry.x : undefined,
			y: entry !== undefined && rect !== undefined ? rect.top + entry.y : undefined,
			onArrive: () => open(look)
		});
	};
	const enterSession = (node) => warpInto(node, (look) => onEnterSession?.(node, look));
	const enterWorkspace = (node) => warpInto(node, (look) => onOpenWorkspace?.(node.workspaceId, look));
	const enterNode = (node) => (node.kind === "folder" ? enterWorkspace : enterSession)(node);

	/** Track one body: glide the camera onto it; suns frame wider because they carry a cluster. */
	/** Where the camera should end up for one body: a dive, not a nudge. */
	const diveDistance = (node) => {
		const fit = state.fit ?? 3.4;
		// 聚焦 is a close-up: a conversation comes in to 6% of the overview distance and a
		// workspace sun to 17%, so the body fills the frame instead of sitting in it.
		return clamp(node.kind === "folder" ? Math.max(0.5, fit * 0.17) : Math.max(0.2, fit * 0.06), 0.14, 7);
	};

	/** `hop` ({ distance, lift }) marks a 巡游 leg; any other track is the user taking over and ends the tour. */
	const trackNodeById = (nodeId, duration, hop) => {
		const node = state.galaxy?.nodes.find((item) => item.id === nodeId);
		if (node === undefined) return false;
		if (hop === undefined) stopTour(state);
		state.free = false;
		state.trackId = node.id;
		state.trackNode = node;
		state.flyTo = null;
		state.idleAt = performance.now();
		const dive = hop?.distance ?? diveDistance(node);
		// Timed cubic glide instead of an exponential chase: the same move reads as a
		// deliberate dive and lands instead of creeping in forever. The clock is the wall
		// clock, not `state.time`: that one advances by the *clamped* frame delta, so on a
		// slow frame the glide both slows down and steps further per frame — which is what
		// made the tour stutter and then jump.
		state.focusTween = {
			startedAt: performance.now(),
			duration: Number.isFinite(duration) ? duration : node.kind === "folder" ? 1150 : 980,
			fromX: state.cam.target.x,
			fromY: state.cam.target.y,
			fromZ: state.cam.target.z,
			fromDistance: state.cam.distance,
			toX: node.x,
			toY: node.y,
			toZ: node.z,
			toDistance: dive,
			lift: hop?.lift ?? 0
		};
		state.targetDistance = dive;
		return true;
	};

	/** 连接两篇: fly the shortest link path between two picked stars, hop by hop. */
	const startRoute = (fromId, toId) => {
		const from = graph.nodes.findIndex((node) => node.id === fromId);
		const to = graph.nodes.findIndex((node) => node.id === toId);
		const path = from < 0 || to < 0 ? null : shortestPath(graph, from, to);
		let ids = path === null ? null : path.map((index) => graph.nodes[index].id);
		if (ids === null && from >= 0 && to >= 0) {
			// Workspaces are separate components (a conversation links only to its own sun),
			// so a cross-workspace pair travels sun to sun through open space.
			const sunOf = (node) => (node.kind === "folder" ? node.id : typeof node.folderId === "string" && node.folderId !== "" ? node.folderId : null);
			const start = graph.nodes[from];
			const end = graph.nodes[to];
			const startSun = sunOf(start);
			const endSun = sunOf(end);
			const startLeg = startSun === null ? null : shortestPath(graph, from, graph.nodes.findIndex((node) => node.id === startSun));
			const endLeg = endSun === null ? null : shortestPath(graph, graph.nodes.findIndex((node) => node.id === endSun), to);
			if (startLeg !== null && endLeg !== null) {
				ids = startLeg.concat(endLeg).map((index) => graph.nodes[index].id).filter((id, index, list) => index === 0 || list[index - 1] !== id);
				showNotice(t("notice.viaSuns"));
			}
		}
		if (ids === null) {
			showNotice(t("notice.noPath"));
			return;
		}
		state.route = { ids, set: new Set(ids), ends: [ids[0], ids[ids.length - 1]], hop: 0, landedAt: null };
		state.selectedId = null;
		setCard(null);
		trackNodeById(ids[0], 2200);
	};
	const cancelConnect = () => {
		state.connect = null;
		setConnectPhase(null);
	};

	/** Stop tracking: draw back out to the whole galaxy with the same kind of glide. */
	const releaseTrack = () => {
		stopTour(state);
		if (state.trackId === null) return;
		state.trackId = null;
		state.trackNode = null;
		state.focusTween = {
			startedAt: performance.now(),
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
	state.actions = { track: trackNodeById, release: releaseTrack };

	/** Same behaviour as tracking, kept as the card's naming. */
	const flyToNode = (nodeId) => trackNodeById(nodeId);

	/** Place the info card beside a star, kept inside the stage. */
	const placeCard = (node, screenX, screenY) => {
		const width = 250;
		const height = node.kind === "folder" ? 300 : 150;
		const stage = wrapRef.current;
		const bounds = stage === null ? { width: 800, height: 600 } : stage.getBoundingClientRect();
		// Step *around* the star instead of on top of it: beside it when the stage has
		// room, otherwise below or above, and only overlapping as the last resort. While a
		// body is tracked it holds the middle of the stage, so the gap grows.
		// While a body is tracked the camera dives onto it and holds it in the *middle* of the
		// stage, so the card has to be placed against that — anchoring it on the click point
		// left it sitting over the star after the glide landed.
		const tracking = state.trackId !== null;
		const anchorX = tracking ? bounds.width / 2 : screenX;
		const anchorY = tracking ? bounds.height / 2 : screenY;
		const gap = tracking ? 96 : 30;
		const topLimit = headRoom(stage) + 12;
		const bottomLimit = Math.max(topLimit, bounds.height - height - 12);
		const spots = [
			{ left: anchorX + gap, top: anchorY - height * 0.4 },
			{ left: anchorX - gap - width, top: anchorY - height * 0.4 },
			{ left: anchorX - width / 2, top: anchorY + gap },
			{ left: anchorX - width / 2, top: anchorY - gap - height }
		];
		const fits = (spot) => spot.left >= 12 && spot.left <= bounds.width - width - 12 && spot.top >= topLimit && spot.top <= bottomLimit;
		const spot = spots.find(fits) ?? spots[0];
		setCard({
			id: node.id,
			left: clamp(spot.left, 12, Math.max(12, bounds.width - width - 12)),
			top: clamp(spot.top, topLimit, bottomLimit)
		});
	};

	/** Drag the info card by any non-interactive part, kept inside the stage. */
	const dragCard = (event) => {
		event.stopPropagation();
		if (event.button !== 0 || event.target.closest("button, a, input, textarea, select") !== null) return;
		const box = event.currentTarget;
		const stage = wrapRef.current;
		if (stage === null) return;
		const bounds = stage.getBoundingClientRect();
		const startX = event.clientX;
		const startY = event.clientY;
		const fromLeft = box.offsetLeft;
		const fromTop = box.offsetTop;
		const maxLeft = Math.max(0, bounds.width - box.offsetWidth);
		const maxTop = Math.max(0, bounds.height - box.offsetHeight);
		event.preventDefault();
		box.classList.add("dgv-card-dragging");
		const move = (next) => {
			const left = Math.max(0, Math.min(maxLeft, fromLeft + next.clientX - startX));
			const top = Math.max(Math.min(headRoom(stage), maxTop), Math.min(maxTop, fromTop + next.clientY - startY));
			setCard((current) => (current === null ? current : { ...current, left, top }));
		};
		const end = () => {
			box.classList.remove("dgv-card-dragging");
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", end);
			window.removeEventListener("pointercancel", end);
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", end);
		window.addEventListener("pointercancel", end);
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
			// Free 360°: no pitch band, the basis stays exact at the poles.
			state.cam.pitch = wrapAngle(state.drag.pitch + dy * 0.0032);
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
			setHover(star === null ? null : { id, kind: star.node.kind, label: star.node.label, path: star.node.path ?? star.node.cwd ?? "", meta: nodeMeta(star.node, t), hue: nodeHue(state.settings, star.node), tone: nodeTone(state.settings, star.node) });
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
		if (state.connect !== null) {
			if (star === null) {
				cancelConnect();
				return;
			}
			if (state.connect.phase === "start") {
				state.connect = { phase: "end", start: star.node.id };
				setConnectPhase("end");
				return;
			}
			const start = state.connect.start;
			cancelConnect();
			startRoute(start, star.node.id);
			return;
		}
		if (star === null) {
			state.selectedId = null;
			state.route = null;
			releaseTrack();
			setCard(null);
			onSelectionChange?.(null);
			return;
		}
		state.selectedId = star.node.id;
		state.route = null;
		// Clicking a body tracks it: the camera glides over and holds it centred.
		trackNodeById(star.node.id);
		// A mouse pick must not move the keyboard cursor: Tab then starts from the
		// first star, which is what a keyboard user expects.
		openCardFor(star.node.id, false);
	};

	const onDoubleClick = (event) => {
		const star = pickStar(event, event.currentTarget);
		if (star !== null) enterNode(star.node);
	};

	/** Wheel dolly; non-passive so the page does not scroll. */
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas === null || canvas === undefined) return;
		const onWheel = (event) => {
			event.preventDefault();
			// A wheel mid-dive means the user is steering: hand the dolly back to them
			// but keep the subject tracked.
			// Step from the pending target, not the eased distance, so fast wheel ticks add up
			// instead of being swallowed by the easing lag.
			const from = state.focusTween === null ? state.targetDistance : state.cam.distance;
			state.focusTween = null;
			const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
			state.targetDistance = Math.max(ZOOM_FLOOR, from * Math.exp(delta * 0.0065));
			state.idleAt = performance.now();
		};
		canvas.__dgvScene = state;
		canvas.addEventListener("wheel", onWheel, { passive: false });
		return () => canvas.removeEventListener("wheel", onWheel);
	}, [state]);

	/**
	 * A press whose gesture ends anywhere but on the surface — released over a panel, a
	 * browser-cancelled trackpad gesture, or the window losing focus mid-drag — used to
	 * leave `state.drag` set. With a drag live both the idle cruise and the inertia sit
	 * out every frame, so one stray click froze the rotation until the next press. This
	 * net only ends the gesture; the canvas's own pointerup resolves the click.
	 */
	useEffect(() => {
		const lost = () => {
			if (state.drag === null) return;
			state.drag = null;
			state.moved = false;
			state.yawVelocity = 0;
			state.idleAt = performance.now();
		};
		window.addEventListener("pointerup", lost);
		window.addEventListener("pointercancel", lost);
		window.addEventListener("blur", lost);
		return () => {
			window.removeEventListener("pointerup", lost);
			window.removeEventListener("pointercancel", lost);
			window.removeEventListener("blur", lost);
		};
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
			state.fit = overviewDistance(state.shellRadius, state.cam.fov);
			state.targetDistance = state.fit;
			state.focusFolder = null;
			state.free = false;
			state.route = null;
			if (state.trackId !== null) releaseTrack();
			else {
				state.focusTween = {
					startedAt: performance.now(),
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
			setCard(null);
			onSelectionChange?.(null);
		};
		controlsFit.current = fit;
		registerControls?.({
			fit,
			focusFolder: (folderId) => {
				state.focusFolder = folderId;
			},
			replay: () => {
				state.reveal = 0.001;
				state.cam.distance = state.targetDistance * 1.35;
			},
			/**
			 * 外观切换的衔接：keep the frame that is on screen now and dissolve it out
			 * over the next half second, while the new look's stars grow in. Call it
			 * before the new settings render, so the snapshot is still the old look.
			 */
			transition: (milliseconds = 560) => {
				const canvas = canvasRef.current;
				if (canvas === null || canvas === undefined || canvas.width === 0 || state.galaxy === null) return;
				const snapshot = state.fade?.canvas ?? document.createElement("canvas");
				if (snapshot.width !== canvas.width || snapshot.height !== canvas.height) {
					snapshot.width = canvas.width;
					snapshot.height = canvas.height;
				}
				const paint = snapshot.getContext("2d");
				if (paint === null) return;
				paint.setTransform(1, 0, 0, 1, 0, 0);
				paint.globalAlpha = 1;
				paint.globalCompositeOperation = "copy";
				paint.drawImage(canvas, 0, 0);
				state.fade = { canvas: snapshot, startedAt: performance.now(), ms: Math.max(120, milliseconds) };
				// The incoming look grows out of the core instead of snapping into place,
				// and finishes well inside the dissolve.
				state.reveal = Math.min(state.reveal, 0.62);
			},
			flyTo: flyToNode,
			/** Select a star and dive to it (search, sidebar clicks); false when it is not drawn. */
			focus: (nodeId) => {
				const node = graph.nodes.find((item) => item.id === nodeId);
				if (node === undefined) return false;
				state.route = null;
				state.selectedId = nodeId;
				trackNodeById(nodeId);
				setCard(null);
				placeCard(node, state.width * 0.5, state.height * 0.5);
				onSelectionChange?.(null);
				loopRef.current.ensure();
				return true;
			},
			startConnect: () => {
				state.route = null;
				state.connect = { phase: "start" };
				setConnectPhase("start");
			},
			/** The tour itself follows `settings.tour`; this only lifts a user stop so the next start takes. */
			setTour: () => {
				state.tourHeld = false;
			}
		});
	}, [registerControls, state, onSelectionChange, graph]);

	/** F to the selection, R to the overview. */
	useEffect(() => {
		const editable = (target) => target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
		const down = (event) => {
			if (event.metaKey || event.ctrlKey || event.altKey || editable(event.target)) return;
			if (warpState.stop !== null || wrapRef.current === null || wrapRef.current.offsetParent === null) return;
			if (event.code === "KeyF" && state.selectedId !== null) {
				trackNodeById(state.selectedId);
				event.preventDefault();
			} else if (event.code === "KeyR") {
				controlsFit.current?.();
				event.preventDefault();
			} else if (event.key === "Escape" && (state.connect !== null || state.route !== null)) {
				cancelConnect();
				state.route = null;
			}
		};
		window.addEventListener("keydown", down);
		return () => window.removeEventListener("keydown", down);
	}, [state]);

	const onKeyDown = (event) => {
		const nodes = graph.nodes;
		if (event.key === "Escape") {
			state.selectedId = null;
			state.focusFolder = null;
			state.route = null;
			cancelConnect();
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
			if (node !== undefined) enterNode(node);
		}
	};

	const theme = themeOf(settings.theme);
	const cardNode = card === null ? null : graph.nodes.find((item) => item.id === card.id) ?? null;
	const cardSwatch = cardNode === null ? swatchCss(0, null) : swatchCss(nodeHue(settings, cardNode), nodeTone(settings, cardNode));
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
		connectPhase !== null &&
			h(
				"div",
				{ className: "dgv-banner" },
				t(connectPhase === "start" ? "connect.pickStart" : "connect.pickEnd"),
				h("button", { type: "button", className: "dgv-btn", onClick: cancelConnect }, t("connect.cancel"))
			),
		notice !== null && h("div", { className: "dgv-banner dgv-banner-notice", role: "status" }, notice),
		cardNode !== null &&
			h(
				"div",
				{
					className: "dgv-card",
					style: { left: card.left, top: card.top },
					onPointerDown: dragCard
				},
				h(
					"div",
					{ className: "dgv-card-head" },
					h("span", { className: "dgv-tip-dot", style: { background: cardSwatch, boxShadow: `0 0 8px ${cardSwatch}` } }),
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
								h("span", { className: `dgv-dot${child.running ? " dgv-dot-live" : ""}`, style: { background: swatchCss(nodeHue(settings, child), nodeTone(settings, child)) } }),
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
							onClick: () => enterNode(cardNode)
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
		// A card is open: the tip would sit on top of it, describing the same body twice.
		card === null &&
			hover !== null &&
			h(
				"div",
				{ className: "dgv-tip", ref: tipRef },
				h(
					"div",
					{ className: "dgv-tip-head" },
					h("span", { className: "dgv-tip-dot", style: { background: swatchCss(hover.hue, hover.tone), boxShadow: `0 0 8px ${swatchCss(hover.hue, hover.tone)}` } }),
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
	state.reveal = Math.min(1, state.reveal + seconds / 2.6);
	// 太阳系 revolves: planets around the sun, moons around their planet, from the scene
	// clock so it is paused by the same conditions as everything else.
	if (settings.layout === "system" && state.galaxy !== null) orbitSystem(state.galaxy, state.time);
	// 星环: every body travels its ring in a double helix (see orbitRings).
	if (settings.layout === "rings" && state.galaxy !== null) orbitRings(state.galaxy, state.time);
	// 浑天: each ring turns inside its own plane (see orbitSphere), not around one common axis.
	if (settings.layout === "sphere" && state.galaxy !== null) orbitSphere(state.galaxy, state.time);
	stepForces(state);
	// Fast ease (~70 ms to settle most of a step) so the wheel feels attached to the hand.
	state.cam.distance += (state.targetDistance - state.cam.distance) * (1 - Math.exp(-seconds * 16));

	// A focused body is meant to be *orbited*: while one is tracked the camera turns around
	// it from the moment the glide lands, at a slow dedicated rate — independent of 自动环绕
	// (that switch is about the overview) and of the 1.6 s idle gate.
	const focused = state.trackId !== null && state.focusTween === null;
	const idle = (focused || performance.now() - state.idleAt > 1600) && state.focusTween === null;
	const cruise = focused ? TRACK_ORBIT : 0.022 * ((settings.orbitSpeed ?? 0.35) / 0.35);
	// Cruise breathing: the elevation sways ±8° over 90 s while idle. Applied as a
	// delta so a drag keeps whatever pitch the user left.
	const breath = Math.sin((state.time * Math.PI * 2) / 90) * 0.14;
	if ((settings.autoOrbit || focused) && state.drag === null && idle) {
		// Overview: Galaxy View's cruise rate (0.022 rad/s, one turn in about 4.8 min) at the
		// default 0.35; the moving sky is what makes the shell grains shimmer. Focused: the
		// slow turn around the subject, so its cluster reads in the round.
		state.cam.yaw += seconds * cruise;
		state.cam.pitch = wrapAngle(state.cam.pitch + breath - (state.breath ?? breath));
		state.yawVelocity *= 0.92;
	} else if (state.drag === null && Math.abs(state.yawVelocity) > 0.00002) {
		state.cam.yaw += state.yawVelocity;
		state.yawVelocity *= 0.9;
	}

	// Camera glide: one timed cubic tween owns both the orbit centre and the dolly,
	// so a dive lands on the star instead of asymptotically creeping towards it.
	if (state.focusTween !== null) {
		const tween = state.focusTween;
		const progress = Math.min(1, (performance.now() - tween.startedAt) / tween.duration);
		const eased = easeInOutCubic(progress);
		state.cam.target.x = tween.fromX + (tween.toX - tween.fromX) * eased;
		state.cam.target.y = tween.fromY + (tween.toY - tween.fromY) * eased;
		state.cam.target.z = tween.fromZ + (tween.toZ - tween.fromZ) * eased;
		// `lift` pulls the camera back mid-glide so a long hop shows where it is going.
		state.cam.distance = tween.fromDistance + (tween.toDistance - tween.fromDistance) * eased + (tween.lift ?? 0) * Math.sin(Math.PI * eased);
		state.flyTo = null;
		if (progress >= 1) {
			state.cam.distance = tween.toDistance;
			state.targetDistance = tween.toDistance;
			state.focusTween = null;
		}
	}
	state.breath = breath;
	advanceRoute(state);

	// Tracking: hold the subject in the middle once the glide has landed, so the
	// galaxy orbits around it instead of drifting it off screen.
	if (state.trackId !== null && state.focusTween === null) {
		if (state.trackNode === null) {
			state.trackNode = state.galaxy?.nodes.find((node) => node.id === state.trackId) ?? null;
			if (state.trackNode === null) state.trackId = null;
		}
		if (state.trackNode !== null) {
			// Same smoothing at every frame length: `min(1, seconds * 8)` closes half the
			// gap in one 64 ms frame, so a single stutter read as a jump.
			const follow = 1 - Math.exp(-seconds * 8);
			state.cam.target.x += (state.trackNode.x - state.cam.target.x) * follow;
			state.cam.target.y += (state.trackNode.y - state.cam.target.y) * follow;
			state.cam.target.z += (state.trackNode.z - state.cam.target.z) * follow;
		}
	}

	// Teleport: glide the orbit centre onto the chosen star.
	if (state.flyTo !== null) {
		const ease = 1 - Math.exp(-seconds * 2.6);
		state.cam.target.x += (state.flyTo.x - state.cam.target.x) * ease;
		state.cam.target.y += (state.flyTo.y - state.cam.target.y) * ease;
		state.cam.target.z += (state.flyTo.z - state.cam.target.z) * ease;
		const gap = Math.hypot(state.flyTo.x - state.cam.target.x, state.flyTo.y - state.cam.target.y, state.flyTo.z - state.cam.target.z);
		if (gap < 0.004) state.flyTo = null;
	}

	advanceTour(state);
	if (state.trackId !== null) {
		state.spin += seconds * 0.012;
		return;
	}
	if (!state.free && state.focusTween === null && (state.cam.target.x !== 0 || state.cam.target.y !== 0 || state.cam.target.z !== 0)) {
		const ease = 1 - Math.exp(-seconds * 1.6);
		state.cam.target.x *= 1 - ease;
		state.cam.target.y *= 1 - ease;
		state.cam.target.z *= 1 - ease;
	}
	state.spin += seconds * 0.012;
}

/**
 * 巡游 follows `settings.tour`: each leg is a tracked glide (pulled back mid-flight on
 * long hops) to the nearest unvisited recently active conversation, then a dwell that
 * holds it centred. A user track, key flight or release ends it through {@link stopTour}.
 */
function advanceTour(state) {
	const wanted = state.settings.tour === true && state.galaxy !== null;
	if (!wanted) {
		state.tourHeld = false;
		if (state.tour) {
			state.tour = false;
			state.tourSeen = [];
			if (state.selectedId === state.trackId) state.selectedId = null;
			state.actions?.release?.();
		}
		return;
	}
	if (state.tourHeld) return;
	if (!state.tour) {
		state.tour = true;
		state.tourAt = 0;
		state.tourSeen = [];
	}
	if (state.focusTween !== null || state.time < state.tourAt) return;
	const next = nextTourStop(state);
	if (next === null || state.actions?.track === undefined) return;
	// 巡游速度 only sets how long each stop is held; the flight between stops keeps one pace.
	const speed = clamp(Number(state.settings.tourSpeed) || 1, 0.2, 3);
	const glide = 2600;
	const fit = state.fit ?? 3.4;
	const from = state.cam.target;
	const travel = Math.hypot(next.x - from.x, next.y - from.y, next.z - from.z);
	state.actions.track(next.id, glide, { distance: clamp(fit * 0.2, 0.45, 3), lift: Math.min(fit * 0.35, travel * 0.8) });
	state.selectedId = next.id;
	state.tourSeen.push(next.id);
	if (state.tourSeen.length > 12) state.tourSeen.shift();
	state.tourAt = state.time + glide / 1000 + 5 / speed;
}

/** Height of the floating page header over the stage (0 when absent). */
function headRoom(element) {
	if (element === null || typeof getComputedStyle !== "function") return 0;
	return Number.parseFloat(getComputedStyle(element).getPropertyValue("--dgv-head-h")) || 0;
}

/** Next 巡游 stop: among the 48 most recently active conversations (inside the isolated workspace, if any), one of the three nearest not visited lately. */
function nextTourStop(state) {
	const focus = state.focusFolder ?? null;
	const pool = state.galaxy.nodes.filter((node) => node.kind === "session" && !node.archived && (focus === null || node.folderId === focus));
	if (pool.length === 0) return null;
	const recent = pool.sort((left, right) => right.updatedAt - left.updatedAt).slice(0, 48);
	const seen = new Set(state.tourSeen);
	let options = recent.filter((node) => node.id !== state.trackId && !seen.has(node.id));
	if (options.length === 0) {
		state.tourSeen = [];
		options = recent.filter((node) => node.id !== state.trackId);
	}
	if (options.length === 0) return recent[0];
	const here = state.trackNode ?? state.cam.target;
	const gap = (node) => Math.hypot(node.x - here.x, node.y - here.y, node.z - here.z);
	options.sort((left, right) => gap(left) - gap(right));
	return options[Math.floor(hash01(`tour:${state.time.toFixed(2)}`) * Math.min(3, options.length))];
}

/** The user took over (a click, a key, a search, 复位): end the tour and let the page clear `settings.tour`. */
function stopTour(state) {
	if (!state.tour) return;
	state.tour = false;
	state.tourSeen = [];
	state.tourHeld = state.settings?.tour === true;
	state.onTourEnd?.();
}

/**
 * Force layer: a few ticks per frame inside a ~4 ms budget, so a big graph relaxes
 * over more frames instead of dropping them. Haze caches key off `simEpoch`, which
 * moves at most twice a second while stars are still drifting.
 */
function stepForces(state) {
	const sim = state.sim;
	if (sim === null || sim === undefined || state.galaxy === null || simulationSettled(sim)) return;
	const params = physicsOf(state.settings);
	const started = performance.now();
	let ticks = 0;
	while (ticks < 4 && (ticks === 0 || performance.now() - started < 4)) {
		ticks += 1;
		if (!stepSimulation(sim, params, state.simReach)) break;
	}
	writeSimulation(sim, state.galaxy.nodes);
	if (simulationSettled(sim) || state.time - (state.simEpochAt ?? 0) > 0.5) {
		state.simEpoch += 1;
		state.simEpochAt = state.time;
	}
}

/** 连接两篇: once the camera lands on a hop, pause, then glide to the next one. */
function advanceRoute(state) {
	const route = state.route;
	if (route === null || route === undefined || state.focusTween !== null) return;
	if (route.hop >= route.ids.length - 1) return;
	if (route.landedAt === null) {
		route.landedAt = state.time;
		return;
	}
	const speed = clamp(Number(state.settings.tourSpeed) || 1, 0.2, 3);
	if (state.time - route.landedAt < 1.1 / speed) return;
	route.hop += 1;
	route.landedAt = null;
	state.actions?.track?.(route.ids[route.hop], 1600);
	state.route = route;
}

/** Current node hue for the active palette. */
function nodeTone(settings, node) {
	return toneAt(settings, Number.isFinite(node.hueIndex) ? node.hueIndex : 0);
}

function nodeHue(settings, node) {
	// A star without a palette slot must not produce a NaN hue: that would make
	// createRadialGradient throw and silently kill the rest of the frame.
	return hueAt(settings, Number.isFinite(node.hueIndex) ? node.hueIndex : 0);
}

/**
 * Resting link alpha per class at 链接透明度 0.14: member, lineage, dimmed. Dimmed
 * stars only fade to 0.82, so their links stay readable at 0.45 instead of vanishing.
 */
/** Wrap an angle into (-π, π] so a free orbit never drifts into large numbers. */
function wrapAngle(value) {
	const turn = Math.PI * 2;
	const wrapped = ((value + Math.PI) % turn + turn) % turn - Math.PI;
	return wrapped === -Math.PI ? Math.PI : wrapped;
}

/** 星体亮度 beyond the base pass: a standing lift every body gets, then the slider's own. */
/** 浑天's body glow: one inner halo per carrier, fixed alpha (the memory library's 0.462). */


/** While a body is focused the camera orbits it at this rate (rad/s): one turn in ~2.3 min. */
const TRACK_ORBIT = 0.046;

const BODY_CORE_LIFT = 0.42;
const BODY_GAIN_LIFT = 1;

const LINK_ALPHA = [0.9, 1, 0.45];

/** Per-link colours bucketed (`order`/`start`/`end`) so the link pass strokes one path per colour; rebuilt with the galaxy or theme. */
function linkLookFor(state, settings) {
	const cached = state.linkLook;
	if (cached !== undefined && cached.galaxy === state.galaxy && cached.theme === settings.theme && cached.seed === settings.colorSeed && cached.color === settings.linkColor && cached.brightness === settings.linkBrightness) return cached;
	const custom = linkColorRgb(settings.linkColor);
	const brightness = clamp(settings.linkBrightness ?? 1, 0.3, 2.5);
	const shade = (rgb) => linkShade(rgb, brightness);
	const styles = [];
	const touched = [];
	const ink = [];
	const keys = new Map();
	const links = state.galaxy.links;
	const nodes = state.galaxy.nodes;
	const bucketOf = new Int32Array(links.length);
	// 跟随星色: every link is a gradient from one star's colour to the other's.
	const ends = custom === null ? new Array(links.length * 2) : null;
	const touchedEnds = custom === null ? new Array(links.length * 2) : null;
	const endStyle = new Map();
	const styleOf = (rgb) => {
		const key = rgb.join(",");
		if (!endStyle.has(key)) endStyle.set(key, `rgb(${key})`);
		return endStyle.get(key);
	};
	// 近景: a far thread is a darker thread, not a thinner one — its tint is multiplied, which
	// puts it in its own colour bucket, so the batching stays exactly as it was.
	const nearDepth = state.depthNear ?? 0;
	const depthSpan = state.depthSpan ?? 1;
	const linkProx = (link) => {
		const a = nodes[link.a];
		const b = nodes[link.b];
		const da = a?._p?.depth ?? nearDepth + depthSpan;
		const db = b?._p?.depth ?? nearDepth + depthSpan;
		return clamp(1 - ((da + db) / 2 - nearDepth) / depthSpan, 0, 1);
	};
	const fadeChannels = (rgb, prox) => {
		const k = prox >= 0.66 ? 1 : prox >= 0.33 ? 0.72 : 0.42;
		if (k === 1) return rgb;
		// In place: this runs once per link per frame and the arrays are fresh each call.
		rgb[0] = Math.round(rgb[0] * k);
		rgb[1] = Math.round(rgb[1] * k);
		rgb[2] = Math.round(rgb[2] * k);
		return rgb;
	};
	links.forEach((link, index) => {
		const a = nodes[link.a];
		const b = nodes[link.b];
		const prox = linkProx(link);
		const colourA = fadeChannels(a === undefined ? starPlateau(0) : starPlateau(nodeHue(settings, a), undefined, nodeTone(settings, a)), prox);
		const colourB = fadeChannels(b === undefined ? starPlateau(0) : starPlateau(nodeHue(settings, b), undefined, nodeTone(settings, b)), prox);
		if (ends !== null) {
			ends[index * 2] = styleOf(shade(linkEnd(colourA, false)));
			ends[index * 2 + 1] = styleOf(shade(linkEnd(colourB, false)));
			touchedEnds[index * 2] = styleOf(shade(linkEnd(colourA, true)));
			touchedEnds[index * 2 + 1] = styleOf(shade(linkEnd(colourB, true)));
		}
		const key = (custom ?? linkTint(colourA, colourB, false)).join(",");
		if (!keys.has(key)) {
			keys.set(key, styles.length);
			styles.push(`rgb(${shade(custom ?? linkTint(colourA, colourB, false)).join(",")})`);
			const lit = custom === null ? linkTint(colourA, colourB, true) : custom.map((channel) => Math.round(channel + (255 - channel) * 0.3));
			touched.push(`rgb(${shade(lit).join(",")})`);
			const [inkHue, inkSaturation] = rgbToHsl(...lit);
			ink.push(`rgb(${hslToRgb(inkHue, custom === null ? inkSaturation * 0.55 : inkSaturation, 0.34).join(",")})`);
		}
		bucketOf[index] = keys.get(key);
	});
	const order = Array.from(links.keys()).sort((left, right) => bucketOf[left] - bucketOf[right] || left - right);
	const start = new Int32Array(styles.length).fill(order.length);
	const end = new Int32Array(styles.length);
	order.forEach((linkIndex, slot) => {
		const bucket = bucketOf[linkIndex];
		start[bucket] = Math.min(start[bucket], slot);
		end[bucket] = slot + 1;
	});
	state.linkLook = { galaxy: state.galaxy, theme: settings.theme, seed: settings.colorSeed, color: settings.linkColor, brightness: settings.linkBrightness, styles, touched, ink, bucketOf, order, start, end, ends, touchedEnds };
	return state.linkLook;
}

/**
 * World-space haze (recipe §4): nebula billboards around the core plus soft clouds
 * over the largest workspaces, drawn additively into a quarter-resolution canvas and
 * upscaled. Every sprite is cached; the billboard lists are rebuilt only when the
 * galaxy, palette or shell changes.
 */
function paintHaze(context, state, theme, basis, reveal, budget) {
	const settings = state.settings;
	// 星云天幕 drives the nebula, 集群云雾 the cluster clouds (off on the mobile tier).
	const nebulaIntensity = clamp(settings.veil, 0, 1) * 1.6 * reveal;
	// 集群云雾 is steep on purpose: the old linear 0.08 ceiling barely changed the
	// picture across the whole slider. Now 0.3 is a faint tint and 1 a clear coloured cloud.
	// Cloud billboards are baked from node positions once, so a layout that moves its bodies
	// (太阳系's orbits, 星环's spin, 浑天's rings) would leave a coloured ghost wherever a planet
	// used to be. Those three keep only the nebula dome, which does not depend on node positions.
	const animated = settings.layout === "system" || settings.layout === "rings" || settings.layout === "sphere";
	const mist = budget.clouds && !animated ? clamp(settings.mist, 0, 1) : 0;
	const cloudIntensity = mist * 1.6 * reveal;
	if (nebulaIntensity <= 0.005 && cloudIntensity <= 0.005) return;
	let haze = state.haze;
	if (haze === undefined || haze.galaxy !== state.galaxy || haze.theme !== settings.theme || haze.seed !== settings.colorSeed || haze.shell !== state.shellRadius || haze.epoch !== state.simEpoch) {
		const colourA = starPlateau(hueAt(settings, 0), undefined, toneAt(settings, 0));
		const colourB = starPlateau(hueAt(settings, 1), undefined, toneAt(settings, 1));
		const groups = new Map();
		const groupOf = (key) => {
			const group = groups.get(key) ?? { key, hue: 0, tone: null, points: [] };
			groups.set(key, group);
			return group;
		};
		for (const node of state.galaxy.nodes) {
			if (node.kind === "folder") Object.assign(groupOf(node.id), { hue: nodeHue(settings, node), tone: nodeTone(settings, node) });
			else if (typeof node.folderId === "string") groupOf(node.folderId).points.push({ x: node.x, y: node.y, z: node.z });
		}
		haze = {
			galaxy: state.galaxy,
			theme: settings.theme,
			seed: settings.colorSeed,
			epoch: state.simEpoch,
			shell: state.shellRadius,
			nebula: createNebula(state.shellRadius ?? 1.2, colourA, colourB),
			clouds: mist > 0 ? createClusterClouds([...groups.values()]) : [],
			canvas: haze?.canvas ?? document.createElement("canvas")
		};
		state.haze = haze;
	}
	const width = state.width;
	const height = state.height;
	const low = haze.canvas;
	const lowW = Math.max(1, Math.ceil(width / 4));
	const lowH = Math.max(1, Math.ceil(height / 4));
	if (low.width !== lowW || low.height !== lowH) {
		low.width = lowW;
		low.height = lowH;
	}
	const paint = low.getContext("2d");
	paint.setTransform(1, 0, 0, 1, 0, 0);
	paint.globalAlpha = 1;
	paint.globalCompositeOperation = "source-over";
	paint.clearRect(0, 0, lowW, lowH);
	paint.globalCompositeOperation = "lighter";
	const quarter = lowW / width;
	const focal = (Math.min(width, height) * 0.5) / Math.tan(0.41);
	const eye = basis.eye;
	const fwd = basis.forward;
	const right = basis.right;
	const up = basis.up;
	const unfolding = state.reveal < 1;
	const spin = state.time * 0.0004;
	const spinCos = Math.cos(spin);
	const spinSin = Math.sin(spin);
	for (let layer = 0; layer < 2; layer += 1) {
		const set = layer === 0 ? haze.nebula : haze.clouds;
		const kind = layer === 0 ? "nebula" : "cloud";
		// Far below the reference's linear-space alphas: sRGB "lighter" has no tone
		// mapping, and the measured target is only ~(22,30,29) at the core.
		const strength = layer === 0 ? nebulaIntensity * 0.06 : 0.55 * mist ** 1.4 * reveal * reveal;
		if (strength <= 0.0003) continue;
		const cos = layer === 0 ? spinCos : 1;
		const sin = layer === 0 ? spinSin : 0;
		const swell = layer === 0 ? 1 : 0.75 + 0.6 * mist;
		for (const sprite of set.sprites) {
			// Cluster clouds ride the stars' intro wave so they arrive with their cluster.
			const stretch = layer === 0 || !unfolding ? 1 : revealScale(state.reveal, Math.hypot(sprite.x, sprite.y, sprite.z), 1);
			if (stretch <= 0) continue;
			const dx = (sprite.x * cos - sprite.z * sin) * stretch - eye.x;
			const dy = sprite.y * stretch - eye.y;
			const dz = (sprite.x * sin + sprite.z * cos) * stretch - eye.z;
			const depth = dx * fwd.x + dy * fwd.y + dz * fwd.z;
			if (depth <= 0.25) continue;
			// Billboards the camera flies through fade out instead of washing the frame.
			const near = clamp((depth - 0.25) / 0.75, 0, 1);
			const px = (width * 0.5 + ((dx * right.x + dy * right.y + dz * right.z) / depth) * focal) * quarter;
			const py = (height * 0.5 - ((dx * up.x + dy * up.y + dz * up.z) / depth) * focal) * quarter;
			const size = ((sprite.d * stretch * swell * focal) / depth) * quarter;
			if (px + size < 0 || px - size > lowW || py + size < 0 || py - size > lowH) continue;
			paint.globalAlpha = Math.min(1, strength * sprite.a * near);
			paint.drawImage(spriteImage(hazeSprite(set.colours[sprite.c], kind)), px - size / 2, py - size / 2, size, size);
		}
	}
	context.globalCompositeOperation = "lighter";
	context.globalAlpha = 1;
	// Bilinear is plenty for a blurred haze; "high" is a bicubic resample on the GPU,
	// and it costs several ms per full-frame upscale.
	context.imageSmoothingEnabled = true;
	context.imageSmoothingQuality = "low";
	context.drawImage(low, 0, 0, width, height);
	context.globalCompositeOperation = "source-over";
}

/**
 * Relative mass behind a star's drawn size (大小依据): "activity" uses the model's
 * recency/running size, "links" the link count, "uniform" none. 1 is a typical star.
 */
function starMass(node, sizeBy, degree) {
	const folder = node.kind === "folder";
	if (sizeBy === "uniform") return 1;
	if (sizeBy === "links") {
		const links = degree?.get(node.id) ?? 1;
		return folder ? clamp(0.6 + Math.sqrt(links) * 0.09, 0.6, 1.6) : clamp(0.8 + (links - 1) * 0.25, 0.8, 1.8);
	}
	return folder ? clamp(node.size / 3.6, 0.6, 1.5) : clamp(node.size / 1.3, 0.6, 1.4);
}

const DRIFT = createDriftStars();
const DRIFT_TINTS = [
	[157, 168, 196],
	[236, 228, 216],
	[191, 211, 255]
];

/**
 * 空间浮星: Galaxy View's size-attenuated field points, scattered through a volume
 * 3.2× the galaxy and fixed in the world, so they slide against the shell as the
 * camera orbits. Pixel squares, one path per tint.
 */
function paintDriftStars(context, state, basis, focal, budget, reveal) {
	const density = clamp(state.settings.fieldStars, 0, 1);
	const count = Math.round(DRIFT.count * density * budget.starScale);
	if (count <= 0) return;
	const volume = (state.galaxy?.extent ?? 1) * 3.2;
	const eye = basis.eye;
	const fwd = basis.forward;
	const right = basis.right;
	const up = basis.up;
	const width = state.width;
	const height = state.height;
	const dpr = state.dpr;
	const halfW = width * 0.5;
	const halfH = height * 0.5;
	// Three.js sizeAttenuation (px = size·(H/2)/depth) for 2.4 units at the reference's
	// ~200 radius, i.e. 0.012 here, times tan(fov/2) to express it against our focal.
	const sizeAt = 0.012 * 0.577;
	context.globalCompositeOperation = "source-over";
	for (let tint = 0; tint < DRIFT_TINTS.length; tint += 1) {
		const [r, g, b] = DRIFT_TINTS[tint];
		context.fillStyle = `rgb(${Math.round(r * 0.75)},${Math.round(g * 0.75)},${Math.round(b * 0.75)})`;
		context.globalAlpha = 0.6 * reveal;
		context.beginPath();
		for (let index = 0; index < count; index += 1) {
			if (DRIFT.tint[index] !== tint) continue;
			const dx = DRIFT.x[index] * volume - eye.x;
			const dy = DRIFT.y[index] * volume - eye.y;
			const dz = DRIFT.z[index] * volume - eye.z;
			const depth = dx * fwd.x + dy * fwd.y + dz * fwd.z;
			if (depth <= 0.1) continue;
			const px = halfW + ((dx * right.x + dy * right.y + dz * right.z) / depth) * focal;
			const py = halfH - ((dx * up.x + dy * up.y + dz * up.z) / depth) * focal;
			const side = Math.max(1, Math.round(clamp((sizeAt * focal) / depth, 0.6, 4) * dpr)) / dpr;
			if (px < -side || px > width + side || py < -side || py > height + side) continue;
			context.rect(Math.round((px - side / 2) * dpr) / dpr, Math.round((py - side / 2) * dpr) / dpr, side, side);
		}
		context.fill();
	}
	context.globalAlpha = 1;
}
const DEEP_SKY = createDeepSky();
const STAR_SCALE = 0.935;

/**
 * 球壳密度 → share of the original 3750-grain shell to draw. 0.2–0.7 keeps the old
 * linear 0.5–1 so the presets look the same; below thins to almost nothing, above
 * fills the doubled grain set up to 2× at 2.
 */
function shellShare(field) {
	const f = clamp(Number(field) || 0, 0, 2);
	if (f < 0.2) return 0.02 + 2.4 * f;
	if (f <= 0.7) return 0.3 + f;
	return 1 + (f - 0.7) / 1.3;
}

/**
 * Deep sky behind everything: direction-only stars, so they surround the view at any
 * zoom. Faint at the overview and fuller as the camera pulls back, where the shell
 * and the drift stars shrink to a ball and would otherwise leave black around it.
 */
function paintDeepSky(context, state, basis, focal, spin, budget, reveal) {
	const fit = state.fit ?? 3.4;
	const away = clamp((state.cam.distance / fit - 1) / 1.5, 0, 1);
	const alpha = (0.32 + 0.6 * away) * reveal;
	if (alpha <= 0.01) return;
	// 空间浮星 sets the density: half the set at its default 0.25, all of it from 0.5, none at 0.
	const count = Math.round(DEEP_SKY.count * Math.min(1, clamp(state.settings.fieldStars, 0, 1) * 2) * Math.max(0.5, budget.starScale));
	if (count <= 0) return;
	const fwd = basis.forward;
	const right = basis.right;
	const up = basis.up;
	const width = state.width;
	const height = state.height;
	const dpr = state.dpr;
	const halfW = width * 0.5;
	const halfH = height * 0.5;
	const cos = Math.cos(spin);
	const sin = Math.sin(spin);
	context.globalCompositeOperation = "source-over";
	for (let tint = 0; tint < DRIFT_TINTS.length; tint += 1) {
		const [r, g, b] = DRIFT_TINTS[tint];
		context.fillStyle = `rgb(${r},${g},${b})`;
		for (const bright of [0, 1]) {
			context.globalAlpha = alpha * (bright ? 0.9 : 0.45);
			context.beginPath();
			for (let index = 0; index < count; index += 1) {
				if (DEEP_SKY.tint[index] !== tint || (DEEP_SKY.glow[index] > 0.7 ? 1 : 0) !== bright) continue;
				const dx = DEEP_SKY.x[index] * cos - DEEP_SKY.z[index] * sin;
				const dy = DEEP_SKY.y[index];
				const dz = DEEP_SKY.x[index] * sin + DEEP_SKY.z[index] * cos;
				const depth = dx * fwd.x + dy * fwd.y + dz * fwd.z;
				if (depth <= 0.05) continue;
				const px = halfW + ((dx * right.x + dy * right.y + dz * right.z) / depth) * focal;
				const py = halfH - ((dx * up.x + dy * up.y + dz * up.z) / depth) * focal;
				const side = Math.max(1, Math.round(DEEP_SKY.size[index] * dpr)) / dpr;
				if (px < -side || px > width + side || py < -side || py > height + side) continue;
				context.rect(Math.round((px - side / 2) * dpr) / dpr, Math.round((py - side / 2) * dpr) / dpr, side, side);
			}
			context.fill();
		}
	}
	context.globalAlpha = 1;
}

/**
 * This bundle's identity. A live plugin reload can evaluate a new bundle while the old
 * one's frame loops are still running; the newest bundle claims the window and any
 * older loop stops itself instead of fighting over the view.
 */
const BUNDLE_ID = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
if (typeof window !== "undefined") {
	window.__dgvBundle = BUNDLE_ID;
	// Leftovers of a removed troubleshooting snapshot.
	try {
		window.localStorage.removeItem("dsh-graph-view:diagnostic");
		window.localStorage.removeItem("dsh-graph-view:lastError");
	} catch {
		// Storage may be unavailable; nothing to clean then.
	}
}

/** Paint one frame. */
function renderScene(canvas, state) {
	const context = canvas.getContext("2d");
	const settings = state.settings;
	if (context === null || state.galaxy === null) return;
	const theme = themeOf(settings.theme);
	const [lr, lg, lb] = theme.link;
	const budget = qualityBudget(settings, state.tier ?? (state.dpr >= 2 ? "high" : "low"));
	const width = state.width;
	const height = state.height;
	context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
	context.globalAlpha = 1;
	context.globalCompositeOperation = "source-over";
	context.shadowBlur = 0;
	// Context state outlives the frame: pin the resample quality so a "high" (bicubic)
	// setting can never leak into hundreds of sprite draws.
	context.imageSmoothingQuality = "low";
	context.fillStyle = theme.base;
	context.fillRect(0, 0, width, height);

	const reveal = easeOut(state.reveal);
	const bright = clamp(settings.brightness * 1.15, 0.02, 1.84);
	// Body and link strength from 亮度. Halos from 辉光: strength scales them (0 = none),
	// radius scales their size and threshold sets how bright a body must be to bloom;
	// all three are 1 at Galaxy View's defaults (0.35 / 0.35 / 0.22).
	const bodyGain = brightnessGain(settings.brightness);
	const bloomOn = budget.bloom && settings.bloomStrength > 0.001;
	// 辉光强度 scales the halos, 辉光范围 their span (with the area gain that keeps a
	// wider halo as bright instead of washing it out), 阈值 which bodies bloom at all.
	const haloGain = clamp(settings.bloomStrength, 0, 2.5) / 0.35;
	const haloSpan = bloomSpan(settings.bloom);
	const haloArea = bloomSpanGain(settings.bloom);
	const threshold = clamp(settings.threshold, 0, 1);

	// Sky shell: hard squares at fixed CSS sizes (never distance-attenuated), snapped
	// to device pixels and batched into one path per (class, tint) bucket.
	const skyBasis = cameraBasis(state.cam);
	const skySpin = state.time * 0.0008;
	const skyCos = Math.cos(skySpin);
	const skySin = Math.sin(skySpin);
	const skyRadius = state.shellRadius ?? 1.2;
	// SKY holds twice the original grains, so its keep threshold is half the share.
	const share = shellShare(settings.field);
	const skyKeep = (share / 2) * budget.starScale;
	const fieldKeep = Math.min(1, share) * budget.starScale;
	const skySize = clamp(settings.shellSize, 0.4, 2.4);
	// Kept for the dust and star passes: off the disc they draw sharper.
	const softShell = settings.layout === "spiral";
	// Focus pull: while a body is tracked the shell steps back so the subject reads, but
	// only a little — with the shell anchored to the body, a dive is a move *into* it.
	const proximity = clamp(state.cam.distance / 1.9, 0.72, 1);
	const focusPull = (state.trackId !== null ? 0.86 : 1) * proximity;
	const skyGlow = clamp(settings.shellGlow, 0, 2);
	const skyAlpha = (0.5 + 0.5 * Math.min(1, skyGlow)) * focusPull;
	const skyFill = skyStyles(Math.round(skyGlow * 20) / 20);
	const dprNow = state.dpr;
	const focal = (Math.min(width, height) * 0.5) / Math.tan(0.41);
	if (settings.backdrop) paintDeepSky(context, state, skyBasis, focal, skySpin * 0.5, budget, easeOut(state.reveal));
	// Shell intro: it trails the star wave, condensing inward from 0.7× its radius
	// while grains fill in by their uniform keep rank, so the sphere sparkles into
	// place instead of popping in whole.
	const shellT = clamp((state.reveal - 0.12) / 0.88, 0, 1);
	const shellGrow = easeOut(shellT);
	if (settings.backdrop && shellT > 0) {
		const shellRadius = skyRadius * (0.7 + 0.3 * shellGrow);
		const shellKeep = skyKeep * shellGrow;
		const innerKeep = fieldKeep * shellGrow;
		const shellAlpha = skyAlpha * Math.min(1, shellT * 1.6);
		const eye = skyBasis.eye;
		const fwd = skyBasis.forward;
		const right = skyBasis.right;
		const up = skyBasis.up;
		const halfW = width * 0.5;
		const halfH = height * 0.5;
		const sx = SKY.x;
		const sy = SKY.y;
		const sz = SKY.z;
		const keep = SKY.keep;

		// One L-class grain twinkles at a time on a Poisson schedule: mean wait 6/twinkle s
		// (星星眨眼 0.5 → every 12 s), 1.6 s sine swell, off at 0.
		if (state.skyTwinkle === undefined) state.skyTwinkle = { index: -1, start: 0, next: state.time + 4, serial: 0 };
		const twinkle = state.skyTwinkle;
		const twinkleRate = clamp(settings.twinkle, 0, 2);
		if (twinkle.index >= 0 && state.time - twinkle.start > 1.6) twinkle.index = -1;
		if (twinkleRate <= 0.01) twinkle.next = Math.max(twinkle.next, state.time + 1.5);
		else if (twinkle.index < 0 && state.time >= twinkle.next && SKY.large.length > 0) {
			twinkle.serial += 1;
			const [pick, wait] = hashStreams(`sky-twinkle/${twinkle.serial}`, 2);
			twinkle.index = SKY.large[Math.floor(pick * SKY.large.length) % SKY.large.length];
			twinkle.start = state.time;
			twinkle.next = state.time + 1.6 + clamp((-Math.log(Math.max(1e-6, wait)) * 6) / twinkleRate, 1.5, 90);
		}

		// Tiny halos for the larger grains and the twinkler, added under the squares: a soft
		// bloom per grain, never a blur of the whole shell (that read as a grey smear). One
		// pass over the bucket ranges — no temporary array, no `includes` per grain.
		context.globalCompositeOperation = "lighter";
		const haloSize = (SKY_HALO_RADIUS + clamp(settings.shellBloomBlur, 0, 6)) * 2;
		const bloom = clamp(settings.shellBloom, 0, 2);
		const glowAlpha = Math.min(1, 0.12 * bloom * shellAlpha);
		const drawGlow = (grain) => {
			if (grain < 0 || keep[grain] >= shellKeep) return;
			const gx = sx[grain] * shellRadius;
			const gz = sz[grain] * shellRadius;
			const dx = gx * skyCos - gz * skySin - eye.x;
			const dy = sy[grain] * shellRadius - eye.y;
			const dz = gx * skySin + gz * skyCos - eye.z;
			const depth = dx * fwd.x + dy * fwd.y + dz * fwd.z;
			if (depth <= 0.08) return;
			const px = halfW + ((dx * right.x + dy * right.y + dz * right.z) / depth) * focal;
			const py = halfH - ((dx * up.x + dy * up.y + dz * up.z) / depth) * focal;
			if (px < -haloSize || px > width + haloSize || py < -haloSize || py > height + haloSize) return;
			const swell = grain === twinkle.index ? 1 + 2.2 * Math.sin((Math.PI * clamp(state.time - twinkle.start, 0, 1.6)) / 1.6) : 1;
			context.globalAlpha = Math.min(1, glowAlpha * swell);
			context.drawImage(spriteImage(sparkSprite(SKY.tint[grain], dprNow)), px - SKY_HALO_RADIUS, py - SKY_HALO_RADIUS, haloSize, haloSize);
		};
		if (bloom > 0.01) {
			const classIndex = SKY_CLASSES.length - 1;
			for (let tint = 0; tint < SKY_TINTS.length; tint += 1) {
				const to = SKY.bucketEnd[classIndex * SKY_TINTS.length + tint];
				for (let grain = SKY.bucketStart[classIndex * SKY_TINTS.length + tint]; grain < to; grain += 1) drawGlow(grain);
			}
		}
		if (twinkle.index >= 0) drawGlow(twinkle.index);

		context.globalCompositeOperation = "source-over";
		context.globalAlpha = Math.min(1, shellAlpha);
		paintGrainSquares(context, SKY, shellRadius, skySpin, skyBasis, focal, width, height, dprNow, shellKeep, skySize, skyFill);
		// The inner field layer turns the other way, slower, and a shade dimmer than the shell.
		context.globalAlpha = Math.min(1, shellAlpha * 0.8);
		paintGrainSquares(context, FIELD, shellRadius, state.time * -0.00048, skyBasis, focal, width, height, dprNow, innerKeep, skySize, skyFill);
	}
	context.globalAlpha = 1;
	paintDriftStars(context, state, skyBasis, focal, budget, reveal);
	paintHaze(context, state, theme, skyBasis, reveal, budget);
	// Dust, guides and filaments below are additive.
	context.globalCompositeOperation = "lighter";

	const basis = skyBasis;
	const viewport = { width, height };
	// Intro: every star (and the dust and guides with it) unfolds out of the core in a
	// radial wave, inner stars first; `scale` stays 1 and the wave is per point.
	const scale = 1;
	const unfolding = state.reveal < 1;
	let waveMax = 1;
	if (unfolding) for (const node of state.galaxy.nodes) waveMax = Math.max(waveMax, Math.hypot(node.x, node.y, node.z));
	const waveAt = (x, y, z) => (unfolding ? revealScale(state.reveal, Math.hypot(x, y, z), waveMax) : 1);
	// Hover only lifts the star under the cursor (as in Galaxy View); a selection lights
	// its neighbourhood and fades the rest.
	const hot = state.hoverId ?? state.selectedId;
	// 巡游 lights each stop without dimming the rest: a selection is a spotlight, a tour
	// is a cruise, and re-dimming the whole sky every few seconds read as a stutter.
	const chosen = state.tour === true ? null : state.selectedId;
	const focusId = state.focusFolder;
	const neighbours = state.neighbours;
	const lens = settings.lens;
	const query = (settings.search ?? "").trim().toLowerCase();
	const depth2 = settings.selectionDepth === 2;
	const route = state.route?.set ?? null;

	const matchesLens = (node) => {
		if (lens === null) return true;
		if (lens === "running") return node.running === true;
		if (lens === "current") return node.current === true;
		if (lens === "fork") return typeof node.parentId === "string" && node.parentId !== "";
		if (lens === "archived") return node.archived === true;
		return true;
	};

	// 0 = lit, 1 = second-degree (关联深度 2), 2 = dimmed.
	const dimLevel = (node) => {
		if (route !== null) return route.has(node.id) ? 0 : 2;
		if (lens !== null && !matchesLens(node)) return 2;
		if (focusId !== null && node.id !== focusId && node.folderId !== focusId) return 2;
		if (chosen !== null && node.id !== chosen) {
			const set = neighbours.get(chosen);
			if (set !== undefined && set.has(node.id)) return 0;
			if (depth2 && set !== undefined) {
				for (const near of set) if (neighbours.get(near)?.has(node.id)) return 1;
			}
			return 2;
		}
		return 0;
	};
	const isDim = (node) => node._level === 2;

	const project = (x, y, z) => {
		const k = waveAt(x, y, z);
		return projectPoint({ x: x * k, y: y * k, z: z * k }, basis, viewport);
	};

	// Dust lanes (星尘): sub-pixel haze, no picking, additive. Off by default.
	if (settings.dust > 0.01) {
		const dustBasis = basis;
		const eye = dustBasis.eye;
		const fwd = dustBasis.forward;
		const right = dustBasis.right;
		const up = dustBasis.up;
		const halfW = width * 0.5;
		const halfH = height * 0.5;
		// 尘埃带 drives brightness, grain size and a broad glow pass together, so the
		// slider reads clearly from a whisper (0.1) to a dense luminous band (1).
		const dustLevel = clamp(settings.dust, 0, 1);
		const dustAlpha = reveal * Math.pow(dustLevel, 0.7) * 3.2;
		const dustGrow = 0.8 + dustLevel * 1.6;
		const dustCap = (softShell ? 2.4 : 2) * (1 + dustLevel * 1.5);
		const dustHues = theme.hues;
		for (let index = 0; index < state.galaxy.dust.length; index += budget.dustStep) {
			const grain = state.galaxy.dust[index];
			const k = waveAt(grain.x, grain.y, grain.z);
			if (k <= 0) continue;
			const dx = grain.x * k - eye.x;
			const dy = grain.y * k - eye.y;
			const dz = grain.z * k - eye.z;
			const depth = dx * fwd.x + dy * fwd.y + dz * fwd.z;
			if (depth <= 0.08) continue;
			const step = focal / depth;
			const size = clamp(grain.size * step * 0.016 * dustGrow, 0.8, dustCap);
			const px = halfW + ((dx * right.x + dy * right.y + dz * right.z) / depth) * focal;
			const py = halfH - ((dx * up.x + dy * up.y + dz * up.z) / depth) * focal;
			if (px < -size || px > width + size || py < -size || py > height + size) continue;
			const alpha = grain.alpha * dustAlpha * Math.min(1, 2.4 / depth);
			const sprite = dustSprite(dustHues[index % dustHues.length]);
			context.globalAlpha = Math.min(1, alpha);
			context.drawImage(spriteImage(sprite), px - size, py - size, size * 2, size * 2);
			if (index % 7 === 0) {
				const glow = size * (3 + dustLevel * 3);
				context.globalAlpha = Math.min(0.3, alpha * 0.12);
				context.drawImage(spriteImage(sprite), px - glow, py - glow, glow * 2, glow * 2);
			}
		}
	}
	context.globalAlpha = 1;

	// Stars: project once, keep the screen footprint for picking later. `radius` is
	// the pick radius; `dot` is the drawn body diameter in CSS px. 节点大小 multiplies
	// it and 大小依据 (activity / links / uniform) sets each star's relative mass.
	const nodeSize = clamp(settings.nodeSize, 0.3, 2.5);
	const projected = [];
	for (const node of state.galaxy.nodes) {
		node._k = waveAt(node.x, node.y, node.z);
		const point = node._k <= 0 ? null : project(node.x, node.y, node.z);
		if (point === null) {
			node._p = null;
			continue;
		}
		node._p = point;
		node._level = dimLevel(node);
		node._dim = node._level === 2;
		// 状态透镜 is a filter, so its excluded stars fade hard (0.32); a selection only
		// steps the rest of the sky back to 0.82 — its neighbour is a single sun, and the
		// reference's deep floor would black out everything around it.
		node._lens = lens !== null && !matchesLens(node);
		const folder = node.kind === "folder";
		const radius = Math.max(1.4, node.size * point.scale * (folder ? 0.022 : 0.017));
		// Perspective must hold at every zoom: the ceiling is high enough that a close-up really
		// grows the body (it used to saturate at 24 / 15 px, so 太阳系's planets stopped
		// changing once you pushed in). The floor only keeps a body above a pixel.
		const base = folder ? clamp(point.scale * 3.6 * 0.022 * 0.62, 7, 90) : clamp(point.scale * 1.3 * 0.017 * 1.4, 4, 60);
		// STAR_SCALE: the default body is 6.5% under the measured Obsidian size; 节点大小 scales from there.
		const rest = base * STAR_SCALE * Math.sqrt(starMass(node, settings.sizeBy, state.degree)) * nodeSize;
		const hue = folder ? nodeHue(settings, node) : nodeHue(settings, node) + (hash01(`${node.id}:hue`) * 12 - 6);
		// The subject and its neighbours are drawn a little larger as well as brighter.
		const linkedToChosen = chosen !== null && (state.neighbours?.get(chosen)?.has(node.id) ?? false);
		const tracked = node.id === state.trackId;
		const boost = node.id === hot ? 1.34 : tracked ? 1.3 : linkedToChosen ? 1.15 : 1;
		projected.push({ node, x: point.x, y: point.y, depth: point.depth, radius, dot: rest * boost, hue: hueBucket(hue), tone: nodeTone(settings, node), zoom: point.scale });
	}
	projected.sort((left, right) => right.depth - left.depth);
	// 近景 shading: one normalised proximity per body, 1 = closest to the camera. The three
	// bands below (near / mid / far) are what make a close view read like the reference:
	// the locked body and its neighbours glow, the middle distance turns into white cores
	// with a dimmer colour rim, and the far sky goes dark.
	let nearDepth = Infinity;
	let farDepth = -Infinity;
	for (const entry of projected) {
		nearDepth = Math.min(nearDepth, entry.depth);
		farDepth = Math.max(farDepth, entry.depth);
	}
	const depthSpan = Math.max(1e-6, farDepth - nearDepth);
	state.depthNear = nearDepth;
	state.depthSpan = depthSpan;
	const proxOf = (depth) => clamp(1 - (depth - nearDepth) / depthSpan, 0, 1);
	// The bands only apply *when you are close*. In the main view every body stays at full
	// light: `overview` is 1 at the fitted distance and falls to 0 once the camera dives in.
	const fitDistance = state.fit ?? 3.4;
	const overview = clamp((state.cam.distance / fitDistance - 0.55) / 0.45, 0, 1);
	state.overview = overview;
	for (const entry of projected) {
		const node = entry.node;
		// The locked/selected body and its nearest few are always the "near" band, whatever
		// their depth: without this a selection in the back of the view was drawn as a far,
		// dark star — which is exactly what "我选定的那个没有高亮" was.
		const highlighted = node.id === hot || node.id === state.trackId || (chosen !== null && (state.neighbours?.get(chosen)?.has(node.id) ?? false));
		entry.highlighted = highlighted;
		const banded = proxOf(entry.depth);
		entry.prox = highlighted ? 1 : banded + (1 - banded) * overview;
	}
	state.projected = projected;

	// No proximity bloom while a star is tracked: the landed subject is lit by its own
	// fixed-px halo only, so a dive can never paint a hue wash around the centre.

	// Layout guides: the faint skeleton that names the silhouette (rings, strands,
	// a wireframe shell, a box, a sheet, spokes). Drawn under the filaments.
	if (state.guides.length > 0) {
		context.globalCompositeOperation = "lighter";
		// The cube's twelve edges are its whole outline, so they carry more weight.
		// Structure that *is* the silhouette (a cube's edges, 星环's orbits, 太阳系's orbit
		// rings) is drawn heavier: at the faint skeleton weight those rings were invisible.
		const structural = settings.layout === "plate" ? 0.42 : settings.layout === "rings" ? 0.9 : settings.layout === "system" ? 0.34 : 0.2;
		context.globalAlpha = structural * reveal * bright;
		context.strokeStyle = `rgb(${lr}, ${lg}, ${lb})`;
		// 星环's circles are the whole silhouette, so they are drawn as real orbits: heavier and
		// brighter than any other guide, otherwise the rings vanish under the shell.
		context.lineWidth = settings.layout === "rings" ? 1.6 : structural > 0.3 ? 1.1 : 0.7;
		for (const [index, line] of state.guides.entries()) {
			// 星环: each ring's circle wears that ring's colour, the same slot its bodies take.
			if (settings.layout === "rings") {
				const plateau = starPlateau(hueAt(settings, index), undefined, toneAt(settings, index));
				const tint = linkTint(plateau, plateau, false);
				context.strokeStyle = `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 1)`;
			}
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

	// Links (recipe §3): one device pixel, source-over, each link in the desaturated mix
	// of its endpoint colours, batched into one path per colour bucket and class.
	// 链接透明度 scales the class alphas (1× at Galaxy View's 0.14).
	// A selected conversation keeps only its own neighbourhood's links, and it shows
	// them even when 显示连线 is off; with nothing selected that switch hides them all.
	const linkLook = linkLookFor(state, settings);
	const links = state.galaxy.links;
	const galaxyNodes = state.galaxy.nodes;
	// 连线 stays on its own 连线亮度: 星体亮度 must not move the threads with it.
	const linkFade = Math.min(1, reveal * 1.6);
	const linkScale = clamp(settings.linkOpacity, 0, 0.6) / 0.14;
	const linkAlpha = LINK_ALPHA;
	const curve = clamp(settings.linkCurve, 0, 2);
	const widthScale = clamp(settings.linkWidth, 0.2, 4);
	const linkStyles = linkLook.styles;
	// 连线密度: `member` spokes are the skeleton and always drawn; `lineage` (a conversation to
	// its parent) crosses the view between distant stars, so it is context — drawn only when it
	// touches the selection or the hover.
	const linkVisible = (link, a, b) => {
		if (link.faint !== true) return true;
		return chosen !== null ? a.id === chosen || b.id === chosen : hot !== null ? a.id === hot || b.id === hot : false;
	};
	const restingLinks = chosen !== null || route !== null || settings.showLinks !== false;
	const lastPass = chosen !== null || route !== null ? 1 : linkAlpha.length - 1;
	context.globalCompositeOperation = "source-over";
	// About 1.1 CSS px (2.2 device px on Retina) before 连线粗细.
	context.lineWidth = (Math.max(1, dprNow * 1.1) / dprNow) * widthScale;
	const gradientLinks = linkLook.ends !== null;
	const gradientOf = (a, b, index, colours) => {
		const paint = context.createLinearGradient(a._p.x, a._p.y, b._p.x, b._p.y);
		paint.addColorStop(0, colours[index * 2]);
		paint.addColorStop(1, colours[index * 2 + 1]);
		return paint;
	};
	const restingAlpha = (pass) => Math.min(1, linkAlpha[pass] * linkFade * linkScale);
	// Links stroke opaque, so crossings and dense bundles never stack brighter than a
	// lone link. A class at full alpha goes straight onto the frame; a translucent one
	// is stroked into an offscreen layer and lands once at its alpha.
	let layerContext = null;
	const openTarget = (pass) => {
		if (restingAlpha(pass) >= 0.999) {
			context.globalAlpha = 1;
			return context;
		}
		const layer = linkLayerFor(state, canvas);
		layerContext = layer.getContext("2d");
		layerContext.setTransform(1, 0, 0, 1, 0, 0);
		layerContext.globalAlpha = 1;
		layerContext.globalCompositeOperation = "source-over";
		layerContext.clearRect(0, 0, layer.width, layer.height);
		layerContext.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
		layerContext.lineWidth = context.lineWidth;
		layerContext.lineCap = context.lineCap;
		layerContext.lineJoin = context.lineJoin;
		return layerContext;
	};
	const closeTarget = (target, pass) => {
		if (target === context) return;
		context.globalAlpha = restingAlpha(pass);
		context.drawImage(target.canvas, 0, 0, width, height);
	};
	const showResting = linkScale > 0 && restingLinks;
	if (gradientLinks && showResting) {
		// Per-link gradients cannot batch into one path per colour, so each link is its
		// own stroke; the dimmed tier goes first so the lit links sit on top.
		for (let pass = lastPass; pass >= 0; pass -= 1) {
			let target = null;
			for (let index = 0; index < links.length; index += 1) {
				const link = links[index];
				const a = galaxyNodes[link.a];
				const b = galaxyNodes[link.b];
				if (a === undefined || b === undefined || a._p == null || b._p == null) continue;
				if (chosen !== null && (a.id === chosen || b.id === chosen)) continue;
				if (route !== null && route.has(a.id) && route.has(b.id)) continue;
				if (!linkVisible(link, a, b)) continue;
				const kind = a._dim || b._dim ? 2 : link.kind === "lineage" ? 1 : 0;
				if (kind !== pass) continue;
				target ??= openTarget(pass);
				target.strokeStyle = gradientOf(a, b, index, linkLook.ends);
				target.beginPath();
				traceLink(target, a, b, link, viewport, basis, scale, curve);
				target.stroke();
			}
			if (target !== null) closeTarget(target, pass);
		}
	}
	for (let pass = lastPass; pass >= 0 && showResting && !gradientLinks; pass -= 1) {
		let target = null;
		for (let bucket = 0; bucket < linkStyles.length; bucket += 1) {
			let drawn = 0;
			for (let slot = linkLook.start[bucket]; slot < linkLook.end[bucket]; slot += 1) {
				const link = links[linkLook.order[slot]];
				const a = galaxyNodes[link.a];
				const b = galaxyNodes[link.b];
				if (a === undefined || b === undefined || a._p == null || b._p == null) continue;
				if (chosen !== null && (a.id === chosen || b.id === chosen)) continue;
				if (route !== null && route.has(a.id) && route.has(b.id)) continue;
				const kind = a._dim || b._dim ? 2 : link.kind === "lineage" ? 1 : 0;
				if (kind !== pass) continue;
				if (drawn === 0) {
					target ??= openTarget(pass);
					target.strokeStyle = linkStyles[bucket];
					target.beginPath();
				}
				traceLink(target, a, b, link, viewport, basis, scale, curve);
				drawn += 1;
			}
			if (drawn > 0) target.stroke();
		}
		if (target !== null) closeTarget(target, pass);
	}
	context.globalAlpha = 1;
	// Links touching the hovered or selected star, and the 连接两篇 route: the bright
	// selected tier, 1 CSS px.
	if (chosen !== null || route !== null) {
		// 1.6× width and full alpha: the threads that carry the focus have to be legible,
		// not just present.
		context.lineWidth = widthScale * 1.6;
		context.globalAlpha = Math.min(1, linkFade * 1.35);
		for (let index = 0; index < links.length; index += 1) {
			const link = links[index];
			const a = galaxyNodes[link.a];
			const b = galaxyNodes[link.b];
			if (a === undefined || b === undefined || a._p == null || b._p == null) continue;
			const onRoute = route !== null && route.has(a.id) && route.has(b.id);
			if (!onRoute && a.id !== chosen && b.id !== chosen) continue;
			context.strokeStyle = gradientLinks ? gradientOf(a, b, index, linkLook.touchedEnds) : linkLook.touched[linkLook.bucketOf[index]];
			context.beginPath();
			traceLink(context, a, b, link, viewport, basis, scale, curve);
			context.stroke();
		}
	}
	context.globalAlpha = 1;

	// Stars, far to near (recipe §2): tiny fixed-size halos first, then the cached disc
	// bodies (soft rim, white-hot core). No outlines, no tinted skirts. Halos blend with
	// "lighten" (per-channel max) rather than "lighter": the reference blooms the final
	// image, so a crowded cluster glows like one star instead of summing to white.
	// Faded stars keep enough light that the galaxy still reads around a selection: a
	// conversation's only direct neighbour is its sun, so the reference's 0.12 floor
	// would black out nearly everything here (and read as "the stars went faint").
	const fadeOf = (node) => (node._lens ? 0.32 : node._level === 2 ? 0.82 : node._level === 1 ? 0.92 : 1);
	// One batched GPU pass for every body and halo (galaxy-view's <10-draw-call recipe);
	// Canvas 2D keeps the frame when WebGL is missing.
	const glow = glowLayerFor(state, canvas);
	const glowBodies = glow === null ? null : [];
	const glowHalos = glow === null ? null : [];
	// Crowd fade: additive halos stack, so a tight clump (太阳系's moon shells, a busy workspace)
	// summed into one white blob. Bodies sharing a 36 px screen cell now share their glow —
	// total light stays roughly constant as the clump gets denser instead of doubling per star.
	const CROWD_CELL = 36;
	const crowd = new Map();
	for (const entry of projected) {
		const key = `${Math.floor(entry.x / CROWD_CELL)},${Math.floor(entry.y / CROWD_CELL)}`;
		crowd.set(key, (crowd.get(key) ?? 0) + 1);
	}
	const crowdFadeOf = (entry) => {
		const count = crowd.get(`${Math.floor(entry.x / CROWD_CELL)},${Math.floor(entry.y / CROWD_CELL)}`) ?? 1;
		return count <= 1 ? 1 : 1 / (1 + 0.85 * Math.pow(count - 1, 0.85));
	};
	if (bloomOn) {
		context.globalCompositeOperation = "lighten";
		for (const entry of projected) {
			const node = entry.node;
			// 聚焦 reads as a subject: the focused star glows hottest, the stars connected to
			// it come up with it, and the rest of the sky stays where it was.
			const linked = chosen !== null && (state.neighbours?.get(chosen)?.has(node.id) ?? false);
			const emphasis = (node.id === hot ? 2.6 : linked ? 1.5 : 1) * (node.current ? 1.4 : 1);
			const pulse = node.running ? 1 + 0.25 * Math.sin(state.time * 2.4 + hash01(node.id) * TAU) : 1;
			// 阈值 gates on the body's own mass, so it stays put as the camera zooms.
			const gate = bloomGate(bloomLuminance(starMass(node, settings.sizeBy, state.degree)), threshold);
			const prox = entry.prox ?? 1;
			const bandHalo = prox >= 0.66 ? 1 : prox >= 0.33 ? 0.55 : 0.18;
			const gain = haloGain * pulse * emphasis * fadeOf(node) * (node.archived ? 0.55 : 1) * node._k * bandHalo * crowdFadeOf(entry);
			const innerAlpha = Math.min(1, innerHaloAlpha(entry.dot / 2) * gain * gate * haloArea);
			// A halo this faint is invisible but still a full-size fill: skip the draw.
			if (innerAlpha < 0.004) continue;
			// Bloom spreads with the bright area, so bodies wider than 6 px get a wider halo.
			const innerDrawn = HALO_INNER.radius * 2 * Math.max(1, entry.dot / 6) * haloSpan;
			if (glowHalos !== null) {
				glowHalos.push({ x: entry.x, y: entry.y, size: innerDrawn, colour: glowColour(entry.hue, undefined, entry.tone), alpha: innerAlpha });
			} else {
				context.globalAlpha = innerAlpha;
				context.drawImage(spriteImage(haloSprite(entry.hue, HALO_INNER, dprNow, entry.tone)), entry.x - innerDrawn / 2, entry.y - innerDrawn / 2, innerDrawn, innerDrawn);
			}
			// Outer halo below the recipe's 0.05: stacked over a 20-star cluster the full
			// value merges into one coloured cloud, which the reference's image bloom never does.
			// It keeps a whisper of itself at every threshold, so a high 阈值 thins the glow
			// instead of flattening the sky.
			const outerDrawn = HALO_OUTER.radius * 2 * haloSpan;
			const outerAlpha = Math.min(1, 0.022 * gain * (0.3 * (1 - threshold) + 0.7 * gate) * haloArea);
			if (outerAlpha < 0.004) continue;
			if (entry.x < -outerDrawn || entry.x > width + outerDrawn || entry.y < -outerDrawn || entry.y > height + outerDrawn) continue;
			if (glowHalos !== null) {
				glowHalos.push({ x: entry.x, y: entry.y, size: outerDrawn, colour: glowColour(entry.hue, undefined, entry.tone), alpha: outerAlpha });
			} else {
				context.globalAlpha = outerAlpha;
				context.drawImage(spriteImage(haloSprite(entry.hue, HALO_OUTER, dprNow, entry.tone)), entry.x - outerDrawn / 2, entry.y - outerDrawn / 2, outerDrawn, outerDrawn);
			}
		}
	}
	context.globalCompositeOperation = "source-over";
	// 亮度's low end darkens the body's own colour — an opaque star dims by colour, not by
	// turning see-through. Neutral (×1) from 亮度 0.5 up, so the settled look is untouched.
	const bodyDim = Math.min(1, Math.max(0.55, bodyGain));
	const bodyLightness = STAR_LIGHTNESS * bodyDim;
	for (const entry of projected) {
		const node = entry.node;
		const lit = node.id === hot || node.current === true;
		// Near-white centres: the reference's bodies are a white-hot core inside a broad
		// bloom, not a flat coloured plate. Depth bands, as the owner asked for a close view:
		// near keeps that hot core at full colour, the middle distance is a pure white core
		// with a slightly dimmer rim, and the far sky is dark.
		const prox = entry.prox ?? 1;
		const bandCore = prox >= 0.66 ? (lit ? 1 : 0.92) : prox >= 0.33 ? 1 : 0.9;
		const bandLightness = prox >= 0.66 ? bodyLightness : prox >= 0.33 ? STAR_LIGHTNESS * 0.86 : STAR_LIGHTNESS * 0.5;
		// A deep zoom pushes most bodies off the stage; skipping them here also skips the
		// sprite bake, which is the expensive part.
		if (entry.x < -entry.dot || entry.x > width + entry.dot || entry.y < -entry.dot || entry.y > height + entry.dot) continue;
		// 完全不透明: a body is opaque whatever the band, the lens or the reveal — the shade is
		// carried by its colour instead (band lightness, 亮度, the lens' own fade stays on links).
		if (glowBodies !== null) {
			// The shader draws the disc and its white-hot core, so there is no sprite and no
			// second additive pass: one vertex per body. The selection ring below stays Canvas 2D.
			glowBodies.push({ x: entry.x, y: entry.y, size: entry.dot, colour: glowColour(entry.hue, bandLightness, entry.tone), core: bandCore, alpha: 1 });
			if (node.current || node.id === state.selectedId || node.id === state.trackId || state.route?.ends?.includes(node.id)) {
				context.globalAlpha = Math.min(1, (node._dim ? 0.3 : 0.7) * bodyGain);
				context.strokeStyle = "rgba(214,226,232,0.8)";
				context.lineWidth = 1;
				context.beginPath();
				context.arc(entry.x, entry.y, entry.dot / 2 + 1.5, 0, TAU);
				context.stroke();
			}
			continue;
		}
		const sprite = discSprite(entry.hue, Math.max(1, Math.round(entry.dot * dprNow * 2) / 2), bandCore, bandLightness, entry.tone);
		// Drawn at the body's own size; the sprite only supplies the pixels (baked ≤ 32 px).
		const side = entry.dot;
		const bodyAlpha = fadeOf(node) * (node.archived ? 0.55 : 1) * Math.min(1, node._k * 1.6);
		const bodyX = Math.round(entry.x * dprNow - (side * dprNow) / 2) / dprNow;
		const bodyY = Math.round(entry.y * dprNow - (side * dprNow) / 2) / dprNow;
		// Brightness lights the body (additive core pass below) instead of thinning it: an
		// opaque star dims by colour, never by becoming see-through.
		context.globalAlpha = 1;
		context.drawImage(spriteImage(sprite.canvas), bodyX, bodyY, side, side);
		// 星体亮度 moves the body's *light*, not only its opacity: the disc's plateau colour is
		// already near white (STAR_PEAK), so scaling alpha alone saturates at 1 and leaves every
		// star looking as faint as it did. An additive second pass always adds a little light
		// and takes the rest of the slider's range on top of it.
		const lift = (BODY_CORE_LIFT + BODY_GAIN_LIFT * Math.max(0, bodyGain - 1)) * Math.min(1, bodyGain);
		if (lift < 0.02) continue;
		context.globalCompositeOperation = "lighter";
		context.globalAlpha = Math.min(1, lift);
		context.drawImage(spriteImage(sprite.canvas), bodyX, bodyY, side, side);
		context.globalCompositeOperation = "source-over";
		if (node.current || node.id === state.selectedId || node.id === state.trackId || state.route?.ends?.includes(node.id)) {
			// A detached ring a few px out, so the body itself keeps no outline.
			context.globalAlpha = Math.min(1, (node._dim ? 0.3 : 0.7) * bodyGain);
			context.strokeStyle = "rgba(214,226,232,0.8)";
			context.lineWidth = 1;
			context.beginPath();
			context.arc(entry.x, entry.y, entry.dot / 2 + 1.5, 0, TAU);
			context.stroke();
		}
	}
	context.globalAlpha = 1;
	if (glow !== null && glowBodies !== null) {
		try {
			glow.draw(glowBodies, glowHalos ?? [], width, height, dprNow, null);
		} catch (error) {
			// A lost context must not take the frame with it: drop the layer and keep drawing
			// bodies on Canvas 2D from the next frame on.
			state.glowFailed = true;
			state.glow = null;
			glow.dispose();
		}
	}

	// Captions: workspace names always; a session name only when it matters. The size follows
	// the zoom (`point.scale`, the projection scale): a fixed 9 px read as too large in the
	// wide shot and about right up close, so it now scales with the camera between 7 and 12 px.
	const CAPTION_PX = 9;
	// A caption reads against its *body*, so it is a fraction of the body's diameter rather
	// than a fixed size: a small star in the wide shot gets 6.5 px of text, a close-up 9–10.
	const captionFor = (entry) => Math.round(clamp((entry.dot ?? 9) * 0.72, 6.5, 10) * 2) / 2;
	const caption = captionFor({ dot: 9 });
	context.font = `500 ${caption}px ui-sans-serif, -apple-system, "Segoe UI", sans-serif`;
	context.textAlign = "center";
	context.textBaseline = "top";
	// 名字只在放大之后出现：在总览（overview ≈ 1）里画面全是点，标签只会把星空糊住。
	// Fades in as the camera comes in, fully off at the fitted distance.
	const labelFade = clamp((0.6 - overview) / 0.3, 0, 1);
	const placed = [];
	if (labelFade > 0.01)
	for (const entry of projected) {
		const node = entry.node;
		const emphasised = node.id === hot || (chosen !== null && (state.neighbours?.get(chosen)?.has(node.id) ?? false));
		if (entry.dot < 3.2 && !emphasised) continue;
		if (!emphasised && chosen !== null) continue;
		const label = node.label ?? "";
		const text = label.length > 18 ? `${label.slice(0, 17)}…` : label;
		const size = captionFor(entry) + (emphasised ? 1 : 0);
		const width = captionWidth(context, text, size, `${emphasised ? 600 : 500} ${size}`);
		context.font = `${emphasised ? 600 : 500} ${size}px ui-sans-serif, -apple-system, "Segoe UI", sans-serif`;
		const box = [entry.x - width / 2 - 2, entry.y + entry.dot / 2 + 3, width + 4, size + 2];
		if (placed.some(([x, y, w, hh]) => box[0] < x + w && x < box[0] + box[2] && box[1] < y + hh && y < box[1] + box[3])) continue;
		if (placed.length >= 240) continue;
		placed.push(box);
		context.globalAlpha = Math.min(1, (emphasised ? 1 : 0.72) * fadeOf(node) * labelFade);
		context.fillStyle = "rgba(226,234,250,0.95)";
		context.fillText(text, entry.x, entry.y + entry.dot / 2 + 3);
	}
	state.labelBoxes = placed;
	// Debug handle: in the app's console, `__dgvDumpBodies()` lists what each body actually
	// drew (dot in CSS px, hue, dim level, lens) — the only way to compare a real frame with
	// the numbers this code claims.
	if (typeof window !== "undefined") {
		window.__dgvDumpBodies = () =>
			state.projected.map((entry) => ({
				id: entry.node.id,
				kind: entry.node.kind,
				dot: Math.round(entry.dot * 100) / 100,
				hue: entry.hue,
				level: entry.node._level ?? 0,
				lens: entry.node._lens === true,
				bright: Math.round(entry.dot * 100) / 100 > 0
			}));
	}
	context.shadowBlur = 0;
	context.globalAlpha = 1;

	// 外观衔接: the frame from before the switch, dissolving over the new look. Drawn
	// last, at the frame's own size, so every pass below it crossfades at once.
	const fade = state.fade;
	if (fade !== null && fade !== undefined) {
		const progress = (performance.now() - fade.startedAt) / fade.ms;
		if (progress >= 1) {
			state.fade = null;
		} else {
			context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
			context.globalCompositeOperation = "source-over";
			// Symmetric ease, so the dissolve neither snaps away nor leaves a ghost tail.
			context.globalAlpha = 1 - easeInOutCubic(progress);
			context.drawImage(fade.canvas, 0, 0, width, height);
			context.globalAlpha = 1;
		}
	}
}
/* ------------------------------------------------------------------ *
 * Control panel
 * ------------------------------------------------------------------ */

/** Keys each panel section owns: drives its badge ("set by" / "customised") and its restore. */
const SECTION_KEYS = {
	color: ["theme", "nodeSize", "twinkle", "sizeBy", "colorSeed"],
	links: ["showLinks", "linkWidth", "linkOpacity", "linkBrightness", "linkCurve", "linkColor"],
	backdrop: ["veil", "fieldStars", "mist", "dust", "field", "shellSize", "shellGlow", "backdrop"],
	bloom: ["brightness", "bloomStrength", "bloom", "threshold"],
	shape: ["arms", "twist", "thickness", "spread"],
	physics: PHYSICS_KEYS,
	motion: ["autoOrbit", "orbitSpeed", "tourSpeed", "selectionDepth"]
};
const SECTIONS_OPEN = { look: true, filter: true, links: true };
/** Quick link colours: silver-white, then three of the 深空 hues. */
const LINK_SWATCHES = ["#cfd8e8", "#46d4dc", "#ffc35c", "#d87fa8"];
/** Keys a hover preview may borrow from a preset: everything but the silhouette, which would rebuild the galaxy. */
const PREVIEW_SKIP = new Set(["layout", "arms", "twist", "thickness", "spread"]);

const near = (left, right) => (typeof left === "number" && typeof right === "number" ? Math.abs(left - right) < 1e-6 : left === right);

/** What a key resets to: the active preset's value when it owns the key, else the shipped default. */
function baselineOf(settings, key) {
	const preset = PRESETS[settings.preset];
	return preset !== undefined && Object.prototype.hasOwnProperty.call(preset, key) ? preset[key] : DEFAULTS[key];
}

function sectionChanged(settings, section) {
	return SECTION_KEYS[section].some((key) => !near(settings[key], baselineOf(settings, key)));
}

function sectionRestore(settings, section) {
	return Object.fromEntries(SECTION_KEYS[section].map((key) => [key, baselineOf(settings, key)]));
}

/** A slider with a notch at its default; double-click the label or the track to go back to it. */
function Slider({ label, value, min, max, step, fallback, onChange, t }) {
	const ratio = Number.isFinite(fallback) ? clamp((fallback - min) / (max - min), 0, 1) : null;
	const digits = step >= 1 ? 0 : step < 0.01 ? 3 : 2;
	const shown = Number(value).toFixed(digits);
	const reset = () => {
		if (Number.isFinite(fallback)) onChange(fallback);
	};
	return h(
		"label",
		{ className: "dgv-row" },
		h("span", { className: "dgv-row-label", onDoubleClick: reset, title: t("help.dblclick") }, label),
		h(
			"span",
			{ className: "dgv-slider" },
			ratio !== null &&
				h("i", {
					className: "dgv-notch",
					"aria-hidden": "true",
					title: t("slider.notch", { v: Number(fallback).toFixed(digits) }),
					// The 11 px thumb travels between 5.5 px and width − 5.5 px.
					style: { left: `calc(${(ratio * 100).toFixed(2)}% + ${(5.5 - ratio * 11).toFixed(2)}px)` }
				}),
			h("input", { type: "range", min, max, step, value, onChange: (event) => onChange(Number(event.target.value)), onDoubleClick: reset })
		),
		h("span", { className: "dgv-row-value" }, shown)
	);
}

/** A preset card with a live mini-swatch; hovering it previews the look on the galaxy. */
function PresetCard({ label, sub, active, palette, onClick, onPreview }) {
	return h(
		"button",
		{
			type: "button",
			className: `dgv-preset${active ? " dgv-preset-on" : ""}`,
			onClick,
			title: sub,
			onMouseEnter: () => onPreview(true),
			onMouseLeave: () => onPreview(false),
			onFocus: () => onPreview(true),
			onBlur: () => onPreview(false)
		},
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

/** One saved look: click applies, double-click renames, ↑ moves it up, × asks before deleting. */
function MyPresetChip({ preset, index, t, onApply, onRename, onMove, onDrop }) {
	const [editing, setEditing] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [draft, setDraft] = useState(preset.name);
	const commit = () => {
		setEditing(false);
		const name = draft.trim();
		if (name !== "" && name !== preset.name) onRename(index, name);
		else setDraft(preset.name);
	};
	if (confirming) {
		return h(
			"span",
			{ className: "dgv-mine-chip dgv-mine-confirm" },
			h("span", { className: "dgv-mine-ask" }, t("mine.confirmDel")),
			h("button", { type: "button", onClick: () => onDrop(index) }, t("mine.ok")),
			h("button", { type: "button", onClick: () => setConfirming(false) }, t("mine.cancel"))
		);
	}
	return h(
		"span",
		{ className: "dgv-mine-chip" },
		editing
			? h("input", {
					className: "dgv-mine-input",
					value: draft,
					autoFocus: true,
					"aria-label": t("mine.rename"),
					onChange: (event) => setDraft(event.target.value),
					onBlur: commit,
					onKeyDown: (event) => {
						if (event.key === "Enter") commit();
						if (event.key === "Escape") {
							setDraft(preset.name);
							setEditing(false);
						}
					}
				})
			: h("button", { type: "button", onClick: () => onApply(preset), onDoubleClick: () => setEditing(true), title: t("mine.rename") }, preset.name),
		index > 0 && h("button", { type: "button", className: "dgv-mine-x", onClick: () => onMove(index, -1), title: t("mine.up") }, "↑"),
		h("button", { type: "button", className: "dgv-mine-x", onClick: () => setConfirming(true), title: t("mine.del") }, "×")
	);
}

/** The left control panel: presets, filters, colour, deep space, bloom, shape, physics, navigation, quality. */
function ControlPanel(props) {
	const { t, settings, update, applyPreset, revertPreset, themes, myPresets, saveMyPreset, applyMyPreset, renameMyPreset, moveMyPreset, dropMyPreset, workspaces, stats, controls, onClose, qualityLabel, preview, setPreview } = props;
	const [help, setHelp] = useState(false);
	const panelRef = useRef(null);
	const custom = isCustomised(settings);
	const isOpen = (key) => settings.panelSections?.[key] ?? SECTIONS_OPEN[key] === true;
	const toggle = (key) => update({ panelSections: { ...(settings.panelSections ?? {}), [key]: !isOpen(key) } });
	const presetName = (id) => t(`preset.${id}`);

	/** Section badge: preview wins, then "customised", then the preset that set these keys. */
	const badgeFor = (section) => {
		if (preview !== null && SECTION_KEYS[section].some((key) => !PREVIEW_SKIP.has(key) && Object.prototype.hasOwnProperty.call(PRESETS[preview] ?? {}, key))) {
			return h("span", { className: "dgv-badge dgv-badge-preview" }, t("sec.preview", { n: presetName(preview) }));
		}
		if (sectionChanged(settings, section)) {
			return [
				h("span", { key: "badge", className: "dgv-badge" }, t("sec.customized")),
				h(
					"span",
					{
						key: "restore",
						className: "dgv-revert",
						role: "button",
						tabIndex: 0,
						onClick: (event) => {
							event.stopPropagation();
							update(sectionRestore(settings, section));
						}
					},
					t("sec.restore")
				)
			];
		}
		const owned = SECTION_KEYS[section].some((key) => Object.prototype.hasOwnProperty.call(PRESETS[settings.preset] ?? {}, key));
		return owned ? h("span", { className: "dgv-badge dgv-badge-quiet" }, t("sec.setBy", { n: presetName(settings.preset) })) : null;
	};

	const head = (key, label, extra) =>
		h(
			"button",
			{ type: "button", className: "dgv-section-head", onClick: () => toggle(key), "aria-expanded": isOpen(key) },
			label,
			extra ?? null,
			h("span", null, isOpen(key) ? "−" : "+")
		);
	const section = (key, label, extra, body) => h("section", { className: "dgv-section" }, head(key, label, extra), isOpen(key) && body());
	const slide = (key, labelKey, min, max, step) =>
		h(Slider, { key, t, label: t(labelKey), value: settings[key], min, max, step, fallback: baselineOf(settings, key), onChange: (value) => update({ [key]: value }) });
	const chip = (on, label, onClick, key) => h("button", { key: key ?? label, type: "button", className: `dgv-chip${on ? " dgv-chip-on" : ""}`, onClick, "aria-pressed": on }, label);

	/** Drag the right edge to resize; the width is stored once the drag ends. */
	const startResize = (event) => {
		const panel = panelRef.current;
		if (panel === null) return;
		event.preventDefault();
		const startX = event.clientX;
		const startWidth = panel.getBoundingClientRect().width;
		let width = startWidth;
		const move = (moveEvent) => {
			width = clamp(Math.round(startWidth + moveEvent.clientX - startX), 240, 480);
			panel.style.width = `${width}px`;
		};
		const up = () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
			update({ panelWidth: width });
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
	};

	const nextLanguage = { auto: "zh", zh: "en", en: "auto" }[settings.language] ?? "auto";

	const aside = h(
		"aside",
		{ className: "dgv-panel", "aria-label": t("panel.open"), ref: panelRef, style: { width: settings.panelWidth } },
		h(
			"div",
			{ className: "dgv-panel-head" },
			h("span", { className: "dgv-panel-title" }, t("panel.notes", { n: stats.sessions })),
			h(
				"button",
				{ type: "button", className: "dgv-panel-locale", onClick: () => update({ language: nextLanguage }), title: t("lang.title") },
				t(`lang.${settings.language}`)
			),
			h("button", { type: "button", className: `dgv-panel-x${help ? " dgv-panel-x-on" : ""}`, onClick: () => setHelp((value) => !value), title: t("help.title"), "aria-expanded": help }, "?"),
			h("button", { type: "button", className: "dgv-panel-x", onClick: onClose, title: t("panel.close") }, "×")
		),
		help &&
			h(
				"div",
				{ className: "dgv-help", role: "note" },
				h("b", null, t("help.title")),
				...["help.orbit", "help.select", "help.keys", "help.dblclick", "help.filter"].map((key) => h("div", { key }, t(key)))
			),
		h(
			"div",
			{ className: "dgv-panel-actions" },
			h("button", { type: "button", className: "dgv-btn dgv-btn-wide", onClick: () => controls.fit() }, t("panel.recenter"))
		),
		// Presets
		section(
			"look",
			t("sec.look"),
			custom
				? [
						h("span", { key: "badge", className: "dgv-badge" }, t("custom")),
						h("span", { key: "revert", className: "dgv-revert", role: "button", tabIndex: 0, onClick: (event) => { event.stopPropagation(); revertPreset(); } }, t("revert"))
					]
				: null,
			() =>
				h(
					"div",
					{ className: "dgv-presets" },
					...Object.keys(PRESETS).map((id) =>
						h(PresetCard, {
							key: id,
							label: t(`preset.${id}`),
							sub: t(`preset.${id}.sub`),
							active: settings.preset === id,
							palette: THEMES[PRESETS[id].theme].hues.slice(0, 5),
							onClick: () => {
								setPreview(null);
								applyPreset(id);
							},
							onPreview: (on) => setPreview(on && id !== settings.preset ? id : null)
						})
					)
				)
		),
		// Filter: workspaces by colour + count, then the name/path filter
		section("filter", t("sec.filter"), h("span", { className: "dgv-section-sub" }, t("filter.all")), () =>
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
						h("span", { className: "dgv-dot", style: { background: swatchCss(hueAt(settings, workspace.hueIndex), toneAt(settings, workspace.hueIndex)), boxShadow: `0 0 6px ${swatchCss(hueAt(settings, workspace.hueIndex), toneAt(settings, workspace.hueIndex))}` } }),
						h("span", { className: "dgv-item-name" }, workspace.title),
						h("span", { className: "dgv-item-count" }, workspace.count)
					)
				),
				h(
					"div",
					{ className: "dgv-toggles" },
					chip(settings.orphans, t("filter.orphans"), () => update({ orphans: !settings.orphans })),
					chip(settings.empty, t("filter.empty"), () => update({ empty: !settings.empty })),
					(settings.hidden.length > 0 || settings.only !== null) && chip(true, t("filter.all"), () => update({ hidden: [], only: null, orphans: false, empty: false }))
				),
				h("input", { className: "dgv-search dgv-search-block", value: settings.filterText, placeholder: t("filter.byName"), onChange: (event) => update({ filterText: event.target.value }) }),
				h("div", { className: "dgv-list-note" }, t("filter.syntax"))
			)
		),
		// Status lens (our stand-in for tag lenses: sessions have no tags)
		section("status", t("sec.status"), null, () =>
			h(
				"div",
				{ className: "dgv-toggles" },
				...["all", "running", "current", "fork", "archived"].map((lens) =>
					chip(lens === "all" ? settings.lens === null : settings.lens === lens, t(`lens.${lens}`), () => update({ lens: lens === "all" ? null : settings.lens === lens ? null : lens }), lens)
				)
			)
		),
		// Look & colour
		section("color", t("sec.color"), badgeFor("color"), () =>
			h(
				"div",
				{ className: "dgv-rows" },
				h(
					"div",
					{ className: "dgv-toggles dgv-toggles-flush" },
					...themes.map((name) =>
						h(
							"button",
							{ key: name, type: "button", className: `dgv-chip dgv-chip-theme${settings.theme === name ? " dgv-chip-on" : ""}`, onClick: () => update({ theme: name }) },
							h("i", { style: { background: swatchCss(THEMES[name].hues[1], THEMES[name].tones?.[1] ?? null) } }),
							t(`theme.${name}`)
						)
					)
				),
				h(
					"div",
					{ className: "dgv-toggles dgv-toggles-flush" },
					chip(false, t("look.shuffle"), () => update({ colorSeed: 1 + Math.floor(Math.random() * 9999) })),
					settings.colorSeed !== 0 && chip(false, t("look.unshuffle"), () => update({ colorSeed: 0 }))
				),
				slide("nodeSize", "slider.nodeSize", 0.3, 2.5, 0.05),
				slide("twinkle", "slider.twinkle", 0, 2, 0.1),
				h(
					"div",
					{ className: "dgv-inline" },
					h("span", { className: "dgv-row-label" }, t("sizeBy.label")),
					h("div", { className: "dgv-toggles dgv-toggles-flush" }, ...SIZE_BY.map((mode) => chip(settings.sizeBy === mode, t(`sizeBy.${mode}`), () => update({ sizeBy: mode }), mode)))
				)
			)
		),
		// Links: on/off, width, opacity, bow, colour
		section("links", t("sec.links"), badgeFor("links"), () =>
			h(
				"div",
				{ className: "dgv-rows" },
				h(
					"div",
					{ className: "dgv-switch-row" },
					h("span", null, h("b", null, t("links.show")), h("small", null, t("links.showHint"))),
					h("button", { type: "button", className: `dgv-switch dgv-switch-end${settings.showLinks ? " dgv-switch-on" : ""}`, onClick: () => update({ showLinks: !settings.showLinks }), "aria-pressed": settings.showLinks, "aria-label": t("links.show") }, h("i"))
				),
				slide("linkWidth", "slider.linkWidth", 0.2, 4, 0.05),
				slide("linkOpacity", "slider.linkOpacity", 0, 0.6, 0.01),
				slide("linkBrightness", "slider.linkBrightness", 0.3, 2.5, 0.05),
				slide("linkCurve", "slider.linkCurve", 0, 2, 0.05),
				h(
					"div",
					{ className: "dgv-inline" },
					h("span", { className: "dgv-row-label" }, t("links.color")),
					h(
						"div",
						{ className: "dgv-toggles dgv-toggles-flush" },
						chip(settings.linkColor === "auto", t("links.auto"), () => update({ linkColor: "auto" }), "auto"),
						...LINK_SWATCHES.map((hex) =>
							h("button", { key: hex, type: "button", className: `dgv-swatch${settings.linkColor.toLowerCase() === hex ? " dgv-swatch-on" : ""}`, style: { background: hex }, onClick: () => update({ linkColor: hex }), "aria-pressed": settings.linkColor.toLowerCase() === hex, title: hex })
						),
						h("input", {
							type: "color",
							className: "dgv-color",
							value: settings.linkColor === "auto" ? "#cfd8e8" : settings.linkColor,
							title: t("links.pick"),
							"aria-label": t("links.pick"),
							onChange: (event) => update({ linkColor: event.target.value })
						})
					)
				)
			)
		),
		// Deep-space backdrop
		section("backdrop", t("sec.backdrop"), badgeFor("backdrop"), () =>
			h(
				"div",
				{ className: "dgv-rows" },
				slide("veil", "slider.veil", 0, 1, 0.01),
				slide("fieldStars", "slider.fieldStars", 0, 1, 0.05),
				slide("mist", "slider.mist", 0, 1, 0.01),
				slide("dust", "slider.dust", 0, 1, 0.05),
				slide("field", "slider.field", 0, 2, 0.01),
				slide("shellSize", "slider.shellSize", 0.4, 2.4, 0.05),
				slide("shellGlow", "slider.shellGlow", 0, 2, 0.05),
				slide("shellBloom", "slider.shellBloom", 0, 2, 0.05),
				slide("shellBloomBlur", "slider.shellBloomBlur", 0, 6, 0.5),
				h("button", { type: "button", className: `dgv-btn dgv-btn-wide${settings.backdrop ? " dgv-btn-on" : ""}`, onClick: () => update({ backdrop: !settings.backdrop }) }, t(settings.backdrop ? "backdrop.on" : "backdrop.off"))
			)
		),
		// Bloom
		section("bloom", t("sec.bloom"), badgeFor("bloom"), () =>
			h(
				"div",
				{ className: "dgv-rows" },
				slide("brightness", "slider.brightness", 0.02, BRIGHTNESS_MAX, 0.01),
				slide("bloomStrength", "slider.bloomStrength", 0, 2.5, 0.05),
				slide("bloom", "slider.bloom", 0, 1, 0.01),
				slide("threshold", "slider.threshold", 0, 1, 0.01)
			)
		),
		// Shape
		section("shape", t("sec.shape"), badgeFor("shape"), () =>
			h(
				"div",
				{ className: "dgv-rows" },
				slide("arms", "slider.arms", 1, 4, 1),
				slide("twist", "slider.twist", 1, 9, 0.1),
				slide("thickness", "slider.thickness", 0.2, 3, 0.05),
				slide("spread", "slider.spread", 0.35, 2.4, 0.05)
			)
		),
		// Physics: the force layer over the layout
		section("physics", t("sec.physics"), badgeFor("physics"), () =>
			h(
				"div",
				{ className: "dgv-rows" },
				slide("repel", "slider.repel", 20, 400, 5),
				slide("linkDistance", "slider.linkDistance", 20, 200, 5),
				slide("linkStrength", "slider.linkStrength", 0.1, 2, 0.1),
				slide("centerPull", "slider.centerPull", 0, 0.2, 0.005),
				slide("flatten", "slider.flatten", 0, 0.8, 0.02),
				slide("coreGravity", "slider.coreGravity", -0.1, 0.3, 0.005),
				slide("spiral", "slider.spiral", 0, 0.1, 0.005)
			)
		),
		// Navigation & motion
		section("motion", t("sec.motion"), badgeFor("motion"), () =>
			h(
				"div",
				{ className: "dgv-rows" },
				h(
					"div",
					{ className: "dgv-switch-row" },
					h("span", null, h("b", null, t("motion.auto")), h("small", null, t("motion.autoHint"))),
					h("button", { type: "button", className: `dgv-switch${settings.autoOrbit ? " dgv-switch-on" : ""}`, onClick: () => update({ autoOrbit: !settings.autoOrbit }), "aria-pressed": settings.autoOrbit }, h("i"))
				),
				slide("orbitSpeed", "motion.speed", 0.2, 3, 0.05),
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
				slide("tourSpeed", "slider.tourSpeed", 0.2, 3, 0.1),
				h(
					"div",
					{ className: "dgv-inline" },
					h("span", { className: "dgv-row-label" }, t("motion.depth")),
					h("div", { className: "dgv-toggles dgv-toggles-flush" }, ...[1, 2].map((depth) => chip(settings.selectionDepth === depth, t("motion.depthN", { d: depth }), () => update({ selectionDepth: depth }), String(depth))))
				),
				h(
					"div",
					{ className: "dgv-switch-row" },
					h("span", null, h("b", null, t("motion.connect")), h("small", null, t("motion.connectHint"))),
					h("button", { type: "button", className: "dgv-btn", onClick: () => controls.startConnect() }, t("motion.connectStart"))
				),
				h("button", { type: "button", className: "dgv-btn dgv-btn-wide", onClick: () => controls.replay() }, t("motion.replay")),
				h(
					"div",
					{ className: "dgv-pair" },
					h("button", { type: "button", className: "dgv-btn", onClick: saveMyPreset }, t("motion.save")),
					h("button", { type: "button", className: "dgv-btn", onClick: () => { update({ ...DEFAULTS, preset: settings.preset, hidden: settings.hidden, only: settings.only, language: settings.language, panelWidth: settings.panelWidth, panelSections: settings.panelSections }); controls.fit(); } }, t("motion.reset"))
				),
				myPresets.length > 0 &&
					h(
						"div",
						{ className: "dgv-mine" },
						h("span", { className: "dgv-list-note" }, t("motion.mine")),
						...myPresets.map((preset, index) =>
							h(MyPresetChip, { key: `${preset.name}:${index}`, preset, index, t, onApply: applyMyPreset, onRename: renameMyPreset, onMove: moveMyPreset, onDrop: dropMyPreset })
						)
					)
			)
		),
		// Advanced
		section("advanced", t("sec.advanced"), null, () =>
			h(
				"div",
				{ className: "dgv-rows" },
				h("div", { className: "dgv-toggles dgv-toggles-flush" }, ...QUALITIES.map((tier) => chip(settings.quality === tier, t(`quality.${tier}`), () => update({ quality: tier }), tier))),
				h("div", { className: "dgv-list-note dgv-list-note-block" }, t("quality.hint")),
				h(
					"div",
					{ className: "dgv-toggles dgv-toggles-flush" },
					chip(settings.gpuGlow !== false, t("perf.gpu"), () => update({ gpuGlow: settings.gpuGlow === false }), "gpu")
				),
				h("div", { className: "dgv-list-note dgv-list-note-block" }, t("perf.gpuHint"))
			)
		),
		h("footer", { className: "dgv-panel-foot" }, t("stats", { fps: stats.fps, ms: (stats.ms ?? 16.6).toFixed(1), nodes: stats.nodes, links: stats.links, quality: qualityLabel }))
	);
	return h(react.Fragment, null, aside, h("div", { className: "dgv-panel-grip", onPointerDown: startResize, title: t("panel.resize"), "aria-hidden": "true" }));
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

/**
 * On macOS the desktop window draws its traffic lights and its own sidebar/new-chat
 * buttons over the top-left corner (about 124 × 44 px). When a page's header reaches
 * into that corner (sidebar collapsed), push its content clear of it, and publish the
 * header height as --dgv-head-h so the panel and stage overlays clear it.
 */
function useFloatingHeader(headRef) {
	// Layout effect, not effect: the inset has to be in the first painted frame, or the
	// wordmark slides right once as the header measures the host's window buttons.
	const layout = typeof useLayoutEffect === "function" ? useLayoutEffect : useEffect;
	layout(() => {
		const head = headRef.current;
		if (head === null || typeof window === "undefined") return undefined;
		// Three signals, because one of them is empty in some embedded browsers: the desktop
		// window's own buttons sit in this band, and a missed detection puts the wordmark
		// under them.
		const mac =
			/Mac/i.test(navigator.platform ?? "") ||
			/Mac OS X/i.test(navigator.userAgent ?? "") ||
			/mac/i.test(navigator.userAgentData?.platform ?? "");
		// Top-left, clear of whatever the window draws there — but never pushed towards the
		// middle. The macOS window buttons are measured, not guessed: this app hides its
		// title bar, so the three lights sit at an app-specific offset (around 50–105 of the
		// viewport, not the stock 16–70), and a fixed guess lands on top of them. The reach
		// of any host button in the same band counts too, and the whole thing is capped so
		// the wordmark stays in the corner on a wide window.
		const LIGHTS_EDGE = mac ? 112 : 16;
		const CAP = 160;
		/**
		 * How far the window chrome reaches into the page's top-left corner. Two probes: what
		 * is actually *drawn* there (hit testing catches the host's plugin button, which is an
		 * svg in a div, not a `<button>`) and, as a fallback for engines without hit testing,
		 * the bounding box of any focusable element in the band.
		 */
		const hostReach = (box) => {
			let reach = 0;
			const outside = (element) => element !== null && element !== head && element.closest(".dgv-page") === null && !head.contains(element);
			if (typeof document.elementsFromPoint === "function") {
				for (let x = 4; x <= CAP; x += 6) {
					for (const element of document.elementsFromPoint(box.left + x, box.top + 12)) {
						if (!outside(element)) continue;
						const rect = element.getBoundingClientRect();
						if (rect.width === 0 || rect.height === 0) continue;
						if (rect.right <= box.left || rect.right - box.left > CAP) continue;
						reach = Math.max(reach, rect.right - box.left);
						break;
					}
				}
			}
			for (const element of document.querySelectorAll("button, [role='button'], a, svg")) {
				if (!outside(element)) continue;
				const rect = element.getBoundingClientRect();
				if (rect.width === 0 || rect.height === 0) continue;
				if (rect.bottom <= box.top + 2 || rect.top >= box.top + 46 || rect.right <= box.left) continue;
				reach = Math.max(reach, rect.right - box.left);
			}
			return reach;
		};
		// Host chrome only ever grows in practice; keeping the widest reach ever measured
		// means a button appearing or leaving cannot shift the wordmark a second time.
		let widest = 0;
		const place = () => {
			const box = head.getBoundingClientRect();
			const band = box.top < 44;
			const lights = band ? Math.max(0, LIGHTS_EDGE - box.left) : 0;
			if (band) widest = Math.max(widest, Math.min(CAP, hostReach(box) + 8));
			const inset = Math.round(Math.max(16, Math.min(CAP, Math.max(lights, widest))));
			if (head.style.getPropertyValue("--dgv-head-inset") !== `${inset}px`) head.style.setProperty("--dgv-head-inset", `${inset}px`);
			const tall = `${Math.round(head.offsetHeight)}px`;
			if (head.parentElement?.style.getPropertyValue("--dgv-head-h") !== tall) head.parentElement?.style.setProperty("--dgv-head-h", tall);
		};
		place();
		const observer = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
		observer?.observe(head);
		window.addEventListener("resize", place);
		// Host buttons come and go with the sidebar; recheck now and then.
		const timer = window.setInterval(place, 1200);
		return () => {
			observer?.disconnect();
			window.removeEventListener("resize", place);
			window.clearInterval(timer);
		};
	}, [headRef]);
}

/** The starfield page registered as the `graph` main panel. */
function GraphPage(props) {
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
	const t = useMemo(() => translatorFor(settings.language, props.t), [settings.language, props.t]);
	const [relayoutToken, setRelayoutToken] = useState(0);
	const [preview, setPreview] = useState(null);
	const [search, setSearch] = useState("");
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchIndex, setSearchIndex] = useState(0);
	const [focusFolder, setFocusFolder] = useState(null);
	const [myPresets, setMyPresets] = useState(loadPresets);
	const [panelOpen, setPanelOpen] = useState(true);
	const headRef = useRef(null);
	useFloatingHeader(headRef);
	const [stats, setStats] = useState({ fps: 60, ms: 16.6, nodes: 0, links: 0, sessions: 0 });
	const controlsRef = useRef(null);

	/** Step into a star: the conversation becomes the surface, the galaxy is paused behind it. */
	const enterStar = useCallback(
		(node, look) => (node === undefined ? undefined : props.selectSession?.(node.id, node, look)),
		[props.selectSession]
	);

	/** Let the plugin body reach the mounted galaxy (sidebar clicks fly to stars). */
	useEffect(() => props.bindScene?.(controlsRef), [props.bindScene]);

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
			// Snapshot before the new look lands, so the switch dissolves instead of snapping.
			if (id !== settings.preset) controlsRef.current?.transition?.();
			const next = { ...settings, ...preset, preset: id };
			setSettings(next);
			saveSettings(next);
		},
		[settings]
	);

	const revertPreset = useCallback(() => {
		const preset = PRESETS[settings.preset];
		if (preset === undefined) return;
		controlsRef.current?.transition?.();
		const next = { ...settings, ...preset };
		setSettings(next);
		saveSettings(next);
	}, [settings]);

	/** Replace the saved looks and persist them; storage is optional. */
	const storeMyPresets = useCallback((next) => {
		setMyPresets(next);
		try {
			window.localStorage.setItem(PRESET_KEY, JSON.stringify(next));
		} catch (error) {
			/* storage is optional */
		}
	}, []);

	const saveMyPreset = useCallback(() => {
		const entry = { ...settings, name: t("mine.name", { n: myPresets.length + 1 }) };
		for (const key of ["hidden", "only", "filterText", "lens", "language", "panelWidth", "panelSections", "tour"]) delete entry[key];
		storeMyPresets(myPresets.concat(entry).slice(-8));
	}, [settings, myPresets, storeMyPresets, t]);

	const renameMyPreset = useCallback((index, name) => storeMyPresets(myPresets.map((preset, position) => (position === index ? { ...preset, name } : preset))), [myPresets, storeMyPresets]);

	const moveMyPreset = useCallback(
		(index, step) => {
			const target = index + step;
			if (target < 0 || target >= myPresets.length) return;
			const next = myPresets.slice();
			[next[index], next[target]] = [next[target], next[index]];
			storeMyPresets(next);
		},
		[myPresets, storeMyPresets]
	);

	const applyMyPreset = useCallback((preset) => {
		controlsRef.current?.transition?.();
		const next = { ...settings, ...preset };
		delete next.name;
		setSettings(next);
		saveSettings(next);
	}, [settings]);

	const dropMyPreset = useCallback((index) => storeMyPresets(myPresets.filter((_, position) => position !== index)), [myPresets, storeMyPresets]);

	const pendingStar = useRef(null);
	const revealStar = useCallback(
		(sessionId) => {
			const owner = (workspaceSnapshot.items ?? []).find((workspace) => (workspace.sessionIds ?? []).includes(sessionId));
			const archived = (workspaceSnapshot.archivedSessionIds ?? []).includes(sessionId);
			const hiddenByFilter = owner === undefined || settings.hidden.includes(owner.workspaceId) || (settings.only !== null && settings.only !== owner.workspaceId) || settings.filterText.trim() !== "";
			const hiddenByArchive = archived && !showArchived;
			if (!hiddenByFilter && !hiddenByArchive) return false;
			pendingStar.current = sessionId;
			setSettings((current) => ({
				...current,
				hidden: owner === undefined ? current.hidden : current.hidden.filter((id) => id !== owner.workspaceId),
				only: owner === undefined ? current.only : current.only === owner.workspaceId ? null : current.only,
				filterText: ""
			}));
			if (hiddenByArchive) setShowArchived(true);
			return true;
		},
		[workspaceSnapshot, settings.hidden, settings.only, settings.filterText, showArchived]
	);
	const nodeCap = qualityBudget(settings, "high").nodeCap;
	const graph = useMemo(
		() =>
			capGraph(
				buildGraph(workspaceSnapshot, sessionSnapshot, {
					showArchived,
					hidden: settings.hidden,
					only: settings.only,
					showOrphans: settings.orphans,
					showEmpty: settings.empty,
					filter: settings.filterText
				}),
				nodeCap
			),
		[workspaceSnapshot, sessionSnapshot, showArchived, settings.hidden, settings.only, settings.orphans, settings.empty, settings.filterText, nodeCap]
	);

	// The two sidebar hooks: `revealStar` answers "was this star hidden?", `enterStarById` enters
	// a star the way a click on it would (dive + interior + the live conversation).
	const enterStarById = useCallback(
		(sessionId) => {
			const node = graph.nodes.find((item) => item.id === sessionId);
			if (node === undefined) return false;
			enterStar(node);
			return true;
		},
		[graph, enterStar]
	);
	useEffect(() => {
		const bridge = props.sidebar;
		if (bridge === undefined || bridge === null) return () => {};
		bridge.revealRef.current = revealStar;
		bridge.enterRef.current = enterStarById;
		return () => {
			if (bridge.revealRef.current === revealStar) bridge.revealRef.current = null;
			if (bridge.enterRef.current === enterStarById) bridge.enterRef.current = null;
		};
	}, [props.sidebar, revealStar, enterStarById]);

	// The star a sidebar click asked for, once the graph draws it: dive, enter, then forget it.
	useEffect(() => {
		const pending = pendingStar.current;
		if (pending === null) return;
		if (!graph.nodes.some((node) => node.id === pending)) return;
		pendingStar.current = null;
		controlsRef.current?.focus?.(pending);
		props.sidebar?.enterRef.current?.(pending);
	}, [graph]);

	const activeGraph = graph;

	/** What the galaxy draws: the stored look, a hovered preset's look on top, and the live search. */
	const sceneSettings = useMemo(() => {
		const borrowed = preview === null || PRESETS[preview] === undefined ? {} : Object.fromEntries(Object.entries(PRESETS[preview]).filter(([key]) => !PREVIEW_SKIP.has(key)));
		return { ...settings, ...borrowed, search };
	}, [settings, preview, search]);

	// Search: fuzzy, ranked by score then by how busy the star is; an empty box offers the
	// busiest stars (the reference plugin's "constellation tour" list).
	const searchHits = useMemo(() => {
		const query = search.trim().toLowerCase();
		const ranked = (node) => (node.count ?? 0) + (node.degree ?? 0) * 0.5 + (node.updatedAt ?? 0) / 1e15;
		if (query === "") {
			return searchOpen ? activeGraph.nodes.slice().sort((left, right) => ranked(right) - ranked(left)).slice(0, 8) : [];
		}
		return activeGraph.nodes
			.map((node) => ({ node, score: matches(node, query) }))
			.filter((hit) => hit.score > 0)
			.sort((left, right) => right.score - left.score || ranked(right.node) - ranked(left.node))
			.slice(0, 8)
			.map((hit) => hit.node);
	}, [activeGraph, search, searchOpen]);
	const flyToHit = (node) => {
		if (node === undefined) return;
		controlsRef.current?.focus(node.id);
		setSearchOpen(false);
	};

	const workspaceRows = useMemo(() => {
		const items = Array.isArray(workspaceSnapshot.items) ? workspaceSnapshot.items : [];
		const summaries = sessionSnapshot.byId ?? {};
		// The legend borrows the drawn sun's palette slot (ranked by size in buildGraph).
		const drawnSlot = new Map(activeGraph.nodes.filter((node) => node.kind === "folder").map((node) => [node.id, node.hueIndex]));
		return items
			.filter((workspace) => workspace !== null && typeof workspace === "object")
			.map((workspace, index) => ({
				id: `ws:${workspace.workspaceId}`,
				workspaceId: workspace.workspaceId,
				title: typeof workspace.title === "string" && workspace.title !== "" ? workspace.title : workspace.path,
				path: typeof workspace.path === "string" ? workspace.path : "",
				hueIndex: drawnSlot.get(`ws:${workspace.workspaceId}`) ?? index,
				count: (Array.isArray(workspace.sessionIds) ? workspace.sessionIds : []).filter((id) => summaries[id] !== undefined).length
			}))
			.sort((left, right) => right.count - left.count);
	}, [workspaceSnapshot, sessionSnapshot, activeGraph]);

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

	const qualityLabel = t(`quality.${QUALITIES.includes(settings.quality) ? settings.quality : "auto"}`);
	const pageBase = themeOf(settings.theme).base;

	const header = h(
		"header",
		{ className: "dgv-head", ref: headRef },
		h(
			"div",
			{ className: "dgv-head-main" },
			h("div", { className: "dgv-head-text" }, h("div", { className: "dgv-title", role: "heading", "aria-level": 1, "aria-label": t("title") }, "galaxy"), h("div", { className: "dgv-stat" }, empty || loading ? t("subtitle") : t("stat", { folders: activeGraph.stats.folders, sessions: activeGraph.stats.sessions })))
		),
		h(
			"div",
			{ className: "dgv-tools" },
			h(
				"div",
				{ className: "dgv-searchbox" },
				h("input", {
					className: "dgv-search",
					value: search,
					placeholder: t("search.placeholder"),
					"aria-label": t("search.placeholder"),
					role: "combobox",
					"aria-expanded": searchOpen,
					onChange: (event) => {
						setSearch(event.target.value);
						setSearchIndex(0);
						setSearchOpen(true);
					},
					onFocus: () => setSearchOpen(true),
					onBlur: () => window.setTimeout(() => setSearchOpen(false), 120),
					onKeyDown: (event) => {
						if (event.key === "ArrowDown" || event.key === "ArrowUp") {
							event.preventDefault();
							const step = event.key === "ArrowDown" ? 1 : -1;
							setSearchIndex((value) => (searchHits.length === 0 ? 0 : (value + step + searchHits.length) % searchHits.length));
						} else if (event.key === "Enter") {
							event.preventDefault();
							flyToHit(searchHits[Math.min(searchIndex, searchHits.length - 1)]);
						} else if (event.key === "Escape") {
							if (search !== "") setSearch("");
							else event.currentTarget.blur();
							setSearchOpen(false);
						}
					}
				}),
				searchOpen &&
					searchOpen &&
					h(
						"div",
						{ className: "dgv-search-drop", role: "listbox" },
						searchHits.length === 0
							? h("div", { className: "dgv-search-none" }, t("search.none"))
							: searchHits.map((node, index) =>
									h(
										"button",
										{
											key: node.id,
											type: "button",
											role: "option",
											"aria-selected": index === searchIndex,
											className: `dgv-search-hit${index === searchIndex ? " dgv-search-hit-on" : ""}`,
											onMouseDown: (event) => event.preventDefault(),
											onMouseEnter: () => setSearchIndex(index),
											onClick: () => flyToHit(node)
										},
										h("span", { className: "dgv-dot", style: { background: swatchCss(nodeHue(settings, node), nodeTone(settings, node)) } }),
										h("span", { className: "dgv-item-name" }, node.label),
										h("span", { className: "dgv-item-count" }, t(node.kind === "folder" ? "kind.folder" : "kind.session"))
									)
								)
					)
			),
			// 控制栏: the panel toggle lives with the other controls, not loose in the corner.
			h(
				"button",
				{ type: "button", className: `dgv-btn${panelOpen ? " dgv-btn-on" : ""}`, onClick: () => setPanelOpen((value) => !value), title: t("panel.open"), "aria-pressed": panelOpen },
				t("panel.open")
			),
			h("button", { type: "button", className: "dgv-btn dgv-btn-view", onClick: () => props.onSwitchView?.(), title: t("view.toMemory") }, t("view.memory")),
			h("button", { type: "button", className: `dgv-btn${settings.showLinks ? " dgv-btn-on" : ""}`, onClick: () => update({ showLinks: !settings.showLinks }), "aria-pressed": settings.showLinks, title: t("action.linksTitle") }, t("action.links")),
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
			{ className: "dgv-page", style: { background: pageBase } },
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
		{ className: "dgv-page", style: { background: pageBase } },
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
					myPresets,
					saveMyPreset,
					applyMyPreset,
					renameMyPreset,
					moveMyPreset,
					dropMyPreset,
					workspaces: workspaceRows,
					stats: { ...stats, sessions: activeGraph.stats.sessions },
					controls: {
						fit: () => controlsRef.current?.fit(),
						replay: () => controlsRef.current?.replay(),
						setTour: (value) => controlsRef.current?.setTour(value),
						startConnect: () => controlsRef.current?.startConnect()
					},
					onClose: () => {
						setPreview(null);
						setPanelOpen(false);
					},
					qualityLabel,
					preview,
					setPreview
				}),
			h(GraphScene, {
				graph: activeGraph,
				settings: sceneSettings,
				shapeKey,
				relayoutToken,
				onEnterSession: enterStar,
				onOpenWorkspace: props.openWorkspace,
				onSelectionChange,
				onTourEnd: () => update({ tour: false }),
				registerControls,
				onStats,
				t
			})
		)
	);
}

/* ------------------------------------------------------------------ *
 * Memory library
 * ------------------------------------------------------------------ */

/** Which half of the panel is up; persisted so a reload lands where you left. */
function loadViewMode() {
	try {
		return window.localStorage.getItem(VIEW_KEY) === "memory" ? "memory" : "galaxy";
	} catch (error) {
		return "galaxy";
	}
}

/** Localized name of a document's scope, or the raw scope when there is no word for it. */
function scopeName(scope, t) {
	const key = `mem.scope.${scope ?? ""}`;
	const text = t(key);
	return text === key ? String(scope ?? "") : text;
}

/** One tab's rows: bodies of that kind, ordered so the busiest skill is on top. */
function memoryRows(graph, tab, query) {
	const needle = String(query ?? "").trim().toLowerCase();
	const out = [];
	if (graph === null) return out;
	for (const node of graph.nodes) {
		if (tab === "skills" && node.kind !== "skill") continue;
		if (tab === "docs" && node.kind !== "doc") continue;
		if (tab === "calls" && node.kind !== "call") continue;
		if (needle !== "") {
			const haystack = `${node.label} ${node.name ?? ""} ${node.path ?? ""} ${node.description ?? ""} ${node.source ?? ""} ${node.cwd ?? ""}`.toLowerCase();
			if (!haystack.includes(needle)) continue;
		}
		out.push(node);
	}
	if (tab === "calls") out.sort((left, right) => (right.time ?? 0) - (left.time ?? 0) || left.label.localeCompare(right.label));
	else if (tab === "skills") out.sort((left, right) => (right.calls ?? 0) - (left.calls ?? 0) || left.label.localeCompare(right.label));
	else out.sort((left, right) => (left.scope ?? "").localeCompare(right.scope ?? "") || left.label.localeCompare(right.label) || String(left.path).localeCompare(String(right.path)));
	return out;
}

/**
 * The memory map: instruction files in the core, skills on the arms, one small
 * star per skill call circling the skill it loaded. Drag orbits, wheel zooms,
 * click selects, double-click opens.
 */
/**
 * 记忆库's canvas. Its look is SETTLED (owner-approved): bodies are the galaxy's baked star
 * sprites over one centre haze, sizes come from mass, the depth fades are gone (everything
 * is opaque) and the links are tinted from both ends. Restyle only on an explicit request —
 * the numbers are pinned in `scripts/selfcheck.mjs`.
 */
function MemoryScene({ graph, selected, onSelect, onOpen, t }) {
	const canvasRef = useRef(null);
	const cameraRef = useRef(null);
	const stateRef = useRef({ projected: [], hover: null, drag: null, dirty: true, raf: 0 });
	const selectedRef = useRef(selected);
	selectedRef.current = selected;
	const handlersRef = useRef({ onSelect, onOpen });
	handlersRef.current = { onSelect, onOpen };
	const [tip, setTip] = useState(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas === null || graph === null) return undefined;
		const state = stateRef.current;
		cameraRef.current = createCamera({ distance: fitDistance(graph.extent, 0.82), pitch: 0.66, yaw: 0.4 });
		state.dirty = true;

		const context = () => canvas.getContext("2d");

		const paint = () => {
			const rect = canvas.getBoundingClientRect();
			const width = Math.max(1, Math.round(rect.width));
			const height = Math.max(1, Math.round(rect.height));
			const dpr = Math.min(2.5, window.devicePixelRatio || 1);
			const bitmapWidth = Math.round(width * dpr);
			const bitmapHeight = Math.round(height * dpr);
			if (canvas.width !== bitmapWidth || canvas.height !== bitmapHeight) {
				canvas.width = bitmapWidth;
				canvas.height = bitmapHeight;
			}
			const frame = context();
			if (!frame) return;
			frame.setTransform(dpr, 0, 0, dpr, 0, 0);
			frame.clearRect(0, 0, width, height);
			frame.globalCompositeOperation = "source-over";

			const camera = cameraRef.current;
			const basis = cameraBasis(camera);
			const viewport = { width, height };
			const chosen = selectedRef.current;
			const hovered = state.hover;

			// Project once; keep the screen footprint for picking.
			const projected = [];
			const at = new Map();
			for (const node of graph.nodes) {
				const point = projectPoint(node, basis, viewport);
				if (point === null) continue;
				const dot =
					node.kind === "skill"
						? clamp(point.scale * 0.03 * (0.45 + node.mass), 2.6, 22)
						: node.kind === "doc"
							? clamp(point.scale * 0.019, 1.8, 10)
							: clamp(point.scale * 0.0075, 1, 4.6);
				const entry = { node, x: point.x, y: point.y, depth: point.depth, dot };
				projected.push(entry);
				at.set(node.id, entry);
			}
			projected.sort((left, right) => right.depth - left.depth);
			state.projected = projected;

			// Neighbourhood of the selection, so a chosen skill keeps its own calls lit.
			const lit = new Set();
			if (chosen !== null) {
				lit.add(chosen);
				for (const link of graph.links) {
					if (link.a === chosen) lit.add(link.b);
					else if (link.b === chosen) lit.add(link.a);
				}
			}

			// A soft warm haze under everything: the map should have a centre of gravity
			// (the instruction files) instead of floating dots on black.
			const theme = themeOf(DEFAULT_THEME);
			const haze = hazeSprite(theme.nucleus, "nebula");
			const hazeSide = Math.min(width, height) * 1.15;
			frame.globalCompositeOperation = "lighter";
			frame.globalAlpha = 0.16 * (1 + 0.12 * Math.sin((state.clock ?? 0) * 0.7));
			frame.drawImage(spriteImage(haze), width / 2 - hazeSide / 2, height / 2 - hazeSide / 2, hazeSide, hazeSide);
			frame.globalAlpha = 1;
			frame.globalCompositeOperation = "source-over";

			// Calls → their skill: hairline, tinted from both ends like the galaxy's links,
			// so the fans under a skill read as texture instead of spaghetti.
			for (const link of graph.links) {
				const from = at.get(link.a);
				const to = at.get(link.b);
				if (from === undefined || to === undefined) continue;
				const related = chosen === null || lit.has(link.a);
				const tint = linkTint(starPlateau(from.node.hue), starPlateau(to.node.hue), false);
				frame.strokeStyle = `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${related ? 0.3 : 0.07})`;
				frame.lineWidth = related && chosen !== null ? 1.1 : 0.7;
				frame.beginPath();
				frame.moveTo(from.x, from.y);
				frame.lineTo(to.x, to.y);
				frame.stroke();
			}

			// Bodies: the galaxy's own baked star sprites (soft rim, hot core, halo) instead
			// of flat discs — same visual language, so the map reads as a small cousin of
			// the star view rather than as a scatter plot.
			frame.globalCompositeOperation = "lighter";
			for (const entry of projected) {
				const node = entry.node;
				const dim = chosen !== null && !lit.has(node.id) ? 0.3 : 1;
				// 动效: a slow per-body pulse (own phase, so nothing blinks in unison).
				const pulse = 1 + 0.18 * Math.sin((state.clock ?? 0) * 1.6 + hash01(node.id) * TAU);
				const hot = node.id === chosen || node.id === hovered;
				const dot = Math.max(1.6, entry.dot) * (hot ? 1.25 : 1);
				// Opaque bodies, as the owner asked: depth is a size cue here (the dot already
				// scales with it), and a selection takes the *halo* away from the rest instead of
				// making the other stars translucent.
				const alpha = 1;
				if (node.kind !== "call") {
					const halo = haloSprite(node.hue, HALO_INNER, dpr, null);
					const haloDrawn = Math.max(8, dot * 6);
					// 星体辉光 +10% at the owner's request (0.3/0.42 → 0.33/0.462).
					frame.globalAlpha = Math.min(1, alpha * dim * pulse * (node.kind === "doc" ? 0.33 : 0.462));
					frame.drawImage(spriteImage(halo), entry.x - haloDrawn / 2, entry.y - haloDrawn / 2, haloDrawn, haloDrawn);
				}
				// Instruction files stay warm and bright, skills carry their own hue, calls
				// are small flat sparks.
				const core = node.kind === "doc" ? 0.95 : node.kind === "skill" ? 0.8 : 0.45;
				const sprite = discSprite(node.hue, Math.max(4, Math.round(dot * dpr * 2) / 2), core, undefined, null);
				const side = sprite.size / dpr;
				frame.globalAlpha = Math.min(1, alpha);
				frame.drawImage(spriteImage(sprite.canvas), Math.round(entry.x * dpr - sprite.size / 2) / dpr, Math.round(entry.y * dpr - sprite.size / 2) / dpr, side, side);
				if (hot) {
					frame.globalAlpha = Math.min(1, alpha * 0.85);
					frame.strokeStyle = "rgba(235, 242, 255, 0.85)";
					frame.lineWidth = 1.2;
					frame.beginPath();
					frame.arc(entry.x, entry.y, dot * 0.72 + 3, 0, Math.PI * 2);
					frame.stroke();
				}
			}
			frame.globalAlpha = 1;
			frame.globalCompositeOperation = "source-over";

			// Labels: skill names once they are big enough to read, always for the
			// hovered or chosen body.
			frame.font = "11px ui-sans-serif, -apple-system, 'Segoe UI', sans-serif";
			frame.textBaseline = "middle";
			for (const entry of projected) {
				const node = entry.node;
				const labelled = node.kind === "skill" || node.kind === "doc";
				const hot = node.id === chosen || node.id === hovered;
				if (!labelled && !hot) continue;
				if (!hot && entry.dot < 3.4) continue;
				if (chosen !== null && !lit.has(node.id) && !hot) continue;
				const label = String(node.label ?? "");
				const text = label.length > 24 ? `${label.slice(0, 23)}…` : label;
				frame.globalAlpha = hot ? 0.95 : 0.5;
				frame.fillStyle = "rgba(232, 238, 252, 1)";
				frame.shadowColor = "rgba(0, 0, 0, 0.85)";
				frame.shadowBlur = 6;
				frame.fillText(text, entry.x + entry.dot + 6, entry.y);
				frame.shadowBlur = 0;
			}
			frame.globalAlpha = 1;
		};

		state.paint = paint;
		const request = () => {
			if (state.raf !== 0) return;
			state.raf = requestAnimationFrame(() => {
				state.raf = 0;
				if (!state.dirty) return;
				state.dirty = false;
				paint();
			});
		};

		/** Nearest body to a pointer, in canvas CSS pixels. */
		const pick = (x, y) => {
			let best = null;
			let bestGap = Infinity;
			for (const entry of state.projected) {
				const gap = Math.hypot(entry.x - x, entry.y - y) - Math.max(6, entry.dot * 1.8);
				if (gap < bestGap) {
					bestGap = gap;
					best = entry;
				}
			}
			return bestGap <= 0 ? best : null;
		};

		const local = (event) => {
			const rect = canvas.getBoundingClientRect();
			return { x: event.clientX - rect.left, y: event.clientY - rect.top };
		};

		const onMove = (event) => {
			const point = local(event);
			const drag = state.drag;
			if (drag !== null) {
				const camera = cameraRef.current;
				const dx = point.x - drag.x;
				const dy = point.y - drag.y;
				if (drag.pan === true) {
					// The view slides under the pointer; the camera keeps its angle.
					const basis = cameraBasis(camera);
					const step = camera.distance * 0.0022;
					camera.target = {
						x: drag.target.x - basis.right.x * dx * step + basis.up.x * dy * step,
						y: drag.target.y - basis.right.y * dx * step + basis.up.y * dy * step,
						z: drag.target.z - basis.right.z * dx * step + basis.up.z * dy * step
					};
				} else {
					camera.yaw -= dx * 0.007;
					camera.pitch = wrapAngle(camera.pitch + dy * 0.005);
				}
				drag.x = point.x;
				drag.y = point.y;
				state.dirty = true;
				request();
				return;
			}
			const hit = pick(point.x, point.y);
			const id = hit === null ? null : hit.node.id;
			if (id !== state.hover) {
				state.hover = id;
				state.dirty = true;
				request();
				setTip(hit === null ? null : { node: hit.node, x: hit.x, y: hit.y });
			}
			canvas.style.cursor = hit === null ? "grab" : "pointer";
		};

		const onLeave = () => {
			state.hover = null;
			state.dirty = true;
			setTip(null);
			request();
		};

		const onDown = (event) => {
			if (event.button !== 0 && event.button !== 2) return;
			if (event.button === 2) event.preventDefault();
			const point = local(event);
			const camera = cameraRef.current;
			// 平移: shift + left drag, or a right drag — the view slides, the angle holds.
			state.drag = { x: point.x, y: point.y, pan: event.shiftKey || event.button === 2, target: { ...camera.target } };
			canvas.setPointerCapture?.(event.pointerId);
			canvas.style.cursor = "grabbing";
		};

		const onUp = (event) => {
			const drag = state.drag;
			state.drag = null;
			canvas.releasePointerCapture?.(event.pointerId);
			canvas.style.cursor = "grab";
			if (drag === null) return;
			const point = local(event);
			if (drag.pan === true) return;
			if (Math.hypot(point.x - drag.x, point.y - drag.y) > 4) return;
			const hit = pick(point.x, point.y);
			handlersRef.current.onSelect?.(hit === null ? null : hit.node);
		};

		const onDouble = (event) => {
			const point = local(event);
			const hit = pick(point.x, point.y);
			if (hit === null) {
				// Empty space: frame the whole map again.
				cameraRef.current = createCamera({ distance: fitDistance(graph.extent, 0.82), pitch: 0.66, yaw: 0.4 });
				state.dirty = true;
				request();
				return;
			}
			handlersRef.current.onOpen?.(hit.node);
		};

		const onWheel = (event) => {
			event.preventDefault();
			const camera = cameraRef.current;
			camera.distance = clamp(camera.distance * Math.exp(event.deltaY * 0.0012), 0.9, 16);
			state.dirty = true;
			request();
		};

		// 移动: the map keeps its own paint-on-demand look; what it gains is a way to look at it
		// from anywhere — shift-drag (or right-drag) slides the view, arrows nudge it, R recentres,
		// +/− zoom a step. No idle drift, no pulsing: the picture is the one that was approved.
		const resetView = () => {
			cameraRef.current = createCamera({ distance: fitDistance(graph.extent, 0.82), pitch: 0.66, yaw: 0.4 });
			state.dirty = true;
			request();
		};
		const zoomStep = (factor) => {
			const camera = cameraRef.current;
			camera.distance = clamp(camera.distance / factor, 0.4, 24);
			state.dirty = true;
			request();
		};
		const slide = (right, up) => {
			const camera = cameraRef.current;
			const basis = cameraBasis(camera);
			const step = camera.distance * 0.08;
			camera.target = {
				x: camera.target.x + basis.right.x * right * step + basis.up.x * up * step,
				y: camera.target.y + basis.right.y * right * step + basis.up.y * up * step,
				z: camera.target.z + basis.right.z * right * step + basis.up.z * up * step
			};
			state.dirty = true;
			request();
		};

		const onKey = (event) => {
			if (event.metaKey || event.ctrlKey || event.altKey) return;
			const target = event.target;
			if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
			if (event.key === "ArrowLeft") slide(-1, 0);
			else if (event.key === "ArrowRight") slide(1, 0);
			else if (event.key === "ArrowUp") slide(0, 1);
			else if (event.key === "ArrowDown") slide(0, -1);
			else if (event.key === "r" || event.key === "R") resetView();
			else if (event.key === "+" || event.key === "=") zoomStep(1.25);
			else if (event.key === "-" || event.key === "_") zoomStep(0.8);
			else return;
			event.preventDefault();
		};
		window.addEventListener("keydown", onKey);

		const onResize = () => {
			state.dirty = true;
			request();
		};

		// A gesture that ends anywhere but here (browser cancels it for a trackpad
		// gesture, the pointer leaves the window, a capture is lost) used to leave
		// `state.drag` set for good — and with a drag live the cruise and the inertia
		// both sit out every frame, so one stray click froze the rotation. Clear it from
		// both the canvas and the window; only the canvas resolves it as a click.
		const onGestureLost = () => {
			state.drag = null;
			state.moved = false;
			state.yawVelocity = 0;
			state.idleAt = performance.now();
		};
		canvas.addEventListener("pointermove", onMove);
		canvas.addEventListener("pointerdown", onDown);
		canvas.addEventListener("pointerup", onUp);
		// Bubble, not capture: the canvas resolves its own clicks first.
		window.addEventListener("pointerup", onGestureLost);
		window.addEventListener("pointercancel", onGestureLost);
		canvas.addEventListener("pointercancel", onGestureLost);
		canvas.addEventListener("lostpointercapture", onGestureLost);
		canvas.addEventListener("pointerleave", onLeave);
		canvas.addEventListener("dblclick", onDouble);
		canvas.addEventListener("wheel", onWheel, { passive: false });
		const observer = typeof ResizeObserver === "function" ? new ResizeObserver(onResize) : null;
		observer?.observe(canvas);
		window.addEventListener("resize", onResize);
		request();

		return () => {
			if (state.raf !== 0) cancelAnimationFrame(state.raf);
			state.raf = 0;
			observer?.disconnect();
			window.removeEventListener("resize", onResize);
			window.removeEventListener("keydown", onKey);
			canvas.removeEventListener("pointermove", onMove);
			canvas.removeEventListener("pointerdown", onDown);
			canvas.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointerup", onGestureLost);
			window.removeEventListener("pointercancel", onGestureLost);
			canvas.removeEventListener("pointercancel", onGestureLost);
			canvas.removeEventListener("lostpointercapture", onGestureLost);
			canvas.removeEventListener("pointerleave", onLeave);
			canvas.removeEventListener("dblclick", onDouble);
			canvas.removeEventListener("wheel", onWheel);
			if (state.raf !== 0) cancelAnimationFrame(state.raf);
			state.raf = 0;
		};
	}, [graph]);

	// Selection changes repaint the mounted scene; the painter lives on the state.
	useEffect(() => {
		const state = stateRef.current;
		state.dirty = true;
		if (state.raf !== 0 || typeof state.paint !== "function") return;
		state.raf = requestAnimationFrame(() => {
			state.raf = 0;
			if (!state.dirty) return;
			state.dirty = false;
			state.paint();
		});
	}, [selected]);

	return h(
		"div",
		{ className: "dgv-mem-stage" },
		h("canvas", { ref: canvasRef, className: "dgv-mem-canvas", role: "img", "aria-label": t("mem.aria") }),
		tip !== null &&
			h(
				"div",
				{ className: "dgv-mem-tip", style: { left: `${Math.round(tip.x + 14)}px`, top: `${Math.round(tip.y + 12)}px` } },
				h("span", { className: "dgv-mem-tip-kind" }, t(tip.node.kind === "skill" ? "mem.selected.skills" : tip.node.kind === "doc" ? "mem.selected.docs" : "mem.selected.calls")),
				h("span", { className: "dgv-mem-tip-name" }, tip.node.label),
				tip.node.kind === "skill" && h("span", { className: "dgv-mem-tip-meta" }, t("mem.row.calls", { n: tip.node.calls ?? 0 }))
			)
	);
}

/** The memory library: list on the left, map in the middle, file editor on the right. */
function MemoryPage(props) {
	const t = props.t;
	const memory = props.memory ?? null;
	const tRef = useRef(t);
	tRef.current = t;
	const [phase, setPhase] = useState("listing");
	const [failure, setFailure] = useState(null);
	const [listing, setListing] = useState(null);
	const [history, setHistory] = useState(null);
	const [selectedId, setSelectedId] = useState(null);
	const [tab, setTab] = useState("skills");
	const [query, setQuery] = useState("");
	const [editor, setEditor] = useState(null);
	const headRef = useRef(null);
	const aliveRef = useRef(true);
	const editorRef = useRef(null);
	editorRef.current = editor;
	useFloatingHeader(headRef);

	useEffect(
		() => () => {
			aliveRef.current = false;
		},
		[]
	);

	/** Read the library, then the call history (the slow half), each as it lands. */
	const load = useCallback(async () => {
		const translate = tRef.current;
		if (memory === null) {
			setFailure({ code: "offline", message: translate("mem.offline") });
			setPhase("error");
			return;
		}
		setPhase("listing");
		setFailure(null);
		try {
			const found = await memory("memory.list", {});
			if (!aliveRef.current) return;
			setListing(found);
			setPhase("scanning");
			const calls = await memory("memory.calls", {});
			if (!aliveRef.current) return;
			setHistory(calls);
			setPhase("ready");
		} catch (error) {
			if (!aliveRef.current) return;
			const code = error?.code ?? "internal";
			setFailure({ code, message: code === "offline" ? translate("mem.offline") : error?.message ?? String(error) });
			setPhase("error");
		}
	}, [memory]);

	useEffect(() => {
		aliveRef.current = true;
		load();
	}, [load]);

	const graph = useMemo(() => (listing === null ? null : buildMemoryGraph({ docs: listing.docs, skills: listing.skills, calls: history?.calls }) ), [listing, history]);

	const selected = useMemo(() => (graph === null || selectedId === null ? null : graph.nodes.find((node) => node.id === selectedId) ?? null), [graph, selectedId]);

	/** Read one file into the editor drawer. */
	const openEditor = useCallback(
		async (node) => {
			if (node === null || typeof node.path !== "string" || node.kind === "call") return;
			if (memory === null) return;
			setSelectedId(node.id);
			setEditor({ id: node.id, path: node.path, name: node.label, phase: "reading", draft: "", content: "", status: "clean" });
			try {
				const file = await memory("memory.read", { path: node.path });
				if (!aliveRef.current) return;
				setEditor((current) =>
					current === null || current.path !== file.path
						? current
						: { ...current, content: file.content, draft: file.content, mtimeMs: file.mtimeMs, size: file.size, readOnly: file.readOnly, phase: "ready", status: "clean" }
				);
			} catch (error) {
				if (!aliveRef.current) return;
				setEditor((current) => (current === null ? current : { ...current, phase: "failed", failure: error?.message ?? String(error) }));
			}
		},
		[memory]
	);

	/** Write the draft back; a changed file comes back as a conflict unless forced. */
	const save = useCallback(
		async (force) => {
			const current = editorRef.current;
			if (current === null || current.phase !== "ready" || memory === null) return;
			setEditor((value) => (value === null ? value : { ...value, status: "saving" }));
			try {
				const result = await memory("memory.write", { path: current.path, content: current.draft, baseMtimeMs: current.mtimeMs, force: force === true });
				if (!aliveRef.current) return;
				setEditor((value) => (value === null ? value : { ...value, content: current.draft, mtimeMs: result.mtimeMs, size: result.size, status: "saved", savedAt: Date.now(), failure: null }));
			} catch (error) {
				if (!aliveRef.current) return;
				setEditor((value) => {
					if (value === null) return value;
					if (error?.code === "conflict") return { ...value, status: "conflict", failure: null };
					return { ...value, status: "failed", failure: error?.message ?? String(error) };
				});
			}
		},
		[memory]
	);

	const reload = useCallback(() => {
		const current = editorRef.current;
		if (current === null) return;
		setEditor(null);
		openEditor({ id: current.id, kind: "doc", label: current.name, path: current.path });
	}, [openEditor]);

	/** Cmd/Ctrl+S inside the editor saves instead of the browser asking. */
	const onEditorKeys = useCallback(
		(event) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
				event.preventDefault();
				save(false);
			}
		},
		[save]
	);

	const rows = useMemo(() => memoryRows(graph, tab, query), [graph, tab, query]);
	const stats = graph?.stats ?? { docs: 0, skills: 0, calls: 0 };
	// The map sits on the same deep base as the rest of the plugin, theme included.
	const pageBase = useMemo(() => {
		try {
			return themeOf(loadSettings().theme).base;
		} catch (error) {
			return "#000000";
		}
	}, []);
	const busy = phase === "listing" || phase === "scanning";
	const dirty = editor !== null && editor.phase === "ready" && editor.draft !== editor.content;

	const rowMeta = (node) => {
		if (node.kind === "skill") return node.missing ? t("mem.row.missing") : t("mem.row.calls", { n: node.calls ?? 0 });
		if (node.kind === "call") return `${node.name} · ${relativeTime(node.time, t)}`;
		return `${scopeName(node.scope, t)} · ${formatBytes(node.size)}`;
	};

	const header = h(
		"header",
		{ className: "dgv-head", ref: headRef },
		h(
			"div",
			{ className: "dgv-head-main" },
			h(
				"div",
				{ className: "dgv-head-text" },
				h("div", { className: "dgv-title", role: "heading", "aria-level": 1, "aria-label": t("mem.title") }, "memory"),
				h("div", { className: "dgv-stat" }, phase === "ready" ? t("mem.stat", stats) : t("mem.subtitle"))
			)
		),
		h(
			"div",
			{ className: "dgv-tools" },
			h("button", { type: "button", className: "dgv-btn dgv-btn-view", onClick: () => props.onSwitchView?.(), title: t("view.toGalaxy") }, t("view.galaxy")),
			h("button", { type: "button", className: "dgv-btn", onClick: () => load(), disabled: busy, title: t("mem.refresh") }, t("mem.refresh")),
			h("button", { type: "button", className: "dgv-btn dgv-btn-primary", onClick: () => props.backToChat?.() }, t("action.stock"))
		)
	);

	const panel = h(
		"div",
		{ className: "dgv-mem-panel" },
		h(
			"div",
			{ className: "dgv-mem-tabs", role: "tablist" },
			["skills", "docs", "calls"].map((id) =>
				h(
					"button",
					{
						key: id,
						type: "button",
						role: "tab",
						"aria-selected": tab === id,
						className: `dgv-mem-tab${tab === id ? " dgv-mem-tab-on" : ""}`,
						onClick: () => {
							setTab(id);
							setSelectedId(null);
						}
					},
					t(`mem.tab.${id}`),
					h("span", { className: "dgv-mem-tab-n" }, String(id === "calls" ? stats.calls : id === "docs" ? stats.docs : stats.skills))
				)
			)
		),
		h("input", { className: "dgv-mem-filter", value: query, placeholder: t("mem.filter"), "aria-label": t("mem.filter"), onChange: (event) => setQuery(event.target.value) }),
		h(
			"div",
			{ className: "dgv-mem-list" },
			rows.length === 0
				? h("div", { className: "dgv-mem-none" }, t(graph === null ? "mem.loading" : "mem.none"))
				: rows.map((node) =>
						h(
							"button",
							{
								key: node.id,
								type: "button",
								className: `dgv-mem-row${selectedId === node.id ? " dgv-mem-row-on" : ""}`,
								onClick: () => setSelectedId(node.id),
								onDoubleClick: () => openEditor(node)
							},
							h("span", { className: "dgv-mem-dot", style: { color: `hsl(${node.hue}, 90%, 70%)` } }),
							h("span", { className: "dgv-mem-name" }, node.label),
							h("span", { className: "dgv-mem-meta" }, rowMeta(node))
						)
					)
		),
		selected !== null &&
			h(
				"div",
				{ className: "dgv-mem-card" },
				h("div", { className: "dgv-mem-card-kind" }, t(selected.kind === "skill" ? "mem.selected.skills" : selected.kind === "doc" ? "mem.selected.docs" : "mem.selected.calls")),
				h("div", { className: "dgv-mem-card-name" }, selected.label),
				selected.kind === "skill" &&
					h(
						"div",
						{ className: "dgv-mem-card-meta" },
						selected.missing
							? t("mem.selected.missing")
							: selected.calls === 0
								? t("mem.selected.never")
								: t("mem.selected.callsN", { n: selected.calls, s: selected.sessions, time: relativeTime(selected.last, t) }),
						selected.copies > 1 ? ` · ${t("mem.row.copies", { n: selected.copies })}` : null
					),
				selected.kind === "doc" && h("div", { className: "dgv-mem-card-meta" }, `${scopeName(selected.scope, t)} · ${formatBytes(selected.size)} · ${relativeTime(selected.mtimeMs, t)}`),
				selected.kind === "call" && h("div", { className: "dgv-mem-card-meta" }, `${selected.name} · ${relativeTime(selected.time, t)}`),
				selected.kind === "call" && selected.cwd !== "" && h("div", { className: "dgv-mem-card-path" }, selected.cwd),
				selected.description !== undefined && selected.description !== "" && h("div", { className: "dgv-mem-card-desc" }, selected.description),
				selected.path !== null && selected.path !== undefined && h("div", { className: "dgv-mem-card-path" }, selected.path),
				selected.kind !== "call" && selected.path !== null && selected.path !== undefined && h("button", { type: "button", className: "dgv-btn dgv-btn-wide", onClick: () => openEditor(selected) }, t("mem.open"))
			)
	);

	const drawer =
		editor !== null &&
		h(
			"aside",
			{ className: "dgv-mem-editor" },
			h(
				"div",
				{ className: "dgv-mem-editor-head" },
				h("div", { className: "dgv-mem-editor-text" }, h("div", { className: "dgv-mem-editor-name" }, editor.name), h("div", { className: "dgv-mem-editor-path" }, editor.path)),
				h("button", { type: "button", className: "dgv-btn dgv-btn-icon dgv-mem-editor-x", onClick: () => setEditor(null), title: t("mem.editor.close"), "aria-label": t("mem.editor.close") }, "×")
			),
			editor.readOnly === true && h("div", { className: "dgv-mem-note" }, t("mem.editor.readonly")),
			editor.status === "conflict" && h("div", { className: "dgv-mem-note dgv-mem-note-warn" }, t("mem.editor.conflict")),
			editor.status === "failed" && h("div", { className: "dgv-mem-note dgv-mem-note-warn" }, t("mem.editor.failed", { message: editor.failure ?? "" })),
			editor.phase === "reading"
				? h("div", { className: "dgv-mem-none" }, t("mem.loading"))
				: editor.phase === "failed"
					? h("div", { className: "dgv-mem-note dgv-mem-note-warn" }, editor.failure ?? "")
					: h("textarea", {
							className: "dgv-mem-text",
							value: editor.draft,
							readOnly: editor.readOnly === true,
							spellCheck: false,
							onChange: (event) => setEditor((value) => (value === null ? value : { ...value, draft: event.target.value, status: "dirty" })),
							onKeyDown: onEditorKeys
						}),
			h(
				"div",
				{ className: "dgv-mem-editor-foot" },
				h(
					"div",
					{ className: "dgv-mem-editor-status" },
					editor.status === "saved"
						? t("mem.editor.saved", { time: relativeTime(editor.savedAt, t) })
						: editor.status === "saving"
							? t("mem.editor.saving")
							: dirty
								? t("mem.editor.dirty")
								: t("mem.editor.meta", { n: editor.draft.split("\n").length, size: formatBytes(editor.size ?? editor.draft.length) })
				),
				h("button", { type: "button", className: "dgv-btn", onClick: reload, disabled: editor.phase !== "ready" }, t("mem.editor.reload")),
				editor.status === "conflict"
					? h("button", { type: "button", className: "dgv-btn dgv-btn-primary", onClick: () => save(true) }, t("mem.editor.overwrite"))
					: h("button", { type: "button", className: "dgv-btn dgv-btn-primary", onClick: () => save(false), disabled: editor.readOnly === true || editor.phase !== "ready" || !dirty }, t("mem.editor.save"))
			)
		);

	return h(
		"div",
		{ className: "dgv-page dgv-mem", style: { background: pageBase } },
		header,
		h(
			"div",
			{ className: "dgv-mem-body" },
			panel,
			graph === null
				? h(
						"div",
						{ className: "dgv-mem-status" },
						h("div", { className: "dgv-mem-status-title" }, phase === "error" ? t("mem.error") : t(phase === "scanning" ? "mem.scanning" : "mem.loading")),
						failure !== null && h("div", { className: "dgv-mem-status-note" }, failure.message),
						phase === "error" && h("button", { type: "button", className: "dgv-btn dgv-btn-primary", onClick: () => load() }, t("mem.retry"))
					)
				: h(MemoryScene, { graph, selected: selectedId, onSelect: (node) => setSelectedId(node === null ? null : node.id), onOpen: openEditor, t })
		),
		graph !== null && phase === "scanning" && h("div", { className: "dgv-mem-badge" }, t("mem.scanning")),
		graph !== null && h("div", { className: "dgv-mem-hint" }, t("mem.hint")),
		drawer
	);
}

/** The `main` panel: one component, two views behind it. */
function GraphPanel(props) {
	const [mode, setMode] = useState(loadViewMode);
	const language = useMemo(() => {
		try {
			return loadSettings().language;
		} catch (error) {
			return "auto";
		}
	}, []);
	const t = useMemo(() => translatorFor(language, props.t), [language, props.t]);

	// 连接动画 between the two views: the outgoing canvas is frozen into an image that
	// dissolves over the incoming one, so the switch reads as one surface changing rather
	// than two screens swapping. The snapshot costs one toDataURL and no second rAF loop —
	// keeping both views mounted for a cross-fade would double the per-frame work.
	const [dissolve, setDissolve] = useState(null);
	const rootRef = useRef(null);
	const dissolveTimer = useRef(0);
	const switchMode = useCallback((next) => {
		if (next === mode) return;
		const canvas = rootRef.current?.querySelector("canvas");
		let snapshot = null;
		try {
			snapshot = canvas === null || canvas === undefined || canvas.width === 0 ? null : canvas.toDataURL("image/png");
		} catch (error) {
			snapshot = null; // a tainted canvas must not break the switch
		}
		if (snapshot !== null) {
			if (dissolveTimer.current !== 0) window.clearTimeout(dissolveTimer.current);
			setDissolve({ src: snapshot, at: Date.now() });
			dissolveTimer.current = window.setTimeout(() => {
				dissolveTimer.current = 0;
				setDissolve(null);
			}, 520);
		}
		setMode(next);
		try {
			window.localStorage.setItem(VIEW_KEY, next);
		} catch (error) {
			/* storage is optional */
		}
	}, [mode]);
	useEffect(() => () => {
		if (dissolveTimer.current !== 0) window.clearTimeout(dissolveTimer.current);
	}, []);

	/** Give the view the whole window: clear any star interior, hide the stock sidebar. */
	useEffect(() => {
		props.clearInterior?.();
		const guard = props.collapseSidebar === undefined ? null : props.collapseSidebar();
		return () => {
			if (guard !== null && guard !== undefined) guard.release();
		};
	}, []);

	const view = mode === "memory"
		? h(MemoryPage, { ...props, t, onSwitchView: () => switchMode("galaxy") })
		: h(GraphPage, { ...props, onSwitchView: () => switchMode("memory") });
	return h(
		"div",
		{ className: "dgv-view", ref: rootRef },
		view,
		dissolve !== null && h("img", { className: "dgv-view-dissolve", src: dissolve.src, alt: "", "aria-hidden": "true", key: dissolve.at })
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
 * Bind the browser's authenticated RPC caller to this plugin's channel. The
 * connection service supplies correlation, the request envelope and the host's
 * fence; a host without it fails as `offline` so the view can say so.
 */
function memoryCaller(ctx) {
	return async (endpoint, payload) => {
		const connection = ctx.get("connection");
		if (connection === null || connection === undefined || typeof connection.rpc?.call !== "function") throw Object.assign(new Error("no connection service"), { code: "offline", details: {} });
		const result = await connection.rpc.call(MEMORY_CHANNEL, endpoint, payload ?? {});
		if (result?.ok === true) return result.value;
		const error = result?.error ?? {};
		throw Object.assign(new Error(error.message ?? `memory ${endpoint} failed`), { code: error.code ?? "internal", details: error.details ?? {} });
	};
}

/** Client entry: dictionaries, the graph main panel and the header toggle. */
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
	/** The mounted galaxy's controls (a ref the page binds), so sidebar clicks can reach it. */
	let sceneRef = null;
	/** Set by the page: make a star drawable, then report the id to dive to. */
	const revealRef = { current: null };
	/** Set by the page: open a star's conversation inside the starfield (interior + panel). */
	const enterRef = { current: null };
	const bindScene = (ref) => {
		sceneRef = ref;
		return () => {
			if (sceneRef === ref) sceneRef = null;
		};
	};
	/** True while this plugin itself opens a Session, which must reach the harness untouched. */
	let opening = false;
	/** Stock behaviour: open a Session in the harness conversation panel. */
	const openSession = (sessionId) => {
		opening = true;
		try {
			ctx.get("uiWorkspace").openSession(sessionId);
		} finally {
			opening = false;
		}
		ctx.layout.selectPanel(null);
	};

	// A sidebar click may name a star the scene is not drawing (its workspace hidden, another
	// workspace pinned as 只看, the archived filter off, or dropped by the node cap). The page
	// registers `reveal` to make it visible and hand back the id to dive to; until it answers
	// the click stays in the galaxy instead of opening the stock view.
	// Sidebar clicks while the galaxy is up fly to that star instead of leaving star mode.
	// The session-opener hook is single-owner (another plugin holds it), but the sidebar
	// looks `openSession` up on the service at call time, so the instance method is
	// wrapped and put back on dispose. Anything not drawn falls through to the stock path.
	ctx.effect(() => {
		const ui = ctx.get("uiWorkspace");
		if (ui === null || ui === undefined || typeof ui.openSession !== "function") return () => {};
		const original = ui.openSession;
		const own = Object.prototype.hasOwnProperty.call(ui, "openSession");
		function openSessionInGalaxy(target, source = "explicit-session", ...rest) {
			const canvas = typeof document === "undefined" ? null : document.querySelector(".dgv-canvas");
			const galaxy = sceneRef?.current ?? null;
			if (!opening && source === "explicit-session" && typeof target === "string" && canvas !== null && galaxy !== null) {
				// Dive to the star, then *enter* it: the conversation opens inside the starfield
				// (the hue rim over the page) instead of the stock session page. Anything the
				// scene is not drawing gets revealed by the page first.
				if (galaxy.focus(target) === true) {
					if (enterRef.current?.(target) === true) return;
					return original.call(this, target, source, ...rest);
				}
				if (revealRef.current?.(target) === true) return;
			}
			return original.call(this, target, source, ...rest);
		}
		ui.openSession = openSessionInGalaxy;
		return () => {
			if (ui.openSession !== openSessionInGalaxy) return;
			if (own) ui.openSession = original;
			else delete ui.openSession;
		};
	}, "graph-view: sidebar clicks fly to stars");

	// ── Star interior ──────────────────────────────────────────────────
	// A plugin may not declare `children` for `main.conversation` (doing so
	// aborts client module activation), so the live conversation stays in the
	// harness panel. What this adds is the inside of the star around it: a hue
	// rim over the page and our own way back out.
	let interior = null;
	const clearInterior = () => {
		if (interior === null) return;
		interior.stopShell();
		interior.root.remove();
		delete document.body.dataset.dgvInside;
		document.body.style.removeProperty("--dgv-inside-base");
		interior = null;
	};
	const paintInterior = (hue, label) => {
		clearInterior();
		if (typeof document === "undefined") return;
		const safeHue = Number.isFinite(hue) ? hue : 248;
		const base = themeOf(loadSettings().theme).base;
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
			if (warpState.stop !== null) return;
			playWarp({
				hue: safeHue,
				base,
				reverse: true,
				onArrive: () => {
					clearInterior();
					ctx.layout.selectPanel(PANEL_ID);
					return settle(() => document.querySelector(".dgv-canvas") !== null);
				}
			});
		});
		root.append(glow, back);
		document.body.append(root);
		// The landing shell stays on as the interior's backdrop, under the rim glow.
		const stopShell = mountInteriorShell(root, safeHue);
		root.insertBefore(root.lastChild, glow);
		document.body.dataset.dgvInside = "1";
		document.body.style.setProperty("--dgv-inside-base", base);
		interior = { root, stopShell };
	};

	/** Resolve once `done()` holds (checked every frame), or after 3 s. */
	const settle = (done) =>
		new Promise((resolve) => {
			const until = performance.now() + 3000;
			const step = () => (done() || performance.now() > until ? resolve() : requestAnimationFrame(step));
			step();
		});
	const galaxyGone = () => document.querySelector(".dgv-canvas") === null;
	const paintSafely = (look) => {
		try {
			if (look !== undefined) paintInterior(look.hue, look.label);
		} catch (error) {
			console.warn("graph-view: painting the star interior failed", error);
		}
	};
	/** Enter one star: paint its interior, open the Session, resolve once it replaced the galaxy. */
	const selectSession = (sessionId, node, look) => {
		paintSafely(look);
		openSession(sessionId);
		return settle(galaxyGone);
	};
	const openWorkspace = (workspaceId, look) =>
		Promise.resolve(ctx.get("uiWorkspace").openWorkspace(workspaceId)).then(
			() => {
				ctx.layout.selectPanel(null);
				paintSafely(look);
				return settle(galaxyGone);
			},
			(reason) => console.warn("graph-view: open workspace failed", reason)
		);

	ctx.slots.inject("main", () =>
		ctx.slots.register(
			{
				name: "main",
				key: PANEL_ID,
				locale: NS,
				inject: () => ({
					hooks: { graphSessions: ctx.sessions.list, graphWorkspaces: ctx.workspaces.list },
					memory: memoryCaller(ctx),
					selectSession,
					// The sidebar interceptor lives in this closure; the page writes its two
					// callbacks here (see `revealStar` / `enterStarById`).
					sidebar: { revealRef, enterRef },
					clearInterior,
					openWorkspace,
					backToChat,
					collapseSidebar,
					bindScene
				})
			},
			GraphPanel
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

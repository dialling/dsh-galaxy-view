// dsh-galaxy-view — generated client bundle. Do not edit: change src/ and run
// `node scripts/build.mjs` instead.
window.__ModuleLoader__.load({
	id: "dsh-galaxy-view",
	factory: (require) => {
		const __DSH_GALAXY_BUILD__ = "4d38d6";
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const css = "/* dsh-graph-view\n *\n * Two style worlds, deliberately:\n *   1. `.dgv-toggle` — lives in the stock conversation header, so it reads the\n *      harness tokens and matches the buttons already there.\n *   2. `.dgv-page` and below — the starfield surface, always dark by design.\n */\n\n/* ── 1. header toggle (stock UI) ─────────────────────────────────────── */\n\n.dgv-toggle {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tgap: 4px;\n\theight: 24px;\n\tpadding: 0 6px;\n\tfont-size: 12px;\n\tline-height: 18px;\n\tcolor: var(--dsw-alias-label-tertiary, #7b8290);\n\tbackground: transparent;\n\tborder: 0;\n\tborder-radius: var(--dsw-radius-sm, 6px);\n\tcursor: pointer;\n\ttransition: color 120ms ease, background 120ms ease;\n}\n\n.dgv-toggle:hover,\n.dgv-toggle:focus-visible {\n\tcolor: var(--dsw-alias-label-secondary, #4b525e);\n\tbackground: var(--dsw-alias-fill-l1, rgba(127, 127, 127, 0.1));\n}\n\n.dgv-toggle svg {\n\tflex: none;\n}\n\n.dgv-toggle-label {\n\twhite-space: nowrap;\n}\n\n@media (max-width: 720px) {\n\t.dgv-toggle-label {\n\t\tdisplay: none;\n\t}\n}\n\n/* ── 2. starfield page ───────────────────────────────────────────────── */\n\n.dgv-page {\n\tposition: relative;\n\tdisplay: flex;\n\tflex-direction: column;\n\theight: 100%;\n\tmin-height: 0;\n\tbackground: #000000;\n\tcolor: #eef2fb;\n}\n\n/* Header: no strip of its own. It floats over the starfield with a transparent\n * background; empty header space passes drags through to the canvas. */\n.dgv-head {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tz-index: 40;\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\talign-items: center;\n\tgap: 12px;\n\tpadding: 10px 16px 10px var(--dgv-head-inset, 16px);\n\tbackground: transparent;\n\tpointer-events: none;\n\ttext-shadow: 0 1px 6px rgba(0, 0, 0, 0.85);\n}\n\n.dgv-head > * {\n\tpointer-events: auto;\n}\n\n.dgv-head-main {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 10px;\n\tmin-width: 0;\n}\n\n.dgv-head-text {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1px;\n\tmin-width: 0;\n}\n\n/* Wordmark: a high-contrast italic serif filled with a slowly drifting nebula\n * gradient. The glow is a drop-shadow filter because a text-shadow would paint\n * over the transparent, gradient-clipped glyphs and muddy them. The gradient only\n * paints inside the padding box, so the padding (cancelled by negative margins)\n * makes room for the italic overhang and the g/y descenders. */\n.dgv-title {\n\tfont-family: \"Didot\", \"Bodoni 72\", \"Playfair Display\", \"Times New Roman\", serif;\n\tfont-style: italic;\n\tfont-size: 26px;\n\tfont-weight: 400;\n\tline-height: 28px;\n\tletter-spacing: 0.06em;\n\tpadding: 4px 0.3em 9px 0.1em;\n\tmargin: -4px -0.3em -9px -0.1em;\n\tcolor: #f2f5ff;\n\tbackground: linear-gradient(100deg, #9fe7ff 0%, #ffffff 22%, #b9c8ff 42%, #d6a8ff 62%, #ffc2e6 80%, #9fe7ff 100%);\n\tbackground-size: 220% 100%;\n\t-webkit-background-clip: text;\n\tbackground-clip: text;\n\t-webkit-text-fill-color: transparent;\n\ttext-shadow: none;\n\tfilter: drop-shadow(0 0 6px rgba(150, 180, 255, 0.45)) drop-shadow(0 0 18px rgba(170, 120, 255, 0.25));\n\tanimation: dgv-nebula 14s linear infinite;\n\tuser-select: none;\n}\n\n@keyframes dgv-nebula {\n\tfrom {\n\t\tbackground-position: 0% 50%;\n\t}\n\tto {\n\t\tbackground-position: 220% 50%;\n\t}\n}\n\n@media (prefers-reduced-motion: reduce) {\n\t.dgv-title {\n\t\tanimation: none;\n\t}\n}\n\n.dgv-stat {\n\tfont-size: 12px;\n\tline-height: 16px;\n\tcolor: rgba(186, 200, 232, 0.62);\n\twhite-space: nowrap;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n}\n\n/* The tool row wraps instead of squeezing: at 12 px with Chinese labels the chips hit\n * their min-content width and used to overflow each other at the right edge. */\n.dgv-tools {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\talign-items: center;\n\tjustify-content: flex-end;\n\tgap: 6px;\n\trow-gap: 6px;\n\tmargin-left: auto;\n\tmin-width: 0;\n}\n\n/* Chips keep their natural width; nothing shrinks into its neighbour. */\n.dgv-tools > * {\n\tflex: 0 0 auto;\n\tmin-width: 0;\n}\n\n.dgv-search {\n\tbox-sizing: border-box;\n\t/* Room for the chips first: the field gives way on a narrow window. */\n\twidth: clamp(130px, 17vw, 210px);\n\theight: 28px;\n\tpadding: 0 10px;\n\tfont-size: 12px;\n\tcolor: #eef2fb;\n\tbackground: rgba(8, 12, 24, 0.72);\n\tborder: 0.5px solid rgba(130, 170, 255, 0.24);\n\tbox-shadow: inset 0 0 12px rgba(80, 120, 220, 0.12);\n\tborder-radius: var(--dsw-radius-md, 8px);\n\toutline: none;\n}\n\n.dgv-search::placeholder {\n\tcolor: rgba(178, 192, 224, 0.5);\n}\n\n.dgv-search:focus-visible {\n\tborder-color: rgba(168, 196, 255, 0.6);\n\tbackground: rgba(140, 160, 210, 0.16);\n}\n\n.dgv-btn {\n\theight: 28px;\n\tpadding: 0 10px;\n\tfont-size: 12px;\n\tline-height: 26px;\n\tcolor: rgba(206, 218, 244, 0.86);\n\tbackground: transparent;\n\tborder: 0.5px solid rgba(150, 170, 220, 0.2);\n\tborder-radius: var(--dsw-radius-md, 8px);\n\tcursor: pointer;\n\twhite-space: nowrap;\n\ttransition: background 120ms ease, color 120ms ease, border-color 120ms ease;\n}\n\n.dgv-btn:hover,\n.dgv-btn:focus-visible {\n\tcolor: #f4f7ff;\n\tbackground: rgba(140, 160, 210, 0.16);\n}\n\n.dgv-btn-on {\n\tcolor: #a8c4ff;\n\tborder-color: rgba(168, 196, 255, 0.45);\n}\n\n.dgv-btn-primary {\n\tcolor: #0a0c12;\n\tbackground: linear-gradient(180deg, #dfe8ff, #a8c4ff);\n\tborder-color: transparent;\n\tfont-weight: 550;\n\tbox-shadow: 0 0 14px rgba(140, 180, 255, 0.35);\n}\n\n.dgv-head .dgv-btn:not(.dgv-btn-primary) {\n\tbackground: rgba(14, 20, 40, 0.55);\n\tborder-color: rgba(130, 170, 255, 0.22);\n}\n\n.dgv-head .dgv-btn:not(.dgv-btn-primary):hover,\n.dgv-head .dgv-btn:not(.dgv-btn-primary):focus-visible {\n\tbackground: rgba(40, 60, 120, 0.45);\n\tborder-color: rgba(150, 190, 255, 0.5);\n\tbox-shadow: 0 0 12px rgba(110, 160, 255, 0.28);\n}\n\n.dgv-head .dgv-btn-on:not(.dgv-btn-primary) {\n\tcolor: #cfe0ff;\n\tborder-color: rgba(150, 190, 255, 0.55);\n\tbox-shadow: inset 0 0 10px rgba(110, 160, 255, 0.22);\n}\n\n.dgv-btn-primary:hover,\n.dgv-btn-primary:focus-visible {\n\tcolor: #05060b;\n\tbackground: linear-gradient(180deg, #eef3ff, #bfd3ff);\n}\n\n.dgv-stage {\n\tposition: relative;\n\tflex: 1;\n\tmin-height: 0;\n\toverflow: hidden;\n}\n\n.dgv-canvas {\n\tdisplay: block;\n\ttouch-action: none;\n\toutline: none;\n\tcursor: grab;\n}\n\n.dgv-tip {\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\tz-index: 80;\n\tbox-sizing: border-box;\n\tmin-width: 150px;\n\tmax-width: 320px;\n\tpadding: 8px 10px;\n\tpointer-events: none;\n\tbackground: rgba(28, 28, 28, 0.96);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.24);\n\tborder-radius: var(--dsw-radius-lg, 10px);\n\tbox-shadow: 0 12px 34px rgba(0, 0, 0, 0.55);\n\tbackdrop-filter: blur(8px);\n}\n\n.dgv-tip-head {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 6px;\n\tmargin-bottom: 3px;\n}\n\n.dgv-tip-dot {\n\twidth: 7px;\n\theight: 7px;\n\tborder-radius: 50%;\n\tflex: none;\n\tbox-shadow: 0 0 8px currentColor;\n}\n\n.dgv-tip-kind {\n\tfont-size: 11px;\n\tline-height: 14px;\n\tletter-spacing: 0.06em;\n\ttext-transform: uppercase;\n\tcolor: rgba(178, 192, 224, 0.6);\n}\n\n.dgv-tip-title {\n\tfont-size: 13px;\n\tline-height: 18px;\n\tfont-weight: 550;\n\tcolor: #f2f5ff;\n\toverflow-wrap: anywhere;\n}\n\n.dgv-tip-path {\n\tmargin-top: 3px;\n\tfont-size: 11px;\n\tline-height: 15px;\n\tcolor: rgba(178, 192, 224, 0.62);\n\toverflow-wrap: anywhere;\n}\n\n.dgv-tip-meta {\n\tmargin-top: 4px;\n\tfont-size: 11px;\n\tline-height: 15px;\n\tcolor: rgba(206, 218, 244, 0.8);\n}\n\n.dgv-empty {\n\tflex: 1;\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tjustify-content: center;\n\tgap: 6px;\n\tpadding: 24px;\n\ttext-align: center;\n}\n\n.dgv-empty-title {\n\tfont-size: 14px;\n\tline-height: 20px;\n\tcolor: rgba(206, 218, 244, 0.86);\n}\n\n.dgv-empty-hint {\n\tfont-size: 12px;\n\tline-height: 18px;\n\tmax-width: 320px;\n\tcolor: rgba(178, 192, 224, 0.55);\n}\n\n.dgv-hint {\n\tposition: absolute;\n\tleft: 16px;\n\tbottom: 14px;\n\tfont-size: 11px;\n\tline-height: 16px;\n\tletter-spacing: 0.02em;\n\tcolor: rgba(178, 192, 224, 0.42);\n\tpointer-events: none;\n\tuser-select: none;\n}\n\n/* ── 3. body: control panel + stage ─────────────────────────────────── */\n\n.dgv-body {\n\tdisplay: flex;\n\tflex: 1;\n\tmin-height: 0;\n}\n\n.dgv-body > .dgv-panel {\n\tmargin-top: var(--dgv-head-h, 0px);\n}\n\n.dgv-empty {\n\tpadding-top: calc(24px + var(--dgv-head-h, 0px));\n}\n\n.dgv-panel {\n\tdisplay: flex;\n\tflex-direction: column;\n\tflex: none;\n\twidth: 288px;\n\tmin-height: 0;\n\tbackground: rgba(28, 28, 28, 0.92);\n\tborder-right: 0.5px solid rgba(150, 170, 220, 0.14);\n\tbackdrop-filter: blur(10px);\n\tfont-size: 12px;\n\toverflow-y: auto;\n\toverscroll-behavior: contain;\n}\n\n.dgv-panel-head {\n\tposition: sticky;\n\ttop: 0;\n\tz-index: 2;\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 8px;\n\tpadding: 12px 12px 8px;\n\tbackground: linear-gradient(180deg, rgba(28, 28, 28, 0.98), rgba(28, 28, 28, 0.88));\n}\n\n.dgv-panel-title {\n\tfont-size: 13px;\n\tfont-weight: 600;\n\tletter-spacing: 0.02em;\n\tcolor: #eef2fb;\n}\n\n.dgv-panel-locale {\n\tmargin-left: auto;\n\tpadding: 1px 6px;\n\tfont-size: 11px;\n\tcolor: rgba(178, 192, 224, 0.7);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.24);\n\tborder-radius: 6px;\n}\n\n.dgv-panel-x {\n\twidth: 22px;\n\theight: 22px;\n\tpadding: 0;\n\tfont-size: 15px;\n\tline-height: 20px;\n\tcolor: rgba(178, 192, 224, 0.7);\n\tbackground: transparent;\n\tborder: 0;\n\tborder-radius: 6px;\n\tcursor: pointer;\n}\n\n.dgv-panel-x:hover {\n\tcolor: #f2f5ff;\n\tbackground: rgba(140, 160, 210, 0.16);\n}\n\n.dgv-panel-actions {\n\tdisplay: flex;\n\tgap: 6px;\n\tpadding: 4px 12px 8px;\n}\n\n.dgv-btn-wide {\n\twidth: 100%;\n\tjustify-content: center;\n}\n\n.dgv-btn-icon {\n\twidth: 28px;\n\tpadding: 0;\n\ttext-align: center;\n}\n\n.dgv-section {\n\tborder-top: 0.5px solid rgba(150, 170, 220, 0.1);\n}\n\n.dgv-section-head {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 6px;\n\twidth: 100%;\n\tpadding: 9px 12px;\n\tfont-size: 11.5px;\n\tfont-weight: 550;\n\tletter-spacing: 0.06em;\n\ttext-transform: uppercase;\n\tcolor: rgba(178, 192, 224, 0.66);\n\tbackground: transparent;\n\tborder: 0;\n\tcursor: pointer;\n\ttext-align: left;\n}\n\n.dgv-section-head:hover {\n\tcolor: rgba(214, 226, 248, 0.9);\n}\n\n.dgv-section-head > span:last-child {\n\tmargin-left: auto;\n\tfont-size: 13px;\n}\n\n.dgv-section-sub {\n\tmargin-left: auto;\n\tmargin-right: 6px;\n\tfont-size: 11px;\n\tletter-spacing: 0;\n\ttext-transform: none;\n\tcolor: rgba(168, 196, 255, 0.7);\n}\n\n.dgv-presets {\n\tdisplay: grid;\n\tgrid-template-columns: 1fr 1fr;\n\tgap: 6px;\n\tpadding: 0 12px 10px;\n}\n\n.dgv-preset {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 5px;\n\tpadding: 7px 8px 8px;\n\ttext-align: left;\n\tcolor: rgba(206, 218, 244, 0.86);\n\tbackground: rgba(140, 160, 210, 0.06);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.16);\n\tborder-radius: 10px;\n\tcursor: pointer;\n\ttransition: background 120ms ease, border-color 120ms ease;\n}\n\n.dgv-preset:hover {\n\tbackground: rgba(140, 160, 210, 0.13);\n\tborder-color: rgba(168, 196, 255, 0.32);\n}\n\n.dgv-preset-on {\n\tcolor: #eef2fb;\n\tbackground: rgba(120, 150, 220, 0.18);\n\tborder-color: rgba(168, 196, 255, 0.6);\n\tbox-shadow: inset 0 0 0 0.5px rgba(168, 196, 255, 0.25);\n}\n\n.dgv-preset-art {\n\tposition: relative;\n\tdisplay: block;\n\theight: 26px;\n\tborder-radius: 6px;\n\tbackground: radial-gradient(120% 90% at 50% 60%, rgba(60, 70, 130, 0.45), rgba(28, 28, 28, 0.92));\n\toverflow: hidden;\n}\n\n.dgv-preset-art i {\n\tposition: absolute;\n\twidth: 4px;\n\theight: 4px;\n\tborder-radius: 50%;\n\ttransform: translate(-50%, -50%);\n}\n\n.dgv-preset-text {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1px;\n\tmin-width: 0;\n}\n\n.dgv-preset-text b {\n\tfont-size: 12px;\n\tfont-weight: 550;\n}\n\n.dgv-preset-text small {\n\tfont-size: 10.5px;\n\tline-height: 13px;\n\tcolor: rgba(178, 192, 224, 0.55);\n\toverflow: hidden;\n\tdisplay: -webkit-box;\n\t-webkit-line-clamp: 2;\n\t-webkit-box-orient: vertical;\n}\n\n.dgv-list {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1px;\n\tpadding: 0 8px 10px;\n}\n\n.dgv-list-note {\n\tpadding: 0 4px 5px;\n\tfont-size: 10.5px;\n\tline-height: 14px;\n\tcolor: rgba(178, 192, 224, 0.45);\n}\n\n.dgv-list-note-block {\n\tpadding: 2px 2px 0;\n}\n\n.dgv-item {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 7px;\n\twidth: 100%;\n\tpadding: 5px 6px;\n\tfont-size: 12px;\n\tcolor: rgba(206, 218, 244, 0.84);\n\tbackground: transparent;\n\tborder: 0;\n\tborder-radius: 7px;\n\tcursor: pointer;\n\ttext-align: left;\n}\n\n.dgv-item:hover {\n\tbackground: rgba(140, 160, 210, 0.14);\n}\n\n.dgv-item-off {\n\topacity: 0.38;\n}\n\n.dgv-dot {\n\tflex: none;\n\twidth: 7px;\n\theight: 7px;\n\tborder-radius: 50%;\n}\n\n.dgv-item-name {\n\tflex: 1;\n\tmin-width: 0;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n\n.dgv-item-count {\n\tfont-size: 11px;\n\tcolor: rgba(178, 192, 224, 0.45);\n\tfont-variant-numeric: tabular-nums;\n}\n\n.dgv-toggles {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tgap: 5px;\n\tpadding: 0 12px 10px;\n}\n\n.dgv-section .dgv-toggles {\n\tpadding-top: 2px;\n}\n\n.dgv-chip {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tgap: 5px;\n\theight: 24px;\n\tpadding: 0 9px;\n\tfont-size: 11.5px;\n\tcolor: rgba(206, 218, 244, 0.78);\n\tbackground: rgba(140, 160, 210, 0.08);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.18);\n\tborder-radius: 999px;\n\tcursor: pointer;\n}\n\n.dgv-chip:hover {\n\tbackground: rgba(140, 160, 210, 0.16);\n}\n\n.dgv-chip-on {\n\tcolor: #dce7ff;\n\tbackground: rgba(120, 150, 220, 0.24);\n\tborder-color: rgba(168, 196, 255, 0.5);\n}\n\n.dgv-chip i {\n\twidth: 8px;\n\theight: 8px;\n\tborder-radius: 50%;\n}\n\n.dgv-search-block {\n\tdisplay: block;\n\twidth: calc(100% - 20px);\n\tmargin: 0 10px 10px;\n}\n\n.dgv-rows {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 7px;\n\tpadding: 0 12px 12px;\n}\n\n.dgv-row {\n\tdisplay: grid;\n\tgrid-template-columns: 76px 1fr 34px;\n\talign-items: center;\n\tgap: 7px;\n\tfont-size: 11.5px;\n\tcolor: rgba(186, 200, 232, 0.75);\n}\n\n.dgv-row-label {\n\tcursor: pointer;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n\n.dgv-row-value {\n\tfont-size: 10.5px;\n\ttext-align: right;\n\tcolor: rgba(168, 196, 255, 0.8);\n\tfont-variant-numeric: tabular-nums;\n}\n\n.dgv-row input[type=\"range\"] {\n\t-webkit-appearance: none;\n\tappearance: none;\n\twidth: 100%;\n\theight: 16px;\n\tbackground: transparent;\n\tcursor: pointer;\n}\n\n.dgv-row input[type=\"range\"]::-webkit-slider-runnable-track {\n\theight: 3px;\n\tbackground: rgba(150, 170, 220, 0.22);\n\tborder-radius: 2px;\n}\n\n.dgv-row input[type=\"range\"]::-webkit-slider-thumb {\n\t-webkit-appearance: none;\n\twidth: 11px;\n\theight: 11px;\n\tmargin-top: -4px;\n\tbackground: #cfdcff;\n\tborder-radius: 50%;\n\tbox-shadow: 0 0 6px rgba(168, 196, 255, 0.7);\n}\n\n.dgv-row input[type=\"range\"]::-moz-range-track {\n\theight: 3px;\n\tbackground: rgba(150, 170, 220, 0.22);\n\tborder-radius: 2px;\n}\n\n.dgv-row input[type=\"range\"]::-moz-range-thumb {\n\twidth: 11px;\n\theight: 11px;\n\tbackground: #cfdcff;\n\tborder: 0;\n\tborder-radius: 50%;\n}\n\n.dgv-switch-row {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 8px;\n\tpadding: 3px 0 5px;\n}\n\n.dgv-switch-row > span {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1px;\n\tmin-width: 0;\n}\n\n.dgv-switch-row b {\n\tfont-size: 12px;\n\tfont-weight: 550;\n\tcolor: rgba(214, 226, 248, 0.9);\n}\n\n.dgv-switch-row small {\n\tfont-size: 10.5px;\n\tline-height: 13px;\n\tcolor: rgba(178, 192, 224, 0.45);\n}\n\n.dgv-switch-row .dgv-btn {\n\tmargin-left: auto;\n}\n\n.dgv-switch {\n\tposition: relative;\n\tflex: none;\n\twidth: 34px;\n\theight: 19px;\n\tpadding: 0;\n\tbackground: rgba(150, 170, 220, 0.18);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.24);\n\tborder-radius: 999px;\n\tcursor: pointer;\n\ttransition: background 140ms ease;\n}\n\n.dgv-switch i {\n\tposition: absolute;\n\ttop: 2px;\n\tleft: 2px;\n\twidth: 13px;\n\theight: 13px;\n\tbackground: #c6d4f2;\n\tborder-radius: 50%;\n\ttransition: transform 140ms ease, background 140ms ease;\n}\n\n.dgv-switch-on {\n\tbackground: rgba(120, 160, 240, 0.6);\n\tborder-color: rgba(168, 196, 255, 0.6);\n}\n\n.dgv-switch-on i {\n\ttransform: translateX(15px);\n\tbackground: #f4f8ff;\n}\n\n.dgv-switch-end {\n\tmargin-left: auto;\n}\n\n.dgv-swatch {\n\tflex: none;\n\twidth: 18px;\n\theight: 18px;\n\tpadding: 0;\n\tborder: 0.5px solid rgba(150, 170, 220, 0.3);\n\tborder-radius: 50%;\n\tcursor: pointer;\n}\n\n.dgv-swatch-on {\n\tbox-shadow: 0 0 0 1.5px #000, 0 0 0 3px rgba(220, 232, 255, 0.85);\n}\n\n.dgv-color {\n\tflex: none;\n\twidth: 26px;\n\theight: 20px;\n\tpadding: 0;\n\tbackground: none;\n\tborder: 0.5px solid rgba(150, 170, 220, 0.3);\n\tborder-radius: 5px;\n\tcursor: pointer;\n}\n\n.dgv-color::-webkit-color-swatch-wrapper {\n\tpadding: 2px;\n}\n\n.dgv-color::-webkit-color-swatch {\n\tborder: none;\n\tborder-radius: 3px;\n}\n\n.dgv-pair {\n\tdisplay: flex;\n\tgap: 6px;\n}\n\n.dgv-pair .dgv-btn {\n\tflex: 1;\n}\n\n.dgv-mine {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tgap: 5px;\n}\n\n.dgv-mine-chip {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tbackground: rgba(140, 160, 210, 0.1);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.18);\n\tborder-radius: 999px;\n\toverflow: hidden;\n}\n\n.dgv-mine-chip button {\n\tpadding: 2px 7px;\n\tfont-size: 11px;\n\tcolor: rgba(206, 218, 244, 0.82);\n\tbackground: transparent;\n\tborder: 0;\n\tcursor: pointer;\n}\n\n.dgv-mine-x {\n\tcolor: rgba(178, 192, 224, 0.45) !important;\n\tborder-left: 0.5px solid rgba(150, 170, 220, 0.18) !important;\n}\n\n.dgv-panel-foot {\n\tposition: sticky;\n\tbottom: 0;\n\tmargin-top: auto;\n\tpadding: 8px 12px 10px;\n\tfont-size: 10.5px;\n\tline-height: 14px;\n\tcolor: rgba(178, 192, 224, 0.42);\n\tbackground: linear-gradient(0deg, rgba(28, 28, 28, 0.98), rgba(28, 28, 28, 0.72));\n\tfont-variant-numeric: tabular-nums;\n}\n\n.dgv-badge {\n\tmargin-left: auto;\n\tpadding: 1px 6px;\n\tfont-size: 10px;\n\tline-height: 14px;\n\tletter-spacing: 0;\n\ttext-transform: none;\n\tcolor: #ffd8a8;\n\tbackground: rgba(255, 200, 130, 0.14);\n\tborder-radius: 999px;\n}\n\n.dgv-revert {\n\tmargin-left: 6px;\n\tfont-size: 10.5px;\n\tletter-spacing: 0;\n\ttext-transform: none;\n\tcolor: rgba(168, 196, 255, 0.8);\n\tcursor: pointer;\n}\n\n.dgv-revert:hover {\n\tcolor: #dce7ff;\n\ttext-decoration: underline;\n}\n\n/* ── 3b. panel extras: notch sliders, help, grip, inline rows ─────── */\n\n.dgv-panel-locale {\n\tcursor: pointer;\n\tbackground: transparent;\n}\n\n.dgv-panel-locale:hover {\n\tcolor: #f2f5ff;\n\tborder-color: rgba(168, 196, 255, 0.5);\n}\n\n.dgv-panel-x-on {\n\tcolor: #f2f5ff;\n\tbackground: rgba(140, 160, 210, 0.2);\n}\n\n.dgv-help {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 3px;\n\tmargin: 0 12px 8px;\n\tpadding: 8px 10px;\n\tfont-size: 11px;\n\tline-height: 15px;\n\tcolor: rgba(206, 218, 244, 0.8);\n\tbackground: rgba(140, 160, 210, 0.08);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.2);\n\tborder-radius: 8px;\n}\n\n.dgv-help b {\n\tfont-size: 11.5px;\n\tfont-weight: 600;\n\tcolor: #eef2fb;\n}\n\n.dgv-panel-grip {\n\tflex: none;\n\twidth: 5px;\n\tmargin-left: -3px;\n\tcursor: col-resize;\n\tz-index: 3;\n\tbackground: transparent;\n\ttransition: background 120ms ease;\n}\n\n.dgv-panel-grip:hover {\n\tbackground: rgba(168, 196, 255, 0.28);\n}\n\n.dgv-slider {\n\tposition: relative;\n\tdisplay: block;\n\tmin-width: 0;\n}\n\n.dgv-notch {\n\tposition: absolute;\n\ttop: 3px;\n\twidth: 1px;\n\theight: 10px;\n\tmargin-left: -0.5px;\n\tbackground: rgba(206, 218, 244, 0.42);\n\tpointer-events: none;\n}\n\n.dgv-inline {\n\tdisplay: grid;\n\tgrid-template-columns: 76px 1fr;\n\talign-items: center;\n\tgap: 7px;\n\tfont-size: 11.5px;\n\tcolor: rgba(186, 200, 232, 0.75);\n}\n\n.dgv-toggles-flush,\n.dgv-section .dgv-toggles-flush {\n\tpadding: 0;\n\tmin-width: 0;\n}\n\n.dgv-toggles-flush .dgv-chip {\n\tflex: none;\n}\n\n.dgv-badge-preview {\n\tcolor: #bfe3ff;\n\tbackground: rgba(120, 190, 255, 0.16);\n}\n\n.dgv-badge-quiet {\n\tcolor: rgba(178, 192, 224, 0.6);\n\tbackground: rgba(140, 160, 210, 0.1);\n}\n\n.dgv-mine-input {\n\twidth: 96px;\n\theight: 20px;\n\tpadding: 0 6px;\n\tfont-size: 11px;\n\tcolor: #eef2fb;\n\tbackground: rgba(140, 160, 210, 0.16);\n\tborder: 0;\n\toutline: none;\n}\n\n.dgv-mine-ask {\n\tpadding: 2px 4px 2px 8px;\n\tfont-size: 11px;\n\tcolor: #ffd8a8;\n}\n\n/* ── 3c. search dropdown and scene banners ───────────────────────── */\n\n.dgv-searchbox {\n\tposition: relative;\n}\n\n.dgv-search-drop {\n\tposition: absolute;\n\ttop: 32px;\n\tleft: 0;\n\tz-index: 90;\n\tbox-sizing: border-box;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1px;\n\twidth: max(100%, 280px);\n\tpadding: 4px;\n\tbackground: rgba(28, 28, 28, 0.98);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.24);\n\tborder-radius: var(--dsw-radius-lg, 10px);\n\tbox-shadow: 0 12px 34px rgba(0, 0, 0, 0.55);\n}\n\n.dgv-search-hit {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 7px;\n\twidth: 100%;\n\tpadding: 5px 7px;\n\tfont-size: 12px;\n\tcolor: rgba(206, 218, 244, 0.86);\n\tbackground: transparent;\n\tborder: 0;\n\tborder-radius: 7px;\n\tcursor: pointer;\n\ttext-align: left;\n}\n\n.dgv-search-hit-on {\n\tbackground: rgba(140, 160, 210, 0.16);\n}\n\n.dgv-search-none {\n\tpadding: 6px 8px;\n\tfont-size: 11.5px;\n\tcolor: rgba(178, 192, 224, 0.5);\n}\n\n.dgv-banner {\n\tposition: absolute;\n\ttop: calc(var(--dgv-head-h, 0px) + 14px);\n\tleft: 50%;\n\tz-index: 70;\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 10px;\n\tpadding: 6px 8px 6px 14px;\n\tfont-size: 12px;\n\tcolor: #eef2fb;\n\tbackground: rgba(28, 28, 28, 0.94);\n\tborder: 0.5px solid rgba(168, 196, 255, 0.36);\n\tborder-radius: 999px;\n\tbox-shadow: 0 8px 26px rgba(0, 0, 0, 0.5);\n\ttransform: translateX(-50%);\n\twhite-space: nowrap;\n}\n\n.dgv-banner-notice {\n\ttop: calc(var(--dgv-head-h, 0px) + 56px);\n\tpadding-right: 14px;\n\tcolor: #ffd8a8;\n\tborder-color: rgba(255, 200, 130, 0.36);\n}\n/* ── 4. star info card ──────────────────────────────────────────────── */\n\n/* The batched GPU bodies (src/gpu.js) sit above the 2D layer: links and captions are drawn\n * under them, which is what makes a thousand bodies cost two draw calls. */\n.dgv-glow {\n\tposition: absolute;\n\tinset: 0;\n\tz-index: 3;\n\twidth: 100%;\n\theight: 100%;\n\tpointer-events: none;\n}\n\n.dgv-card {\n\tposition: absolute;\n\tz-index: 60;\n\tbox-sizing: border-box;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 4px;\n\twidth: 250px;\n\tpadding: 10px 12px 12px;\n\tbackground: rgba(28, 28, 28, 0.97);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.24);\n\tborder-radius: 12px;\n\tbox-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);\n\tbackdrop-filter: blur(10px);\n\tcursor: grab;\n\tuser-select: none;\n\ttouch-action: none;\n}\n\n.dgv-card-dragging {\n\tcursor: grabbing;\n}\n\n.dgv-card button {\n\tcursor: pointer;\n}\n\n.dgv-card-head {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 6px;\n}\n\n.dgv-card-head .dgv-panel-x {\n\tmargin-left: auto;\n}\n\n.dgv-card-title {\n\tfont-size: 13px;\n\tline-height: 18px;\n\tfont-weight: 600;\n\tcolor: #f2f5ff;\n\toverflow-wrap: anywhere;\n}\n\n.dgv-card-path {\n\tfont-size: 10.5px;\n\tline-height: 14px;\n\tcolor: rgba(178, 192, 224, 0.55);\n\toverflow-wrap: anywhere;\n}\n\n.dgv-card-meta {\n\tfont-size: 11px;\n\tline-height: 15px;\n\tcolor: rgba(206, 218, 244, 0.8);\n}\n\n.dgv-card-list {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1px;\n\tmax-height: 190px;\n\tmargin: 4px -4px 2px;\n\tpadding: 2px 4px 0;\n\toverflow-y: auto;\n\toverscroll-behavior: contain;\n\tborder-top: 0.5px solid rgba(150, 170, 220, 0.14);\n}\n\n.dgv-card-list .dgv-list-note {\n\tpadding: 4px 2px 4px;\n}\n\n.dgv-card-none {\n\tpadding: 4px 2px 6px;\n\tfont-size: 11px;\n\tcolor: rgba(178, 192, 224, 0.5);\n}\n\n.dgv-card-row {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 7px;\n\twidth: 100%;\n\tpadding: 4px 5px;\n\tfont-size: 11.5px;\n\tcolor: rgba(206, 218, 244, 0.86);\n\tbackground: transparent;\n\tborder: 0;\n\tborder-radius: 6px;\n\tcursor: pointer;\n\ttext-align: left;\n}\n\n.dgv-card-row:hover {\n\tcolor: #f4f7ff;\n\tbackground: rgba(140, 160, 210, 0.16);\n}\n\n.dgv-card-row .dgv-item-count {\n\tflex: none;\n}\n\n.dgv-dot-live {\n\tbox-shadow: 0 0 0 2px rgba(255, 255, 255, 0.22), 0 0 8px currentColor;\n}\n\n.dgv-card-actions {\n\tdisplay: flex;\n\tgap: 6px;\n\tmargin-top: 6px;\n}\n\n.dgv-card-actions .dgv-btn {\n\tflex: 1;\n}\n\n/* ------------------------------------------------------------------ *\n * Star interior\n *\n * The live conversation stays in the harness panel; this paints the inside\n * of the star around it and gives it one way back out.\n * ------------------------------------------------------------------ */\n\n.dgv-inside-shell {\n\tposition: fixed;\n\tinset: 0;\n\tz-index: 2147481990;\n\twidth: 100%;\n\theight: 100%;\n\tpointer-events: none;\n\tmix-blend-mode: screen;\n}\n\n.dgv-inside-glow {\n\tposition: fixed;\n\tinset: 0;\n\tz-index: 2147482000;\n\tpointer-events: none;\n\t/* A gentle rim of the star's own hue: the gradient starts late and stays weak so the\n\t * shell's dots keep one colour from the middle to the edges. */\n\tbackground:\n\t\tradial-gradient(120% 84% at 50% 50%, transparent 62%, hsla(var(--dgv-inside-hue), 62%, 56%, 0.14) 100%),\n\t\tradial-gradient(60% 40% at 50% 0%, hsla(var(--dgv-inside-hue), 64%, 62%, 0.08), transparent 70%);\n\tbox-shadow: inset 0 0 70px hsla(var(--dgv-inside-hue), 62%, 56%, 0.26);\n\tmix-blend-mode: screen;\n}\n\n.dgv-inside-back {\n\tposition: fixed;\n\tleft: 18px;\n\tbottom: 18px;\n\tz-index: 2147483000;\n\tdisplay: inline-flex;\n\talign-items: center;\n\tgap: 7px;\n\theight: 30px;\n\tpadding: 0 13px;\n\tborder-radius: 999px;\n\tborder: 1px solid hsla(var(--dgv-inside-hue), 60%, 66%, 0.34);\n\tbackground: rgba(24, 25, 30, 0.82);\n\tbackdrop-filter: blur(10px);\n\tcolor: rgba(232, 236, 244, 0.9);\n\tfont: inherit;\n\tfont-size: 12.5px;\n\tcursor: pointer;\n\ttransition: border-color 140ms ease, background 140ms ease, transform 140ms ease;\n}\n\n.dgv-inside-back:hover {\n\tborder-color: hsla(var(--dgv-inside-hue), 72%, 70%, 0.6);\n\tbackground: rgba(30, 32, 38, 0.9);\n\ttransform: translateY(-1px);\n}\n\n.dgv-inside-back::before {\n\tcontent: \"\";\n\twidth: 7px;\n\theight: 7px;\n\tborder-radius: 50%;\n\tbackground: hsl(var(--dgv-inside-hue), 84%, 68%);\n\tbox-shadow: 0 0 9px hsla(var(--dgv-inside-hue), 90%, 68%, 0.8);\n}\n\n/* Chat surfaces read as the star's own plane rather than a stock sheet. */\nbody[data-dgv-inside] [data-dsh-conversation-root],\nbody[data-dgv-inside] [data-dsh-main-panel] {\n\tbackground-color: var(--dgv-inside-base, #000000) !important;\n}\n\n/* ── 9. memory library ──────────────────────────────────────────────── */\n\n/* Same page shell as the galaxy, with the map in the middle and two columns\n * that read like a file browser: bodies on the left, the open file on the right. */\n\n.dgv-mem-body {\n\tdisplay: flex;\n\tflex: 1;\n\tmin-height: 0;\n}\n\n.dgv-mem-panel {\n\tdisplay: flex;\n\tflex-direction: column;\n\tflex: none;\n\twidth: 280px;\n\tmin-height: 0;\n\tmargin-top: var(--dgv-head-h, 0px);\n\tbackground: rgba(26, 27, 31, 0.9);\n\tborder-right: 0.5px solid rgba(150, 170, 220, 0.14);\n\tbackdrop-filter: blur(10px);\n\tfont-size: 12px;\n}\n\n.dgv-mem-tabs {\n\tdisplay: flex;\n\tgap: 2px;\n\tpadding: 10px 10px 8px;\n}\n\n.dgv-mem-tab {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tgap: 6px;\n\tflex: 1;\n\tjustify-content: center;\n\tpadding: 5px 6px;\n\tborder: 0.5px solid transparent;\n\tborder-radius: 7px;\n\tbackground: transparent;\n\tcolor: rgba(196, 207, 232, 0.66);\n\tfont: inherit;\n\tfont-size: 12px;\n\tcursor: pointer;\n\ttransition: color 140ms ease, background 140ms ease, border-color 140ms ease;\n}\n\n.dgv-mem-tab:hover {\n\tcolor: #eef2fb;\n\tbackground: rgba(150, 170, 220, 0.1);\n}\n\n.dgv-mem-tab-on {\n\tcolor: #eef2fb;\n\tbackground: rgba(150, 170, 220, 0.16);\n\tborder-color: rgba(150, 170, 220, 0.24);\n}\n\n.dgv-mem-tab-n {\n\tfont-size: 10.5px;\n\tcolor: rgba(178, 192, 224, 0.5);\n\tfont-variant-numeric: tabular-nums;\n}\n\n.dgv-mem-filter {\n\tmargin: 0 10px 8px;\n\tpadding: 6px 9px;\n\tborder: 0.5px solid rgba(150, 170, 220, 0.2);\n\tborder-radius: 7px;\n\tbackground: rgba(12, 13, 16, 0.5);\n\tcolor: #eef2fb;\n\tfont: inherit;\n\tfont-size: 12px;\n}\n\n.dgv-mem-filter:focus-visible {\n\toutline: none;\n\tborder-color: rgba(150, 190, 255, 0.5);\n}\n\n.dgv-mem-list {\n\tflex: 1;\n\tmin-height: 0;\n\toverflow-y: auto;\n\toverscroll-behavior: contain;\n\tpadding: 0 6px 8px;\n}\n\n.dgv-mem-row {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 8px;\n\twidth: 100%;\n\tpadding: 5px 7px;\n\tborder: 0.5px solid transparent;\n\tborder-radius: 6px;\n\tbackground: transparent;\n\tcolor: rgba(224, 231, 246, 0.86);\n\tfont: inherit;\n\tfont-size: 12px;\n\ttext-align: left;\n\tcursor: pointer;\n}\n\n.dgv-mem-row:hover {\n\tbackground: rgba(150, 170, 220, 0.1);\n}\n\n.dgv-mem-row-on {\n\tbackground: rgba(150, 190, 255, 0.16);\n\tcolor: #ffffff;\n}\n\n.dgv-mem-dot {\n\tflex: none;\n\twidth: 6px;\n\theight: 6px;\n\tborder-radius: 50%;\n\tbackground: currentColor;\n\tbox-shadow: 0 0 7px currentColor;\n}\n\n.dgv-mem-name {\n\tflex: 1;\n\tmin-width: 0;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n\n.dgv-mem-meta {\n\tflex: none;\n\tfont-size: 10.5px;\n\tcolor: rgba(178, 192, 224, 0.5);\n\tfont-variant-numeric: tabular-nums;\n}\n\n.dgv-mem-none {\n\tpadding: 14px 10px;\n\tcolor: rgba(178, 192, 224, 0.5);\n\tfont-size: 12px;\n}\n\n.dgv-mem-card {\n\tflex: none;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 4px;\n\tpadding: 10px 12px 12px;\n\tborder-top: 0.5px solid rgba(150, 170, 220, 0.16);\n\tbackground: linear-gradient(180deg, rgba(26, 27, 31, 0.86), rgba(20, 21, 25, 0.96));\n}\n\n.dgv-mem-card-kind {\n\tfont-size: 10.5px;\n\tletter-spacing: 0.06em;\n\ttext-transform: uppercase;\n\tcolor: rgba(178, 192, 224, 0.55);\n}\n\n.dgv-mem-card-name {\n\tfont-size: 13px;\n\tfont-weight: 600;\n\tcolor: #eef2fb;\n\toverflow-wrap: anywhere;\n}\n\n.dgv-mem-card-meta,\n.dgv-mem-card-path {\n\tfont-size: 11px;\n\tcolor: rgba(178, 192, 224, 0.62);\n\toverflow-wrap: anywhere;\n}\n\n.dgv-mem-card-desc {\n\tfont-size: 11.5px;\n\tline-height: 1.45;\n\tcolor: rgba(206, 216, 236, 0.72);\n\tmax-height: 4.4em;\n\toverflow: hidden;\n}\n\n.dgv-mem-card .dgv-btn {\n\tmargin-top: 4px;\n}\n\n/* 星空 ⇄ 记忆库: the outgoing view's last frame dissolves over the incoming one. */\n.dgv-view {\n\tposition: relative;\n\twidth: 100%;\n\theight: 100%;\n\toverflow: hidden;\n}\n\n.dgv-view-dissolve {\n\tposition: absolute;\n\tinset: 0;\n\twidth: 100%;\n\theight: 100%;\n\tobject-fit: cover;\n\tpointer-events: none;\n\tz-index: 60;\n\tanimation: dgv-view-dissolve 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards;\n}\n\n@keyframes dgv-view-dissolve {\n\tfrom {\n\t\topacity: 1;\n\t\ttransform: scale(1);\n\t}\n\tto {\n\t\topacity: 0;\n\t\ttransform: scale(1.02);\n\t}\n}\n\n@media (prefers-reduced-motion: reduce) {\n\t.dgv-view-dissolve {\n\t\tanimation-duration: 1ms;\n\t}\n}\n\n.dgv-mem-stage {\n\tposition: relative;\n\tflex: 1;\n\tmin-width: 0;\n\tmin-height: 0;\n}\n\n.dgv-mem-canvas {\n\tdisplay: block;\n\twidth: 100%;\n\theight: 100%;\n\tcursor: grab;\n\ttouch-action: none;\n}\n\n.dgv-mem-tip {\n\tposition: absolute;\n\tz-index: 30;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1px;\n\tmax-width: 260px;\n\tpadding: 7px 10px;\n\tborder: 0.5px solid rgba(150, 170, 220, 0.22);\n\tborder-radius: 8px;\n\tbackground: rgba(14, 15, 19, 0.92);\n\tbox-shadow: 0 10px 26px rgba(0, 0, 0, 0.5);\n\tpointer-events: none;\n\tfont-size: 11.5px;\n\tcolor: #eef2fb;\n}\n\n.dgv-mem-tip-kind {\n\tfont-size: 10px;\n\tletter-spacing: 0.06em;\n\ttext-transform: uppercase;\n\tcolor: rgba(178, 192, 224, 0.55);\n}\n\n.dgv-mem-tip-name {\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n\n.dgv-mem-tip-meta {\n\tfont-size: 11px;\n\tcolor: rgba(178, 192, 224, 0.62);\n}\n\n.dgv-mem-status {\n\tflex: 1;\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tjustify-content: center;\n\tgap: 10px;\n\tpadding: 0 24px;\n\ttext-align: center;\n}\n\n.dgv-mem-status-title {\n\tfont-size: 13px;\n\tcolor: rgba(226, 233, 248, 0.9);\n}\n\n.dgv-mem-status-note {\n\tmax-width: 46ch;\n\tfont-size: 12px;\n\tline-height: 1.5;\n\tcolor: rgba(178, 192, 224, 0.6);\n\toverflow-wrap: anywhere;\n}\n\n.dgv-mem-badge {\n\tposition: absolute;\n\tleft: 50%;\n\tbottom: 18px;\n\ttransform: translateX(-50%);\n\tpadding: 5px 12px;\n\tborder-radius: 999px;\n\tborder: 0.5px solid rgba(150, 170, 220, 0.2);\n\tbackground: rgba(14, 15, 19, 0.8);\n\tfont-size: 11.5px;\n\tcolor: rgba(214, 224, 244, 0.8);\n\tpointer-events: none;\n}\n\n.dgv-mem-hint {\n\tposition: absolute;\n\tleft: 296px;\n\tbottom: 14px;\n\tfont-size: 11px;\n\tcolor: rgba(178, 192, 224, 0.42);\n\tpointer-events: none;\n\ttext-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);\n}\n\n/* Editor drawer: the open file, over the map on the right. */\n\n.dgv-mem-editor {\n\tposition: absolute;\n\ttop: calc(var(--dgv-head-h, 0px) + 8px);\n\tright: 12px;\n\tbottom: 12px;\n\tz-index: 45;\n\tdisplay: flex;\n\tflex-direction: column;\n\twidth: min(46vw, 520px);\n\tmin-height: 0;\n\tborder: 0.5px solid rgba(150, 170, 220, 0.2);\n\tborder-radius: 12px;\n\tbackground: rgba(18, 19, 23, 0.96);\n\tbox-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);\n\tbackdrop-filter: blur(12px);\n\toverflow: hidden;\n}\n\n.dgv-mem-editor-head {\n\tdisplay: flex;\n\talign-items: flex-start;\n\tgap: 8px;\n\tpadding: 12px 12px 10px;\n\tborder-bottom: 0.5px solid rgba(150, 170, 220, 0.14);\n}\n\n.dgv-mem-editor-text {\n\tflex: 1;\n\tmin-width: 0;\n}\n\n.dgv-mem-editor-name {\n\tfont-size: 13px;\n\tfont-weight: 600;\n\tcolor: #eef2fb;\n\toverflow-wrap: anywhere;\n}\n\n.dgv-mem-editor-path {\n\tfont-size: 10.5px;\n\tcolor: rgba(178, 192, 224, 0.5);\n\toverflow-wrap: anywhere;\n}\n\n.dgv-mem-editor-x {\n\tmargin-left: auto;\n}\n\n.dgv-mem-note {\n\tpadding: 8px 12px;\n\tfont-size: 11.5px;\n\tline-height: 1.45;\n\tcolor: rgba(206, 216, 236, 0.8);\n\tbackground: rgba(150, 190, 255, 0.08);\n\tborder-bottom: 0.5px solid rgba(150, 170, 220, 0.12);\n}\n\n.dgv-mem-note-warn {\n\tcolor: #ffd9a8;\n\tbackground: rgba(255, 184, 92, 0.1);\n}\n\n.dgv-mem-text {\n\tflex: 1;\n\tmin-height: 0;\n\tmargin: 0;\n\tpadding: 12px;\n\tborder: 0;\n\tbackground: transparent;\n\tcolor: #e8eefb;\n\tfont-family: ui-monospace, \"SF Mono\", \"JetBrains Mono\", Menlo, monospace;\n\tfont-size: 12px;\n\tline-height: 1.6;\n\tresize: none;\n\ttab-size: 2;\n}\n\n.dgv-mem-text:focus-visible {\n\toutline: none;\n}\n\n.dgv-mem-editor-foot {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 8px;\n\tpadding: 9px 12px;\n\tborder-top: 0.5px solid rgba(150, 170, 220, 0.14);\n}\n\n.dgv-mem-editor-status {\n\tflex: 1;\n\tmin-width: 0;\n\tfont-size: 11px;\n\tcolor: rgba(178, 192, 224, 0.6);\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n\n.dgv-btn-view {\n\tflex: none;\n}\n\n@media (max-width: 900px) {\n\t.dgv-mem-panel {\n\t\twidth: 224px;\n\t}\n\n\t.dgv-mem-hint {\n\t\tleft: 240px;\n\t}\n}\n";
		const tagId = "dsh-galaxy-view/styles.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-galaxy-view";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}

		// ── src/settings.js ────────────────────────────────────────────
/**
 * Pure look data and the settings migration: presets, palettes, defaults.
 *
 * No DOM and no storage access, so `scripts/selfcheck.mjs` can import it directly;
 * `scripts/build.mjs` inlines it into the client bundle ahead of `src/client.js`.
 */

/**
 * Bumped whenever the shipped look changes enough that stored visual settings
 * would hide it. A stored object with an older (or missing) version keeps its
 * filters and has every visual key reset to {@link DEFAULTS} once.
 */
/**
 * 19: default 图形质量 is "high" instead of "auto".
 * 18: 工作星体 controls (scale / orbit speed / trail length / whiteness).
 * 17: 集群云雾 is off in every preset (the orange cloud read as a stray blob that did not
 * follow the star it belonged to); 16: 高性能渲染 toggle (GPU 星体) added; 15: 矩阵's links are thinner (连线粗细 0.85 → 0.6, −30%); 14: 太阳系 no longer draws 集群云雾 (the cloud billboards were baked at the old planet
 * positions and stayed behind as coloured ghosts once the orbits moved); 13: 方阵's 集群云雾 drops to 0.37 (was 0.52); 12: every preset's 辉光强度 drops a notch (0.5 → 0.38, 极简 0.42 → 0.34, 太阳系 0.34 →
 * 0.28) because the glow read as a little too bright; 11: 太阳系's glow is calmer (辉光强度 0.34, 阈值 0.3) so a moon cluster no longer burns
 * into one white blob; 10: the daylight mode is gone (`visual` removed); 极简 is the **spherical rings** (星环's concentric circles wrapped onto a wireframe globe,
 * `layout: "sphere"`) and 星体亮度 defaults to 0.5 (the neutral gain). Bumping the version is
 * what makes an *existing* install pick this up: an upgrade resets every non-preserved key to
 * `DEFAULTS`.
 */
const SETTINGS_VERSION = 19;

/** Every theme draws on pure black; colour comes only from stars, links and world-space haze. */
const SPACE = "#000000";

/**
 * Eight hand-tuned looks. 链接透明度 per preset is Galaxy View's value for the preset
 * with the same link curve (银河 0.14, 轨道→星环 0.11, 星云→球壳 0.2, 旋臂→双螺旋 0.16,
 * 深空场→方阵 0.08, 极简→晶格 0.07, 烟火→星树 0.28; 极简 is lifted to 0.1 for its hairline links).
 * 深空场 itself now occupies the slot 晶格 used to: an unstructured scatter, its own haze
 * and no guides at all. 极简 is Galaxy View's
 * Minimal preset as a whole, matched to a screenshot of it: an open web of small light
 * yellow-green dots (a faint glow only on the bigger suns), no sky, no haze, straight
 * hairline links in a lifted green. Each one is a partial override on {@link DEFAULTS}; the parts
 * it does not mention stay as they were, which is what makes "自定义" meaningful.
 */
const PRESETS = {
	galaxy: { layout: "spiral", theme: "deepfield", brightness: 0.5, bloomStrength: 0.38, bloom: 0.58, threshold: 0.22, veil: 0.34, field: 0.7, shellSize: 1, shellGlow: 1, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0, dust: 0, fieldStars: 0.25, backdrop: true, arms: 2, twist: 4.3, thickness: 1, spread: 1, nodeSize: 1, linkWidth: 0.85, linkColor: "auto", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: true, twinkle: 0.5, orbitSpeed: 0.35 },
	rings: { layout: "rings", theme: "sunset", brightness: 0.5, bloomStrength: 0.38, bloom: 0.58, threshold: 0.22, veil: 0.2, field: 0.5, shellSize: 1, shellGlow: 0.85, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0, dust: 0, fieldStars: 0.1, backdrop: true, arms: 1, twist: 1.3, thickness: 0.5, spread: 1.2, nodeSize: 1, linkWidth: 0.85, linkColor: "auto", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: false, twinkle: 0.5, orbitSpeed: 0.4 },
	deepfield: { layout: "sphere", theme: "deepfield", brightness: 0.5, bloomStrength: 0.34, bloom: 0.5, threshold: 0.3, veil: 0, field: 0.5, shellSize: 1, shellGlow: 0.85, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0, dust: 0, fieldStars: 0, backdrop: false, arms: 2, twist: 3, thickness: 1, spread: 1, nodeSize: 0.85, linkWidth: 0.8, linkColor: "auto", linkOpacity: 0.2, linkBrightness: 1.05, linkCurve: 0.3, showLinks: true, twinkle: 0.3, orbitSpeed: 0.22 },
	system: { layout: "system", theme: "solar", brightness: 0.5, bloomStrength: 0.28, bloom: 0.58, threshold: 0.3, veil: 0.3, field: 0.45, shellSize: 1, shellGlow: 0.85, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0, dust: 0.34, fieldStars: 0.12, backdrop: true, arms: 2, twist: 3, thickness: 1, spread: 1, nodeSize: 1, linkWidth: 0.85, linkColor: "auto", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: true, twinkle: 0.5, orbitSpeed: 0.24 },
	helix: { layout: "helix", theme: "cyber", brightness: 0.5, bloomStrength: 0.38, bloom: 0.58, threshold: 0.22, veil: 0.18, field: 0.48, shellSize: 1, shellGlow: 0.85, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0, dust: 0, fieldStars: 0.3, backdrop: true, arms: 2, twist: 4, thickness: 1.1, spread: 1, nodeSize: 1, linkWidth: 0.85, linkColor: "auto", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: true, twinkle: 0.5, orbitSpeed: 0.32 },
	minimal: { layout: "web", theme: "matrix", brightness: 0.5, bloomStrength: 0.38, bloom: 0.58, threshold: 0.22, veil: 0, field: 0.5, shellSize: 1, shellGlow: 0.85, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0, dust: 0, fieldStars: 0, backdrop: false, arms: 2, twist: 3, thickness: 1, spread: 1, nodeSize: 1, linkWidth: 0.6, linkColor: "#5a9a40", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: true, twinkle: 0.5, orbitSpeed: 0.28 },
	plate: { layout: "plate", theme: "hubble", brightness: 0.5, bloomStrength: 0.38, bloom: 0.58, threshold: 0.22, veil: 0.08, field: 0.45, shellSize: 0.85, shellGlow: 0.8, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0, dust: 0, fieldStars: 0.1, backdrop: true, arms: 2, twist: 3, thickness: 1, spread: 0.8, nodeSize: 1, linkWidth: 0.85, linkColor: "auto", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: true, twinkle: 0.5, orbitSpeed: 0.22 },
	tree: { layout: "tree", theme: "neon", brightness: 0.5, bloomStrength: 0.38, bloom: 0.58, threshold: 0.22, veil: 0.22, field: 0.48, shellSize: 1, shellGlow: 0.85, shellBloom: 0.5, shellBloomBlur: 1.5, mist: 0, dust: 0, fieldStars: 0.2, backdrop: true, arms: 2, twist: 3.6, thickness: 1, spread: 1, nodeSize: 1, linkWidth: 0.85, linkColor: "auto", linkOpacity: 0.19, linkBrightness: 1.05, linkCurve: 0.72, showLinks: true, twinkle: 0.5, orbitSpeed: 0.3 }
};

/**
 * Palettes: node hues, nucleus tint, filament tint and the plane
 * colour (`base`) that the canvas, the warp overlay and the star interior share.
 *
 * `solar` is this plugin's own sun-and-planets palette.
 * `hues` are hue sources in degrees; the star sprite derives saturation and
 * lightness, unless `tones` gives a slot its own `[saturation, lightness]` (null =
 * the sprite default). "deepfield" is the Obsidian Galaxy View 哈勃深空 palette
 * (#46d4dc #ffc35c #d05a32 #7fd0a0 #e8d9a0 #5a9bd8 #d87fa8 #9a7fe0 #cfd8e8), its nine
 * colours reordered so cool and warm slots alternate; the tones are read off the
 * rendered reference (after its bloom), not the raw hex.
 */
const THEMES = {
	deepfield: {
		// The first two slots are the owner's picked pair (sampled from their screenshot:
		// teal-cyan ≈180° and amber-gold ≈36°), so those two colours lead the theme.
		hues: [180, 36, 183, 38, 209, 15, 144, 48, 257, 332, 218],
		tones: [null, [0.78, 0.7], null, [0.78, 0.7], null, null, [0.5, 0.68], [0.6, 0.8], [0.66, 0.72], [0.58, 0.7], [0.38, 0.84]],
		nucleus: [235, 240, 238],
		link: [150, 170, 180],
		base: SPACE
	},
	hubble: { hues: [265, 208, 158, 28, 330, 96, 190, 12], nucleus: [255, 246, 226], link: [150, 180, 235], base: SPACE },
	neon: { hues: [190, 300, 150, 50, 265, 330, 175, 210], nucleus: [220, 250, 255], link: [120, 220, 255], base: SPACE },
	sunset: { hues: [22, 342, 46, 300, 10, 40, 320, 355], nucleus: [255, 226, 180], link: [255, 190, 160], base: SPACE },
	cyber: { hues: [175, 285, 320, 200, 240, 300, 160, 265], nucleus: [210, 255, 245], link: [140, 255, 240], base: SPACE },
	// Galaxy View's 黑客帝国 green, read off its 极简 preset: three close greens only, pale bodies.
	matrix: { hues: [104, 98, 112], tones: [[0.85, 0.76], [0.8, 0.72], [0.75, 0.79]], nucleus: [220, 255, 220], link: [120, 255, 160], base: SPACE },
	aurora: { hues: [155, 190, 280, 120, 210, 300, 170, 265], nucleus: [230, 250, 240], link: [170, 240, 220], base: SPACE },
	// 太阳系: planet hues, read left to right — Mercury grey-warm, Earth blue, Mars rust,
	// Saturn gold, Uranus cyan, Neptune deep blue, then two far outliers. The warm
	// nucleus is the sun's own light.
	solar: { hues: [28, 208, 12, 46, 190, 230, 262, 330], tones: [null, null, null, [0.66, 0.76], null, null, null, null], nucleus: [255, 236, 200], link: [255, 205, 150], base: SPACE }
};

const DEFAULT_THEME = "deepfield";

/** Resolve a theme by name, falling back to the default palette. */
function themeOf(name) {
	return THEMES[name] ?? THEMES[DEFAULT_THEME];
}

/** Everything the panel can change, with the shipped defaults. */
const DEFAULTS = {
	settingsVersion: SETTINGS_VERSION,
	preset: "galaxy",
	agentScale: 1,
	agentSpeed: 1,
	agentTrail: 1,
	agentWhiten: 0.62,
	layout: "spiral",
	theme: DEFAULT_THEME,
	/** Body and link strength. */
	brightness: 0.5,
	/** Batched WebGL bodies; off falls back to the Canvas 2D sprites. */
	gpuGlow: true,
	/** Bloom: strength (0 = no halos), radius (halo size), threshold (how bright a body must be to bloom). */
	bloomStrength: 0.38,
	bloom: 0.58,
	threshold: 0.22,
	/** Deep space: nebula veil, shell density/size/brightness, cluster mist, dust lanes, floating field stars, shell on/off. */
	veil: 0.34,
	field: 0.7,
	shellSize: 1,
	shellGlow: 1,
	/** 球壳辉光: the blurred bloom laid over the sky shell (0 = off) and its blur radius in px. */
	shellBloom: 0.5,
	shellBloomBlur: 1.5,
	mist: 0,
	dust: 0,
	fieldStars: 0.25,
	backdrop: true,
	arms: 2,
	twist: 4.3,
	thickness: 1,
	spread: 1,
	/** Look: node size multiplier, twinkle rate (0 = off), what sets a star's mass, palette shuffle. */
	nodeSize: 1,
	/**
	 * Links: drawn at rest (a selection always shows its own links), width multiplier,
	 * opacity, brightness (OKLab lightness: <1 darker, >1 towards white), bow
 * (0 = straight, 1 = the reference's strongest), and colour
	 * ("auto" = the mix of the two endpoint stars, else "#rrggbb").
	 */
	showLinks: true,
	linkWidth: 0.85,
	linkOpacity: 0.19,
	linkBrightness: 1.05,
	linkCurve: 0.72,
	linkColor: "auto",
	twinkle: 0.5,
	sizeBy: "activity",
	colorSeed: 0,
	/** Force layer over the analytic layout (see src/physics.js). */
	repel: 170,
	linkDistance: 55,
	linkStrength: 1.1,
	centerPull: 0.05,
	flatten: 0.55,
	coreGravity: 0.1,
	spiral: 0.02,
	autoOrbit: true,
	orbitSpeed: 0.35,
	tourSpeed: 1,
	selectionDepth: 2,
	quality: "high",
	tour: false,
	language: "auto",
	panelWidth: 300,
	panelSections: {},
	hidden: [],
	only: null,
	orphans: false,
	empty: false,
	lens: null,
	filterText: ""
};

const SIZE_BY = ["activity", "links", "uniform"];
const QUALITIES = ["auto", "high", "low", "mobile"];
const LANGUAGES = ["auto", "zh", "en"];

/** Filter and navigation choices that survive a version migration. */
const PRESERVED_KEYS = ["showLinks", "hidden", "only", "filterText", "lens", "orphans", "empty", "autoOrbit", "tour", "language", "panelWidth", "panelSections", "selectionDepth"];
/**
 * Turn whatever was stored into a usable settings object.
 *
 * @param stored - the parsed JSON (any value; non-objects mean "nothing stored").
 * @returns `{ settings, migrated }`; `migrated` is true when the caller should
 *   write `settings` back (old version upgraded, or a stale isolate pin healed).
 */
function migrateSettings(stored) {
	if (stored === null || typeof stored !== "object" || Array.isArray(stored)) {
		return { settings: { ...DEFAULTS, hidden: [] }, migrated: false };
	}
	const version = Number.isFinite(stored.settingsVersion) ? stored.settingsVersion : 0;
	let merged;
	let migrated = false;
	if (version < SETTINGS_VERSION) {
		merged = { ...DEFAULTS };
		for (const key of PRESERVED_KEYS) {
			if (Object.prototype.hasOwnProperty.call(stored, key)) merged[key] = stored[key];
		}
		merged.settingsVersion = SETTINGS_VERSION;
		migrated = true;
	} else {
		merged = { ...DEFAULTS, ...stored };
	}
	merged.hidden = Array.isArray(merged.hidden) ? merged.hidden.filter((id) => typeof id === "string") : [];
	if (typeof merged.only !== "string") merged.only = null;
	if (typeof merged.filterText !== "string") merged.filterText = "";
	for (const key of Object.keys(DEFAULTS)) {
		if (typeof DEFAULTS[key] === "number" && !Number.isFinite(merged[key])) merged[key] = DEFAULTS[key];
		if (typeof DEFAULTS[key] === "boolean" && typeof merged[key] !== "boolean") merged[key] = DEFAULTS[key];
	}
	if (!LAYOUTS.includes(merged.layout)) merged.layout = DEFAULTS.layout;
	if (!SIZE_BY.includes(merged.sizeBy)) merged.sizeBy = DEFAULTS.sizeBy;
	if (!QUALITIES.includes(merged.quality)) merged.quality = DEFAULTS.quality;
	if (!LANGUAGES.includes(merged.language)) merged.language = DEFAULTS.language;
	if (merged.linkColor !== "auto" && linkColorRgb(merged.linkColor) === null) merged.linkColor = DEFAULTS.linkColor;
	merged.linkWidth = Math.min(4, Math.max(0.2, merged.linkWidth));
	merged.linkBrightness = Math.min(2.5, Math.max(0.3, merged.linkBrightness));
	merged.linkCurve = Math.min(2, Math.max(0, merged.linkCurve));
	merged.selectionDepth = merged.selectionDepth === 1 ? 1 : 2;
	merged.panelWidth = Math.min(480, Math.max(240, merged.panelWidth));
	merged.panelSections =
		merged.panelSections !== null && typeof merged.panelSections === "object" && !Array.isArray(merged.panelSections)
			? Object.fromEntries(Object.entries(merged.panelSections).filter(([, open]) => typeof open === "boolean"))
			: {};
	// 星团 was replaced by 极简 in the same slot.
	if (merged.preset === "clusters" || merged.layout === "clusters") {
		Object.assign(merged, PRESETS.minimal, { preset: "minimal" });
		migrated = true;
	}
	// 球壳 was replaced by 太阳系 in the same slot.
	if (merged.preset === "bubble" || merged.layout === "bubble") {
		Object.assign(merged, PRESETS.system, { preset: "system" });
		migrated = true;
	}
	// 晶格 was replaced by 深空场 in the same slot.
	if (merged.preset === "lattice" || merged.layout === "lattice") {
		Object.assign(merged, PRESETS.deepfield, { preset: "deepfield" });
		migrated = true;
	}
	// "Only this workspace" pointing at a hidden workspace leaves nothing to draw.
	// Both halves are stale (a pin survives the hide), so drop the pin and unhide it.
	if (merged.only !== null && merged.hidden.includes(merged.only)) {
		merged.hidden = merged.hidden.filter((id) => id !== merged.only);
		merged.only = null;
		migrated = true;
	}
	return { settings: merged, migrated };
}

/** A custom link colour as [r, g, b], or null for "auto" and anything that is not "#rrggbb". */
function linkColorRgb(value) {
	const match = typeof value === "string" ? /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(value) : null;
	return match === null ? null : [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
}

		// ── src/graph-model.js ─────────────────────────────────────────
/**
 * Pure galaxy model: workspace/session projection, spiral-arm seeding, camera
 * math and picking. No DOM, no React, no canvas — so it can be checked in Node
 * (scripts/selfcheck.mjs) and embedded in the client bundle by
 * scripts/build.mjs (which strips the `export ` keywords).
 *
 * The look follows the "cinematic 3D graph" school (Obsidian's Galaxy View):
 * a flattened spiral disc seen through a perspective camera, luminous nodes,
 * faint filaments, slow rotation.
 */

const TAU = Math.PI * 2;
/** Spiral arms. Two arms with a long twist read as a galaxy; three look bushy. */
const ARMS = 2;
/** How far an arm follows out; controls how tightly the arms coil. */
const TWIST = 4.3;
/** Shape knobs the control panel exposes (arms / twist / thickness / spread). */
const SHAPE = { arms: ARMS, twist: TWIST, thickness: 1, spread: 1 };
/** Hue ring for workspace stars; a workspace keeps one hue for its whole life. */
const HUES = [180, 36, 265, 208, 158, 330, 96, 190, 12];
/** Spokes drawn from one workspace to its conversations; older ones keep their body, not the wire. */
const SPOKE_CAP = 32;

/** Stable string hash (FNV-1a) → [0,1). Deterministic seeding per node id. */
function hash01(text) {
	let value = 2166136261;
	for (let index = 0; index < text.length; index += 1) {
		value ^= text.charCodeAt(index);
		value = Math.imul(value, 16777619);
	}
	return (value >>> 0) / 4294967296;
}

/** Last path segment of a workspace path. */
function basename(path) {
	if (typeof path !== "string" || path === "") return "";
	const parts = path.split(/[\\/]+/).filter((part) => part !== "" && part !== ".");
	return parts.length === 0 ? path : parts[parts.length - 1];
}

/** Milliseconds of an ISO timestamp, or 0. */
function timeOf(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value !== "string") return 0;
	const parsed = Date.parse(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Project the client stores into galaxy members.
 *
 * Folders are Host Workspaces; sessions hang off the workspace that owns them.
 * A session no workspace claims is attached by exact `cwd` when possible and
 * otherwise to a per-directory folder, so nothing silently disappears.
 *
 * @param workspaces - `workspaces.list` snapshot (`items`, `archivedSessionIds`).
 * @param sessions - `sessions.list` snapshot (`ids`, `byId`).
 * @param options - `{ showArchived, hidden, only, showOrphans, showEmpty, filter }`;
 *   `filter` uses the {@link parseFilter} syntax and drops conversations that fail it.
 * @returns `{ nodes, links, stats }`; node ids are `ws:<id>` or the session id.
 */
function buildGraph(workspaces, sessions, options) {
	const showArchived = options?.showArchived === true;
	const hidden = options?.hidden instanceof Set ? options.hidden : new Set(Array.isArray(options?.hidden) ? options.hidden : []);
	const only = typeof options?.only === "string" && options.only !== "" ? options.only : null;
	const showOrphans = options?.showOrphans === true;
	const showEmpty = options?.showEmpty === true;
	const filter = parseFilter(options?.filter);
	const blockedPaths = new Set();
	const items = Array.isArray(workspaces?.items) ? workspaces.items : [];
	const summaries = sessions?.byId !== undefined && sessions?.byId !== null ? sessions.byId : {};
	const archived = new Set(Array.isArray(workspaces?.archivedSessionIds) ? workspaces.archivedSessionIds : []);
	const now = Date.now();
	const nodes = [];
	const links = [];
	const folders = [];
	const claimed = new Set();
	const folderByPath = new Map();

	const addFolder = (workspace) => {
		const node = {
			id: `ws:${workspace.workspaceId}`,
			kind: "folder",
			workspaceId: workspace.workspaceId,
			label: typeof workspace.title === "string" && workspace.title !== "" ? workspace.title : basename(workspace.path),
			path: typeof workspace.path === "string" ? workspace.path : "",
			hue: HUES[folders.length % HUES.length],
			hueIndex: folders.length,
			count: 0,
			spokes: 0,
			orphan: false,
			order: folders.length,
			index: nodes.length
		};
		folders.push(node);
		nodes.push(node);
		if (node.path !== "") folderByPath.set(node.path, node);
		return node;
	};

	const addSession = (summary, folder) => {
		if (filter !== null) {
			const label = typeof summary.displayTitle === "string" && summary.displayTitle !== "" ? summary.displayTitle : summary.id;
			const fields = {
				name: `${label} ${typeof summary.title === "string" ? summary.title : ""} ${folder?.label ?? ""}`,
				path: `${typeof summary.cwd === "string" ? summary.cwd : ""} ${folder?.path ?? ""}`
			};
			if (!filterAccepts(filter, fields)) return null;
		}
		const updatedAt = timeOf(summary.updatedAt);
		const ageDays = updatedAt === 0 ? 30 : Math.max(0, (now - updatedAt) / 86400000);
		const recency = Math.max(0, 1 - Math.log10(ageDays + 1) / 2.2);
		const node = {
			id: summary.id,
			kind: "session",
			label: typeof summary.displayTitle === "string" && summary.displayTitle !== "" ? summary.displayTitle : summary.id,
			title: typeof summary.title === "string" ? summary.title : "",
			cwd: typeof summary.cwd === "string" ? summary.cwd : "",
			parentId: typeof summary.parentId === "string" ? summary.parentId : "",
			running: summary.running === true,
			archived: archived.has(summary.id),
			blank: summary.blank === true,
			current: (summary.retainedBy?.mainView ?? 0) > 0,
			updatedAt,
			recency,
			hue: folder === undefined ? HUES[0] : folder.hue,
			hueIndex: folder === undefined ? 0 : folder.hueIndex,
			folderId: folder === undefined ? "" : folder.id,
			index: nodes.length
		};
		nodes.push(node);
		claimed.add(summary.id);
		if (folder !== undefined) {
			// A sun with eighty conversations does not need eighty spokes: past SPOKE_CAP the
			// oldest ones drop their wire (the body stays). The overview reads as clusters
			// instead of a starburst, and 聚焦 still reaches every star through the selection.
			if (folder.spokes < SPOKE_CAP) {
				folder.spokes += 1;
				links.push({ a: folder.index, b: node.index, kind: "member" });
			}
			folder.count += 1;
		}
		return node;
	};

	for (const workspace of items) {
		if (workspace === null || typeof workspace !== "object") continue;
		if (only !== null && workspace.workspaceId !== only) {
			if (typeof workspace.path === "string") blockedPaths.add(workspace.path);
			continue;
		}
		if (hidden.has(workspace.workspaceId) || hidden.has(`ws:${workspace.workspaceId}`)) {
			if (typeof workspace.path === "string") blockedPaths.add(workspace.path);
			continue;
		}
		const folder = addFolder(workspace);
		const sessionIds = Array.isArray(workspace.sessionIds) ? workspace.sessionIds : [];
		for (const sessionId of sessionIds) {
			const summary = summaries[sessionId];
			if (summary === undefined || summary === null || claimed.has(sessionId)) continue;
			if (archived.has(sessionId) && !showArchived) continue;
			addSession(summary, folder);
		}
	}

	const ids = Array.isArray(sessions?.ids) ? sessions.ids : [];
	for (const sessionId of ids) {
		const summary = summaries[sessionId];
		if (summary === undefined || summary === null || claimed.has(sessionId)) continue;
		if (archived.has(sessionId) && !showArchived) continue;
		const cwd = typeof summary.cwd === "string" ? summary.cwd : "";
		let folder = folderByPath.get(cwd);
		if (folder === undefined) {
			// Sessions that no workspace claims only become a sun when asked for;
			// ones whose workspace was filtered out stay hidden with it.
			if (!showOrphans || only !== null || cwd === "" || blockedPaths.has(cwd)) continue;
			folder = addFolder({ workspaceId: `cwd:${cwd}`, path: cwd, title: basename(cwd) || cwd });
			folder.orphan = true;
		}
		if (only !== null && folder.workspaceId !== only) continue;
		if (hidden.has(folder.workspaceId) || hidden.has(folder.id)) continue;
		addSession(summary, folder);
	}

	if (!showEmpty) {
		const keep = nodes.filter((node) => node.kind !== "folder" || node.count > 0);
		if (keep.length !== nodes.length) {
			const remap = new Map(keep.map((node) => [nodes.indexOf(node), keep.indexOf(node)]));
			const keptLinks = [];
			for (const link of links) {
				if (!remap.has(link.a) || !remap.has(link.b)) continue;
				keptLinks.push({ ...link, a: remap.get(link.a), b: remap.get(link.b) });
			}
			nodes.length = 0;
			keep.forEach((node, position) => {
				node.index = position;
				nodes.push(node);
			});
			links.length = 0;
			keptLinks.forEach((link) => links.push(link));
		}
	}

	// Session → parent session edges (fork / subagent lineage), only between drawn stars.
	const byId = new Map(nodes.map((node) => [node.id, node]));
	for (const node of nodes) {
		if (node.kind !== "session" || node.parentId === "") continue;
		const parent = byId.get(node.parentId);
		if (parent === undefined || parent.kind !== "session") continue;
		links.push({ a: parent.index, b: node.index, kind: "lineage", faint: true });
	}

	// Palette slots go by size, as in Galaxy View's assignFolderHues: the busiest
	// workspaces take the first, most distinct colours; ties keep workspace order.
	nodes
		.filter((node) => node.kind === "folder")
		.sort((left, right) => right.count - left.count || left.order - right.order)
		.forEach((folder, rank) => {
			folder.hueIndex = rank;
			folder.hue = HUES[rank % HUES.length];
		});
	for (const node of nodes) {
		if (node.kind !== "session" || node.folderId === "") continue;
		const folder = byId.get(node.folderId);
		if (folder === undefined) continue;
		node.hueIndex = folder.hueIndex;
		node.hue = folder.hue;
	}

	const sessionCount = nodes.reduce((total, node) => total + (node.kind === "session" ? 1 : 0), 0);
	const drawnFolders = nodes.reduce((total, node) => total + (node.kind === "folder" ? 1 : 0), 0);
	const allSessions = Object.keys(summaries).length;
	return {
		nodes,
		links,
		stats: { folders: drawnFolders, sessions: sessionCount, hiddenFolders: Math.max(0, items.length - drawnFolders), totalSessions: allSessions }
	};
}



/** Every silhouette the galaxy can take. A preset is mostly this choice. */
const LAYOUTS = ["spiral", "rings", "field", "system", "helix", "web", "plate", "tree", "memory", "sphere"];

/**
 * Spiral arms run from SPIRAL_INNER to SPIRAL_OUTER. The inner radius keeps the core
 * sparse (only faint dust reaches the middle); radius grows with √t so stars spread
 * evenly by arc length instead of crowding the short inner turns.
 */
const SPIRAL_INNER = 0.36;
const SPIRAL_OUTER = 1;
const RING_RADII = [0.34, 0.56, 0.78, 1];
/**
 * 浑天: an armillary sphere. `SPHERE_CIRCLES` rings of the same radius, each tilted to its own
 * plane — concentric about the centre, their union a ball — and each spinning inside its own
 * plane. That is what "同心圆环，各自旋转一定角度，形成球" looks like in 3D.
 */
const SPHERE_RADIUS = 1;
const SPHERE_CIRCLES = 5;
/** One orthonormal pair (u, v) per ring: the plane it lies in. */
const SPHERE_PLANES = (() => {
	const norm = ([x, y, z]) => {
		const length = Math.hypot(x, y, z) || 1;
		return [x / length, y / length, z / length];
	};
	const cross = ([ax, ay, az], [bx, by, bz]) => [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
	const rotate = (vector, axis, angle) => {
		const [x, y, z] = vector;
		const [ux, uy, uz] = axis;
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const dot = x * ux + y * uy + z * uz;
		return [
			x * cos + (uy * z - uz * y) * sin + ux * dot * (1 - cos),
			y * cos + (uz * x - ux * z) * sin + uy * dot * (1 - cos),
			z * cos + (ux * y - uy * x) * sin + uz * dot * (1 - cos)
		];
	};
	const golden = Math.PI * (3 - Math.sqrt(5));
	const planes = [];
	for (let ring = 0; ring < SPHERE_CIRCLES; ring += 1) {
		// Start from a ring in the XZ plane, tilt it by its own share of the golden angle, then
		// swing the whole plane about Y, so no two rings share a plane.
		const tilt = (ring * golden) / 2;
		const swing = (ring * TAU) / SPHERE_CIRCLES;
		const u = rotate([1, 0, 0], [0, 1, 0], swing);
		const v = rotate([0, 1, 0], [0, 1, 0], swing);
		const uu = norm(rotate(u, norm(cross(u, v)), tilt));
		const vv = norm(rotate(v, norm(cross(u, v)), tilt));
		planes.push([uu, vv]);
	}
	return planes;
})();
/** Radians per second for the innermost→outermost ring's own spin (alternating direction). */
const SPHERE_ORBIT = 0.035;
const HELIX_RADIUS = 0.66;
const HELIX_HEIGHT = 1.4;
const HELIX_TURNS = 1.6;
/** Plate: a cube of cells, half-width so the corner cells sit near radius 1. */
const CUBE_HALF = 0.6;

/**
 * 星树: the main limbs. Two per arm (2–8), spread over the whole sphere on a golden
 * spiral so the tree reaches every side. Each main limb carries a fan of workspace
 * limbs, which is what closes the empty gaps a handful of spokes used to leave.
 */
function treeSectors(arms) {
	return Math.max(2, Math.min(8, Math.round(arms ?? 2) * 2));
}

function treeDirection(branch, branches) {
	const lift = 1 - (2 * (branch + 0.5)) / branches;
	const ring = Math.sqrt(Math.max(0, 1 - lift * lift));
	// Even azimuths, stratified heights: golden-angle azimuths on four limbs leave one
	// horizontal axis long and the other short, which shows as a tree that leans.
	const turn = (branch / branches) * TAU;
	return { x: Math.cos(turn) * ring, y: lift, z: Math.sin(turn) * ring };
}

/**
 * 星树 layout: one limb per workspace, fanned off a main limb so a handful of limbs read
 * as a tree instead of a dozen equal spokes with bare sky between them. Main limbs are
 * dealt the workspaces by *mass* (heaviest first, round-robin), so the busiest
 * workspaces land on different mains instead of piling onto the two equatorial ones —
 * which is what made the tree look flat and lopsided.
 *
 * @param folders - the galaxy's workspaces, each with its `count` of conversations.
 * @returns `[{ direction, tangent, bitangent, sector, slot }]` per folder, in folder order.
 */
function treePlan(folders, arms, salt) {
	// 星树 is a pure starburst now: every workspace gets its own ray out of the common centre,
	// spread over the sphere by the golden angle, so nothing is fanned off a "main limb" any
	// more — the limbs all leave the origin and the heaviest ones simply reach further.
	const plan = new Array(folders.length);
	const golden = Math.PI * (3 - Math.sqrt(5));
	folders.forEach((folder, index) => {
		// Golden-spiral directions: even over the sphere for any count, no leaning axis.
		const lift = 1 - (2 * (index + 0.5)) / Math.max(1, folders.length);
		const ring = Math.sqrt(Math.max(0, 1 - lift * lift));
		const turn = index * golden + (hash01(`${folder.id}:ray${salt}`) - 0.5) * 0.18;
		const direction = normalize({ x: Math.cos(turn) * ring, y: lift, z: Math.sin(turn) * ring });
		const frame = treeFrame(direction);
		plan[index] = { direction, tangent: frame.tangent, bitangent: frame.bitangent, sector: index, slot: 0 };
	});
	return plan;
}

/**
 * 巡飞的 Agent: a session that is working right now leaves its seat and circles the outside of the
 * shell — a tilted great circle at AGENT_ORBIT × the shell radius, so it reads as "working, above
 * everything else" instead of as one more dot in a cluster. Blinking is the client's job (it owns
 * the frame clock); this only moves the body.
 */
const GOLDEN_ANGLE = 2.399963229728653;
const AGENT_ORBIT = 1.16;
const AGENT_SPEED = 0.42;

/**
 * 每颗一个轨道面: each agent gets its own great circle, rotated by two index-derived angles, so two
 * working sessions never share a plane and cannot cross at the same point.
 */
function agentPlane(node) {
	const tilt = 0.42;
	const baseU = { x: Math.cos(tilt), y: Math.sin(tilt), z: 0 };
	const raw = { x: -Math.sin(tilt) * 0.34, y: Math.cos(tilt) * 0.34, z: 0.94 };
	const length = Math.hypot(raw.x, raw.y, raw.z);
	const baseV = { x: raw.x / length, y: raw.y / length, z: raw.z / length };
	const index = node.index ?? 0;
	// Two independent rotations: the plane's roll and its inclination.
	const roll = index * GOLDEN_ANGLE;
	const incline = (index * 1.7) % Math.PI;
	const rotateZ = (v, a) => ({ x: v.x * Math.cos(a) - v.y * Math.sin(a), y: v.x * Math.sin(a) + v.y * Math.cos(a), z: v.z });
	const tiltAroundX = (v, a) => ({ x: v.x, y: v.y * Math.cos(a) - v.z * Math.sin(a), z: v.y * Math.sin(a) + v.z * Math.cos(a) });
	return { u: rotateZ(baseU, roll), v: rotateZ(baseV, roll) };
}

function agentBasis() {
	// One shared tilted plane for every travelling agent: they pass each other instead of
	// crossing at random angles, which is what makes the ring read as a track.
	const tilt = 0.42;
	const u = { x: Math.cos(tilt), y: Math.sin(tilt), z: 0 };
	// Orthogonal to u, then normalised, so the track is an exact circle rather than a slight oval.
	const raw = { x: -Math.sin(tilt) * 0.34, y: Math.cos(tilt) * 0.34, z: 0.94 };
	const length = Math.hypot(raw.x, raw.y, raw.z);
	return { u, v: { x: raw.x / length, y: raw.y / length, z: raw.z / length } };
}

/**
 * How busy one working agent is, 0…1: a session that wrote 2 s ago is producing, one that has
 * not moved for a minute is waiting on something. Speed and light follow this, so a stalled
 * agent crawls dimly and a busy one laps quickly and bright.
 */
function agentBusyness(node, now) {
	const idleSeconds = Math.max(0, (now - (node.updatedAt ?? 0)) / 1000);
	// A session that is still `running` is working even when it has been quiet for minutes (a long
	// build, a big edit): it keeps most of its light. Only an idle session decays on the 30 s curve.
	const decay = node.running === true ? 240 : 30;
	const activity = 1 / (1 + idleSeconds / decay);
	return Math.max(0, Math.min(1, 0.3 + 0.7 * activity));
}

/**
 * 回归: when an agent stops working it glides from the track back to its seat instead of
 * teleporting. `RETURN_SECONDS` is short enough to read as "done" and long enough to follow the
 * body; the position is an ease-out so it arrives softly, not braking at the last frame.
 */
const RETURN_SECONDS = 1.2;
const LAUNCH_SECONDS = 1.6;
/** Acceleration (world units/s²) at which the soft body is fully stretched. */
const AGENT_ACCEL_SOFT = 0.9;
/** Seconds for the tail to grow to full length behind the body. */
const AGENT_TAIL_GROW = 0.9;
/** Seconds on the lane before the tail starts recording (the owner wanted it later). */
const AGENT_TAIL_DELAY = 3.5;
/** How far the lane angle leads during the exit, in radians. */
const LAUNCH_LEAD = 0.12;

/**
 * 出发: the flight out. The agent glides from its seat onto the track instead of appearing there —
 * which is also what gives the exit its stretch, the same way the return does.
 */
function startAgentLaunch(node, seconds, peers = [], shellRadius = 1) {
	node.launchFrom = node.seat ?? { x: node.x, y: node.y, z: node.z };
	node.launchAt = seconds;
	// 起步点: hash of the id, pushed to the emptiest slot when another agent is already out.
	node.agentPhase = agentPhaseFor(node, peers);
	node.agentAngle = node.agentPhase;
	// The lane point is frozen HERE. Recomputing it per frame made the target drift while the body
	// chased it — the sudden bend in the exit.
	const { u, v } = agentPlane(node);
	const angle = node.agentAngle + LAUNCH_LEAD;
	const radius = shellRadius * AGENT_ORBIT;
	node.launchTo = {
		x: (u.x * Math.cos(angle) + v.x * Math.sin(angle)) * radius,
		y: (u.y * Math.cos(angle) + v.y * Math.sin(angle)) * radius,
		z: (u.z * Math.cos(angle) + v.z * Math.sin(angle)) * radius
	};
	// 从座位开始: a new flight starts with an empty tail, so nothing is drawn before the body moves.
	// 拖尾 starts empty: the first sample is the seat itself, taken the moment the body moves.
	node.agentTrail = [];
	node.agentTail = 0;
}

function stepAgentLaunches(galaxy, seconds, shellRadius) {
	if (galaxy === null) return;
	const radius = shellRadius * AGENT_ORBIT;
	for (const node of galaxy.nodes) {
		if (node.launchFrom === undefined) continue;
		const { u, v } = agentPlane(node);
		const t = Math.min(1, (seconds - node.launchAt) / LAUNCH_SECONDS);
		// Smootherstep: zero velocity AND zero acceleration at both ends, so the exit starts and lands
		// without the little kick smoothstep gives at the handoff.
		const ease = t * t * t * (t * (t * 6 - 15) + 10);
		// The lane angle leads a little during the flight, so the handoff to orbitAgents is continuous
		// instead of the body arriving at a stale angle and then jumping to the integrated one.
		const lane = node.agentAngle ?? (node.agentPhase ?? 0);
		const angle = lane + (LAUNCH_LEAD * ease);
		const target = {
			x: (u.x * Math.cos(angle) + v.x * Math.sin(angle)) * radius,
			y: (u.y * Math.cos(angle) + v.y * Math.sin(angle)) * radius,
			z: (u.z * Math.cos(angle) + v.z * Math.sin(angle)) * radius
		};
		const from = node.launchFrom;
		const at = spiralLeg(from, target, ease, LAUNCH_SECONDS);
		node.x = at.x;
		node.y = at.y;
		node.z = at.z;
		// 水滴形: fastest in the middle of the flight, which is exactly where it stretches most.
		// 软体 in the exit: the drop deforms with how fast it is travelling along the path, and with
		// the progress so the middle of the flight is the most stretched.
		const moved = node.agentPrev === undefined ? 0 : Math.hypot(node.x - node.agentPrev.x, node.y - node.agentPrev.y, node.z - node.agentPrev.z);
		node.agentStretch = Math.max(Math.min(0.55, moved * 60), Math.sin(Math.PI * t) * 0.55);
		if (t >= 1) {
			node.launchFrom = undefined;
			node.launchAt = undefined;
			node.launchTo = undefined;
			node.agentOrbit = true;
			// Continue the lap from exactly where the body landed.
			node.agentAngle = (node.agentPhase ?? 0) + LAUNCH_LEAD;
			node.agentAt = seconds;
			node.agentStretch = 0.06;
			// 上轨之后才生成尾焰: the tail begins here, empty, and grows as the lap records.
			node.agentTrail = [];
			node.agentTail = 0;
			node.agentLaneSince = seconds;
		}
		// No tail on the way out (the owner asked for it to start once the body is on the lane): the
		// launch records nothing, and the handoff opens an empty one.
	}
}

function startAgentReturn(node, seconds, from = null) {
	// The lap's history is dropped here: keeping it drew a straight chord from the lane to the seat,
	// which read as the tail suddenly fanning out.
	node.agentTrail = [];
	node.agentTail = 0;
	// A session can finish while the body is still climbing out; the return then starts from that
	// point instead of being skipped (which left the body to pop back onto its seat).
	node.launchFrom = undefined;
	node.launchAt = undefined;
	// `from` lets a caller hand over where the body actually was: after a graph rebuild the node
	// object sits at its layout seat again, so its own x/y/z is not the track.
	node.returningFrom = from ?? { x: node.x, y: node.y, z: node.z };
	node.returningTo = node.seat ?? { x: node.x, y: node.y, z: node.z };
	node.returningAt = seconds;
	node.agentOrbit = false;
}

function stepAgentReturns(galaxy, seconds) {
	if (galaxy === null) return;
	for (const node of galaxy.nodes) {
		if (node.returningFrom === undefined) continue;
		const t = Math.min(1, (seconds - node.returningAt) / RETURN_SECONDS);
		const ease = 1 - Math.pow(1 - t, 3);
		const from = node.returningFrom;
		const to = node.returningTo;
		const at = spiralLeg(from, to, ease, RETURN_SECONDS);
		node.x = at.x;
		node.y = at.y;
		node.z = at.z;
		// 水滴形 on the way home: the same sin curve, so entry and exit match.
		// 变回原形: the drop relaxes as it lands instead of arriving still stretched.
		node.agentStretch = Math.sin(Math.PI * t) * 0.55;
		recordAgentTrail(node, seconds);
		if (t >= 1) {
			node.agentTail = 0;
			node.agentTrail = undefined;
			node.agentStretch = 0;
			node.agentBusy = undefined;
			node.agentQuietSince = undefined;
			node.agentSeenUpdatedAt = undefined;
			node.returningFrom = undefined;
			node.returningTo = undefined;
			node.returningAt = undefined;
			node.seat = undefined;
			delete node.agentBusy;
		}
	}
}


/**
 * 拖尾 history. The array starts EMPTY when a flight begins and every sample is a position the body
 * has already occupied, so the drawn path can only ever trail behind it — a tail can never appear
 * before the body, and nothing survives from a previous flight.
 */
const AGENT_TRAIL_KEEP_SECONDS = 3;

function recordAgentTrail(node, seconds) {
	// 尾焰生成时间延后: nothing is recorded before the body is on the lane, nor in its first
	// AGENT_TAIL_DELAY seconds there. A rebuilt node loses the stamp, so adopt one lazily —
	// otherwise the recorder would bail forever and the tail would never appear.
	if (node.agentLaneSince === undefined) {
		if (node.agentOrbit !== true) return;
		node.agentLaneSince = seconds;
	}
	if (seconds - node.agentLaneSince < AGENT_TAIL_DELAY) return;
	const trail = node.agentTrail ?? (node.agentTrail = []);
	const last = trail[trail.length - 1];
	if (last === undefined || Math.hypot(node.x - last.x, node.y - last.y, node.z - last.z) > 0.002) {
		trail.push({ x: node.x, y: node.y, z: node.z, t: seconds });
	}
	// Bound the buffer by age: the renderer picks its own window, this only stops it growing.
	while (trail.length > 2 && trail[0].t < seconds - AGENT_TRAIL_KEEP_SECONDS) trail.shift();
}

/**
 * 螺旋飞行: one leg of an agent's trip, solved as a body under drag with conserved angular momentum.
 *   r(t)  = r0 · e^(λt)              λ > 0 climbs out, λ < 0 spirals home
 *   θ'(t) = L / r²                   so it sweeps faster where the radius is small
 * The direction rolls on the great-circle plane through both endpoints and lands exactly on `to`.
 * @returns `{ x, y, z }` at progress `t` (0…1 over `seconds`).
 */
function spiralLeg(from, to, t, seconds) {
	const radiusFrom = Math.hypot(from.x, from.y, from.z);
	const radiusTo = Math.hypot(to.x, to.y, to.z);
	if (!(radiusFrom > 1e-3) || !(radiusTo > 1e-3) || seconds <= 0 || Math.abs(Math.log(radiusTo / radiusFrom)) < 1e-6) {
		// No usable direction or no radial travel: a straight ease is the only sensible answer.
		return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t, z: from.z + (to.z - from.z) * t };
	}
	const lambda = Math.log(radiusTo / radiusFrom) / seconds;
	const radius = radiusFrom * Math.exp(lambda * t * seconds);
	const fromDir = normalise(from);
	const toDir = normalise(to);
	const dot = Math.max(-1, Math.min(1, fromDir.x * toDir.x + fromDir.y * toDir.y + fromDir.z * toDir.z));
	const total = Math.acos(dot);
	// Normalised sweep: the ∫e^(∓2λt) from 0 to t over the same integral to `seconds`.
	const spread = 1 - Math.exp(-2 * lambda * t * seconds);
	const spreadEnd = 1 - Math.exp(-2 * lambda * seconds) || 1;
	const sweep = spread / spreadEnd;
	let dir = fromDir;
	if (total > 1e-4) {
		const cross = { x: fromDir.y * toDir.z - fromDir.z * toDir.y, y: fromDir.z * toDir.x - fromDir.x * toDir.z, z: fromDir.x * toDir.y - fromDir.y * toDir.x };
		const crossLength = Math.hypot(cross.x, cross.y, cross.z);
		if (crossLength > 1e-6) {
			const n = { x: cross.x / crossLength, y: cross.y / crossLength, z: cross.z / crossLength };
			const side = { x: n.y * fromDir.z - n.z * fromDir.y, y: n.z * fromDir.x - n.x * fromDir.z, z: n.x * fromDir.y - n.y * fromDir.x };
			const phi = total * sweep;
			dir = {
				x: fromDir.x * Math.cos(phi) + side.x * Math.sin(phi),
				y: fromDir.y * Math.cos(phi) + side.y * Math.sin(phi),
				z: fromDir.z * Math.cos(phi) + side.z * Math.sin(phi)
			};
		}
	}
	return { x: dir.x * radius, y: dir.y * radius, z: dir.z * radius };
}

/** Unit vector of a point, safe at the origin. */
function normalise(point) {
	const length = Math.hypot(point.x, point.y, point.z) || 1;
	return { x: point.x / length, y: point.y / length, z: point.z / length };
}


/**
 * 起步点随机: the phase comes from a hash of the session id, then — when other agents are already
 * flying — it is nudged to the one of twelve slots whose nearest neighbour is furthest away, so two
 * starts can never land on the same point of the lane.
 */
function agentPhaseFor(node, peers = []) {
	const base = hash01(`agent-phase:${node.id ?? ""}`) * TAU;
	const taken = peers
		.filter((peer) => peer !== node && peer.id !== node.id)
		.map((peer) => peer.agentAngle ?? peer.agentPhase)
		.filter((angle) => typeof angle === "number");
	if (taken.length === 0) return base;
	const gapTo = (angle) => Math.min(...taken.map((other) => Math.abs(Math.atan2(Math.sin(angle - other), Math.cos(angle - other)))));
	let best = base;
	let bestGap = gapTo(base);
	for (let slot = 1; slot < 12; slot += 1) {
		const candidate = base + (slot / 12) * TAU;
		const gap = gapTo(candidate);
		if (gap > bestGap) {
			bestGap = gap;
			best = candidate;
		}
	}
	return best;
}

function orbitAgents(galaxy, seconds, shellRadius, now = Date.now(), speedScale = 1) {
	if (galaxy === null || !(shellRadius > 0)) return;
	const radius = shellRadius * AGENT_ORBIT;
	for (const node of galaxy.nodes) {
		if (node.running !== true || node.launchFrom !== undefined) continue;
		const { u, v } = agentPlane(node);
		// The phase comes from the node's index, spread by the golden angle — a hash of the id
		// put two agents 0.004 rad apart when their ids ended in the same letter.
		if (node.agentPhase === undefined) node.agentPhase = agentPhaseFor(node, galaxy.nodes);
		// 忙碌程度: drives both how fast it laps and how bright its pulse is.
		const raw = agentBusyness(node, now);
		// Low-passed: `updatedAt` moves in bursts, and feeding the raw value to the tail's window made
		// it jump between lengths every second — the tail looked broken up. (Smoothing uses the frame
		// delta, which is computed a few lines down; the previous frame's is kept on the node.)
		const frameDelta = Math.min(0.1, Math.max(0, seconds - (node.agentAt ?? seconds)));
		// ~2.5 s time constant: brightness drifts with the work, it does not flicker with each write.
		const smoothing = node.agentBusy === undefined ? 1 : 1 - Math.exp(-frameDelta / 2.5);
		node.agentBusy = node.agentBusy === undefined ? raw : node.agentBusy + (raw - node.agentBusy) * smoothing;
		const busy = node.agentBusy;
		// The seat it leaves: the return animation glides back to this, not to a re-laid-out spot.
		if (node.seat === undefined) node.seat = { x: node.x, y: node.y, z: node.z };
		// 匀速: the angle is INTEGRATED, not recomputed as `phase + t · speed`. With a variable speed
		// (it follows 忙碌程度, which changes as the session writes) multiplying the whole elapsed
		// time made the body jump ahead or backwards whenever the rate changed — the uneven lap.
		if (node.agentAngle === undefined) node.agentAngle = node.agentPhase;
		const dt = Math.min(0.1, Math.max(0, seconds - (node.agentAt ?? seconds)));
		node.agentAt = seconds;
		const targetSpeed = AGENT_SPEED * (0.55 + 0.9 * busy) * speedScale;
		node.agentSpeed = node.agentSpeed === undefined ? targetSpeed : node.agentSpeed + (targetSpeed - node.agentSpeed) * Math.min(1, dt * 3);
		node.agentAngle += dt * node.agentSpeed;
		const angle = node.agentAngle;
		// 软体/屋顶效果: the drop deforms with ACCELERATION — a body that starts moving, turns or speeds
		// up stretches along its motion; a steady cruise relaxes back to round.
		// A rebuild can drop the previous position for one frame. Treating that as "speed 0" produced a
		// huge acceleration spike, which snapped the drop — that was the flicker. With no previous
		// frame the shape keeps its current value, and every change is slew-limited.
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		node.x = (u.x * cos + v.x * sin) * radius;
		node.y = (u.y * cos + v.y * sin) * radius;
		node.z = (u.z * cos + v.z * sin) * radius;
		node.agentOrbit = true;
		// The shape is measured AFTER the move: comparing the previous position with the new one is the
		// only way to see real speed and acceleration. (Measured before it, every frame read 0 and the
		// drop never deformed.)
		// Vector acceleration, not just |Δspeed|: a body circling at a constant speed is still
		// accelerating towards the centre, which is what keeps the drop softly stretched on the lane.
		const havePrevious = node.agentPrev !== undefined && node.agentVel !== undefined && dt > 0;
		const velocityOf = (to, from) => ({
			x: (to.x - from.x) / dt,
			y: (to.y - from.y) / dt,
			z: (to.z - from.z) / dt
		});
		let accel = 0;
		if (dt > 0) {
			const vel = node.agentPrev === undefined ? { x: 0, y: 0, z: 0 } : velocityOf(node, node.agentPrev);
			if (havePrevious) accel = Math.hypot(vel.x - node.agentVel.x, vel.y - node.agentVel.y, vel.z - node.agentVel.z) / dt;
			node.agentVel = vel;
		}
		const current = node.agentStretch ?? 0.06;
		const targetStretch = havePrevious ? 0.06 + 0.94 * Math.min(1, accel / AGENT_ACCEL_SOFT) : current;
		// Hard ceiling as well as a time-based rate: a long frame (or a paused tab) must not allow a
		// big shape jump in one step.
		const slew = Math.min(0.08, Math.max(0.02, dt * 2.5));
		node.agentStretch = current + Math.max(-slew, Math.min(slew, targetStretch - current));
			node.agentTail = Math.min(1, (node.agentTail ?? 0) + dt / AGENT_TAIL_GROW);
		// Recorded last, so the newest sample is exactly where the body is: the path can only extend
		// backwards from it.
		recordAgentTrail(node, seconds);
	}
}

/** Two unit vectors perpendicular to a spoke, for forks and twigs. */
function treeFrame(direction) {
	const tangent = normalize(cross(direction, Math.abs(direction.y) > 0.95 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 }));
	return { tangent, bitangent: cross(direction, tangent) };
}

/**
 * The 极简 web's silhouette: a ball squashed and leaned so it reads as an irregular
 * body (wide and tall, shallow, one shoulder raised) rather than a perfect sphere.
 * Shallow depth keeps the projected density even instead of piling up in the middle.
 */
function webBody(x, y, z, thickness) {
	const bulge = 1 + 0.22 * Math.sin(x * 3.1 + 0.6) * Math.cos(z * 2.3);
	return { x: x * 1.18 * bulge, y: (y * 1.24 + x * 0.24) * Math.min(1.4, thickness), z: z * 0.62 * bulge };
}

/** Cells per cube edge: at least 2, enough that side³ holds every sun. */
function cubeSide(count) {
	return Math.max(2, Math.ceil(Math.cbrt(Math.max(1, count))));
}

/** Interleave the bits of a cell's x/y/z (Z-order), so a run of consecutive codes is a compact block. */
function mortonCode(x, y, z) {
	let code = 0;
	for (let bit = 0; bit < 10; bit += 1) code += (((x >> bit) & 1) + ((y >> bit) & 1) * 2 + ((z >> bit) & 1) * 4) * 8 ** bit;
	return code;
}

/**
 * 方阵: every star (suns and conversations alike) on one side³ lattice filling the
 * cube. Cells are walked in Z-order and each workspace takes a consecutive run, so
 * a workspace reads as a solid block of the cube with its sun in the middle of it.
 * @returns cells per edge, for the dust grid.
 */
function latticeCube(nodes, folders, thickness) {
	const order = [];
	const bySun = new Map(folders.map((folder) => [folder.id, []]));
	const loose = [];
	for (const node of nodes) {
		if (node.kind !== "session") continue;
		(bySun.get(node.folderId) ?? loose).push(node);
	}
	for (const folder of folders) {
		const members = bySun.get(folder.id).sort((left, right) => right.updatedAt - left.updatedAt);
		const middle = Math.floor(members.length / 2);
		order.push(...members.slice(0, middle), folder, ...members.slice(middle));
	}
	order.push(...loose);
	const side = cubeSide(order.length);
	const cells = [];
	for (let z = 0; z < side; z += 1) for (let y = 0; y < side; y += 1) for (let x = 0; x < side; x += 1) cells.push([x, y, z]);
	cells.sort((left, right) => mortonCode(...left) - mortonCode(...right));
	const cell = (2 * CUBE_HALF) / (side - 1);
	const lift = Math.min(1.5, thickness);
	order.forEach((node, index) => {
		const [x, y, z] = cells[Math.min(cells.length - 1, Math.floor(((index + 0.5) * cells.length) / order.length))];
		node.x = x * cell - CUBE_HALF;
		node.y = (y * cell - CUBE_HALF) * lift;
		node.z = z * cell - CUBE_HALF;
	});
	return side;
}

/** 太阳系's orbital pace: ω = K / r^1.5, set so the inner planet laps in about 42 s. */
const SYSTEM_KEPLER = 0.026;

/** 太阳系: the innermost and outermost planetary orbits, in galaxy units. */
const SYSTEM_INNER = 0.3;
const SYSTEM_OUTER = 1.02;

function spiralRadius(t) {
	const share = Math.max(0, Math.min(1, t));
	return Math.sqrt(SPIRAL_INNER * SPIRAL_INNER + (SPIRAL_OUTER * SPIRAL_OUTER - SPIRAL_INNER * SPIRAL_INNER) * share);
}

/** Arms wind 1.8x the twist per unit radius, so each arm sweeps ~280° and the outer turns cover every side of the disc. */
function spiralAngle(arm, arms, radius, twist) {
	return (arm / arms) * TAU + radius * 1.8 * (twist + (arm % 2 === 1 ? 0.42 : 0));
}

/**
 * Split every spiral arm into one stretch per folder, longer for busier folders, so
 * a workspace's conversations trail along its arm instead of balling up at its sun.
 * @param counts - session count per folder, in folder order.
 * @param arms - arm count; folder `i` rides arm `i % arms`.
 * @returns `[{ t0, t1 }]` per folder, as shares of its arm (0 = inner end).
 */
function spiralSegments(counts, arms) {
	const weights = counts.map((count) => 0.6 + Math.pow(Math.max(0, count), 0.8));
	const totals = new Array(arms).fill(0);
	weights.forEach((weight, index) => {
		totals[index % arms] += weight;
	});
	const cursor = new Array(arms).fill(0);
	return weights.map((weight, index) => {
		const arm = index % arms;
		const t0 = cursor[arm] / totals[arm];
		cursor[arm] += weight;
		return { t0, t1: cursor[arm] / totals[arm] };
	});
}

/**
 * 双螺旋: split the workspaces between the two strands so both strands carry about the
 * same number of *stars*, not the same number of workspaces — one workspace with forty
 * conversations weighs as much as forty small ones, which is why alternating by index
 * left one strand thin. Greedy: heaviest first, each to the lighter strand. Inside a
 * strand the workspaces keep their order and are spread evenly along it, so both
 * strands fill from end to end.
 *
 * @param folders - the galaxy's workspaces, each with its `count` of conversations.
 * @returns `[{ strand, t }]` per folder, in folder order.
 */
/** 记忆库's numbers, so the galaxy can borrow the look: three arms, one swirl, a core ring. */
const MEMORY_LAYOUT_ARMS = 3;
const MEMORY_LAYOUT_SWIRL = 2.2;
/** Dots the memory library puts on one call ring; 极简 uses the same ring size. */
const MEMORY_DOTS_PER_RING = 16;

/**
 * 极简（记忆库样式）: the memory library keeps *two* ranks — instruction files in the core,
 * skills on three arms, each skill's calls in a small ring around it. The galaxy has the
 * same two levels once its calls and skills are read as conversations and workspaces:
 * workspaces ride the arms (ranked by how many conversations they hold, dealt round-robin
 * across three arms, the way skills are ranked by call count) and each workspace's
 * conversations sit in a small ring around it. Nothing belongs in the core.
 *
 * @param nodes - every graph node.
 * @returns `{ arms, folder: Map<id, {arm, depth}>, rings }`.
 */
/**
 * 星环: which ring a workspace belongs to, and where on it.
 *
 * Rings are dealt **by weight**, snake-fashion (0,1,2,3,3,2,1,0…): a workspace with eighty
 * conversations counts as much as eight small ones, so no ring ends up with one straggler
 * while its neighbour carries a hundred bodies. Each ring's workspaces then take an even
 * seat around the circle, so a whole ring is always populated.
 *
 * @param folders - every workspace node.
 * @returns `{ ring: Map<id, number>, seat: Map<id, { index, total }> }`.
 */
function ringPlan(folders) {
	const ring = new Map();
	const seat = new Map();
	const byWeight = folders
		.slice()
		.sort((left, right) => (right.count ?? 0) - (left.count ?? 0) || String(left.id).localeCompare(String(right.id)));
	const perRing = RING_RADII.map(() => 0);
	const last = RING_RADII.length - 1;
	byWeight.forEach((folder, order) => {
		const cycle = Math.floor(order / RING_RADII.length);
		const step = order % RING_RADII.length;
		const index = cycle % 2 === 0 ? step : last - step;
		ring.set(folder.id, index);
		seat.set(folder.id, { index: perRing[index], total: 0 });
		perRing[index] += 1;
	});
	for (const [id, entry] of seat) seat.set(id, { index: entry.index, total: perRing[ring.get(id)] ?? 1 });
	return { ring, seat };
}

function memoryPlan(nodes) {
	const folders = nodes
		.filter((node) => node.kind === "folder")
		.slice()
		.sort((left, right) => (right.count ?? 0) - (left.count ?? 0) || String(left.id).localeCompare(String(right.id)));
	const rings = Math.max(1, Math.ceil(folders.length / MEMORY_LAYOUT_ARMS));
	const map = new Map();
	folders.forEach((folder, index) => {
		const rank = Math.floor(index / MEMORY_LAYOUT_ARMS);
		map.set(folder.id, { arm: index % MEMORY_LAYOUT_ARMS, depth: (rank + 0.6) / rings });
	});
	return { arms: MEMORY_LAYOUT_ARMS, folder: map, rings };
}

function helixPlan(folders) {
	const weight = folders.map((folder) => 1 + Math.max(0, folder.count ?? 0));
	const load = [0, 0];
	const strandOf = new Array(folders.length);
	const heaviest = folders.map((_, index) => index).sort((left, right) => weight[right] - weight[left] || left - right);
	for (const index of heaviest) {
		const strand = load[0] <= load[1] ? 0 : 1;
		strandOf[index] = strand;
		load[strand] += weight[index];
	}
	const plan = new Array(folders.length);
	for (const strand of [0, 1]) {
		const members = heaviest.filter((index) => strandOf[index] === strand).sort((left, right) => left - right);
		members.forEach((index, position) => {
			plan[index] = { strand, t: members.length <= 1 ? 0.5 : (position + 0.5) / members.length };
		});
	}
	return plan;
}

/**
 * One folder position for a given silhouette.
 *
 * Every layout keeps the same contract — the outermost body sits near radius 1 — so
 * the shell framing, picking, tracking and the dust layer all keep working without
 * knowing which shape is on screen.
 *
 * @param layout - one of {@link LAYOUTS}.
 * @param index - folder ordinal.
 * @param count - total folders, used to spread the sequence.
 * @param salt - re-roll seed.
 * @param folderId - id, for stable jitter.
 * @param shape - resolved shape numbers (`arms`, `twist`, `thickness`, `spread`).
 * @param segment - spiral only: the folder's `{ t0, t1 }` stretch of its arm (helix: its strand plan).
 * @param stars - this workspace's own star count (1 + its conversations), for layouts weighted by mass.
 * @returns position plus the resolved radius, arm/blot index and what its members need.
 */
function placeFolder(layout, index, count, salt, folderId, shape, segment, stars) {
	const jitter = hash01(`${folderId}:${salt}`) - 0.5;
	const jitterY = hash01(`${folderId}:h${salt}`) - 0.5;
	const { arms, twist, thickness } = shape;
	const lift = (scale) => jitterY * scale * thickness;

	if (layout === "memory") {
		// 极简: a workspace rides an arm exactly as a skill does — ranked by weight, dealt
		// across three arms, walking outward as the ranks fill.
		const seat = shape.memoryPlan?.folder.get(folderId) ?? { arm: index % MEMORY_LAYOUT_ARMS, depth: 0.6 };
		const arm = (seat.arm * TAU) / MEMORY_LAYOUT_ARMS;
		const angle = arm + seat.depth * MEMORY_LAYOUT_SWIRL + jitter * 0.48;
		const radius = 0.5 + 0.5 * seat.depth;
		return { x: Math.cos(angle) * radius, y: (hash01(`memory:${folderId}:y`) - 0.5) * 0.05, z: Math.sin(angle) * radius, radius, arm: seat.arm, angle, ring: undefined };
	}

	if (layout === "rings" || layout === "sphere") {
		// Clean concentric orbits: no arm twist at all, four rings deep. Ring and seat come from
		// `ringPlan` (dealt by weight, spread evenly), so every ring is filled.
		const ringIndex = shape.ringPlan?.ring.get(folderId) ?? index % RING_RADII.length;
		const seat = shape.ringPlan?.seat.get(folderId) ?? { index, total: Math.max(1, Math.ceil(count / RING_RADII.length)) };
		const angle = (seat.index / Math.max(1, seat.total)) * TAU + jitter * 0.06;
		if (layout === "sphere") {
			// 极简: the seat is an angle on this ring's own plane.
			const [u, v] = SPHERE_PLANES[ringIndex];
			const radius = SPHERE_RADIUS;
			return {
				x: (Math.cos(angle) * u[0] + Math.sin(angle) * v[0]) * radius,
				y: (Math.cos(angle) * u[1] + Math.sin(angle) * v[1]) * radius * Math.min(1.5, thickness),
				z: (Math.cos(angle) * u[2] + Math.sin(angle) * v[2]) * radius,
				radius,
				arm: ringIndex,
				angle,
				ring: ringIndex
			};
		}
		const radius = RING_RADII[ringIndex];
		return { x: Math.cos(angle) * radius, y: lift(0.02), z: Math.sin(angle) * radius, radius, arm: ringIndex, angle, ring: ringIndex };
	}

	if (layout === "field") {
		// 深空场: no structure at all — every body sits at its own depth, spread evenly
		// through a wide ball (cube-root radius, so the rim is no denser than the middle)
		// with the vertical axis eased in, which reads as a field rather than a cloud.
		// Golden-angle azimuths and stratified depth keep the suns spread evenly around
		// the ball (a handful of hashed azimuths clumps), while the radius still comes
		// from a hash so the filling looks scattered rather than geometric.
		const golden = Math.PI * (3 - Math.sqrt(5));
		const azimuth = index * golden + jitter * 1.2;
		const cosine = Math.max(-1, Math.min(1, 1 - (2 * (index + 0.5)) / Math.max(1, count) + jitterY * 0.18));
		const depth = hash01(`${folderId}:field:depth`);
		const ring = Math.sqrt(Math.max(0, 1 - cosine * cosine));
		const radius = 0.26 + 0.74 * Math.cbrt(depth);
		const flatten = 0.62 + 0.38 * Math.min(1.6, thickness);
		return {
			x: Math.cos(azimuth) * ring * radius,
			y: cosine * radius * flatten * 0.8,
			z: Math.sin(azimuth) * ring * radius,
			radius,
			arm: index % arms
		};
	}

	if (layout === "system") {
		// 太阳系: one planet per workspace, each on its own orbit between the inner and
		// outer band, phased by the golden angle so no two planets ever line up. Almost
		// coplanar — just enough inclination to read as 3D.
		const orbit = count <= 1 ? 0.5 : SYSTEM_INNER + ((SYSTEM_OUTER - SYSTEM_INNER) * index) / (count - 1);
		const angle = index * Math.PI * (3 - Math.sqrt(5)) + jitter * 0.5;
		const lift = Math.sin(index * 1.9 + jitter * 6) * 0.02 * Math.min(1.5, thickness);
		return { x: Math.cos(angle) * orbit, y: lift, z: Math.sin(angle) * orbit, radius: orbit, orbit, angle, arm: index % arms };
	}

	if (layout === "helix") {
		// Two strands climbing a cylinder; `segment` is the balanced strand plan, so the
		// stars are split by weight and each strand runs its own length end to end.
		const strand = segment?.strand ?? index % 2;
		const t = segment?.t ?? (count <= 1 ? 0.5 : index / (count - 1));
		const angle = t * TAU * HELIX_TURNS + strand * Math.PI + jitter * 0.05;
		const height = HELIX_HEIGHT * Math.max(0.6, Math.min(1.5, thickness));
		return { x: Math.cos(angle) * HELIX_RADIUS, y: (t - 0.5) * height, z: Math.sin(angle) * HELIX_RADIUS, radius: HELIX_RADIUS, arm: strand, t, strand, height };
	}

	if (layout === "web") {
		// Obsidian's 极简 force graph: busy suns nearer the middle, small ones further
		// out, all inside one lumpy body (see webBody).
		const share = count <= 1 ? 0 : index / (count - 1);
		const lift01 = 1 - 2 * hash01(`${folderId}:web${salt}`);
		const ring = Math.sqrt(Math.max(0, 1 - lift01 * lift01));
		const turn = index * Math.PI * (3 - Math.sqrt(5)) + jitter * 0.6;
		const radius = 0.16 + 0.56 * Math.sqrt(share);
		const point = webBody(Math.cos(turn) * ring * radius, lift01 * radius, Math.sin(turn) * ring * radius, thickness);
		return { ...point, radius, arm: index % arms };
	}

	if (layout === "plate") {
		// A solid cube of cells: side³ slots, the suns spread evenly through all of
		// them (stride sampling) so every face and the middle are populated.
		const side = cubeSide(count);
		const slots = side ** 3;
		const slot = Math.min(slots - 1, Math.floor(((index + 0.5) * slots) / Math.max(1, count)));
		const cell = (2 * CUBE_HALF) / (side - 1);
		const x = (slot % side) * cell - CUBE_HALF;
		const y = (Math.floor(slot / side) % side) * cell - CUBE_HALF;
		const z = Math.floor(slot / (side * side)) * cell - CUBE_HALF;
		return { x, y: y * Math.min(1.5, thickness), z, radius: Math.hypot(x, y, z), arm: index % arms, cell };
	}

	if (layout === "tree") {
		// 星树: one limb per workspace, fanned off a main limb, and its sun sits lower
		// on that limb the more stars it carries — a heavy limb is long, a light one is
		// a short twig, so the tree reads as mass rather than as equal spokes.
		const fallbackDirection = treeDirection(index % treeSectors(arms), treeSectors(arms));
		const limb = shape.treePlan?.[index] ?? { direction: fallbackDirection, ...treeFrame(fallbackDirection), sector: index % treeSectors(arms) };
		const share = Math.min(1, Math.sqrt(Math.max(1, stars ?? 1) / Math.max(1, shape.treeMax ?? 1)));
		// Every ray leaves the centre: a light workspace's sun sits close to it, a heavy one's
		// further out, and the conversations continue along the same ray.
		const radius = 0.34 + 0.42 * share;
		const swing = (0.02 + 0.03 * share) * Math.min(1.6, thickness);
		const phase = hash01(`${folderId}:twig${salt}`) * TAU;
		const sideways = Math.cos(phase) * swing;
		const sideways2 = Math.sin(phase) * swing;
		return {
			x: limb.direction.x * radius + limb.tangent.x * sideways + limb.bitangent.x * sideways2,
			y: limb.direction.y * radius + limb.tangent.y * sideways + limb.bitangent.y * sideways2,
			z: limb.direction.z * radius + limb.tangent.z * sideways + limb.bitangent.z * sideways2,
			radius,
			arm: limb.sector,
			direction: limb.direction,
			tangent: limb.tangent,
			bitangent: limb.bitangent,
			phase
		};
	}

	// Spiral: suns sit in the middle of their own stretch of an arm.
	const arm = index % arms;
	const stretch = segment ?? spiralSegments(new Array(count).fill(1), arms)[index];
	const radius = spiralRadius((stretch.t0 + stretch.t1) / 2);
	const angle = spiralAngle(arm, arms, radius, twist) + jitter * 0.04;
	return { x: Math.cos(angle) * radius, y: lift(0.04), z: Math.sin(angle) * radius, radius, arm, t0: stretch.t0, t1: stretch.t1 };
}

/** Sum of two uniforms, centred: a soft-edged spread in [-1, 1]. */
function tri(a, b) {
	return a + b - 1;
}

/**
 * One conversation around its workspace sun, following the silhouette: along the arm,
 * the ring, the strand or the branch; around each planet in the system; the field carries no skeleton at all
 * beams; thrown wide through a ball for the web; inside its own small cube for the plate.
 *
 * @param layout - one of {@link LAYOUTS}.
 * @param hub - the sun's {@link placeFolder} result (before re-centring).
 * @param members - sessions of that sun.
 * @param u - seven independent uniforms for this star.
 * @param shape - resolved shape numbers.
 * @returns position before re-centring.
 */
function placeSession(layout, hub, members, u, shape, seat) {
	const { arms, twist, thickness, spread } = shape;
	const reach = Math.sqrt(Math.max(1, members));
	const loose = Math.min(spread, 1.8);

	if (layout === "memory") {
		// 极简: a conversation is a call dot, on exactly the memory library's ring — sixteen
		// to a ring, rings at 0.05 and 0.085, then the same 0.07 spacing outward when a
		// workspace holds more conversations than the memory map ever draws. The memory map
		// caps at sixteen and reports the rest; the galaxy has to draw every conversation,
		// so it keeps stacking rings instead of hiding them.
		const ordinal = seat?.index ?? 0;
		const ringIndex = Math.floor(ordinal / MEMORY_DOTS_PER_RING);
		const radius = 0.05 + 0.035 * (ringIndex % 2) + 0.07 * Math.floor(ringIndex / 2);
		const spin = u[1];
		const angle = ((ordinal % MEMORY_DOTS_PER_RING) / MEMORY_DOTS_PER_RING) * TAU + spin * 1.4;
		return {
			x: hub.x + Math.cos(angle) * radius,
			y: hub.y + (u[2] - 0.5) * 0.03,
			z: hub.z + Math.sin(angle) * radius
		};
	}

	if (layout === "rings" || layout === "sphere") {
		// A workspace's conversations fan over a wider arc than before, so a ring with three
		// workspaces no longer reads as three beads with long empty stretches between them.
		const length = (0.13 + 0.1 * reach) * loose;
		const angle = hub.angle + ((u[0] - 0.5) * 2 * length) / Math.max(0.2, hub.radius);
		// 星环's bodies ride *on* their ring line: the helix weave (see orbitRings) supplies
		// the visible spread, so the radial scatter here stays tiny.
		const radius = hub.radius + tri(u[1], u[2]) * (0.012 + 0.002 * reach) * loose;
		if (layout === "sphere") {
			// Along the ring, a hair inside it, so the ring itself stays legible.
			const [cu, cv] = SPHERE_PLANES[hub.ring] ?? SPHERE_PLANES[0];
			const along = angle;
			const radial = (SPHERE_RADIUS - 0.008 - tri(u[3], u[4]) * 0.012) / SPHERE_RADIUS;
			const point = (t) => [Math.cos(t) * cu[0] + Math.sin(t) * cv[0], Math.cos(t) * cu[1] + Math.sin(t) * cv[1], Math.cos(t) * cu[2] + Math.sin(t) * cv[2]];
			const [px, py, pz] = point(along);
			return { x: px * SPHERE_RADIUS * radial, y: py * SPHERE_RADIUS * Math.min(1.5, thickness) * radial, z: pz * SPHERE_RADIUS * radial };
		}
		const spread = 0.03;
		return { x: Math.cos(angle) * radius, y: hub.y + tri(u[3], u[4]) * spread * thickness, z: Math.sin(angle) * radius };
	}

	if (layout === "field") {
		// Each workspace is a small galaxy in the field: its conversations sit in a
		// loose 3D shell around the sun, sized by how many there are.
		const ring = u[0] * TAU;
		const cosine = u[1] * 2 - 1;
		const radius = (0.045 + 0.022 * reach) * loose;
		const planar = Math.sqrt(Math.max(0, 1 - cosine * cosine));
		return {
			x: hub.x + Math.cos(ring) * planar * radius,
			y: hub.y + cosine * radius * 0.8,
			z: hub.z + Math.sin(ring) * planar * radius
		};
	}

	if (layout === "system") {
		// Moons sit on a small shell around the planet — a little 星壳, not a flat disc, so
		// each planet reads as a cluster of stars from any camera angle. Two shells keep a
		// busy workspace from crowding into one dotted ring.
		const shell = u[2] < 0.62 ? 0 : 1;
		const turn = u[0] * TAU;
		const cosine = u[1] * 2 - 1;
		// Held inside the gap to the next orbit: with many workspaces the orbits are barely
		// 0.05 apart, and a wider shell would smear into the neighbouring planet's.
		const radius = Math.min(0.14, (0.05 + 0.02 * reach) * loose, (shape.orbitGap ?? 0.3) * 1.6) * (shell === 0 ? 1 : 1.45);
		const planar = Math.sqrt(Math.max(0, 1 - cosine * cosine));
		return {
			x: hub.x + Math.cos(turn) * planar * radius,
			y: hub.y + cosine * radius,
			z: hub.z + Math.sin(turn) * planar * radius
		};
	}

	if (layout === "helix") {
		const t = Math.max(0, Math.min(1, hub.t + (u[0] - 0.5) * 2 * (0.02 + 0.008 * reach) * loose));
		const angle = t * TAU * HELIX_TURNS + hub.strand * Math.PI;
		const radius = HELIX_RADIUS + tri(u[1], u[2]) * 0.04 * loose;
		return { x: Math.cos(angle) * radius, y: (t - 0.5) * hub.height + tri(u[3], u[4]) * 0.02, z: Math.sin(angle) * radius };
	}

	if (layout === "web") {
		// Each conversation lands most of the way from its sun to a random spot of the
		// body, so the stars fill the volume evenly (as a settled force graph does) and
		// links from every sun cross it as one open web; a small sun keeps its stars closer.
		const pull = Math.min(0.88, 0.55 + 0.04 * reach) * Math.min(1.15, loose);
		const [bx, by, bz] = onSphere(u[1], u[2], 0.95 * Math.cbrt(u[0]));
		const spot = webBody(bx, by, bz, thickness);
		const [fx, fy, fz] = onSphere(u[3], u[4], 0.05 * u[5]);
		return { x: hub.x + (spot.x - hub.x) * pull + fx, y: hub.y + (spot.y - hub.y) * pull + fy, z: hub.z + (spot.z - hub.z) * pull + fz };
	}

	if (layout === "plate") {
		// Each sun's conversations fill a small cube of their own, snapped to a 3×3×3
		// sub-grid so the cell reads as a block, not a puff.
		const half = Math.min(hub.cell * 0.32, (0.035 + 0.012 * reach) * loose);
		const snap = (value) => (Math.round(value * 2) / 2) * half * 2 + (value - 0.5) * half * 0.18;
		return { x: hub.x + snap(u[0]) - half, y: hub.y + (snap(u[1]) - half) * Math.min(1.5, thickness), z: hub.z + snap(u[2]) - half };
	}

	if (layout === "tree") {
		// The sun sits partway out on its limb and its conversations run on past it to the
		// tip, so a branch is a limb of length, not a puff around one star. The tube widens
		// with radius, and every third star takes a twig: a wider lateral throw at its own
		// angle, which is what fills the sky between neighbouring limbs.
		const from = Math.min(0.98, hub.radius + 0.04);
		const radius = Math.min(1.05, from + (1.05 - from) * Math.pow(u[0], 0.7));
		const twig = u[6] < 0.34;
		const turn = hub.phase + (twig ? 0.9 + u[3] * 1.7 : u[1] * 0.5);
		const width = (0.03 + 0.085 * radius) * thickness * loose * (twig ? 1.7 : 1) * (0.3 + 0.7 * Math.sqrt(u[2]));
		const side = { x: hub.tangent.x * Math.cos(turn) + hub.bitangent.x * Math.sin(turn), y: hub.tangent.y * Math.cos(turn) + hub.bitangent.y * Math.sin(turn), z: hub.tangent.z * Math.cos(turn) + hub.bitangent.z * Math.sin(turn) };
		return { x: hub.direction.x * radius + side.x * width, y: hub.direction.y * radius + side.y * width, z: hub.direction.z * radius + side.z * width };
	}

	// Spiral: anywhere along the sun's stretch, a little past both ends, with the
	// arm widening outward and one star in ten straying into the gaps between arms.
	const span = hub.t1 - hub.t0;
	const pad = Math.min(0.04, span * 0.15);
	const along = spiralRadius(hub.t0 - pad + (span + 2 * pad) * u[0]);
	const stray = u[6] < 0.1 ? 2 : 1;
	const width = (0.05 + 0.1 * along) * spread * stray;
	// Capped just past the arm's end: one far straggler would set the extent and so shrink the whole disc inside the shell.
	const radius = Math.max(0.12, Math.min(SPIRAL_OUTER * 1.06, along + tri(u[1], u[2]) * width));
	const angle = spiralAngle(hub.arm, arms, along, twist) + (u[3] - 0.5) * 0.16;
	return {
		x: Math.cos(angle) * radius,
		y: tri(u[4], u[5]) * (0.07 + 0.06 * along) * thickness,
		z: Math.sin(angle) * radius
	};
}

/**
 * One dust grain for a given silhouette.
 *
 * Folders are too few to describe a shape on their own (fifteen points cannot read
 * as a cube), so the haze carries the volume: a box, a shell, annuli, strands,
 * blobs, a sheet or spokes. Spiral keeps its own arm lanes elsewhere.
 *
 * @param layout - one of {@link LAYOUTS}.
 * @param index - grain ordinal.
 * @param salt - re-roll seed.
 * @param shape - resolved shape numbers.
 * @returns position.
 */
function placeDust(layout, index, salt, shape) {
	const streams = [
		hash01(`${layout}:${index}:${salt}:a`),
		hash01(`${layout}:${index}:${salt}:bb`),
		hash01(`${layout}:${index}:${salt}:ccc`),
		hash01(`${layout}:${index}:${salt}:dddd`),
		hash01(`${layout}:${index}:${salt}:eeeee`),
		hash01(`${layout}:${index}:${salt}:ffffff`)
	];
	let cursor = 0;
	const rnd = () => streams[cursor++ % streams.length];
	const { arms, thickness } = shape;
	const thin = (scale) => (rnd() - 0.5) * scale * thickness;

	if (layout === "field") {
		const ring = rnd() * TAU;
		const cosine = rnd() * 2 - 1;
		const planar = Math.sqrt(Math.max(0, 1 - cosine * cosine));
		const radius = 0.3 + 0.7 * Math.cbrt(rnd());
		return { x: Math.cos(ring) * planar * radius, y: cosine * radius * 0.8, z: Math.sin(ring) * planar * radius };
	}
	if (layout === "system") {
		// A third of the grains light the sun at the centre; the rest are zodiacal dust
		// lying in the ecliptic with the planets.
		const angle = rnd() * TAU;
		if (rnd() < 0.34) {
			// The sun is a ball, not a fried egg: cube-root radius so the volume is even.
			const lift = rnd() * 2 - 1;
			const ring = Math.sqrt(Math.max(0, 1 - lift * lift));
			const radius = Math.cbrt(rnd()) * 0.15;
			return { x: Math.cos(angle) * ring * radius, y: lift * radius * 0.92, z: Math.sin(angle) * ring * radius };
		}
		const radius = 0.24 + rnd() * 0.82;
		return { x: Math.cos(angle) * radius, y: (rnd() - 0.5) * 0.02 * thickness, z: Math.sin(angle) * radius };
	}
	if (layout === "helix") {
		const strand = rnd() > 0.5 ? 1 : 0;
		const t = rnd();
		const angle = t * TAU * HELIX_TURNS + strand * Math.PI;
		const radius = HELIX_RADIUS + (rnd() - 0.5) * 0.06;
		return { x: Math.cos(angle) * radius, y: (t - 0.5) * HELIX_HEIGHT * Math.max(0.6, Math.min(1.5, thickness)), z: Math.sin(angle) * radius };
	}
	if (layout === "rings") {
		const ring = Math.floor(rnd() * RING_RADII.length);
		const radius = RING_RADII[ring] + (rnd() - 0.5) * 0.05;
		const angle = rnd() * TAU;
		return { x: Math.cos(angle) * radius, y: thin(0.03), z: Math.sin(angle) * radius };
	}
	if (layout === "web") {
		const [x, y, z] = onSphere(rnd(), rnd(), 0.85 * Math.cbrt(rnd()));
		return webBody(x, y, z, thickness);
	}
	if (layout === "plate") {
		// Haze along the cube's grid lines (the same lattice the stars sit on): two
		// coordinates on a grid plane, one free.
		const side = Math.min(12, shape.cube ?? 4);
		const grid = () => (Math.floor(rnd() * side) / (side - 1)) * 2 * CUBE_HALF - CUBE_HALF;
		const free = (rnd() * 2 - 1) * CUBE_HALF;
		const axis = Math.floor(rnd() * 3) % 3;
		const a = grid();
		const b = grid();
		const point = axis === 0 ? { x: free, y: a, z: b } : axis === 1 ? { x: a, y: free, z: b } : { x: a, y: b, z: free };
		return { x: point.x, y: point.y * Math.min(1.5, thickness), z: point.z };
	}
	if (layout === "tree") {
		// Haze follows the same limbs the stars do, so the tree has bark, not just dots.
		const sectors = treeSectors(arms);
		const limbs = shape.treeLimbs ?? [];
		const picked = limbs.length === 0 ? null : limbs[Math.floor(rnd() * limbs.length) % limbs.length];
		const sector = treeDirection(Math.floor(rnd() * sectors), sectors);
		const axis = picked ?? { direction: sector, ...treeFrame(sector) };
		const radius = 0.18 + rnd() * 0.86;
		const turn = rnd() * TAU;
		const width = rnd() * (0.032 + 0.095 * radius) * thickness;
		return {
			x: axis.direction.x * radius + (axis.tangent.x * Math.cos(turn) + axis.bitangent.x * Math.sin(turn)) * width,
			y: axis.direction.y * radius + (axis.tangent.y * Math.cos(turn) + axis.bitangent.y * Math.sin(turn)) * width,
			z: axis.direction.z * radius + (axis.tangent.z * Math.cos(turn) + axis.bitangent.z * Math.sin(turn)) * width
		};
	}
	const radius = Math.pow(rnd(), 0.55) * 1.02;
	const angle = rnd() * TAU;
	return { x: Math.cos(angle) * radius, y: thin(0.04 + radius * 0.06), z: Math.sin(angle) * radius };
}

/**
 * Faint structural lines that name the silhouette: rings, a wireframe shell, two
 * strands, a box, a sheet, spokes, or nothing for the spiral (its arms already read).
 *
 * @param layout - one of {@link LAYOUTS}.
 * @param offset - the galaxy's re-centring shift and scale (`galaxy.offset`), so the guides sit on the body.
 * @returns array of polylines in world space.
 */
function layoutGuides(layout, offset, arms, orbits) {
	const lines = layoutGuideLines(layout, arms, orbits);
	const ox = offset?.x ?? 0;
	const oy = offset?.y ?? 0;
	const oz = offset?.z ?? 0;
	const scale = offset?.scale ?? 1;
	if (ox === 0 && oy === 0 && oz === 0 && scale === 1) return lines;
	return lines.map((line) => line.map(([x, y, z]) => [(x - ox) * scale, (y - oy) * scale, (z - oz) * scale]));
}

function layoutGuideLines(layout, arms, orbits) {
	const ring = (radius, segments = 96) => {
		const points = [];
		for (let i = 0; i <= segments; i += 1) {
			const angle = (i / segments) * TAU;
			points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
		}
		return points;
	};

	if (layout === "rings") return RING_RADII.map((radius) => ring(radius));
	if (layout === "sphere") {
		// The skeleton *is* the rings: one polyline per plane.
		return SPHERE_PLANES.map(([u, v]) => {
			const points = [];
			for (let step = 0; step <= 96; step += 1) {
				const t = (step / 96) * TAU;
				points.push([
					(Math.cos(t) * u[0] + Math.sin(t) * v[0]) * SPHERE_RADIUS,
					(Math.cos(t) * u[1] + Math.sin(t) * v[1]) * SPHERE_RADIUS,
					(Math.cos(t) * u[2] + Math.sin(t) * v[2]) * SPHERE_RADIUS
				]);
			}
			return points;
		});
	}
	if (layout === "plate") {
		// The cube's twelve edges.
		const h = CUBE_HALF;
		const lines = [];
		for (const a of [-h, h]) {
			for (const b of [-h, h]) {
				lines.push([[-h, a, b], [h, a, b]]);
				lines.push([[a, -h, b], [a, h, b]]);
				lines.push([[a, b, -h], [a, b, h]]);
			}
		}
		return lines;
	}
	if (layout === "field") {
		// A deep field has no skeleton: the scatter is the shape.
		return [];
	}
	if (layout === "system") {
		// One orbit line per planet, at the radius that planet was placed on.
		return (orbits ?? []).map((radius) => ring(radius, 128));
	}
	if (layout === "helix") {
		const strands = [];
		for (const strand of [0, 1]) {
			const points = [];
			for (let i = 0; i <= 120; i += 1) {
				const t = i / 120;
				const angle = t * TAU * HELIX_TURNS + strand * Math.PI;
				points.push([Math.cos(angle) * HELIX_RADIUS, (t - 0.5) * HELIX_HEIGHT, Math.sin(angle) * HELIX_RADIUS]);
			}
			strands.push(points);
		}
		return strands;
	}
	if (layout === "tree") {
		// The main limbs only: the fan of workspace limbs is drawn by the stars themselves.
		const sectors = treeSectors(arms);
		const lines = [];
		for (let sector = 0; sector < sectors; sector += 1) {
			const direction = treeDirection(sector, sectors);
			lines.push([[0, 0, 0], [direction.x, direction.y, direction.z]]);
		}
		return lines;
	}
	return [];
}

/** Dust speck radius: haze is finer than the lane. */
function dustSize(haze, index) {
	return haze ? 0.4 + hash01(`dust:${index}:s`) * 0.7 : 0.5 + hash01(`dust:${index}:s`) * 1.2;
}

/** No layout reaches past this radius, whatever the shape sliders say. */
const GALAXY_REACH = 1.5;

/**
 * Lay out every member for the chosen silhouette, in units where the outermost sun
 * sits near radius 1. Stars fill the inner ~0.7 of the shell (shell = 1.22·extent).
 *
 * Pure function of ids and counts: the same data always yields the same galaxy,
 * so the picture is stable across reloads and no solver has to run.
 *
 * @param graph - output of {@link buildGraph}.
 * @param seed - bump to re-roll jitter (the "re-layout" button).
 * @returns `{ nodes, links, dust, extent, offset }`.
 */
function createGalaxy(graph, seed, shape) {
	const salt = typeof seed === "number" ? seed : 1;
	const arms = Math.max(1, Math.min(4, Math.round(shape?.arms ?? SHAPE.arms)));
	const twist = Math.max(1, Math.min(9, shape?.twist ?? SHAPE.twist));
	const thickness = Math.max(0.15, Math.min(3, shape?.thickness ?? SHAPE.thickness));
	const spread = Math.max(0.3, Math.min(2.4, shape?.spread ?? SHAPE.spread));
	const layout = LAYOUTS.includes(shape?.layout) ? shape.layout : "spiral";
	const shapeNumbers = { arms, twist, thickness, spread };
	const nodes = graph.nodes;
	const folders = nodes.filter((node) => node.kind === "folder");
	// 太阳系 orbit spacing, known before anything is placed: a moon disc has to stay
	// inside the gap to the next orbit.
	if (layout === "system") shapeNumbers.orbitGap = folders.length > 1 ? (SYSTEM_OUTER - SYSTEM_INNER) / (folders.length - 1) : 0.32;
	// 极简 ranks conversations globally (by activity), so the plan is made once, before
	// any folder is placed.
	if (layout === "memory") shapeNumbers.memoryPlan = memoryPlan(nodes);
	if (layout === "rings" || layout === "sphere") shapeNumbers.ringPlan = ringPlan(folders);
	if (layout === "tree") {
		shapeNumbers.treeMax = Math.max(1, ...folders.map((folder) => folder.count ?? 1));
		shapeNumbers.treePlan = treePlan(folders, arms, salt);
	}
	// 极简 draws the memory library itself: its bodies already sit where the memory map puts
	// them, and re-placing them through a galaxy layout would be a second, different guess.
	// Only the extent/offset pass below runs, which is a uniform scale and translation.
	const keepPlaced = graph.fromMemory === true;
	const golden = Math.PI * (3 - Math.sqrt(5));
	const segments = layout === "spiral" && !keepPlaced ? spiralSegments(folders.map((folder) => folder.count), arms) : [];
	const strands = layout === "helix" ? helixPlan(folders) : [];
	const placements = new Map();

	folders.forEach((folder, index) => {
		if (keepPlaced) {
			// Positions come from the memory map; only the render size is ours to set.
			folder.size = 2.5 + Math.min(2.6, Math.sqrt(folder.count ?? 1) * 0.26);
			folder.arm = 0;
			return;
		}
		const placed = placeFolder(layout, index, folders.length, salt, folder.id, shapeNumbers, layout === "helix" ? strands[index] : segments[index], folder.count);
		placements.set(folder.id, { ...placed, members: folder.count });
		folder.x = placed.x;
		folder.y = placed.y;
		folder.z = placed.z;
		folder.arm = placed.arm;
		folder.discRadius = placed.radius;
		// 双螺旋 keeps which strand a workspace landed on (and where along it), so the
		// balance is checkable and its conversations can be attributed to a strand.
		folder.strand = placed.strand;
		folder.t = placed.t;
		// 星环: one colour per ring, so the ring a body rides is part of its identity.
		folder.ring = placed.ring;
		folder.ringBaseY = placed.y;
		folder.strandIndex = layout === "rings" ? (hash01(`${folder.id}:strand`) < 0.5 ? 0 : 1) : undefined;
		folder.hueIndex = layout === "rings" && Number.isFinite(placed.ring) ? placed.ring : folder.hueIndex;
		folder.hue = layout === "rings" && Number.isFinite(placed.ring) ? HUES[placed.ring % HUES.length] : folder.hue;
		folder.size = 2.5 + Math.min(2.6, Math.sqrt(folder.count) * 0.26);
	});

	// 极简: each conversation needs its ordinal inside its workspace — the memory library's
	// call dots are numbered within their skill.
	const ordinals = new Map();
	for (const node of nodes) {
		if (node.kind !== "session") continue;
		if (keepPlaced) {
			node.size = 0.85 + (node.recency ?? 0.5) * 0.6;
			node.arm = 0;
			continue;
		}
		const hub = placements.get(node.folderId);
		const u = hashStreams(`star|${node.id}|${salt}`, 7);
		node.size = 0.85 + node.recency * 0.6 + (node.running ? 0.28 : 0);
		if (hub === undefined) {
			const angle = u[0] * TAU;
			const radius = 0.35 + u[1] * 0.5;
			node.x = Math.cos(angle) * radius;
			node.z = Math.sin(angle) * radius;
			node.y = (u[2] - 0.5) * 0.08 * thickness;
			node.size = 1.05 + node.recency * 0.55;
			continue;
		}
		const placed = placeSession(layout, hub, hub.members, u, shapeNumbers, layout === "memory" ? { index: (ordinals.get(node.folderId) ?? 0) + (ordinals.set(node.folderId, (ordinals.get(node.folderId) ?? 0) + 1), 0) } : undefined);
		node.x = placed.x;
		node.y = placed.y;
		node.z = placed.z;
		node.arm = hub.arm;
		node.ring = hub.ring;
		// The weave needs a home height and a strand; hash them, so a body keeps its strand
		// for the whole session and the two helixes stay evenly filled.
		node.ringBaseY = node.y;
		node.strandIndex = u[5] < 0.5 ? 0 : 1;
		if (layout === "rings" && Number.isFinite(hub.ring)) {
			node.hueIndex = hub.ring;
			node.hue = HUES[hub.ring % HUES.length];
		}
	}
	if (layout === "plate") shapeNumbers.cube = latticeCube(nodes, folders, thickness);
	if (layout === "tree") shapeNumbers.treeLimbs = shapeNumbers.treePlan.map(({ direction, tangent, bitangent }) => ({ direction, tangent, bitangent }));

	// Off-disc shapes are not mass-symmetric (six branches, five blobs, a partly
	// filled grid), so the body would hang off the middle of the shell and gets
	// re-centred on its suns here. The spiral is centred on its core by construction
	// and must keep it: shifting a two-arm disc to its own midpoint halves it.
	let offsetX = 0;
	let offsetY = 0;
	let offsetZ = 0;
	if (layout !== "spiral" && layout !== "plate" && layout !== "system" && layout !== "rings" && folders.length > 0) {
		for (const folder of folders) {
			offsetX += folder.x;
			offsetY += folder.y;
			offsetZ += folder.z;
		}
		offsetX /= folders.length;
		offsetY /= folders.length;
		offsetZ /= folders.length;
		for (const node of nodes) {
			node.x -= offsetX;
			node.y -= offsetY;
			node.z -= offsetZ;
		}
	}

	// Wide spread or tall thickness can push stragglers far out; pull the whole body
	// (dust and guides too) back inside the reach the shell can still frame.
	let reach = 0;
	for (const node of nodes) reach = Math.max(reach, Math.hypot(node.x, node.y, node.z));
	const shrink = reach > GALAXY_REACH ? GALAXY_REACH / reach : 1;
	if (shrink !== 1) {
		for (const node of nodes) {
			node.x *= shrink;
			node.y *= shrink;
			node.z *= shrink;
		}
	}

	// Dust: the diffuse body of whatever shape is on screen. Rendered as sub-pixel
	// haze, never clickable. Spiral gets its arm lanes; every other layout samples
	// the same placement function, so the haze inherits the silhouette for free.
	const dust = [];
	// 记忆库 has no grains at all — one haze sprite behind the disc — so 极简 draws none.
	if (layout !== "spiral" && layout !== "memory") {
		// More grains than the disc needs: a cube or a shell has no arm to concentrate
		// the haze, so the volume only reads when it is dense enough to be continuous.
		for (let index = 0; index < 5600; index += 1) {
			const placed = placeDust(layout, index, salt, shapeNumbers);
			const haze = hash01(`dust:${index}:haze`) > 0.72;
			dust.push({
				x: (placed.x - offsetX) * shrink,
				y: (placed.y - offsetY) * shrink,
				z: (placed.z - offsetZ) * shrink,
				hue: HUES[index % HUES.length],
				alpha: haze ? 0.028 + hash01(`dust:${index}:a`) * 0.05 : 0.05 + hash01(`dust:${index}:a`) * 0.1,
				size: dustSize(haze, index)
			});
		}
	}
	for (let index = 0; layout === "spiral" && index < 3200; index += 1) {
		const arm = index % arms;
		const haze = hash01(`dust:${index}:haze`) > 0.72;
		const share = Math.pow(hash01(`dust:${index}:t`), 0.55);
		const radius = 0.06 + 1 * share;
		// Wobble the lane slightly so the arm has texture instead of a razor line.
		const lane = (hash01(`dust:${index}:lane`) - 0.5) * (haze ? 0.5 : 0.09);
		const angle = spiralAngle(arm, arms, radius, twist) + lane;
		dust.push({
			x: Math.cos(angle) * radius * shrink,
			z: Math.sin(angle) * radius * shrink,
			y: (hash01(`dust:${index}:y`) - 0.5) * (0.03 + radius * 0.07) * thickness * shrink,
			hue: HUES[(arm * 3 + (haze ? 1 : 0)) % HUES.length],
			alpha: haze ? 0.03 + hash01(`dust:${index}:a`) * 0.05 : 0.06 + hash01(`dust:${index}:a`) * 0.14,
			size: dustSize(haze, index)
		});
	}
	// Diffuse disc: faint grains between the arms so the galaxy reads as a
	// continuous sheet of stars rather than two isolated crescents.
	for (let index = 0; layout === "spiral" && index < 1100; index += 1) {
		const radius = Math.pow(hash01(`field:${index}:r`), 0.5) * 1.02;
		const angle = hash01(`field:${index}:a`) * TAU;
		dust.push({
			x: Math.cos(angle) * radius * shrink,
			z: Math.sin(angle) * radius * shrink,
			y: (hash01(`field:${index}:y`) - 0.5) * (0.04 + radius * 0.08) * thickness * shrink,
			hue: 252 + (hash01(`field:${index}:h`) - 0.5) * 70,
			alpha: 0.018 + hash01(`field:${index}:a2`) * 0.05,
			size: 0.5 + hash01(`field:${index}:s`) * 1
		});
	}

	// 太阳系's sun: a warm ball of grains at the origin, the body every orbit circles.
	// Brighter than the spiral's core dust, because here it is the subject.
	for (let index = 0; layout === "system" && index < 220; index += 1) {
		const angle = hash01(`sun:${index}:a`) * TAU;
		const lift = Math.acos(Math.max(-1, Math.min(1, 1 - 2 * hash01(`sun:${index}:y`))));
		const radius = Math.pow(hash01(`sun:${index}:r`), 2.2) * 0.12;
		const planar = Math.sin(lift);
		dust.push({
			x: Math.cos(angle) * planar * radius,
			z: Math.sin(angle) * planar * radius,
			y: Math.cos(lift) * radius,
			hue: 42 + (hash01(`sun:${index}:h`) - 0.5) * 10,
			alpha: 0.05 + hash01(`sun:${index}:a2`) * 0.08,
			size: 0.8 + hash01(`sun:${index}:s`) * 1.2
		});
	}

	// A faint scatter where the spiral arms converge, at half the old alpha: a bright
	// nucleus reads as a white blob sitting on top of the view. Spiral only: the other
	// layouts are re-centred on their stars, so grains fixed at the origin would
	// pile up in the middle of a shape that has nothing there.
	for (let index = 0; layout === "spiral" && index < 110; index += 1) {
		const angle = hash01(`core:${index}:a`) * TAU;
		const radius = Math.pow(hash01(`core:${index}:r`), 1.8) * 0.16;
		dust.push({
			x: Math.cos(angle) * radius,
			z: Math.sin(angle) * radius,
			y: (hash01(`core:${index}:y`) - 0.5) * 0.03 * thickness,
			hue: 46,
			alpha: 0.01 + hash01(`core:${index}:a2`) * 0.025,
			size: 0.6 + hash01(`core:${index}:s`) * 0.9
		});
	}

	// The shell is drawn at 1.22·extent, so every star stays inside it with margin.
	let extent = 0.2;
	for (const node of nodes) extent = Math.max(extent, Math.hypot(node.x, node.y, node.z));
	// 太阳系 keeps its own polar coordinates per body, so the orbit is a pure function of
	// time: the planet about the sun, the moons about their planet. Nothing accumulates,
	// so a paused or throttled frame cannot drift the system out of shape.
	if (layout === "system") {
		for (const folder of folders) {
			folder.orbitRadius = Math.hypot(folder.x, folder.z);
			folder.orbitAngle = Math.atan2(folder.z, folder.x);
		}
		for (const node of nodes) {
			if (node.kind !== "session") continue;
			const host = folders.find((folder) => folder.id === node.folderId);
			if (host === undefined) continue;
			node.spinRadius = Math.hypot(node.x - host.x, node.z - host.z);
			node.spinAngle = Math.atan2(node.z - host.z, node.x - host.x);
			node.spinLift = node.y - host.y;
		}
	}

	const orbits = layout === "system" ? folders.map((folder) => folder.orbit * shrink) : [];
	return { nodes, links: graph.links, dust, extent: Math.min(1.7, extent), golden, orbits, offset: { x: offsetX, y: offsetY, z: offsetZ, scale: shrink } };
}

/**
 * 太阳系's revolution: planets travel around the sun at a Kepler-ish speed (inner fast,
 * outer slow) and every moon circles its planet on top of that, so the clusters read as
 * orbiting rather than as a painted disc.
 *
 * Positions are recomputed from each body's stored polar coordinates and the elapsed
 * time, never integrated, so the system cannot drift and any frame stays reproducible.
 *
 * @param galaxy - output of {@link createGalaxy} (system layout only).
 * @param seconds - scene time.
 */
/** 星环's pace: inner rings lap faster; the innermost takes about 1.9 min per lap. */
const RING_ORBIT = 0.015;
/** Twists of the double helix per lap, and how far off the ring line a body weaves. */
const RING_HELIX_TURNS = 3;
const RING_HELIX_LIFT = 0.05;

/**
 * 星环's motion: every body travels along its own ring, weaving above and below the ring
 * line in two strands of a double helix — so the rings read as two interleaved helixes
 * turning rather than as a plate of beads.
 *
 * Positions are recomputed from each body's stored polar seat and the elapsed time, never
 * integrated, so the picture cannot drift and any frame is reproducible.
 *
 * @param galaxy - output of {@link createGalaxy}.
 * @param seconds - scene time.
 */
function orbitRings(galaxy, seconds) {
	for (const node of galaxy.nodes) {
		if (node.ring === undefined || !Number.isFinite(node.ring)) continue;
		const radius = Math.hypot(node.x, node.z);
		if (radius < 1e-6) continue;
		// The base angle is the *placed* one, stored once. Reading it back off the live
		// position (as this used to) folds the clock into it every frame: each call added
		// `seconds · speed` to an angle that already held it, so the ring span faster and
		// faster the longer the view stayed open.
		const base = Number.isFinite(node.ringAngle) ? node.ringAngle : (node.ringAngle = Math.atan2(node.z, node.x));
		const speed = RING_ORBIT / Math.pow(Math.max(0.2, radius), 1.2);
		const travelled = seconds * speed;
		const angle = base + travelled;
		// Two strands, half a twist apart, each weaving around the ring line.
		const strand = Number.isFinite(node.strandIndex) ? node.strandIndex : 0;
		const weave = Math.sin(travelled * RING_HELIX_TURNS * TAU + (strand === 0 ? 0 : Math.PI));
		node.x = Math.cos(angle) * radius;
		node.z = Math.sin(angle) * radius;
		node.y = (node.ringBaseY ?? 0) + weave * RING_HELIX_LIFT;
	}
}

/**
 * 极简's armillary spin: every body turns inside its own ring's plane, alternating direction,
 * so the rings visibly rotate through one another instead of the whole ball turning as a
 * block.
 */
function orbitSphere(galaxy, seconds) {
	for (const node of galaxy.nodes) {
		const ring = node.ring;
		if (ring === undefined || !Number.isFinite(ring)) continue;
		const plane = SPHERE_PLANES[ring] ?? SPHERE_PLANES[0];
		// The placed angle is the phase: recovered from the node's position inside its plane.
		if (node.spherePhase === undefined) {
			node.spherePhase = Math.atan2(
				node.x * plane[1][0] + node.y * plane[1][1] + node.z * plane[1][2],
				node.x * plane[0][0] + node.y * plane[0][1] + node.z * plane[0][2]
			);
		}
		const base = 0;
		const speed = (ring % 2 === 0 ? 1 : -1) * (SPHERE_ORBIT / (1 + ring * 0.35));
		const angle = base + seconds * speed + node.spherePhase;
		const radial = Math.hypot(node.x, node.y, node.z) / Math.max(1e-6, SPHERE_RADIUS);
		node.x = (Math.cos(angle) * plane[0][0] + Math.sin(angle) * plane[1][0]) * SPHERE_RADIUS * radial;
		node.y = (Math.cos(angle) * plane[0][1] + Math.sin(angle) * plane[1][1]) * SPHERE_RADIUS * radial;
		node.z = (Math.cos(angle) * plane[0][2] + Math.sin(angle) * plane[1][2]) * SPHERE_RADIUS * radial;
	}
}

function orbitSystem(galaxy, seconds) {
	const planets = [];
	for (const node of galaxy.nodes) {
		if (node.kind !== "folder" || node.orbitRadius === undefined) continue;
		// ω ∝ r^-1.5, scaled so the innermost planet laps in about 42 s.
		const speed = SYSTEM_KEPLER / Math.pow(Math.max(0.12, node.orbitRadius), 1.5);
		const angle = node.orbitAngle + seconds * speed;
		node.x = Math.cos(angle) * node.orbitRadius;
		node.z = Math.sin(angle) * node.orbitRadius;
		planets.push(node);
	}
	for (const node of galaxy.nodes) {
		if (node.kind !== "session" || node.spinRadius === undefined) continue;
		const host = planets.find((planet) => planet.id === node.folderId);
		if (host === undefined) continue;
		// A moon keeps its own turn around the planet, faster than the planet's lap.
		const speed = (SYSTEM_KEPLER / Math.pow(Math.max(0.12, host.orbitRadius), 1.5)) * 2.6;
		const angle = node.spinAngle + seconds * speed;
		node.x = host.x + Math.cos(angle) * node.spinRadius;
		node.y = host.y + node.spinLift;
		node.z = host.z + Math.sin(angle) * node.spinRadius;
	}
}

/**
 * A fresh orbit camera. `yaw` spins around Y, `pitch` tilts the disc, `distance`
 * dollies along the view axis.
 * @param overrides - partial camera fields.
 * @returns camera state.
 */
function createCamera(overrides) {
	return {
		yaw: 0.55,
		pitch: 0.62,
		distance: 2.9,
		target: { x: 0, y: 0, z: 0 },
		fov: 0.82,
		...overrides ?? {}
	};
}

/**
 * Camera position and orthonormal basis for one frame.
 * @param camera - camera state.
 * @returns `{ eye, right, up, forward }` unit vectors plus the eye point.
 */
function cameraBasis(camera) {
	const cosPitch = Math.cos(camera.pitch);
	const sinPitch = Math.sin(camera.pitch);
	const cosYaw = Math.cos(camera.yaw);
	const sinYaw = Math.sin(camera.yaw);
	const eye = {
		x: camera.target.x + camera.distance * cosPitch * sinYaw,
		y: camera.target.y + camera.distance * sinPitch,
		z: camera.target.z + camera.distance * cosPitch * cosYaw
	};
	const forward = normalize({
		x: camera.target.x - eye.x,
		y: camera.target.y - eye.y,
		z: camera.target.z - eye.z
	});
	// Both axes are written out from yaw and pitch instead of from `cross(forward, worldUp)`:
	// that cross product vanishes when the camera looks straight up or down, which is why
	// pitch used to be locked to a band. Analytic axes stay exact at every angle, so the
	// camera can go over the poles and keep turning (the scene rolls with it).
	const right = { x: cosYaw, y: 0, z: -sinYaw };
	const up = { x: -sinPitch * sinYaw, y: cosPitch, z: -sinPitch * cosYaw };
	return { eye, forward, right, up };
}

/** Vector helpers kept local so the bundle stays dependency-free. */
function normalize(vector) {
	const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
	return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
}

function cross(a, b) {
	return {
		x: a.y * b.z - a.z * b.y,
		y: a.z * b.x - a.x * b.z,
		z: a.x * b.y - a.y * b.x
	};
}

/**
 * Project one world point into screen space.
 * @param point - `{ x, y, z }` in galaxy units.
 * @param basis - output of {@link cameraBasis}.
 * @param viewport - `{ width, height }` in CSS pixels.
 * @returns `{ x, y, depth, scale }` or null when behind the camera.
 */
function projectPoint(point, basis, viewport) {
	const dx = point.x - basis.eye.x;
	const dy = point.y - basis.eye.y;
	const dz = point.z - basis.eye.z;
	const depth = dx * basis.forward.x + dy * basis.forward.y + dz * basis.forward.z;
	if (depth <= 0.08) return null;
	const focal = (Math.min(viewport.width, viewport.height) * 0.5) / Math.tan(0.41);
	const side = (dx * basis.right.x + dy * basis.right.y + dz * basis.right.z) / depth;
	const lift = (dx * basis.up.x + dy * basis.up.y + dz * basis.up.z) / depth;
	return {
		x: viewport.width * 0.5 + side * focal,
		y: viewport.height * 0.5 - lift * focal,
		depth,
		scale: focal / depth
	};
}

/**
 * Distance that frames the whole galaxy for a given field of view.
 * @param extent - galactic radius.
 * @param fov - vertical field of view in radians.
 * @returns camera distance.
 */
function fitDistance(extent, fov) {
	const half = Math.tan((fov ?? 0.82) / 2);
	return Math.max(1.2, (Math.max(0.3, extent) * 1.55) / half);
}

/** Neighbour index set for hover highlighting (folders, members, lineage). */
function neighboursOf(graph) {
	const map = new Map();
	const add = (from, to) => {
		if (!map.has(from)) map.set(from, new Set());
		map.get(from).add(to);
	};
	for (const link of graph.links) {
		const a = graph.nodes[link.a];
		const b = graph.nodes[link.b];
		if (a === undefined || b === undefined) continue;
		add(a.id, b.id);
		add(b.id, a.id);
	}
	return map;
}

/**
 * Sky shell: a thin, uniform shell of grains around the galaxy (unit radius, so the
 * renderer scales it by the scene's shell radius). Every grain draws as a hard square
 * of a fixed CSS size, so the arrays are flat and pre-sorted by (class, tint) bucket:
 * the renderer fills each bucket with one path and allocates nothing per frame.
 */
const SKY_RADIUS = 1;
const SKY_CLASSES = [
	{ count: 5200, size: 1.2 },
	{ count: 1800, size: 2 },
	{ count: 500, size: 3 }
];
/**
 * On-screen tints, each a faint colour rather than plain white: cool white, silver,
 * a rare pale warm one, faint rose, pale blue, ivory, and a near-white bright one
 * (L-class only). Warm grains stay scarce and pale so the shell never reads yellow.
 */
const SKY_TINTS = [
	[190, 198, 214],
	[204, 206, 212],
	[216, 206, 192],
	[210, 202, 206],
	[164, 180, 214],
	[212, 210, 204],
	[220, 220, 216]
];
const SKY_BRIGHT_TINT = 6;
const SKY_BUCKETS = SKY_CLASSES.length * SKY_TINTS.length;

/** murmur3 finaliser: spreads one FNV-1a seed into independent streams. */
function mix32(value) {
	let mixed = value >>> 0;
	mixed ^= mixed >>> 16;
	mixed = Math.imul(mixed, 0x85ebca6b);
	mixed ^= mixed >>> 13;
	mixed = Math.imul(mixed, 0xc2b2ae35);
	mixed ^= mixed >>> 16;
	return mixed >>> 0;
}

/**
 * Several uniforms in [0, 1) from one key. Keys that differ by a single character
 * correlate under FNV-1a, so streams are derived from one hash instead of from
 * sibling keys like `${key}:a` / `${key}:b`.
 */
function hashStreams(text, count) {
	const seed = Math.floor(hash01(text) * 4294967296);
	const out = new Array(count);
	for (let index = 0; index < count; index += 1) out[index] = mix32(seed + Math.imul(index + 1, 0x9e3779b9)) / 4294967296;
	return out;
}

/**
 * Flat, bucket-sorted grain arrays from a class table and a placement function.
 * @param classes - `[{ count, size }]` in draw order.
 * @param key - hash namespace, distinct per grain set.
 * @param place - `(streams, classIndex) => [x, y, z]` from four uniforms.
 * @param brightShare - share of the last class drawn in the bright tint.
 */
function createGrainSet(classes, key, place, brightShare) {
	const grains = [];
	let serial = 0;
	classes.forEach((klass, classIndex) => {
		for (let index = 0; index < klass.count; index += 1) {
			serial += 1;
			const streams = hashStreams(`${key}/${serial}`, 7);
			const [x, y, z] = place(streams, classIndex);
			const pick = streams[4];
			let tint = pick < 0.4 ? 0 : pick < 0.62 ? 1 : pick < 0.66 ? 2 : pick < 0.72 ? 3 : pick < 0.92 ? 4 : 5;
			if (classIndex === classes.length - 1 && streams[6] < brightShare) tint = SKY_BRIGHT_TINT;
			grains.push({ x, y, z, keep: streams[5], cls: classIndex, tint, bucket: classIndex * SKY_TINTS.length + tint });
		}
	});
	grains.sort((left, right) => left.bucket - right.bucket);
	const count = grains.length;
	const set = {
		count,
		sizes: classes.map((klass) => klass.size),
		x: new Float32Array(count),
		y: new Float32Array(count),
		z: new Float32Array(count),
		keep: new Float32Array(count),
		cls: new Uint8Array(count),
		tint: new Uint8Array(count),
		bucketStart: new Int32Array(SKY_BUCKETS),
		bucketEnd: new Int32Array(SKY_BUCKETS),
		large: []
	};
	set.bucketStart.fill(count);
	grains.forEach((grain, index) => {
		set.x[index] = grain.x;
		set.y[index] = grain.y;
		set.z[index] = grain.z;
		set.keep[index] = grain.keep;
		set.cls[index] = grain.cls;
		set.tint[index] = grain.tint;
		set.bucketStart[grain.bucket] = Math.min(set.bucketStart[grain.bucket], index);
		set.bucketEnd[grain.bucket] = index + 1;
		if (grain.cls === classes.length - 1) set.large.push(index);
	});
	return set;
}

/** Uniform direction from two uniforms, at radius `radius`. */
function onSphere(u, v, radius) {
	const angle = u * TAU;
	const lift = v * 2 - 1;
	const ring = Math.sqrt(Math.max(0, 1 - lift * lift));
	return [Math.cos(angle) * ring * radius, lift * radius, Math.sin(angle) * ring * radius];
}

/**
 * Build the sky shell: uniform directions, radius in a thin `[0.95, 1.05]` band.
 * @returns flat grain arrays (see {@link createGrainSet}); 3% of the L class are bright.
 */
function createSkyShell() {
	return createGrainSet(SKY_CLASSES, "sky-shell-grain", ([u, v, w]) => onSphere(u, v, SKY_RADIUS * (0.95 + 0.1 * w)), 0.03);
}

/**
 * Field stars: a sparse inner volume of the same hard squares (the reference's
 * parallax layer), `r = Rv·(0.3 + 0.7·∛u)` so nothing piles up at the centre.
 * Unit radius is the shell's. Rv spans the node cloud (~0.7 of the shell): a thin
 * shell alone projects twice as dense at the limb as in the middle, and this layer
 * evens the disc out; a tighter volume reads as a central clump instead.
 */
const FIELD_RADIUS = 0.7;
const FIELD_CLASSES = [
	{ count: 546, size: 1.2 },
	{ count: 234, size: 2 }
];
function createFieldStars() {
	return createGrainSet(FIELD_CLASSES, "field-star-grain", ([u, v, w]) => onSphere(u, v, FIELD_RADIUS * (0.3 + 0.7 * Math.cbrt(w))), 0);
}

/**
 * Drifting field stars (Galaxy View `buildFieldStars`): up to 2000 points scattered
 * through a volume around the galaxy, `r = V·(0.3 + 0.7·∛u)`, sized by distance so
 * they parallax against the shell while the camera moves. Unit volume radius; the
 * renderer scales it and draws the first `1200·density` of them.
 * @returns `{ count, x, y, z, tint }` with tint 0 cool, 1 warm, 2 blue.
 */
const DRIFT_STARS = 2000;
function createDriftStars() {
	const x = new Float32Array(DRIFT_STARS);
	const y = new Float32Array(DRIFT_STARS);
	const z = new Float32Array(DRIFT_STARS);
	const tint = new Uint8Array(DRIFT_STARS);
	const mixA = new Float32Array(DRIFT_STARS);
	for (let index = 0; index < DRIFT_STARS; index += 1) {
		const [u, v, w, pick, mix] = hashStreams(`drift-star/${index}`, 5);
		const [px, py, pz] = onSphere(u, v, 0.3 + 0.7 * Math.cbrt(w));
		x[index] = px;
		y[index] = py;
		z[index] = pz;
		tint[index] = pick < 0.85 ? 0 : pick < 0.89 ? 1 : 2;
		mixA[index] = mix;
	}
	return { count: DRIFT_STARS, x, y, z, tint, mix: mixA };
}

/**
 * Deep sky: stars at infinity (unit directions only), so they stay around the frame
 * however far the camera pulls back. Mostly 1 px, some 1.5, a few 2.
 * @returns `{ count, x, y, z, size, tint, glow }`.
 */
const DEEP_SKY_STARS = 5200;
function createDeepSky() {
	const x = new Float32Array(DEEP_SKY_STARS);
	const y = new Float32Array(DEEP_SKY_STARS);
	const z = new Float32Array(DEEP_SKY_STARS);
	const size = new Float32Array(DEEP_SKY_STARS);
	const tint = new Uint8Array(DEEP_SKY_STARS);
	const glow = new Float32Array(DEEP_SKY_STARS);
	for (let index = 0; index < DEEP_SKY_STARS; index += 1) {
		const [u, v, s, pick, light] = hashStreams(`deep-sky/${index}`, 5);
		const [px, py, pz] = onSphere(u, v, 1);
		x[index] = px;
		y[index] = py;
		z[index] = pz;
		size[index] = s < 0.7 ? 1 : s < 0.94 ? 1.5 : 2;
		tint[index] = pick < 0.82 ? 0 : pick < 0.86 ? 1 : 2;
		glow[index] = 0.35 + 0.65 * light;
	}
	return { count: DEEP_SKY_STARS, x, y, z, size, tint, glow };
}

/**
 * Parse the filter syntax shared with Galaxy View's note filter: words are ANDed,
 * `-word` excludes, `path:x` matches only paths, `file:x` / `name:x` only names,
 * `"two words"` is one phrase. Case-insensitive.
 * @returns `null` for an empty query, else `{ terms: [{ negate, field, value }] }`.
 */
function parseFilter(query) {
	if (typeof query !== "string" || query.trim() === "") return null;
	const terms = [];
	const pattern = /(-?)(?:(path|file|name):)?(?:"([^"]*)"?|(\S+))/gi;
	let match;
	while ((match = pattern.exec(query)) !== null) {
		if (match[0] === "") {
			pattern.lastIndex += 1;
			continue;
		}
		const value = (match[3] ?? match[4] ?? "").toLowerCase();
		if (value === "" || value === "-") continue;
		const field = match[2] === undefined ? "any" : match[2].toLowerCase() === "path" ? "path" : "name";
		terms.push({ negate: match[1] === "-", field, value });
	}
	return terms.length === 0 ? null : { terms };
}

/** True when `{ name, path }` (lower- or mixed-case strings) satisfies a parsed filter. */
function filterAccepts(parsed, fields) {
	if (parsed === null || parsed === undefined) return true;
	const name = String(fields?.name ?? "").toLowerCase();
	const path = String(fields?.path ?? "").toLowerCase();
	return parsed.terms.every((term) => {
		const hit = term.field === "path" ? path.includes(term.value) : term.field === "name" ? name.includes(term.value) : name.includes(term.value) || path.includes(term.value);
		return term.negate ? !hit : hit;
	});
}

/**
 * Keep at most `cap` stars: every sun, then the most linked and most recent
 * conversations (the mobile tier's 1500-node cap). Links are remapped.
 */
function capGraph(graph, cap) {
	if (!Number.isFinite(cap) || graph.nodes.length <= cap) return graph;
	const degree = new Array(graph.nodes.length).fill(0);
	for (const link of graph.links) {
		degree[link.a] += 1;
		degree[link.b] += 1;
	}
	const ranked = graph.nodes
		.map((node, index) => ({ node, index }))
		.sort((left, right) => {
			const folder = (right.node.kind === "folder" ? 1 : 0) - (left.node.kind === "folder" ? 1 : 0);
			return folder || degree[right.index] - degree[left.index] || (right.node.updatedAt ?? 0) - (left.node.updatedAt ?? 0) || left.index - right.index;
		})
		.slice(0, cap)
		.sort((left, right) => left.index - right.index);
	const remap = new Map(ranked.map((entry, position) => [entry.index, position]));
	const nodes = ranked.map((entry, position) => {
		entry.node.index = position;
		return entry.node;
	});
	const links = graph.links.filter((link) => remap.has(link.a) && remap.has(link.b)).map((link) => ({ ...link, a: remap.get(link.a), b: remap.get(link.b) }));
	return { ...graph, nodes, links, capped: graph.nodes.length };
}

/**
 * Shortest link path between two node indices (breadth-first, undirected).
 * @returns node indices from `from` to `to`, or `null` when they are not connected.
 */
function shortestPath(graph, from, to) {
	const count = graph.nodes.length;
	if (from < 0 || to < 0 || from >= count || to >= count) return null;
	if (from === to) return [from];
	const adjacency = Array.from({ length: count }, () => []);
	for (const link of graph.links) {
		adjacency[link.a].push(link.b);
		adjacency[link.b].push(link.a);
	}
	const previous = new Int32Array(count).fill(-1);
	previous[from] = from;
	const queue = [from];
	for (let head = 0; head < queue.length; head += 1) {
		const at = queue[head];
		for (const next of adjacency[at]) {
			if (previous[next] !== -1) continue;
			previous[next] = at;
			if (next === to) {
				const path = [to];
				for (let step = to; step !== from; step = previous[step]) path.push(previous[step]);
				return path.reverse();
			}
			queue.push(next);
		}
	}
	return null;
}

		// ── src/physics.js ─────────────────────────────────────────────
/**
 * Force layer over the analytic layout: the seven Galaxy View physics sliders
 * (repel, link distance, link strength, centre pull, flatten, core gravity, spiral)
 * integrated d3-force style (velocity decay 0.6, alpha decay 1 − 0.001^(1/300)).
 *
 * Every star is anchored to its analytic home, so the silhouette a preset picked
 * survives. The forces that would otherwise collapse or explode that silhouette act
 * as deviations from the shipped defaults, so the default settings settle on the
 * analytic layout (lightly de-clumped by repel) and each slider bends it from there.
 * Pure: no DOM; `scripts/build.mjs` inlines it, `scripts/selfcheck.mjs` imports it.
 */

const PHYSICS_DEFAULTS = { repel: 170, linkDistance: 55, linkStrength: 1.1, centerPull: 0.05, flatten: 0.55, coreGravity: 0.1, spiral: 0.02 };
const PHYSICS_KEYS = Object.keys(PHYSICS_DEFAULTS);
const SIM_ALPHA_DECAY = 1 - Math.pow(0.001, 1 / 300);
const SIM_ALPHA_MIN = 0.001;
const SIM_VELOCITY_KEEP = 0.4;
const SIM_ANCHOR = 0.1;
/** Repel 170 pushes two stars 0.03 apart by ~0.0017 per tick at alpha 1. */
const SIM_REPEL_UNIT = 3e-7;
const SIM_REPEL_REACH = 0.45;
const SIM_REPEL_FLOOR = 0.012;

function physicsOf(settings) {
	const params = {};
	for (const key of PHYSICS_KEYS) params[key] = Number.isFinite(settings?.[key]) ? settings[key] : PHYSICS_DEFAULTS[key];
	return params;
}

/**
 * Seed a simulation from galaxy nodes (their current x/y/z are the analytic homes).
 * @param warm - optional `Map(id → [x, y, z])` of positions from the previous run.
 */
function createSimulation(nodes, links, warm) {
	const count = nodes.length;
	const home = new Float64Array(count * 3);
	const pos = new Float64Array(count * 3);
	const vel = new Float64Array(count * 3);
	const degree = new Float64Array(count).fill(0);
	let warmed = 0;
	nodes.forEach((node, index) => {
		home[index * 3] = node.x;
		home[index * 3 + 1] = node.y;
		home[index * 3 + 2] = node.z;
		const seen = warm?.get(node.id);
		const from = Array.isArray(seen) && seen.every(Number.isFinite) ? seen : [node.x, node.y, node.z];
		if (from !== seen) pos.set([node.x, node.y, node.z], index * 3);
		else {
			pos.set(from, index * 3);
			warmed += 1;
		}
	});
	const kept = links.filter((link) => link.a >= 0 && link.b >= 0 && link.a < count && link.b < count && link.a !== link.b);
	const la = new Int32Array(kept.length);
	const lb = new Int32Array(kept.length);
	const rest = new Float64Array(kept.length);
	kept.forEach((link, index) => {
		la[index] = link.a;
		lb[index] = link.b;
		degree[link.a] += 1;
		degree[link.b] += 1;
		const dx = home[link.b * 3] - home[link.a * 3];
		const dy = home[link.b * 3 + 1] - home[link.a * 3 + 1];
		const dz = home[link.b * 3 + 2] - home[link.a * 3 + 2];
		rest[index] = Math.max(0.004, Math.hypot(dx, dy, dz));
	});
	let degreeSum = 0;
	for (let index = 0; index < count; index += 1) {
		degree[index] = Math.max(1, degree[index]);
		degreeSum += degree[index];
	}
	return {
		count,
		home,
		pos,
		vel,
		degree,
		meanDegree: count === 0 ? 1 : degreeSum / count,
		la,
		lb,
		rest,
		alpha: warmed > count * 0.6 ? 0.3 : 1,
		ticks: 0,
		limit: Infinity
	};
}

/** Wake a settled simulation (after a slider moved). */
function reheatSimulation(sim, alpha) {
	sim.alpha = Math.max(sim.alpha, alpha);
}

function simulationSettled(sim) {
	return sim.alpha < SIM_ALPHA_MIN;
}

/**
 * Many-body repulsion: direct pairs up to 800 stars; beyond that a uniform grid
 * (cell = reach) so only pairs within SIM_REPEL_REACH are visited.
 */
function applyRepel(sim, strength, alpha) {
	if (strength <= 0) return;
	const { count, pos, vel } = sim;
	const reach2 = SIM_REPEL_REACH * SIM_REPEL_REACH;
	const floor2 = SIM_REPEL_FLOOR * SIM_REPEL_FLOOR;
	const k = strength * alpha;
	const pair = (i, j) => {
		const dx = pos[i * 3] - pos[j * 3];
		const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
		const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
		const d2 = dx * dx + dy * dy + dz * dz;
		if (d2 >= reach2) return;
		if (d2 === 0) {
			const jitter = ((i * 7919 + j) % 13) / 13 - 0.5;
			vel[i * 3] += jitter * 1e-4;
			vel[j * 3] -= jitter * 1e-4;
			return;
		}
		const w = k / Math.max(d2, floor2);
		vel[i * 3] += dx * w;
		vel[i * 3 + 1] += dy * w;
		vel[i * 3 + 2] += dz * w;
		vel[j * 3] -= dx * w;
		vel[j * 3 + 1] -= dy * w;
		vel[j * 3 + 2] -= dz * w;
	};
	if (count <= 800) {
		for (let i = 0; i < count; i += 1) for (let j = i + 1; j < count; j += 1) pair(i, j);
		return;
	}
	const cell = SIM_REPEL_REACH;
	const side = Math.ceil(8 / cell);
	const half = side >> 1;
	const cellOf = new Int32Array(count);
	const counts = new Int32Array(side * side * side + 1);
	const clampCell = (value) => Math.max(0, Math.min(side - 1, Math.floor(value / cell) + half));
	for (let i = 0; i < count; i += 1) {
		const c = (clampCell(pos[i * 3]) * side + clampCell(pos[i * 3 + 1])) * side + clampCell(pos[i * 3 + 2]);
		cellOf[i] = c;
		counts[c + 1] += 1;
	}
	for (let c = 1; c < counts.length; c += 1) counts[c] += counts[c - 1];
	const order = new Int32Array(count);
	const fill = counts.slice(0, -1);
	for (let i = 0; i < count; i += 1) order[fill[cellOf[i]]++] = i;
	for (let i = 0; i < count; i += 1) {
		const c = cellOf[i];
		const cz = c % side;
		const cy = ((c - cz) / side) % side;
		const cx = Math.floor(c / (side * side));
		for (let ox = -1; ox <= 1; ox += 1) {
			const x = cx + ox;
			if (x < 0 || x >= side) continue;
			for (let oy = -1; oy <= 1; oy += 1) {
				const y = cy + oy;
				if (y < 0 || y >= side) continue;
				for (let oz = -1; oz <= 1; oz += 1) {
					const z = cz + oz;
					if (z < 0 || z >= side) continue;
					const other = (x * side + y) * side + z;
					for (let slot = counts[other]; slot < counts[other + 1]; slot += 1) {
						const j = order[slot];
						if (j > i) pair(i, j);
					}
				}
			}
		}
	}
}
/**
 * One tick. Returns true while the simulation is still moving.
 * @param params - physics slider values (see {@link PHYSICS_DEFAULTS}).
 * @param reach - stars are kept inside this radius so the shell still frames them.
 */
function stepSimulation(sim, params, reach) {
	if (simulationSettled(sim) || sim.count === 0) return false;
	const alpha = sim.alpha;
	const { count, home, pos, vel, degree, la, lb, rest } = sim;
	const p = { ...PHYSICS_DEFAULTS, ...params };

	// Links: d3 forceLink with rest = analytic length × (distance / 55) and strength
	// min(1, mult·0.5 / min(endpoint degree)), split by degree bias.
	const lengthScale = Math.min(2.5, Math.max(0.1, p.linkDistance / PHYSICS_DEFAULTS.linkDistance));
	for (let index = 0; index < la.length; index += 1) {
		const a = la[index];
		const b = lb[index];
		let dx = pos[b * 3] + vel[b * 3] - pos[a * 3] - vel[a * 3];
		let dy = pos[b * 3 + 1] + vel[b * 3 + 1] - pos[a * 3 + 1] - vel[a * 3 + 1];
		let dz = pos[b * 3 + 2] + vel[b * 3 + 2] - pos[a * 3 + 2] - vel[a * 3 + 2];
		const d = Math.hypot(dx, dy, dz) || 1e-6;
		const strength = Math.min(1, (Math.max(0, p.linkStrength) * 0.5) / Math.min(degree[a], degree[b]));
		const l = ((d - rest[index] * lengthScale) / d) * alpha * strength;
		dx *= l;
		dy *= l;
		dz *= l;
		const bias = degree[a] / (degree[a] + degree[b]);
		vel[b * 3] -= dx * bias;
		vel[b * 3 + 1] -= dy * bias;
		vel[b * 3 + 2] -= dz * bias;
		vel[a * 3] += dx * (1 - bias);
		vel[a * 3 + 1] += dy * (1 - bias);
		vel[a * 3 + 2] += dz * (1 - bias);
	}

	applyRepel(sim, Math.max(0, p.repel) * SIM_REPEL_UNIT, alpha);

	// Anchor + centre pull + flatten: one linear spring per axis toward A·home, so a
	// pull above the default shrinks the body and one below lets it swell.
	const centre = p.centerPull - PHYSICS_DEFAULTS.centerPull;
	const flatten = (p.flatten - PHYSICS_DEFAULTS.flatten) * 0.12;
	const springXZ = Math.max(0.025, SIM_ANCHOR + centre);
	const springY = Math.max(0.025, SIM_ANCHOR + centre + flatten);
	// Core gravity and spiral swirl, Galaxy View's galaxyForces.ts in unit radius.
	const core = (p.coreGravity - PHYSICS_DEFAULTS.coreGravity) * 0.25;
	const swirl = (p.spiral - PHYSICS_DEFAULTS.spiral) * 0.6;
	for (let index = 0; index < count; index += 1) {
		const at = index * 3;
		const x = pos[at];
		const y = pos[at + 1];
		const z = pos[at + 2];
		vel[at] += (home[at] * SIM_ANCHOR - x * springXZ) * alpha;
		vel[at + 1] += (home[at + 1] * SIM_ANCHOR - y * springY) * alpha;
		vel[at + 2] += (home[at + 2] * SIM_ANCHOR - z * springXZ) * alpha;
		const r = Math.hypot(x, z);
		if (r > 1e-4 && core !== 0) {
			const weight = Math.min(3, Math.max(0.3, degree[index] / sim.meanDegree));
			const pull = core * weight * alpha;
			vel[at] -= x * pull;
			vel[at + 2] -= z * pull;
		}
		if (r > 1e-3 && swirl !== 0) {
			const k = (swirl * alpha) / (1 + r / 0.8);
			vel[at] += -z * k;
			vel[at + 2] += x * k;
		}
	}

	for (let index = 0; index < count; index += 1) {
		const at = index * 3;
		vel[at] *= SIM_VELOCITY_KEEP;
		vel[at + 1] *= SIM_VELOCITY_KEEP;
		vel[at + 2] *= SIM_VELOCITY_KEEP;
		pos[at] += vel[at];
		pos[at + 1] += vel[at + 1];
		pos[at + 2] += vel[at + 2];
		const radius = Math.hypot(pos[at], pos[at + 1], pos[at + 2]);
		if (Number.isFinite(reach) && radius > reach) {
			const pull = reach / radius;
			pos[at] *= pull;
			pos[at + 1] *= pull;
			pos[at + 2] *= pull;
		}
	}
	sim.alpha += (0 - sim.alpha) * SIM_ALPHA_DECAY;
	sim.ticks += 1;
	return !simulationSettled(sim);
}

/** Copy simulated positions back onto the galaxy nodes. */
function writeSimulation(sim, nodes) {
	for (let index = 0; index < sim.count && index < nodes.length; index += 1) {
		const node = nodes[index];
		// A working agent is placed by `orbitAgents` every frame. Writing the simulation's copy
		// back would drag it off the track to its old seat and back — a per-frame flicker that
		// read as the body vanishing for a second.
		// A flying body is placed by the agent layer (exit, lap or return); writing the simulation's
		// copy back made a returning body jitter between its seat and the glide.
		if (node.running === true || node.agentOrbit === true || node.launchFrom !== undefined || node.returningFrom !== undefined) continue;
		node.x = sim.pos[index * 3];
		node.y = sim.pos[index * 3 + 1];
		node.z = sim.pos[index * 3 + 2];
	}
}

/** Run to rest synchronously (selfcheck and tests). */
function settleSimulation(sim, params, reach, maxTicks = 400) {
	while (sim.ticks < maxTicks && stepSimulation(sim, params, reach));
	return sim;
}

		// ── src/stars.js ───────────────────────────────────────────────
/**
 * Pure star, link and haze look: the Galaxy View node recipe translated to Canvas 2D.
 *
 * Colour maths, the disc profile, the link tint and the haze billboards live here so
 * `scripts/selfcheck.mjs` can check them in Node. The sprite bakers at the bottom only
 * touch `document` when called; `scripts/build.mjs` inlines this file into the client
 * bundle after `src/graph-model.js` (and strips the import below).
 */

/**
 * Plateau saturation and lightness of a star body. Read off a close-up Obsidian Galaxy
 * View screenshot after its tone mapping and bloom (cyan ≈ rgb(156,226,228), gold ≈
 * rgb(238,217,154), violet ≈ rgb(178,150,227)). The rim plateau is S 0.7 / L 0.66 and
 * the interior lightens toward the core ({@link discSample}). Red–orange bodies
 * sit deeper and more saturated (≈ rgb(229,105,53)), see {@link starPlateau}.
 */
const STAR_SATURATION = 0.7;
/**
 * 星体亮度 → body gain. 0.3–0.5 keeps 0.55 + 0.9·b (exactly 1 at the default 0.5); below
 * it dims toward 0.1, above it rises past 1 and the extra is drawn as an additive pass.
 * Lives here beside the constants it scales so the settled values can be checked.
 */
/** 星体亮度's ceiling, shared by the slider and the gain curve (the default sits at 1.2). */
const BRIGHTNESS_MAX = 2.4;

function brightnessGain(brightness) {
	const b = Math.min(BRIGHTNESS_MAX, Math.max(0, Number(brightness) || 0));
	if (b < 0.3) return 0.1 + 2.4 * b;
	if (b <= 0.5) return 0.55 + 0.9 * b;
	return 1 + (b - 0.5) * 1.2;
}

/** 星体亮度 is settled (owner-approved): do not retune these three without being asked. */
const STAR_LIGHTNESS = 0.72;
/** The white-hot core never reaches pure white. */
const STAR_CORE = [244, 247, 245];
/** Peak channel of a body's plateau. Settled with STAR_LIGHTNESS — see above. */
const STAR_PEAK = 250;
/** Fixed screen-space halos in CSS px, independent of the body size. */
const HALO_INNER = { sigma: 3.4, radius: 14 };
const HALO_OUTER = { sigma: 11, radius: 34 };

function starClamp01(value) {
	return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** GLSL smoothstep; `e0 > e1` gives the inverted ramp. */
function smoothstep(e0, e1, x) {
	const t = starClamp01((x - e0) / (e1 - e0));
	return t * t * (3 - 2 * t);
}

/** HSL (hue in degrees, s and l in 0–1) → [r, g, b] in 0–255. */
function hslToRgb(hue, saturation, lightness) {
	const h = (((hue % 360) + 360) % 360) / 60;
	const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
	const x = chroma * (1 - Math.abs((h % 2) - 1));
	const m = lightness - chroma / 2;
	const [r, g, b] = h < 1 ? [chroma, x, 0] : h < 2 ? [x, chroma, 0] : h < 3 ? [0, chroma, x] : h < 4 ? [0, x, chroma] : h < 5 ? [x, 0, chroma] : [chroma, 0, x];
	return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

/** [r, g, b] in 0–255 → [hue°, s, l]. */
function rgbToHsl(r, g, b) {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const lightness = (max + min) / 2;
	if (max === min) return [0, 0, lightness];
	const delta = max - min;
	const saturation = delta / (1 - Math.abs(2 * lightness - 1));
	let hue = max === rn ? ((gn - bn) / delta) % 6 : max === gn ? (bn - rn) / delta + 2 : (rn - gn) / delta + 4;
	hue *= 60;
	return [hue < 0 ? hue + 360 : hue, saturation, lightness];
}

/**
 * Body plateau colour for a hue, peak channel capped at {@link STAR_PEAK}. At night,
 * hues within ±24° of 18° (red–orange) trade up to 0.14 lightness for 0.16 saturation,
 * so they read as deep embers instead of pastel salmon.
 * @param tone - optional palette `[saturation, lightness]` for slots that are not a plain
 *   hue (cream, silver, a pale gold); it replaces the defaults and the ember shift.
 *   An explicit `lightness` still wins over the tone's lightness.
 */
function starPlateau(hue, lightness, tone) {
	const given = Number.isFinite(lightness);
	const toned = Array.isArray(tone);
	const h = (((hue % 360) + 360) % 360);
	const warm = given || toned ? 0 : smoothstep(24, 0, Math.min(Math.abs(h - 18), 360 - Math.abs(h - 18)));
	const saturation = toned ? tone[0] : STAR_SATURATION;
	const rgb = hslToRgb(hue, Math.min(1, saturation + 0.16 * warm), (given ? lightness : toned ? tone[1] : STAR_LIGHTNESS) - 0.14 * warm);
	const peak = Math.max(...rgb);
	return peak <= STAR_PEAK ? rgb : rgb.map((channel) => Math.round((channel * STAR_PEAK) / peak));
}

/**
 * Disc profile at `d = r / (2·rd)` (0 at the centre, 0.5 at the rim): solid to 0.9·rd with
 * a crisp edge to 0 at rd. The white mix falls off as `core·(1 − r/rd)^2.4` across the whole
 * disc, so a body reads as an emissive sphere (hot centre, saturated rim) rather than a
 * flat bead with a dot, as in the close-up reference.
 * @returns `[alpha, white]`, where white is the mix toward {@link STAR_CORE}.
 */
function discSample(d, core) {
	// A body is a solid disc, not a pane of glass: fully opaque out to 96% of the radius,
	// then a 4% ramp. The white-hot centre is *confined to the inner quarter of the radius*
	// and fades into the body's own colour from there — a small hot core, not a bleached
	// disc — which is what makes the body read as a star with a colour rather than a blob.
	// Opaque material: full alpha across the disc with only a 2% antialiased edge. The
	// transparency the owner objected to lived here (a 4% ramp plus brightness thinning the
	// body below); dimming is now carried by the semantic fades and the light, not by
	// making the star see-through.
	const alpha = smoothstep(0.5, 0.49, d);
	const white = (core ?? 0.75) * smoothstep(0.17, 0.01, d);
	return [alpha, white];
}

/** Colour of a disc pixel: the plateau mixed toward the core by `white`. */
function discColour(plateau, white) {
	return [0, 1, 2].map((channel) => Math.round(plateau[channel] + (STAR_CORE[channel] - plateau[channel]) * white));
}

/**
 * 辉光范围 → the halo's drawn span. The halos are baked gaussians, so drawing one
 * larger spreads the same light over more pixels and reads as "nothing happened";
 * {@link bloomSpanGain} restores the peak by the area ratio.
 */
function bloomSpan(bloom) {
	return 0.55 + (Number.isFinite(Number(bloom)) ? starClamp01(Number(bloom)) : 0) * 1.3;
}

/**
 * Alpha that keeps a wider halo as bright as the neutral span. The halos are baked
 * gaussians, so the drawn size and the alpha must move together: the gain is the
 * area ratio (span²) against the default span, so the shipped presets look exactly
 * as before while dragging 辉光范围 visibly grows or shrinks the glow.
 */
const BLOOM_NEUTRAL_SPAN = bloomSpan(0.44);
function bloomSpanGain(bloom) {
	const ratio = bloomSpan(bloom) / BLOOM_NEUTRAL_SPAN;
	return Math.min(2.6, Math.max(0.2, ratio * ratio));
}

/**
 * A body's bloom brightness from its own mass (the quantity that also sizes it), 0–1.
 * Mass rather than the projected dot, so 阈值 means the same thing at every zoom:
 * a small conversation sits low, its workspace sun sits high.
 */
function bloomLuminance(mass) {
	const value = Number.isFinite(mass) ? mass : 0;
	return starClamp01((value - 0.55) / 1.15);
}

/**
 * 阈值 → which bodies bloom, as Galaxy View means it: a body glows above the
 * threshold, with a soft ramp so dragging the slider dims the small stars first,
 * leaves only the suns, and finally nothing.
 */
function bloomGate(luminance, threshold) {
	const at = Number.isFinite(Number(threshold)) ? starClamp01(Number(threshold)) : 0;
	const low = Number.isFinite(luminance) ? starClamp01(luminance) : 0;
	return smoothstep(at - 0.22, at + 0.22, low);
}

/** Inner halo peak alpha for a body radius in CSS px: `0.6·min(1, (rd/3)²)`, standing in for the reference's bloom pass. */
function innerHaloAlpha(rd) {
	return 0.72 * Math.min(1, (rd / 3) ** 2);
}

/**
 * Link colour from its two endpoint plateaus: the mixed hue at the reference's 0.4×
 * saturation (`palette.ts linkColor`) on a light wire (`l 0.76`), so links read as
 * teal / amber threads like the bloomed Obsidian graph rather than grey.
 * `touched` is the selected tier (`s·1.2`, `l 0.8`).
 */
function linkTint(colourA, colourB, touched) {
	const [hue, saturation] = rgbToHsl((colourA[0] + colourB[0]) / 2, (colourA[1] + colourB[1]) / 2, (colourA[2] + colourB[2]) / 2);
	return touched ? hslToRgb(hue, Math.min(1, saturation * 1.2), 0.86) : hslToRgb(hue, saturation * 0.4, 0.81);
}

/** WCAG relative luminance of an sRGB colour (0 black, 1 white). */
function relativeLuminance([r, g, b]) {
	const linear = (channel) => {
		const value = channel / 255;
		return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** sRGB 0–255 → Oklab `[L, a, b]` (Björn Ottosson's matrices). */
function srgbToOklab([r, g, b]) {
	const linear = (channel) => {
		const value = channel / 255;
		return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
	};
	const [lr, lg, lb] = [linear(r), linear(g), linear(b)];
	const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
	const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
	const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
	return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

/** Oklab → linear sRGB, unclamped (a channel outside 0–1 means out of gamut). */
function oklabToLinear(lightness, a, b) {
	const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}

/** OKLCH → sRGB 0–255, shrinking chroma until the colour fits the gamut. */
function oklchToRgb(lightness, chroma, hue) {
	let c = chroma;
	let linear = oklabToLinear(lightness, c * Math.cos(hue), c * Math.sin(hue));
	for (let step = 0; step < 24 && linear.some((channel) => channel < 0 || channel > 1); step += 1) {
		c *= 0.9;
		linear = oklabToLinear(lightness, c * Math.cos(hue), c * Math.sin(hue));
	}
	return linear.map((channel) => {
		const value = Math.min(1, Math.max(0, channel));
		return Math.round(255 * (value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055));
	});
}

/** Link-end OKLCH lightness and chroma cap, resting and selected. */
const LINK_END = { lightness: 0.74, chroma: 0.07 };
const LINK_END_TOUCHED = { lightness: 0.84, chroma: 0.095 };

/**
 * One end of a gradient link: the endpoint star's own hue at one shared OKLCH
 * lightness and a capped chroma. Equal HSL lightness and saturation are neither
 * equally bright nor equally colourful: cyan read twice as bright as violet and
 * more saturated than everything else, so its links outshone the rest. Pale slots
 * (silver, cream) keep their own lower chroma.
 */
function linkEnd(colour, touched) {
	const [, a, b] = srgbToOklab(colour);
	const target = touched ? LINK_END_TOUCHED : LINK_END;
	return oklchToRgb(target.lightness, Math.min(Math.hypot(a, b), target.chroma), Math.atan2(b, a));
}

/**
 * 连线亮度 applied to a link colour in OKLab: below 1 scales lightness towards
 * black, above 1 lifts it towards white (fully white at 2.5) while keeping the
 * hue and as much chroma as the gamut allows, so a green link stays green.
 */
function linkShade(colour, brightness) {
	if (brightness === 1) return colour;
	const [lightness, a, b] = srgbToOklab(colour);
	const target = brightness < 1 ? lightness * brightness : lightness + (1 - lightness) * Math.min(1, (brightness - 1) / 1.5);
	return oklchToRgb(Math.min(1, Math.max(0, target)), Math.hypot(a, b), Math.atan2(b, a));
}

/**
 * World-space nebula billboards (recipe §4): 6 centres × 24 sprites around the core,
 * tinted between the first two palette colours. Each centre owns one colour, so the
 * renderer needs only six cached sprites; per-sprite brightness rides on alpha.
 * @param shellRadius - radius of the sky shell; the cloud spans `R = 0.4·shellRadius`.
 * @returns `{ colours: [[r,g,b]×6], sprites: [{ x, y, z, d, c, a }] }`.
 */
function createNebula(shellRadius, colourA, colourB) {
	const spread = 0.4 * shellRadius;
	const colours = [];
	const sprites = [];
	for (let centre = 0; centre < 6; centre += 1) {
		const [cu, cv, cw, cd, ct, cl] = hashStreams(`nebula-centre/${centre}`, 6);
		const mixed = [0, 1, 2].map((channel) => colourA[channel] + (colourB[channel] - colourA[channel]) * ct);
		const [hue, saturation] = rgbToHsl(mixed[0], mixed[1], mixed[2]);
		colours.push(hslToRgb(hue + (cl - 0.5) * 18, Math.min(saturation * 0.85, 0.9), 0.2));
		const lightness = 0.16 + 0.08 * cl;
		const distance = spread * (0.7 + 1.7 * cd);
		const angle = cu * Math.PI * 2;
		const cx = Math.cos(angle) * distance;
		const cz = Math.sin(angle) * distance;
		const cy = (cv - 0.5) * distance * 0.75;
		const reach = spread * (0.5 + 0.5 * cw);
		for (let index = 0; index < 24; index += 1) {
			const s = hashStreams(`nebula-sprite:${centre}:${index}`, 11);
			const big = s[9] < 0.25;
			sprites.push({
				x: cx + (s[0] + s[1] + s[2] - 1.5) * reach,
				y: cy + (s[3] + s[4] + s[5] - 1.5) * reach * 0.8,
				z: cz + (s[6] + s[7] + s[8] - 1.5) * reach,
				d: spread * (big ? 1 + 0.8 * s[10] : 0.4 + 0.5 * s[10]),
				c: centre,
				a: (lightness / 0.2) * (0.85 + 0.3 * hash01(`nebula-jitter#${centre * 24 + index}`))
			});
		}
	}
	return { colours, sprites };
}

/**
 * Cluster clouds: up to twelve of the largest workspaces with at least five stars get
 * three soft sprites at their members' centroid, in the workspace colour at L 0.46.
 * @param members - `[{ hue, points: [{x,y,z}] }]`, one entry per workspace.
 */
function createClusterClouds(members) {
	const ranked = members.filter((entry) => entry.points.length >= 5).sort((a, b) => b.points.length - a.points.length).slice(0, 12);
	const colours = [];
	const sprites = [];
	ranked.forEach((entry, cluster) => {
		const n = entry.points.length;
		const cx = entry.points.reduce((sum, point) => sum + point.x, 0) / n;
		const cy = entry.points.reduce((sum, point) => sum + point.y, 0) / n;
		const cz = entry.points.reduce((sum, point) => sum + point.z, 0) / n;
		const rms = Math.sqrt(entry.points.reduce((sum, point) => sum + (point.x - cx) ** 2 + (point.y - cy) ** 2 + (point.z - cz) ** 2, 0) / n);
		const spread = Math.max(0.05, rms);
		const [hue, saturation] = rgbToHsl(...starPlateau(entry.hue, undefined, entry.tone));
		colours.push(hslToRgb(hue, Math.min(1, saturation * 1.25), 0.46));
		for (let index = 0; index < 3; index += 1) {
			const s = hashStreams(`cluster-cloud:${entry.key}#${index}`, 4);
			sprites.push({ x: cx + (s[0] - 0.5) * spread, y: cy + (s[1] - 0.5) * spread * 0.7, z: cz + (s[2] - 0.5) * spread, d: spread * (1.6 + 0.8 * s[3]), c: cluster, a: 1 });
		}
	});
	return { colours, sprites };
}

/* ── sprite bakers (browser only, all cached) ─────────────────────────────── */

const DISC_CACHE = new Map();
const HALO_CACHE = new Map();
const HAZE_CACHE = new Map();

function starCanvas(size) {
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	return canvas;
}

const SPRITE_BITMAPS = new WeakMap();

/**
 * The drawable for a baked sprite canvas: its ImageBitmap once ready, the canvas until
 * then. Small canvases stay CPU-backed, and Chrome re-uploads such a source for each
 * drawImage onto the GPU frame; a few hundred halos and bodies a frame cost tens of ms.
 * An ImageBitmap is uploaded once and stays resident.
 */
function spriteImage(canvas) {
	const known = SPRITE_BITMAPS.get(canvas);
	if (known !== undefined) return known === null ? canvas : known;
	SPRITE_BITMAPS.set(canvas, null);
	if (typeof createImageBitmap === "function") {
		createImageBitmap(canvas).then(
			(bitmap) => SPRITE_BITMAPS.set(canvas, bitmap),
			() => {}
		);
	}
	return canvas;
}

/**
 * Body sprite baked at its exact device size with 4×4 supersampling, so a 2–5 px
 * disc keeps its soft rim and white core instead of being minified from a big bitmap.
 * @param diameter - drawn diameter in device px (quantised to 0.5 by the caller).
 * @param lightness - optional plateau lightness; omitted means {@link STAR_LIGHTNESS}.
 * @returns `{ canvas, size }` with `size` the sprite side in device px.
 */
/**
 * The sprite ladder. A body's diameter is snapped to one of these before it is baked, so a
 * deep zoom cannot mint a new bitmap every frame (0.5 px steps up to 90 px meant ~180 distinct
 * sizes per hue, each a fresh 4×4-supersampled bake — that is what made the dive stutter).
 */
const STAR_DIAMETERS = [2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96];

/** Nearest ladder diameter, never below 2 px. */
function quantiseDiameter(diameter) {
	const want = Math.max(2, Math.ceil(diameter));
	for (const step of STAR_DIAMETERS) if (step >= want) return step;
	return STAR_DIAMETERS[STAR_DIAMETERS.length - 1];
}

function discSprite(hue, diameter, core, lightness, tone) {
	// The key is quantised on purpose: callers pass a continuous diameter and a continuous
	// lightness (the depth band times 亮度), so a literal key grew the cache one bitmap per frame
	// until the view froze. Quantising bounds it to (hue × ladder step × core × lightness step).
	const key = `${hue}|${quantiseDiameter(diameter)}|${Math.round(core * 100)}|${lightness === undefined ? "" : Math.round(lightness * 100)}|${tone ?? ""}`;
	const hit = DISC_CACHE.get(key);
	if (hit !== undefined) return hit;
	// One bitmap per ladder step, never one per zoom frame: a disc above 32 px is a smooth
	// radial gradient, so scaling the 32 px bake up is indistinguishable from baking at 96 px
	// and costs 9× less — and the size can stay continuous instead of snapping.
	const bake = Math.min(32, quantiseDiameter(diameter));
	const size = bake + 2;
	const canvas = starCanvas(size);
	const paint = canvas.getContext("2d");
	const image = paint.createImageData(size, size);
	const plateau = starPlateau(hue, lightness, tone);
	const centre = size / 2;
	// 4×4 samples buy the soft rim on a 2–10 px disc; above that the rim is several pixels wide
	// on its own, so 2×2 (1× past 40 px) is the same pixels for a fraction of the bake.
	const supersample = size > 40 ? 1 : size > 20 ? 2 : 4;
	const samples = supersample * supersample;
	for (let y = 0; y < size; y += 1) {
		for (let x = 0; x < size; x += 1) {
			let alpha = 0;
			let r = 0;
			let g = 0;
			let b = 0;
			for (let sy = 0; sy < supersample; sy += 1) {
				for (let sx = 0; sx < supersample; sx += 1) {
					const d = Math.hypot(x + (sx + 0.5) / supersample - centre, y + (sy + 0.5) / supersample - centre) / bake;
					const [a, white] = discSample(d, core);
					if (a <= 0) continue;
					const [cr, cg, cb] = discColour(plateau, white);
					alpha += a;
					r += cr * a;
					g += cg * a;
					b += cb * a;
				}
			}
			const at = (y * size + x) * 4;
			if (alpha > 0) {
				image.data[at] = Math.round(r / alpha);
				image.data[at + 1] = Math.round(g / alpha);
				image.data[at + 2] = Math.round(b / alpha);
			}
			image.data[at + 3] = Math.round((alpha / samples) * 255);
		}
	}
	paint.putImageData(image, 0, 0);
	const sprite = { canvas, size };
	DISC_CACHE.set(key, sprite);
	return sprite;
}

/** Gaussian halo in the star hue at L 50% (the tone's saturation when given), `sigma`/`radius` in CSS px, baked per dpr. */
function haloSprite(hue, halo, dpr, tone) {
	const key = `${hue}|${halo.sigma}|${dpr}|${tone ?? ""}`;
	const hit = HALO_CACHE.get(key);
	if (hit !== undefined) return hit;
	const size = Math.max(4, Math.round(halo.radius * 2 * dpr));
	const canvas = starCanvas(size);
	const paint = canvas.getContext("2d");
	const image = paint.createImageData(size, size);
	const [r, g, b] = hslToRgb(hue, Array.isArray(tone) ? tone[0] : STAR_SATURATION, 0.5);
	const centre = size / 2;
	const sigma = halo.sigma * dpr;
	for (let y = 0; y < size; y += 1) {
		for (let x = 0; x < size; x += 1) {
			const d2 = (x + 0.5 - centre) ** 2 + (y + 0.5 - centre) ** 2;
			const at = (y * size + x) * 4;
			image.data[at] = r;
			image.data[at + 1] = g;
			image.data[at + 2] = b;
			image.data[at + 3] = d2 < centre * centre ? Math.round(255 * Math.exp(-d2 / (2 * sigma * sigma))) : 0;
		}
	}
	paint.putImageData(image, 0, 0);
	HALO_CACHE.set(key, canvas);
	return canvas;
}

/**
 * Soft haze billboard in one colour. `kind` "nebula" uses `exp(−2.6r²) − 0.0743`
 * over r = 0…1, "cloud" uses `exp(−10d²) − 0.0821` over d = 0…0.5.
 */
function hazeSprite(colour, kind) {
	const key = `${kind}|${colour.join(",")}`;
	const hit = HAZE_CACHE.get(key);
	if (hit !== undefined) return hit;
	const size = 64;
	const canvas = starCanvas(size);
	const paint = canvas.getContext("2d");
	const image = paint.createImageData(size, size);
	const floor = kind === "cloud" ? Math.exp(-10 * 0.25) : Math.exp(-2.6);
	for (let y = 0; y < size; y += 1) {
		for (let x = 0; x < size; x += 1) {
			const r = Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) / (size / 2);
			const value = kind === "cloud" ? Math.exp(-10 * (r / 2) ** 2) : Math.exp(-2.6 * r * r);
			const alpha = r >= 1 ? 0 : Math.max(0, (value - floor) / (1 - floor));
			const at = (y * size + x) * 4;
			image.data[at] = colour[0];
			image.data[at + 1] = colour[1];
			image.data[at + 2] = colour[2];
			image.data[at + 3] = Math.round(alpha * 255);
		}
	}
	paint.putImageData(image, 0, 0);
	HAZE_CACHE.set(key, canvas);
	return canvas;
}

		// ── src/gpu.js ────────────────────────────────────────────────
/**
 * Batched GPU glow layer: every body in one draw call, every halo in a second.
 *
 * The reference implementation (galaxy-view) puts the whole scene into one `THREE.Points`
 * plus one `LineSegments` — under ten draw calls for the entire graph — which is why a
 * thousand nodes never stutter there. This is the same idea without a three.js dependency:
 * one `gl.POINTS` draw for the bodies, one for the halos, all per-node numbers (position,
 * size, colour, core mix, alpha) packed into a single interleaved buffer per frame. The disc
 * look lives in the fragment shader — white-hot core over the hue, soft rim — so there is no
 * sprite atlas and no per-body `drawImage`.
 *
 * Everything fails open: if WebGL is unavailable or a shader refuses to compile, `create` returns
 * null and the Canvas 2D path keeps drawing exactly as before.
 */

const VERTEX = `
attribute vec2 aPos;
attribute float aSize;
attribute vec3 aColour;
attribute float aCore;
attribute float aAlpha;
attribute float aKind;
varying vec3 vColour;
varying float vCore;
varying float vAlpha;
varying float vKind;
uniform float uDpr;
void main() {
	vColour = aColour;
	vCore = aCore;
	vAlpha = aAlpha;
	vKind = aKind;
	gl_PointSize = max(1.0, aSize * uDpr);
	gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision mediump float;
varying vec3 vColour;
varying float vCore;
varying float vAlpha;
varying float vKind;
void main() {
	// gl_PointCoord runs 0..1 with y down; d = 0 at the centre, 1 at the rim.
	vec2 uv = gl_PointCoord - 0.5;
	float d = length(uv) * 2.0;
	if (d > 1.0) discard;
	float alpha;
	vec3 colour;
	if (vKind < 0.5) {
		// Body: an opaque disc with a 4%-wide soft rim and a white-hot core, the same recipe the
		// Canvas 2D disc uses (0.92 white mix, smooth plateau).
		alpha = smoothstep(1.0, 0.92, d) * vAlpha;
		float core = smoothstep(0.62, 0.0, d);
		colour = mix(vColour, vec3(1.0), clamp(vCore * core, 0.0, 1.0));
	} else {
		// Halo: gaussian falloff, drawn additively.
		alpha = exp(-3.4 * d * d) * (1.0 - smoothstep(0.82, 1.0, d)) * vAlpha;
		colour = vColour;
	}
	if (alpha < 0.004) discard;
	gl_FragColor = vec4(colour * alpha, alpha);
}
`;

/** Floats per vertex: pos(2) size(1) colour(3) core(1) alpha(1) kind(1). */
const STRIDE = 9;

function compile(gl, type, source) {
	const shader = gl.createShader(type);
	if (shader === null) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) !== true) {
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

/**
 * @returns {{canvas: HTMLCanvasElement, draw: Function, resize: Function, dispose: Function} | null}
 */
function createGlowLayer() {
	if (typeof document === "undefined") return null;
	let canvas = null;
	let gl = null;
	try {
		canvas = document.createElement("canvas");
		gl = canvas.getContext("webgl2", { alpha: true, antialias: false, depth: false, premultipliedAlpha: true, powerPreference: "high-performance" });
		if (gl === null) gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, premultipliedAlpha: true });
	} catch (error) {
		return null;
	}
	if (gl === null) return null;
	const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
	const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
	if (vertex === null || fragment === null) return null;
	const program = gl.createProgram();
	if (program === null) return null;
	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);
	gl.linkProgram(program);
	if (gl.getProgramParameter(program, gl.LINK_STATUS) !== true) return null;
	gl.useProgram(program);
	gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

	const buffer = gl.createBuffer();
	if (buffer === null) return null;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	const attribute = (name, size, offset) => {
		const at = gl.getAttribLocation(program, name);
		if (at < 0) return;
		gl.enableVertexAttribArray(at);
		gl.vertexAttribPointer(at, size, gl.FLOAT, false, STRIDE * 4, offset * 4);
	};
	attribute("aPos", 2, 0);
	attribute("aSize", 1, 2);
	attribute("aColour", 3, 3);
	attribute("aCore", 1, 6);
	attribute("aAlpha", 1, 7);
	attribute("aKind", 1, 8);
	const dprAt = gl.getUniformLocation(program, "uDpr");
	let data = new Float32Array(STRIDE * 4096);
	let capacity = 4096;

	const ensure = (vertices) => {
		if (vertices <= capacity) return;
		capacity = Math.max(vertices, capacity * 2);
		data = new Float32Array(STRIDE * capacity);
	};

	const draw = (bodies, halos, width, height, dpr, background) => {
		if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
			canvas.width = Math.max(1, Math.round(width * dpr));
			canvas.height = Math.max(1, Math.round(height * dpr));
		}
		gl.viewport(0, 0, canvas.width, canvas.height);
		if (background !== null) {
			gl.clearColor(background[0], background[1], background[2], 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
		} else {
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.uniform1f(dprAt, dpr);
		let drawn = 0;
		const pack = (list, kind) => {
			for (const entry of list) {
				// CSS px → clip space, y flipped (canvas origin is top-left).
				data[drawn * STRIDE] = (entry.x / width) * 2 - 1;
				data[drawn * STRIDE + 1] = 1 - (entry.y / height) * 2;
				data[drawn * STRIDE + 2] = entry.size;
				data[drawn * STRIDE + 3] = entry.colour[0];
				data[drawn * STRIDE + 4] = entry.colour[1];
				data[drawn * STRIDE + 5] = entry.colour[2];
				data[drawn * STRIDE + 6] = kind === 0 ? entry.core : 0;
				data[drawn * STRIDE + 7] = entry.alpha;
				data[drawn * STRIDE + 8] = kind;
				drawn += 1;
			}
		};
		ensure(bodies.length);
		pack(bodies, 0);
		gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, drawn * STRIDE), gl.DYNAMIC_DRAW);
		gl.drawArrays(gl.POINTS, 0, drawn);
		if (halos.length > 0) {
			// Halos add light on top instead of covering it.
			gl.blendFunc(gl.ONE, gl.ONE);
			drawn = 0;
			ensure(halos.length);
			pack(halos, 1);
			gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, drawn * STRIDE), gl.DYNAMIC_DRAW);
			gl.drawArrays(gl.POINTS, 0, drawn);
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		}
	};

	const dispose = () => {
		try {
			gl.deleteBuffer(buffer);
			gl.deleteProgram(program);
			gl.deleteShader(vertex);
			gl.deleteShader(fragment);
		} catch (error) {
			// Losing the context on unload is normal; nothing to clean up.
		}
		canvas.remove();
	};

	return { canvas, draw, dispose };
}

		// ── src/memory.js ──────────────────────────────────────────────
/**
 * The memory library as a galaxy: instruction files, skills and the skill calls
 * found in session logs, laid out in one deterministic disc.
 *
 * Pure model only — no DOM, no host calls. `scripts/build.mjs` inlines this into
 * the client bundle; `scripts/selfcheck.mjs` imports it directly.
 *
 * Reading: the core holds the instruction files (they bind every conversation),
 * skills ride the arms ordered by how often they were called, and each call is a
 * small star circling the skill it loaded. Bodies never move between renders for
 * the same input, so the picture is a stable map rather than a new cloud.
 */

/** The one authenticated RPC channel the Node half serves. */
// Not the plugin id: the web server already owns `/dsh-galaxy-view/*` for this plugin's
// assets, and a POST there answers 405 before our route ever runs.
const MEMORY_CHANNEL = "/dsh-galaxy-view-rpc";

/**
 * 记忆库's look is SETTLED — the owner approved it (2026-10) and asked that it not be
 * restyled. These constants, the mass table and the hue tables below are the picture:
 * change them only on an explicit request, and change the gate in `scripts/selfcheck.mjs`
 * with them.
 */
const MEMORY_ARMS = 3;
const MEMORY_SWIRL = 2.2;
/** Dots drawn per skill; past this the count is reported, not drawn. */
const MEMORY_DOTS = 16;
/** Calls that make a skill body reach full mass. */
const MEMORY_FULL_CALLS = 12;

/** Hue by where a skill comes from, so the source reads at a glance. */
const SKILL_HUES = {
	"user-dsh": 190,
	"user-agents": 202,
	"project-dsh": 162,
	"project-agents": 150,
	vendor: 228,
	extension: 218,
	bundled: 212,
	custom: 204
};

/**
 * Fallback hues for a skill with no known source: the 哈勃深空 palette, picked by the
 * skill's own name so it gets the same colour every time. Without this every skill
 * without a `source` fell back to one cyan and the map read as a single-colour blob.
 */
const SKILL_FALLBACK_HUES = [183, 38, 209, 15, 144, 48, 257, 332, 218];

/** Hue by what a document is: global instructions warm, workspace ones cooler. */
const DOC_HUES = { global: 44, rule: 34, agents: 48, workspace: 52, legacy: 30 };

/**
 * FNV-1a over the id: `hash01` folds similar strings into neighbouring values, so a run
 * of ids (`…-0`, `…-1`, …) landed in the same palette slot and the map came out almost
 * single-coloured. This scatters neighbours instead.
 */
function hueSlot(key) {
	let hash = 2166136261;
	for (let index = 0; index < key.length; index += 1) {
		hash ^= key.charCodeAt(index);
		hash = Math.imul(hash, 16777619) >>> 0;
	}
	return hash % SKILL_FALLBACK_HUES.length;
}

/** Stable hue for a skill: its source when that is known, otherwise its id. */
function skillHue(skill) {
	const bySource = SKILL_HUES[skill.source];
	if (bySource !== undefined) return bySource;
	// Keyed on the id, not the label: a skill synthesised from a call record has no label
	// of its own, and keying on that gave every one of them the same colour.
	return SKILL_FALLBACK_HUES[hueSlot(String(skill.id ?? skill.name ?? ""))];
}

const mass = { skill: 0.34, doc: 0.42, call: 0.12 };

/** `1.4 KB` / `42 KB` / `1.2 MB`, in the units the host locale would use. */
function formatBytes(bytes) {
	const value = Number(bytes);
	if (!Number.isFinite(value) || value < 0) return "";
	if (value < 1024) return `${Math.round(value)} B`;
	if (value < 1024 * 1024) return `${Math.round(value / 102.4) / 10} KB`;
	return `${Math.round(value / 104857.6) / 10} MB`;
}

/** Skill body mass: square-rooted call count so one hot skill does not swallow the disc. */
function skillMass(count) {
	return Math.min(1, Math.max(0, count) / MEMORY_FULL_CALLS) ** 0.5;
}

/**
 * Lay out the memory library.
 * @param input - `{ docs, skills, calls }` as the Node half reports them.
 * @returns `{ nodes, links, stats, extent }` — nodes carry world position, kind,
 * label, mass, hue and the metadata the panel and editor need.
 */
function buildMemoryGraph(input) {
	const docs = Array.isArray(input?.docs) ? input.docs : [];
	const skills = Array.isArray(input?.skills) ? input.skills : [];
	const calls = Array.isArray(input?.calls) ? input.calls : [];

	/* ── call history, grouped by skill name ─────────────────────────────── */

	const history = new Map();
	for (const call of calls) {
		const name = typeof call?.skill === "string" ? call.skill : "";
		if (name === "") continue;
		let entry = history.get(name);
		if (entry === undefined) {
			entry = { count: 0, last: 0, sessions: new Set(), list: [] };
			history.set(name, entry);
		}
		entry.count += 1;
		entry.last = Math.max(entry.last, Number(call.time) || 0);
		if (typeof call.sessionId === "string") entry.sessions.add(call.sessionId);
		entry.list.push(call);
	}

	/* ── skill bodies ───────────────────────────────────────────────────── */

	const byName = new Map();
	for (const skill of skills) {
		const name = typeof skill?.name === "string" ? skill.name : "";
		if (name === "") continue;
		const known = byName.get(name);
		if (known === undefined) byName.set(name, { ...skill, copies: 1 });
		else known.copies += 1;
	}
	const nodes = [];
	const skillNodes = new Map();
	const ranked = [...byName.values()].sort((left, right) => (history.get(right.name)?.count ?? 0) - (history.get(left.name)?.count ?? 0) || String(left.name).localeCompare(String(right.name)));
	// A skill that was called but is no longer on disk still belongs on the map.
	for (const name of history.keys()) {
		if (byName.has(name)) continue;
		ranked.push({ name, source: "missing", description: "", path: null, readOnly: true, copies: 0 });
	}
	const rings = Math.max(1, Math.ceil(ranked.length / MEMORY_ARMS));
	ranked.forEach((skill, index) => {
		const entry = history.get(skill.name);
		const count = entry?.count ?? 0;
		const rank = Math.floor(index / MEMORY_ARMS);
		const depth = (rank + 0.6) / rings;
		const arm = (index % MEMORY_ARMS) * ((Math.PI * 2) / MEMORY_ARMS);
		const jitter = hash01(`skill:${skill.name}`);
		const angle = arm + depth * MEMORY_SWIRL + (jitter - 0.5) * 0.48;
		const radius = 0.5 + 0.5 * depth;
		const node = {
			id: `skill:${skill.name}`,
			kind: "skill",
			label: skill.name,
			name: skill.name,
			x: Math.cos(angle) * radius,
			z: Math.sin(angle) * radius,
			y: (hash01(`drop:${skill.name}`) - 0.5) * 0.05,
			mass: mass.skill + (1 - mass.skill) * skillMass(count),
			hue: skillHue(skill),
			calls: count,
			last: entry?.last ?? 0,
			sessions: entry?.sessions.size ?? 0,
			source: skill.source ?? "",
			description: skill.description ?? "",
			path: skill.path ?? null,
			readOnly: skill.readOnly !== false,
			// A runtime-registered skill has no file, which is not the same as a missing one.
			registered: skill.registered === true,
			missing: skill.path === null && skill.registered !== true,
			copies: skill.copies ?? 1
		};
		nodes.push(node);
		skillNodes.set(skill.name, node);
	});

	/* ── instruction files, in the core ─────────────────────────────────── */

	docs.forEach((doc, index) => {
		const angle = (index / Math.max(1, docs.length)) * Math.PI * 2 + 0.42;
		const radius = 0.14 + 0.16 * hash01(`doc:${doc.path}:r`);
		nodes.push({
			id: `doc:${doc.path}`,
			kind: "doc",
			label: doc.name,
			name: doc.name,
			x: Math.cos(angle) * radius,
			z: Math.sin(angle) * radius,
			y: (hash01(`doc:${doc.path}:y`) - 0.5) * 0.04,
			mass: mass.doc,
			hue: DOC_HUES[doc.scope] ?? 44,
			scope: doc.scope ?? "",
			group: doc.group ?? "",
			root: doc.root ?? "",
			// the workspace a project-scoped instruction file belongs to, so the list can name it
			workspace: doc.workspace ?? "",
			path: doc.path,
			size: doc.size ?? 0,
			mtimeMs: doc.mtimeMs ?? 0,
			readOnly: doc.readOnly === true,
			missing: false
		});
	});

	/* ── one small star per call, circling its skill ─────────────────────── */

	const links = [];
	const shown = new Map();
	let hiddenCalls = 0;
	for (const [name, entry] of history) {
		const host = skillNodes.get(name);
		const pool = entry.list.slice().sort((left, right) => (Number(right.time) || 0) - (Number(left.time) || 0));
		for (const call of pool) {
			const used = shown.get(name) ?? 0;
			if (used >= MEMORY_DOTS) {
				hiddenCalls += 1;
				continue;
			}
			shown.set(name, used + 1);
			const spin = hash01(`call:${call.callId ?? `${name}:${used}`}`);
			const angle = (used / MEMORY_DOTS) * Math.PI * 2 + spin * 1.4;
			// A ring around the body itself, so the dot orbits the skill it loaded.
			const ring = 0.05 + 0.035 * (used % 2);
			const node = {
				id: `call:${call.callId ?? `${name}:${used}`}`,
				kind: "call",
				label: call.title ?? name,
				name,
				x: host.x + Math.cos(angle) * ring,
				z: host.z + Math.sin(angle) * ring,
				y: host.y + (spin - 0.5) * 0.03,
				mass: mass.call,
				hue: host.hue,
				skill: name,
				sessionId: call.sessionId ?? "",
				cwd: call.cwd ?? "",
				time: Number(call.time) || 0
			};
			nodes.push(node);
			links.push({ a: node.id, b: host.id, kind: "call" });
		}
	}

	let extent = 0.14;
	for (const node of nodes) extent = Math.max(extent, Math.hypot(node.x, node.z));

	const missingSkills = ranked.filter((skill) => skill.path === null).length;
	return {
		nodes,
		links,
		stats: {
			docs: docs.length,
			skills: ranked.length - missingSkills,
			calls: [...history.values()].reduce((total, entry) => total + entry.count, 0),
			missingSkills,
			hiddenCalls,
			bodies: nodes.length
		},
		extent: Math.min(1.4, extent)
	};
}

		// ── src/warp.js ────────────────────────────────────────────────
/**
 * The "enter the star" transition.
 *
 * The overlay lives on `document.body`, not inside the plugin's slot, because the
 * main panel is swapped underneath it while the target opens. Phases run on a
 * clock that advances by at most 34 ms per frame, so a main-thread stall delays
 * them instead of skipping them, and the overlay only fades once the caller's
 * `onArrive` promise has settled and two more frames have painted.
 */

/** `opaque` pauses the galaxy loop; `stop` is the running transition, if any. */
const warpState = { opaque: false, stop: null };

/** Landing shell: 1700 golden-spiral hard squares (1.2 / 2 / 3 CSS px), shared by the warp and the star interior. */
const SHELL_DOTS = 1700;
let shellGeometry = null;
function warpShell() {
	if (shellGeometry !== null) return shellGeometry;
	const sx = new Float32Array(SHELL_DOTS);
	const sy = new Float32Array(SHELL_DOTS);
	const sz = new Float32Array(SHELL_DOTS);
	const ss = new Float32Array(SHELL_DOTS);
	const golden = Math.PI * (3 - Math.sqrt(5));
	for (let index = 0; index < SHELL_DOTS; index += 1) {
		const y = 1 - (index / (SHELL_DOTS - 1)) * 2;
		const ring = Math.sqrt(Math.max(0, 1 - y * y));
		sx[index] = Math.cos(golden * index) * ring;
		sy[index] = y;
		sz[index] = Math.sin(golden * index) * ring;
		const pick = (index * 0.618034) % 1;
		ss[index] = pick < 0.7 ? 1.2 : pick < 0.92 ? 2 : 3;
	}
	shellGeometry = { sx, sy, sz, ss };
	return shellGeometry;
}

/**
 * Spin of the landing shell from the wall clock, so the warp's shell and the star
 * interior's shell are the same sphere at the same angle when one hands over to the other.
 */
function shellSpin(now) {
	return (now % 2.6e7) * 0.00022;
}

/**
 * Paint the shell centred at (cx, cy) in device px. `alphaOf(local, depth)` gives each
 * dot's alpha from its reveal share (1 = fully out) and depth (0 back, 1 front).
 * `dot` pins every square to one CSS size instead of the three-tier landing sizes,
 * for a shell that has to sit still behind a conversation.
 *
 * `bend` adds a perspective divide: front dots spread out and back dots close in, so a
 * shell approached from outside has depth instead of reading as a flat disc of dots.
 * At 0 the projection is the plain orthographic one a room seen from its centre wants.
 */
function paintShell(context, cx, cy, radius, ratio, spin, reveal, alphaOf, dot, bend) {
	const { sx, sy, sz, ss } = warpShell();
	const cos = Math.cos(spin);
	const sin = Math.sin(spin);
	for (let index = 0; index < SHELL_DOTS; index += 1) {
		const x = sx[index] * cos - sz[index] * sin;
		const z = sx[index] * sin + sz[index] * cos;
		const y = sy[index] * 0.94 + z * 0.34;
		const depth = (z * 0.94 - sy[index] * 0.34 + 1) / 2;
		const local = reveal >= 1 ? 1 : warpClamp((reveal - 0.55 * Math.min(1, Math.hypot(x, y))) / 0.45, 0, 1);
		if (local <= 0) continue;
		const grow = warpCubic(local);
		context.globalAlpha = alphaOf(local, depth);
		const side = dot === undefined ? Math.max(1, Math.round(ss[index] * ratio)) : Math.max(1, Math.round(dot * ratio));
		// depth runs 0 at the back to 1 at the front; the divide pushes the near face out.
		const near = bend > 0 ? 1 / (1 - bend * (depth * 2 - 1)) : 1;
		const reach = radius * grow * near;
		context.fillRect(Math.round(cx + x * reach - side / 2), Math.round(cy + y * reach - side / 2), side, side);
	}
}

/**
 * The star interior's backdrop: the sky you are now inside. The sphere is wider than
 * the viewport so its rim is never in view, every dot is the same size and the same
 * alpha (two layers, turning at different rates), because three landing sizes and a
 * depth-shaded alpha read as a speckled ball rather than a room. Drawn with `screen`
 * so it only lights the dark plane. Returns a stop function.
 */
function mountInteriorShell(parent, hue) {
	if (typeof document === "undefined") return () => undefined;
	const canvas = document.createElement("canvas");
	canvas.className = "dgv-inside-shell";
	parent.appendChild(canvas);
	const context = canvas.getContext("2d");
	const ratio = Math.min(window.devicePixelRatio || 1, 2);
	const still = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const colour = `hsl(${hue}, 60%, 72%)`;
	let frame = 0;
	let last = 0;
	const paint = (now) => {
		frame = still ? 0 : requestAnimationFrame(paint);
		// 30 fps is plenty for a turn this slow and halves the cost behind a live chat.
		if (!still && now - last < 32) return;
		last = now;
		const width = window.innerWidth;
		const height = window.innerHeight;
		if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
			canvas.width = Math.round(width * ratio);
			canvas.height = Math.round(height * ratio);
		}
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.globalAlpha = 1;
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = colour;
		// 0.52 × the diagonal puts the sphere's rim outside the frame in every aspect
		// ratio, so the dots fill the window evenly instead of clustering into a disc.
		const radius = Math.hypot(width, height) * 0.52 * ratio;
		const centreX = (width / 2) * ratio;
		const centreY = (height / 2) * ratio;
		// The sphere is 2.4× wider now, so the same angular rate would sweep the dots
		// across the frame 2.4× faster; halving it keeps the drift reading as slow.
		const spin = shellSpin(now) * 0.45;
		paintShell(context, centreX, centreY, radius, ratio, spin, 1, () => 0.3, 1.4);
		// A second, slower sphere a shade dimmer: two even layers read as depth, where
		// one layer of varied dots read as noise.
		paintShell(context, centreX, centreY, radius, ratio, spin * 0.37 + 1.2, 1, () => 0.18, 1.4);
	};
	frame = requestAnimationFrame(paint);
	return () => {
		cancelAnimationFrame(frame);
		canvas.remove();
	};
}

function warpClamp(value, low, high) {
	return value < low ? low : value > high ? high : value;
}

function warpCubic(value) {
	const t = 1 - warpClamp(value, 0, 1);
	return 1 - t * t * t;
}

/**
 * Play the transition once.
 *
 * @param {{ hue: number, base?: string, x?: number, y?: number, reverse?: boolean, onArrive?: () => unknown }} options
 *   `hue` is the star's palette hue; `base` the theme's plane colour; `x`/`y` the
 *   star's page position the flight starts from; `reverse` plays the short way back
 *   out. `onArrive` runs once, when the overlay is opaque; the overlay stays until
 *   the promise it returns settles.
 */
function playWarp(options) {
	const onArrive = typeof options.onArrive === "function" ? options.onArrive : () => undefined;
	if (typeof document === "undefined") {
		onArrive();
		return null;
	}
	warpState.stop?.();
	const base = typeof options.base === "string" ? options.base : "#000000";
	const hue = Number.isFinite(options.hue) ? options.hue : 200;
	const reverse = options.reverse === true;
	const still = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	// [opaque by, arrive, hold until ready, fade start, fade length] in clock ms.
	const [opaqueAt, arriveAt, holdAt, fadeAt, fadeMs] = still ? [200, 200, 200, 200, 380] : reverse ? [220, 220, 220, 520, 450] : [280, 300, 720, 1720, 650];
	const flies = !still && !reverse;

	const host = document.createElement("div");
	host.dataset.dgvWarp = "";
	host.style.cssText = `position:fixed;inset:0;z-index:2147483600;pointer-events:none;opacity:0;background:${base}`;
	const canvas = document.createElement("canvas");
	canvas.style.cssText = "display:block;width:100%;height:100%";
	host.appendChild(canvas);
	document.body.appendChild(host);
	const context = canvas.getContext("2d");
	const ratio = Math.min(window.devicePixelRatio || 1, 2);
	let width = 1;
	let height = 1;
	const size = () => {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = Math.round(width * ratio);
		canvas.height = Math.round(height * ratio);
	};
	size();
	const originX = Number.isFinite(options.x) ? options.x : width / 2;
	const originY = Number.isFinite(options.y) ? options.y : height / 2;

	// Flight: a tunnel of fine points that stretch into 1 px streaks as they pass.
	const FLIGHT = still ? 0 : 420;
	const fx = new Float32Array(FLIGHT);
	const fy = new Float32Array(FLIGHT);
	const fz = new Float32Array(FLIGHT);
	const fpx = new Float32Array(FLIGHT);
	const fpy = new Float32Array(FLIGHT);
	const spawn = (index, depth) => {
		const angle = Math.random() * Math.PI * 2;
		const radius = 0.12 + Math.random() * 0.88;
		fx[index] = Math.cos(angle) * radius;
		fy[index] = Math.sin(angle) * radius;
		fz[index] = depth;
		fpx[index] = NaN;
	};
	for (let index = 0; index < FLIGHT; index += 1) spawn(index, 0.15 + Math.random() * 0.85);

	const SHELL = still ? 0 : SHELL_DOTS;
	const flightColour = (tint) => `hsl(${hue}, ${Math.round(18 + 34 * tint)}%, ${Math.round(86 - 10 * tint)}%)`;
	const shellColour = `hsl(${hue}, 60%, 72%)`;

	let clock = 0;
	let waited = 0;
	let last = performance.now();
	let frame = 0;
	let arrived = false;
	let ready = false;

	const finish = () => {
		cancelAnimationFrame(frame);
		window.removeEventListener("resize", size);
		host.remove();
		warpState.opaque = false;
		if (warpState.stop === finish) warpState.stop = null;
	};

	const paint = (now) => {
		const step = Math.min(34, Math.max(0, now - last));
		last = now;
		if (!ready && clock >= holdAt) waited += step;
		else clock += step;
		if (waited > 6000) ready = true;

		if (!arrived && clock >= arriveAt) {
			arrived = true;
			Promise.resolve()
				.then(onArrive)
				.catch((error) => console.warn("graph-view: warp target failed", error))
				.then(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
				.then(() => {
					ready = true;
				});
		}

		const opacity = clock < fadeAt ? warpCubic(clock / opaqueAt) : 1 - warpClamp((clock - fadeAt) / fadeMs, 0, 1);
		host.style.opacity = opacity.toFixed(3);
		warpState.opaque = opacity >= 0.95;
		if (clock >= fadeAt + fadeMs) {
			finish();
			return;
		}

		context.setTransform(1, 0, 0, 1, 0, 0);
		context.globalAlpha = 1;
		context.fillStyle = base;
		context.fillRect(0, 0, canvas.width, canvas.height);
		const lead = warpCubic(clock / 520);
		const cx = (originX + (width / 2 - originX) * lead) * ratio;
		const cy = (originY + (height / 2 - originY) * lead) * ratio;

		const flightLeft = flies ? 1 - warpClamp((clock - holdAt) / 260, 0, 1) : 0;
		if (flightLeft > 0) {
			const rush = 0.3 + 4.4 * Math.min(1, clock / 700) ** 2;
			const focal = Math.min(width, height) * 0.36 * ratio;
			const tint = warpClamp(clock / holdAt, 0, 1);
			context.strokeStyle = context.fillStyle = flightColour(tint);
			context.lineWidth = ratio;
			for (let index = 0; index < FLIGHT; index += 1) {
				fz[index] -= (step / 1000) * rush;
				if (fz[index] <= 0.04) spawn(index, 1);
				const px = cx + (fx[index] / fz[index]) * focal;
				const py = cy + (fy[index] / fz[index]) * focal;
				const close = warpClamp(1.1 - fz[index], 0, 1);
				context.globalAlpha = (0.12 + close * 0.7) * flightLeft * Math.min(1, clock / 160);
				if (fpx[index] === fpx[index]) {
					const trail = Math.min(1, (26 * ratio) / (Math.hypot(px - fpx[index], py - fpy[index]) + 0.01));
					context.beginPath();
					context.moveTo(px + (fpx[index] - px) * trail, py + (fpy[index] - py) * trail);
					context.lineTo(px, py);
					context.stroke();
				}
				const side = Math.max(1, Math.round((1 + close) * ratio));
				context.fillRect(Math.round(px - side / 2), Math.round(py - side / 2), side, side);
				fpx[index] = px;
				fpy[index] = py;
			}
		}

		// Reveal wave from the centre outward (delay 0.55·rank, window 0.45), the halo
		// pulsing from 1.8 down to 1.
		const reveal = reverse ? 1 - warpClamp(clock / 520, 0, 1) : warpClamp((clock - holdAt) / 950, 0, 1);
		if (SHELL > 0 && reveal > 0) {
			const glow = reverse ? 1 : 1.8 - 0.8 * warpClamp((clock - holdAt) / 1300, 0, 1);
			// The shell is flown *into*: it starts as a ball you approach from outside and
			// grows until its rim leaves the frame — which is exactly where the interior's
			// room takes over (same radius, spin, dot size and alpha), so the hand-over is
			// invisible instead of jumping to a second, differently-shaped shell.
			const wrap = warpCubic(reveal);
			const ball = Math.min(width, height) * 0.3 * ratio;
			const room = Math.hypot(width, height) * 0.52 * ratio;
			context.fillStyle = shellColour;
			paintShell(
				context,
				cx,
				cy,
				ball + (room - ball) * wrap,
				ratio,
				shellSpin(now) * 0.45,
				reveal,
				(local, depth) => Math.min(0.95, ((0.32 + 0.5 * depth) * glow * Math.min(1, local * 2)) * (1 - wrap) + 0.3 * wrap),
				1.4,
				0.42 * (1 - wrap)
			);
		}
		frame = requestAnimationFrame(paint);
	};

	window.addEventListener("resize", size);
	warpState.stop = finish;
	frame = requestAnimationFrame(paint);
	return finish;
}

		// ── src/client.js ──────────────────────────────────────────────
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
const STORE_KEY = "dsh-galaxy-view:settings";
const PRESET_KEY = "dsh-galaxy-view:presets";
const VIEW_KEY = "dsh-galaxy-view:view";
const EMPTY_SESSIONS = { phase: "loading", ids: [], byId: {} };
const EMPTY_WORKSPACES = { phase: "loading", items: [], archivedSessionIds: [] };

/* ------------------------------------------------------------------ *
 * Dictionaries
 * ------------------------------------------------------------------ */

const zh = {
	"panel": "银河视图",
	"toggle": "银河",
	"toggle.title": "切换到银河视图",
	"title": "银河视图",
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
	"sec.agent": "工作星体",
	"slider.agentScale": "星体大小",
	"slider.agentSpeed": "公转速度",
	"slider.agentTrail": "拖尾长度",
	"slider.agentWhiten": "白度",
	"stat.agentFlying": "在外",
	"stat.agentReturning": "返航",
	"stat.agentTurns": "回合",
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
	"lang.title": "界面语言：中文 / English",
	"lang.switch": "中 / EN",
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
	"mem.stale": "Node 半包还是旧版本（路由未注册）。请完全退出 DSH（⌘Q）后重新打开，刷新页面不够。",
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
	"mem.selected.registered": "由插件注册，没有文件",
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
	"panel": "Galaxy view",
	"toggle": "Galaxy",
	"toggle.title": "Switch to the galaxy view",
	"title": "Galaxy view",
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
	"sec.agent": "Working star",
	"slider.agentScale": "Size",
	"slider.agentSpeed": "Orbit speed",
	"slider.agentTrail": "Tail length",
	"slider.agentWhiten": "Whiteness",
	"stat.agentFlying": "out",
	"stat.agentReturning": "returning",
	"stat.agentTurns": "turns",
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
	"lang.title": "Interface language: 中文 / English",
	"lang.switch": "中 / EN",
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
	"mem.stale": "The Node half is still an older build (its route is missing). Quit DSH (⌘Q) and reopen: a page refresh is not enough.",
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
	"mem.selected.registered": "registered by a plugin, no file on disk",
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
 * The plugin was called `dsh-graph-view` before it was 银河视图; its storage keys moved with the
 * name. Copy the old values across once so a rename does not reset a tuned look or saved presets.
 */
const LEGACY_KEYS = [["settings", STORE_KEY], ["presets", PRESET_KEY], ["view", VIEW_KEY]];
function adoptLegacyStorage() {
	try {
		for (const [suffix, key] of LEGACY_KEYS) {
			if (window.localStorage.getItem(key) !== null) continue;
			const old = window.localStorage.getItem(`dsh-graph-view:${suffix}`);
			if (old !== null) window.localStorage.setItem(key, old);
		}
	} catch (error) {
		/* private mode: nothing to migrate into */
	}
}

/**
 * Read persisted settings, ignoring anything that no longer parses. An older
 * settings version is migrated once (see migrateSettings) and written back.
 */
function loadSettings() {
	adoptLegacyStorage();
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
/**
 * Tear the batched layer down: GL resources deleted and its canvas removed from the page.
 * Leaving the canvas behind is what broke GPU 星体 off — it kept the last frame of bodies
 * on top of the Canvas 2D ones (a frozen ghost over a live scene).
 */
function dropGlowLayer(state) {
	const layer = state.glow;
	if (layer === null || layer === undefined) return;
	state.glow = null;
	try {
		layer.dispose();
	} catch (error) {
		// A lost context has nothing left to free.
	}
	layer.canvas.remove?.();
}

function glowLayerFor(state, canvas) {
	// 高性能渲染 off: the Canvas 2D sprites draw the bodies instead of the batched GPU pass.
	if (state.settings?.gpuGlow === false || state.glowFailed === true) {
		dropGlowLayer(state);
		return null;
	}
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

/** 拖尾 bounds: 工作强度 sets the span — 6 samples when stalled, 58 when producing. */
const AGENT_TRAIL_MIN = 6;
const AGENT_TRAIL_MAX = 58;
const AGENT_TRAIL_SECONDS_MIN = 0.25;
const AGENT_TRAIL_SECONDS_MAX = 1.6;

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
	/** `agent.turns`: sessionId → is its turn still open. Polled from the host every 4 s. */
	const turnsRef = useRef({});
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
		// A rebuilt graph hands out fresh node objects: drop the cached *object*, but keep the lock.
		// Clearing trackId here released 锁定 every time a snapshot arrived — which is why a tracked
		// body that swung to the far side of the shell bounced the camera back to the overview.
		state.trackNode = null;
		if (state.trackId !== null && !graph.nodes.some((node) => node.id === state.trackId)) state.trackId = null;
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
				// 回合结束 comes from the host poll below (a component-level interval, since stepScene is
				// module-level and has no props).
				state.turns = turnsRef.current;
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
		state.lockWanted = true;
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
		state.lockWanted = false;
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
	// 巡飞的 Agent: a session that is working right now circles outside the shell in every layout,
	// so "who is busy" is visible from the overview without reading a single label.
	if (state.galaxy !== null) {
		// 回归 must survive a rebuild: the session that just finished arrives as a NEW node object
		// (a fresh graph), which used to drop its return state and make the body pop away instead
		// of gliding home. Per-agent state therefore lives by id, not on the object.
		const agentState = state.agentState ?? (state.agentState = new Map());
		const nodes = state.galaxy.nodes;
		for (const node of nodes) {
			const known = agentState.get(node.id);
			if (known !== undefined) {
				// `running` is the HOST's live answer (the very dot the sidebar shows), so it must never
				// be overwritten by the copy from last frame — that pinned it to `true` forever, which
				// is why a finished conversation kept orbiting. Only the animation state is carried.
				const live = node.running;
				Object.assign(node, known);
				node.running = live;
				node.agentWasRunning = known.running === true;
				// `agentOrbit` says "out on the track". Restoring it blindly made the launch guard
				// skip, so the body popped onto the ring and the trail showed up already drawn.
				// Nothing to re-derive: `launchFrom`/`launchAt` and `agentOrbit` travel with the id, so a
				// launch in progress keeps its clock and a cruising agent keeps its lane. (Re-deriving
				// here restarted the launch with `launchAt = now` on every frame, which froze the body
				// at its current point — the "原地跳动" report.)
				// Carry the clock with the angle (the model caps dt, so a pause cannot jump), but never
				// keep a stamp from the future: that would freeze the integrator at dt = 0.
				if (!(node.agentAt <= state.time)) node.agentAt = state.time;
			}
		}
		// 运动方向: the previous frame's position gives the velocity the drop stretches along.
		for (const node of nodes) {
			if (node.running === true || node.agentOrbit === true || node.returningFrom !== undefined || node.launchFrom !== undefined) {
				node.agentPrev = { x: node.x, y: node.y, z: node.z };
			} else if (node.agentPrev !== undefined) {
				node.agentPrev = undefined;
			}
		}
		// The unfold (点击进银河视图时所有星体铺开的动画) moves every body): a seat captured before it
		// ends is stale, so a launch from it would bend towards the lane. Nothing takes off until the
		// scene has settled, and the seat always tracks the body's current position.
		// 回合结束: the host reports which sessions finished their turn (`agent.turns`), which is the
		// only reliable "the reply is done" signal — the graph's own `running` flag never clears here.
		const settled = state.reveal >= 0.995;
		for (const node of nodes) {
			if (node.running !== true && node.agentOrbit !== true && node.launchFrom === undefined && node.returningFrom === undefined) {
				node.seat = { x: node.x, y: node.y, z: node.z };
			}
		}
		for (const node of nodes) {
			if (node.running === true) {
				// A body that was sent home for idling waits for a new write before it flies out again,
				// otherwise it would pace in and out every 30 s.
				const cooling = node.agentCooldownUntil !== undefined && state.time < node.agentCooldownUntil;
				if (settled && !cooling && node.agentOrbit !== true && node.launchFrom === undefined) {
					// 出发: the body flies out of its seat (and stretches on the way). The tail starts
					// empty — it must grow from the seat with the body, never appear assembled.
					if (node.seat === undefined) node.seat = { x: node.x, y: node.y, z: node.z };
					startAgentLaunch(node, state.time, nodes, state.shellRadius);
				}
			} else if (node.agentWasRunning === true && node.returningFrom === undefined && (node.agentOrbit === true || node.launchFrom !== undefined)) {
				// The host flag can lag behind the reply: when a session has gone quiet for a while it is
				// treated as finished too, so the end animation is not held back by a stale `running`.
				startAgentReturn(node, state.time, node.agentPos ?? null);
				continue;
			}
			// 回归 after the final reply: the host says this session's turn has ended. Until the Node half
			// is restarted that map is empty, so a long lap is the fallback — the stand-down latch keeps
			// a resumed session from pacing in and out.
			const turnEnded = turnEndedFor(state.turns, node.id);
			// Time on the lane, whether or not the host still calls the session running: this is the
			// one rule that cannot be starved by a flag that never clears.
			const lapTooLong = node.agentOrbit === true && state.time - (node.agentLaneSince ?? -Infinity) > 45;
			if (node.agentOrbit === true && node.returningFrom === undefined && (turnEnded || lapTooLong)) {
				node.agentCooldownUntil = state.time + 20;
				startAgentReturn(node, state.time, node.agentPos ?? null);
				continue;
			}
			if (
				node.running === true &&
				node.agentOrbit === true &&
				node.returningFrom === undefined &&
				// The host's `running` flag does not clear here and `updatedAt` can tick with the
				// snapshot itself, so the rule is simply time on the lane: a body that has been circling
				// this long is treated as done. If the work resumes the next write brings it straight
				// back out (see `agentStoodDown`), so an early return costs nothing.
				state.time - (node.agentLaneSince ?? state.time) > 30
			) {
				node.agentCooldownUntil = state.time + 20;
				startAgentReturn(node, state.time, node.agentPos ?? null);
				continue;
			}
			if (node.running === true && node.agentOrbit === true && node.updatedAt !== undefined && node.updatedAt !== node.agentSeenUpdatedAt) {
				node.agentSeenUpdatedAt = node.updatedAt;
				node.agentQuietSince = state.time;
			}
		}
		// Counters for the panel: a report can then tell "never came back" from "came back unseen".
		let flying = 0;
		let returning = 0;
		for (const node of nodes) {
			if (node.agentOrbit === true) flying += 1;
			if (node.returningFrom !== undefined) returning += 1;
		}
		liveAgentStats = { flying, returning, turns: Object.keys(state.turns ?? {}).length };
		orbitAgents(state.galaxy, state.time, state.shellRadius, Date.now(), clamp(state.settings.agentSpeed ?? 1, 0.2, 2.5));
		stepAgentLaunches(state.galaxy, state.time, state.shellRadius);
		stepAgentReturns(state.galaxy, state.time);
		// 复原: once a body has landed it is a plain round star again.
		for (const node of nodes) {
			if (node.running !== true && node.agentOrbit !== true && node.launchFrom === undefined && node.returningFrom === undefined) {
				node.agentStretch = 0;
				node.agentVel = undefined;
				node.agentSpeedPrev = undefined;
			}
		}
		// Persist by id for the next frame — and for the next graph, which brings new node objects.
		agentState.clear();
		for (const node of nodes) {
			if (node.running === true || node.agentOrbit === true || node.returningFrom !== undefined || node.launchFrom !== undefined) {
				agentState.set(node.id, {
					running: node.running === true,
					agentPos: { x: node.x, y: node.y, z: node.z },
					seat: node.seat,
					agentPhase: node.agentPhase,
					agentAngle: node.agentAngle,
					agentSpeed: node.agentSpeed,
					agentAt: node.agentAt,
					agentBusy: node.agentBusy,
					agentOrbit: node.agentOrbit,
					agentStretch: node.agentStretch,
					launchFrom: node.launchFrom,
					launchAt: node.launchAt,
					returningFrom: node.returningFrom,
					returningTo: node.returningTo,
					returningAt: node.returningAt,
					// The recorded path must survive a rebuild; otherwise the tail vanishes and regrows
					// roughly once a second (the panel rebuilds at about that rate).
					agentTrail: node.agentTrail,
					agentHeading: node.agentHeading,
					agentPrev: node.agentPrev,
					agentLaneSince: node.agentLaneSince,
					agentQuietSince: node.agentQuietSince,
					agentSeenUpdatedAt: node.agentSeenUpdatedAt
				});
			}
		}

	}
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
	// 锁定 is sticky: it is only released by an explicit action (releaseTrack). Anything that drops
	// trackId behind its back — a rebuild, a tour hand-off, a stale node object — is re-armed here
	// from the selection, so the camera cannot fall back to the overview mid-lap.
	if (state.lockWanted === true && state.trackId === null && state.selectedId !== null && state.galaxy !== null) {
		const subject = state.galaxy.nodes.find((node) => node.id === state.selectedId);
		if (subject !== undefined) {
			state.trackId = subject.id;
			state.trackNode = subject;
			state.free = false;
			state.focusTween = null;
		}
	}
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
		window.localStorage.removeItem("dsh-galaxy-view:diagnostic");
		window.localStorage.removeItem("dsh-galaxy-view:lastError");
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

	const galaxyNodes = state.galaxy.nodes;
	// Links (recipe §3): one device pixel, source-over, each link in the desaturated mix
	// of its endpoint colours, batched into one path per colour bucket and class.
	// 链接透明度 scales the class alphas (1× at Galaxy View's 0.14).
	// A selected conversation keeps only its own neighbourhood's links, and it shows
	// them even when 显示连线 is off; with nothing selected that switch hides them all.
	const linkLook = linkLookFor(state, settings);
	const links = state.galaxy.links;
	// 连线 stays on its own 连线亮度: 星体亮度 must not move the threads with it.
	const linkFade = Math.min(1, reveal * 1.6);
	const linkScale = clamp(settings.linkOpacity, 0, 0.6) / 0.14;
	const linkAlpha = LINK_ALPHA;
	const curve = clamp(settings.linkCurve, 0, 2);
	const widthScale = clamp(settings.linkWidth, 0.2, 4);
	const linkStyles = linkLook.styles;
	// 1 个 Agent 的光带: the great circle it laps, painted just before the links so the band sits
	// under everything else. Drawn only for the single-agent case — with two or more the bodies
	// themselves show the track.
	// 连线密度: `member` spokes are the skeleton and always drawn; `lineage` (a conversation to
	// its parent) crosses the view between distant stars, so it is context — drawn only when it
	// touches the selection or the hover.
	const linkVisible = (link, a, b) => {
		// 巡飞的 Agent 断线: a working session has left the graph for the shell track, so its
		// threads would stretch from outside the shell to a seat it no longer occupies.
		if (a.running === true || b.running === true) return false;
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
			// 无闪动: a working body does not pulse at all — 工作强度 sets a constant light instead.
			const pulse = 1;
			// 阈值 gates on the body's own mass, so it stays put as the camera zooms.
			const gate = bloomGate(bloomLuminance(starMass(node, settings.sizeBy, state.degree)), threshold);
			const prox = entry.prox ?? 1;
			const bandHalo = prox >= 0.66 ? 1 : prox >= 0.33 ? 0.55 : 0.18;
			// A flying body already carries its own drop shape and tail, so its glow is cut right down —
			// a wide halo around it read as a second body. 流线型: a tight rim, no ball of light.
			const flying = node.running === true || node.agentOrbit === true || node.returningFrom !== undefined || node.launchFrom !== undefined;
			// 去掉闪动: a steady light that only follows 忙碌程度 — the pulse read as a flicker.
			const blinkGain = node.running === true ? 0.4 + 0.9 * (node.agentBusy ?? 0.6) : 1;
			const gain = haloGain * pulse * emphasis * fadeOf(node) * (node.archived ? 0.55 : 1) * node._k * bandHalo * crowdFadeOf(entry) * blinkGain * (flying ? 0.22 : 1);
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
			// 光晕减少: no wide outer halo on a flying body — its drop and tail already say "here".
			if (flying) continue;
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
		const baseLightness = prox >= 0.66 ? bodyLightness : prox >= 0.33 ? STAR_LIGHTNESS * 0.86 : STAR_LIGHTNESS * 0.5;
		const bandLightness = baseLightness * (node.running === true ? 0.88 + 0.24 * (node.agentBusy ?? 0.6) : 1);
		// 闪动: an agent that is working pulses on the shell track — 0.55 … 1 of its light, a
		// slow enough beat to read as "alive" rather than as a warning lamp.
		// 忙碌程度 changes the pulse itself: a busy agent beats faster and never gets as dim as a
		// stalled one, so speed and brightness both read as "how much work is happening".
		const busy = node.running === true ? (node.agentBusy ?? 0.6) : 0;
		// 工作强度 → 亮度: a stalled agent is visibly dimmer than a producing one (0.62 … 1.18).
		const blink = node.running === true ? 0.62 + 0.56 * busy : 1;
		// A deep zoom pushes most bodies off the stage; skipping them here also skips the
		// sprite bake, which is the expensive part.
		if (entry.x < -entry.dot || entry.x > width + entry.dot || entry.y < -entry.dot || entry.y > height + entry.dot) continue;
		// 完全不透明: a body is opaque whatever the band, the lens or the reveal — the shade is
		// carried by its colour instead (band lightness, 亮度, the lens' own fade stays on links).
		// 水滴形: an agent in flight is drawn as a stretched drop along its own motion — long while it
		// accelerates out or home, round while it cruises (a 0.10 breathing stretch only). Drawn as a
		// path, not a baked sprite: a per-frame sprite keyed by a continuous size and lightness grew
		// the sprite cache without bound and froze the view.
		const stretch = node.agentStretch ?? 0;
		if (stretch > 0.03) {
			// Heading from the WORLD velocity projected onto the camera axes — never from the difference
			// of two projected points. Close to the camera that projection inverts, so the difference
			// flipped and the drop seemed to spin ~90° for a frame and snap back.
			const prev = node.agentPrev;
			let heading = node.agentHeading ?? 0;
			if (prev !== undefined) {
				const vx = node.x - prev.x;
				const vy = node.y - prev.y;
				const vz = node.z - prev.z;
				// Exact screen velocity: x = side/depth, so x' = (side'·depth − side·depth') / depth².
				// Projecting the velocity linearly (side', lift' alone) ignores the depth term, which is a
				// systematic 5–10° bias whenever the body moves towards or away from the camera.
				const ex = node.x - basis.eye.x;
				const ey = node.y - basis.eye.y;
				const ez = node.z - basis.eye.z;
				const depth = ex * basis.forward.x + ey * basis.forward.y + ez * basis.forward.z;
				const sideAt = ex * basis.right.x + ey * basis.right.y + ez * basis.right.z;
				const liftAt = ex * basis.up.x + ey * basis.up.y + ez * basis.up.z;
				const sideV = vx * basis.right.x + vy * basis.right.y + vz * basis.right.z;
				const liftV = vx * basis.up.x + vy * basis.up.y + vz * basis.up.z;
				const depthV = vx * basis.forward.x + vy * basis.forward.y + vz * basis.forward.z;
				const side = depth > 1e-3 ? (sideV * depth - sideAt * depthV) / (depth * depth) : sideV;
				const lift = depth > 1e-3 ? (liftV * depth - liftAt * depthV) / (depth * depth) : liftV;
				if (Math.hypot(side, lift) > 2e-9) {
					const next = Math.atan2(-lift, side);
					// Reject an implausible single-frame turn: a real one is well under 35°.
					const turn = node.agentHeading === undefined ? 0 : Math.abs(Math.atan2(Math.sin(next - node.agentHeading), Math.cos(next - node.agentHeading)));
					if (node.agentHeading === undefined || turn < 0.6) {
						heading = next;
						node.agentHeading = next;
					}
				}
			}
			// 扁平细长: the body is a slim drop, not a fat oval — thinner across than a star both at
			// rest and in flight, and longer along the heading as the acceleration grows.
			const scale = clamp(settings.agentScale ?? 1, 0.4, 2.5);
			const across = entry.dot * (0.56 - 0.16 * stretch) * scale;
			const along = Math.max(entry.dot * (1 + 2.0 * stretch) * scale, across * 2.4);
			// 不够白: the plateau colour keeps the workspace's orange, which reads muddy against the
			// dark sky. A flying body is pulled 62 % towards white and lifted, so it reads as light.
			const plate = starPlateau(entry.hue, undefined, entry.tone);
			const whiten = clamp(settings.agentWhiten ?? 0.62, 0, 1);
			const tint = plate.map((channel) => Math.round(channel + (255 - channel) * whiten));
			// ONE closed path: a round head at the leading edge with two flanks sweeping back to a
			// point. Two separate fills (an oval plus a circle) read as two blobs whenever the head
			// was wider than the oval — this cannot.
			const head = across * 0.5;              // head radius = half the waist, so the drop stays longer than tall
			const tail = along * 0.5;               // how far the tail reaches back
			const waist = across * 0.5;             // half width at the widest point
			context.save();
			context.translate(entry.x, entry.y);
			context.rotate(heading);
			// 不透明: the body is solid material — the blink belongs to its halo and its tail.
			context.globalAlpha = 1;
			context.fillStyle = `rgb(${tint[0]}, ${tint[1]}, ${tint[2]})`;
			context.beginPath();
			// A circular head at the nose, with two tangent flanks sweeping back to one point — a
			// real teardrop: widest at the head, tapering to nothing behind.
			const nose = along * 0.5;
			const noseCentre = nose - head;
			context.moveTo(-tail, 0);
			context.bezierCurveTo(-tail * 0.2, -waist, noseCentre - head * 0.55, -head, noseCentre, -head);
			context.arc(noseCentre, 0, head, -Math.PI / 2, Math.PI / 2);
			context.bezierCurveTo(noseCentre - head * 0.55, head, -tail * 0.2, waist, -tail, 0);
			context.closePath();
			context.fill();
			// A white-hot point at the head, so the shape reads as a drop with weight in front.
			context.globalAlpha = 1;
			context.fillStyle = "rgba(255, 255, 252, 0.98)";
			context.beginPath();
			context.arc(noseCentre, 0, head * 0.46, 0, TAU);
			context.fill();
			// Additive lift: the body's own light follows 工作强度, which an opaque fill cannot show.
			if (blink > 1) {
				context.globalCompositeOperation = "lighter";
				context.globalAlpha = Math.min(1, (blink - 1) * 0.9);
				context.beginPath();
				context.ellipse(-along * 0.18, 0, along * 0.5, across * 0.4, 0, 0, TAU);
				context.fill();
				context.globalCompositeOperation = "source-over";
			}
			context.restore();
			continue;
		}
		if (glowBodies !== null) {
			// The shader draws the disc and its white-hot core, so there is no sprite and no
			// second additive pass: one vertex per body. The selection ring below stays Canvas 2D.
			glowBodies.push({ x: entry.x, y: entry.y, size: entry.dot, colour: glowColour(entry.hue, bandLightness, entry.tone), core: bandCore, alpha: blink });
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
		context.globalAlpha = blink;
		context.drawImage(spriteImage(sprite.canvas), bodyX, bodyY, side, side);
		// 星体亮度 moves the body's *light*, not only its opacity: the disc's plateau colour is
		// already near white (STAR_PEAK), so scaling alpha alone saturates at 1 and leaves every
		// star looking as faint as it did. An additive second pass always adds a little light
		// and takes the rest of the slider's range on top of it.
		const lift = (BODY_CORE_LIFT + BODY_GAIN_LIFT * Math.max(0, bodyGain - 1)) * Math.min(1, bodyGain) * blink;
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
			dropGlowLayer(state);
		}
	}

	// 拖尾: one continuous path per agent, stroked with a linear gradient from the body (deep colour,
	// full light) to the tip (white, nearly nothing). Per-segment strokes with a per-segment width
	// left visible joints at every sample — the "断断续续" the owner kept seeing — so the tail is
	// drawn as a few whole-path passes of decreasing width instead.
	if (reveal > 0.15) {
		const trailScale = clamp(settings.agentTrail ?? 1, 0, 2.5);
		const whiten = clamp(settings.agentWhiten ?? 0.62, 0, 1);
		context.globalCompositeOperation = "lighter";
		context.lineCap = "round";
		context.lineJoin = "round";
		for (const node of galaxyNodes) {
			const full = node.agentTrail;
			if (trailScale <= 0.001 || full === undefined || full.length < 2) continue;
			const busy = node.agentBusy ?? 0.6;
			const window = (0.55 + 0.9 * busy) * trailScale;
			let first = full.length - 1;
			while (first > 0 && full[first - 1].t >= state.time - window) first -= 1;
			// Fewer than two samples inside the window means no stroke at all; fall back to the last few
			// so a short or slow tail still draws instead of disappearing.
			if (full.length - first < 2) first = Math.max(0, full.length - 8);
			if (full.length - first < 2) continue;
			// Project the kept samples once; a null projection breaks the path instead of drawing a
			// straight line across the screen.
			const points = [];
			let holes = 0;
			for (let index = first; index < full.length; index += 1) {
				const at = projectPoint(full[index], basis, viewport);
				if (at === null) {
					holes += 1;
					// One or two unprojectable samples are a rounding artefact near the camera; breaking the
					// path there showed up as a tail that blinks. Only a real run of them means "off screen".
					if (holes >= 4 && points.length > 0) points.push(null);
					continue;
				}
				holes = 0;
				points.push(at);
			}
			const usable = points.filter((point) => point !== null);
			if (usable.length < 2) continue;
			const head = usable[usable.length - 1];
			const tip = usable[0];
			const plate = starPlateau(node.hue ?? 200, undefined, node.tone);
			// The old tail was whiter than the raw plateau colour (which reads yellow); keep that mix.
			const deep = plate.map((channel) => Math.round(channel + (255 - channel) * Math.min(1, whiten + 0.18)));
			const peak = (0.2 + 0.6 * busy) * Math.min(1, 0.35 + usable.length / 30);
			const base = (0.7 + 2.6 * busy) * clamp(settings.agentScale ?? 1, 0.4, 2.5);
			// Rebuild the gradient only when the tail has actually moved: allocating one per agent per
			// frame was what made the lap stutter.
			const key = `${Math.round(tip.x / 4)},${Math.round(tip.y / 4)},${Math.round(head.x / 4)},${Math.round(head.y / 4)},${Math.round(peak * 20)},${deep[0]}`;
			if (node.agentTailKey !== key) {
				node.agentTailKey = key;
				node.agentTailGradient = null;
			}
			const gradient = node.agentTailGradient ?? context.createLinearGradient(tip.x, tip.y, head.x, head.y);
			node.agentTailGradient = gradient;
			// 近体深色 → 尾端白色, with the light falling towards the tip.
			// 末端渐隐: transparent at the tip, fading in along the lightest quarter, so reaching the
			// set length never looks like the tail being cut off and rebuilt.
			gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
			gradient.addColorStop(0.18, `rgba(255, 255, 255, ${(peak * 0.06).toFixed(3)})`);
			gradient.addColorStop(0.42, `rgba(${Math.round((deep[0] + 255) / 2)}, ${Math.round((deep[1] + 255) / 2)}, ${Math.round((deep[2] + 255) / 2)}, ${(peak * 0.32).toFixed(3)})`);
			gradient.addColorStop(0.78, `rgba(${deep[0]}, ${deep[1]}, ${deep[2]}, ${(peak * 0.72).toFixed(3)})`);
			gradient.addColorStop(1, `rgba(${deep[0]}, ${deep[1]}, ${deep[2]}, ${peak.toFixed(3)})`);
			context.strokeStyle = gradient;
			// Three whole-path passes: wide and faint under narrow and bright, so the flame tapers
			// without a joint anywhere along it.
			for (const [scale, alphaScale] of [[1, 0.45], [0.45, 1]]) {
				context.globalAlpha = alphaScale;
				context.lineWidth = base * scale;
				context.beginPath();
				let started = false;
				for (const point of points) {
					if (point === null) {
						started = false;
						continue;
					}
					if (started) context.lineTo(point.x, point.y);
					else context.moveTo(point.x, point.y);
					started = true;
				}
				context.stroke();
			}
			context.globalAlpha = 1;
		}
		context.globalCompositeOperation = "source-over";
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
	motion: ["autoOrbit", "orbitSpeed", "tourSpeed", "selectionDepth"],
	agent: ["agentScale", "agentSpeed", "agentTrail", "agentWhiten"]
};
const SECTIONS_OPEN = { look: true, filter: true, links: true, agent: true };
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
/** `agent.turns` may key on a slightly different id form than the graph; match by suffix. */
function turnEndedFor(turns, id) {
	if (turns === null || turns === undefined || typeof id !== "string") return false;
	if (turns[id] === false) return true;
	for (const key of Object.keys(turns)) {
		if (turns[key] !== false) continue;
		if (key.endsWith(id) || id.endsWith(key)) return true;
	}
	return false;
}

/** Bumped by scripts/build.mjs; shown in the panel so a stale bundle is visible at a glance. */
const BUILD_STAMP = typeof __DSH_GALAXY_BUILD__ === "string" ? __DSH_GALAXY_BUILD__ : "dev";

/** Live counts of the flying bodies: written by the frame loop, read by 工作星体. */
let liveAgentStats = { flying: 0, returning: 0, turns: 0 };

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
		// 工作星体: the flying agent's own module — size, orbital speed, tail length and whiteness.
		section(
			"agent",
			`${t("sec.agent")} · ${BUILD_STAMP}`,
			badgeFor("agent"),
			() =>
				h(
					"div",
					{ className: "dgv-rows" },
					slide("agentScale", "slider.agentScale", 0.4, 2.5, 0.05),
					slide("agentSpeed", "slider.agentSpeed", 0.2, 2.5, 0.05),
					slide("agentTrail", "slider.agentTrail", 0, 2.5, 0.05),
					slide("agentWhiten", "slider.agentWhiten", 0, 1, 0.02),
					h(
						"p",
						{ className: "dgv-hint" },
						`${t("stat.agentFlying")} ${liveAgentStats.flying} · ${t("stat.agentReturning")} ${liveAgentStats.returning} · ${t("stat.agentTurns")} ${liveAgentStats.turns}`
					),
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
	// 回合结束: the only reliable "the reply is done" signal here — the graph's `running` flag never
	// clears, and every timer-based rule either cut long work or never fired.
	useEffect(() => {
		if (props.memory === undefined || props.memory === null) return () => {};
		let alive = true;
		const load = () => {
			Promise.resolve()
				.then(() => props.memory("agent.turns", {}))
				.then((turns) => {
					if (alive && turns !== null && typeof turns === "object") turnsRef.current = turns;
				})
				.catch(() => {});
		};
		load();
		const timer = setInterval(load, 4000);
		return () => {
			alive = false;
			clearInterval(timer);
		};
	}, [props.memory]);

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
			// 中 / EN: one click flips the whole interface. The panel's locale chip still offers
			// 跟随 (follow the app), this is the direct switch.
			h(
				"button",
				{
					type: "button",
					className: "dgv-btn",
					title: t("lang.title"),
					onClick: () => update({ language: settings.language === "en" ? "zh" : "en" })
				},
				t("lang.switch")
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

/**
 * A document's scope as the reader should see it: a project instruction file is labelled with
 * the workspace it belongs to (its directory name), not with the generic word 工作区.
 */
function docScopeLabel(node, t) {
	if (node.scope === "workspace") {
		const folder = basename(String(node.workspace ?? node.root ?? "")).trim();
		if (folder !== "") return folder;
	}
	return scopeName(node.scope, t);
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
			const message =
				code === "offline" ? translate("mem.offline")
					: code === "stale-host" ? translate("mem.stale")
						: error?.message ?? String(error);
			setFailure({ code, message });
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
		return `${docScopeLabel(node, t)} · ${formatBytes(node.size)}`;
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
							: selected.registered === true
								? t("mem.selected.registered")
								: selected.calls === 0
								? t("mem.selected.never")
								: t("mem.selected.callsN", { n: selected.calls, s: selected.sessions, time: relativeTime(selected.last, t) }),
						selected.copies > 1 ? ` · ${t("mem.row.copies", { n: selected.copies })}` : null
					),
				selected.registered === true && h("div", { className: "dgv-mem-card-path" }, selected.source),
				selected.kind === "doc" && h("div", { className: "dgv-mem-card-meta" }, `${docScopeLabel(selected, t)} · ${formatBytes(selected.size)} · ${relativeTime(selected.mtimeMs, t)}`),
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
		let result;
		try {
			result = await connection.rpc.call(MEMORY_CHANNEL, endpoint, payload ?? {});
		} catch (error) {
			// The route lives under MEMORY_CHANNEL on the Node half. A 404 there means the half
			// loaded is an older build (HMR keeps the previous module until a real restart), so
			// name the remedy rather than reporting a generic read failure.
			if (/not.?found|404/i.test(String(error?.message ?? ""))) {
				throw Object.assign(new Error("stale-host"), { code: "stale-host", details: {} });
			}
			throw error;
		}
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

		return module.exports;
	}
});

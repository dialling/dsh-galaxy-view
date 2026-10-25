// dsh-graph-view — generated client bundle. Do not edit: change src/ and run
// `node scripts/build.mjs` instead.
window.__ModuleLoader__.load({
	id: "dsh-graph-view",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const css = "/* dsh-graph-view\n *\n * Two style worlds, deliberately:\n *   1. `.dgv-toggle` — lives in the stock conversation header, so it reads the\n *      harness tokens and matches the buttons already there.\n *   2. `.dgv-page` and below — the starfield surface, always dark by design.\n */\n\n/* ── 1. header toggle (stock UI) ─────────────────────────────────────── */\n\n.dgv-toggle {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tgap: 4px;\n\theight: 24px;\n\tpadding: 0 6px;\n\tfont-size: 12px;\n\tline-height: 18px;\n\tcolor: var(--dsw-alias-label-tertiary, #7b8290);\n\tbackground: transparent;\n\tborder: 0;\n\tborder-radius: var(--dsw-radius-sm, 6px);\n\tcursor: pointer;\n\ttransition: color 120ms ease, background 120ms ease;\n}\n\n.dgv-toggle:hover,\n.dgv-toggle:focus-visible {\n\tcolor: var(--dsw-alias-label-secondary, #4b525e);\n\tbackground: var(--dsw-alias-fill-l1, rgba(127, 127, 127, 0.1));\n}\n\n.dgv-toggle svg {\n\tflex: none;\n}\n\n.dgv-toggle-label {\n\twhite-space: nowrap;\n}\n\n@media (max-width: 720px) {\n\t.dgv-toggle-label {\n\t\tdisplay: none;\n\t}\n}\n\n/* ── 2. starfield page ───────────────────────────────────────────────── */\n\n.dgv-page {\n\tdisplay: flex;\n\tflex-direction: column;\n\theight: 100%;\n\tmin-height: 0;\n\tbackground: #1c1c1c;\n\tcolor: #eef2fb;\n}\n\n.dgv-head {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\talign-items: center;\n\tgap: 12px;\n\tflex: none;\n\tpadding: 10px 16px;\n\tbackground: linear-gradient(180deg, rgba(28, 28, 28, 0.94), rgba(28, 28, 28, 0.78));\n\tborder-bottom: 0.5px solid rgba(150, 170, 220, 0.14);\n}\n\n.dgv-head-main {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 2px;\n\tmin-width: 0;\n}\n\n.dgv-title {\n\tfont-size: 14px;\n\tfont-weight: 600;\n\tline-height: 20px;\n\tletter-spacing: 0.02em;\n\tcolor: #f2f5ff;\n}\n\n.dgv-stat {\n\tfont-size: 12px;\n\tline-height: 16px;\n\tcolor: rgba(186, 200, 232, 0.62);\n\twhite-space: nowrap;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n}\n\n.dgv-tools {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 6px;\n\tmargin-left: auto;\n\tmin-width: 0;\n}\n\n.dgv-search {\n\tbox-sizing: border-box;\n\twidth: 210px;\n\theight: 28px;\n\tpadding: 0 10px;\n\tfont-size: 12px;\n\tcolor: #eef2fb;\n\tbackground: rgba(140, 160, 210, 0.1);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.2);\n\tborder-radius: var(--dsw-radius-md, 8px);\n\toutline: none;\n}\n\n.dgv-search::placeholder {\n\tcolor: rgba(178, 192, 224, 0.5);\n}\n\n.dgv-search:focus-visible {\n\tborder-color: rgba(168, 196, 255, 0.6);\n\tbackground: rgba(140, 160, 210, 0.16);\n}\n\n.dgv-btn {\n\theight: 28px;\n\tpadding: 0 10px;\n\tfont-size: 12px;\n\tline-height: 26px;\n\tcolor: rgba(206, 218, 244, 0.86);\n\tbackground: transparent;\n\tborder: 0.5px solid rgba(150, 170, 220, 0.2);\n\tborder-radius: var(--dsw-radius-md, 8px);\n\tcursor: pointer;\n\twhite-space: nowrap;\n\ttransition: background 120ms ease, color 120ms ease, border-color 120ms ease;\n}\n\n.dgv-btn:hover,\n.dgv-btn:focus-visible {\n\tcolor: #f4f7ff;\n\tbackground: rgba(140, 160, 210, 0.16);\n}\n\n.dgv-btn-on {\n\tcolor: #a8c4ff;\n\tborder-color: rgba(168, 196, 255, 0.45);\n}\n\n.dgv-btn-primary {\n\tcolor: #0a0c12;\n\tbackground: linear-gradient(180deg, #dfe8ff, #a8c4ff);\n\tborder-color: transparent;\n\tfont-weight: 550;\n}\n\n.dgv-btn-primary:hover,\n.dgv-btn-primary:focus-visible {\n\tcolor: #05060b;\n\tbackground: linear-gradient(180deg, #eef3ff, #bfd3ff);\n}\n\n.dgv-stage {\n\tposition: relative;\n\tflex: 1;\n\tmin-height: 0;\n\toverflow: hidden;\n}\n\n.dgv-canvas {\n\tdisplay: block;\n\ttouch-action: none;\n\toutline: none;\n\tcursor: grab;\n}\n\n.dgv-tip {\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\tz-index: 80;\n\tbox-sizing: border-box;\n\tmin-width: 150px;\n\tmax-width: 320px;\n\tpadding: 8px 10px;\n\tpointer-events: none;\n\tbackground: rgba(28, 28, 28, 0.96);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.24);\n\tborder-radius: var(--dsw-radius-lg, 10px);\n\tbox-shadow: 0 12px 34px rgba(0, 0, 0, 0.55);\n\tbackdrop-filter: blur(8px);\n}\n\n.dgv-tip-head {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 6px;\n\tmargin-bottom: 3px;\n}\n\n.dgv-tip-dot {\n\twidth: 7px;\n\theight: 7px;\n\tborder-radius: 50%;\n\tflex: none;\n\tbox-shadow: 0 0 8px currentColor;\n}\n\n.dgv-tip-kind {\n\tfont-size: 11px;\n\tline-height: 14px;\n\tletter-spacing: 0.06em;\n\ttext-transform: uppercase;\n\tcolor: rgba(178, 192, 224, 0.6);\n}\n\n.dgv-tip-title {\n\tfont-size: 13px;\n\tline-height: 18px;\n\tfont-weight: 550;\n\tcolor: #f2f5ff;\n\toverflow-wrap: anywhere;\n}\n\n.dgv-tip-path {\n\tmargin-top: 3px;\n\tfont-size: 11px;\n\tline-height: 15px;\n\tcolor: rgba(178, 192, 224, 0.62);\n\toverflow-wrap: anywhere;\n}\n\n.dgv-tip-meta {\n\tmargin-top: 4px;\n\tfont-size: 11px;\n\tline-height: 15px;\n\tcolor: rgba(206, 218, 244, 0.8);\n}\n\n.dgv-empty {\n\tflex: 1;\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tjustify-content: center;\n\tgap: 6px;\n\tpadding: 24px;\n\ttext-align: center;\n}\n\n.dgv-empty-title {\n\tfont-size: 14px;\n\tline-height: 20px;\n\tcolor: rgba(206, 218, 244, 0.86);\n}\n\n.dgv-empty-hint {\n\tfont-size: 12px;\n\tline-height: 18px;\n\tmax-width: 320px;\n\tcolor: rgba(178, 192, 224, 0.55);\n}\n\n.dgv-hint {\n\tposition: absolute;\n\tleft: 16px;\n\tbottom: 14px;\n\tfont-size: 11px;\n\tline-height: 16px;\n\tletter-spacing: 0.02em;\n\tcolor: rgba(178, 192, 224, 0.42);\n\tpointer-events: none;\n\tuser-select: none;\n}\n\n/* ── 3. body: control panel + stage ─────────────────────────────────── */\n\n.dgv-body {\n\tdisplay: flex;\n\tflex: 1;\n\tmin-height: 0;\n}\n\n.dgv-panel {\n\tdisplay: flex;\n\tflex-direction: column;\n\tflex: none;\n\twidth: 288px;\n\tmin-height: 0;\n\tbackground: rgba(28, 28, 28, 0.92);\n\tborder-right: 0.5px solid rgba(150, 170, 220, 0.14);\n\tbackdrop-filter: blur(10px);\n\tfont-size: 12px;\n\toverflow-y: auto;\n\toverscroll-behavior: contain;\n}\n\n.dgv-panel-head {\n\tposition: sticky;\n\ttop: 0;\n\tz-index: 2;\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 8px;\n\tpadding: 12px 12px 8px;\n\tbackground: linear-gradient(180deg, rgba(28, 28, 28, 0.98), rgba(28, 28, 28, 0.88));\n}\n\n.dgv-panel-title {\n\tfont-size: 13px;\n\tfont-weight: 600;\n\tletter-spacing: 0.02em;\n\tcolor: #eef2fb;\n}\n\n.dgv-panel-locale {\n\tmargin-left: auto;\n\tpadding: 1px 6px;\n\tfont-size: 11px;\n\tcolor: rgba(178, 192, 224, 0.7);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.24);\n\tborder-radius: 6px;\n}\n\n.dgv-panel-x {\n\twidth: 22px;\n\theight: 22px;\n\tpadding: 0;\n\tfont-size: 15px;\n\tline-height: 20px;\n\tcolor: rgba(178, 192, 224, 0.7);\n\tbackground: transparent;\n\tborder: 0;\n\tborder-radius: 6px;\n\tcursor: pointer;\n}\n\n.dgv-panel-x:hover {\n\tcolor: #f2f5ff;\n\tbackground: rgba(140, 160, 210, 0.16);\n}\n\n.dgv-panel-actions {\n\tdisplay: flex;\n\tgap: 6px;\n\tpadding: 4px 12px 8px;\n}\n\n.dgv-btn-wide {\n\twidth: 100%;\n\tjustify-content: center;\n}\n\n.dgv-btn-icon {\n\twidth: 28px;\n\tpadding: 0;\n\ttext-align: center;\n}\n\n.dgv-section {\n\tborder-top: 0.5px solid rgba(150, 170, 220, 0.1);\n}\n\n.dgv-section-head {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 6px;\n\twidth: 100%;\n\tpadding: 9px 12px;\n\tfont-size: 11.5px;\n\tfont-weight: 550;\n\tletter-spacing: 0.06em;\n\ttext-transform: uppercase;\n\tcolor: rgba(178, 192, 224, 0.66);\n\tbackground: transparent;\n\tborder: 0;\n\tcursor: pointer;\n\ttext-align: left;\n}\n\n.dgv-section-head:hover {\n\tcolor: rgba(214, 226, 248, 0.9);\n}\n\n.dgv-section-head > span:last-child {\n\tmargin-left: auto;\n\tfont-size: 13px;\n}\n\n.dgv-section-sub {\n\tmargin-left: auto;\n\tmargin-right: 6px;\n\tfont-size: 11px;\n\tletter-spacing: 0;\n\ttext-transform: none;\n\tcolor: rgba(168, 196, 255, 0.7);\n}\n\n.dgv-presets {\n\tdisplay: grid;\n\tgrid-template-columns: 1fr 1fr;\n\tgap: 6px;\n\tpadding: 0 12px 10px;\n}\n\n.dgv-preset {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 5px;\n\tpadding: 7px 8px 8px;\n\ttext-align: left;\n\tcolor: rgba(206, 218, 244, 0.86);\n\tbackground: rgba(140, 160, 210, 0.06);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.16);\n\tborder-radius: 10px;\n\tcursor: pointer;\n\ttransition: background 120ms ease, border-color 120ms ease;\n}\n\n.dgv-preset:hover {\n\tbackground: rgba(140, 160, 210, 0.13);\n\tborder-color: rgba(168, 196, 255, 0.32);\n}\n\n.dgv-preset-on {\n\tcolor: #eef2fb;\n\tbackground: rgba(120, 150, 220, 0.18);\n\tborder-color: rgba(168, 196, 255, 0.6);\n\tbox-shadow: inset 0 0 0 0.5px rgba(168, 196, 255, 0.25);\n}\n\n.dgv-preset-art {\n\tposition: relative;\n\tdisplay: block;\n\theight: 26px;\n\tborder-radius: 6px;\n\tbackground: radial-gradient(120% 90% at 50% 60%, rgba(60, 70, 130, 0.45), rgba(28, 28, 28, 0.92));\n\toverflow: hidden;\n}\n\n.dgv-preset-art i {\n\tposition: absolute;\n\twidth: 4px;\n\theight: 4px;\n\tborder-radius: 50%;\n\ttransform: translate(-50%, -50%);\n}\n\n.dgv-preset-text {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1px;\n\tmin-width: 0;\n}\n\n.dgv-preset-text b {\n\tfont-size: 12px;\n\tfont-weight: 550;\n}\n\n.dgv-preset-text small {\n\tfont-size: 10.5px;\n\tline-height: 13px;\n\tcolor: rgba(178, 192, 224, 0.55);\n\toverflow: hidden;\n\tdisplay: -webkit-box;\n\t-webkit-line-clamp: 2;\n\t-webkit-box-orient: vertical;\n}\n\n.dgv-list {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1px;\n\tpadding: 0 8px 10px;\n}\n\n.dgv-list-note {\n\tpadding: 0 4px 5px;\n\tfont-size: 10.5px;\n\tline-height: 14px;\n\tcolor: rgba(178, 192, 224, 0.45);\n}\n\n.dgv-list-note-block {\n\tpadding: 2px 2px 0;\n}\n\n.dgv-item {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 7px;\n\twidth: 100%;\n\tpadding: 5px 6px;\n\tfont-size: 12px;\n\tcolor: rgba(206, 218, 244, 0.84);\n\tbackground: transparent;\n\tborder: 0;\n\tborder-radius: 7px;\n\tcursor: pointer;\n\ttext-align: left;\n}\n\n.dgv-item:hover {\n\tbackground: rgba(140, 160, 210, 0.14);\n}\n\n.dgv-item-off {\n\topacity: 0.38;\n}\n\n.dgv-dot {\n\tflex: none;\n\twidth: 7px;\n\theight: 7px;\n\tborder-radius: 50%;\n}\n\n.dgv-item-name {\n\tflex: 1;\n\tmin-width: 0;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n\n.dgv-item-count {\n\tfont-size: 11px;\n\tcolor: rgba(178, 192, 224, 0.45);\n\tfont-variant-numeric: tabular-nums;\n}\n\n.dgv-toggles {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tgap: 5px;\n\tpadding: 0 12px 10px;\n}\n\n.dgv-section .dgv-toggles {\n\tpadding-top: 2px;\n}\n\n.dgv-chip {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tgap: 5px;\n\theight: 24px;\n\tpadding: 0 9px;\n\tfont-size: 11.5px;\n\tcolor: rgba(206, 218, 244, 0.78);\n\tbackground: rgba(140, 160, 210, 0.08);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.18);\n\tborder-radius: 999px;\n\tcursor: pointer;\n}\n\n.dgv-chip:hover {\n\tbackground: rgba(140, 160, 210, 0.16);\n}\n\n.dgv-chip-on {\n\tcolor: #dce7ff;\n\tbackground: rgba(120, 150, 220, 0.24);\n\tborder-color: rgba(168, 196, 255, 0.5);\n}\n\n.dgv-chip i {\n\twidth: 8px;\n\theight: 8px;\n\tborder-radius: 50%;\n}\n\n.dgv-search-block {\n\tdisplay: block;\n\twidth: calc(100% - 20px);\n\tmargin: 0 10px 10px;\n}\n\n.dgv-rows {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 7px;\n\tpadding: 0 12px 12px;\n}\n\n.dgv-row {\n\tdisplay: grid;\n\tgrid-template-columns: 76px 1fr 34px;\n\talign-items: center;\n\tgap: 7px;\n\tfont-size: 11.5px;\n\tcolor: rgba(186, 200, 232, 0.75);\n}\n\n.dgv-row-label {\n\tcursor: pointer;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n\n.dgv-row-value {\n\tfont-size: 10.5px;\n\ttext-align: right;\n\tcolor: rgba(168, 196, 255, 0.8);\n\tfont-variant-numeric: tabular-nums;\n}\n\n.dgv-row input[type=\"range\"] {\n\t-webkit-appearance: none;\n\tappearance: none;\n\twidth: 100%;\n\theight: 16px;\n\tbackground: transparent;\n\tcursor: pointer;\n}\n\n.dgv-row input[type=\"range\"]::-webkit-slider-runnable-track {\n\theight: 3px;\n\tbackground: rgba(150, 170, 220, 0.22);\n\tborder-radius: 2px;\n}\n\n.dgv-row input[type=\"range\"]::-webkit-slider-thumb {\n\t-webkit-appearance: none;\n\twidth: 11px;\n\theight: 11px;\n\tmargin-top: -4px;\n\tbackground: #cfdcff;\n\tborder-radius: 50%;\n\tbox-shadow: 0 0 6px rgba(168, 196, 255, 0.7);\n}\n\n.dgv-row input[type=\"range\"]::-moz-range-track {\n\theight: 3px;\n\tbackground: rgba(150, 170, 220, 0.22);\n\tborder-radius: 2px;\n}\n\n.dgv-row input[type=\"range\"]::-moz-range-thumb {\n\twidth: 11px;\n\theight: 11px;\n\tbackground: #cfdcff;\n\tborder: 0;\n\tborder-radius: 50%;\n}\n\n.dgv-switch-row {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 8px;\n\tpadding: 3px 0 5px;\n}\n\n.dgv-switch-row > span {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1px;\n\tmin-width: 0;\n}\n\n.dgv-switch-row b {\n\tfont-size: 12px;\n\tfont-weight: 550;\n\tcolor: rgba(214, 226, 248, 0.9);\n}\n\n.dgv-switch-row small {\n\tfont-size: 10.5px;\n\tline-height: 13px;\n\tcolor: rgba(178, 192, 224, 0.45);\n}\n\n.dgv-switch-row .dgv-btn {\n\tmargin-left: auto;\n}\n\n.dgv-switch {\n\tposition: relative;\n\tflex: none;\n\twidth: 34px;\n\theight: 19px;\n\tpadding: 0;\n\tbackground: rgba(150, 170, 220, 0.18);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.24);\n\tborder-radius: 999px;\n\tcursor: pointer;\n\ttransition: background 140ms ease;\n}\n\n.dgv-switch i {\n\tposition: absolute;\n\ttop: 2px;\n\tleft: 2px;\n\twidth: 13px;\n\theight: 13px;\n\tbackground: #c6d4f2;\n\tborder-radius: 50%;\n\ttransition: transform 140ms ease, background 140ms ease;\n}\n\n.dgv-switch-on {\n\tbackground: rgba(120, 160, 240, 0.6);\n\tborder-color: rgba(168, 196, 255, 0.6);\n}\n\n.dgv-switch-on i {\n\ttransform: translateX(15px);\n\tbackground: #f4f8ff;\n}\n\n.dgv-pair {\n\tdisplay: flex;\n\tgap: 6px;\n}\n\n.dgv-pair .dgv-btn {\n\tflex: 1;\n}\n\n.dgv-mine {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tgap: 5px;\n}\n\n.dgv-mine-chip {\n\tdisplay: inline-flex;\n\talign-items: center;\n\tbackground: rgba(140, 160, 210, 0.1);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.18);\n\tborder-radius: 999px;\n\toverflow: hidden;\n}\n\n.dgv-mine-chip button {\n\tpadding: 2px 7px;\n\tfont-size: 11px;\n\tcolor: rgba(206, 218, 244, 0.82);\n\tbackground: transparent;\n\tborder: 0;\n\tcursor: pointer;\n}\n\n.dgv-mine-x {\n\tcolor: rgba(178, 192, 224, 0.45) !important;\n\tborder-left: 0.5px solid rgba(150, 170, 220, 0.18) !important;\n}\n\n.dgv-panel-foot {\n\tposition: sticky;\n\tbottom: 0;\n\tmargin-top: auto;\n\tpadding: 8px 12px 10px;\n\tfont-size: 10.5px;\n\tline-height: 14px;\n\tcolor: rgba(178, 192, 224, 0.42);\n\tbackground: linear-gradient(0deg, rgba(28, 28, 28, 0.98), rgba(28, 28, 28, 0.72));\n\tfont-variant-numeric: tabular-nums;\n}\n\n.dgv-badge {\n\tmargin-left: auto;\n\tpadding: 1px 6px;\n\tfont-size: 10px;\n\tline-height: 14px;\n\tletter-spacing: 0;\n\ttext-transform: none;\n\tcolor: #ffd8a8;\n\tbackground: rgba(255, 200, 130, 0.14);\n\tborder-radius: 999px;\n}\n\n.dgv-revert {\n\tmargin-left: 6px;\n\tfont-size: 10.5px;\n\tletter-spacing: 0;\n\ttext-transform: none;\n\tcolor: rgba(168, 196, 255, 0.8);\n\tcursor: pointer;\n}\n\n.dgv-revert:hover {\n\tcolor: #dce7ff;\n\ttext-decoration: underline;\n}\n\n/* ── 4. star info card ──────────────────────────────────────────────── */\n\n.dgv-card {\n\tposition: absolute;\n\tz-index: 60;\n\tbox-sizing: border-box;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 4px;\n\twidth: 250px;\n\tpadding: 10px 12px 12px;\n\tbackground: rgba(28, 28, 28, 0.97);\n\tborder: 0.5px solid rgba(150, 170, 220, 0.24);\n\tborder-radius: 12px;\n\tbox-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);\n\tbackdrop-filter: blur(10px);\n}\n\n.dgv-card-head {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 6px;\n}\n\n.dgv-card-head .dgv-panel-x {\n\tmargin-left: auto;\n}\n\n.dgv-card-title {\n\tfont-size: 13px;\n\tline-height: 18px;\n\tfont-weight: 600;\n\tcolor: #f2f5ff;\n\toverflow-wrap: anywhere;\n}\n\n.dgv-card-path {\n\tfont-size: 10.5px;\n\tline-height: 14px;\n\tcolor: rgba(178, 192, 224, 0.55);\n\toverflow-wrap: anywhere;\n}\n\n.dgv-card-meta {\n\tfont-size: 11px;\n\tline-height: 15px;\n\tcolor: rgba(206, 218, 244, 0.8);\n}\n\n.dgv-card-list {\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1px;\n\tmax-height: 190px;\n\tmargin: 4px -4px 2px;\n\tpadding: 2px 4px 0;\n\toverflow-y: auto;\n\toverscroll-behavior: contain;\n\tborder-top: 0.5px solid rgba(150, 170, 220, 0.14);\n}\n\n.dgv-card-list .dgv-list-note {\n\tpadding: 4px 2px 4px;\n}\n\n.dgv-card-none {\n\tpadding: 4px 2px 6px;\n\tfont-size: 11px;\n\tcolor: rgba(178, 192, 224, 0.5);\n}\n\n.dgv-card-row {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 7px;\n\twidth: 100%;\n\tpadding: 4px 5px;\n\tfont-size: 11.5px;\n\tcolor: rgba(206, 218, 244, 0.86);\n\tbackground: transparent;\n\tborder: 0;\n\tborder-radius: 6px;\n\tcursor: pointer;\n\ttext-align: left;\n}\n\n.dgv-card-row:hover {\n\tcolor: #f4f7ff;\n\tbackground: rgba(140, 160, 210, 0.16);\n}\n\n.dgv-card-row .dgv-item-count {\n\tflex: none;\n}\n\n.dgv-dot-live {\n\tbox-shadow: 0 0 0 2px rgba(255, 255, 255, 0.22), 0 0 8px currentColor;\n}\n\n.dgv-card-actions {\n\tdisplay: flex;\n\tgap: 6px;\n\tmargin-top: 6px;\n}\n\n.dgv-card-actions .dgv-btn {\n\tflex: 1;\n}\n\n/* ------------------------------------------------------------------ *\n * Star interior\n *\n * The live conversation stays in the harness panel; this paints the inside\n * of the star around it and gives it one way back out.\n * ------------------------------------------------------------------ */\n\n.dgv-inside-glow {\n\tposition: fixed;\n\tinset: 0;\n\tz-index: 2147482000;\n\tpointer-events: none;\n\tbackground:\n\t\tradial-gradient(120% 84% at 50% 50%, transparent 46%, hsla(var(--dgv-inside-hue), 70%, 58%, 0.12) 100%),\n\t\tradial-gradient(60% 46% at 50% 8%, hsla(var(--dgv-inside-hue), 80%, 66%, 0.08), transparent 70%);\n\tmix-blend-mode: screen;\n}\n\n.dgv-inside-back {\n\tposition: fixed;\n\tleft: 18px;\n\tbottom: 18px;\n\tz-index: 2147483000;\n\tdisplay: inline-flex;\n\talign-items: center;\n\tgap: 7px;\n\theight: 30px;\n\tpadding: 0 13px;\n\tborder-radius: 999px;\n\tborder: 1px solid hsla(var(--dgv-inside-hue), 60%, 66%, 0.34);\n\tbackground: rgba(24, 25, 30, 0.82);\n\tbackdrop-filter: blur(10px);\n\tcolor: rgba(232, 236, 244, 0.9);\n\tfont: inherit;\n\tfont-size: 12.5px;\n\tcursor: pointer;\n\ttransition: border-color 140ms ease, background 140ms ease, transform 140ms ease;\n}\n\n.dgv-inside-back:hover {\n\tborder-color: hsla(var(--dgv-inside-hue), 72%, 70%, 0.6);\n\tbackground: rgba(30, 32, 38, 0.9);\n\ttransform: translateY(-1px);\n}\n\n.dgv-inside-back::before {\n\tcontent: \"\";\n\twidth: 7px;\n\theight: 7px;\n\tborder-radius: 50%;\n\tbackground: hsl(var(--dgv-inside-hue), 84%, 68%);\n\tbox-shadow: 0 0 9px hsla(var(--dgv-inside-hue), 90%, 68%, 0.8);\n}\n\n/* Chat surfaces read as the star's own plane rather than a stock sheet. */\nbody[data-dgv-inside] [data-dsh-conversation-root],\nbody[data-dgv-inside] [data-dsh-main-panel] {\n\tbackground-color: var(--dgv-inside-base, #1c1c1c) !important;\n}\n";
		const tagId = "dsh-graph-view/styles.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-graph-view";
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
const SETTINGS_VERSION = 2;

/** Default deep-space base; the original six themes keep it. */
const SPACE = "#1c1c1c";

/**
 * Eight hand-tuned looks. Each one is a partial override on {@link DEFAULTS}; the parts
 * it does not mention stay as they were, which is what makes "自定义" meaningful.
 */
const PRESETS = {
	galaxy: { layout: "spiral", theme: "deepfield", brightness: 0.5, bloom: 0.44, threshold: 0.24, veil: 0.34, field: 0.7, shellSize: 1, shellGlow: 1, mist: 0.34, backdrop: true, arms: 2, twist: 4.3, thickness: 1, spread: 1, orbitSpeed: 0.35 },
	rings: { layout: "rings", theme: "sunset", brightness: 0.48, bloom: 0.5, threshold: 0.2, veil: 0.2, field: 0.5, shellSize: 1, shellGlow: 0.85, mist: 0.4, backdrop: true, arms: 1, twist: 1.3, thickness: 0.5, spread: 1.2, orbitSpeed: 0.4 },
	lattice: { layout: "lattice", theme: "aurora", brightness: 0.46, bloom: 0.34, threshold: 0.28, veil: 0.16, field: 0.45, shellSize: 0.9, shellGlow: 0.8, mist: 0.6, backdrop: true, arms: 2, twist: 3, thickness: 1, spread: 0.9, orbitSpeed: 0.26 },
	bubble: { layout: "bubble", theme: "neon", brightness: 0.44, bloom: 0.52, threshold: 0.22, veil: 0.3, field: 0.5, shellSize: 1.15, shellGlow: 0.9, mist: 0.586, backdrop: true, arms: 2, twist: 3.4, thickness: 1, spread: 1, orbitSpeed: 0.3 },
	helix: { layout: "helix", theme: "cyber", brightness: 0.5, bloom: 0.46, threshold: 0.22, veil: 0.18, field: 0.48, shellSize: 1, shellGlow: 0.85, mist: 0.55, backdrop: true, arms: 2, twist: 4, thickness: 1.1, spread: 1, orbitSpeed: 0.32 },
	clusters: { layout: "clusters", theme: "matrix", brightness: 0.46, bloom: 0.5, threshold: 0.2, veil: 0.24, field: 0.5, shellSize: 1, shellGlow: 0.85, mist: 0.5, backdrop: true, arms: 2, twist: 3, thickness: 1, spread: 1, orbitSpeed: 0.28 },
	plate: { layout: "plate", theme: "hubble", brightness: 0.5, bloom: 0.26, threshold: 0.3, veil: 0.08, field: 0.45, shellSize: 0.85, shellGlow: 0.8, mist: 0.52, backdrop: true, arms: 2, twist: 3, thickness: 1, spread: 0.8, orbitSpeed: 0.22 },
	tree: { layout: "tree", theme: "neon", brightness: 0.48, bloom: 0.42, threshold: 0.24, veil: 0.22, field: 0.48, shellSize: 1, shellGlow: 0.85, mist: 0.552, backdrop: true, arms: 2, twist: 3.6, thickness: 1, spread: 1, orbitSpeed: 0.3 }
};

/**
 * Palettes: node hues, backdrop veils, nucleus tint, filament tint and the plane
 * colour (`base`) that the canvas, the warp overlay and the star interior share.
 *
 * `hues` are hue sources in degrees; the star sprite derives saturation and
 * lightness. "deepfield" follows the Obsidian Galaxy View reference: cool and warm
 * slots alternate by hueIndex (cool 160–230°, warm 25–55°), so with two arms the
 * even workspaces (cool) and odd ones (warm) split the arms evenly.
 */
const THEMES = {
	deepfield: { hues: [184, 38, 205, 28, 172, 46, 196, 33], veils: ["rgba(16,34,52,0.10)", "rgba(40,30,14,0.06)", "rgba(14,40,46,0.06)", "rgba(30,24,12,0.05)"], nucleus: [235, 240, 238], link: [150, 170, 180], base: "#000003", vignette: false },
	hubble: { hues: [265, 208, 158, 28, 330, 96, 190, 12], veils: ["rgba(70,58,150,0.20)", "rgba(28,76,140,0.16)", "rgba(120,56,132,0.14)", "rgba(24,104,104,0.1)"], nucleus: [255, 246, 226], link: [150, 180, 235], base: SPACE, vignette: true },
	neon: { hues: [190, 300, 150, 50, 265, 330, 175, 210], veils: ["rgba(20,90,150,0.22)", "rgba(140,40,160,0.18)", "rgba(20,130,140,0.14)", "rgba(60,40,140,0.16)"], nucleus: [220, 250, 255], link: [120, 220, 255], base: SPACE, vignette: true },
	sunset: { hues: [22, 342, 46, 300, 10, 40, 320, 355], veils: ["rgba(150,60,50,0.2)", "rgba(120,60,120,0.16)", "rgba(170,90,50,0.14)", "rgba(90,50,90,0.14)"], nucleus: [255, 226, 180], link: [255, 190, 160], base: SPACE, vignette: true },
	cyber: { hues: [175, 285, 320, 200, 240, 300, 160, 265], veils: ["rgba(20,110,120,0.22)", "rgba(110,40,150,0.2)", "rgba(30,90,160,0.16)", "rgba(140,40,110,0.12)"], nucleus: [210, 255, 245], link: [140, 255, 240], base: SPACE, vignette: true },
	matrix: { hues: [120, 140, 96, 160, 110, 132, 88, 150], veils: ["rgba(20,80,40,0.22)", "rgba(20,110,60,0.16)", "rgba(40,70,30,0.14)", "rgba(20,60,50,0.12)"], nucleus: [220, 255, 220], link: [120, 255, 160], base: SPACE, vignette: true },
	aurora: { hues: [155, 190, 280, 120, 210, 300, 170, 265], veils: ["rgba(30,110,110,0.2)", "rgba(70,60,150,0.18)", "rgba(40,130,120,0.14)", "rgba(60,110,160,0.12)"], nucleus: [230, 250, 240], link: [170, 240, 220], base: SPACE, vignette: true }
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
	layout: "spiral",
	theme: DEFAULT_THEME,
	brightness: 0.5,
	bloom: 0.44,
	threshold: 0.24,
	veil: 0.34,
	field: 0.7,
	shellSize: 1,
	shellGlow: 1,
	mist: 0.34,
	backdrop: true,
	arms: 2,
	twist: 4.3,
	thickness: 1,
	spread: 1,
	autoOrbit: true,
	orbitSpeed: 0.35,
	quality: "auto",
	tour: false,
	hidden: [],
	only: null,
	orphans: false,
	empty: false,
	lens: null,
	filterText: ""
};

/** Filter and navigation choices that survive a version migration. */
const PRESERVED_KEYS = ["hidden", "only", "filterText", "lens", "orphans", "empty", "autoOrbit", "tour"];

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
	// "Only this workspace" pointing at a hidden workspace leaves nothing to draw.
	// Both halves are stale (a pin survives the hide), so drop the pin and unhide it.
	if (merged.only !== null && merged.hidden.includes(merged.only)) {
		merged.hidden = merged.hidden.filter((id) => id !== merged.only);
		merged.only = null;
		migrated = true;
	}
	return { settings: merged, migrated };
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
const HUES = [265, 208, 158, 28, 330, 96, 190, 12];

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
 * @param options - `{ showArchived }`.
 * @returns `{ nodes, links, stats }`; node ids are `ws:<id>` or the session id.
 */
function buildGraph(workspaces, sessions, options) {
	const showArchived = options?.showArchived === true;
	const hidden = options?.hidden instanceof Set ? options.hidden : new Set(Array.isArray(options?.hidden) ? options.hidden : []);
	const only = typeof options?.only === "string" && options.only !== "" ? options.only : null;
	const showOrphans = options?.showOrphans === true;
	const showEmpty = options?.showEmpty === true;
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
			links.push({ a: folder.index, b: node.index, kind: "member" });
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
		links.push({ a: parent.index, b: node.index, kind: "lineage" });
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
const LAYOUTS = ["spiral", "rings", "lattice", "bubble", "helix", "clusters", "plate", "tree"];

/**
 * One folder position for a given silhouette.
 *
 * Every layout keeps the same contract — the outermost body sits near radius 1 and
 * Y stays inside `thickness` — so the camera framing, picking, tracking and the dust
 * layer all keep working without knowing which shape is on screen.
 *
 * @param layout - one of {@link LAYOUTS}.
 * @param index - folder ordinal.
 * @param count - total folders, used to spread the sequence.
 * @param salt - re-roll seed.
 * @param folderId - id, for stable jitter.
 * @param shape - resolved shape numbers (`arms`, `twist`, `thickness`, `spread`).
 * @returns position plus the resolved radius and arm/blot index.
 */
function placeFolder(layout, index, count, salt, folderId, shape) {
	const share = count <= 1 ? 0.45 : index / Math.max(1, count - 1);
	const jitter = hash01(`${folderId}:${salt}`) - 0.5;
	const jitterY = hash01(`${folderId}:h${salt}`) - 0.5;
	const { arms, twist, thickness } = shape;
	const lift = (scale) => jitterY * scale * thickness;

	if (layout === "rings") {
		// Clean concentric orbits: no arm twist at all, four rings deep.
		const ring = index % 4;
		const radius = 0.26 + ring * 0.24;
		const angle = (index / Math.max(1, Math.ceil(count / 4))) * TAU + jitter * 0.06;
		return { x: Math.cos(angle) * radius, y: lift(0.02), z: Math.sin(angle) * radius, radius, arm: ring };
	}

	if (layout === "lattice") {
		// A crystal: integer grid, then a breath of jitter so edges are not ruled lines.
		const side = Math.max(1, Math.ceil(Math.cbrt(Math.max(1, count))));
		const gx = index % side;
		const gy = Math.floor(index / side) % side;
		const gz = Math.floor(index / (side * side)) % side;
		const span = 0.9;
		const unit = (value) => (side === 1 ? 0 : (value / (side - 1)) * 2 * span - span);
		return {
			x: unit(gx) + jitter * 0.015,
			y: unit(gy) * 0.7 + jitterY * 0.015,
			z: unit(gz) + jitter * 0.015,
			radius: Math.hypot(unit(gx), unit(gz)),
			arm: index % 2
		};
	}

	if (layout === "bubble") {
		// A hollow shell: every body equidistant from the core.
		const lift01 = count <= 1 ? 0.5 : (index + 0.5) / count;
		const phi = Math.acos(Math.max(-1, Math.min(1, 1 - 2 * lift01)));
		const theta = index * Math.PI * (3 - Math.sqrt(5));
		const radius = 0.92 + jitter * 0.05;
		return {
			x: Math.sin(phi) * Math.cos(theta) * radius,
			y: Math.cos(phi) * radius * 0.86,
			z: Math.sin(phi) * Math.sin(theta) * radius,
			radius,
			arm: index % arms
		};
	}
	if (layout === "helix") {
		// Two strands climbing a cylinder.
		const strand = index % 2;
		const t = count <= 1 ? 0 : index / (count - 1);
		const angle = t * TAU * 1.6 + strand * Math.PI + jitter * 0.05;
		const radius = 0.52;
		return {
			x: Math.cos(angle) * radius,
			y: (t - 0.5) * 1.5 * Math.max(0.6, thickness),
			z: Math.sin(angle) * radius,
			radius,
			arm: strand
		};
	}

	if (layout === "clusters") {
		// A handful of dense blobs — galaxies in a small group.
		const blobs = 5;
		const blob = index % blobs;
		const centreAngle = (blob / blobs) * TAU + jitter * 0.2;
		const centreRadius = 0.68;
		const spreadLocal = 0.15;
		return {
			x: Math.cos(centreAngle) * centreRadius + jitter * spreadLocal,
			y: lift(0.16) + (blob % 2 === 0 ? 0.08 : -0.08),
			z: Math.sin(centreAngle) * centreRadius + jitterY * spreadLocal,
			radius: centreRadius,
			arm: blob
		};
	}

	if (layout === "plate") {
		// A flat sheet: a rectangular rank and file, almost no depth.
		const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
		const gx = index % cols;
		const gz = Math.floor(index / cols);
		const rows = Math.max(1, Math.ceil(count / cols));
		const half = 0.95;
		const x = cols === 1 ? 0 : (gx / (cols - 1)) * 2 * half - half;
		const z = rows === 1 ? 0 : (gz / (rows - 1)) * 2 * half - half;
		return { x: x + jitter * 0.03, y: lift(0.02), z: z + jitterY * 0.03, radius: Math.hypot(x, z), arm: index % arms };
	}

	if (layout === "tree") {
		// Radiating branches: a trunk of six spokes, each carrying its own length.
		const branches = Math.max(3, Math.min(7, arms * 3));
		const branch = index % branches;
		const depth = Math.floor(index / branches);
		const depthCount = Math.max(1, Math.ceil(count / branches));
		const radius = 0.3 + (0.72 * (depth + 1)) / depthCount;
		const angle = (branch / branches) * TAU + jitter * 0.22;
		const bend = jitter * 0.16;
		return {
			x: Math.cos(angle + bend) * radius,
			y: lift(0.03) + (1 - radius) * 0.05,
			z: Math.sin(angle + bend) * radius,
			radius,
			arm: branch
		};
	}

	// Spiral: the original flattened disc.
	const radius = 0.18 + 0.8 * Math.pow(share, 0.78);
	const arm = index % arms;
	const armTwist = twist + (arm % 2 === 1 ? 0.42 : 0);
	const angle = (arm / arms) * TAU + radius * armTwist + jitter * 0.16;
	return { x: Math.cos(angle) * radius, y: lift(0.022), z: Math.sin(angle) * radius, radius, arm };
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

	if (layout === "lattice") {
		const span = 0.9;
		return { x: (rnd() * 2 - 1) * span, y: (rnd() * 2 - 1) * span * 0.7, z: (rnd() * 2 - 1) * span };
	}
	if (layout === "bubble") {
		const lift = rnd() * 2 - 1;
		const ring = Math.sqrt(Math.max(0, 1 - lift * lift));
		const angle = rnd() * TAU;
		const radius = 0.9 + rnd() * 0.06;
		return { x: Math.cos(angle) * ring * radius, y: lift * radius * 0.86, z: Math.sin(angle) * ring * radius };
	}
	if (layout === "helix") {
		const strand = rnd() > 0.5 ? 1 : 0;
		const t = rnd();
		const angle = t * TAU * 1.6 + strand * Math.PI;
		const radius = 0.52 + (rnd() - 0.5) * 0.06;
		return { x: Math.cos(angle) * radius, y: (t - 0.5) * 1.5 * Math.max(0.6, thickness), z: Math.sin(angle) * radius };
	}
	if (layout === "rings") {
		const ring = Math.floor(rnd() * 4);
		const radius = 0.26 + ring * 0.24 + (rnd() - 0.5) * 0.05;
		const angle = rnd() * TAU;
		return { x: Math.cos(angle) * radius, y: thin(0.02), z: Math.sin(angle) * radius };
	}
	if (layout === "clusters") {
		const blob = Math.floor(rnd() * 5);
		const centreAngle = (blob / 5) * TAU;
		const jitterX = (rnd() - 0.5) * 0.26;
		const jitterZ = (rnd() - 0.5) * 0.26;
		return {
			x: Math.cos(centreAngle) * 0.68 + jitterX,
			y: (rnd() - 0.5) * 0.3 + (blob % 2 === 0 ? 0.06 : -0.06),
			z: Math.sin(centreAngle) * 0.68 + jitterZ
		};
	}
	if (layout === "plate") {
		return { x: (rnd() * 2 - 1) * 0.95, y: thin(0.02), z: (rnd() * 2 - 1) * 0.95 };
	}
	if (layout === "tree") {
		const branches = Math.max(3, Math.min(7, arms * 3));
		const branch = Math.floor(rnd() * branches);
		const radius = 0.24 + rnd() * 0.82;
		const angle = (branch / branches) * TAU;
		const side = (rnd() - 0.5) * 0.06;
		return {
			x: Math.cos(angle) * radius + Math.sin(angle) * side,
			y: thin(0.03) + (1 - radius) * 0.05,
			z: Math.sin(angle) * radius - Math.cos(angle) * side
		};
	}
	const radius = Math.pow(rnd(), 0.55) * 1.02;
	const angle = rnd() * TAU;
	return { x: Math.cos(angle) * radius, y: thin(0.02 + radius * 0.03), z: Math.sin(angle) * radius };
}

/**
 * Faint structural lines that name the silhouette: rings, a wireframe shell, two
 * strands, a box, a sheet, spokes, or nothing for the spiral (its arms already read).
 *
 * @param layout - one of {@link LAYOUTS}.
 * @returns array of polylines in world space.
 */
function layoutGuides(layout) {
	const ring = (radius, segments = 96) => {
		const points = [];
		for (let i = 0; i <= segments; i += 1) {
			const angle = (i / segments) * TAU;
			points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
		}
		return points;
	};

	if (layout === "rings") return [ring(0.26), ring(0.5), ring(0.74), ring(0.98)];
	if (layout === "plate") {
		const lines = [];
		for (let i = -3; i <= 3; i += 1) {
			const offset = (i / 3) * 0.95;
			lines.push([[-0.95, 0, offset], [0.95, 0, offset]]);
			lines.push([[offset, 0, -0.95], [offset, 0, 0.95]]);
		}
		return lines;
	}
	if (layout === "lattice") {
		// A box wireframe reads as random beams from most angles, so the grid itself
		// is the structure: one short cross per lattice point.
		const span = 0.9;
		const marks = [];
		for (const x of [-span, 0, span]) {
			for (const y of [-span * 0.7, 0, span * 0.7]) {
				for (const z of [-span, 0, span]) {
					if (x === 0 && y === 0 && z === 0) continue;
					marks.push([[x - 0.035, y, z], [x + 0.035, y, z]]);
					marks.push([[x, y - 0.035, z], [x, y + 0.035, z]]);
					marks.push([[x, y, z - 0.035], [x, y, z + 0.035]]);
				}
			}
		}
		return marks;
	}
	if (layout === "bubble") {
		const guides = [];
		for (const tilt of [0, Math.PI / 3, -Math.PI / 3]) {
			const points = [];
			for (let i = 0; i <= 96; i += 1) {
				const angle = (i / 96) * TAU;
				const ring = Math.cos(angle) * 0.92;
				const rise = Math.sin(angle) * 0.92;
				points.push([ring, rise * Math.sin(tilt), rise * Math.cos(tilt)]);
			}
			guides.push(points);
		}
		return guides;
	}
	if (layout === "helix") {
		const strands = [];
		for (const strand of [0, 1]) {
			const points = [];
			for (let i = 0; i <= 120; i += 1) {
				const t = i / 120;
				const angle = t * TAU * 1.6 + strand * Math.PI;
				points.push([Math.cos(angle) * 0.52, (t - 0.5) * 1.5, Math.sin(angle) * 0.52]);
			}
			strands.push(points);
		}
		return strands;
	}
	if (layout === "tree") {
		const lines = [];
		for (let branch = 0; branch < 6; branch += 1) {
			const angle = (branch / 6) * TAU;
			lines.push([[0, 0, 0], [Math.cos(angle) * 1, 0, Math.sin(angle) * 1]]);
		}
		return lines;
	}
	if (layout === "clusters") {
		const lines = [];
		for (let blob = 0; blob < 5; blob += 1) {
			const centreAngle = (blob / 5) * TAU;
			const points = [];
			for (let i = 0; i <= 48; i += 1) {
				const angle = (i / 48) * TAU;
				points.push([Math.cos(centreAngle) * 0.68 + Math.cos(angle) * 0.14, Math.sin(angle) * 0.1, Math.sin(centreAngle) * 0.68 + Math.sin(angle) * 0.14]);
			}
			lines.push(points);
		}
		return lines;
	}
	return [];
}

/** Dust speck radius: haze is finer than the lane. */
function dustSize(haze, index) {
	return haze ? 0.4 + hash01(`dust:${index}:s`) * 0.7 : 0.5 + hash01(`dust:${index}:s`) * 1.2;
}

/**
 * Place every member on a flattened spiral disc, in units where the outermost
 * star sits at radius ≈ 1 and the disc is thin in Y.
 *
 * Pure function of ids and counts: the same data always yields the same galaxy,
 * so the picture is stable across reloads and no solver has to run.
 *
 * @param graph - output of {@link buildGraph}.
 * @param seed - bump to re-roll jitter (the "re-layout" button).
 * @returns `{ nodes, links, dust, extent }`.
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
	const byId = new Map(nodes.map((node) => [node.id, node]));
	const golden = Math.PI * (3 - Math.sqrt(5));

	folders.forEach((folder, index) => {
		const placed = placeFolder(layout, index, folders.length, salt, folder.id, shapeNumbers);
		folder.x = placed.x;
		folder.y = placed.y;
		folder.z = placed.z;
		folder.arm = placed.arm;
		folder.discRadius = placed.radius;
		folder.size = 2.5 + Math.min(2.6, Math.sqrt(folder.count) * 0.26);
	});

	// Off-disc shapes are not mass-symmetric (six branches, five blobs, a 3x3x3 grid
	// with empty cells), so the body would hang off the middle of the shell and get
	// re-centred here. The spiral is centred on its nucleus by construction and must
	// keep it: shifting a two-arm disc to its own midpoint halves it.
	let offsetX = 0;
	let offsetY = 0;
	let offsetZ = 0;
	if (layout !== "spiral" && folders.length > 0) {
		for (const folder of folders) {
			offsetX += folder.x;
			offsetY += folder.y;
			offsetZ += folder.z;
		}
		offsetX /= folders.length;
		offsetY /= folders.length;
		offsetZ /= folders.length;
		for (const folder of folders) {
			folder.x -= offsetX;
			folder.y -= offsetY;
			folder.z -= offsetZ;
		}
	}

	for (const node of nodes) {
		if (node.kind !== "session") continue;
		const hub = byId.get(node.folderId);
		if (hub === undefined) {
			const angle = hash01(`${node.id}:${salt}`) * TAU;
			const radius = 0.12 + hash01(`${node.id}:r${salt}`) * 0.2;
			node.x = Math.cos(angle) * radius;
			node.z = Math.sin(angle) * radius;
			node.y = (hash01(`${node.id}:y${salt}`) - 0.5) * 0.04 * thickness;
			node.size = 1.05 + node.recency * 0.55;
			continue;
		}
		const cluster = (0.03 + Math.min(0.13, Math.sqrt(hub.count) * 0.024)) * spread;
		if (layout !== "spiral") {
			// Off the disc there is no arm to trail along: cluster around the hub.
			node.x = hub.x + (hash01(`${node.id}:a${salt}`) * 2 - 1) * cluster * 1.5;
			node.z = hub.z + (hash01(`${node.id}:d${salt}`) * 2 - 1) * cluster * 1.5;
			node.y = hub.y + (hash01(`${node.id}:y${salt}`) - 0.5) * (0.02 + cluster * 2.4);
			node.size = 0.85 + node.recency * 0.6 + (node.running ? 0.28 : 0);
			node.arm = hub.arm;
			continue;
		}
		const along = (hash01(`${node.id}:a${salt}`) * 2 - 1) * cluster * 2.1;
		const across = (hash01(`${node.id}:d${salt}`) * 2 - 1) * cluster * 0.6;
		// Log-spiral tangent at the hub, so members trail along the arm instead of balling up.
		const theta = Math.atan2(hub.z, hub.x);
		const tangentLength = Math.hypot(Math.cos(theta) - twist * Math.sin(theta), Math.sin(theta) + twist * Math.cos(theta)) || 1;
		const tangentX = (Math.cos(theta) - twist * Math.sin(theta)) / tangentLength;
		const tangentZ = (Math.sin(theta) + twist * Math.cos(theta)) / tangentLength;
		const hubRadius = Math.hypot(hub.x, hub.z) || 1;
		node.x = hub.x + tangentX * along + (hub.x / hubRadius) * across;
		node.z = hub.z + tangentZ * along + (hub.z / hubRadius) * across;
		node.y = (hash01(`${node.id}:y${salt}`) - 0.5) * (0.012 + cluster * 0.8) * thickness;
		node.size = 0.85 + node.recency * 0.6 + (node.running ? 0.28 : 0);
		node.arm = hub.arm;
	}

	// Dust: the diffuse body of whatever shape is on screen. Rendered as sub-pixel
	// haze, never clickable. Spiral gets its arm lanes; every other layout samples
	// the same placement function, so the haze inherits the silhouette for free.
	const dust = [];
	if (layout !== "spiral") {
		// More grains than the disc needs: a cube or a shell has no arm to concentrate
		// the haze, so the volume only reads when it is dense enough to be continuous.
		for (let index = 0; index < 5600; index += 1) {
			const placed = placeDust(layout, index, salt, shapeNumbers);
			const haze = hash01(`dust:${index}:haze`) > 0.72;
			dust.push({
				x: placed.x - offsetX,
				y: placed.y - offsetY,
				z: placed.z - offsetZ,
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
		const armTwist = twist + (arm % 2 === 1 ? 0.42 : 0);
		const angle = (arm / arms) * TAU + radius * armTwist + lane;
		dust.push({
			x: Math.cos(angle) * radius,
			z: Math.sin(angle) * radius,
			y: (hash01(`dust:${index}:y`) - 0.5) * (0.014 + radius * 0.03) * thickness,
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
			x: Math.cos(angle) * radius,
			z: Math.sin(angle) * radius,
			y: (hash01(`field:${index}:y`) - 0.5) * (0.016 + radius * 0.03) * thickness,
			hue: 252 + (hash01(`field:${index}:h`) - 0.5) * 70,
			alpha: 0.018 + hash01(`field:${index}:a2`) * 0.05,
			size: 0.5 + hash01(`field:${index}:s`) * 1
		});
	}

	// A soft glow around the very core, where the arms converge. Kept small and dim:
	// a bright nucleus reads as a white blob sitting on top of the view.
	for (let index = 0; index < 110; index += 1) {
		const angle = hash01(`core:${index}:a`) * TAU;
		const radius = Math.pow(hash01(`core:${index}:r`), 1.8) * 0.16;
		dust.push({
			x: Math.cos(angle) * radius,
			z: Math.sin(angle) * radius,
			y: (hash01(`core:${index}:y`) - 0.5) * 0.03 * thickness,
			hue: 46,
			alpha: 0.02 + hash01(`core:${index}:a2`) * 0.05,
			size: 0.6 + hash01(`core:${index}:s`) * 0.9
		});
	}

	let extent = 0.2;
	for (const node of nodes) {
		// Tall layouts (lattice, bubble, helix) need the vertical axis in the framing
		// too, or the camera fits the disc and clips the shape.
		extent = Math.max(extent, Math.hypot(node.x, node.z), Math.abs(node.y) * 1.7);
	}
	return { nodes, links: graph.links, dust, extent: Math.min(1.25, extent), golden };
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
	const right = normalize(cross(forward, { x: 0, y: 1, z: 0 }));
	const up = cross(right, forward);
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
	{ count: 2600, size: 1.2 },
	{ count: 900, size: 2 },
	{ count: 250, size: 3 }
];
/** Muted on-screen tints: neutral, light neutral, grey-blue, warm, bright (L-class only). */
const SKY_TINTS = [
	[191, 192, 196],
	[203, 203, 204],
	[155, 161, 176],
	[206, 196, 179],
	[210, 211, 212]
];
const SKY_BRIGHT_TINT = 4;
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
			let tint = pick < 0.42 ? 0 : pick < 0.62 ? 1 : pick < 0.88 ? 2 : 3;
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

		// ── src/warp.js ────────────────────────────────────────────────
/**
 * The "enter the star" transition.
 *
 * Opening a conversation from the galaxy should feel like flying into it: a shell
 * of white points around the camera stretches into accelerating lines, the flight
 * turns the colour of the star, and it lands inside a hollow sphere of that colour
 * while the conversation comes up underneath.
 *
 * The overlay lives on `document.body`, not inside the plugin's slot, because the
 * harness swaps the main panel as the conversation opens — the transition has to
 * survive that swap long enough to dissolve over the chat.
 */

const WARP_BASE = "#1c1c1c";

/** Clamp helper kept local so the bundle has no cross-module constant clashes. */
function warpClamp(value, low, high) {
	return value < low ? low : value > high ? high : value;
}

/** Ease-out so the flight spends its speed early and settles softly. */
function warpEase(value) {
	const t = warpClamp(value, 0, 1);
	return 1 - (1 - t) * (1 - t);
}

/**
 * Play the transition once.
 *
 * @param {{ hue: number, base?: string, onArrive?: () => void, sped?: number }} options
 *   `hue` is the star's hue in degrees; `base` is the theme's plane colour;
 *   `onArrive` runs at the moment the camera is inside the sphere (so the chat is
 *   already mounted when the shell fades).
 */
function playWarp(options) {
	const base = typeof options.base === "string" ? options.base : WARP_BASE;
	if (typeof document === "undefined") {
		options.onArrive?.();
		return null;
	}

	const still = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const scale = still ? 0.45 : 1;
	const travelEnd = 640 * scale;
	const shellStart = 470 * scale;
	const arriveAt = 900 * scale;
	const fadeStart = 980 * scale;
	const fadeEnd = 1520 * scale;

	const host = document.createElement("div");
	host.dataset.dgvWarp = "";
	host.style.cssText = [
		"position:fixed",
		"inset:0",
		"z-index:2147483000",
		"pointer-events:none",
		`background:${base}`
	].join(";");

	const canvas = document.createElement("canvas");
	canvas.style.cssText = "display:block;width:100%;height:100%";
	host.appendChild(canvas);
	document.body.appendChild(host);

	const ratio = Math.min(window.devicePixelRatio || 1, 2);
	let width = window.innerWidth;
	let height = window.innerHeight;
	const sizeCanvas = () => {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = Math.round(width * ratio);
		canvas.height = Math.round(height * ratio);
	};
	sizeCanvas();

	const context = canvas.getContext("2d");
	const rainbow = warpClamp(options.hue, 0, 360);

	// ── phase 1: a shell of points around the camera, then a flight ──────────
	const flight = [];
	const flightCount = Math.round(1100 * (still ? 0.4 : 1));
	for (let index = 0; index < flightCount; index += 1) {
		const angle = Math.random() * Math.PI * 2;
		const radius = 0.08 + Math.random() * 0.92;
		flight.push({
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius,
			z: 0.15 + Math.random() * 0.85,
			px: 0,
			py: 0
		});
	}

	// ── phase 3: the hollow sphere the flight lands inside ───────────────────
	const shell = [];
	const shellCount = Math.round(1500 * (still ? 0.5 : 1));
	const golden = Math.PI * (3 - Math.sqrt(5));
	for (let index = 0; index < shellCount; index += 1) {
		const y = 1 - (index / Math.max(1, shellCount - 1)) * 2;
		const ring = Math.sqrt(Math.max(0, 1 - y * y));
		shell.push({ x: Math.cos(golden * index) * ring, y, z: Math.sin(golden * index) * ring, seed: Math.random() });
	}

	const started = performance.now();
	let arrived = false;
	let frame = 0;
	let last = started;

	const finish = () => {
		cancelAnimationFrame(frame);
		window.removeEventListener("resize", sizeCanvas);
		if (!arrived) {
			arrived = true;
			options.onArrive?.();
		}
		host.remove();
	};

	const paint = (now) => {
		const elapsed = now - started;
		const dt = Math.min(0.05, (now - last) / 1000);
		last = now;

		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		context.globalCompositeOperation = "source-over";
		context.fillStyle = base;
		context.fillRect(0, 0, width, height);

		const cx = width / 2;
		const cy = height / 2;
		const focal = Math.min(width, height) * 0.62;

		// Flight: points rush past, each one drawing its own light trail.
		if (elapsed < travelEnd + 260) {
			const progress = warpEase(elapsed / travelEnd);
			const rush = 0.22 + 5.2 * progress * progress;
			const fade = 1 - warpClamp((elapsed - travelEnd) / 220, 0, 1);
			context.globalCompositeOperation = "lighter";
			for (const star of flight) {
				star.z -= dt * rush;
				if (star.z <= 0.03) {
					const angle = Math.random() * Math.PI * 2;
					const radius = 0.1 + Math.random() * 0.9;
					star.x = Math.cos(angle) * radius;
					star.y = Math.sin(angle) * radius;
					star.z = 1;
					star.px = 0;
					star.py = 0;
				}
				const sx = cx + (star.x / star.z) * focal * 0.5;
				const sy = cy + (star.y / star.z) * focal * 0.5;
				const close = warpClamp(1.15 - star.z, 0, 1);
				const alpha = warpClamp(close * 0.9 + 0.05, 0, 0.92) * fade;
				if (star.px !== 0 || star.py !== 0) {
					context.strokeStyle = `rgba(255,255,255,${alpha * 0.75})`;
					context.lineWidth = 0.5 + close * 1.9;
					context.beginPath();
					context.moveTo(star.px, star.py);
					context.lineTo(sx, sy);
					context.stroke();
				}
				context.fillStyle = `rgba(255,255,255,${alpha})`;
				context.beginPath();
				context.arc(sx, sy, 0.6 + close * 1.7, 0, Math.PI * 2);
				context.fill();
				star.px = sx;
				star.py = sy;
			}
		}

		// Landing: the flight settles into a hollow sphere in the star's colour.
		if (elapsed > shellStart) {
			const reveal = warpClamp((elapsed - shellStart) / (arriveAt - shellStart), 0, 1);
			const spin = (elapsed - shellStart) * 0.00035;
			const cos = Math.cos(spin);
			const sin = Math.sin(spin);
			const radius = Math.min(width, height) * 0.46;
			context.globalCompositeOperation = "lighter";
			for (const dot of shell) {
				const x = dot.x * cos - dot.z * sin;
				const z = dot.x * sin + dot.z * cos;
				const depth = warpClamp((z + 1) / 2, 0, 1);
				const pop = warpClamp(reveal * 1.35 - dot.seed * 0.35, 0, 1);
				if (pop <= 0.01) continue;
				const sx = cx + x * radius;
				const sy = cy + dot.y * radius;
				const alpha = pop * (0.1 + depth * 0.5);
				context.fillStyle = `hsla(${rainbow}, 92%, ${62 + depth * 16}%, ${alpha})`;
				context.beginPath();
				context.arc(sx, sy, 0.9 + depth * 1.5, 0, Math.PI * 2);
				context.fill();
			}
			// A soft core of the same hue, so the middle never reads as a hole.
			const core = context.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.72);
			core.addColorStop(0, `hsla(${rainbow}, 92%, 68%, ${0.1 * reveal})`);
			core.addColorStop(0.55, `hsla(${rainbow}, 92%, 60%, ${0.045 * reveal})`);
			core.addColorStop(1, "rgba(28,28,28,0)");
			context.fillStyle = core;
			context.fillRect(0, 0, width, height);
		}

		if (!arrived && elapsed >= arriveAt) {
			arrived = true;
			options.onArrive?.();
		}

		if (elapsed >= fadeStart) {
			const out = warpClamp(1 - (elapsed - fadeStart) / (fadeEnd - fadeStart), 0, 1);
			host.style.opacity = String(out);
			if (out <= 0.001) {
				finish();
				return;
			}
		}

		frame = requestAnimationFrame(paint);
	};

	window.addEventListener("resize", sizeCanvas);
	frame = requestAnimationFrame(paint);

	return () => {
		if (!arrived) {
			arrived = true;
			options.onArrive?.();
		}
		finish();
	};
}

		// ── src/client.js ──────────────────────────────────────────────
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

		return module.exports;
	}
});

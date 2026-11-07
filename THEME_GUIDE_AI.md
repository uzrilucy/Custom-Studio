# Custom Studio v1.0 — Theme Spec for AI

You are writing a theme for **Custom Studio** (커스텀 스튜디오), a SillyTavern ≥1.11.0 UI extension. The extension skins one character's chat and shows that user's Quick Reply sets in a side panel.

**Your output is ONE JSON file** that the user imports. Follow every rule below. Any unknown key, wrong type or out-of-range value makes the import fail.

## 1. JSON schema (all keys shown; only format/version/id/name are required)

```jsonc
{
  "format": "custom-studio-theme",          // exact string
  "version": 1,                              // exact number
  "id": "my-theme",                          // ^[a-z0-9][a-z0-9-]{0,63}$ ; never "modern-cutie", "sky-blue", "mint-green", "chic-modern"
  "name": "테마 이름",                        // 1–80 chars
  "author": "익명",                           // optional, 1–80 chars
  "colors": {                                // every value #RRGGBB (6 hex digits, no alpha); any subset allowed
    "canvas": "", "surface": "", "user": "", "text": "", "muted": "", "accent": "", "accentSoft": "",
    "border": "", "quote": "", "code": "", "headerA": "", "headerB": "", "button": "", "buttonHover": ""
  },
  "layout": {                                // integers except lineHeight
    "panelWidth": 330,   // 260–460
    "radius": 20,        // 0–36
    "buttonRadius": 14,  // 0–30
    "gap": 10,           // 4–24
    "columns": 2,        // 1–3
    "fontSize": 16,      // 12–24
    "lineHeight": 1.8    // 1.2–2.4
  },
  "decoration": { "symbol": "✦", "title": "", "subtitle": "", "background": "dots" },
  // symbol ≤8 chars; title, subtitle ≤100; background ∈ dots | plain | gradient
  "icons": { "default": ICON, "rules": [ RULE ] },                    // ≤200 rules
  "handle": { "icon": ICON, "label": "QR", "showLabel": true, "size": 22 },
  // label ≤16 chars; size integer 16–48; icon "none" requires showLabel true + non-empty label
  "wallpaper": { "image": "", "size": "cover", "position": "center", "repeat": "no-repeat", "overlay": 0.2, "messageOpacity": 0.94 },
  // image: "" or base64 data URL ≤2MB; size cover|contain|auto; position center|top|bottom|left|right; repeat no-repeat|repeat; overlay/messageOpacity 0–1
  "source": { "panelHtml": "", "handleHtml": "", "panelCss": "", "chatCss": "", "menuCss": "" },   // each ≤48000 chars
  "qrStyles": [ QRSTYLE ]                                              // ≤200
}
```

- `ICON` = `{"type":"native"}` | `{"type":"none"}` | `{"type":"text","value":"♡"}` (≤24 chars) | `{"type":"fa","value":"fa-solid fa-heart"}` (classes `fa-…` only) | `{"type":"image","value":"data:image/png;base64,…"}` (≤256KB; png/jpeg/gif/webp only, no SVG, no http URL)
- `RULE` = `{"set": "Set name" | null, "id": 0, "icon": ICON}` or `{"set": …, "label": "Original QR label", "icon": ICON}`
  - Use either `id` or `label`, never both.
  - `id` requires a non-null `set`.
  - `set: null` requires `label`.
  - No duplicate targets.
- `QRSTYLE` = `{"set": "Set name", "id": 3, "background": "#302846" | "", "image": "" | data URL ≤256KB, "shape": "default|square|round|pill|circle", "html": "", "css": ""}`
  - Use either `id` or `label`, never both.
  - `html` and `css` are ≤12000 chars each.
- **Comments:** do not put comments in the real JSON.

**Contrast to satisfy:** text/canvas ≥ 7:1, text/button ≥ 7:1, muted/canvas ≥ 4.5:1, accent/canvas ≥ 4.5:1. A dark `canvas` (relative luminance < 0.18) switches the theme to dark mode automatically.

## 2. HTML fields (panelHtml, handleHtml, qrStyles[].html)

Real controls are moved into elements carrying `data-cqs-slot`.

**Allowed tags:** `div span section article header footer main nav aside p h2 h3 h4 strong em small b i mark ul ol li figure figcaption img br hr`

**Allowed attributes:**
- `class`, `title`, `aria-hidden`, `data-cqs-slot`
- on `img` only: `src` (https:// or raster data URL) and `alt`

**Forbidden (rejected on save):**
- `style` attribute
- event attributes
- script, style, svg, a, button, iframe and any other tag not listed above

**Slot rules:**
- Each slot is used once.
- A slot is never nested inside another slot.
- No slot on `img`, `br` or `hr`.

| field | required slots | optional slots | element placed in slot |
| --- | --- | --- | --- |
| panelHtml | `close`, `qr` | `eyebrow` `heading` `subtitle` `search` `refresh` `settings` `status` | close=`button.cqs-close`, qr=`div.cqs-content`, eyebrow=`span.cqs-eyebrow`, heading=`h2` (symbol + title), subtitle=`p`, search=`input[type=search]`, refresh/settings=`button.cqs-button`, status=`p.cqs-status` |
| handleHtml | `icon` or `label` (≥1) | the other | icon=`span.cqs-handle-icon`, label=`span.cqs-handle-label` |
| qrStyles[].html | `label` | `icon` | label=`span.cqs-qr-label`, icon=`span.cqs-qr-icon` |

Empty panelHtml or handleHtml keeps the built-in layout. Static text placed outside slots is shown as-is (e.g. a sub-caption per button).

**DOM generated inside `qr`:**
```
div.cqs-content
  section.cqs-set            (one per linked QR set)
    h3.cqs-set-title         "Set name" + span.cqs-count
    div.cqs-grid             (grid, columns = layout.columns)
      button.cqs-qr[data-cqs-design="N"][data-cqs-shape="…"]   (attrs only when a qrStyle matches)
        span.cqs-qr-icon  span.cqs-qr-label    (or your qrStyles html)
  p.cqs-empty                (empty / error messages)
```
Outer frame: `#cqs-root[data-side="right|left"] > button.cqs-handle + aside#cqs-panel` (flex column).

## 3. CSS fields

Each field is wrapped in `@scope (ROOT)`, so it can only affect its root.

| field | ROOT (`:scope`) |
| --- | --- |
| panelCss | `#cqs-root` |
| chatCss | `#sheld`, `#bg1`, `#bg_custom`, `#options` |
| menuCss | `#top-bar`, `#top-settings-holder` |
| qrStyles[].css | `#cqs-root .cqs-qr[data-cqs-design="N"]` (that one button) |

**Allowed:** style rules, CSS nesting, `@media`, `@supports`, `@container`, `@keyframes` (prefix names, e.g. `mytheme-pulse`).

**Not allowed:** `@import`, `@font-face`, `@layer`, `@property` and other at-rules (rejected). No custom fonts can be loaded, so use font stacks with system fallbacks.

**Variables available everywhere:**
- Colors: `--cqs-<color key>`
- Layout (px except columns and lineHeight): `--cqs-<layout key>`
- Derived: `--cqs-onAccent`, `--cqs-shadow`, `--cqs-danger`, `--cqs-scheme`, `--cqs-message-surface`, `--cqs-message-user`
- On buttons with a style: `--cqs-qr-bg`, `--cqs-qr-image`

**Prefer variables over hard-coded colors.**

**Useful hooks:**
- Chat mode: `#sheld[data-cqs-mode="flat|bubbles|document"]` → in chatCss write `:scope[data-cqs-mode="bubbles"] #chat .mes`
- Panel side: `:scope[data-side="left"]` (panelCss)
- Buttons locked while generating: `.cqs-qr:disabled`
- Buttons with a qrStyle: `.cqs-qr[data-cqs-design]`
- Section that contains such buttons: `.cqs-set:has(.cqs-qr[data-cqs-design])`; ordinary sets: `.cqs-set:not(:has(.cqs-qr[data-cqs-design]))`
- Error status: `.cqs-status[data-error="true"]`

**SillyTavern targets (chatCss):**
- Messages: `#chat`, `.mes`, `.mes[is_user="true"]`, `.mes_text`, `.ch_name .name_text`, `.avatar img`, `.mes_buttons .mes_button`, `.swipe_left`, `.swipe_right`
- Input: `#send_form`, `#send_textarea`, `#leftSendForm > div`, `#rightSendForm > div`, `#send_but`, `#mes_stop`
- Native QR bar: `#qr--bar`
- Options menu: `:scope#options .options-content`

**Top bar targets (menuCss):** `:scope#top-bar`, `.drawer-toggle`, `.drawer-icon`, `.drawer-icon.openIcon`, `.drawer-content`

## 4. Mandatory gotchas

1. **Priority.**
   - chatCss and menuCss are compiled with `!important` on every declaration, inside the priority layer `cqs-force`. They beat the user's SillyTavern custom CSS, other theme extensions and inline styles. Do not add `!important` yourself (harmless if present).
   - The extension's default chat/menu styling has specificity 0, so plain selectors win: `:scope .mes`, `:scope #send_form`, `:scope#top-bar`.
   - Because everything there is forced, never set `display`, `height`, `max-height`, `opacity`, `transform`, `position` or `overflow` on SillyTavern elements that open, close or animate (`.mes`, `.drawer-content`, `#left-nav-panel`, `#right-nav-panel`, `.swipe_*`, `#mes_stop`). Exception: hiding `#qr--bar`.
   - panelCss and qrStyles css are NOT forced. Beat the panel defaults with one extra scope: `#cqs-panel .cqs-qr`, `:scope > .cqs-handle`.
2. **Shared custom properties go on `:scope` in panelCss** (= `#cqs-root`) so both panel and handle inherit them. An undefined `var()` voids the whole declaration.
3. **Per-button values via fallback.**
   - Panel CSS reads `var(--q, var(--cqs-accent))`; each qrStyles css sets `:scope { --q: #hex; }`.
   - Never assign `--q` in panelCss on `.cqs-qr`, because that outranks the per-button `:scope`.
4. **Fixed positioning on mobile.**
   - SillyTavern mobile has `body{position:fixed}` and `html{transform}`, so the containing block height is 0.
   - Never use `%` or `top`+`bottom` for the panel or handle. Use `dvh`, e.g. `top: 40dvh`, `height: calc(100dvh - 90px)`.
5. **Native QR bar.** To hide it while the theme is active: chatCss `:scope #qr--bar { display: none; }`.

**Already themed without any source:** background (`#bg1`), chat column, messages (text, names, `q`, `em`, timestamps, buttons), input bar, native QR bar, top bar, drawers and their inputs all follow `colors` automatically. Use chatCss/menuCss only for distinctive design on top.
6. **Full mode (default).** With the profile's apply mode "full", the extension first re-applies SillyTavern's own stylesheet values over whatever theme the user runs: icons, fonts, spacing, borders, shadows, pseudo-element decorations and flex direction. Design as if starting from stock SillyTavern; the user's theme does not leak in.
7. **Icons.** SillyTavern icons are Font Awesome glyphs drawn in `::before`. To replace one, set `content: ""` and paint a mask:
   `:scope SEL { --ico: url("data:image/svg+xml,...") } :scope SEL::before { content: ""; display: inline-block; width: 1em; height: 1em; vertical-align: -.14em; background: currentColor; -webkit-mask: var(--ico) center / contain no-repeat; mask: var(--ico) center / contain no-repeat; }`
   - Inside the SVG data URL use single quotes and encode `#` `<` `>` as `%23` `%3C` `%3E`.
   - Color comes from `color`, not from the SVG.
   - Targets in menuCss: `#ai-config-button .drawer-icon`, `#sys-settings-button .drawer-icon` (disconnected state: `#API-status-top.fa-plug-circle-exclamation`), `#advanced-formatting-button .drawer-icon`, `#WIDrawerIcon`, `#user-settings-button .drawer-icon`, `#backgrounds-button .drawer-icon`, `#extensions-settings-button .drawer-icon`, `#persona-management-button .drawer-icon`, `#rightNavDrawerIcon`.
   - Targets in chatCss: `#options_button`, `#extensionsMenuButton`, `#send_but`, `#mes_stop .fa-circle-stop`, `#mes_continue`, `#mes_impersonate`, `#chat .swipe_left`, `#chat .swipe_right`, `#chat .mes .extraMesButtonsHint`, `#chat .mes .mes_edit`.
8. **Layout.**
   - Allowed: padding, margin, gap, flex-direction (e.g. user messages `row-reverse`), alignment, radius.
   - Avatars via `--avatar-base-width`, `--avatar-base-height` and `--avatar-base-border-radius` on `#chat .mes`.
   - When adding horizontal margin to `.mes`, also set `width: auto; box-sizing: border-box`.
   - Leave chat width (`--sheldWidth`) to the user's setting; bot HTML cards depend on it.
   - Draw button shapes with backgrounds (`radial-gradient` circle) instead of resizing SillyTavern buttons.
9. **No layout breakage.**
   - Do not change `display`, `position`, `width`/`height` or `transform` of SillyTavern containers (`#sheld`, `#chat`, `#form_sheld`, `#top-bar`, drawers) or hide their controls.
   - Spacing, direction, alignment, radius, colors, borders, shadows, typography and icons are all fair game.
10. **Keep the readable contrast** (section 1). Do not rely on transparency over busy backgrounds for body text.

## 5. Output checklist

- [ ] Valid JSON: no comments, no trailing commas, every string escaped. HTML and CSS are JSON strings, so newlines become `\n` and quotes become `\"`.
- [ ] Only schema keys; ranges respected; colors `#RRGGBB`.
- [ ] panelHtml has `close` and `qr` slots; only allowed tags and attributes; no `style=`.
- [ ] Every CSS field parses; no `@import` or `@font-face`; keyframes prefixed.
- [ ] Mobile-safe units for anything fixed.
- [ ] If you write `qrStyles`, ask the user for the exact QR set name and QR ids (or original labels) — do not guess.

Then tell the user how to apply it:
1. JSON 가져오기
2. 테마 저장
3. 캐릭터 설정에서 테마 선택, 「이 캐릭터에서 테마의 HTML/CSS 적용」 켜기 (채팅 · 상단 메뉴 디자인은 「채팅 화면 꾸미기」 · 「상단 메뉴·서랍 꾸미기」도 켜져 있어야 함)
4. 캐릭터에 적용

## 6. Minimal working example

```json
{"format":"custom-studio-theme","version":1,"id":"dusk-glass","name":"황혼 유리","colors":{"canvas":"#1a1726","surface":"#221e31","user":"#2a2540","text":"#eee9fb","muted":"#a9a1c4","accent":"#f0b8c8","accentSoft":"#3a2a36","border":"#363050","quote":"#f6d3dd","code":"#211d30","headerA":"#2b2444","headerB":"#1f2340","button":"#211d31","buttonHover":"#2c2742"},"layout":{"panelWidth":340,"radius":20,"buttonRadius":12,"gap":8,"columns":2,"fontSize":16,"lineHeight":1.85},"decoration":{"symbol":"✧","title":"Dusk","subtitle":"해 질 녘의 바로가기","background":"plain"},"handle":{"icon":{"type":"text","value":"✧"},"label":"QR","showLabel":true,"size":20},"source":{"panelHtml":"<header class=\"dg-head\"><div class=\"dg-row\"><span data-cqs-slot=\"eyebrow\"></span><span data-cqs-slot=\"close\"></span></div><div data-cqs-slot=\"heading\"></div><div data-cqs-slot=\"subtitle\"></div></header><div class=\"dg-tools\"><span class=\"dg-find\" data-cqs-slot=\"search\"></span><span data-cqs-slot=\"refresh\"></span></div><div data-cqs-slot=\"qr\"></div><footer data-cqs-slot=\"status\"></footer>","handleHtml":"","panelCss":":scope { --dg-line: color-mix(in srgb, var(--cqs-accent) 30%, var(--cqs-border)); }\n#cqs-panel { background: linear-gradient(180deg, var(--cqs-headerA), var(--cqs-canvas) 160px); border-color: var(--dg-line); }\n#cqs-panel .dg-head { padding: 18px 18px 10px; }\n#cqs-panel .dg-row { display: flex; justify-content: space-between; align-items: center; }\n#cqs-panel .dg-tools { display: flex; gap: 6px; padding: 6px 14px; }\n#cqs-panel .dg-find { flex: 1; display: flex; }\n#cqs-panel .dg-tools input { width: 100%; padding: 9px 12px; border-radius: 10px; background: var(--cqs-surface); color: var(--cqs-text); border: 1px solid var(--cqs-border); }\n#cqs-panel .cqs-qr { flex-direction: row; justify-content: flex-start; text-align: left; min-height: 54px; border-color: var(--dg-line); }\n#cqs-panel .cqs-qr:hover:not(:disabled) { box-shadow: 0 8px 20px -12px var(--cqs-accent); }\n:scope > .cqs-handle { top: 42dvh; }","chatCss":":scope #send_form { border-radius: 16px; border: 1px solid var(--cqs-border); }\n:scope #send_form #rightSendForm #send_but { color: var(--cqs-accent); }","menuCss":":scope#top-bar { background: var(--cqs-canvas); border-bottom: 1px solid var(--cqs-border); }\n:scope .drawer-icon.openIcon { color: var(--cqs-accent); }"}}
```

/**
 * 완전 적용 모드: 사용자 실리태번 테마를 끄지 않고 그 위에서 이긴다.
 *
 * 실리태번이 실제로 불러온 자기 CSS(style.css, css/*.css, 기본 확장 CSS, 아이콘 글꼴)를 읽는다.
 * 그중 겉모습과 배치에 관한 속성만 골라 우선순위 레이어 cqs-force 안에 !important로 다시 깐다.
 *
 * - 레이어 안의 !important는 레이어 밖의 어떤 !important보다 앞선다.
 *   그래서 사용자 CSS·다른 꾸미기 확장이 바꾼 겉모습이 실리 기본값으로 되돌아간다.
 *   그 위에 확장 기본 규칙과 캐릭터 테마가 올라간다.
 * - 선택자는 :where()로 감싸 우선도를 0으로 둔다. 같은 레이어의 확장 기본 규칙(뒤에 옴)과 테마 소스가 이긴다.
 * - 실리 자바스크립트가 그때그때 바꾸는 속성은 옮기지 않는다.
 *   대상: display, 위치, 크기, transform, opacity, overflow, 애니메이션.
 *   강제로 덮으면 서랍·정지 버튼·입력창 자동 높이가 멈추기 때문이다.
 * - 서랍 내용, 메시지 본문(봇 정규식 HTML), 팝업 내용, 떠 있는 창, 다른 확장이 body에 붙인 요소는 건드리지 않는다.
 * - 실리 버전마다 그 버전이 불러온 CSS를 그대로 읽으므로 1.11~최신에서 각자 맞는 기본값이 나온다.
 */
import { FORCE_LAYER } from './source.js';

const CORE_ROOTS = '#bg1, #bg_custom, #top-bar, #top-settings-holder, #sheld, #options, #extensionsMenu';
const LIMITS = [
    '.drawer-content > *', '.mes_text > *', '.popup-content > *', '#movingDivs',
    '#cqs-root', '.cqs-dialog', `body > :not(${CORE_ROOTS})`
].join(', ');

const PREFIXES = ['background', 'border', 'outline', 'text-decoration', 'font', 'padding', 'margin',
    'list-style', 'mask', '-webkit-mask', 'scrollbar', 'text-emphasis', 'place-'];
const EXACT = new Set(['color', 'box-shadow', 'text-shadow', 'filter', 'backdrop-filter', '-webkit-backdrop-filter',
    'letter-spacing', 'word-spacing', 'text-transform', 'line-height', 'text-align', 'text-indent', 'vertical-align',
    'white-space', 'mix-blend-mode', 'accent-color', 'caret-color', 'cursor', 'fill', 'stroke', 'content',
    'gap', 'row-gap', 'column-gap', 'flex-direction', 'flex-wrap', 'flex-flow', 'align-items', 'align-content',
    'align-self', 'justify-content', 'justify-items', 'justify-self', 'border-radius', 'image-rendering',
    '-webkit-text-stroke', '-webkit-text-fill-color', 'order', 'font-variant', 'text-rendering', 'object-fit', 'object-position']);
const keep = prop => prop.startsWith('--') ? false : EXACT.has(prop) || PREFIXES.some(prefix => prop.startsWith(prefix));

/* 사용자 테마가 실리가 원래 정하지 않은 속성(그림자·배경 그림·필터·꾸밈 가상요소·변형)을 덧붙인 것을 걷어낸다.
   실리 핵심 요소에만 건다. 실리가 원래 정한 값은 바로 뒤의 복사본이 되살린다. */
const STRUCTURAL = [
    '#bg1', '#bg_custom', '#top-bar', '#top-settings-holder', '#top-settings-holder > .drawer', '.drawer-toggle',
    '.drawer-icon', '.drawer-content', '#sheld', '#chat', '#chat .mes', '#chat .mesAvatarWrapper', '#chat .avatar',
    '#chat .avatar img', '#chat .mes_block', '#chat .ch_name', '#chat .name_text', '#chat .timestamp', '#chat .mes_buttons',
    '#chat .mes_button', '#chat .swipe_left', '#chat .swipe_right', '#chat .swipes-counter', '#chat .swipeRightBlock',
    '#chat .mes_text', '#form_sheld', '#send_form', '#nonQRFormItems', '#leftSendForm', '#rightSendForm',
    '#leftSendForm > *', '#rightSendForm > *', '#send_textarea', '#qr--bar', '#qr--bar .qr--button', '#options',
    '#options .options-content', '#extensionsMenu'
].join(', ');
const RESET = `:where(${STRUCTURAL}) {
  background-image: none !important; box-shadow: none !important; text-shadow: none !important;
  filter: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
  mix-blend-mode: normal !important; border-image: none !important; outline-style: none !important;
  letter-spacing: normal !important; text-transform: none !important; font-style: normal !important;
  border-radius: 0 !important; border-style: none !important; mask: none !important; -webkit-mask: none !important;
  font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important;
  text-align: inherit !important; text-decoration: none !important; word-spacing: normal !important;
  padding: 0 !important; margin: 0 !important; gap: normal !important; order: 0 !important;
  flex-direction: row !important; flex-wrap: nowrap !important; justify-content: normal !important;
  align-items: normal !important; align-self: auto !important; align-content: normal !important;
}
:where(${STRUCTURAL}):where(:not(.drawer-icon, #leftSendForm > *, #rightSendForm > *, #chat .swipe_left, #chat .swipe_right, #chat .mes_button))::before,
:where(${STRUCTURAL}):where(:not(.drawer-icon, #leftSendForm > *, #rightSendForm > *, #chat .swipe_left, #chat .swipe_right, #chat .mes_button))::after { content: none !important; }
:where(#top-bar, #top-settings-holder, #sheld, #chat, #form_sheld, #send_form, #chat .mes, #chat .mes_block, .drawer-icon, #chat .avatar) { transform: none !important; }
:where(#top-bar, #top-settings-holder) { opacity: 1 !important; }
:where(#chat .mesAvatarWrapper, #chat .avatar, #chat .avatar img) { opacity: 1 !important; }
`;

function splitTop(text, sep) {
    const out = []; let depth = 0, quote = '', start = 0;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; continue; }
        if (c === '"' || c === "'") quote = c;
        else if (c === '(' || c === '[') depth++;
        else if (c === ')' || c === ']') depth = Math.max(0, depth - 1);
        else if (c === sep && depth === 0) { out.push(text.slice(start, i)); start = i + 1; }
    }
    out.push(text.slice(start));
    return out.map(part => part.trim()).filter(Boolean);
}
const PSEUDO_ELEMENT = /((?::{1,2}(?:before|after|first-line|first-letter)|::(?:marker|placeholder|selection|backdrop|file-selector-button|-webkit-[a-z-]+|-moz-[a-z-]+))(?:\([^)]*\))?(?::[a-z-]+(?:\([^)]*\))?)*)$/i;
function rewriteSelector(selectorText) {
    const parts = [];
    for (const raw of splitTop(selectorText, ',')) {
        if (/(^|[\s>+~(,])(?::root|html)(?![-\w])/i.test(raw)) continue;
        let base = raw, pe = '';
        const match = PSEUDO_ELEMENT.exec(raw);
        if (match) {
            pe = match[1].replace(/^:(?=[a-z])/i, '::');
            base = raw.slice(0, match.index).trim() || '*';
        }
        if (base.includes('::') || /[>+~]$/.test(base)) continue;
        parts.push(`:where(${base}):where(:scope, :scope *)${pe}`);
    }
    return parts.join(', ');
}
function declarations(style) {
    const kept = [];
    for (const declaration of splitTop(style.cssText, ';')) {
        const colon = declaration.indexOf(':');
        if (colon < 1) continue;
        const prop = declaration.slice(0, colon).trim().toLowerCase();
        if (!keep(prop)) continue;
        const value = declaration.slice(colon + 1).replace(/!\s*important\s*$/i, '').trim();
        if (value) kept.push(`${prop}: ${value} !important`);
    }
    return kept.join('; ');
}
function copyRules(rules, faFilter) {
    let out = '';
    for (const rule of rules) {
        const type = rule.constructor.name;
        if (type === 'CSSStyleRule') {
            if (faFilter && !faFilter(rule.selectorText)) continue;
            const body = declarations(rule.style);
            if (!body) continue;
            const selector = rewriteSelector(rule.selectorText);
            if (selector) out += `${selector} { ${body} }\n`;
        } else if (type === 'CSSMediaRule' || type === 'CSSSupportsRule' || type === 'CSSContainerRule') {
            const inner = copyRules(rule.cssRules, faFilter);
            if (inner) out += `${rule.cssText.slice(0, rule.cssText.indexOf('{'))}{\n${inner}}\n`;
        }
    }
    return out;
}
function coreSheet(sheet) {
    let path;
    try { path = new URL(sheet.href, location.href).pathname; } catch { return null; }
    if (new URL(sheet.href, location.href).origin !== location.origin) return null;
    if (/\/css\/user\.css$/i.test(path)) return null;
    if (/\/(fontawesome|solid)\.min\.css$/i.test(path)) return 'icons';
    if (/\/css\/(jquery-ui|bright|cropper|toastr|select2|brands)\.min\.css$/i.test(path)) return null;
    if (/^\/style\.css$/i.test(path) || /^\/css\/[^/]+\.css$/i.test(path)) return 'core';
    if (/^\/scripts\/extensions\/(?!third-party\/)[^/]+\/style\.css$/i.test(path)) return 'core';
    return null;
}
function iconFilter() {
    const used = new Set();
    for (const node of document.querySelectorAll(`#top-settings-holder [class*="fa-"], #sheld [class*="fa-"], #options [class*="fa-"], #extensionsMenu [class*="fa-"], #message_template [class*="fa-"]`)) {
        for (const name of node.classList) if (name.startsWith('fa-')) used.add(name);
    }
    return selector => {
        const names = selector.match(/\.fa-[a-z0-9-]+/gi);
        if (!names) return true;
        return names.some(name => used.has(name.slice(1)));
    };
}

let built = '';
export function buildHostBase() {
    let core = '', icons = '';
    const faFilter = iconFilter();
    for (const sheet of document.styleSheets) {
        if (!sheet.href) continue;
        const kind = coreSheet(sheet);
        if (!kind) continue;
        let rules;
        try { rules = sheet.cssRules; } catch { continue; }
        if (kind === 'icons') icons += copyRules(rules, faFilter);
        else core += copyRules(rules, null);
    }
    built = `@layer ${FORCE_LAYER} {\n@scope (body.cqs-full) to (${LIMITS}) {\n${RESET}\n${icons}\n${core}\n}\n}`;
    return built;
}
export function hostBase() { return built || buildHostBase(); }

/** 완전 적용으로도 남는 사용자 CSS가 있을 때 고르는 선택지: 이 캐릭터 화면에서만 사용자 CSS를 잠시 끈다. */
const MUTED = 'data-cqs-muted';
export function muteHostCss(on) {
    const targets = [document.getElementById('custom-style'), ...document.querySelectorAll('link[rel="stylesheet"][href$="css/user.css"]')].filter(Boolean);
    for (const node of targets) {
        if (on) {
            if (!node.hasAttribute(MUTED)) node.setAttribute(MUTED, node.getAttribute('media') ?? '');
            node.setAttribute('media', 'not all');
        } else if (node.hasAttribute(MUTED)) {
            const media = node.getAttribute(MUTED);
            if (media) node.setAttribute('media', media); else node.removeAttribute('media');
            node.removeAttribute(MUTED);
        }
    }
}

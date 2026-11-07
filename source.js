/** Source is declarative. Live controls are moved into slots and keep their event listeners. */
const tags = new Set('div span section article header footer main nav aside p h2 h3 h4 strong em small b i mark ul ol li figure figcaption img br hr'.split(' '));
const panelSlots = ['eyebrow', 'heading', 'subtitle', 'close', 'search', 'refresh', 'settings', 'qr', 'status'];
const handleSlots = ['icon', 'label'];
const qrSlots = ['icon', 'label'];
const groups = new Set(['CSSMediaRule', 'CSSSupportsRule', 'CSSContainerRule']);
const ruleNames = new Set(['CSSStyleRule', 'CSSKeyframesRule', ...groups]);

function cleanHtml(input, allowed, required, label) {
    if (!input.trim()) return null;
    const parsed = document.createElement('template');
    parsed.innerHTML = input;
    const inert = parsed.content.ownerDocument;
    const result = inert.createDocumentFragment();
    const slots = new Set();
    function copy(source, target) {
        for (const node of source.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                target.append(inert.createTextNode(node.textContent));
                continue;
            }
            if (node.nodeType !== Node.ELEMENT_NODE) continue;
            const tag = node.localName;
            if (!tags.has(tag) || node.namespaceURI !== 'http://www.w3.org/1999/xhtml') throw new Error(`${label}: <${tag}> 태그는 사용할 수 없습니다.`);
            const next = inert.createElement(tag);
            for (const {name, value} of node.attributes) {
                if (name === 'data-cqs-slot') {
                    if (!allowed.includes(value) || slots.has(value) || ['img', 'br', 'hr'].includes(tag)) {
                        throw new Error(`${label}: 알 수 없거나 중복된 슬롯 ${value}`);
                    }
                    slots.add(value);
                } else if (name === 'src' && tag === 'img') {
                    if (!/^data:image\/(png|jpeg|gif|webp);base64,[a-z0-9+/]+={0,2}$/i.test(value)
                        && !/^https:\/\/[^\s]+$/i.test(value)) throw new Error(`${label}: 이미지 주소는 HTTPS 또는 래스터 data URL을 사용하세요.`);
                } else if (!(name === 'alt' && tag === 'img') && !['class', 'title', 'aria-hidden'].includes(name)) {
                    throw new Error(`${label}: ${name} 속성은 사용할 수 없습니다.`);
                }
                next.setAttribute(name, value);
            }
            if (node.hasAttribute('data-cqs-slot') && node.querySelector('[data-cqs-slot]')) {
                throw new Error(`${label}: 슬롯 안에는 다른 슬롯을 넣을 수 없습니다.`);
            }
            copy(node, next);
            target.append(next);
        }
    }
    copy(parsed.content, result);
    if (required.some(name => !slots.has(name))) throw new Error(`${label}: 필수 슬롯 ${required.join(', ')}을 넣어주세요.`);
    if (allowed === handleSlots && !slots.size) throw new Error('손잡이 HTML에는 icon 또는 label 슬롯을 넣어주세요.');
    return result;
}

function cssFor(input, scope, label) {
    if (!input.replace(/\/\*[\s\S]*?\*\//g, '').trim()) return '';
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(input);
    if (!sheet.cssRules.length) throw new Error(`${label}: 적용할 CSS 규칙이 없습니다.`);
    function checkRules(rules) {
        for (const rule of rules) {
            const type = rule.constructor.name;
            if (!ruleNames.has(type) && type !== 'CSSNestedDeclarations') throw new Error(`${label}: 지원하지 않는 CSS 규칙입니다.`);
            if (groups.has(type) || type === 'CSSStyleRule') checkRules(rule.cssRules || []);
        }
    }
    checkRules(sheet.cssRules);
    // CSSOM serializes complete rules so malformed input cannot close the enclosing scope.
    sheet.replaceSync(`@scope (${scope}) { ${[...sheet.cssRules].map(rule => rule.cssText).join('\n')} }`);
    if (sheet.cssRules[0]?.constructor.name !== 'CSSScopeRule') throw new Error('이 브라우저는 CSS @scope를 지원하지 않습니다.');
    return sheet.cssRules[0].cssText;
}

export function compileSource(theme) {
    const {source, qrStyles} = theme;
    return {
        panel: cleanHtml(source.panelHtml, panelSlots, ['close', 'qr'], '패널 HTML'),
        handle: cleanHtml(source.handleHtml, handleSlots, [], '손잡이 HTML'),
        panelCss: cssFor(source.panelCss, '#cqs-root', '패널 CSS'),
        chatCss: cssFor(source.chatCss, '#sheld, #bg1, #bg_custom, #options', '채팅 CSS'),
        menuCss: cssFor(source.menuCss, '#top-bar, #top-settings-holder', '상단 메뉴 CSS'),
        qr: qrStyles.map((rule, index) => ({
            html: cleanHtml(rule.html, qrSlots, ['label'], 'QR HTML'),
            css: cssFor(rule.css, `#cqs-root .cqs-qr[data-cqs-design="${index}"]`, 'QR CSS')
        }))
    };
}

export function fillSlots(template, slots) {
    const fragment = document.importNode(template, true);
    for (const node of fragment.querySelectorAll('[data-cqs-slot]')) node.append(...(slots[node.dataset.cqsSlot] || []));
    return fragment;
}

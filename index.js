import { DEFAULT_THEME, CUTIE_SOURCE, validateTheme, themeVariables, characterKey, resolveIcon, resolveHandleIcon, displayLabel, MAX_THEME_BYTES, qrTarget, sameQrTarget } from './theme.js';
import { createAssetsEditor } from './assets-ui.js';
import { compileSource, fillSlots } from './source.js';
import { createSourceEditor } from './source-ui.js';
import { hostBase, muteHostCss } from './host.js';
const KEY = 'customStudio';
const LEGACY_KEY = 'cuteQrStudio';   // 이전 이름에서 쓰던 설정을 한 번 옮겨 온다
const ctx = () => SillyTavern.getContext();
const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
};
let hostStyle, root, panel, handle, content, heading, subtitle, search, status, dialog, settingsHost, themeStyle, sourceStyle;
let panelParts, panelDefaults, generationControl;
let currentKey = null, currentChat = null, currentProfile = null, currentTheme, currentSource;
let searchTerm = '', busy = false, generating = false, statusMessage = '', statusError = false;
let mounted = false, active = true;
// 확장에 함께 들어 있는 내장 테마(themes/index.json). 사용자 저장본이 같은 id면 사용자 것이 우선합니다.
let bundled = {};
// 설정창의 '지금 화면에 미리보기'. 저장하지 않은 테마를 현재 캐릭터에만 잠시 입혀 봅니다.
let preview = null;
const narrow = globalThis.matchMedia?.('(max-width: 600px)');
let safeMode = new URLSearchParams(location.search).get('cqs-safe') === '1';
function settings() {
    const all = ctx().extensionSettings;
    if (!all[KEY] && all[LEGACY_KEY]) all[KEY] = structuredClone(all[LEGACY_KEY]);
    all[KEY] ??= { schema: 1, profiles: {}, themes: {} };
    all[KEY].profiles ??= {};
    all[KEY].themes ??= {};
    return all[KEY];
}
function save() { ctx().saveSettingsDebounced(); }
const CUTIE = { ...DEFAULT_THEME, source: { ...DEFAULT_THEME.source, ...CUTIE_SOURCE } };
function themes() { return { 'modern-cutie': CUTIE, ...bundled, ...settings().themes }; }
function isBuiltIn(id) { return id === 'modern-cutie' || (Object.hasOwn(bundled, id) && !Object.hasOwn(settings().themes, id)); }
function themeOptions() {
    return Object.entries(themes()).map(([id, theme]) => [id, isBuiltIn(id) ? `${theme.name} · 내장` : theme.name]);
}
async function loadBundled() {
    const injected = globalThis.__CQS_BUNDLED_THEMES__;
    let list = Array.isArray(injected) ? injected : null;
    if (!list) {
        try {
            const base = new URL('./themes/', import.meta.url);
            const index = await (await fetch(new URL('index.json', base))).json();
            const files = Array.isArray(index?.themes) ? index.themes.filter(name => typeof name === 'string' && /^[a-z0-9-]+\.json$/.test(name)) : [];
            list = await Promise.all(files.map(async name => (await fetch(new URL(name, base))).json()));
        } catch (error) { console.warn('[Custom Studio] 내장 테마를 읽지 못했습니다.', error); list = []; }
    }
    const next = {};
    for (const raw of list) {
        try { const theme = validateTheme(raw); if (theme.id !== 'modern-cutie') next[theme.id] = theme; }
        catch (error) { console.warn('[Custom Studio] 내장 테마 형식 오류', raw?.id, error.message); }
    }
    bundled = next;
    sync();
}
function themeFor(profile) {
    try { return validateTheme(themes()[profile?.theme] || DEFAULT_THEME); }
    catch { return structuredClone(DEFAULT_THEME); }
}
function profileFor(key) {
    const stored = settings().profiles[key];
    const profile = {
        enabled: false, theme: 'modern-cutie', side: 'right', showHidden: false, open: false,
        stripPrefix: false, panelEnabled: true, chatEnabled: true, menuEnabled: true,
        applyMode: 'full', muteHostCss: false, sourceEnabled: undefined, chatStyle: stored ? 'cards' : 'native', closeAfterRun: 'mobile', ...stored,
        sets: Array.isArray(stored?.sets) ? [...new Set(stored.sets.filter(name => typeof name === 'string'))] : []
    };
    // 내장 테마는 확장과 함께 배포된 믿을 수 있는 소스라 따로 고르지 않았으면 디자인까지 켠다.
    if (typeof stored?.sourceEnabled !== 'boolean') profile.sourceEnabled = isBuiltIn(profile.theme);
    return profile;
}
function activeCharacter() {
    const context = ctx();
    return context.chatId == null || context.chatId === '' ? null : characterKey(context);
}
function qrApi() {
    const api = globalThis.quickReplyApi;
    if (!api || typeof api.listSets !== 'function' || typeof api.getSetByName !== 'function') throw new Error('Quick Replies 확장을 켠 뒤 QR 새로고침을 눌러주세요. QR 패널은 실리태번 1.11.0 이상에서 동작합니다.');
    return api;
}
function setNames() {
    const names = qrApi().listSets();
    if (!Array.isArray(names)) throw new Error('QR 세트 목록 형식이 호환되지 않습니다.');
    return [...new Set(names.map(x => typeof x === 'string' ? x : x?.name).filter(x => typeof x === 'string' && x))];
}
function button(text, fn, cls = 'cqs-button') {
    const b = el('button', cls, text); b.type = 'button';
    b.addEventListener('click', fn); return b;
}
function syncChatMode() {
    const shell = document.getElementById('sheld');
    if (!shell) return;
    const classes = document.body.classList;
    if (!classes.contains('cqs-chat')) delete shell.dataset.cqsMode;
    else shell.dataset.cqsMode = classes.contains('bubblechat') ? 'bubbles' : classes.contains('documentstyle') ? 'document' : 'flat';
}
function clearTheme() {
    document.body.classList.remove('cqs-themed', 'cqs-chat', 'cqs-menu', 'cqs-full');
    muteHostCss(false);
    syncChatMode();
    delete document.body.dataset.cqsBackground;
    delete document.body.dataset.cqsWallpaper;
    delete document.body.dataset.cqsChatStyle;
    if (themeStyle) themeStyle.textContent = '';
    if (sourceStyle) sourceStyle.textContent = '';
    currentSource = null;
}
function applyTheme(theme, profile) {
    const variables = el('div').style;
    for (const [key, value] of Object.entries(themeVariables(theme))) variables.setProperty(key, value);
    themeStyle.textContent = `body.cqs-themed { ${variables.cssText} }`;
    document.body.classList.add('cqs-themed');
    document.body.classList.toggle('cqs-chat', profile.chatEnabled);
    document.body.classList.toggle('cqs-menu', profile.menuEnabled);
    // 완전 적용: 사용자 실리 테마가 바꾼 겉모습을 실리 기본값으로 되돌린 위에 캐릭터 테마를 올린다.
    const full = profile.applyMode !== 'color' && (profile.chatEnabled || profile.menuEnabled);
    if (full && hostStyle && !hostStyle.textContent) {
        try { hostStyle.textContent = hostBase(); } catch (error) { console.warn('[Custom Studio] 완전 적용 준비 실패', error); }
    }
    document.body.classList.toggle('cqs-full', full);
    muteHostCss(full && Boolean(profile.muteHostCss));
    syncChatMode();
    document.body.dataset.cqsBackground = theme.decoration.background;
    document.body.dataset.cqsWallpaper = String(Boolean(theme.wallpaper.image));
    document.body.dataset.cqsChatStyle = profile.chatStyle === 'cards' ? 'cards' : 'native';
    if (!safeMode && profile.sourceEnabled) {
        try {
            currentSource = compileSource(theme);
            sourceStyle.textContent = [
                profile.panelEnabled ? currentSource.panelCss : '',
                profile.chatEnabled ? currentSource.chatCss : '',
                profile.menuEnabled ? currentSource.menuCss : '',
                ...(profile.panelEnabled ? currentSource.qr.map(rule => rule.css) : [])
            ].join('\n');
        } catch (error) {
            statusMessage = `소스 적용 실패. 기본 디자인으로 표시합니다. ${error.message}`;
            statusError = true;
            console.warn('[Custom Studio]', error);
        }
    }
}
function setOpen(open, persist = true) {
    open = Boolean(open && currentProfile?.enabled && currentProfile.panelEnabled);
    panel.hidden = !open;
    handle.setAttribute('aria-expanded', String(open));
    if (currentKey && persist && !(preview && preview.key === currentKey)) {
        settings().profiles[currentKey] = { ...currentProfile, open };
        currentProfile = settings().profiles[currentKey];
        save();
    }
    if (open) {
        renderQr();
        if (persist) panelParts.close.focus({ preventScroll: true });
    }
}
function renderHandle(theme) {
    const chosen = resolveHandleIcon(theme);
    const icon = iconNode(chosen, 'cqs-handle-icon');
    icon?.style.setProperty('--cqs-handle-icon-size', `${theme.handle.size}px`);
    const label = theme.handle.showLabel && theme.handle.label.trim() ? el('span', 'cqs-handle-label', theme.handle.label) : null;
    const slots = { icon: icon ? [icon] : [], label: label ? [label] : [] };
    if (currentSource?.handle) {
        handle.replaceChildren(fillSlots(currentSource.handle, slots));
        if (!handle.textContent.trim() && !handle.querySelector('.cqs-handle-icon, img')) handle.append(icon || label || 'QR');
    } else handle.replaceChildren(...slots.icon, ...slots.label);
}
function sync() {
    if (!mounted || !active) return;
    const nextKey = activeCharacter();
    const nextChat = ctx().chatId;
    if (nextKey !== currentKey || nextChat !== currentChat) {
        searchTerm = '';
        search.value = '';
        generating = generationControl?.style.display === 'flex';
        statusMessage = '';
        statusError = false;
        dialog.close();
    }
    currentKey = nextKey;
    currentChat = nextChat;
    const previewing = Boolean(preview && preview.key === nextKey);
    if (preview && !previewing) preview = null;
    currentProfile = nextKey ? (previewing ? preview.profile : profileFor(nextKey)) : null;
    clearTheme();
    root.hidden = !currentProfile?.enabled || !currentProfile.panelEnabled;
    if (!currentProfile?.enabled) { setOpen(false, false); return; }
    currentTheme = previewing ? preview.theme : themeFor(currentProfile);
    applyTheme(currentTheme, currentProfile);
    root.dataset.side = currentProfile.side === 'left' ? 'left' : 'right';
    heading.textContent = `${currentTheme.decoration.symbol} ${currentTheme.decoration.title}`;
    subtitle.textContent = currentTheme.decoration.subtitle;
    if (currentSource?.panel) {
        panel.replaceChildren(fillSlots(currentSource.panel, Object.fromEntries(Object.entries(panelParts).map(([key, node]) => [key, [node]]))));
    } else {
        const { header, top, toolbar } = panelDefaults;
        top.replaceChildren(panelParts.eyebrow, panelParts.close);
        header.replaceChildren(top, heading, subtitle);
        toolbar.replaceChildren(search, panelParts.refresh, panelParts.settings);
        panel.replaceChildren(header, toolbar, content, status);
    }
    renderHandle(currentTheme);
    setOpen(currentProfile.open, false);
}
async function runQr(setName, target, owner, chatId) {
    const isCurrent = () => active && activeCharacter() === owner && ctx().chatId === chatId;
    if (busy || generating || !isCurrent()) return;
    busy = true;
    statusMessage = '';
    renderQr();
    const mode = currentProfile?.closeAfterRun;
    if (mode === 'always' || (mode !== 'never' && narrow?.matches)) setOpen(false);
    try {
        const api = qrApi();
        const set = api.getSetByName(setName);
        const qr = set?.qrList?.find(item => sameQrTarget(target, qrTarget(setName, item)));
        if (!qr) throw new Error('QR이 삭제되거나 변경되었습니다. 새로고침해 주세요.');
        if (typeof qr.execute === 'function') await qr.execute();
        else if (typeof api.executeQuickReply === 'function') await api.executeQuickReply(setName, target.id ?? target.label);
        else throw new Error('QR 실행 API를 사용할 수 없습니다.');
        if (isCurrent()) { statusMessage = '실행 완료'; statusError = false; }
    } catch (error) {
        if (isCurrent()) {
            statusMessage = `QR 실행 실패 · ${error.message}`;
            statusError = true;
            globalThis.toastr?.error(statusMessage, '커스텀 스튜디오');
        }
    } finally {
        busy = false;
        if (active) renderQr();
    }
}
function iconNode(chosen, cls) {
    if (chosen.type === 'none') return null;
    const icon = el('span', cls);
    icon.setAttribute('aria-hidden', 'true');
    if (chosen.type === 'fa') icon.classList.add('fa-solid', ...chosen.value.split(/\s+/).filter(Boolean));
    else if (chosen.type === 'image') {
        const img = el('img', 'cqs-qr-image');
        img.src = chosen.value;
        img.alt = '';
        icon.append(img);
    } else icon.textContent = chosen.value;
    return icon;
}
function decorateQr(b, label, icon, target) {
    const index = currentTheme.qrStyles.findIndex(rule => sameQrTarget(rule, target));
    const style = currentTheme.qrStyles[index];
    if (style) {
        b.dataset.cqsDesign = String(index);
        b.dataset.cqsShape = style.shape;
        if (style.background) b.style.setProperty('--cqs-qr-bg', style.background);
        if (style.image) b.style.setProperty('--cqs-qr-image', `url("${style.image}")`);
    }
    const custom = currentSource?.qr[index]?.html;
    if (custom) b.append(fillSlots(custom, { icon: icon ? [icon] : [], label: [label] }));
    else b.append(...(icon ? [icon] : []), label);
}
function renderQr() {
    if (panel.hidden || root.hidden) return;
    content.replaceChildren();
    status.textContent = busy ? 'QR 실행 중…' : generating ? '응답 생성 중…' : statusMessage || '버튼을 누르면 연결된 QR이 실행됩니다.';
    status.dataset.error = String(!busy && !generating && statusError);
    let names;
    try { names = setNames(); } catch (error) { content.append(el('p','cqs-empty',error.message)); return; }
    const selected = Array.isArray(currentProfile.sets) ? currentProfile.sets : [];
    if (!selected.length) { content.append(el('p','cqs-empty','설정에서 이 캐릭터에 연결할 QR 세트를 선택하세요.')); return; }
    let total = 0;
    for (const name of selected) {
        const section = el('section','cqs-set');
        const title = el('h3','cqs-set-title', name); section.append(title);
        if (!names.includes(name)) { section.append(el('p','cqs-empty','세트를 찾지 못했어요. 설정에서 다시 연결해 주세요.')); content.append(section); continue; }
        let set;
        try { set = qrApi().getSetByName(name); } catch { continue; }
        const items = (Array.isArray(set?.qrList) ? set.qrList : []).filter(qr => qr && (currentProfile.showHidden || !qr.isHidden) && `${qr.label || ''} ${qr.title || ''}`.toLocaleLowerCase().includes(searchTerm));
        if (!items.length && searchTerm) continue;
        title.append(el('span','cqs-count',String(items.length)));
        const grid = el('div','cqs-grid');
        for (const qr of items) {
            const b = el('button', 'cqs-qr'); b.type = 'button';
            const target = qrTarget(name, qr);
            const icon = iconNode(resolveIcon(currentTheme, name, qr), 'cqs-qr-icon');
            const label = displayLabel(qr.label, currentProfile.stripPrefix) || qr.title || `QR ${qr.id ?? ''}`;
            decorateQr(b, el('span', 'cqs-qr-label', label), icon, target);
            b.title = qr.title || qr.label || 'QR 실행';
            b.setAttribute('aria-label', label);
            b.disabled = busy || generating;
            const owner = currentKey, chatId = currentChat;
            b.addEventListener('click', () => runQr(name, target, owner, chatId));
            grid.append(b); total++;
        }
        if (!items.length) grid.append(el('p','cqs-empty','표시할 버튼이 없습니다. 숨김 QR 설정을 확인하세요.'));
        section.append(grid); content.append(section);
    }
    if (!total && searchTerm) content.append(el('p','cqs-empty','검색 결과가 없습니다.'));
}
function field(label, input) { const wrap = el('label','cqs-field'); wrap.append(el('span','',label), input); return wrap; }
function select(options, value) {
    const input = el('select');
    for (const [val,label] of options) { const o = el('option','',label); o.value = val; input.append(o); }
    input.value = value; return input;
}
function check(text, checked) {
    const label = el('label','cqs-check'); const input = el('input'); input.type = 'checkbox'; input.checked = checked;
    label.append(input, el('span','',text)); return {label,input};
}
function download(name, data) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
    const a = el('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 3000);
}
function showSettings() {
    if (dialog.open) return;
    const owner = activeCharacter();
    dialog.replaceChildren();
    const head = el('div','cqs-dialog-head'); head.append(el('h2','','커스텀 스튜디오'),button('닫기',()=>dialog.close())); dialog.append(head);
    if (!owner) {
        dialog.append(el('p','','테마를 지정할 캐릭터의 1:1 대화방을 먼저 열어주세요. 그룹 대화에는 적용하지 않습니다.'));
        dialog.showModal(); return;
    }
    const profile = structuredClone(profileFor(owner));
    const char = ctx().characters[ctx().characterId];
    dialog.append(el('p','cqs-note',`${char.name} · 이 캐릭터의 모든 대화방에 적용`));
    const enabled = check('이 캐릭터에 테마 사용', profile.enabled);
    const usePanel = check('QR 사이드패널 표시', profile.panelEnabled);
    const useChat = check('채팅 화면 꾸미기', profile.chatEnabled);
    const useMenu = check('상단 메뉴·서랍 꾸미기', profile.menuEnabled);
    const useSource = check('이 캐릭터에서 테마의 HTML/CSS 적용', profile.sourceEnabled);
    const applyMode = select([['full', '완전 적용 (기본) · 사용자 실리 테마 위에 덮어쓰기'], ['color', '색만 바꾸기 · 사용자 테마의 배치·아이콘 유지']], profile.applyMode === 'color' ? 'color' : 'full');
    const mute = check('그래도 남는 부분이 있으면: 이 캐릭터에서 실리 사용자 CSS 잠시 끄기', Boolean(profile.muteHostCss));
    const chatStyle = select([['native', '실리태번 채팅 형식 유지'], ['cards', '카드 모양 (메시지마다 상자)']], profile.chatStyle);
    const themeSelect = select(themeOptions(), profile.theme);
    themeSelect.addEventListener('change', () => { useSource.input.checked = themeSelect.value === profile.theme ? profile.sourceEnabled : isBuiltIn(themeSelect.value); });
    const side = select([['right','오른쪽'],['left','왼쪽']],profile.side);
    const hidden = check('숨김 QR도 패널에 표시',profile.showHidden);
    const strip = check('버튼 이름 앞 이모지·기호 숨기기 (패널 표시만, 원본 QR은 그대로)',Boolean(profile.stripPrefix));
    const closeAfter = select([['mobile','좁은 화면에서만 닫기 (기본)'],['always','항상 닫기'],['never','열어 두기']], profile.closeAfterRun || 'mobile');
    dialog.append(enabled.label, field('테마', themeSelect), usePanel.label, useChat.label, useMenu.label,
        field('실리 테마 위에 적용하는 방식', applyMode), mute.label,
        field('메시지 레이아웃', chatStyle), field('패널 위치', side), field('QR을 누른 뒤 패널', closeAfter), hidden.label, strip.label, useSource.label,
        el('p', 'cqs-note', safeMode ? '소스 복구 모드가 켜져 있습니다. 페이지를 다시 열면 저장한 소스를 다시 적용할 수 있습니다.'
            : 'HTML/CSS는 신뢰하는 테마만 켜세요. Alt+Shift+Q로 이 페이지에서 소스를 잠시 끌 수 있습니다.'));
    const setTitle = el('div','cqs-row'); setTitle.append(el('h3','','연결할 QR 세트'));
    const sets = el('div','cqs-set-picker');
    let picks = [];
    function refreshPicks() {
        const previous = picks.length ? picks.filter(x=>x.input.checked).map(x=>x.name) : profile.sets;
        sets.replaceChildren(); picks = [];
        let available = [];
        try {
            available = setNames();
            for (const name of [...new Set([...previous,...available])]) {
                const item = check(name + (available.includes(name) ? '' : ' (찾을 수 없음)'), previous.includes(name));
                picks.push({...item,name}); sets.append(item.label);
            }
            if (!available.length) sets.append(el('p','cqs-note','기본 Quick Replies 설정에서 QR JSON을 가져온 후 새로고침하세요.'));
        } catch(error) {
            sets.append(el('p','cqs-note',error.message));
            for (const name of previous) {
                const item = check(name, true);
                picks.push({ ...item, name });
                sets.append(item.label);
            }
        }
    }
    setTitle.append(button('QR 새로고침', () => { refreshPicks(); assets?.refreshTargets(); })); dialog.append(setTitle,sets); refreshPicks();
    const message = el('p','cqs-note'); message.setAttribute('role','status');
    const saveProfile = button('캐릭터에 적용',()=>{
        if (activeCharacter() !== owner) { dialog.close(); return; }
        if (useSource.input.checked && !safeMode) {
            try { compileSource(themeFor({theme: themeSelect.value})); }
            catch (error) { message.textContent = error.message; return; }
        }
        settings().profiles[owner] = {
            ...profile, enabled: enabled.input.checked, theme: themeSelect.value,
            sets: picks.filter(p => p.input.checked).map(p => p.name), side: side.value,
            showHidden: hidden.input.checked, stripPrefix: strip.input.checked,
            panelEnabled: usePanel.input.checked, chatEnabled: useChat.input.checked, menuEnabled: useMenu.input.checked,
            sourceEnabled: useSource.input.checked, chatStyle: chatStyle.value, closeAfterRun: closeAfter.value,
            applyMode: applyMode.value, muteHostCss: mute.input.checked
        };
        endPreview(false);
        statusMessage = ''; statusError = false;
        save(); sync(); message.textContent = '저장했어요. 이 캐릭터의 새 대화방에도 적용됩니다.';
    },'cqs-button cqs-primary');
    const details = el('details','cqs-editor'); details.append(el('summary','','테마 만들기 · 가져오기 / 내보내기'));
    details.append(el('p','cqs-note','색상·QR 아이콘·배경 이미지를 꾸민 뒤 새 id와 이름으로 저장하세요. 이미지는 테마 JSON에 함께 담깁니다.'));
    const textarea = el('textarea','cqs-json'); textarea.rows = 12; textarea.spellcheck = false; textarea.setAttribute('aria-label','테마 JSON');
    const colorGrid = el('div','cqs-colors');
    const themeId=el('input');themeId.type='text';themeId.maxLength=64;
    const themeName=el('input');themeName.type='text';themeName.maxLength=80;
    const identity=el('div','cqs-asset-grid');identity.append(field('테마 id (수정본은 새 id)',themeId),field('테마 이름',themeName));
    for(const [key,input] of [['id',themeId],['name',themeName]])input.addEventListener('input',()=>{try{const t=JSON.parse(textarea.value);t[key]=input.value;textarea.value=JSON.stringify(t,null,2);}catch{message.textContent='JSON 오류를 먼저 수정하세요.';}});
    let assets, sourceEditor;

    function fillEditor(theme) {
        textarea.value = JSON.stringify(theme,null,2); themeId.value=theme.id;themeName.value=theme.name;colorGrid.replaceChildren();
        assets?.refresh(theme);
        sourceEditor?.refresh(theme);
        for (const [key,value] of Object.entries(theme.colors)) {
            const input = el('input'); input.type = 'color'; input.value = value; input.title = key;
            input.addEventListener('input',()=>{ try { const t=JSON.parse(textarea.value); t.colors ??= {}; t.colors[key]=input.value; textarea.value=JSON.stringify(t,null,2); } catch { message.textContent='JSON 오류를 먼저 수정하세요.'; } });
            colorGrid.append(field(key,input));
        }
    }
    fillEditor(themeFor(profile));
    assets=createAssetsEditor({
        read:()=>validateTheme(JSON.parse(textarea.value)), raw:()=>textarea.value,
        write:t=>{const valid=validateTheme(t);fillEditor(valid);},
        info:text=>{message.textContent=text;},listSets:setNames,getSet:name=>qrApi().getSetByName(name)
    });
    assets.refresh(themeFor(profile));
    sourceEditor = createSourceEditor({
        patch: (key, value) => {
            const draft = JSON.parse(textarea.value);
            draft.source ??= {};
            draft.source[key] = value;
            textarea.value = JSON.stringify(draft, null, 2);
        },
        info: text => { message.textContent = text; }
    });
    sourceEditor.refresh(themeFor(profile));
    textarea.addEventListener('change',()=>{try{const t=validateTheme(JSON.parse(textarea.value));fillEditor(t);}catch(error){message.textContent=error.message;}});

    const actions = el('div','cqs-actions');
    actions.append(button('선택 테마 불러오기',()=>fillEditor(themeFor({theme:themeSelect.value}))));
    const file = el('input'); file.type='file'; file.accept='.json,application/json'; file.hidden=true;
    file.addEventListener('change',async()=>{
        try {
            if (!file.files?.[0]) return;
            if (file.files[0].size > MAX_THEME_BYTES) throw new Error('테마 파일은 6 MB 이하로 만들어 주세요.');
            fillEditor(validateTheme(JSON.parse(await file.files[0].text())));
            message.textContent='파일을 읽었어요. 테마 저장 후 캐릭터에 적용하세요.';
        } catch(error) { message.textContent=error.message; }
        finally { file.value=''; }
    });
    actions.append(button('JSON 가져오기',()=>file.click()),file);
    actions.append(button('JSON 내보내기',()=>{
        try { const t=validateTheme(JSON.parse(textarea.value)); compileSource(t); download(`${t.id}.json`,t); message.textContent='테마 파일을 내보냈어요.'; }
        catch(error) { message.textContent=error.message; }
    }));
    const saveTheme = button('테마 저장',()=>{
        try {
            const t = validateTheme(JSON.parse(textarea.value));
            compileSource(t);
            if (isBuiltIn(t.id)) throw new Error(`내장 테마는 그대로 두고 복사해서 고쳐 주세요. id를 my-${t.id}처럼 바꾸면 새 테마로 저장됩니다.`);
            if (Object.hasOwn(settings().themes,t.id) && !confirm('같은 id의 테마를 덮어쓸까요? 사용 중인 모든 캐릭터에 반영됩니다.')) return;
            settings().themes[t.id]=t; save();
            themeSelect.replaceChildren(...themeOptions().map(([id,name])=>{const o=el('option','',name);o.value=id;return o;}));
            themeSelect.value=t.id; themeSelect.dispatchEvent(new Event('change')); fillEditor(t); sync(); message.textContent='테마를 저장했어요. 위의 캐릭터에 적용 버튼을 눌러주세요.';
        } catch(error) { message.textContent=error.message; }
    },'cqs-button');
    saveTheme.hidden = true;
    // 저장 전에 지금 화면에 입혀 보기. 설정창은 아래쪽 막대로 접히고, 닫으면 원래 테마로 돌아갑니다.
    const previewBtn = button('지금 화면에 미리보기', () => {
        if (activeCharacter() !== owner) { dialog.close(); return; }
        try {
            const t = validateTheme(JSON.parse(textarea.value));
            if (useSource.input.checked && !safeMode) compileSource(t);
            preview = { key: owner, theme: t, profile: {
                ...profile, enabled: true, theme: t.id, open: usePanel.input.checked,
                sets: picks.filter(p => p.input.checked).map(p => p.name), side: side.value,
                showHidden: hidden.input.checked, stripPrefix: strip.input.checked,
                panelEnabled: usePanel.input.checked, chatEnabled: useChat.input.checked, menuEnabled: useMenu.input.checked,
                sourceEnabled: useSource.input.checked, chatStyle: chatStyle.value, closeAfterRun: 'never',
                applyMode: applyMode.value, muteHostCss: mute.input.checked
            } };
            statusMessage = ''; statusError = false;
            sync();
            peek(true);
            message.textContent = '미리보기 중 · 저장 전입니다. 패널 버튼도 눌러 볼 수 있어요.';
        } catch (error) { message.textContent = error.message; }
    });
    const backBtn = button('편집으로 돌아가기', () => peek(false));
    const endBtn = button('미리보기 끝', () => { endPreview(); peek(false); message.textContent = '미리보기를 끝내고 원래 테마로 돌아왔어요.'; });
    previewBtn.hidden = true; backBtn.classList.add('cqs-peek-only'); endBtn.classList.add('cqs-peek-only');
    details.addEventListener('toggle', () => { saveTheme.hidden = !details.open; previewBtn.hidden = !details.open; });
    details.append(identity, sourceEditor.node, colorGrid, assets.node, el('h3','','테마 JSON (고급 편집)'), textarea, actions);
    const footer = el('footer', 'cqs-dialog-footer');
    const footerActions = el('div', 'cqs-actions');
    footerActions.append(backBtn, endBtn, previewBtn, saveTheme, saveProfile);
    footer.append(message, footerActions);
    dialog.append(details, footer);
    dialog.showModal();
}
// dialog.close()의 close 이벤트는 나중에 따로 도착하므로, 모드 전환으로 닫은 횟수만큼 건너뛴다.
let skipClose = 0;
function peek(on) {
    if (dialog.open) { skipClose++; dialog.close(); }
    dialog.classList.toggle('cqs-peek', on);
    if (on) dialog.show(); else dialog.showModal();
}
function endPreview(resync = true) {
    if (!preview) return;
    preview = null;
    if (resync) sync();
}
function onOutside(event) {
    if (!active) return;
    if (!panel?.hidden && !root.contains(event.target) && !dialog.open) setOpen(false);
}
function onKey(event) {
    if (!active) return;
    if (event.altKey && event.shiftKey && event.code === 'KeyQ') {
        event.preventDefault();
        safeMode = true;
        dialog.close();
        sync();
        showSettings();
    } else if (event.key === 'Escape' && !dialog.open && !panel.hidden && !document.querySelector('dialog[open]:not(.cqs-dialog)')) { setOpen(false); handle.focus(); }
}
function mount() {
    if (mounted) return;
    mounted = true;
    root = el('div'); root.id='cqs-root'; root.hidden=true;
    handle=button('✦ QR',()=>setOpen(panel.hidden),'cqs-handle'); handle.setAttribute('aria-controls','cqs-panel'); handle.setAttribute('aria-label','QR 패널 열기 또는 닫기');
    panel=el('aside'); panel.id='cqs-panel'; panel.hidden=true; panel.setAttribute('aria-label','QR 사이드패널');
    const header=el('header','cqs-header'); const top=el('div','cqs-row');
    top.append(el('span','cqs-eyebrow','CUSTOM STUDIO'),button('×',()=>{setOpen(false);handle.focus();},'cqs-close'));
    top.lastChild.setAttribute('aria-label','QR 패널 닫기');
    heading=el('h2'); subtitle=el('p'); header.append(top,heading,subtitle);
    const toolbar=el('div','cqs-toolbar');
    search=el('input'); search.type='search'; search.placeholder='버튼 찾기…'; search.setAttribute('aria-label','QR 버튼 검색');
    search.addEventListener('input',()=>{searchTerm=search.value.toLocaleLowerCase();renderQr();});
    const refresh = button('↻', () => { statusMessage = ''; statusError = false; renderQr(); });
    refresh.setAttribute('aria-label', 'QR 패널 새로고침');
    const openSettings = button('설정', showSettings);
    content=el('div','cqs-content'); status=el('p','cqs-status'); status.setAttribute('aria-live','polite');
    panelParts = { eyebrow: top.firstChild, close: top.lastChild, heading, subtitle, search, refresh, settings: openSettings, qr: content, status };
    panelDefaults = { header, top, toolbar };
    root.append(handle, panel); document.body.append(root);
    // 테마 레이어를 문서 맨 앞에서 선언해 두면, 이 레이어의 !important 규칙이 실리태번 사용자 CSS·다른 확장의 !important보다 앞선다.
    const layerOrder = el('style'); layerOrder.id = 'cqs-layer-order'; layerOrder.textContent = '@layer cqs-force;';
    document.head.prepend(layerOrder);
    hostStyle = el('style'); hostStyle.id = 'cqs-host-base';
    layerOrder.after(hostStyle);
    themeStyle = el('style'); themeStyle.id = 'cqs-theme-vars';
    sourceStyle = el('style'); sourceStyle.id = 'cqs-source';
    document.head.append(themeStyle, sourceStyle);
    dialog=el('dialog','cqs-dialog'); dialog.id='cqs-settings'; dialog.setAttribute('aria-label','커스텀 스튜디오 설정'); document.body.append(dialog);
    dialog.addEventListener('close', () => { if (skipClose) { skipClose--; return; } dialog.classList.remove('cqs-peek'); endPreview(); });
    settingsHost=el('div','cqs-settings-entry'); settingsHost.append(button('✦ 커스텀 스튜디오 · 캐릭터 테마 설정',showSettings,'menu_button'));
    (document.querySelector('#extensions_settings2') || document.querySelector('#extensions_settings') || document.body).append(settingsHost);
    new MutationObserver(syncChatMode).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('pointerdown',onOutside); document.addEventListener('keydown',onKey, true);
    const {eventSource,eventTypes: event_types = ctx().event_types}=ctx();
    function listen(type,handler) { if(type) eventSource.on(type,handler); }
    listen(event_types.CHAT_CHANGED,sync); listen(event_types.CHARACTER_EDITED,sync);
    function setGenerating(next) {
        if (generating === next) return;
        generating = next;
        if (active) renderQr();
    }
    generationControl = document.querySelector('#mes_stop');
    if (generationControl) {
        // ST changes the inline display only when generation has actually taken over the composer.
        // GENERATION_STARTED can also fire for commands and requests that exit before generation.
        const updateGeneration = () => setGenerating(generationControl.style.display === 'flex');
        new MutationObserver(updateGeneration).observe(generationControl, { attributes: true, attributeFilter: ['style'] });
        updateGeneration();
    } else {
        listen(event_types.GENERATION_STARTED, (_type, _options, dryRun) => { if (!dryRun) setGenerating(true); });
        listen(event_types.GENERATION_ENDED, () => setGenerating(false));
        listen(event_types.GENERATION_STOPPED, () => setGenerating(false));
    }
    settingsHost.hidden = !active;
    sync();
    loadBundled();
}
export function onDisable() {
    active=false;clearTheme();
    if (mounted) setOpen(false, false);
    if(root)root.hidden=true;
    dialog?.close(); if(settingsHost)settingsHost.hidden=true;
}
export function onEnable() { active=true; if(settingsHost)settingsHost.hidden=false;sync(); }
const context = ctx();
const ready = (context.eventTypes || context.event_types)?.APP_READY;
if (ready) context.eventSource.on(ready, mount);
else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
else mount();

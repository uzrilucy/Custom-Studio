export const DEFAULT_THEME = {
    format: 'custom-studio-theme', version: 1, id: 'modern-cutie', name: '모던 큐티',
    author: 'Custom Studio',
    colors: {
        canvas: '#fff5f9', surface: '#ffffff', user: '#f5edff', text: '#51394f',
        muted: '#80677d', accent: '#aa467b', accentSoft: '#f9e1ed',
        border: '#ebd3e2', quote: '#906594', code: '#f1e9f4',
        headerA: '#fbe1ed', headerB: '#ebe4ff', button: '#fffafd', buttonHover: '#f5e5fa'
    },
    layout: { panelWidth: 326, radius: 22, buttonRadius: 15, gap: 10, columns: 2, fontSize: 16, lineHeight: 1.8 },
    decoration: { symbol: '✦', title: 'Little shortcuts', subtitle: '작은 버튼, 나만의 이야기', background: 'dots' },
    icons: { default: { type: 'text', value: '♡' }, rules: [] },
    handle: { icon: { type: 'native' }, label: 'QR', showLabel: true, size: 24 },
    source: { panelHtml: '', handleHtml: '', panelCss: '', chatCss: '', menuCss: '' },
    qrStyles: [],
    wallpaper: { image: '', size: 'cover', position: 'center', repeat: 'no-repeat', overlay: 0.2, messageOpacity: 0.94 }
};
const plain = value => value && typeof value === 'object' && !Array.isArray(value);
const keys = (obj, allowed, where) => {
    if (!plain(obj)) throw new Error(`${where}: 객체 형식이어야 합니다.`);
    for (const key of Object.keys(obj)) if (!allowed.includes(key)) throw new Error(`${where}: 알 수 없는 항목 ${key}`);
};
export function validateTheme(input) {
    keys(input, ['format','version','id','name','author','colors','layout','decoration','icons','wallpaper','handle','source','qrStyles'], '테마');
    // 이전 형식 이름으로 만든 파일도 그대로 읽는다.
    if (!['custom-studio-theme', 'cute-qr-theme'].includes(input.format) || input.version !== 1) throw new Error('custom-studio-theme 버전 1 테마 파일이 필요합니다.');
    if (typeof input.id !== 'string' || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(input.id)) throw new Error('id는 영문 소문자·숫자·하이픈으로 1~64자입니다.');
    const theme = structuredClone(DEFAULT_THEME);
    theme.id = input.id;
    for (const key of ['name','author']) {
        if (input[key] !== undefined) {
            if (typeof input[key] !== 'string' || !input[key].trim() || input[key].length > 80) throw new Error(`${key}: 1~80자로 입력하세요.`);
            theme[key] = input[key];
        }
    }
    if (!input.name) throw new Error('name을 입력하세요.');
    if (input.colors !== undefined) {
        keys(input.colors, Object.keys(theme.colors), 'colors');
        for (const [key,value] of Object.entries(input.colors)) {
            if (typeof value !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(value)) throw new Error(`${key}: #RRGGBB 색상을 사용하세요.`);
            theme.colors[key] = value;
        }
    }
    const ranges = {panelWidth:[260,460],radius:[0,36],buttonRadius:[0,30],gap:[4,24],columns:[1,3],fontSize:[12,24],lineHeight:[1.2,2.4]};
    if (input.layout !== undefined) {
        keys(input.layout, Object.keys(ranges), 'layout');
        for (const [key,value] of Object.entries(input.layout)) {
            const [min,max] = ranges[key];
            if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (key !== 'lineHeight' && !Number.isInteger(value))) throw new Error(`${key}: ${min}~${max} 범위${key === 'lineHeight' ? '' : '의 정수'}를 입력하세요.`);
            theme.layout[key] = value;
        }
    }
    if (input.decoration !== undefined) {
        keys(input.decoration, ['symbol','title','subtitle','background'], 'decoration');
        for (const [key,value] of Object.entries(input.decoration)) {
            if (typeof value !== 'string' || value.length > (key === 'symbol' ? 8 : 100)) throw new Error(`${key}: 텍스트가 너무 깁니다.`);
            theme.decoration[key] = value;
        }
        if (!['dots','plain','gradient'].includes(theme.decoration.background)) throw new Error('background는 dots, plain, gradient 중 하나입니다.');
    }
    theme.icons = validateIcons(input.icons ?? {default:{type:'native'},rules:[]});
    theme.wallpaper = validateWallpaper(input.wallpaper);
    theme.handle = validateHandle(input.handle);
    theme.source = validateSource(input.source);
    theme.qrStyles = validateQrStyles(input.qrStyles);
    if (new TextEncoder().encode(JSON.stringify(theme)).length > MAX_THEME_BYTES) throw new Error('테마 전체 크기는 6 MB 이하로 만들어 주세요.');
    return theme;
}
export function themeVariables(theme) {
    const result = {};
    for (const [key,value] of Object.entries(theme.colors)) result[`--cqs-${key}`] = value;
    for (const [key,value] of Object.entries(theme.layout)) result[`--cqs-${key}`] = String(value) + (['columns','lineHeight'].includes(key) ? '' : 'px');
    const wp = theme.wallpaper;
    result['--cqs-wallpaper'] = wp.image ? `url("${wp.image}")` : 'none';
    result['--cqs-wallpaper-size'] = wp.size;
    result['--cqs-wallpaper-position'] = wp.position;
    result['--cqs-wallpaper-repeat'] = wp.repeat;
    result['--cqs-wallpaper-overlay'] = rgba(theme.colors.canvas, wp.overlay);
    result['--cqs-message-surface'] = rgba(theme.colors.surface, wp.image ? wp.messageOpacity : 1);
    result['--cqs-message-user'] = rgba(theme.colors.user, wp.image ? wp.messageOpacity : 1);
    // v0.2.2: derived tokens so dark themes stay readable without new theme keys.
    const dark = isDarkColor(theme.colors.canvas);
    result['--cqs-scheme'] = dark ? 'dark' : 'light';
    result['--cqs-onAccent'] = readableOn(theme.colors.accent);
    result['--cqs-shadow'] = dark ? 'rgba(0,0,0,0.45)' : rgba(theme.colors.text, 0.14);
    result['--cqs-danger'] = dark ? '#ff8fa3' : '#a1265a';
    return result;
}
function luminance(hex) {
    const [r,g,b] = [1,3,5].map(i => {
        const c = parseInt(hex.slice(i,i+2),16)/255;
        return c <= 0.03928 ? c/12.92 : ((c+0.055)/1.055) ** 2.4;
    });
    return 0.2126*r + 0.7152*g + 0.0722*b;
}
const contrast = (a,b) => (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
export function isDarkColor(hex) { return luminance(hex) < 0.18; }
/** Text colour for a filled accent button: whichever of white / deep ink reads better. */
export function readableOn(hex) {
    const l = luminance(hex);
    return contrast(l, 1) >= contrast(l, luminance('#141021')) ? '#ffffff' : '#141021';
}
/** Panel display only: drop leading emoji/symbols ("⚔ 오늘의 퀘스트" -> "오늘의 퀘스트"). The QR itself is untouched. */
export function displayLabel(label, strip) {
    if (!strip || typeof label !== 'string') return label;
    const cleaned = label.replace(/^[\p{Extended_Pictographic}\p{So}\u{FE0F}\u{200D}\u{20E3}\s]+/u, '');
    return cleaned || label;
}
export function characterKey(context) {
    if (context.groupId != null && context.groupId !== '') return null;
    if (context.characterId == null) return null;
    const avatar = context.characters?.[context.characterId]?.avatar;
    return typeof avatar === 'string' && avatar ? `character:${avatar}` : null;
}

export const MAX_THEME_BYTES = 6 * 1024 * 1024;
export const MAX_WALLPAPER_BYTES = 2 * 1024 * 1024;
export const MAX_ICON_BYTES = 256 * 1024;
function rgba(hex, alpha) {
    return `rgba(${[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(',')},${alpha})`;
}
export function validateImage(value, maxBytes) {
    if (typeof value !== 'string' || value.length > Math.ceil(maxBytes/3)*4 + 64) throw new Error('이미지 용량 제한을 초과했습니다.');
    const match = /^data:image\/(png|jpeg|gif|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
    if (!match || match[2].length % 4 !== 0) throw new Error('PNG, JPG, GIF, WebP 이미지 파일을 사용하세요.');
    const bytes = match[2].length*3/4 - (match[2].endsWith('==')?2:match[2].endsWith('=')?1:0);
    if(bytes>maxBytes) throw new Error('이미지 용량 제한을 초과했습니다.');
    const head = atob(match[2].slice(0,Math.min(32,match[2].length)));
    const valid = {
        png: head.startsWith('\x89PNG\r\n\x1a\n'),
        jpeg: head.startsWith('\xff\xd8\xff'),
        gif: head.startsWith('GIF87a') || head.startsWith('GIF89a'),
        webp: head.startsWith('RIFF') && head.slice(8,12)==='WEBP'
    };
    if (!valid[match[1]]) throw new Error('이미지 확장자와 실제 형식이 일치하지 않습니다.');
    return value;
}
export function validateIcon(icon) {
    keys(icon,['type','value'],'아이콘');
    if (!['native','none','text','fa','image'].includes(icon.type)) throw new Error('아이콘 type은 native, none, text, fa, image 중 하나입니다.');
    if (['native','none'].includes(icon.type)) return {type:icon.type};
    if (typeof icon.value !== 'string' || !icon.value.trim()) throw new Error('아이콘 값을 입력하세요.');
    if(icon.type==='text' && icon.value.length>24) throw new Error('아이콘 문자는 24자 이하입니다.');
    if(icon.type==='fa' && (!/^(?:fa-[a-z0-9-]+)(?: fa-[a-z0-9-]+)*$/.test(icon.value) || icon.value.length>120)) throw new Error('Font Awesome 클래스 예: fa-solid fa-heart');
    if(icon.type==='image') validateImage(icon.value,MAX_ICON_BYTES);
    return {type:icon.type,value:icon.value};
}
function validateIcons(icons) {
    keys(icons,['default','rules'],'icons');
    const result={default:validateIcon(icons.default ?? {type:'native'}),rules:[]};
    if (icons.rules!==undefined && (!Array.isArray(icons.rules) || icons.rules.length>200)) throw new Error('아이콘 규칙은 최대 200개입니다.');
    const seen = new Set();
    for (const rule of icons.rules || []) {
        keys(rule,['set','id','label','icon'],'아이콘 규칙');
        const set=rule.set ?? null;
        if (set!==null && (typeof set!=='string' || !set || set.length>300)) throw new Error('set은 세트 이름 또는 null입니다.');
        if (rule.id!==undefined && (set===null || !Number.isInteger(rule.id) || rule.id<0)) throw new Error('id 규칙에는 정확한 세트 이름과 0 이상의 정수가 필요합니다.');
        if (rule.label!==undefined && (typeof rule.label!=='string' || rule.label.length>300)) throw new Error('label은 버튼 이름입니다.');
        if (rule.id!==undefined && rule.label!==undefined) throw new Error('id와 label은 한 규칙에 동시에 넣지 마세요.');
        if(set===null && rule.label===undefined) throw new Error('공통 아이콘은 icons.default에 지정하세요.');
        const clean={set,icon:validateIcon(rule.icon)};
        if(rule.id!==undefined) clean.id=rule.id;
        if(rule.label!==undefined) clean.label=rule.label;
        const key=JSON.stringify([set,rule.id??null,rule.label??null]);
        if(seen.has(key)) throw new Error('같은 대상을 지정한 아이콘 규칙이 중복되었습니다.');
        seen.add(key);result.rules.push(clean);
    }
    return result;
}
function validateWallpaper(input) {
    const result=structuredClone(DEFAULT_THEME.wallpaper);
    if (input===undefined) return result;
    keys(input,['image','size','position','repeat','overlay','messageOpacity'],'wallpaper');
    if(input.image!==undefined) result.image=input.image===''?'':validateImage(input.image,MAX_WALLPAPER_BYTES);
    for (const [key,allowed] of Object.entries({size:['cover','contain','auto'],position:['center','top','bottom','left','right'],repeat:['no-repeat','repeat']})) {
        if(input[key]!==undefined) {
            if(!allowed.includes(input[key])) throw new Error(`${key}: ${allowed.join(', ')} 중 선택하세요.`);
            result[key]=input[key];
        }
    }
    for(const key of ['overlay','messageOpacity']) if(input[key]!==undefined) {
        if(typeof input[key]!=='number' || !Number.isFinite(input[key]) || input[key]<0 || input[key]>1) throw new Error(`${key}: 0~1 사이 숫자입니다.`);
        result[key]=input[key];
    }
    return result;
}
export function resolveIcon(theme,setName,qr) {
    let selected=theme.icons.default, score=-1;
    for(const rule of theme.icons.rules) {
        if(rule.set!==null && rule.set!==setName) continue;
        if(rule.id!==undefined && rule.id!==qr.id) continue;
        if(rule.label!==undefined && rule.label!==qr.label) continue;
        const priority=rule.id!==undefined?50:rule.label!==undefined?(rule.set!==null?40:30):(rule.set!==null?20:10);
        if(priority>score) {score=priority;selected=rule.icon;}
    }
    if(selected.type!=='native') return selected;
    if(typeof qr.icon==='string' && /^(?:fa-[a-z0-9-]+)(?: fa-[a-z0-9-]+)*$/.test(qr.icon)) return {type:'fa',value:qr.icon};
    return {type:'text',value:theme.decoration.symbol};
}

function validateHandle(input) {
    const result=structuredClone(DEFAULT_THEME.handle);
    if(input===undefined)return result;
    keys(input,['icon','label','showLabel','size'],'handle');
    if(input.icon!==undefined)result.icon=validateIcon(input.icon);
    if(input.label!==undefined){
        if(typeof input.label!=='string' || input.label.length>16)throw new Error('손잡이 문구는 16자 이하입니다.');
        result.label=input.label;
    }
    if(input.showLabel!==undefined){
        if(typeof input.showLabel!=='boolean')throw new Error('손잡이 showLabel은 true/false입니다.');
        result.showLabel=input.showLabel;
    }
    if(input.size!==undefined){
        if(!Number.isInteger(input.size)||input.size<16||input.size>48)throw new Error('손잡이 아이콘 크기는 16~48px 정수입니다.');
        result.size=input.size;
    }
    if(result.icon.type==='none' && (!result.showLabel || !result.label.trim()))throw new Error('손잡이에 아이콘 또는 문구 하나는 표시해 주세요.');
    return result;
}
export function resolveHandleIcon(theme) {
    return theme.handle.icon.type==='native'?{type:'text',value:theme.decoration.symbol.trim()||'✦'}:theme.handle.icon;
}

function sourceText(value, label, max = 48000) {
    if (typeof value !== 'string' || value.length > max) throw new Error(`${label}: 최대 ${max}자까지 입력할 수 있습니다.`);
    return value;
}

function validateSource(input = {}) {
    const result = { ...DEFAULT_THEME.source };
    keys(input, Object.keys(result), '소스 편집');
    for (const [key, value] of Object.entries(input)) result[key] = sourceText(value, key);
    return result;
}

export function qrTarget(set, qr) {
    return Number.isInteger(qr.id) && qr.id >= 0 ? { set, id: qr.id } : { set, label: qr.label || '' };
}

export function sameQrTarget(a, b) {
    return a.set === b.set && a.id === b.id && a.label === b.label;
}

export const QR_SHAPES = ['default', 'square', 'round', 'pill', 'circle'];

function validateQrStyles(input = []) {
    if (!Array.isArray(input) || input.length > 200) throw new Error('개별 QR 디자인은 최대 200개입니다.');
    const seen = new Set();
    return input.map(rule => {
        keys(rule, ['set', 'id', 'label', 'background', 'image', 'shape', 'html', 'css'], '개별 QR 디자인');
        if (typeof rule.set !== 'string' || !rule.set || rule.set.length > 300) throw new Error('QR 세트 이름을 입력하세요.');
        const hasId = rule.id !== undefined;
        if (hasId ? !Number.isInteger(rule.id) || rule.id < 0 || rule.label !== undefined
            : typeof rule.label !== 'string' || rule.label.length > 300) throw new Error('개별 QR에는 ID 또는 원본 이름 하나가 필요합니다.');
        const target = hasId ? { set: rule.set, id: rule.id } : { set: rule.set, label: rule.label };
        const key = JSON.stringify([rule.set, rule.id ?? null, rule.label ?? null]);
        if (seen.has(key)) throw new Error('같은 QR의 디자인이 중복되었습니다.');
        seen.add(key);
        const background = rule.background ?? '';
        if (typeof background !== 'string' || (background !== '' && !/^#[0-9a-f]{6}$/i.test(background))) throw new Error('QR 배경색은 #RRGGBB로 입력하세요.');
        const image = rule.image ?? '';
        if (image !== '') validateImage(image, MAX_ICON_BYTES);
        const shape = rule.shape ?? 'default';
        if (!QR_SHAPES.includes(shape)) throw new Error('지원하지 않는 QR 모양입니다.');
        return {
            ...target, background: background || '', image, shape,
            html: sourceText(rule.html ?? '', 'QR HTML', 12000),
            css: sourceText(rule.css ?? '', 'QR CSS', 12000)
        };
    });
}

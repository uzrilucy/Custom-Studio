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
// 내장 「모던 큐티」에만 붙는 채팅·상단 메뉴 디자인. DEFAULT_THEME 자체는 가져온 테마의 기본값이라 비워 둔다.
export const CUTIE_SOURCE = Object.freeze({ chatCss: ":scope#bg1, :scope#bg_custom {\nbackground-color: var(--cqs-canvas);\nbackground-image:\nradial-gradient(55% 42% at 10% 6%, color-mix(in srgb, var(--cqs-headerA) 95%, transparent), transparent 70%),\nradial-gradient(50% 46% at 94% 96%, color-mix(in srgb, var(--cqs-headerB) 95%, transparent), transparent 72%),\nradial-gradient(color-mix(in srgb, var(--cqs-border) 85%, transparent) 1px, transparent 1.3px);\nbackground-size: auto, auto, 22px 22px;\n}\n:scope #chat {\nbackground: color-mix(in srgb, var(--cqs-canvas) 72%, transparent);\nborder-inline: 1px solid color-mix(in srgb, var(--cqs-border) 80%, transparent);\n}\n:scope[data-cqs-mode=\"flat\"] #chat .mes {\nbackground: var(--cqs-surface);\nborder: 1px solid var(--cqs-border);\nborder-radius: 22px;\nmargin: 10px 12px;\nbox-shadow: 0 12px 26px -22px var(--cqs-accent);\n}\n:scope[data-cqs-mode=\"flat\"] #chat .mes[is_user=\"true\"] {\nbackground: linear-gradient(135deg, color-mix(in srgb, var(--cqs-user) 55%, var(--cqs-surface)), var(--cqs-user));\n}\n:scope #chat .mes .ch_name .name_text { font-weight: 800; letter-spacing: .02em; }\n:scope #chat .mes:not([is_user=\"true\"]) .ch_name .name_text::after { content: \" \\2661\"; color: color-mix(in srgb, var(--cqs-accent) 55%, var(--cqs-surface)); font-size: .82em; }\n:scope #chat .mes .avatar img { border: 2px solid var(--cqs-surface); box-shadow: 0 0 0 2px var(--cqs-border); }\n:scope #chat .mes_text q { background: linear-gradient(transparent 60%, var(--cqs-accentSoft) 60%); border-radius: 2px; }\n:scope #chat .mes_text blockquote { border-left: 3px solid var(--cqs-accent); border-radius: 0 14px 14px 0; }\n:scope #send_form {\nborder: 1.5px solid var(--cqs-border);\nborder-radius: 24px;\nbackground: color-mix(in srgb, var(--cqs-surface) 96%, transparent);\nbox-shadow: 0 12px 28px -20px var(--cqs-accent);\n}\n:scope #send_form:focus-within { border-color: color-mix(in srgb, var(--cqs-accent) 50%, var(--cqs-border)); box-shadow: 0 0 0 4px var(--cqs-accentSoft), 0 12px 28px -20px var(--cqs-accent); }\n:scope #send_form #send_but:hover { transform: scale(1.12); }\n:scope#options .options-content { border-radius: 18px; box-shadow: 0 18px 40px -26px var(--cqs-accent); }\n:scope #chat .mes { --avatar-base-width: 46px; --avatar-base-height: 46px; --avatar-base-border-radius: 50%; --avatar-base-border-radius-round: 50%; padding: 14px 16px 12px; width: auto; box-sizing: border-box; }\n:scope #chat .mes[is_user=\"true\"] { flex-direction: row-reverse; }\n:scope[data-cqs-mode=\"flat\"] #chat .mes:not([is_user=\"true\"]) { margin-right: 4%; border-top-left-radius: 8px; }\n:scope[data-cqs-mode=\"flat\"] #chat .mes[is_user=\"true\"] { margin-left: 14%; border-top-right-radius: 8px; }\n:scope #chat .mes[is_user=\"true\"] .ch_name { flex-direction: row-reverse; }\n:scope #chat .mes .avatar img { border: 3px solid var(--cqs-surface); box-shadow: 0 0 0 2px var(--cqs-border), 0 8px 16px -10px var(--cqs-accent); }\n:scope #chat .mes .ch_name { gap: 8px; align-items: center; }\n:scope #chat .mes .timestamp { font-size: .78em; padding: 1px 8px; border-radius: 999px; background: var(--cqs-accentSoft); color: var(--cqs-accent); }\n:scope #chat .swipe_left, :scope #chat .swipe_right { color: var(--cqs-accent); background: radial-gradient(circle, var(--cqs-accentSoft) 0 55%, transparent 57%); border-radius: 50%; }\n:scope #chat .swipes-counter { color: var(--cqs-muted); font-weight: 700; }\n:scope #send_form #send_but { color: var(--cqs-onAccent); background: radial-gradient(circle, var(--cqs-accent) 0 58%, transparent 60%); }\n:scope #send_form #send_but:hover { filter: brightness(1.08); }\n:scope #send_form :is(#options_button, #extensionsMenuButton, #mes_continue, #mes_impersonate) { color: color-mix(in srgb, var(--cqs-accent) 60%, var(--cqs-muted)); }\n:scope #send_form #send_textarea { padding-inline: 6px; }\n:scope#options .options-content { padding: 8px; }\n:scope#options .options-content a { border-radius: 12px; padding: 6px 10px; }\n:scope #options_button { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Cpath d='M4 7h16M4 12h16M4 17h16'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #extensionsMenuButton { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Cpath d='M5 19 15 9M13.5 7.5l3 3'/%3E%3Cpath d='M18.5 2.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z'/%3E%3Cpath d='M9 3.5v2M8 4.5h2M20.5 11v2M19.5 12h2'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #send_but { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Cpath d='M21 3 3.5 10l7 3.5 3.5 7z'/%3E%3Cpath d='M21 3 10.5 13.5'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #mes_stop .fa-circle-stop { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Crect x='9' y='9' width='6' height='6' rx='1'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #mes_continue { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Cpath d='M4 12h15M13 6l6 6-6 6'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #mes_impersonate { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Cpath d='M4 10c0-3 3.6-4.5 8-4.5s8 1.5 8 4.5c0 3-1.5 5-4 5-1.6 0-2.5-1.5-4-1.5S9.6 15 8 15c-2.5 0-4-2-4-5z'/%3E%3Cpath d='M7.5 10h2.5M14 10h2.5'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #chat .swipe_left { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Cpath d='M15 5l-7 7 7 7'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #chat .swipe_right { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Cpath d='M9 5l7 7-7 7'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #chat .mes .extraMesButtonsHint { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Ccircle fill='%23000' stroke='none' cx='6' cy='12' r='1.6'/%3E%3Ccircle fill='%23000' stroke='none' cx='12' cy='12' r='1.6'/%3E%3Ccircle fill='%23000' stroke='none' cx='18' cy='12' r='1.6'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #chat .mes .mes_edit { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Cpath d='M4 20l1-4.5L16 4.5a2.1 2.1 0 0 1 3 3L8 18.5z'/%3E%3Cpath d='M14 6.5l3 3'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #options_button::before, :scope #extensionsMenuButton::before, :scope #send_but::before, :scope #mes_stop .fa-circle-stop::before, :scope #mes_continue::before, :scope #mes_impersonate::before, :scope #chat .swipe_left::before, :scope #chat .swipe_right::before, :scope #chat .mes .extraMesButtonsHint::before, :scope #chat .mes .mes_edit::before { content: \"\"; display: inline-block; width: 1em; height: 1em; vertical-align: -.14em; background: currentColor; -webkit-mask: var(--ico) center / contain no-repeat; mask: var(--ico) center / contain no-repeat; }",
    menuCss: ":scope#top-bar {\nbackground: linear-gradient(180deg, var(--cqs-surface), color-mix(in srgb, var(--cqs-headerA) 55%, var(--cqs-surface)));\nborder-bottom: 1px solid var(--cqs-border);\nbox-shadow: 0 8px 20px -16px var(--cqs-accent);\n}\n:scope .drawer-icon { color: color-mix(in srgb, var(--cqs-accent) 45%, var(--cqs-muted)); }\n:scope .drawer-icon:hover { color: var(--cqs-accent); }\n:scope .drawer-icon.openIcon { color: var(--cqs-accent); text-shadow: 0 0 12px color-mix(in srgb, var(--cqs-accent) 35%, transparent); }\n:scope .drawer-content { border: 1px solid var(--cqs-border); border-radius: 20px; box-shadow: 0 22px 44px -30px var(--cqs-accent); }\n:scope#top-bar { background: transparent; border-bottom: 0; box-shadow: none; }\n:scope#top-bar::before { content: \"\"; position: absolute; inset: 5px 8px 4px; border-radius: 999px; pointer-events: none;\nbackground: linear-gradient(180deg, var(--cqs-surface), color-mix(in srgb, var(--cqs-headerA) 55%, var(--cqs-surface)));\nborder: 1.5px solid var(--cqs-border); box-shadow: 0 10px 24px -16px var(--cqs-accent); }\n:scope#top-settings-holder { padding-inline: 18px; }\n:scope .drawer-icon { border-radius: 50%; }\n:scope .drawer-icon.openIcon { background: radial-gradient(circle, var(--cqs-accentSoft) 0 64%, transparent 66%); }\n:scope #ai-config-button .drawer-icon { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Cpath d='M4 6h8M16 6h4M4 12h2M10 12h10M4 18h10M18 18h2'/%3E%3Ccircle cx='14' cy='6' r='2'/%3E%3Ccircle cx='8' cy='12' r='2'/%3E%3Ccircle cx='16' cy='18' r='2'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #sys-settings-button .drawer-icon { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Cpath d='M9 3v5M15 3v5M12 17v4'/%3E%3Cpath d='M6 8h12v3a6 6 0 0 1-12 0z'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #advanced-formatting-button .drawer-icon { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Cpath d='M6 18 12 5l6 13M8.4 13.5h7.2M4 21h16'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #WIDrawerIcon { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Cpath d='M3 5.5c3-1.5 6-1 9 1 3-2 6-2.5 9-1V19c-3-1.5-6-1-9 1-3-2-6-2.5-9-1z'/%3E%3Cpath d='M12 6.5V20'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #user-settings-button .drawer-icon { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Ccircle cx='12' cy='12' r='6.5'/%3E%3Cpath d='M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #backgrounds-button .drawer-icon { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Crect x='3' y='5' width='18' height='14' rx='2'/%3E%3Cpath d='M3 16l5-5 4 4 3-3 6 6'/%3E%3Ccircle cx='16' cy='9' r='1.6'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #extensions-settings-button .drawer-icon { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Crect x='4' y='4' width='7' height='7' rx='1.5'/%3E%3Crect x='4' y='13' width='7' height='7' rx='1.5'/%3E%3Crect x='13' y='13' width='7' height='7' rx='1.5'/%3E%3Cpath d='M16.5 2.6l3.9 3.9-3.9 3.9-3.9-3.9z'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #persona-management-button .drawer-icon { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M8.5 14.5c2 2 5 2 7 0'/%3E%3Ccircle fill='%23000' stroke='none' cx='9' cy='10' r='1.1'/%3E%3Ccircle fill='%23000' stroke='none' cx='15' cy='10' r='1.1'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #rightNavDrawerIcon { --ico: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='11.5' fill='%23000' fill-opacity='0.16' stroke='none'/%3E%3Cg transform='translate%283.6 3.6%29 scale%28.7%29' stroke-width='3.29'%3E%3Crect x='3' y='5' width='18' height='14' rx='2'/%3E%3Ccircle cx='8.5' cy='11' r='2'/%3E%3Cpath d='M5.5 16.5c.8-1.8 5.2-1.8 6 0M14 10h4M14 13.5h4'/%3E%3C/g%3E%3C/svg%3E\"); }\n:scope #ai-config-button .drawer-icon::before, :scope #sys-settings-button .drawer-icon::before, :scope #advanced-formatting-button .drawer-icon::before, :scope #WIDrawerIcon::before, :scope #user-settings-button .drawer-icon::before, :scope #backgrounds-button .drawer-icon::before, :scope #extensions-settings-button .drawer-icon::before, :scope #persona-management-button .drawer-icon::before, :scope #rightNavDrawerIcon::before { content: \"\"; display: inline-block; width: 1em; height: 1em; vertical-align: -.14em; background: currentColor; -webkit-mask: var(--ico) center / contain no-repeat; mask: var(--ico) center / contain no-repeat; }\n:scope #API-status-top { position: relative; }\n:scope #API-status-top.fa-plug-circle-exclamation::after { content: \"\"; position: absolute; right: 12%; top: 10%; width: .26em; height: .26em; border-radius: 50%; background: var(--cqs-danger); box-shadow: 0 0 0 2px var(--cqs-canvas); }" });
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

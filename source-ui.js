const fields = [
    ['panelHtml', '패널 HTML', `<header class="cqs-header">
  <div class="cqs-row">
    <span data-cqs-slot="eyebrow"></span>
    <span data-cqs-slot="close"></span>
  </div>
  <div data-cqs-slot="heading"></div>
  <div data-cqs-slot="subtitle"></div>
</header>
<div class="cqs-toolbar">
  <span data-cqs-slot="search"></span>
  <span data-cqs-slot="refresh"></span>
  <span data-cqs-slot="settings"></span>
</div>
<div class="cqs-qr-area" data-cqs-slot="qr"></div>
<footer data-cqs-slot="status"></footer>`],
    ['handleHtml', '손잡이 HTML', `<span class="my-handle">
  <span data-cqs-slot="icon"></span>
  <span data-cqs-slot="label"></span>
</span>`],
    ['panelCss', '패널 · 손잡이 CSS', `#cqs-panel { border-radius: 8px 28px 8px 28px; }
.cqs-handle .my-handle { display: flex; align-items: center; gap: .4rem; }
.cqs-grid { grid-template-columns: 1fr; }`],
    ['chatCss', '채팅 · 배경 · 입력창 CSS', `:scope #chat { background: #f1edf9; }
:scope[data-cqs-mode="bubbles"] .mes { border-radius: 22px; }
:scope[data-cqs-mode="document"] .mes_text { line-height: 2; }
:scope #send_textarea { letter-spacing: .02em; }
:scope #send_but { color: #7754ab; }
:scope#bg1 { filter: saturate(.7); }`],
    ['menuCss', '상단 메뉴 CSS', `:scope#top-bar { background: #342b50; }
.drawer-toggle .drawer-icon { color: #d4c4fc; }
.drawer-content { border-color: #9d86be; }`]
];

export function createSourceEditor({ patch, info }) {
    const node = document.createElement('details');
    node.className = 'cqs-editor cqs-source-editor';
    const heading = document.createElement('summary');
    heading.textContent = '소스 편집 · 패널 HTML과 영역별 CSS';
    const note = document.createElement('p');
    note.className = 'cqs-note';
    note.textContent = '빈 칸은 기본 디자인을 사용합니다. CSS는 각 영역에만 적용됩니다. 패널 HTML에는 close와 qr 슬롯을 넣으세요. 저장 후 캐릭터 설정에서 HTML/CSS 적용을 켜주세요.';
    node.append(heading, note);
    const inputs = new Map();
    for (const [key, title, sample] of fields) {
        const label = document.createElement('label');
        label.className = 'cqs-field';
        const name = document.createElement('span');
        name.textContent = title;
        const input = document.createElement('textarea');
        input.className = 'cqs-json';
        input.rows = key === 'panelHtml' ? 8 : 5;
        input.spellcheck = false;
        input.autocomplete = 'off';
        input.maxLength = 48000;
        input.placeholder = sample;
        label.append(name, input);
        const insert = document.createElement('button');
        insert.type = 'button';
        insert.className = 'cqs-button';
        insert.textContent = `${title} 예제 넣기`;
        function update() {
            try { patch(key, input.value); }
            catch (error) { info(error.message); }
            insert.disabled = Boolean(input.value.trim());
        }
        input.addEventListener('input', update);
        insert.addEventListener('click', () => { input.value = sample; update(); });
        node.append(label, insert);
        inputs.set(key, { input, insert });
    }
    return {
        node,
        refresh(theme) {
            for (const [key, { input, insert }] of inputs) {
                input.value = theme.source[key];
                insert.disabled = Boolean(input.value.trim());
            }
        }
    };
}

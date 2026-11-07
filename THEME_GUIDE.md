# 커스텀 스튜디오 테마 제작 가이드 (v1.0)

커스텀 스튜디오의 테마는 **JSON 파일 하나**입니다. 그 파일 하나에 다음이 모두 담깁니다.

- 색 · 크기
- 아이콘 · 배경 이미지
- 패널 HTML
- 영역별 CSS

만든 테마는 파일로 내보내 다른 사람과 나눌 수 있습니다.

이 가이드는 세 단계로 되어 있습니다. 필요한 곳까지만 읽어도 됩니다.

| 단계 | 할 수 있는 것 | 코드 |
| --- | --- | --- |
| 1. 색과 이미지만 | 기본 디자인에 내 색 · 배경 · 아이콘 입히기 | 필요 없음 |
| 2. 버튼 하나하나 | QR마다 아이콘 · 배경 · 모양 | 필요 없음 |
| 3. 소스 편집 | 패널 구조와 채팅 · 입력창 · 상단 메뉴를 CSS로 자유롭게 | HTML · CSS |

> AI에게 테마를 만들어 달라고 할 때는 같이 들어 있는 `THEME_GUIDE_AI.md`를 통째로 붙여 주세요. AI가 지켜야 할 규칙만 압축한 문서입니다.

---

## 0. 시작하기

1. 테마를 입힐 캐릭터의 **1:1 대화방**을 엽니다.
2. **확장 설정 → ✦ 커스텀 스튜디오 · 캐릭터 테마 설정**을 엽니다.
3. 아래쪽 **테마 만들기 · 가져오기 / 내보내기**를 펼칩니다.
4. 위쪽 「테마」에서 출발할 테마를 고른 뒤 **선택 테마 불러오기**를 누릅니다.
5. **테마 id를 새 이름으로** 바꿉니다. 예: `my-night`
   - 내장 테마(「· 내장」 표시)는 원본 그대로 두고 복사해서 고치는 방식입니다.
   - id는 영문 소문자 · 숫자 · 하이픈만 쓸 수 있고, 1~64자입니다.
6. 고치는 중간중간 **지금 화면에 미리보기**로 확인합니다. 저장하지 않고 현재 대화에 잠깐 입혀 보는 기능입니다. 「미리보기 끝」을 누르거나 설정창을 닫으면 원래대로 돌아갑니다.
7. 마음에 들면 **테마 저장**을 누릅니다. 그다음 위에서 그 테마를 고르고 **캐릭터에 적용**을 누릅니다.

---

## 1단계 · 색과 이미지

### 색 14가지

설정창의 색 칸, 또는 JSON의 `colors`에서 바꿉니다. 값은 반드시 `#RRGGBB` 여섯 자리입니다. 반투명은 3단계 CSS에서 씁니다.

| 이름 | 쓰이는 곳 |
| --- | --- |
| `canvas` | 채팅 바탕, 패널 바탕 |
| `surface` | 입력창, 검색칸, 메시지 카드 |
| `user` | 내 메시지 카드 |
| `text` | 본문 글자 |
| `muted` | 보조 글자, 기울임(*지문*) |
| `accent` | 강조색: 캐릭터 이름, 아이콘, 버튼 |
| `accentSoft` | 강조색의 연한 바탕: 개수 배지 등 |
| `border` | 테두리, 구분선 |
| `quote` | 따옴표 대사, 인용 |
| `code` | 코드 바탕 |
| `headerA`, `headerB` | 패널 머리 · 손잡이 그라데이션의 양 끝 |
| `button` | QR 버튼 바탕 |
| `buttonHover` | QR 버튼에 마우스를 올렸을 때 |

- **어두운 테마 판정:** `canvas`가 어두우면 확장이 알아서 어두운 테마로 판단합니다. 그러면 그림자와 경고색이 어두운 테마에 맞게 바뀝니다.
- **강조 버튼 글자색:** `accent` 위의 글자색은 흰색과 진한 남색 중 더 잘 읽히는 쪽이 자동으로 고릅니다.
- **읽기 좋은 대비:** `text`와 `canvas`는 7:1 이상, `muted` · `accent`와 `canvas`는 4.5:1 이상을 권장합니다.

### 크기 (`layout`)

| 이름 | 범위 | 뜻 |
| --- | --- | --- |
| `panelWidth` | 260~460 | 패널 폭(px) |
| `radius` | 0~36 | 패널 · 카드 모서리 |
| `buttonRadius` | 0~30 | QR 버튼 모서리 |
| `gap` | 4~24 | 버튼 사이 간격 |
| `columns` | 1~3 | 버튼 열 수 |
| `fontSize` | 12~24 | 메시지 글자 크기 |
| `lineHeight` | 1.2~2.4 | 메시지 줄 간격 (소수 가능) |

`lineHeight`를 뺀 나머지는 정수로 씁니다.

### 장식 (`decoration`)

| 이름 | 뜻 |
| --- | --- |
| `symbol` | 제목 앞 기호(8자 이하). 손잡이와 QR의 기본 아이콘으로도 쓰입니다. |
| `title` | 패널 제목(100자 이하) |
| `subtitle` | 패널 부제(100자 이하) |
| `background` | 채팅 바탕 무늬: `dots`(물방울 무늬) · `plain`(단색) · `gradient`(그라데이션) |

### 채팅 배경 이미지 (`wallpaper`)

**채팅 배경 이미지 → 배경 이미지 업로드**로 올립니다. PNG · JPG · GIF · WebP, 2 MB까지 됩니다.

| 이름 | 값 |
| --- | --- |
| `size` | `cover`(채우기) · `contain`(맞추기) · `auto`(원본 크기) |
| `position` | `center` · `top` · `bottom` · `left` · `right` |
| `repeat` | `no-repeat` · `repeat` |
| `overlay` | 0~1. 배경 위에 `canvas` 색을 얼마나 덮을지 |
| `messageOpacity` | 0~1. 배경이 있을 때 메시지 카드의 불투명도 |

### 손잡이 (`handle`)

패널을 접었을 때 화면 옆에 붙는 탭입니다.

| 이름 | 값 |
| --- | --- |
| `icon` | 아래 「아이콘 종류」 중 하나 |
| `label` | 문구(16자 이하) |
| `showLabel` | 문구 표시 여부 |
| `size` | 아이콘 크기 16~48px |

아이콘을 숨기면(`none`) 문구는 반드시 보여야 합니다.

### 아이콘 종류

| type | value | 예 |
| --- | --- | --- |
| `native` | 없음 | QR에 원래 지정된 아이콘을 씁니다. 없으면 `symbol`을 씁니다. |
| `text` | 문자 · 이모지 24자 이하 | `"♡"` |
| `fa` | Font Awesome 클래스 | `"fa-solid fa-heart"` |
| `image` | 업로드 이미지 (256 KB 이하) | 업로드 버튼으로만 넣습니다 |
| `none` | 없음 | 아이콘을 숨깁니다 |

---

## 2단계 · 버튼 하나하나

**테마별 QR 아이콘**과 **개별 QR 버튼 디자인**에서 지정합니다.

1. **QR 세트**와 **적용 대상 QR**을 고릅니다. 「세트 전체」나 「모든 세트」를 고르면 공통 아이콘이 됩니다.
2. 아이콘 종류를 고르고 **선택 아이콘 반영**을 누릅니다.
3. 아래에서 배경색 · 배경 이미지(256 KB) · 모양을 고르고 **QR 디자인 반영**을 누릅니다.
   - 모양은 `default`(테마 기본) · `square`(각진) · `round`(둥근) · `pill`(캡슐) · `circle`(원형) 중에서 고릅니다.

- **아이콘 우선순위:**
  1. 그 QR 하나에 지정한 아이콘
  2. 세트 + 버튼 이름으로 지정한 아이콘
  3. 모든 세트에서 버튼 이름으로 지정한 아이콘
  4. 세트 전체에 지정한 아이콘
  5. 공통 아이콘
- **이름을 바꿔도 유지:** 개별 지정은 QR의 원래 번호(id)에 붙기 때문에 버튼 이름을 바꿔도 남습니다. 세트 이름을 바꾸거나 QR을 지웠다 다시 만들면 다시 지정해야 합니다.
- **소스 스위치와 별개:** 배경색 · 이미지 · 모양은 「HTML/CSS 적용」을 꺼도 보입니다. 개별 QR HTML/CSS만 켜야 보입니다.

---

## 3단계 · 소스 편집 (HTML · CSS)

**소스 편집 · 패널 HTML과 영역별 CSS**를 펼치면 다섯 칸이 있습니다. 빈 칸은 기본 디자인을 그대로 씁니다.

캐릭터 설정에서 **「이 캐릭터에서 테마의 HTML/CSS 적용」을 켜야** 소스가 적용됩니다.

### 3-1. 패널 HTML

패널의 배치를 직접 짭니다. 확장의 진짜 버튼과 입력칸은 `data-cqs-slot`을 붙인 자리에 들어갑니다. 그래서 클릭 · 검색 · 실행이 그대로 동작합니다.

| 슬롯 | 들어가는 것 | 필수 |
| --- | --- | --- |
| `close` | 닫기 버튼 `button.cqs-close` | ✔ |
| `qr` | QR 목록 전체 `div.cqs-content` | ✔ |
| `eyebrow` | 작은 머리말 `span.cqs-eyebrow` | |
| `heading` | 제목 `h2` (기호 + 제목) | |
| `subtitle` | 부제 `p` | |
| `search` | 검색칸 `input` | |
| `refresh` | 새로고침 버튼 `button.cqs-button` | |
| `settings` | 설정 버튼 `button.cqs-button` | |
| `status` | 상태줄 `p.cqs-status` | |

```html
<header class="my-head">
  <div class="my-row"><span data-cqs-slot="eyebrow"></span><span data-cqs-slot="close"></span></div>
  <div data-cqs-slot="heading"></div>
  <div data-cqs-slot="subtitle"></div>
</header>
<div class="my-tools"><span class="my-find" data-cqs-slot="search"></span><span data-cqs-slot="refresh"></span><span data-cqs-slot="settings"></span></div>
<div data-cqs-slot="qr"></div>
<footer data-cqs-slot="status"></footer>
```

- **슬롯 규칙:** 슬롯은 한 번씩만 쓰고, 슬롯 안에 슬롯을 넣지 않습니다. 빠진 선택 슬롯은 패널에 나오지 않습니다. 설정은 확장 메뉴에서도 열 수 있습니다.
- **쓸 수 있는 태그:** `div span section article header footer main nav aside p h2 h3 h4 strong em small b i mark ul ol li figure figcaption img br hr`
- **쓸 수 있는 속성:** `class` `title` `aria-hidden` `data-cqs-slot`, 그리고 `img`의 `src` `alt`
  - 이미지 주소는 `https://…` 또는 PNG · JPEG · GIF · WebP data URL만 됩니다.
- **막혀 있는 것:** `<script>`, `<style>`, `<svg>`, `<a>`, `<button>`, `<iframe>`, `onclick` 같은 이벤트 속성, `style` 속성은 모두 막혀 있습니다. 넣으면 저장할 때 오류가 납니다. 모양은 CSS 칸에서 줍니다.

**손잡이 HTML**은 슬롯 `icon` · `label` 중 하나 이상을 씁니다.

**개별 QR HTML**은 `label`이 필수이고 `icon`은 선택입니다. 슬롯이 아닌 글자는 그대로 보이므로, 버튼마다 보조 문구를 붙일 수 있습니다.

```html
<span class="my-qr"><span data-cqs-slot="icon"></span><span class="my-text"><span data-cqs-slot="label"></span><small>30 다이아</small></span></span>
```

### 3-2. 영역별 CSS

칸마다 적용되는 범위가 정해져 있습니다. 그 밖의 화면에는 영향을 주지 않습니다. `:scope`는 그 범위의 맨 바깥 요소를 뜻합니다.

| 칸 | `:scope`가 가리키는 것 | 자주 쓰는 대상 |
| --- | --- | --- |
| 패널 · 손잡이 CSS | `#cqs-root` (패널과 손잡이를 감싸는 틀) | `#cqs-panel`, `:scope > .cqs-handle`, `.cqs-set`, `.cqs-set-title`, `.cqs-count`, `.cqs-grid`, `.cqs-qr`, `.cqs-qr-icon`, `.cqs-qr-label`, `.cqs-status`, `.cqs-empty` |
| 채팅 · 배경 · 입력창 CSS | `#sheld`, `#bg1`, `#bg_custom`, `#options` | `#chat`, `.mes`, `.mes_text`, `.ch_name`, `.avatar img`, `#send_form`, `#send_textarea`, `#leftSendForm`, `#rightSendForm`, `#send_but`, `#qr--bar` |
| 상단 메뉴 CSS | `#top-bar`, `#top-settings-holder` | `:scope#top-bar`, `.drawer-toggle`, `.drawer-icon`, `.drawer-icon.openIcon`, `.drawer-content` |
| 개별 QR CSS | 그 버튼 하나 (`.cqs-qr`) | `:scope`, `.cqs-qr-icon`, `.cqs-qr-label`, 개별 HTML에 쓴 내 클래스 |

**쓸 수 있는 것:**
- 일반 규칙과 CSS 중첩
- `@media` · `@supports` · `@container`
- `@keyframes` (이름 앞에 `my-` 같은 고유 접두어를 붙여 주세요)

**막혀 있는 것:** `@import`, `@font-face` 같은 나머지 at-rule은 막혀 있습니다. 글꼴은 기기에 있거나 다른 확장이 이미 불러온 것만 쓸 수 있습니다.

#### 상태에 따라 바꾸기

| 선택자 | 언제 |
| --- | --- |
| `:scope[data-side="left"]` (패널 CSS) | 패널이 왼쪽일 때 |
| `#cqs-panel .cqs-qr:disabled` | 응답 생성 중이라 버튼이 잠겼을 때 |
| `.cqs-qr[data-cqs-design]` | 개별 디자인이 지정된 버튼 |
| `.cqs-qr[data-cqs-shape="pill"]` | 모양이 지정된 버튼 |
| `.cqs-set:has(.cqs-qr[data-cqs-design])` | 개별 디자인 버튼이 있는 세트 (전용 세트 / 일반 세트를 다르게 꾸밀 때) |
| `.cqs-status[data-error="true"]` | 실행 오류 문구 |
| `:scope[data-cqs-mode="flat" / "bubbles" / "document"]` (채팅 CSS) | 실리태번의 기본형 · 말풍선형 · 문서형 |

#### 테마 색을 CSS에서 쓰기

모든 색과 크기는 CSS 변수로 들어옵니다. 색을 직접 적지 말고 변수를 쓰면 색만 바꾼 복사본이 저절로 어울립니다.

- 색: `var(--cqs-canvas)` `var(--cqs-surface)` `var(--cqs-user)` `var(--cqs-text)` `var(--cqs-muted)` `var(--cqs-accent)` `var(--cqs-accentSoft)` `var(--cqs-border)` `var(--cqs-quote)` `var(--cqs-code)` `var(--cqs-headerA)` `var(--cqs-headerB)` `var(--cqs-button)` `var(--cqs-buttonHover)`
- 크기: `var(--cqs-panelWidth)` `var(--cqs-radius)` `var(--cqs-buttonRadius)` `var(--cqs-gap)` `var(--cqs-columns)` `var(--cqs-fontSize)` `var(--cqs-lineHeight)`
- 자동으로 만들어지는 값:
  - `var(--cqs-onAccent)` 강조색 위 글자색
  - `var(--cqs-shadow)` 그림자
  - `var(--cqs-danger)` 경고색
  - `var(--cqs-scheme)` light / dark
  - `var(--cqs-message-surface)` · `var(--cqs-message-user)` 배경 투명도가 반영된 메시지 색
- 버튼에 지정한 배경색 · 배경 이미지: `var(--cqs-qr-bg)` `var(--cqs-qr-image)`

#### 꼭 알아야 할 함정 네 가지

1. **기본 규칙보다 한 단계 구체적으로 쓰세요.**
   - 확장 기본 규칙에는 `#id`가 들어 있어서, `:scope #send_form`처럼 쓰면 밀립니다.
   - 아이디를 겹치거나(`:scope #send_form#send_form`) 범위를 하나 더 붙이면(`#cqs-panel .cqs-qr`) 됩니다.
   - 실리태번이 직접 박아 넣는 스타일(예: 배경 이미지)을 바꿀 때는 `!important`를 씁니다.
2. **공용 변수는 패널 CSS의 `:scope`에 두세요.** `#cqs-panel`에만 정의하면 손잡이에서는 비어 있습니다. 그 변수를 쓴 선언은 통째로 무시됩니다.
3. **버튼마다 달라지는 값은 대체값으로 읽으세요.** 패널 CSS에서 `color: var(--q, var(--cqs-accent))`처럼 쓰고, 개별 QR CSS에서 `:scope { --q: #ff9cc0; }`로 넘깁니다. 패널 CSS에서 `--q`를 직접 정하면 개별 값이 밀립니다.
4. **고정 위치 요소는 화면 단위로 쓰세요.** 실리태번 모바일은 기준 높이가 0이 되는 구조라서, `top: 40%`나 `top`+`bottom` 조합은 휴대폰에서 접힙니다. `top: 40dvh`, `height: calc(100dvh - 90px)`처럼 씁니다.

#### 자주 쓰는 조각

```css
/* 채팅 CSS — 입력창 위 기본 QR 막대 숨기기(패널만 쓸 때) */
:scope #qr--bar { display: none !important; }

/* 채팅 CSS — 화면 전체 배경을 그라데이션으로 */
:scope#bg1, :scope#bg_custom { background: linear-gradient(180deg, #1b1636, #0f0b20) !important; }
:scope #chat#chat { background: color-mix(in srgb, var(--cqs-canvas) 50%, transparent); }

/* 채팅 CSS — 입력창 */
:scope #send_form#send_form { border-radius: 16px; border: 1px solid var(--cqs-border); }
:scope #send_form #rightSendForm #send_but { color: var(--cqs-accent); }

/* 패널 CSS — 버튼을 가로형(아이콘 왼쪽)으로 */
#cqs-panel .cqs-qr { flex-direction: row; justify-content: flex-start; text-align: left; min-height: 56px; }

/* 상단 메뉴 CSS */
:scope#top-bar { background: var(--cqs-canvas); border-bottom: 1px solid var(--cqs-border); }
:scope .drawer-icon.openIcon { color: var(--cqs-accent); }
```

---

## 테마 JSON 한눈에 보기

```json
{
  "format": "custom-studio-theme",
  "version": 1,
  "id": "my-night",
  "name": "나의 밤",
  "author": "익명",
  "colors": { "canvas": "#17181c", "surface": "#1f2025", "user": "#26272d", "text": "#ecebe7", "muted": "#a6a39c",
              "accent": "#d6c19c", "accentSoft": "#2e2a23", "border": "#34353b", "quote": "#e2d2b4", "code": "#222328",
              "headerA": "#25262c", "headerB": "#1d1e23", "button": "#1e1f24", "buttonHover": "#2a2b31" },
  "layout": { "panelWidth": 330, "radius": 14, "buttonRadius": 9, "gap": 8, "columns": 2, "fontSize": 16, "lineHeight": 1.8 },
  "decoration": { "symbol": "◆", "title": "Studio", "subtitle": "정돈된 바로가기", "background": "plain" },
  "icons": { "default": { "type": "native" }, "rules": [] },
  "handle": { "icon": { "type": "text", "value": "◆" }, "label": "QR", "showLabel": true, "size": 18 },
  "wallpaper": { "image": "", "size": "cover", "position": "center", "repeat": "no-repeat", "overlay": 0.2, "messageOpacity": 0.94 },
  "source": { "panelHtml": "", "handleHtml": "", "panelCss": "", "chatCss": "", "menuCss": "" },
  "qrStyles": []
}
```

- **필수 항목:** `format`, `version`, `id`, `name`. 나머지는 빼면 기본값이 들어갑니다.
- **모르는 항목은 오류:** 표에 없는 항목 이름을 넣으면 오류가 납니다. 오타를 조심하세요.
- **`qrStyles` 한 칸의 모양:** `{ "set": "세트 이름", "id": 3, "background": "#302846", "image": "", "shape": "pill", "html": "", "css": ":scope { … }" }`
  - `id` 대신 `"label": "원본 버튼 이름"`을 써도 됩니다. 단, 둘 중 하나만 씁니다.
- **`icons.rules` 한 칸의 모양:** `{ "set": "세트 이름" 또는 null, "id": 0 또는 "label": "버튼 이름", "icon": { … } }`

### 크기 제한

| 대상 | 제한 |
| --- | --- |
| 테마 파일 전체 | 6 MB |
| 채팅 배경 이미지 | 2 MB |
| 아이콘 · 손잡이 · QR 배경 이미지 | 각 256 KB |
| 패널 HTML · 손잡이 HTML · 각 CSS 칸 | 각 48,000자 |
| 개별 QR HTML · CSS | 각 12,000자 |
| 아이콘 규칙 · 개별 QR 디자인 | 각 200개 |

---

## 확장에 내장 테마로 넣기

확장 폴더 `themes/`에 JSON을 두고 `themes/index.json`의 `themes` 목록에 파일 이름을 적습니다. 그러면 가져오기 없이 목록에 「· 내장」으로 나타납니다.

- 파일 이름은 영문 소문자 · 숫자 · 하이픈 + `.json`만 됩니다.
- 형식이 틀린 파일은 건너뛰고, 그 이유를 브라우저 콘솔에 남깁니다.

## 화면이 망가졌을 때

`Alt+Shift+Q`를 누르거나, 접속 주소 끝에 `?cqs-safe=1`을 붙여 다시 엽니다. 이미 `?`가 있는 주소라면 `&cqs-safe=1`을 붙입니다. 그 페이지에서는 HTML/CSS만 꺼진 채 설정을 열 수 있으니, 고치거나 다른 테마로 바꾸면 됩니다.

## 나눠 줄 때

- **내보내기:** **JSON 내보내기**로 파일을 만듭니다. 이미지도 파일 안에 들어갑니다.
- **받는 쪽:** **JSON 가져오기 → 테마 저장 → 캐릭터에 적용** 순서로 넣습니다.
- **소스가 든 테마를 받았다면:** 내용을 확인한 뒤 「HTML/CSS 적용」을 켜 주세요.
- **외부 이미지:** CSS나 HTML에 외부 이미지 주소를 넣으면 보는 사람의 브라우저가 그 주소에 접속합니다.

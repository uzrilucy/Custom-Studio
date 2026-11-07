# 커스텀 스튜디오 테마 제작 가이드

확장 설정에서 캐릭터의 1:1 대화를 선택하고 **테마 만들기 · 가져오기 / 내보내기**를 펼칩니다. 새 id와 이름을 입력하고, 코드나 색상 및 이미지를 편집한 뒤 테마를 저장합니다. 캐릭터에서 사용할 화면 항목을 켜고 **캐릭터에 적용**을 누르면 현재 대화부터 반영됩니다.

## HTML 레이아웃

`data-cqs-slot`이 지정된 요소 안에 확장의 실제 컨트롤이 들어갑니다. 기본 틀인 `#cqs-panel`, `.cqs-handle`, `.cqs-qr`는 CSS로 꾸밉니다. 내부 HTML을 비워두면 기본 구조를 씁니다.

| 대상 | 필수 슬롯 | 선택 슬롯 |
| --- | --- | --- |
| 패널 | `close`, `qr` | `eyebrow`, `heading`, `subtitle`, `search`, `refresh`, `settings`, `status` |
| 손잡이 | `icon` 또는 `label` 하나 이상 | 나머지 슬롯 |
| 개별 QR | `label` | `icon` |

```html
<header class="archive-header">
  <div data-cqs-slot="heading"></div>
  <span data-cqs-slot="close"></span>
</header>
<div class="archive-search" data-cqs-slot="search"></div>
<div data-cqs-slot="qr"></div>
<footer data-cqs-slot="status"></footer>
```

슬롯을 하나씩 사용하고, 슬롯 안에 다른 슬롯을 중첩하지 않습니다. 선택 슬롯을 빼면 해당 컨트롤은 패널에 표시되지 않습니다. 설정 슬롯을 생략한 경우에도 실리태번의 확장 설정에서 열 수 있습니다. HTML에서 직접 버튼을 생성하는 대신 슬롯을 배치하면 기존 클릭, 키보드, 검색과 실행 동작을 그대로 사용할 수 있습니다.

일반적인 구조 태그와 텍스트, `img`를 사용할 수 있습니다. 속성은 `class`, `title`, `aria-hidden`, `data-cqs-slot`, 이미지의 `src`와 `alt`를 지원합니다. 이미지 주소는 HTTPS 또는 PNG/JPEG/GIF/WebP data URL을 사용합니다.

## 영역별 CSS

| 입력칸 | 적용되는 실리태번 또는 확장 영역 | 주요 선택자 |
| --- | --- | --- |
| 패널 CSS | `#cqs-root` 내부 | `#cqs-panel`, `#cqs-root .cqs-handle`, `.cqs-content`, `.cqs-grid`, `.cqs-qr-label` |
| 채팅 CSS | `#sheld`, `#bg1`, `#bg_custom`, `#options` | `#chat`, `.mes`, `.mes_text`, `#send_form`, `#send_textarea`, `#send_but`, `#options_button` |
| 상단 메뉴 CSS | `#top-bar`, `#top-settings-holder` | `:scope#top-bar`, `.drawer-icon`, `.drawer-content` |
| 개별 QR CSS | 해당 QR 버튼 하나와 그 내부 | `:scope`로 버튼 자체, `.cqs-qr-icon`, `.cqs-qr-label` |

`@media`, `@supports`, `@container`, `@keyframes`와 CSS 중첩을 사용할 수 있습니다. `@import`는 불러오지 않습니다. `@keyframes` 이름은 테마 안에서 구분하고 다른 테마나 실리태번과 겹치지 않게 앞에 자체 접두어를 붙이세요. 채팅 형식별 규칙은 `#sheld`에 붙는 `data-cqs-mode="flat"`, `"bubbles"`, `"document"`를 사용합니다. 브라우저의 CSS 우선순위가 적용되므로 기존 규칙에 밀릴 경우 대상 선택자를 더 구체적으로 쓰세요.

```css
/* 채팅 CSS */
:scope #send_form {
  border-radius: 16px;
  background: #272439;
}
:scope #send_textarea {
  color: #f6e8ff;
  letter-spacing: .025em;
}
:scope[data-cqs-mode="bubbles"] #chat .mes { border-radius: 22px; }
:scope[data-cqs-mode="document"] #chat .mes_text { max-inline-size: 70ch; }
```

```css
/* 개별 QR CSS */
:scope.cqs-qr[data-cqs-shape] {
  border-radius: 12px 26px;
  background-size: cover;
}
.cqs-qr-label { letter-spacing: .04em; }
```

## 테마 JSON

`format: "custom-studio-theme"`(이전 형식 이름도 읽습니다), `version: 1`, `id`, `name`이 필요합니다. id는 소문자·숫자·하이픈을 사용하며 1~64자입니다. 나머지 항목은 선택입니다. `themes/modern-cutie.json`에서 기존 항목을, `themes/chic-modern.json`에서 패널 HTML과 영역별 CSS 항목을 확인할 수 있습니다.

| 항목 | 용도 |
| --- | --- |
| `colors`, `layout`, `decoration` | 색상, 패널 폭·모서리·여백·그리드 열, 제목·부제·배경 패턴 |
| `icons.default`, `icons.rules` | 공통, 세트별, 개별 QR 아이콘 |
| `handle` | 손잡이 아이콘·크기·문구·문구 표시 |
| `wallpaper` | 채팅 배경 이미지·크기·위치·반복·투명도 |
| `source` | `panelHtml`, `handleHtml`, `panelCss`, `chatCss`, `menuCss` |
| `qrStyles` | 개별 QR의 `set`과 `id` 또는 원본 `label`, `background`, `image`, `shape`, `html`, `css` |

QR 모양 값은 `default`, `square`, `round`, `pill`, `circle`입니다. 색상 필드는 `#RRGGBB`를 사용합니다. CSS에서는 반투명 색상, 그라데이션, 이미지 합성 및 사용자 지정 모양도 지정할 수 있습니다. QR 아이콘과 QR 디자인은 서로 다른 규칙으로 저장되며, 개별 QR을 지정할 때 가능한 경우 같은 세트 이름과 원본 숫자 ID를 사용합니다.

HTML/CSS 적용 스위치는 캐릭터 설정에 저장됩니다. QR 배경색·이미지·모양과 기본 색상 옵션은 소스 스위치와 별개입니다.

## 내장 테마로 넣기 (0.4.0)

확장 폴더의 `themes/`에 테마 JSON을 두고 `themes/index.json`의 `themes` 배열에 파일 이름을 적으면, 가져오기 없이 테마 목록에 「· 내장」으로 나타납니다. 파일 이름은 영문 소문자·숫자·하이픈과 `.json`만 씁니다. 형식이 틀린 파일은 건너뛰고 브라우저 콘솔에 이유를 남깁니다.

## 소스 CSS를 쓸 때 알아둘 점

- **공용 변수는 `:scope`에 둡니다.** 패널 CSS의 `:scope`는 `#cqs-root`라서 패널과 손잡이 모두에 물려줍니다. `#cqs-panel`에만 정의한 변수는 손잡이에서 비어 있고, 그 변수를 쓴 선언은 통째로 무시됩니다.
- **개별 QR CSS에서 버튼마다 값을 바꾸려면** 패널 CSS에서 그 변수를 버튼에 직접 넣지 말고 `var(--q, 기본값)`처럼 대체값으로 읽습니다. 패널 CSS의 `#cqs-panel .cqs-qr`가 개별 QR CSS의 `:scope`보다 우선순위가 높기 때문입니다.
- **위치와 높이는 화면 단위로 줍니다.** 실리태번 모바일은 `html`의 높이가 0이 되는 구조라서, 고정 요소에 `%`나 `top`·`bottom` 조합을 쓰면 휴대폰에서 접힙니다. `40dvh`, `calc(100dvh - 90px)`처럼 쓰세요.
- 기본 규칙을 이기려면 `#cqs-panel .cqs-qr`, `:scope #send_form#send_form`처럼 대상 선택자를 한 단계 더 구체적으로 씁니다.

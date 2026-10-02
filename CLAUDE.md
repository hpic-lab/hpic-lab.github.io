# HPIC Lab 홈페이지 (hpic-lab.github.io) 작업 규칙

정적 사이트. HTML + jQuery 3.7.1 + Bootstrap 5 + slick, 데이터는 `json/` 에서 `$.getJSON` 으로 로드.
GitHub Pages 로 배포되며 저장소 루트에 `.nojekyll` 이 있다(Jekyll 빌드 비활성화).

## 기본 작업 흐름

1. 파일을 직접 수정한다.
2. **CSS/JS 를 수정하면 `index.html` 의 캐시 버스터를 반드시 올린다** — 예: `css/style.css?v=326` → `?v=327`,
   `js/publication.js?v=64` → `?v=65`. 이걸 빠뜨리면 사용자 브라우저에 반영되지 않는다.
3. **커밋·푸시는 Claude 가 하지 않는다.** 교수님이 윈도우 PowerShell 에서 직접 수행한다
   (강의자료 `serdes-lecture` 저장소와 동일한 방식 — 푸시용 토큰을 Claude 가 다루지 않게 하기 위함).
   작업을 마치면 실행할 명령 한 줄을 제시한다:
   ```
   .\push.ps1 "커밋 메시지"
   ```
   `push.ps1` 은 add -A → commit → push 를 수행하고, 거절되면 `pull --rebase` 후 재시도한다.
   참고: 이 저장소는 **Git LFS 를 쓰지 않는다**(.gitattributes 없음). 이미지·PDF 는 일반 git 객체로 커밋된다.
4. 배포는 GitHub Actions(Pages)가 자동 처리. 반영까지 1~2분 + 브라우저 캐시(하드 리프레시 Ctrl+Shift+R).

## 데이터 파일

| 내용 | 파일 |
|---|---|
| 뉴스 | `json/news/news.json` (year, month, category, text, links, figures) |
| 랩 갤러리 | `json/news/photo.json`, 사진은 `img/photo/` |
| 저널/학회/특허 | `json/publications/journal.json`, `conference.json`, `patent.json` |
| 칩 갤러리 | `json/chips/chips.json` (번호 = 배열 역순), 예정 테이프아웃 `json/chips/tapeout_schedule.json` |
| 구성원 | `json/people/00_principal_investigator.json` ~ `06_alumni_info.json` |
| 강의 | `json/teaching.json` |
| 연구과제 | `js/research_projects.js` 내 배열 |

## 표기 규칙

- **Publications 상태**: `progress` = `In Preparation` / `In Review` / `Accepted` / `Early Access` / (게재 시 공백).
  In Preparation·In Review 는 All/Journal/Conference/Patent 탭에서 숨기고, 사이드바의 작은 링크(`In Review ›`, `In Preparation ›`)로만 본다.
  게재 전 항목은 번호 대신 `J–` 로 표시한다.
- **공동 1저자(ECA)**: 저자 이름 끝에 `*` 를 붙이면 화면에 `†` 로 렌더된다. 범례는 Publications 상단에 고정.
- **칩 상태**(`status`): `awaiting` / `tapeout` / `pcb` / `measprep` / `measurement` / `completed` / `paper` / `review` / `accepted` / `published`.
  문구는 `js/chip_gallery.js` 의 `STATUS_MAP` 에 Title Case 로 정의. accepted/published 는 저널명·연도만 표시한다.
- **연구과제 뉴스**: 연구개발과제만 News 에 올린다(인건비성·인력양성 과제 제외).
- **연도 헤더**: 펼쳐진 연도는 파랑(#2e55be)+bold, 연번은 검정(#222)으로 전 섹션 통일.

## 개인정보 원칙 (교내 보안 지침)

- 구성원 이메일은 `email_user` / `email_domain` 으로 **분리 저장**하고 렌더 시 조립한다(크롤러 수집 방지). 평문 `email` 필드를 다시 만들지 말 것.
- `CV.tex`, `CV.pdf` 는 **개인 휴대폰 번호 포함 → 커밋 금지** (`.gitignore` 에 등록됨).
- 멤버 전용 자료(Design Review PDF, 심사 자료)는 SharePoint 링크로만 연결하고 자물쇠 아이콘으로 표시한다.

## CV (별도 관리)

`CV.tex` 는 **XeLaTeX** 으로 빌드한다(한글은 유니코드 직접 입력, CJKutf8 미사용).
```
xelatex -interaction=nonstopmode CV.tex   # 2회 실행
```
홈페이지 Publications/News 를 갱신하면 CV 도 같이 갱신하고 PDF 를 재생성한다.

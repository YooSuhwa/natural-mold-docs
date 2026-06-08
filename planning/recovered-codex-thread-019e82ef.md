# 복원한 Codex 스레드: docs-mold 문서화 작업

이 문서는 2026-06-07에 로컬 Codex 스레드/세션 기록을 읽어서 복원한 내용입니다.

## 스레드 정보

- 스레드 제목: `문서화 작성`
- 스레드 ID: `019e82ef-5f58-7cf1-9c7a-c881aa605f68`
- 작업 폴더: `/Users/chester/dev/ref/docs-mold`
- 생성 시각: 2026-06-01 20:26 KST
- 마지막 업데이트: 2026-06-02 11:13 KST
- 원본 세션 파일: `/Users/chester/.codex/sessions/2026/06/01/rollout-2026-06-01T20-26-26-019e82ef-5f58-7cf1-9c7a-c881aa605f68.jsonl`
- 확인된 UI 상태: 검색 결과와 스레드 DB에는 남아 있지만, 앱 UI에서 클릭해 열기 어려운 상태입니다. 세션 크기가 매우 크고 context compaction이 여러 번 들어간 장기 세션입니다.

## 이 문서를 만든 이유

Codex 앱 검색 결과에는 이 스레드가 보이지만, 클릭하면 열리지 않는 문제가 있었습니다. 로컬 기록을 확인한 결과 스레드는 삭제되지 않았습니다.

- `session_index.jsonl`에 스레드 항목이 남아 있습니다.
- `state_5.sqlite`의 `threads` 테이블에도 있고 `archived=0`입니다.
- Codex 앱의 `read_thread` 도구로는 내용을 읽을 수 있습니다.
- 원본 JSONL 세션 파일도 디스크에 남아 있습니다.

따라서 현재 상황은 데이터 삭제라기보다, 매우 큰 과거 세션을 앱 UI에서 로드/재생하는 단계가 깨지는 문제로 보입니다.

## 최초 요청

사용자는 `/Users/chester/dev/ref/docs-mold` 안에 Moldy 문서 사이트를 만들라고 요청했습니다. 기준 자료는 다음과 같았습니다.

- `/Users/chester/dev/ref/natural-mold`: 실제 제품 소스 코드 기준
- `/Users/chester/dev/ref/docs`: 문서 스타일과 구조 참고용
- `localhost:3000`: 실행 중인 Moldy 프론트엔드
- `.env`의 `USER_ID`, `USER_PW`: Playwright 로그인과 화면 캡처에 사용할 관리자 계정

핵심 요구는 추측으로 쓰지 말고, 실제 소스 코드와 실제 브라우저 화면을 기준으로 문서를 완성하는 것이었습니다.

## 복원한 작업 흐름

### 1. 계획 수립

처음에는 세션이 Plan Mode였기 때문에 파일을 바로 수정하지 않고 계획만 작성했습니다.

계획된 산출물은 다음과 같았습니다.

- `/Users/chester/dev/ref/docs-mold`에 독립 Mintlify 문서 사이트 생성
- 한국어/영어 제품 가이드 작성
- 실행 중인 Moldy 앱에 Playwright로 로그인해서 화면 캡처
- `localhost:8001/openapi.json`에서 OpenAPI 스냅샷 저장
- 프론트 라우트와 OpenAPI 기반 기능 인벤토리 생성
- 민감정보 검사 스크립트 추가

### 2. 1차 구현

사용자가 “지금 하고 있는거야?”라고 물은 뒤, Codex는 Plan Mode 때문에 앞서 실제 수정이 되지 않았다고 설명하고 구현을 진행했습니다.

당시 보고된 산출물은 다음과 같습니다.

- `src/docs.json`
- `src/hancom/moldy` 아래 한국어/영어 MDX 문서 26개
- `src/images/hancom/moldy` 아래 Playwright 로그인 기반 화면 캡처 38장
- `src/openapi/moldy-openapi.json`
- `planning/feature-inventory.md`
- 캡처, OpenAPI export, 민감정보 검사 스크립트
- Mintlify dev/check 실행을 위한 Node 22 우회 스크립트

당시 통과했다고 보고한 검증은 다음과 같습니다.

- `pnpm run check:sensitive`
- `pnpm run docs:check`
- MDX 이미지 참조 검사
- `http://localhost:3001/hancom/moldy/ko/quickstart` 200 응답 확인

### 3. 완료 감사와 Reference 문서 보강

Codex는 최초 계획과 현재 산출물을 다시 대조하면서 빠진 항목을 보강했습니다.

이 단계에서 보고된 산출물은 다음과 같습니다.

- Moldy MDX 문서 34개
- 스크린샷 40장
- Mermaid 다이어그램 8개
- 운영자 설정 문서
- 주요 개념 문서
- 변경 이력 문서
- 문서 갱신 절차 문서
- 갱신된 기능 인벤토리와 OpenAPI 스냅샷

보고된 검증은 다음과 같습니다.

- `pnpm run openapi && pnpm run inventory`
- `pnpm run capture`
- `pnpm run check:sensitive`
- `pnpm run docs:check`
- 이미지 참조와 alt text 검사
- 데스크톱/모바일 Playwright 확인
- API Reference 리다이렉트 대상 200 응답 확인

### 4. Fleet 문서 스타일 비교

사용자가 “전체적으로 내용이 너무 짧은데 Fleet를 참고해서 더 추가할 만한 것이 있는지, 일단 수정하지 말고 봐줘”라고 요청했습니다.

Codex의 결론은 다음과 같았습니다.

- Moldy 문서는 페이지 수는 충분하지만 각 페이지가 요약문 수준으로 짧았습니다.
- Fleet 문서는 각 기능마다 사전 조건, 설정 위치, 권한/보안, 운영 시나리오, 제한 사항, 문제 해결, 다음 단계를 반복적으로 제공하고 있었습니다.

추가를 추천한 큰 축은 다음과 같습니다.

- Essentials/Concepts 확장
- Quickstart 대폭 확장
- 에이전트 설정 문서 분리
- Tools, MCP, Skills 문서 분리
- MCP 서버 등록 가이드
- Marketplace 설치/게시/운영자 관리
- Access & Oversight
- Schedule/Trigger 심화
- 개발자/API 가이드
- 증상별 Troubleshooting

### 5. Fleet 참고 기반 문서 확장

이후 사용자가 승인했고, Codex는 Fleet 문서를 그대로 베끼지 않고 정보 구조만 참고해서 Moldy 실제 소스에 있는 기능만 문서화했다고 보고했습니다.

보고된 산출물은 다음과 같습니다.

- MDX 문서 50개
- 약 3010라인
- 스크린샷 40장
- Mermaid 다이어그램 18개
- 새로 추가된 KO/EN 문서:
  - `agent-settings`
  - `tools`
  - `mcp-servers`
  - `skills`
  - `marketplace-install-publish`
  - `access-oversight`
  - `api-auth`
  - `api-chat-streaming`
- 기존 quickstart, concepts, chat, credentials, schedules, usage, marketplace, troubleshooting 대폭 보강
- `src/docs.json` 갱신
- `planning/feature-inventory.md` 갱신

보고된 검증은 다음과 같습니다.

- `pnpm run docs:check`
- `pnpm run check:sensitive`
- MDX 이미지 참조와 alt 검사
- 문서 50개를 데스크톱/모바일로 열어 총 100회 Playwright 렌더링 확인
- Fleet 전용 의심 키워드 검색
- `pnpm run inventory`
- `node --check scripts/*.mjs`

### 6. 추가 이미지와 전체 백엔드 API 목록

사용자는 다음을 추가 요청했습니다.

- 계정 만들기에도 이미지 추가
- 첫 에이전트 만들기 문서에 대화형 빌더 7~8단계 진행 이미지 추가
- 에이전트 설정 관리 문서에 오프너, 스케줄, 설정, 비주얼 이미지 추가
- 전체 백엔드 API 리스트업과 설명 추가

Codex가 추가했다고 보고한 항목은 다음과 같습니다.

- 회원가입 화면 이미지
- 대화형 빌더 8단계 진행 화면 이미지
- 에이전트 설정 문서의 오프너, 스케줄, 설정, 비주얼 모드 이미지
- 전체 백엔드 API endpoint 목록 문서:
  - `src/hancom/moldy/ko/api-endpoints.mdx`
  - `src/hancom/moldy/en/api-endpoints.mdx`
- API endpoint 목록 생성 스크립트:
  - `scripts/build-api-endpoints-docs.mjs`
- `src/docs.json` 내비게이션 반영

이 단계에서 보고된 규모는 다음과 같습니다.

- MDX 52개
- 약 3736라인
- 이미지 52장
- 백엔드 API endpoint 149개 그룹별 정리

보고된 검증은 다음과 같습니다.

- `pnpm run capture`
- `pnpm run api-docs`
- `pnpm run inventory`
- `pnpm run docs:check`
- `pnpm run check:sensitive`
- 이미지 참조와 alt 검사
- 수정한 5개 문서 페이지의 데스크톱/모바일 Playwright 렌더링 확인
- Fleet/Slack/Teams/RBAC 등 Fleet 전용 의심 키워드 검색

### 7. 언어 UX 변경

사용자는 언어 처리를 탭이 아니라 콤보처럼 하고, 브라우저 설정에 따라 언어가 자동 설정되며, 기본 페이지는 영어가 되도록 요청했습니다.

Codex는 Mintlify i18n을 확인한 뒤 다음 방향을 추천했습니다.

- `docs.json`을 언어 탭 구조에서 `navigation.languages` 구조로 변경
- 영어를 기본 언어로 설정
- 루트 경로에서 브라우저 언어를 보고 한국어/영어로 보내는 작은 custom script 추가
- API Reference는 언어 선택과 별개로 유지

사용자가 “추천한 대로 해줘”라고 하자 Codex가 변경한 파일은 다음과 같습니다.

- `src/docs.json`
- `src/index.mdx`
- `src/language-redirect.js`

보고된 동작은 다음과 같습니다.

- `/` 진입 시 브라우저 언어가 `ko-*`면 `/hancom/moldy/ko`
- 그 외에는 `/hancom/moldy/en`
- 영어가 기본 언어
- API Reference 탭은 별도 유지

보고된 검증은 다음과 같습니다.

- `docs.json` JSON 파싱
- `node --check src/language-redirect.js`
- `pnpm run docs:check`
- `pnpm run check:sensitive`
- `ko-KR` 브라우저는 `/hancom/moldy/ko`
- `en-US` 브라우저는 `/hancom/moldy/en`
- Mintlify language selector 확인
- API Reference 링크 200 응답 확인

### 8. 언어 선택기를 다크모드 옆 아이콘으로 변경

사용자는 언어 변경 콤보가 언어 변경인지 잘 모르겠다고 했고, 다크모드 버튼 옆에 두는 것이 어떠냐고 물었습니다. 이어서 너무 크니 아이콘만 쓰는 것이 어떠냐고 요청했습니다.

Codex가 변경한 파일은 다음과 같습니다.

- `src/language-redirect.js`
- `src/style.css`

최종 보고된 동작은 다음과 같습니다.

- 언어 선택 컨트롤은 30x30 globe 아이콘 버튼
- 다크모드 버튼 바로 왼쪽에 배치
- 다크모드 버튼도 30x30
- 두 버튼 간격 8px
- 클릭 시 기존처럼 English/한국어 메뉴 열림

보고된 검증은 다음과 같습니다.

- `node --check src/language-redirect.js`
- `pnpm run docs:check`
- `pnpm run check:sensitive`
- 브라우저에서 크기, 간격, 메뉴 열림 확인
- 저장된 요소 스크린샷:
  - `/Users/chester/dev/ref/docs-mold/.playwright-cli/element-2026-06-02T02-12-33-522Z.png`

## 주요 생성/수정 파일

현재 작업 폴더 기준으로 확인되는 산출물은 다음과 같습니다.

- `src/hancom/moldy` 아래 MDX 문서 52개
- `src/images/hancom/moldy` 아래 PNG 이미지 52장
- `src/hancom/moldy` 아래 MDX 총 4088라인
- Mintlify 설정: `src/docs.json`
- 루트 fallback 페이지: `src/index.mdx`
- 언어 처리 스크립트: `src/language-redirect.js`
- 커스텀 스타일: `src/style.css`
- OpenAPI 스냅샷: `src/openapi/moldy-openapi.json`
- 기능 인벤토리: `planning/feature-inventory.md`
- 보조 스크립트:
  - `scripts/build-api-endpoints-docs.mjs`
  - `scripts/build-feature-inventory.mjs`
  - `scripts/capture-screenshots.mjs`
  - `scripts/check-docker-setup.mjs`
  - `scripts/check-sensitive-artifacts.mjs`
  - `scripts/export-openapi.mjs`
  - `scripts/lib.mjs`
  - `scripts/start-docs-dev.sh`

## 현재 문서 목록

영어와 한국어 양쪽에 다음 문서가 있습니다.

- `index`
- `quickstart`
- `accounts-login`
- `operator-setup`
- `create-first-agent`
- `chat-with-agent`
- `agent-settings`
- `tools-mcp`
- `tools`
- `mcp-servers`
- `skills`
- `models-credentials`
- `system-llm`
- `schedules`
- `usage`
- `marketplace`
- `marketplace-install-publish`
- `access-oversight`
- `concepts`
- `api-reference`
- `api-endpoints`
- `api-auth`
- `api-chat-streaming`
- `documentation-workflow`
- `changelog`
- `troubleshooting`

## 중요 메모

`/Users/chester/dev/ref/docs-mold`는 git 저장소가 아닙니다. 따라서 원래 스레드는 커밋을 만들지 않았습니다.

현재 남아 있는 가장 강한 근거는 다음 세 가지입니다.

- 로컬 Codex 세션 JSONL 파일
- Codex `threads` SQLite 레코드
- `/Users/chester/dev/ref/docs-mold`에 실제로 남아 있는 파일들

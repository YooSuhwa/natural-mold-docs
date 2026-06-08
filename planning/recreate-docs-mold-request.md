# docs-mold 문서 사이트 재생성 요청서

이 문서는 Codex에 다시 요청해서 현재 `docs-mold`와 같은 수준의 Moldy 문서 사이트를 재생성하기 위한 요청 프롬프트입니다.

아래 프롬프트를 새 Codex 스레드에 그대로 붙여 넣으면 됩니다. 단, 실행 전에 `localhost:3000`의 Moldy 프론트엔드와 `localhost:8001`의 백엔드 API가 켜져 있어야 하고, 작업 폴더의 `.env`에는 `USER_ID`, `USER_PW`가 있어야 합니다.

## 복사용 요청 프롬프트

```text
/Users/chester/dev/ref/natural-mold
/Users/chester/dev/ref/docs

위 두 폴더를 참고해서 `/Users/chester/dev/ref/docs-mold`에 Moldy 문서 사이트를 다시 만들어줘.

중요한 기준:

1. `/Users/chester/dev/ref/natural-mold`가 실제 제품 소스 코드 기준이다.
   - 프론트 라우트, 컴포넌트, 테스트, 백엔드 router, schema, OpenAPI를 직접 확인해야 한다.
   - 추측으로 기능을 쓰지 말고, 실제 코드나 실제 화면에서 확인되는 기능만 문서화해야 한다.

2. `/Users/chester/dev/ref/docs`는 문서 스타일과 정보 구조 참고용이다.
   - 특히 Fleet 문서처럼 개념, 사전 조건, 절차, 권한/보안, 운영 팁, 제한 사항, 문제 해결, 다음 단계가 살아 있는 구조를 참고한다.
   - 단, Fleet 전용 기능명이나 외부 제품 설명을 Moldy 문서에 그대로 넣으면 안 된다.

3. 현재 Moldy 프론트엔드는 `http://localhost:3000`에서 실행 중이다.
   - Playwright로 직접 로그인하고 실제 화면을 캡처해야 한다.
   - 작업 폴더 `/Users/chester/dev/ref/docs-mold/.env`에 있는 `USER_ID`, `USER_PW`를 사용한다.
   - 계정값, 이메일, 내부 URL, credential 이름, 비용/토큰 숫자 등 민감정보는 문서와 이미지에 남기지 말고 마스킹해야 한다.

4. 백엔드 OpenAPI는 `http://localhost:8001/openapi.json`에서 가져와야 한다.
   - `src/openapi/moldy-openapi.json`으로 저장한다.
   - Mintlify API Reference에 연결한다.
   - 별도로 전체 백엔드 API endpoint 목록 문서를 KO/EN으로 생성한다.

최종 산출물은 `/Users/chester/dev/ref/docs-mold` 안에 만든다.

필수 산출물:

- Mintlify 문서 사이트 설정
  - `src/docs.json`
  - 영어를 기본 언어로 설정
  - 언어는 탭이 아니라 `navigation.languages` 기반 language selector로 구성
  - `API Reference` 탭은 언어 선택과 별도로 유지

- 루트 진입 처리
  - `src/index.mdx`
  - `src/language-redirect.js`
  - `/` 진입 시 브라우저 언어가 `ko-*`이면 `/hancom/moldy/ko`
  - 그 외에는 `/hancom/moldy/en`
  - 이미 `/ko` 또는 `/en` 경로에 있는 경우에는 리다이렉트하지 않는다.

- 상단 언어 선택 UI
  - 언어 선택기는 다크모드 버튼 바로 왼쪽에 배치한다.
  - 텍스트 pill이 아니라 30x30 globe 아이콘 버튼으로 보이게 한다.
  - 접근성 이름과 title은 유지한다.
  - 클릭 시 English/한국어 메뉴가 열려야 한다.
  - 관련 파일은 `src/language-redirect.js`, `src/style.css`로 구현한다.

- KO/EN 문서
  - 영어와 한국어 모두 같은 정보 구조를 갖게 한다.
  - 최소한 아래 문서들을 각각 만들어야 한다.
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

- 실제 화면 캡처
  - Playwright로 로그인해서 KO/EN 양쪽 이미지를 생성한다.
  - 저장 위치:
    - `src/images/hancom/moldy/ko`
    - `src/images/hancom/moldy/en`
  - 최소한 아래 화면을 캡처한다.
    - login
    - register
    - dashboard
    - agent-create
    - agent-create-conversational
    - agent-create-conversational-progress
    - agent-create-manual
    - agent-templates
    - agent-chat
    - agent-settings
    - agent-settings-opener
    - agent-settings-schedule
    - agent-settings-settings
    - agent-settings-visual
    - agent-visual-settings
    - tools
    - mcp-servers
    - skills
    - marketplace
    - marketplace-moderation
    - credentials
    - system-credentials
    - system-llm
    - models
    - schedules
    - usage

- 기능 인벤토리
  - `planning/feature-inventory.md`
  - `/Users/chester/dev/ref/natural-mold`의 프론트 라우트와 테스트, OpenAPI endpoint를 대조해서 만든다.
  - 각 route마다 관련 영역, 접근 권한, 현재 지원 여부, 문서화 여부, 캡처 여부, 관련 테스트, KO/EN 문서 경로를 기록한다.
  - API endpoint도 tag/method/path/summary 기준으로 정리한다.

- 전체 백엔드 API 목록 문서
  - `src/hancom/moldy/ko/api-endpoints.mdx`
  - `src/hancom/moldy/en/api-endpoints.mdx`
  - OpenAPI snapshot에서 endpoint를 읽어 그룹별 목적, endpoint 수, method/path/summary를 설명한다.

- 보조 스크립트
  - `scripts/capture-screenshots.mjs`
  - `scripts/export-openapi.mjs`
  - `scripts/build-feature-inventory.mjs`
  - `scripts/build-api-endpoints-docs.mjs`
  - `scripts/check-sensitive-artifacts.mjs`
  - `scripts/check-docker-setup.mjs`
  - `scripts/start-docs-dev.sh`
  - 필요하면 공용 함수는 `scripts/lib.mjs`로 분리한다.

- `package.json`
  - `capture`
  - `capture:ko`
  - `capture:en`
  - `inventory`
  - `openapi`
  - `api-docs`
  - `check:sensitive`
  - `docker:check`
  - `docker:build`
  - `docker:up`
  - `docs:dev`
  - `docs:check`
  - Mintlify가 현재 Node 환경에서 깨지면 Node 22 우회 방식으로 실행되게 만든다.

- Docker 실행 지원
  - `Dockerfile`
  - `docker-compose.yml`
  - `.dockerignore`
  - `pnpm run docker:check`로 필요한 파일과 설정을 확인할 수 있게 한다.

문서 품질 기준:

- 단순 요약문이 아니라 실제 제품 문서 수준으로 쓴다.
- 각 주요 기능 문서에는 가능하면 다음 요소를 포함한다.
  - 기능의 목적
  - 언제 쓰는지
  - 사전 조건
  - 실제 사용 절차
  - 권한/보안/운영 주의사항
  - 실패 시 확인할 항목
  - 관련 API 또는 관련 문서 링크
- Fleet, Slack, Teams, RBAC 등 Moldy 소스에서 확인되지 않은 외부 제품/기능명을 문서에 섞지 않는다.
- 실제 소스에서 확인되지 않은 기능은 쓰지 않는다.
- 이미지에는 alt text를 반드시 넣는다.
- 모바일/데스크톱에서 이미지와 표가 깨지지 않아야 한다.
- 민감정보가 문서, 이미지 메타데이터, 로그 산출물에 남지 않아야 한다.

검증까지 반드시 수행하고 결과를 보고한다.

필수 검증:

- `pnpm install` 또는 필요한 의존성 설치
- `pnpm run openapi`
- `pnpm run api-docs`
- `pnpm run inventory`
- `pnpm run capture`
- `pnpm run check:sensitive`
- `pnpm run docs:check`
- `node --check scripts/*.mjs`
- `node --check src/language-redirect.js`
- MDX 이미지 참조와 alt text 검사
- Fleet/Slack/Teams/RBAC 등 외부 전용 키워드 잔여 검색
- 주요 문서 페이지 desktop/mobile Playwright 렌더링 확인
- `/`, `/hancom/moldy/ko`, `/hancom/moldy/en`, API Reference 링크가 정상 응답하는지 확인
- 언어 버튼이 다크모드 버튼 왼쪽 30x30 globe 아이콘으로 보이고 메뉴가 열리는지 확인

완료 보고에는 다음을 포함한다.

- 생성/수정한 주요 파일 목록
- MDX 문서 개수
- 이미지 개수
- OpenAPI endpoint 개수
- feature inventory 생성 여부
- 실행한 검증 명령과 결과
- 문서 서버 URL
- git 저장소가 아니면 커밋하지 않았다고 명시
```

## 현재 산출물 기준 참고값

현재 `/Users/chester/dev/ref/docs-mold`에 남아 있는 결과물 기준 참고값입니다. 재생성 시 소스 코드가 바뀌었다면 숫자는 달라질 수 있지만, 같은 시점의 소스를 기준으로 하면 대략 이 수준이 나와야 합니다.

- MDX 문서: 52개
- 이미지: 52장
- MDX 총 라인 수: 약 4088라인
- 전체 백엔드 API endpoint 문서화: 149개 endpoint 기준으로 생성됨
- 주요 문서 언어: KO/EN
- 문서 프레임워크: Mintlify
- 언어 처리: `navigation.languages` + root redirect script
- 언어 버튼: 다크모드 버튼 왼쪽 30x30 globe icon

## 재생성 후 꼭 비교할 파일

다시 만들었을 때 아래 파일들이 있어야 합니다.

- `src/docs.json`
- `src/index.mdx`
- `src/language-redirect.js`
- `src/style.css`
- `src/openapi/moldy-openapi.json`
- `planning/feature-inventory.md`
- `src/hancom/moldy/ko/api-endpoints.mdx`
- `src/hancom/moldy/en/api-endpoints.mdx`
- `scripts/capture-screenshots.mjs`
- `scripts/export-openapi.mjs`
- `scripts/build-feature-inventory.mjs`
- `scripts/build-api-endpoints-docs.mjs`
- `scripts/check-sensitive-artifacts.mjs`
- `scripts/start-docs-dev.sh`
- `Dockerfile`
- `docker-compose.yml`

## 주의할 점

- 이 요청서는 과거 스레드 내용을 그대로 복원하기 위한 것이 아니라, 같은 목적의 산출물을 다시 만들기 위한 작업 명세입니다.
- 기존 파일이 남아 있는 상태에서 실행한다면 Codex는 먼저 현재 상태를 읽고, 부족하거나 낡은 부분만 갱신해야 합니다.
- 빈 폴더에서 실행한다면 위 산출물을 새로 만들어야 합니다.
- `/Users/chester/dev/ref/docs-mold`는 현재 git 저장소가 아니므로, 사용자가 별도로 요청하지 않는 한 commit/push/PR은 하지 않습니다.

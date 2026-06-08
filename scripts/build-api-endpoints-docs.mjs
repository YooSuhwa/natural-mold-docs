import fs from "node:fs/promises";
import path from "node:path";

import { ROOT, ensureDir } from "./lib.mjs";

const specPath = path.join(ROOT, "src", "openapi", "moldy-openapi.json");
const spec = JSON.parse(await fs.readFile(specPath, "utf8"));

const methodOrder = { GET: 0, POST: 1, PUT: 2, PATCH: 3, DELETE: 4 };
const tagOrder = [
  "auth",
  "audit",
  "agent-api",
  "agent-runtime-api",
  "agents",
  "builder",
  "conversations",
  "artifacts",
  "assistant",
  "tools",
  "mcp",
  "skills",
  "credentials",
  "models",
  "memory",
  "system-llm-settings",
  "middlewares",
  "triggers",
  "usage",
  "marketplace",
  "shares",
  "templates",
  "uploads",
  "health",
  "feedback",
  "untagged"
];

const groupMeta = {
  auth: {
    koName: "인증",
    enName: "Authentication",
    koPurpose: "회원가입, 로그인, 로그아웃, refresh, 현재 사용자 세션, 프로필, 아바타 이미지 관리",
    enPurpose: "Registration, login, logout, refresh, current-user session, profile, and avatar image management"
  },
  audit: {
    koName: "활동 기록",
    enName: "Activity log",
    koPurpose: "내 활동과 운영자 전체 활동 기록 조회, 결과/대상/request/run 기준 필터링",
    enPurpose: "User and operator activity logs with outcome, target, request, and run filters"
  },
  "agent-api": {
    koName: "Agent API 관리",
    enName: "Agent API control plane",
    koPurpose: "외부 호출용 에이전트 배포 후보, 배포 상태, 서버용 API 키 생성/조회/폐기",
    enPurpose: "Deployment candidates, deployment state, and server-side API key management for external agent calls"
  },
  "agent-runtime-api": {
    koName: "Agent API 런타임",
    enName: "Agent API runtime",
    koPurpose: "배포된 에이전트를 API 키로 호출하는 /v1 실행, 스트리밍, thread, 호환 endpoint",
    enPurpose: "/v1 run, stream, thread, and compatibility endpoints for deployed agents called with API keys"
  },
  agents: {
    koName: "에이전트",
    enName: "Agents",
    koPurpose: "에이전트 CRUD, 요약 목록, 즐겨찾기, 에이전트 이미지 생성과 조회",
    enPurpose: "Agent CRUD, summary lists, favorites, and agent image generation/readback"
  },
  builder: {
    koName: "대화형 빌더",
    enName: "Conversational builder",
    koPurpose: "대화형 에이전트 생성 세션, 메시지, resume, confirm, 빌더 이미지 조회",
    enPurpose: "Conversational build sessions, messages, resume, confirm, and builder images"
  },
  conversations: {
    koName: "대화",
    enName: "Conversations",
    koPurpose: "대화방, paginated 목록, 첫 메시지 시작, 메시지, SSE 스트리밍, resume/edit/regenerate, trace와 파일 조회",
    enPurpose: "Conversation rooms, paginated lists, first-message start, messages, SSE streaming, resume/edit/regenerate, traces, and files"
  },
  artifacts: {
    koName: "파일 아티팩트",
    enName: "File artifacts",
    koPurpose: "대화 실행으로 생성된 파일의 대화별 조회/삭제/download와 전체 파일 라이브러리, 즐겨찾기, 최근 파일, 통계",
    enPurpose: "Conversation-generated file lookup/delete/download plus the full file library, favorites, recent files, and stats"
  },
  assistant: {
    koName: "Fix 에이전트",
    enName: "Fix agent",
    koPurpose: "에이전트 설정 화면의 Fix 패널 메시지 전송",
    enPurpose: "Messages sent from the Fix panel in agent settings"
  },
  tools: {
    koName: "도구",
    enName: "Tools",
    koPurpose: "도구 타입 카탈로그, 사용자 도구 CRUD, 도구 실행",
    enPurpose: "Tool type catalog, user tool CRUD, and tool execution"
  },
  mcp: {
    koName: "MCP 서버",
    enName: "MCP servers",
    koPurpose: "MCP registry, 서버 등록/수정/테스트/탐색, import/export, 발견된 MCP 도구",
    enPurpose: "MCP registry, server CRUD/test/discovery, import/export, and discovered MCP tools"
  },
  skills: {
    koName: "스킬",
    enName: "Skills",
    koPurpose: "텍스트/패키지 스킬, 파일, credential requirement와 binding 관리",
    enPurpose: "Text/package skills, files, credential requirements, and bindings"
  },
  credentials: {
    koName: "자격증명",
    enName: "Credentials",
    koPurpose: "사용자/시스템 자격증명, credential type, 테스트, audit log, OAuth2 연결",
    enPurpose: "User/system credentials, credential types, testing, audit logs, and OAuth2 flows"
  },
  models: {
    koName: "모델",
    enName: "Models",
    koPurpose: "모델 카탈로그 CRUD, 등록 모델 테스트, 미저장 모델 preview test",
    enPurpose: "Model catalog CRUD, registered model tests, and unsaved preview tests"
  },
  memory: {
    koName: "메모리",
    enName: "Memory",
    koPurpose: "사용자/에이전트 메모리 정책, 저장된 메모리 CRUD, 메모리 제안 승인/수정 승인/거절",
    enPurpose: "User and agent memory policy, saved memory CRUD, and memory proposal approval/edit/rejection"
  },
  "system-llm-settings": {
    koName: "시스템 LLM",
    enName: "System LLM",
    koPurpose: "운영자용 빌더/Fix/image 역할별 시스템 LLM 설정",
    enPurpose: "Operator-managed System LLM settings for builder, Fix, and image roles"
  },
  middlewares: {
    koName: "미들웨어",
    enName: "Middleware",
    koPurpose: "에이전트에 연결할 수 있는 미들웨어 registry 조회",
    enPurpose: "Middleware registry entries that can be attached to agents"
  },
  triggers: {
    koName: "스케줄",
    enName: "Schedules",
    koPurpose: "에이전트 트리거 CRUD, 전체 트리거 조회, run-now, 실행 이력, 요약",
    enPurpose: "Agent trigger CRUD, global trigger listing, run-now, run history, and summary"
  },
  usage: {
    koName: "사용량",
    enName: "Usage",
    koPurpose: "사용자/에이전트/모델 기준 사용량 요약과 일별 비용 조회",
    enPurpose: "Usage summaries and daily spend by user, agent, or model"
  },
  marketplace: {
    koName: "마켓플레이스",
    enName: "Marketplace",
    koPurpose: "마켓플레이스 목록/상세, 설치, 업데이트, 게시, ACL, enable/disable, 운영자 listed 관리",
    enPurpose: "Marketplace listing/detail, install, update, publish, ACL, enable/disable, and admin listing controls"
  },
  shares: {
    koName: "공유 링크",
    enName: "Share links",
    koPurpose: "대화 공유 링크 생성/조회/폐기, 공개 공유 메시지와 공유 파일 아티팩트 조회",
    enPurpose: "Conversation share link create/read/revoke plus public shared message and file artifact reads"
  },
  templates: {
    koName: "템플릿",
    enName: "Templates",
    koPurpose: "에이전트 생성 템플릿 목록과 상세 조회",
    enPurpose: "Agent creation template list and detail reads"
  },
  uploads: {
    koName: "업로드",
    enName: "Uploads",
    koPurpose: "첨부 파일 업로드와 업로드 파일 조회",
    enPurpose: "Attachment uploads and uploaded file reads"
  },
  health: {
    koName: "상태 점검",
    enName: "Health checks",
    koPurpose: "MCP 서버와 모델 상태 점검, 이력 조회, 즉시 점검",
    enPurpose: "MCP server and model health checks, history, and immediate checks"
  },
  feedback: {
    koName: "피드백",
    enName: "Feedback",
    koPurpose: "메시지 피드백 생성/갱신/삭제와 대화별 피드백 조회",
    enPurpose: "Message feedback upsert/delete and conversation-level feedback reads"
  },
  untagged: {
    koName: "기타",
    enName: "Other",
    koPurpose: "태그가 없는 기본 health endpoint",
    enPurpose: "Untagged base health endpoint"
  }
};

const resourceKo = new Map([
  ["Agents", "에이전트"],
  ["Agent", "에이전트"],
  ["Agent Image", "에이전트 이미지"],
  ["Assistant Message", "Fix 에이전트 메시지"],
  ["Build Session", "빌더 세션"],
  ["Builder Image", "빌더 이미지"],
  ["Conversations", "대화"],
  ["Conversation", "대화"],
  ["Messages", "메시지"],
  ["Message", "메시지"],
  ["Debug Traces", "디버그 trace"],
  ["Debug Trace Detail", "디버그 trace 상세"],
  ["Conversation File", "대화 파일"],
  ["Traces", "trace"],
  ["Credential Types", "자격증명 타입"],
  ["Credential Type", "자격증명 타입"],
  ["Credentials", "자격증명"],
  ["Credential", "자격증명"],
  ["Audit Logs", "audit log"],
  ["Models", "모델"],
  ["System Credentials", "시스템 자격증명"],
  ["System Credential", "시스템 자격증명"],
  ["Feedback For Conversation", "대화 피드백"],
  ["Feedback", "피드백"],
  ["History", "상태 점검 이력"],
  ["Mcp Health", "MCP 상태"],
  ["Model Health", "모델 상태"],
  ["Items", "마켓플레이스 항목"],
  ["Item", "마켓플레이스 항목"],
  ["Versions", "버전"],
  ["Version", "버전"],
  ["Installation", "설치"],
  ["Item Acl", "항목 ACL"],
  ["Item Acl Entry", "항목 ACL 항목"],
  ["Registry Entries", "registry 항목"],
  ["Registry Entry", "registry 항목"],
  ["Servers", "MCP 서버"],
  ["Server", "MCP 서버"],
  ["All User Mcp Tools", "사용자 MCP 도구 전체"],
  ["Mcp Server", "MCP 서버"],
  ["Middlewares", "미들웨어"],
  ["Model", "모델"],
  ["Registered Model", "등록 모델"],
  ["Preview Model", "preview 모델"],
  ["Active Share", "활성 공유 링크"],
  ["Public Share Messages", "공개 공유 메시지"],
  ["Public Share", "공개 공유 링크"],
  ["Skills", "스킬"],
  ["Skill", "스킬"],
  ["Text Skill", "텍스트 스킬"],
  ["Text Content", "텍스트 콘텐츠"],
  ["Skill Credential Bindings", "스킬 자격증명 binding"],
  ["Skill Credential Binding", "스킬 자격증명 binding"],
  ["Skill Credential Requirements", "스킬 자격증명 requirement"],
  ["Skill Files", "스킬 파일"],
  ["Skill File", "스킬 파일"],
  ["Package Skill", "패키지 스킬"],
  ["System Llm Settings", "시스템 LLM 설정"],
  ["System Llm Setting", "시스템 LLM 설정"],
  ["Templates", "템플릿"],
  ["Template", "템플릿"],
  ["Tool Types", "도구 타입"],
  ["Tool Type", "도구 타입"],
  ["Tools", "도구"],
  ["Tool", "도구"],
  ["Agent Triggers", "에이전트 트리거"],
  ["Agent Trigger", "에이전트 트리거"],
  ["Trigger", "트리거"],
  ["Trigger Global", "전역 트리거"],
  ["Trigger Runs", "트리거 실행 이력"],
  ["All Triggers", "전체 트리거"],
  ["Daily Spend", "일별 비용"],
  ["Usage Summary", "사용량 요약"],
  ["Agent Usage", "에이전트 사용량"],
  ["Upload", "업로드 파일"],
  ["Audit Events", "활동 기록"],
  ["Deployment Candidates", "배포 후보"],
  ["Deployments", "배포"],
  ["Deployment", "배포"],
  ["Api Keys", "API 키"],
  ["Api Key", "API 키"],
  ["Public Agents", "공개 에이전트"],
  ["Thread", "thread"],
  ["Artifact Library Content", "파일 라이브러리 콘텐츠"],
  ["Artifact Library Item", "파일 라이브러리 항목"],
  ["Artifact Library Stats", "파일 라이브러리 통계"],
  ["Artifact Library", "파일 라이브러리"],
  ["Recent Artifacts", "최근 파일"],
  ["Conversation Artifact Content", "대화 파일 콘텐츠"],
  ["Conversation Artifact", "대화 파일"],
  ["Conversation Artifacts", "대화 파일"],
  ["Public Share Artifact Content", "공개 공유 파일 콘텐츠"],
  ["Public Share Artifact", "공개 공유 파일"],
  ["Public Share Artifacts", "공개 공유 파일"],
  ["User Memory Settings", "사용자 메모리 설정"],
  ["Agent Memory Settings", "에이전트 메모리 설정"],
  ["Memories", "메모리"],
  ["Memory", "메모리"],
  ["Memory Proposal", "메모리 제안"],
  ["Memory Proposals", "메모리 제안"],
  ["Avatar Image Endpoint", "아바타 이미지"],
  ["Profile Endpoint", "프로필"],
  ["Conversations Page", "대화 페이지"],
  ["Agent Summaries", "에이전트 요약"]
]);

const exactKo = new Map([
  ["Login Endpoint", "로그인"],
  ["Logout Endpoint", "로그아웃"],
  ["Me Endpoint", "현재 사용자 세션 조회"],
  ["Refresh Endpoint", "세션 refresh"],
  ["Register Endpoint", "회원가입"],
  ["Update Profile Endpoint", "프로필 업데이트"],
  ["Upload Avatar Image Endpoint", "아바타 이미지 업로드"],
  ["Get Avatar Image Endpoint", "아바타 이미지 조회"],
  ["Delete Avatar Image Endpoint", "아바타 이미지 삭제"],
  ["List Deployment Candidates", "배포 후보 목록 조회"],
  ["Create Deployment", "에이전트 API 배포 생성"],
  ["Update Deployment", "에이전트 API 배포 업데이트"],
  ["Create Api Key", "API 키 생성"],
  ["Revoke Api Key", "API 키 폐기"],
  ["Public Health", "공개 런타임 health 확인"],
  ["List Public Agents", "API 키가 호출 가능한 배포 에이전트 목록 조회"],
  ["Run Wait", "대기 실행"],
  ["Run Stream", "스트리밍 실행"],
  ["Create Thread", "thread 생성"],
  ["Thread Run Wait", "thread 대기 실행"],
  ["Thread Run Stream", "thread 스트리밍 실행"],
  ["Dify Chat Messages", "호환 채팅 메시지 실행"],
  ["Dify Workflow Run", "호환 workflow 실행"],
  ["Openai Chat Completions", "호환 chat completions 실행"],
  ["List Conversations Page", "대화 페이지 목록 조회"],
  ["Start Conversation With Message", "첫 메시지로 대화 시작"],
  ["Download Artifact Library Item", "파일 라이브러리 항목 다운로드"],
  ["Download Conversation Artifact", "대화 파일 다운로드"],
  ["Download Public Share Artifact", "공개 공유 파일 다운로드"],
  ["Record Artifact Opened", "파일 열람 기록"],
  ["Approve Memory Proposal", "메모리 제안 승인"],
  ["Edit And Approve Memory Proposal", "메모리 제안 수정 후 승인"],
  ["Reject Memory Proposal", "메모리 제안 거절"],
  ["Start Build", "대화형 빌더 세션 시작"],
  ["Post Message", "빌더 메시지 전송"],
  ["Send Message", "메시지 전송"],
  ["Send Assistant Message", "Fix 에이전트 메시지 전송"],
  ["Resume Message", "중단된 메시지 실행 재개"],
  ["Confirm Build", "빌더 결과 확정"],
  ["Edit Message", "메시지 수정 후 재실행"],
  ["Regenerate Message", "메시지 재생성"],
  ["Switch Branch", "대화 branch 전환"],
  ["Mark Conversation Read", "대화 읽음 처리"],
  ["Stream Resume", "SSE 스트림 재개"],
  ["Preview Test", "저장 전 자격증명 테스트"],
  ["Oauth2 Auth Start", "OAuth2 인증 시작"],
  ["Oauth2 Callback", "OAuth2 callback 처리"],
  ["Check Now", "상태 즉시 점검"],
  ["Admin Set Item Listed", "운영자 listed 상태 변경"],
  ["Admin K Skill Sync Status", "운영자 K-Skill 동기화 상태 갱신"],
  ["Update Installation", "설치 항목 업데이트"],
  ["Patch Item", "마켓플레이스 항목 일부 수정"],
  ["Replace Item Acl", "항목 ACL 교체"],
  ["Disable Item", "마켓플레이스 항목 비활성화"],
  ["Enable Item", "마켓플레이스 항목 활성화"],
  ["Install Item", "마켓플레이스 항목 설치"],
  ["Publish New Version", "스킬에서 새 버전 게시"],
  ["Publish Item From Skill", "스킬에서 마켓플레이스 항목 게시"],
  ["Create Server From Registry", "registry 항목으로 MCP 서버 생성"],
  ["Discover Server Tools", "MCP 서버 도구 탐색"],
  ["Probe Mcp Server", "MCP 서버 저장 전 probe"],
  ["Test Registered Model", "등록 모델 테스트"],
  ["Test Preview Model", "저장 전 모델 테스트"],
  ["Create Text Skill", "텍스트 스킬 생성"],
  ["Patch Skill Metadata", "스킬 메타데이터 일부 수정"],
  ["Put Text Content", "텍스트 스킬 본문 저장"],
  ["Put Skill Credential Binding", "스킬 자격증명 binding 저장"],
  ["Put Skill File", "스킬 파일 저장"],
  ["Upload Package Skill", "패키지 스킬 업로드"],
  ["Upload Skill File", "스킬 파일 업로드"],
  ["Update System Llm Setting", "시스템 LLM 설정 업데이트"],
  ["Run Tool Endpoint", "도구 실행"],
  ["Create Trigger", "트리거 생성"],
  ["Update Trigger Global", "전역 트리거 업데이트"],
  ["Run Trigger Now", "트리거 즉시 실행"],
  ["Trigger Summary", "트리거 요약"],
  ["Health Check", "기본 health 확인"],
  ["Create Upload", "파일 업로드"],
  ["Get Upload", "업로드 파일 조회"]
]);

function translateResource(text) {
  return resourceKo.get(text) ?? text;
}

function summaryKo(summary) {
  if (!summary) return "OpenAPI operation";
  if (exactKo.has(summary)) return exactKo.get(summary);

  const patterns = [
    [/^List (.+)$/, (name) => `${translateResource(name)} 목록 조회`],
    [/^Get (.+)$/, (name) => `${translateResource(name)} 조회`],
    [/^Create (.+)$/, (name) => `${translateResource(name)} 생성`],
    [/^Update (.+)$/, (name) => `${translateResource(name)} 업데이트`],
    [/^Patch (.+)$/, (name) => `${translateResource(name)} 일부 수정`],
    [/^Delete (.+)$/, (name) => `${translateResource(name)} 삭제`],
    [/^Clear (.+)$/, (name) => `${translateResource(name)} 삭제`],
    [/^Upsert (.+)$/, (name) => `${translateResource(name)} 생성 또는 갱신`],
    [/^Discover (.+)$/, (name) => `${translateResource(name)} 탐색`],
    [/^Test (.+)$/, (name) => `${translateResource(name)} 테스트`],
    [/^Generate (.+)$/, (name) => `${translateResource(name)} 생성`],
    [/^Serve (.+)$/, (name) => `${translateResource(name)} 제공`],
    [/^Toggle (.+)$/, (name) => `${translateResource(name)} 전환`],
    [/^Import (.+)$/, (name) => `${translateResource(name)} 가져오기`],
    [/^Export (.+)$/, (name) => `${translateResource(name)} 내보내기`],
    [/^Revoke (.+)$/, (name) => `${translateResource(name)} 폐기`]
  ];

  for (const [pattern, render] of patterns) {
    const match = summary.match(pattern);
    if (match) return render(match[1]);
  }
  return summary;
}

function escapeCell(value) {
  return String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, "<br />");
}

function opEntries() {
  const entries = [];
  for (const [route, methods] of Object.entries(spec.paths ?? {})) {
    for (const [method, operation] of Object.entries(methods)) {
      const upper = method.toUpperCase();
      if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(upper)) continue;
      entries.push({
        tag: operation.tags?.[0] ?? "untagged",
        method: upper,
        route,
        summary: operation.summary ?? "",
        operationId: operation.operationId ?? ""
      });
    }
  }
  return entries.sort((a, b) => {
    const tagA = tagOrder.indexOf(a.tag);
    const tagB = tagOrder.indexOf(b.tag);
    const normalizedTagA = tagA === -1 ? 999 : tagA;
    const normalizedTagB = tagB === -1 ? 999 : tagB;
    return (
      normalizedTagA - normalizedTagB ||
      a.route.localeCompare(b.route) ||
      (methodOrder[a.method] ?? 99) - (methodOrder[b.method] ?? 99)
    );
  });
}

const entries = opEntries();
const byTag = new Map();
for (const entry of entries) {
  if (!byTag.has(entry.tag)) byTag.set(entry.tag, []);
  byTag.get(entry.tag).push(entry);
}

function groupRows(locale) {
  const rows = [
    "| Group | Endpoints | Description |",
    "| --- | ---: | --- |"
  ];
  for (const [tag, groupEntries] of byTag) {
    const meta = groupMeta[tag] ?? {
      koName: tag,
      enName: tag,
      koPurpose: "OpenAPI tag group",
      enPurpose: "OpenAPI tag group"
    };
    rows.push(
      locale === "ko"
        ? `| \`${tag}\` (${meta.koName}) | ${groupEntries.length} | ${meta.koPurpose} |`
        : `| \`${tag}\` (${meta.enName}) | ${groupEntries.length} | ${meta.enPurpose} |`
    );
  }
  return rows.join("\n");
}

function endpointSections(locale) {
  const sections = [];
  for (const [tag, groupEntries] of byTag) {
    const meta = groupMeta[tag] ?? {
      koName: tag,
      enName: tag,
      koPurpose: "OpenAPI tag group",
      enPurpose: "OpenAPI tag group"
    };
    sections.push(
      locale === "ko"
        ? `## ${meta.koName}\n\n${meta.koPurpose}입니다.`
        : `## ${meta.enName}\n\n${meta.enPurpose}.`
    );
    sections.push("");
    sections.push("| Method | Endpoint | Description |");
    sections.push("| --- | --- | --- |");
    for (const entry of groupEntries) {
      const description = locale === "ko" ? summaryKo(entry.summary) : entry.summary || entry.operationId;
      sections.push(
        `| \`${entry.method}\` | \`${escapeCell(entry.route)}\` | ${escapeCell(description)} |`
      );
    }
    sections.push("");
  }
  return sections.join("\n");
}

function page(locale) {
  const isKo = locale === "ko";
  const title = isKo ? "백엔드 API 전체 목록" : "Backend API endpoint list";
  const description = isKo
    ? "Moldy 백엔드 OpenAPI 스냅샷 기준으로 전체 REST endpoint를 그룹별로 정리합니다."
    : "A grouped list of every Moldy backend REST endpoint from the OpenAPI snapshot.";
  const sourceRel = "src/openapi/moldy-openapi.json";
  return `---
title: ${title}
description: ${description}
---

${isKo
  ? `이 문서는 실행 중인 Moldy 백엔드의 \`/openapi.json\`에서 저장한 \`${sourceRel}\`를 기준으로 생성했습니다. 현재 스냅샷에는 ${entries.length}개의 endpoint가 있습니다.`
  : `This page is generated from \`${sourceRel}\`, which is saved from the running Moldy backend's \`/openapi.json\`. The current snapshot contains ${entries.length} endpoints.`}

<Info>
${isKo
  ? "스키마, request body, response body의 상세 필드는 API Reference 탭의 OpenAPI 뷰에서 확인하세요. 이 페이지는 전체 API 표면을 빠르게 훑기 위한 색인입니다."
  : "Use the API Reference tab for request and response schemas. This page is a quick index of the full API surface."}
</Info>

## ${isKo ? "읽는 법" : "How to read this list"}

${isKo
  ? "- 대부분의 `/api/*` endpoint는 로그인 세션이 필요합니다. 상태를 변경하는 요청은 브라우저 앱 기준 CSRF 헤더도 함께 보냅니다.\n- `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, `/api/health`, 공개 공유 링크 조회 endpoint는 세션이 없을 때도 호출될 수 있습니다.\n- 운영자 전용 기능은 시스템 자격증명, 시스템 LLM, 마켓플레이스 운영자 관리처럼 UI에서도 운영자 메뉴로 노출되는 영역입니다."
  : "- Most `/api/*` endpoints require a logged-in session. State-changing browser requests also send a CSRF header.\n- `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, `/api/health`, and public share reads can be called without an active app session.\n- Operator-only APIs map to operator UI areas such as system credentials, System LLM, and marketplace moderation."}

## ${isKo ? "그룹 요약" : "Group summary"}

${groupRows(locale)}

${endpointSections(locale)}
`;
}

for (const locale of ["ko", "en"]) {
  const output = path.join(ROOT, "src", "hancom", "moldy", locale, "api-endpoints.mdx");
  await ensureDir(path.dirname(output));
  await fs.writeFile(output, page(locale));
  console.log(`Wrote ${output}`);
}

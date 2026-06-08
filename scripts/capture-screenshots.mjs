import fs from "node:fs/promises";
import path from "node:path";

import { chromium } from "@playwright/test";

import { API_BASE, APP_BASE, ROOT, ensureDir, readDotEnv } from "./lib.mjs";

const requestedLocale = process.argv.find((arg) => arg.startsWith("--locale="))?.split("=")[1];
const locales = requestedLocale ? [requestedLocale] : ["ko", "en"];
const env = await readDotEnv();

if (!env.USER_ID || !env.USER_PW) {
  throw new Error("Missing USER_ID or USER_PW in .env");
}

const screenshots = [
  { name: "login", public: true, path: "/login", waitFor: /로그인|Log in/i },
  { name: "register", public: true, path: "/register", waitFor: /회원가입|Sign up/i },
  { name: "dashboard", path: "/", waitFor: /새 에이전트|New Agent/i },
  { name: "agent-create", path: "/agents/new", waitFor: /무엇을 만들고 싶으세요|What do you want to build/i },
  { name: "agent-create-conversational", path: "/agents/new/conversational", waitFor: /자연어로 에이전트 만들기|Build an agent/i },
  { name: "agent-create-manual", path: "/agents/new/manual", waitFor: /저장|Save/i },
  { name: "agent-templates", path: "/agents/new/template", waitFor: /템플릿으로 시작하기|Start from a template/i },
  { name: "tools", path: "/tools", waitFor: /도구|Tools/i },
  { name: "mcp-servers", path: "/mcp-servers", waitFor: /MCP 서버|MCP Servers/i },
  { name: "skills", path: "/skills", waitFor: /스킬|Skills/i },
  { name: "marketplace", path: "/marketplace", waitFor: /마켓플레이스|Marketplace/i },
  { name: "marketplace-moderation", path: "/marketplace/admin/moderation", waitFor: /운영자 관리|Moderation|마켓플레이스/i },
  { name: "credentials", path: "/credentials", waitFor: /자격증명|Credentials/i },
  { name: "settings", path: "/settings", waitFor: /프로필|Profile/i },
  { name: "settings-memory", path: "/settings/memory", waitFor: /메모리|Memory/i },
  { name: "settings-security", path: "/settings/security", waitFor: /보안|Security/i },
  { name: "settings-appearance", path: "/settings/appearance", waitFor: /화면 및 언어|Appearance/i },
  { name: "settings-agent-api", path: "/settings/agent-api", waitFor: /Agent API/i },
  { name: "settings-artifacts", path: "/settings/artifacts", waitFor: /파일|Files/i },
  { name: "settings-audit", path: "/settings/audit", waitFor: /활동 기록|Activity Log/i },
  { name: "settings-admin-audit", path: "/settings/admin-audit", waitFor: /전체 활동|All Activity/i },
  { name: "artifacts", path: "/artifacts", waitFor: /파일|Files/i },
  { name: "system-credentials", path: "/settings/system-credentials", waitFor: /시스템 자격증명|System Credentials/i },
  { name: "system-llm", path: "/settings/system-llm", waitFor: /System LLM|시스템 LLM/i },
  { name: "models", path: "/models", waitFor: /모델|Models/i },
  { name: "schedules", path: "/schedules", waitFor: /스케줄|Schedules/i },
  { name: "usage", path: "/usage", waitFor: /사용량|Usage/i }
];

async function currentUser(page) {
  return page.evaluate(async (apiBase) => {
    const response = await fetch(`${apiBase}/api/auth/me`, { credentials: "include" });
    if (!response.ok) return {};
    return response.json();
  }, API_BASE);
}

async function apiJson(page, route) {
  return page.evaluate(
    async ({ apiBase, route }) => {
      const response = await fetch(`${apiBase}${route}`, { credentials: "include" });
      if (!response.ok) return null;
      return response.json();
    },
    { apiBase: API_BASE, route }
  );
}

async function buildMaskData(page, locale, user) {
  const agents = (await apiJson(page, "/api/agents")) ?? [];
  const mcpServers = (await apiJson(page, "/api/mcp-servers")) ?? [];
  const credentials = (await apiJson(page, "/api/credentials")) ?? [];
  const systemCredentials = (await apiJson(page, "/api/system-credentials")) ?? [];
  const artifactsPage = (await apiJson(page, "/api/artifacts?limit=50")) ?? {};
  const memories = (await apiJson(page, "/api/memories")) ?? [];

  return {
    locale,
    user,
    agents: Array.isArray(agents) ? agents : [],
    mcpServers: Array.isArray(mcpServers) ? mcpServers : [],
    credentials: Array.isArray(credentials) ? credentials : [],
    systemCredentials: Array.isArray(systemCredentials) ? systemCredentials : [],
    artifacts: Array.isArray(artifactsPage?.items) ? artifactsPage.items : [],
    memories: Array.isArray(memories) ? memories : []
  };
}

async function maskPage(page, maskData) {
  await page.addStyleTag({
    content: `
      [aria-label="Open Next.js Dev Tools"],
      nextjs-portal,
      [data-nextjs-dev-tools-button],
      [data-testid="nextjs-dev-tools-button"] {
        display: none !important;
      }
    `
  });

  await page.evaluate((maskData) => {
    const user = maskData?.user ?? {};
    const isKo = maskData?.locale !== "en";
    const replacements = [
      [user?.email, "admin@example.com"],
      [user?.name, "문서 관리자"],
      [user?.name?.slice?.(0, 2), "문서"],
      [/([A-Z0-9._%+-]+)@([A-Z0-9.-]+\.[A-Z]{2,})/gi, "admin@example.com"],
      [/https?:\/\/[^\s)]+/g, "https://example.com/..."],
      [/sk-[A-Za-z0-9_-]{12,}/g, "sk-...masked"],
      [/\$\d+(?:\.\d+)?/g, "$--"],
      [/\b\d+(?:\.\d+)?M\b/g, "--"],
      [/\b\d+(?:\.\d+)?K\b/g, "--"]
    ].filter(([from]) => Boolean(from));

    for (const [index, agent] of (maskData?.agents ?? []).entries()) {
      replacements.push([agent?.name, `${isKo ? "샘플 에이전트" : "Sample Agent"} ${index + 1}`]);
      replacements.push([
        agent?.description,
        isKo
          ? "문서 캡처용 예시 에이전트입니다. 실제 업무 데이터는 포함하지 않습니다."
          : "Example agent for documentation screenshots. No real work data is included."
      ]);
    }

    for (const [index, server] of (maskData?.mcpServers ?? []).entries()) {
      replacements.push([server?.name, `${isKo ? "샘플 MCP 서버" : "Sample MCP Server"} ${index + 1}`]);
      replacements.push([
        server?.description,
        isKo ? "문서 캡처용 MCP 서버입니다." : "Example MCP server for documentation."
      ]);
    }

    for (const [index, credential] of [
      ...(maskData?.credentials ?? []),
      ...(maskData?.systemCredentials ?? [])
    ].entries()) {
      replacements.push([
        credential?.name,
        `${isKo ? "샘플 자격증명" : "Sample Credential"} ${index + 1}`
      ]);
    }

    for (const [index, artifact] of (maskData?.artifacts ?? []).entries()) {
      replacements.push([
        artifact?.display_name,
        `${isKo ? "샘플 파일" : "Sample File"} ${index + 1}`
      ]);
      replacements.push([artifact?.path, `sample/file-${index + 1}.md`]);
      replacements.push([artifact?.conversation_title, isKo ? "샘플 대화" : "Sample conversation"]);
    }

    for (const [index, memory] of (maskData?.memories ?? []).entries()) {
      replacements.push([
        memory?.content,
        `${isKo ? "문서 캡처용 샘플 메모리" : "Sample memory for documentation"} ${index + 1}`
      ]);
      replacements.push([
        memory?.reason,
        isKo ? "문서 캡처용 예시" : "Documentation screenshot example"
      ]);
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      let text = node.nodeValue ?? "";
      for (const [from, to] of replacements) {
        text = typeof from === "string" ? text.split(from).join(to) : text.replace(from, to);
      }
      node.nodeValue = text;
    }
  }, maskData);
}

async function login(page) {
  await page.goto(`${APP_BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.getByRole("textbox", { name: /이메일|Email/i }).fill(env.USER_ID);
  await page.getByRole("textbox", { name: /비밀번호|Password/i }).fill(env.USER_PW);
  await page.getByRole("button", { name: /로그인|Log in/i }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20_000 });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
}

async function captureStatic(page, locale, item, maskData) {
  await page.goto(`${APP_BASE}${item.path}`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 12_000 }).catch(() => {});
  if (item.waitFor) {
    await page.getByText(item.waitFor).first().waitFor({ timeout: 12_000 }).catch(() => {});
  }
  await maskPage(page, maskData);
  await page.screenshot({
    path: path.join(ROOT, "src", "images", "hancom", "moldy", locale, `${item.name}.png`),
    fullPage: true,
    animations: "disabled"
  });
}

async function clickTab(page, label) {
  const tab = page.getByRole("tab", { name: label }).first();
  await tab.waitFor({ timeout: 12_000 });
  await tab.click();
  await page.waitForTimeout(700);
}

async function captureConversationalBuilderProgress(page, locale, maskData) {
  const initialMessage =
    locale === "ko"
      ? "문서 캡처용 주간 사용량 요약 에이전트를 만들어줘. 사용량을 확인하고 핵심 지표를 표로 정리하는 역할이면 돼."
      : "Create a documentation sample agent that summarizes weekly usage and presents the key metrics in a table.";

  await page.goto(
    `${APP_BASE}/agents/new/conversational?initialMessage=${encodeURIComponent(initialMessage)}`,
    { waitUntil: "domcontentloaded" }
  );
  await page.waitForLoadState("networkidle", { timeout: 12_000 }).catch(() => {});
  await page
    .getByText(/Phase Timeline|단계 완료|complete|Phase 2|의도 분석|intent analysis/i)
    .first()
    .waitFor({ timeout: 90_000 })
    .catch(() => {});
  await page.waitForTimeout(1_500);
  await maskPage(page, maskData);
  await page.screenshot({
    path: path.join(
      ROOT,
      "src",
      "images",
      "hancom",
      "moldy",
      locale,
      "agent-create-conversational-progress.png"
    ),
    fullPage: true,
    animations: "disabled"
  });
}

async function captureAgentSettingsTabs(page, locale, firstAgent, maskData) {
  if (!firstAgent?.id) return;

  const outputDir = path.join(ROOT, "src", "images", "hancom", "moldy", locale);
  await page.goto(`${APP_BASE}/agents/${firstAgent.id}/settings`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 12_000 }).catch(() => {});
  await maskPage(page, maskData);
  await page.screenshot({
    path: path.join(outputDir, "agent-settings.png"),
    fullPage: true,
    animations: "disabled"
  });

  const tabs = [
    { name: "agent-settings-opener", label: /오프너|Opener/i },
    { name: "agent-settings-schedule", label: /스케줄|Schedules?/i },
    { name: "agent-settings-settings", label: /^설정$|^Settings$/i }
  ];

  for (const item of tabs) {
    await clickTab(page, item.label);
    await maskPage(page, maskData);
    await page.screenshot({
      path: path.join(outputDir, `${item.name}.png`),
      fullPage: true,
      animations: "disabled"
    });
  }

  await clickTab(page, /비주얼|Visual/i);
  await page.waitForTimeout(1_000);
  await maskPage(page, maskData);
  await page.screenshot({
    path: path.join(outputDir, "agent-settings-visual.png"),
    fullPage: true,
    animations: "disabled"
  });
}

async function captureAgentPages(page, locale, maskData) {
  const firstAgent = Array.isArray(maskData.agents) ? maskData.agents[0] : null;
  if (!firstAgent?.id) return;

  const agentPages = [
    { name: "agent-chat", path: `/agents/${firstAgent.id}` },
    { name: "agent-visual-settings", path: `/agents/${firstAgent.id}/visual-settings` }
  ];

  for (const item of agentPages) {
    await page.goto(`${APP_BASE}${item.path}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 12_000 }).catch(() => {});
    await maskPage(page, maskData);
    await page.screenshot({
      path: path.join(ROOT, "src", "images", "hancom", "moldy", locale, `${item.name}.png`),
      fullPage: true,
      animations: "disabled"
    });
  }
  await captureAgentSettingsTabs(page, locale, firstAgent, maskData);
}

for (const locale of locales) {
  if (!["ko", "en"].includes(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  const outputDir = path.join(ROOT, "src", "images", "hancom", "moldy", locale);
  await ensureDir(outputDir);

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    locale: locale === "ko" ? "ko-KR" : "en-US"
  });
  await context.addCookies([{ name: "moldy_locale", value: locale, domain: "localhost", path: "/" }]);

  const page = await context.newPage();
  for (const item of screenshots.filter((entry) => entry.public)) {
    await captureStatic(page, locale, item, {});
  }

  await login(page);
  const user = await currentUser(page);
  const maskData = await buildMaskData(page, locale, user);
  await captureConversationalBuilderProgress(page, locale, maskData);
  for (const item of screenshots.filter((entry) => !entry.public)) {
    await captureStatic(page, locale, item, maskData);
  }
  await captureAgentPages(page, locale, maskData);
  await browser.close();
  console.log(`Captured ${locale} screenshots in ${outputDir}`);
}

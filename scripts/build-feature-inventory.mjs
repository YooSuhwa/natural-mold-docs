import fs from "node:fs/promises";
import path from "node:path";

import { API_BASE, NATURAL_MOLD_ROOT, ROOT, ensureDir } from "./lib.mjs";

const appDir = path.join(NATURAL_MOLD_ROOT, "frontend", "src", "app");
const output = path.join(ROOT, "planning", "feature-inventory.md");

async function listRoutes(dir, prefix = "") {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const routes = [];
  const hasPage = entries.some((entry) => entry.isFile() && entry.name === "page.tsx");
  if (hasPage) {
    const normalized = prefix
      .replace(/\(auth\)\//g, "")
      .replace(/\(auth\)/g, "")
      .replace(/\/+/g, "/")
      .replace(/\/$/, "");
    routes.push(normalized ? `/${normalized}` : "/");
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("_")) continue;
    routes.push(...(await listRoutes(path.join(dir, entry.name), path.join(prefix, entry.name))));
  }
  return routes;
}

const response = await fetch(`${API_BASE}/openapi.json`);
if (!response.ok) {
  throw new Error(`Failed to fetch OpenAPI from ${API_BASE}: ${response.status}`);
}
const openapi = await response.json();

const apiRows = [];
for (const [route, methods] of Object.entries(openapi.paths ?? {})) {
  for (const [method, operation] of Object.entries(methods)) {
    if (method.startsWith("x-")) continue;
    apiRows.push({
      method: method.toUpperCase(),
      route,
      tag: operation.tags?.[0] ?? "untagged",
      summary: operation.summary ?? ""
    });
  }
}

const routes = [...new Set(await listRoutes(appDir))].sort();
const routeToDocs = {
  "/": "ko/index, en/index",
  "/artifacts": "ko/files-artifacts, en/files-artifacts",
  "/agents/[agentId]": "ko/chat-with-agent, en/chat-with-agent",
  "/agents/[agentId]/conversations/[conversationId]": "ko/chat-with-agent, en/chat-with-agent",
  "/agents/[agentId]/conversations/[conversationId]/traces": "ko/chat-with-agent, ko/api-chat-streaming, en/chat-with-agent, en/api-chat-streaming",
  "/agents/[agentId]/settings": "ko/agent-settings, en/agent-settings",
  "/agents/[agentId]/visual-settings": "ko/agent-settings, en/agent-settings",
  "/login": "ko/accounts-login, en/accounts-login",
  "/register": "ko/accounts-login, en/accounts-login",
  "/settings": "ko/settings, ko/accounts-login, en/settings, en/accounts-login",
  "/settings/admin/audit": "ko/settings, ko/access-oversight, en/settings, en/access-oversight",
  "/settings/admin-audit": "ko/settings, ko/access-oversight, en/settings, en/access-oversight",
  "/settings/agent-api": "ko/agent-api, ko/api-auth, en/agent-api, en/api-auth",
  "/settings/appearance": "ko/settings, ko/accounts-login, en/settings, en/accounts-login",
  "/settings/artifacts": "ko/files-artifacts, ko/settings, en/files-artifacts, en/settings",
  "/settings/audit": "ko/settings, ko/access-oversight, en/settings, en/access-oversight",
  "/settings/credentials": "ko/models-credentials, ko/settings, en/models-credentials, en/settings",
  "/settings/marketplace-admin": "ko/marketplace, ko/access-oversight, ko/settings, en/marketplace, en/access-oversight, en/settings",
  "/settings/memory": "ko/memory, ko/settings, en/memory, en/settings",
  "/settings/models": "ko/models-credentials, ko/settings, en/models-credentials, en/settings",
  "/settings/schedules": "ko/schedules, ko/settings, en/schedules, en/settings",
  "/settings/security": "ko/settings, ko/api-auth, en/settings, en/api-auth",
  "/settings/usage": "ko/usage, ko/settings, en/usage, en/settings",
  "/agents/new": "ko/create-first-agent, en/create-first-agent",
  "/agents/new/conversational": "ko/create-first-agent, en/create-first-agent",
  "/agents/new/manual": "ko/create-first-agent, en/create-first-agent",
  "/agents/new/template": "ko/create-first-agent, en/create-first-agent",
  "/tools": "ko/tools, en/tools",
  "/mcp-servers": "ko/mcp-servers, en/mcp-servers",
  "/skills": "ko/skills, en/skills",
  "/credentials": "ko/models-credentials, ko/settings, en/models-credentials, en/settings",
  "/settings/system-credentials": "ko/operator-setup, ko/models-credentials, ko/settings, en/operator-setup, en/models-credentials, en/settings",
  "/settings/system-llm": "ko/system-llm, ko/settings, en/system-llm, en/settings",
  "/models": "ko/models-credentials, ko/settings, en/models-credentials, en/settings",
  "/schedules": "ko/schedules, ko/settings, en/schedules, en/settings",
  "/usage": "ko/usage, ko/settings, en/usage, en/settings",
  "/marketplace": "ko/marketplace, en/marketplace",
  "/marketplace/[item-id]": "ko/marketplace, ko/marketplace-install-publish, en/marketplace, en/marketplace-install-publish",
  "/marketplace/admin/moderation": "ko/marketplace, ko/access-oversight, ko/settings, en/marketplace, en/access-oversight, en/settings",
  "/shared/[shareId]": "ko/chat-with-agent, ko/access-oversight, en/chat-with-agent, en/access-oversight"
};

const routeAccess = {
  "/login": "Public",
  "/register": "Public",
  "/shared/[shareId]": "Public share token",
  "/settings/admin/audit": "Operator",
  "/settings/admin-audit": "Operator",
  "/settings/marketplace-admin": "Operator",
  "/settings/system-credentials": "Operator",
  "/settings/system-llm": "Operator",
  "/marketplace/admin/moderation": "Operator",
  default: "Authenticated user"
};

const routeTests = {
  "/": "frontend/tests/pages/dashboard.test.tsx",
  "/artifacts": "backend/tests/test_artifacts_router.py, backend/tests/test_artifact_service.py",
  "/agents/[agentId]": "frontend/tests/pages/agent-detail.test.tsx",
  "/agents/[agentId]/conversations/[conversationId]": "frontend/tests/pages/chat.test.tsx",
  "/agents/[agentId]/conversations/[conversationId]/traces": "frontend/tests/components/chat/trace-debugger-view.test.tsx",
  "/agents/[agentId]/settings": "frontend/tests/pages/agent-settings.test.tsx",
  "/agents/[agentId]/visual-settings": "frontend/tests/pages/agent-settings.test.tsx",
  "/agents/new": "frontend/tests/pages/agents-new.test.tsx",
  "/agents/new/conversational": "frontend/tests/pages/agents-new.test.tsx",
  "/agents/new/manual": "frontend/tests/pages/agents-new.test.tsx",
  "/agents/new/template": "frontend/tests/pages/agents-new-template.test.tsx",
  "/credentials": "frontend/tests/pages/credentials.test.tsx",
  "/marketplace": "frontend/tests/pages/marketplace.test.tsx",
  "/marketplace/[item-id]": "frontend/tests/pages/marketplace-detail.test.tsx",
  "/marketplace/admin/moderation": "frontend/tests/pages/marketplace.test.tsx",
  "/mcp-servers": "frontend/tests/pages/mcp-servers.test.tsx",
  "/models": "frontend/tests/pages/models.test.tsx",
  "/schedules": "frontend/tests/pages/schedules.test.tsx",
  "/settings": "frontend/tests/pages/settings.test.tsx",
  "/settings/admin/audit": "backend/tests/test_audit_events.py",
  "/settings/admin-audit": "backend/tests/test_audit_events.py",
  "/settings/agent-api": "frontend/tests/pages/settings.test.tsx, backend/tests/test_agent_api_control_plane.py",
  "/settings/appearance": "frontend/tests/pages/settings.test.tsx",
  "/settings/artifacts": "backend/tests/test_artifacts_router.py, backend/tests/test_artifact_service.py",
  "/settings/audit": "backend/tests/test_audit_events.py",
  "/settings/credentials": "frontend/tests/pages/credentials.test.tsx",
  "/settings/marketplace-admin": "frontend/tests/pages/admin-settings.test.tsx",
  "/settings/memory": "frontend/tests/pages/settings.test.tsx, backend/tests/test_memory_router.py",
  "/settings/models": "frontend/tests/pages/models.test.tsx",
  "/settings/schedules": "frontend/tests/pages/schedules.test.tsx",
  "/settings/security": "frontend/tests/pages/settings.test.tsx",
  "/settings/system-credentials": "frontend/tests/pages/admin-settings.test.tsx",
  "/settings/system-llm": "frontend/tests/pages/admin-settings.test.tsx",
  "/settings/usage": "frontend/tests/pages/usage.test.tsx",
  "/skills": "frontend/tests/pages/skills.test.tsx",
  "/tools": "frontend/tests/pages/tools.test.tsx",
  "/usage": "frontend/tests/pages/usage.test.tsx"
};

const capturedRoutes = new Set([
  "/",
  "/artifacts",
  "/agents/[agentId]",
  "/agents/[agentId]/settings",
  "/agents/[agentId]/visual-settings",
  "/agents/new",
  "/agents/new/conversational",
  "/agents/new/manual",
  "/agents/new/template",
  "/credentials",
  "/login",
  "/register",
  "/settings",
  "/settings/admin-audit",
  "/settings/agent-api",
  "/settings/appearance",
  "/settings/artifacts",
  "/settings/audit",
  "/settings/credentials",
  "/settings/marketplace-admin",
  "/settings/memory",
  "/settings/models",
  "/settings/schedules",
  "/settings/security",
  "/settings/usage",
  "/marketplace",
  "/marketplace/admin/moderation",
  "/mcp-servers",
  "/models",
  "/schedules",
  "/settings/system-credentials",
  "/settings/system-llm",
  "/skills",
  "/tools",
  "/usage"
]);

const lines = [
  "# Moldy Feature Inventory",
  "",
  `Generated from \`${NATURAL_MOLD_ROOT}\` frontend routes and \`${API_BASE}/openapi.json\`.`,
  "",
  "## Frontend routes",
  "",
  "| Route | Related area | Access | Supported now | Document? | Capture? | Related test | Korean / English docs |",
  "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ...routes.map((route) => {
    const docs = routeToDocs[route] ?? "Reference only";
    const area = route.split("/").filter(Boolean)[0] || "dashboard";
    const access = routeAccess[route] ?? routeAccess.default;
    const document = docs === "Reference only" ? "No" : "Yes";
    const capture = capturedRoutes.has(route) ? "Yes" : "No";
    const test = routeTests[route] ?? "No direct page test found";
    return `| \`${route}\` | ${area} | ${access} | Yes | ${document} | ${capture} | ${test} | ${docs} |`;
  }),
  "",
  "## API endpoints",
  "",
  "| Tag | Method | Path | Summary |",
  "| --- | --- | --- | --- |",
  ...apiRows
    .sort((a, b) => `${a.tag}${a.route}${a.method}`.localeCompare(`${b.tag}${b.route}${b.method}`))
    .map((row) => `| ${row.tag} | \`${row.method}\` | \`${row.route}\` | ${row.summary} |`),
  ""
];

await ensureDir(path.dirname(output));
await fs.writeFile(output, `${lines.join("\n")}\n`);
console.log(`Wrote ${output}`);

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

import { chromium } from "@playwright/test";

import { APP_BASE, NATURAL_MOLD_ROOT, ROOT, ensureDir, readDotEnv } from "./lib.mjs";

const FRONTEND_ROOT = path.join(NATURAL_MOLD_ROOT, "frontend");
const TEMP_ROUTE_DIR = path.join(FRONTEND_ROOT, "src", "app", "docs-capture-internal");
const TEMP_ROUTE_FILE = path.join(TEMP_ROUTE_DIR, "page.tsx");
const TEMP_LAYOUT_FILE = path.join(TEMP_ROUTE_DIR, "layout.tsx");
const TEMP_PUBLIC_DIR = path.join(FRONTEND_ROOT, "public", "__docs-capture");
const requestedLocale = process.argv.find((arg) => arg.startsWith("--locale="))?.split("=")[1];
const locales = requestedLocale ? [requestedLocale] : ["ko", "en"];
const prepareOnly = process.argv.includes("--prepare-only");
const skipPrepare = process.argv.includes("--skip-prepare");
const keepTemp = prepareOnly || process.argv.includes("--keep-temp");
const productRequire = createRequire(path.join(FRONTEND_ROOT, "package.json"));

if (!locales.every((locale) => ["ko", "en"].includes(locale))) {
  throw new Error(`Unsupported locale: ${locales.join(", ")}`);
}

const chatCaptureIds = [
  "chat-inline-markdown",
  "chat-inline-code",
  "chat-inline-mermaid",
  "chat-inline-katex",
  "chat-inline-image",
  "chat-inline-plan",
  "chat-inline-search",
  "chat-inline-file-read",
  "chat-inline-file-write",
  "chat-inline-file-edit",
  "chat-inline-generic-tool",
  "chat-inline-approval",
  "chat-inline-user-input",
  "chat-inline-memory",
  "chat-inline-sub-agent",
  "chat-inline-deep-research",
  "chat-inline-builder-recommendation",
  "chat-inline-builder-prompt",
  "chat-inline-builder-image-choice",
  "chat-inline-builder-image-approval",
  "chat-inline-builder-draft-config",
  "chat-inline-builder-draft-approval",
];

const artifactCaptureIds = [
  "artifact-viewer-image",
  "artifact-viewer-audio",
  "artifact-viewer-video",
  "artifact-viewer-pdf",
  "artifact-viewer-html",
  "artifact-viewer-markdown",
  "artifact-viewer-mermaid",
  "artifact-viewer-csv",
  "artifact-viewer-json",
  "artifact-viewer-yaml",
  "artifact-viewer-code",
  "artifact-viewer-text",
  "artifact-viewer-docx",
  "artifact-viewer-xlsx",
  "artifact-viewer-pptx",
  "artifact-viewer-hwpx",
  "artifact-viewer-fallback",
];

const routeSource = String.raw`
'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocale } from 'next-intl'
import { HiTLContext } from '@/lib/chat/hitl-context'
import { ChatConversationContext } from '@/components/chat/conversation-context'
import { MarkdownContent } from '@/components/chat/markdown-content'
import { getArtifactPreviewProvider } from '@/components/chat/artifacts/preview-registry'
import { ToolFallbackPanel } from '@/components/chat/tool-ui/generic-tool-ui'
import { PlanToolUI } from '@/components/chat/tool-ui/plan-tool-ui'
import { UserInputUI } from '@/components/chat/tool-ui/user-input-ui'
import { ApprovalCard } from '@/components/chat/tool-ui/approval-card'
import { WebSearchToolUI } from '@/components/chat/tool-ui/search-tool-ui'
import { ReadFileToolUI, WriteFileToolUI, EditFileToolUI } from '@/components/chat/tool-ui/code-tool-ui'
import { ProposeMemoryToolUI } from '@/components/chat/tool-ui/memory-tool-ui'
import { SubAgentToolUI } from '@/components/chat/tool-ui/sub-agent-ui'
import { DeepResearchSummaryToolUI } from '@/components/chat/tool-ui/deep-research-summary-ui'
import { RecommendationApprovalToolUI } from '@/components/chat/tool-ui/recommendation-approval-ui'
import { PromptApprovalToolUI } from '@/components/chat/tool-ui/prompt-approval-ui'
import { ImageChoiceToolUI, ImageApprovalToolUI } from '@/components/chat/tool-ui/image-generation-ui'
import { DraftConfigCardToolUI, DraftApprovalToolUI } from '@/components/chat/tool-ui/draft-config-ui'
import type { ArtifactSummary, ArtifactTextContent } from '@/lib/types'

type ToolUI = {
  unstable_tool?: {
    render: (props: Record<string, unknown>) => ReactNode
  }
}

const now = '2026-06-08T00:00:00.000Z'
const transparentPixel =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
const inlineImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ecfdf5"/><stop offset="1" stop-color="#dbeafe"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="170" cy="145" r="64" fill="#10b981" opacity=".88"/><rect x="270" y="94" width="220" height="28" rx="14" fill="#0f172a" opacity=".82"/><rect x="270" y="146" width="150" height="22" rx="11" fill="#334155" opacity=".42"/><rect x="80" y="250" width="460" height="34" rx="17" fill="#ffffff" opacity=".76"/><text x="270" y="210" font-family="Inter,Arial" font-size="36" fill="#0f172a" font-weight="700">Moldy Artifact</text></svg>',
  )

function text(locale: string, ko: string, en: string): string {
  return locale === 'ko' ? ko : en
}

function renderTool(ui: ToolUI, props: Record<string, unknown>) {
  return ui.unstable_tool?.render(props) ?? null
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">{children}</div>
    </section>
  )
}

function CaptureCard({
  id,
  title,
  children,
  wide = false,
}: {
  id: string
  title: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <article
      data-capture-id={id}
      className={wide ? 'xl:col-span-2' : undefined}
    >
      <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </div>
        <div className="max-w-3xl">{children}</div>
      </div>
    </article>
  )
}

function ToolCapture({
  id,
  title,
  ui,
  props,
  wide,
}: {
  id: string
  title: string
  ui: ToolUI
  props: Record<string, unknown>
  wide?: boolean
}) {
  return (
    <CaptureCard id={id} title={title} wide={wide}>
      {renderTool(ui, props)}
    </CaptureCard>
  )
}

function artifact(
  id: string,
  displayName: string,
  artifactKind: ArtifactSummary['artifact_kind'],
  extension: string | null,
  mimeType: string,
  previewUrl: string,
): ArtifactSummary {
  return {
    id,
    agent_id: 'docs-agent',
    conversation_id: 'docs-conversation',
    assistant_msg_id: 'docs-message',
    run_id: 'docs-run',
    tool_call_id: 'docs-tool-call',
    source_tool_name: 'execute_in_skill',
    path: 'docs/' + displayName,
    display_name: displayName,
    mime_type: mimeType,
    extension,
    artifact_kind: artifactKind,
    size_bytes: 4096,
    sha256: 'docs-capture',
    status: 'ready',
    is_favorite: false,
    preview_count: 0,
    download_count: 0,
    version_id: id + '-v1',
    version_number: 1,
    created_at: now,
    updated_at: now,
    agent_name: 'Docs Capture Agent',
    conversation_title: 'Docs Capture Conversation',
    url: previewUrl,
    preview_url: previewUrl,
    download_url: previewUrl,
  }
}

function textContent(textValue: string, mimeType: string): ArtifactTextContent {
  return {
    text: textValue,
    truncated: false,
    mime_type: mimeType,
    size_bytes: textValue.length,
  }
}

function ArtifactCapture({
  id,
  title,
  artifact,
  content,
  wide,
}: {
  id: string
  title: string
  artifact: ArtifactSummary
  content?: ArtifactTextContent
  wide?: boolean
}) {
  const provider = getArtifactPreviewProvider(artifact)
  return (
    <CaptureCard id={id} title={title} wide={wide}>
      <div className="rounded-md border border-border/60 bg-card p-3">
        {provider.render({
          artifact,
          textContent: content ?? null,
          isLoadingText: false,
        })}
      </div>
    </CaptureCard>
  )
}

export default function DocsCapturePage() {
  const locale = useLocale()
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const asset = (name: string) => (origin ? origin + '/__docs-capture/' + name : transparentPixel)
  const hiTL = useMemo(
    () => ({
      onResumeDecisions: async () => {},
      registerDecision: async () => {},
    }),
    [],
  )

  const markdown = text(
    locale,
    '### 주간 요약\n\n- 활성 에이전트 4개\n- 생성 파일 12개\n\n| 항목 | 값 |\n| --- | ---: |\n| 성공률 | 98% |\n| 평균 응답 | 3.2초 |',
    '### Weekly Summary\n\n- 4 active agents\n- 12 generated files\n\n| Metric | Value |\n| --- | ---: |\n| Success rate | 98% |\n| Avg response | 3.2s |',
  )
  const fence = String.fromCharCode(96, 96, 96)
  const codeBlock =
    fence + 'ts\nexport async function summarize(agentId: string) {\n  return runAgent(agentId, { mode: "weekly" })\n}\n' + fence
  const mermaid = fence + 'mermaid\nflowchart LR\n  User --> Agent\n  Agent --> Tool\n  Tool --> Artifact\n' + fence
  const katex = text(locale, '총 사용량은 $C = p \\times t$ 로 계산합니다.', 'Total cost is calculated as $C = p \\times t$.')
  const imageMarkdown = '![Moldy generated preview](' + inlineImage + ')'

  const baseStatus = { type: 'complete' }
  const pendingStatus = { type: 'requires-action' }

  if (!origin) {
    return <main className="p-8 text-sm text-muted-foreground">Preparing docs capture...</main>
  }

  return (
    <ChatConversationContext.Provider value="docs-conversation">
      <HiTLContext.Provider value={hiTL}>
        <main data-docs-capture-ready="true" className="min-h-screen overflow-auto bg-muted/30 p-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <header>
              <h1 className="text-2xl font-semibold text-foreground">Moldy Docs Capture</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Real Moldy components rendered for documentation screenshots.
              </p>
            </header>

            <Section title="Chat inline components">
              <CaptureCard id="chat-inline-markdown" title="Markdown">
                <MarkdownContent content={markdown} />
              </CaptureCard>
              <CaptureCard id="chat-inline-code" title="Code block">
                <MarkdownContent content={codeBlock} />
              </CaptureCard>
              <CaptureCard id="chat-inline-mermaid" title="Mermaid">
                <MarkdownContent content={mermaid} />
              </CaptureCard>
              <CaptureCard id="chat-inline-katex" title="KaTeX">
                <MarkdownContent content={katex} />
              </CaptureCard>
              <CaptureCard id="chat-inline-image" title="Inline image">
                <MarkdownContent content={imageMarkdown} />
              </CaptureCard>
              <ToolCapture
                id="chat-inline-plan"
                title="Plan / write_todos"
                ui={PlanToolUI}
                props={{
                  args: {
                    todos: [
                      { content: text(locale, '요구사항 확인', 'Confirm requirements'), status: 'completed' },
                      { content: text(locale, '실제 UI 캡처', 'Capture real UI'), status: 'in_progress' },
                      { content: text(locale, '문서 반영', 'Update docs'), status: 'pending' },
                    ],
                  },
                  status: baseStatus,
                }}
              />
              <ToolCapture
                id="chat-inline-search"
                title="Search result"
                ui={WebSearchToolUI}
                props={{
                  args: { query: 'Moldy artifact viewer' },
                  result: {
                    results: [
                      {
                        title: 'Moldy artifact viewer guide',
                        url: 'https://example.com/moldy/artifacts',
                        content: text(locale, '파일 미리보기와 다운로드 흐름을 설명합니다.', 'Explains file preview and download flows.'),
                      },
                      {
                        title: 'Generated document workflow',
                        url: 'https://example.com/moldy/documents',
                        content: text(locale, 'DOCX, XLSX, PPTX, HWPX 뷰어 예시입니다.', 'Examples for DOCX, XLSX, PPTX, and HWPX viewers.'),
                      },
                    ],
                  },
                  status: baseStatus,
                }}
              />
              <ToolCapture
                id="chat-inline-file-read"
                title="Read file"
                ui={ReadFileToolUI}
                props={{
                  args: { file_path: '/workspace/report.md' },
                  result: '# Report\n\nGenerated by Moldy.\n',
                  status: baseStatus,
                }}
              />
              <ToolCapture
                id="chat-inline-file-write"
                title="Write file"
                ui={WriteFileToolUI}
                props={{
                  args: {
                    file_path: '/workspace/summary.json',
                    content: '{\n  "status": "ready",\n  "files": 4\n}',
                  },
                  status: baseStatus,
                }}
              />
              <ToolCapture
                id="chat-inline-file-edit"
                title="Edit file"
                ui={EditFileToolUI}
                props={{
                  args: {
                    file_path: '/workspace/guide.md',
                    old_string: '- Old menu label',
                    new_string: '- Updated menu label',
                  },
                  status: baseStatus,
                }}
              />
              <CaptureCard id="chat-inline-generic-tool" title="Generic tool">
                <ToolFallbackPanel
                  toolName="custom_report_tool"
                  args={{ format: 'markdown', includeArtifacts: true }}
                  result={{ status: 'ok', artifacts: ['weekly-summary.md'] }}
                  status="complete"
                  toolCallId="docs-generic-tool"
                />
              </CaptureCard>
              <ToolCapture
                id="chat-inline-approval"
                title="Approval"
                ui={ApprovalCard}
                props={{
                  args: {
                    approval_id: 'docs-approval',
                    tool_name: 'write_file',
                    tool_args: { file_path: '/workspace/final-guide.md', overwrite: true },
                    description: text(locale, '파일을 덮어쓰기 전에 확인이 필요합니다.', 'Confirm before overwriting the file.'),
                    timeout_seconds: 300,
                  },
                  status: pendingStatus,
                  addResult: () => {},
                }}
              />
              <ToolCapture
                id="chat-inline-user-input"
                title="User input"
                ui={UserInputUI}
                props={{
                  args: {
                    approval_id: 'docs-user-input',
                    title: text(locale, '문서 범위 선택', 'Choose documentation scope'),
                    question: text(locale, '이번 업데이트에 어떤 항목을 포함할까요?', 'What should this update include?'),
                    options: [
                      { label: text(locale, '채팅 컴포넌트', 'Chat components'), description: text(locale, '인라인 카드와 도구 UI', 'Inline cards and tool UI') },
                      { label: text(locale, '아티팩트 뷰어', 'Artifact viewers'), description: text(locale, '파일별 preview 화면', 'Per-file previews') },
                      { label: text(locale, 'FAQ', 'FAQ'), description: text(locale, '사용자 질문 보강', 'Add user questions') },
                    ],
                    timeout_seconds: 300,
                  },
                  status: pendingStatus,
                }}
              />
              <ToolCapture
                id="chat-inline-memory"
                title="Memory proposal"
                ui={ProposeMemoryToolUI}
                props={{
                  args: {
                    scope: 'user',
                    content: text(locale, '사용자는 한국어 설명과 실제 화면 캡처를 선호합니다.', 'User prefers Korean explanations and real UI screenshots.'),
                    reason: text(locale, '문서 작성 요청에서 반복적으로 언급됨', 'Repeatedly mentioned in documentation requests'),
                  },
                  result: {
                    memory_event: 'memory_proposed',
                    scope: 'user',
                    content: text(locale, '사용자는 한국어 설명과 실제 화면 캡처를 선호합니다.', 'User prefers Korean explanations and real UI screenshots.'),
                    reason: text(locale, '문서 작성 요청에서 반복적으로 언급됨', 'Repeatedly mentioned in documentation requests'),
                  },
                  status: baseStatus,
                  addResult: () => {},
                }}
              />
              <ToolCapture
                id="chat-inline-sub-agent"
                title="Sub-agent"
                ui={SubAgentToolUI}
                props={{
                  args: {
                    agent_name: text(locale, '문서 검토 에이전트', 'Docs Review Agent'),
                    input: text(locale, '새 가이드의 누락된 메뉴와 기능을 점검해줘.', 'Check missing menus and features in the new guide.'),
                  },
                  status: baseStatus,
                  toolCallId: 'docs-sub-agent',
                }}
              />
              <ToolCapture
                id="chat-inline-deep-research"
                title="Deep research summary"
                ui={DeepResearchSummaryToolUI}
                props={{
                  args: {
                    title: text(locale, '문서 근거 조사', 'Documentation Evidence Research'),
                    total_count: 2,
                    completed_count: 2,
                    source_count: 5,
                    duration_ms: 7400,
                    domains: ['docs.example.com', 'github.com', 'moldy.local'],
                    searches: [
                      {
                        tool_call_id: 'search-1',
                        query: 'Moldy artifact viewer support matrix',
                        result_count: 3,
                        sources: [
                          { title: 'Artifact preview providers', url: 'https://example.com/providers', domain: 'docs.example.com' },
                        ],
                      },
                      {
                        tool_call_id: 'search-2',
                        query: 'Moldy chat inline components',
                        result_count: 2,
                        sources: [
                          { title: 'Chat Tool UI registry', url: 'https://example.com/chat', domain: 'github.com' },
                        ],
                      },
                    ],
                  },
                  status: baseStatus,
                }}
              />
              <ToolCapture
                id="chat-inline-builder-recommendation"
                title="Builder recommendation"
                ui={RecommendationApprovalToolUI}
                props={{
                  args: {
                    phase: 3,
                    title: text(locale, '추천 도구 검토', 'Review Recommended Tools'),
                    item_kind: 'tool',
                    summary: text(locale, '문서 생성 에이전트에 필요한 도구를 추천했습니다.', 'Recommended tools for the documentation agent.'),
                    items: [
                      { tool_name: 'web_search', reason: text(locale, '최신 문서 근거 확인', 'Find current documentation evidence'), kind: 'tool' },
                      { tool_name: 'write_file', reason: text(locale, '가이드 파일 생성', 'Generate guide files'), kind: 'tool' },
                    ],
                  },
                  status: pendingStatus,
                }}
                wide
              />
              <ToolCapture
                id="chat-inline-builder-prompt"
                title="Builder prompt approval"
                ui={PromptApprovalToolUI}
                props={{
                  args: {
                    phase: 5,
                    title: text(locale, '시스템 프롬프트 검토', 'Review System Prompt'),
                    system_prompt: text(locale, '당신은 Moldy 사용자를 돕는 문서 작성 에이전트입니다. 실제 화면과 API 근거를 기준으로 답합니다.', 'You are a documentation agent for Moldy users. Answer from real screens and API evidence.'),
                    summary: text(locale, '최종 저장 전 프롬프트를 확인합니다.', 'Review before saving the final prompt.'),
                  },
                  status: pendingStatus,
                }}
                wide
              />
              <ToolCapture
                id="chat-inline-builder-image-choice"
                title="Builder image choice"
                ui={ImageChoiceToolUI}
                props={{
                  args: {
                    phase: 6,
                    title: text(locale, '에이전트 이미지 선택', 'Choose Agent Image'),
                    auto_prompt: text(locale, '민트색 문서 카드와 작은 로봇 아이콘이 있는 친근한 업무용 아바타', 'A friendly work avatar with mint document cards and a small robot icon'),
                    available: true,
                  },
                  status: pendingStatus,
                }}
              />
              <ToolCapture
                id="chat-inline-builder-image-approval"
                title="Builder image approval"
                ui={ImageApprovalToolUI}
                props={{
                  args: {
                    phase: 6,
                    title: text(locale, '생성 이미지 확인', 'Confirm Generated Image'),
                    image_url: inlineImage,
                    prompt: text(locale, '문서 작성 에이전트용 민트색 아바타', 'Mint avatar for a documentation agent'),
                  },
                  status: pendingStatus,
                }}
              />
              <ToolCapture
                id="chat-inline-builder-draft-config"
                title="Builder draft config"
                ui={DraftConfigCardToolUI}
                props={{
                  args: {
                    phase: 7,
                    title: text(locale, 'Draft 설정 미리보기', 'Draft Configuration Preview'),
                    image_url: inlineImage,
                    draft: {
                      name: 'Docs Guide Agent',
                      name_ko: text(locale, '가이드 문서 에이전트', 'Docs Guide Agent'),
                      description: text(locale, '기능 변경을 확인하고 문서를 최신 상태로 유지합니다.', 'Keeps docs aligned with feature changes.'),
                      tools: ['web_search', 'write_file'],
                      middlewares: ['human_approval'],
                    },
                  },
                  status: baseStatus,
                }}
                wide
              />
              <ToolCapture
                id="chat-inline-builder-draft-approval"
                title="Builder final approval"
                ui={DraftApprovalToolUI}
                props={{
                  args: {
                    phase: 8,
                    title: text(locale, '최종 설정 승인', 'Final Configuration Approval'),
                    image_url: inlineImage,
                    summary: text(locale, '이 설정으로 에이전트를 생성합니다.', 'Create the agent with this configuration.'),
                    draft: {
                      name: 'Docs Guide Agent',
                      name_ko: text(locale, '가이드 문서 에이전트', 'Docs Guide Agent'),
                      description: text(locale, '완성한 가이드 문서를 만들고 계속 업데이트합니다.', 'Creates and updates complete guide docs.'),
                      tools: ['web_search', 'write_file', 'read_file'],
                      middlewares: ['human_approval'],
                    },
                  },
                  status: pendingStatus,
                }}
                wide
              />
            </Section>

            <Section title="Artifact viewers">
              <ArtifactCapture
                id="artifact-viewer-image"
                title="Image viewer"
                artifact={artifact('artifact-image', 'moldy-preview.png', 'image', 'png', 'image/png', inlineImage)}
              />
              <ArtifactCapture
                id="artifact-viewer-audio"
                title="Audio viewer"
                artifact={artifact('artifact-audio', 'moldy-audio.mp3', 'audio', 'mp3', 'audio/mpeg', asset('silent.mp3'))}
              />
              <ArtifactCapture
                id="artifact-viewer-video"
                title="Video viewer"
                artifact={artifact('artifact-video', 'moldy-video.mp4', 'video', 'mp4', 'video/mp4', asset('sample.mp4'))}
              />
              <ArtifactCapture
                id="artifact-viewer-pdf"
                title="PDF viewer"
                artifact={artifact('artifact-pdf', 'moldy-report.pdf', 'pdf', 'pdf', 'application/pdf', asset('sample.pdf'))}
                wide
              />
              <ArtifactCapture
                id="artifact-viewer-html"
                title="HTML viewer"
                artifact={artifact('artifact-html', 'moldy-page.html', 'html', 'html', 'text/html', asset('sample.html'))}
                content={textContent('<main style="font-family:Inter,Arial;padding:24px"><h1>Moldy HTML Artifact</h1><p>Sandboxed preview for generated HTML.</p><button>Preview only</button></main>', 'text/html')}
                wide
              />
              <ArtifactCapture
                id="artifact-viewer-markdown"
                title="Markdown viewer"
                artifact={artifact('artifact-markdown', 'moldy-guide.md', 'markdown', 'md', 'text/markdown', asset('sample.md'))}
                content={textContent(markdown, 'text/markdown')}
              />
              <ArtifactCapture
                id="artifact-viewer-mermaid"
                title="Mermaid viewer"
                artifact={artifact('artifact-mermaid', 'moldy-flow.mmd', 'code', 'mmd', 'text/plain', asset('sample.mmd'))}
                content={textContent('flowchart LR\n  Draft --> Review\n  Review --> Publish', 'text/plain')}
              />
              <ArtifactCapture
                id="artifact-viewer-csv"
                title="CSV viewer"
                artifact={artifact('artifact-csv', 'moldy-usage.csv', 'data', 'csv', 'text/csv', asset('sample.csv'))}
                content={textContent('metric,value\nAgents,4\nArtifacts,12\nSuccess Rate,98%', 'text/csv')}
              />
              <ArtifactCapture
                id="artifact-viewer-json"
                title="JSON viewer"
                artifact={artifact('artifact-json', 'moldy-run.json', 'data', 'json', 'application/json', asset('sample.json'))}
                content={textContent('{"status":"ready","artifacts":[{"name":"guide.md","kind":"markdown"},{"name":"report.docx","kind":"document"}]}', 'application/json')}
              />
              <ArtifactCapture
                id="artifact-viewer-yaml"
                title="YAML/TOML viewer"
                artifact={artifact('artifact-yaml', 'moldy-config.yaml', 'data', 'yaml', 'application/yaml', asset('sample.yaml'))}
                content={textContent('agent:\n  name: Docs Guide Agent\n  memory: ask\n  tools:\n    - web_search\n    - write_file', 'application/yaml')}
              />
              <ArtifactCapture
                id="artifact-viewer-code"
                title="Code viewer"
                artifact={artifact('artifact-code', 'moldy-helper.ts', 'code', 'ts', 'text/typescript', asset('sample.ts'))}
                content={textContent('export const guideStatus = { ready: true, screenshots: 39 }', 'text/typescript')}
              />
              <ArtifactCapture
                id="artifact-viewer-text"
                title="Text viewer"
                artifact={artifact('artifact-text', 'moldy-run.log', 'other', 'log', 'text/plain', asset('sample.log'))}
                content={textContent('[info] artifact ready\n[info] viewer selected: markdown\n[done] docs capture complete', 'text/plain')}
              />
              <ArtifactCapture
                id="artifact-viewer-docx"
                title="DOCX viewer"
                artifact={artifact('artifact-docx', 'moldy-report.docx', 'document', 'docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', asset('sample.docx'))}
                wide
              />
              <ArtifactCapture
                id="artifact-viewer-xlsx"
                title="XLSX viewer"
                artifact={artifact('artifact-xlsx', 'moldy-usage.xlsx', 'document', 'xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', asset('sample.xlsx'))}
                wide
              />
              <ArtifactCapture
                id="artifact-viewer-pptx"
                title="PPTX viewer"
                artifact={artifact('artifact-pptx', 'moldy-brief.pptx', 'document', 'pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', asset('sample.pptx'))}
                wide
              />
              <ArtifactCapture
                id="artifact-viewer-hwpx"
                title="HWPX viewer"
                artifact={artifact('artifact-hwpx', 'moldy-patent.hwpx', 'document', 'hwpx', 'application/hwp+zip', asset('sample.hwpx'))}
                wide
              />
              <ArtifactCapture
                id="artifact-viewer-fallback"
                title="Fallback download"
                artifact={artifact('artifact-fallback', 'moldy-model.step', 'cad', 'step', 'model/step', asset('sample.step'))}
              />
            </Section>
          </div>
        </main>
      </HiTLContext.Provider>
    </ChatConversationContext.Provider>
  )
}
`;

const layoutSource = String.raw`
import type { ReactNode } from 'react'
import { ScopedIntlProvider } from '@/i18n/scoped-messages'

const DOCS_CAPTURE_MESSAGE_NAMESPACES = ['agent', 'artifacts', 'chat', 'model', 'usage'] as const

export default function DocsCaptureLayout({ children }: { children: ReactNode }) {
  return (
    <ScopedIntlProvider namespaces={DOCS_CAPTURE_MESSAGE_NAMESPACES}>
      {children}
    </ScopedIntlProvider>
  )
}
`;

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function makeDocx(outputFile) {
  const JSZip = productRequire("jszip");
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  );
  zip.folder("_rels").file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );
  zip.folder("word").file(
    "document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Moldy 문서 생성 검증 보고서</w:t></w:r></w:p>
    <w:p><w:r><w:t>Actual DOCX preview rendered by the Moldy artifact viewer.</w:t></w:r></w:p>
    <w:tbl>
      <w:tr><w:tc><w:p><w:r><w:t>Format</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>DOCX</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:p><w:r><w:t>Status</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>Ready</w:t></w:r></w:p></w:tc></w:tr>
    </w:tbl>
    <w:sectPr/>
  </w:body>
</w:document>`
  );
  await fs.writeFile(outputFile, await zip.generateAsync({ type: "nodebuffer" }));
}

async function makeXlsx(outputFile) {
  const XLSX = productRequire("xlsx");
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet([
    ["검증요약", "값"],
    ["Artifacts", 12],
    ["Viewer", "JS runner"],
    ["Status", "Ready"],
  ]);
  XLSX.utils.book_append_sheet(workbook, sheet, "검증요약");
  XLSX.writeFile(workbook, outputFile);
}

async function makePptx(outputFile) {
  const JSZip = productRequire("jszip");
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
</Types>`
  );
  zip.folder("_rels").file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`
  );
  zip.folder("ppt").file(
    "presentation.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldSz cx="12192000" cy="6858000" type="wide"/>
  <p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst>
</p:presentation>`
  );
  zip.folder("ppt").folder("_rels").file(
    "presentation.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
</Relationships>`
  );
  zip.folder("ppt").folder("slides").file(
    "slide1.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="914400" y="1143000"/><a:ext cx="10058400" cy="1371600"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
        <p:txBody>
          <a:bodyPr/><a:lstStyle/>
          <a:p><a:r><a:rPr lang="ko-KR" sz="4200" b="1"/><a:t>Moldy Artifact Viewer</a:t></a:r></a:p>
          <a:p><a:r><a:rPr lang="en-US" sz="2400"/><a:t>PPTX preview rendered in the real viewer.</a:t></a:r></a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>`
  );
  await fs.writeFile(outputFile, await zip.generateAsync({ type: "nodebuffer" }));
}

async function makePdf(outputFile) {
  const body = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 86 >> stream
BT /F1 24 Tf 72 720 Td (Moldy PDF Artifact) Tj 0 -36 Td /F1 12 Tf (Actual PDF iframe preview.) Tj ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000239 00000 n 
0000000425 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
495
%%EOF`;
  await fs.writeFile(outputFile, body);
}

async function prepareTemporaryCaptureFiles() {
  await ensureDir(TEMP_ROUTE_DIR);
  await ensureDir(TEMP_PUBLIC_DIR);
  await fs.writeFile(TEMP_ROUTE_FILE, routeSource);
  await fs.writeFile(TEMP_LAYOUT_FILE, layoutSource);
  await makeDocx(path.join(TEMP_PUBLIC_DIR, "sample.docx"));
  await makeXlsx(path.join(TEMP_PUBLIC_DIR, "sample.xlsx"));
  await makePptx(path.join(TEMP_PUBLIC_DIR, "sample.pptx"));
  await makePdf(path.join(TEMP_PUBLIC_DIR, "sample.pdf"));
  await fs.writeFile(path.join(TEMP_PUBLIC_DIR, "sample.html"), "<h1>Moldy HTML Artifact</h1>");
  await fs.writeFile(path.join(TEMP_PUBLIC_DIR, "sample.md"), "# Moldy Markdown Artifact\n");
  await fs.writeFile(path.join(TEMP_PUBLIC_DIR, "sample.mmd"), "flowchart LR\nA --> B\n");
  await fs.writeFile(path.join(TEMP_PUBLIC_DIR, "sample.csv"), "metric,value\nArtifacts,12\n");
  await fs.writeFile(path.join(TEMP_PUBLIC_DIR, "sample.json"), '{"status":"ready"}\n');
  await fs.writeFile(path.join(TEMP_PUBLIC_DIR, "sample.yaml"), "status: ready\n");
  await fs.writeFile(path.join(TEMP_PUBLIC_DIR, "sample.ts"), "export const ready = true\n");
  await fs.writeFile(path.join(TEMP_PUBLIC_DIR, "sample.log"), "[done] ready\n");
  await fs.writeFile(path.join(TEMP_PUBLIC_DIR, "sample.step"), "ISO-10303-21;\nEND-ISO-10303-21;\n");
  await fs.writeFile(path.join(TEMP_PUBLIC_DIR, "silent.mp3"), Buffer.alloc(0));
  await fs.writeFile(path.join(TEMP_PUBLIC_DIR, "sample.mp4"), Buffer.alloc(0));

  const hwpxTemplate = path.join(
    NATURAL_MOLD_ROOT,
    "backend",
    "app",
    "seed",
    "system_skill_packages",
    "patent-hwpx-generator",
    "assets",
    "template.hwpx"
  );
  if (await fileExists(hwpxTemplate)) {
    await fs.copyFile(hwpxTemplate, path.join(TEMP_PUBLIC_DIR, "sample.hwpx"));
  } else {
    await fs.writeFile(path.join(TEMP_PUBLIC_DIR, "sample.hwpx"), Buffer.alloc(0));
  }
}

async function cleanupTemporaryCaptureFiles() {
  await fs.rm(TEMP_ROUTE_DIR, { recursive: true, force: true });
  await fs.rm(TEMP_PUBLIC_DIR, { recursive: true, force: true });
}

async function login(page, env) {
  if (!env.USER_ID || !env.USER_PW) {
    throw new Error("Missing USER_ID or USER_PW in .env");
  }
  await page.goto(`${APP_BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.getByRole("textbox", { name: /이메일|Email/i }).fill(env.USER_ID);
  await page.getByRole("textbox", { name: /비밀번호|Password/i }).fill(env.USER_PW);
  await page.getByRole("button", { name: /로그인|Log in/i }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20_000 });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
}

async function ensureAppReachable() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(APP_BASE, { signal: controller.signal });
    if (response.status >= 500) {
      throw new Error(`Moldy app responded with ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      `Moldy frontend is not reachable at ${APP_BASE}. Start the product frontend before running capture:ui. ${error instanceof Error ? error.message : String(error)}`
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function captureLocale(locale, env) {
  const outputDir = path.join(ROOT, "src", "images", "hancom", "moldy", locale);
  await ensureDir(outputDir);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 1,
    locale: locale === "ko" ? "ko-KR" : "en-US",
  });
  await context.addCookies([{ name: "moldy_locale", value: locale, domain: "localhost", path: "/" }]);
  const page = await context.newPage();
  await login(page, env);
  await context.addCookies([{ name: "moldy_locale", value: locale, domain: "localhost", path: "/" }]);
  await page.goto(`${APP_BASE}/docs-capture-internal`, { waitUntil: "domcontentloaded" });
  await page.locator('[data-docs-capture-ready="true"]').waitFor({ timeout: 30_000 });
  await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(3000);

  for (const id of [...chatCaptureIds, ...artifactCaptureIds]) {
    const locator = page.locator(`[data-capture-id="${id}"]`).first();
    await locator.scrollIntoViewIfNeeded();
    await locator.screenshot({
      path: path.join(outputDir, `${id}.png`),
      animations: "disabled",
    });
  }

  await browser.close();
  console.log(`Captured real UI reference images for ${locale} in ${outputDir}`);
}

const env = await readDotEnv();
if (!skipPrepare) {
  await prepareTemporaryCaptureFiles();
}
if (prepareOnly) {
  console.log(`Prepared temporary capture route at ${TEMP_ROUTE_FILE}`);
  console.log(`Prepared temporary capture assets in ${TEMP_PUBLIC_DIR}`);
  process.exit(0);
}
try {
  await ensureAppReachable();
  for (const locale of locales) {
    await captureLocale(locale, env);
  }
} finally {
  if (!keepTemp) {
    await cleanupTemporaryCaptureFiles();
  }
}

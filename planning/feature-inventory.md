# Moldy Feature Inventory

Generated from `/Users/chester/dev/ref/natural-mold` frontend routes and `http://localhost:8001/openapi.json`.

## Frontend routes

| Route | Related area | Access | Supported now | Document? | Capture? | Related test | Korean / English docs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | dashboard | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/dashboard.test.tsx | ko/index, en/index |
| `/agents/[agentId]` | agents | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/agent-detail.test.tsx | ko/chat-with-agent, en/chat-with-agent |
| `/agents/[agentId]/conversations/[conversationId]` | agents | Authenticated user | Yes | Yes | No | frontend/tests/pages/chat.test.tsx | ko/chat-with-agent, en/chat-with-agent |
| `/agents/[agentId]/conversations/[conversationId]/traces` | agents | Authenticated user | Yes | Yes | No | frontend/tests/components/chat/trace-debugger-view.test.tsx | ko/chat-with-agent, ko/api-chat-streaming, en/chat-with-agent, en/api-chat-streaming |
| `/agents/[agentId]/settings` | agents | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/agent-settings.test.tsx | ko/agent-settings, en/agent-settings |
| `/agents/[agentId]/visual-settings` | agents | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/agent-settings.test.tsx | ko/agent-settings, en/agent-settings |
| `/agents/new` | agents | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/agents-new.test.tsx | ko/create-first-agent, en/create-first-agent |
| `/agents/new/conversational` | agents | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/agents-new.test.tsx | ko/create-first-agent, en/create-first-agent |
| `/agents/new/manual` | agents | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/agents-new.test.tsx | ko/create-first-agent, en/create-first-agent |
| `/agents/new/template` | agents | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/agents-new-template.test.tsx | ko/create-first-agent, en/create-first-agent |
| `/artifacts` | artifacts | Authenticated user | Yes | Yes | Yes | backend/tests/test_artifacts_router.py, backend/tests/test_artifact_service.py | ko/files-artifacts, en/files-artifacts |
| `/credentials` | credentials | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/credentials.test.tsx | ko/models-credentials, ko/settings, en/models-credentials, en/settings |
| `/login` | login | Public | Yes | Yes | Yes | No direct page test found | ko/accounts-login, en/accounts-login |
| `/marketplace` | marketplace | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/marketplace.test.tsx | ko/marketplace, en/marketplace |
| `/marketplace/[item-id]` | marketplace | Authenticated user | Yes | Yes | No | frontend/tests/pages/marketplace-detail.test.tsx | ko/marketplace, ko/marketplace-install-publish, en/marketplace, en/marketplace-install-publish |
| `/marketplace/admin/moderation` | marketplace | Operator | Yes | Yes | Yes | frontend/tests/pages/marketplace.test.tsx | ko/marketplace, ko/access-oversight, ko/settings, en/marketplace, en/access-oversight, en/settings |
| `/mcp-servers` | mcp-servers | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/mcp-servers.test.tsx | ko/mcp-servers, en/mcp-servers |
| `/models` | models | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/models.test.tsx | ko/models-credentials, ko/settings, en/models-credentials, en/settings |
| `/register` | register | Public | Yes | Yes | Yes | No direct page test found | ko/accounts-login, en/accounts-login |
| `/schedules` | schedules | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/schedules.test.tsx | ko/schedules, ko/settings, en/schedules, en/settings |
| `/settings` | settings | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/settings.test.tsx | ko/settings, ko/accounts-login, en/settings, en/accounts-login |
| `/settings/admin-audit` | settings | Operator | Yes | Yes | Yes | backend/tests/test_audit_events.py | ko/settings, ko/access-oversight, en/settings, en/access-oversight |
| `/settings/admin/audit` | settings | Operator | Yes | Yes | No | backend/tests/test_audit_events.py | ko/settings, ko/access-oversight, en/settings, en/access-oversight |
| `/settings/agent-api` | settings | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/settings.test.tsx, backend/tests/test_agent_api_control_plane.py | ko/agent-api, ko/api-auth, en/agent-api, en/api-auth |
| `/settings/appearance` | settings | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/settings.test.tsx | ko/settings, ko/accounts-login, en/settings, en/accounts-login |
| `/settings/artifacts` | settings | Authenticated user | Yes | Yes | Yes | backend/tests/test_artifacts_router.py, backend/tests/test_artifact_service.py | ko/files-artifacts, ko/settings, en/files-artifacts, en/settings |
| `/settings/audit` | settings | Authenticated user | Yes | Yes | Yes | backend/tests/test_audit_events.py | ko/settings, ko/access-oversight, en/settings, en/access-oversight |
| `/settings/credentials` | settings | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/credentials.test.tsx | ko/models-credentials, ko/settings, en/models-credentials, en/settings |
| `/settings/marketplace-admin` | settings | Operator | Yes | Yes | Yes | frontend/tests/pages/admin-settings.test.tsx | ko/marketplace, ko/access-oversight, ko/settings, en/marketplace, en/access-oversight, en/settings |
| `/settings/memory` | settings | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/settings.test.tsx, backend/tests/test_memory_router.py | ko/memory, ko/settings, en/memory, en/settings |
| `/settings/models` | settings | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/models.test.tsx | ko/models-credentials, ko/settings, en/models-credentials, en/settings |
| `/settings/schedules` | settings | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/schedules.test.tsx | ko/schedules, ko/settings, en/schedules, en/settings |
| `/settings/security` | settings | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/settings.test.tsx | ko/settings, ko/api-auth, en/settings, en/api-auth |
| `/settings/system-credentials` | settings | Operator | Yes | Yes | Yes | frontend/tests/pages/admin-settings.test.tsx | ko/operator-setup, ko/models-credentials, ko/settings, en/operator-setup, en/models-credentials, en/settings |
| `/settings/system-llm` | settings | Operator | Yes | Yes | Yes | frontend/tests/pages/admin-settings.test.tsx | ko/system-llm, ko/settings, en/system-llm, en/settings |
| `/settings/usage` | settings | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/usage.test.tsx | ko/usage, ko/settings, en/usage, en/settings |
| `/shared/[shareId]` | shared | Public share token | Yes | Yes | No | No direct page test found | ko/chat-with-agent, ko/access-oversight, en/chat-with-agent, en/access-oversight |
| `/skills` | skills | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/skills.test.tsx | ko/skills, en/skills |
| `/tools` | tools | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/tools.test.tsx | ko/tools, en/tools |
| `/usage` | usage | Authenticated user | Yes | Yes | Yes | frontend/tests/pages/usage.test.tsx | ko/usage, ko/settings, en/usage, en/settings |

## API endpoints

| Tag | Method | Path | Summary |
| --- | --- | --- | --- |
| agent-api | `GET` | `/api/agent-api/deployment-candidates` | List Deployment Candidates |
| agent-api | `PATCH` | `/api/agent-api/deployments/{deployment_id}` | Update Deployment |
| agent-api | `GET` | `/api/agent-api/deployments` | List Deployments |
| agent-api | `POST` | `/api/agent-api/deployments` | Create Deployment |
| agent-api | `POST` | `/api/agent-api/keys/{api_key_id}/revoke` | Revoke Api Key |
| agent-api | `GET` | `/api/agent-api/keys` | List Api Keys |
| agent-api | `POST` | `/api/agent-api/keys` | Create Api Key |
| agent-runtime-api | `POST` | `/v1/agents/{public_id}/chat-messages` | Dify Chat Messages |
| agent-runtime-api | `GET` | `/v1/agents` | List Public Agents |
| agent-runtime-api | `POST` | `/v1/chat/completions` | Openai Chat Completions |
| agent-runtime-api | `GET` | `/v1/health` | Public Health |
| agent-runtime-api | `POST` | `/v1/runs/stream` | Run Stream |
| agent-runtime-api | `POST` | `/v1/runs/wait` | Run Wait |
| agent-runtime-api | `POST` | `/v1/threads/{thread_id}/runs/stream` | Thread Run Stream |
| agent-runtime-api | `POST` | `/v1/threads/{thread_id}/runs/wait` | Thread Run Wait |
| agent-runtime-api | `GET` | `/v1/threads/{thread_id}` | Get Thread |
| agent-runtime-api | `POST` | `/v1/threads` | Create Thread |
| agent-runtime-api | `POST` | `/v1/workflows/run` | Dify Workflow Run |
| agents | `PATCH` | `/api/agents/{agent_id}/favorite` | Toggle Favorite |
| agents | `GET` | `/api/agents/{agent_id}/image` | Get Agent Image |
| agents | `POST` | `/api/agents/{agent_id}/image` | Generate Agent Image |
| agents | `DELETE` | `/api/agents/{agent_id}` | Delete Agent |
| agents | `GET` | `/api/agents/{agent_id}` | Get Agent |
| agents | `PUT` | `/api/agents/{agent_id}` | Update Agent |
| agents | `GET` | `/api/agents/summary` | List Agent Summaries |
| agents | `GET` | `/api/agents` | List Agents |
| agents | `POST` | `/api/agents` | Create Agent |
| artifacts | `GET` | `/api/artifacts/{artifact_id}/content` | Get Artifact Library Content |
| artifacts | `GET` | `/api/artifacts/{artifact_id}/download` | Download Artifact Library Item |
| artifacts | `POST` | `/api/artifacts/{artifact_id}/opened` | Record Artifact Opened |
| artifacts | `PATCH` | `/api/artifacts/{artifact_id}` | Update Artifact |
| artifacts | `GET` | `/api/artifacts/recent` | List Recent Artifacts |
| artifacts | `GET` | `/api/artifacts/stats` | Get Artifact Library Stats |
| artifacts | `GET` | `/api/artifacts` | List Artifact Library |
| artifacts | `GET` | `/api/conversations/{conversation_id}/artifacts/{artifact_id}/content` | Get Conversation Artifact Content |
| artifacts | `GET` | `/api/conversations/{conversation_id}/artifacts/{artifact_id}/download` | Download Conversation Artifact |
| artifacts | `DELETE` | `/api/conversations/{conversation_id}/artifacts/{artifact_id}` | Delete Conversation Artifact |
| artifacts | `GET` | `/api/conversations/{conversation_id}/artifacts/{artifact_id}` | Get Conversation Artifact |
| artifacts | `GET` | `/api/conversations/{conversation_id}/artifacts` | List Conversation Artifacts |
| assistant | `POST` | `/api/agents/{agent_id}/assistant/message` | Send Assistant Message |
| audit | `GET` | `/api/audit-events` | List Audit Events |
| auth | `POST` | `/api/auth/login` | Login Endpoint |
| auth | `POST` | `/api/auth/logout` | Logout Endpoint |
| auth | `DELETE` | `/api/auth/me/avatar-image` | Delete Avatar Image Endpoint |
| auth | `GET` | `/api/auth/me/avatar-image` | Get Avatar Image Endpoint |
| auth | `POST` | `/api/auth/me/avatar-image` | Upload Avatar Image Endpoint |
| auth | `PATCH` | `/api/auth/me/profile` | Update Profile Endpoint |
| auth | `GET` | `/api/auth/me` | Me Endpoint |
| auth | `POST` | `/api/auth/refresh` | Refresh Endpoint |
| auth | `POST` | `/api/auth/register` | Register Endpoint |
| builder | `POST` | `/api/builder/{session_id}/confirm` | Confirm Build |
| builder | `GET` | `/api/builder/{session_id}/image/{filename}` | Serve Builder Image |
| builder | `POST` | `/api/builder/{session_id}/messages/resume` | Resume Message |
| builder | `POST` | `/api/builder/{session_id}/messages` | Post Message |
| builder | `GET` | `/api/builder/{session_id}` | Get Build Session |
| builder | `POST` | `/api/builder` | Start Build |
| conversations | `GET` | `/api/agents/{agent_id}/conversations/page` | List Conversations Page |
| conversations | `POST` | `/api/agents/{agent_id}/conversations/start` | Start Conversation With Message |
| conversations | `GET` | `/api/agents/{agent_id}/conversations` | List Conversations |
| conversations | `POST` | `/api/agents/{agent_id}/conversations` | Create Conversation |
| conversations | `GET` | `/api/conversations/{conversation_id}/debug/traces/{trace_id}` | Get Debug Trace Detail |
| conversations | `GET` | `/api/conversations/{conversation_id}/debug/traces` | List Debug Traces |
| conversations | `GET` | `/api/conversations/{conversation_id}/files/{file_path}` | Get Conversation File |
| conversations | `POST` | `/api/conversations/{conversation_id}/messages/edit` | Edit Message |
| conversations | `POST` | `/api/conversations/{conversation_id}/messages/regenerate` | Regenerate Message |
| conversations | `POST` | `/api/conversations/{conversation_id}/messages/resume` | Resume Message |
| conversations | `POST` | `/api/conversations/{conversation_id}/messages/switch-branch` | Switch Branch |
| conversations | `GET` | `/api/conversations/{conversation_id}/messages` | List Messages |
| conversations | `POST` | `/api/conversations/{conversation_id}/messages` | Send Message |
| conversations | `POST` | `/api/conversations/{conversation_id}/read` | Mark Conversation Read |
| conversations | `GET` | `/api/conversations/{conversation_id}/stream` | Stream Resume |
| conversations | `GET` | `/api/conversations/{conversation_id}/traces` | List Traces |
| conversations | `DELETE` | `/api/conversations/{conversation_id}` | Delete Conversation |
| conversations | `PATCH` | `/api/conversations/{conversation_id}` | Update Conversation |
| credentials | `GET` | `/api/credential-types/{key}` | Get Credential Type |
| credentials | `GET` | `/api/credential-types` | List Credential Types |
| credentials | `GET` | `/api/credentials/{credential_id}/audit-logs` | List Audit Logs |
| credentials | `POST` | `/api/credentials/{credential_id}/discover-models` | Discover Models |
| credentials | `POST` | `/api/credentials/{credential_id}/test` | Test Credential |
| credentials | `DELETE` | `/api/credentials/{credential_id}` | Delete Credential |
| credentials | `GET` | `/api/credentials/{credential_id}` | Get Credential |
| credentials | `PATCH` | `/api/credentials/{credential_id}` | Update Credential |
| credentials | `POST` | `/api/credentials/preview-test` | Preview Test |
| credentials | `GET` | `/api/credentials` | List Credentials |
| credentials | `POST` | `/api/credentials` | Create Credential |
| credentials | `POST` | `/api/oauth2-credential/auth/{credential_id}` | Oauth2 Auth Start |
| credentials | `GET` | `/api/oauth2-credential/callback` | Oauth2 Callback |
| credentials | `DELETE` | `/api/system-credentials/{credential_id}` | Delete System Credential |
| credentials | `GET` | `/api/system-credentials/{credential_id}` | Get System Credential |
| credentials | `PATCH` | `/api/system-credentials/{credential_id}` | Update System Credential |
| credentials | `GET` | `/api/system-credentials` | List System Credentials |
| credentials | `POST` | `/api/system-credentials` | Create System Credential |
| feedback | `GET` | `/api/conversations/{conversation_id}/feedback` | List Feedback For Conversation |
| feedback | `DELETE` | `/api/messages/{message_id}/feedback` | Clear Feedback |
| feedback | `POST` | `/api/messages/{message_id}/feedback` | Upsert Feedback |
| health | `POST` | `/api/health/check` | Check Now |
| health | `GET` | `/api/health/history` | Get History |
| health | `GET` | `/api/health/mcp-servers` | List Mcp Health |
| health | `GET` | `/api/health/models` | List Model Health |
| marketplace | `POST` | `/api/marketplace/admin/items/{item_id}/listed` | Admin Set Item Listed |
| marketplace | `POST` | `/api/marketplace/admin/k-skill/sync` | Admin K Skill Sync Status |
| marketplace | `POST` | `/api/marketplace/installations/{installation_id}/update` | Update Installation |
| marketplace | `DELETE` | `/api/marketplace/installations/{installation_id}` | Delete Installation |
| marketplace | `DELETE` | `/api/marketplace/items/{item_id}/acl/{user_id_to_remove}` | Delete Item Acl Entry |
| marketplace | `POST` | `/api/marketplace/items/{item_id}/acl` | Replace Item Acl |
| marketplace | `POST` | `/api/marketplace/items/{item_id}/disable` | Disable Item |
| marketplace | `POST` | `/api/marketplace/items/{item_id}/enable` | Enable Item |
| marketplace | `POST` | `/api/marketplace/items/{item_id}/install` | Install Item |
| marketplace | `POST` | `/api/marketplace/items/{item_id}/versions/from-skill/{skill_id}` | Publish New Version |
| marketplace | `GET` | `/api/marketplace/items/{item_id}/versions` | List Versions |
| marketplace | `GET` | `/api/marketplace/items/{item_id}` | Get Item |
| marketplace | `PATCH` | `/api/marketplace/items/{item_id}` | Patch Item |
| marketplace | `POST` | `/api/marketplace/items/from-skill/{skill_id}` | Publish Item From Skill |
| marketplace | `GET` | `/api/marketplace/items/page` | List Items Page |
| marketplace | `GET` | `/api/marketplace/items` | List Items |
| marketplace | `GET` | `/api/marketplace/versions/{version_id}` | Get Version |
| mcp | `GET` | `/api/mcp-server-types/{key}` | Get Registry Entry |
| mcp | `GET` | `/api/mcp-server-types` | List Registry Entries |
| mcp | `POST` | `/api/mcp-servers/{server_id}/discover` | Discover Server Tools |
| mcp | `POST` | `/api/mcp-servers/{server_id}/test` | Test Server |
| mcp | `DELETE` | `/api/mcp-servers/{server_id}` | Delete Server |
| mcp | `GET` | `/api/mcp-servers/{server_id}` | Get Server |
| mcp | `PATCH` | `/api/mcp-servers/{server_id}` | Update Server |
| mcp | `GET` | `/api/mcp-servers/all-tools` | List All User Mcp Tools |
| mcp | `GET` | `/api/mcp-servers/export` | Export Servers |
| mcp | `POST` | `/api/mcp-servers/from-registry` | Create Server From Registry |
| mcp | `POST` | `/api/mcp-servers/import` | Import Servers |
| mcp | `POST` | `/api/mcp-servers/probe` | Probe Mcp Server |
| mcp | `GET` | `/api/mcp-servers` | List Servers |
| mcp | `POST` | `/api/mcp-servers` | Create Server |
| memory | `GET` | `/api/agents/{agent_id}/memory-settings` | Get Agent Memory Settings |
| memory | `PATCH` | `/api/agents/{agent_id}/memory-settings` | Update Agent Memory Settings |
| memory | `GET` | `/api/me/memory-settings` | Get User Memory Settings |
| memory | `PATCH` | `/api/me/memory-settings` | Update User Memory Settings |
| memory | `DELETE` | `/api/memories/{memory_id}` | Delete Memory |
| memory | `PATCH` | `/api/memories/{memory_id}` | Update Memory |
| memory | `GET` | `/api/memories` | List Memories |
| memory | `POST` | `/api/memories` | Create Memory |
| memory | `POST` | `/api/memory-proposals/{proposal_id}/approve` | Approve Memory Proposal |
| memory | `POST` | `/api/memory-proposals/{proposal_id}/edit-and-approve` | Edit And Approve Memory Proposal |
| memory | `POST` | `/api/memory-proposals/{proposal_id}/reject` | Reject Memory Proposal |
| memory | `GET` | `/api/memory-proposals/{proposal_id}` | Get Memory Proposal |
| memory | `POST` | `/api/memory-proposals` | Create Memory Proposal |
| middlewares | `GET` | `/api/middlewares` | List Middlewares |
| models | `POST` | `/api/models/{model_id}/test` | Test Registered Model |
| models | `DELETE` | `/api/models/{model_id}` | Delete Model |
| models | `GET` | `/api/models/{model_id}` | Get Model |
| models | `PATCH` | `/api/models/{model_id}` | Update Model |
| models | `POST` | `/api/models/test-preview` | Test Preview Model |
| models | `GET` | `/api/models` | List Models |
| models | `POST` | `/api/models` | Create Model |
| shares | `DELETE` | `/api/conversations/{conversation_id}/share` | Revoke Share |
| shares | `GET` | `/api/conversations/{conversation_id}/share` | Get Active Share |
| shares | `POST` | `/api/conversations/{conversation_id}/share` | Create Share |
| shares | `GET` | `/api/shares/{share_token}/artifacts/{artifact_id}/content` | Get Public Share Artifact Content |
| shares | `GET` | `/api/shares/{share_token}/artifacts/{artifact_id}/download` | Download Public Share Artifact |
| shares | `GET` | `/api/shares/{share_token}/artifacts/{artifact_id}` | Get Public Share Artifact |
| shares | `GET` | `/api/shares/{share_token}/artifacts` | List Public Share Artifacts |
| shares | `GET` | `/api/shares/{share_token}/messages` | Get Public Share Messages |
| shares | `GET` | `/api/shares/{share_token}` | Get Public Share |
| skills | `GET` | `/api/skills/{skill_id}/content` | Get Text Content |
| skills | `PUT` | `/api/skills/{skill_id}/content` | Put Text Content |
| skills | `DELETE` | `/api/skills/{skill_id}/credential-bindings/{requirement_key}` | Delete Skill Credential Binding |
| skills | `PUT` | `/api/skills/{skill_id}/credential-bindings/{requirement_key}` | Put Skill Credential Binding |
| skills | `GET` | `/api/skills/{skill_id}/credential-bindings` | List Skill Credential Bindings |
| skills | `GET` | `/api/skills/{skill_id}/credential-requirements` | Get Skill Credential Requirements |
| skills | `DELETE` | `/api/skills/{skill_id}/files/{file_path}` | Delete Skill File |
| skills | `GET` | `/api/skills/{skill_id}/files/{file_path}` | Get Skill File |
| skills | `PUT` | `/api/skills/{skill_id}/files/{file_path}` | Put Skill File |
| skills | `GET` | `/api/skills/{skill_id}/files` | List Skill Files |
| skills | `POST` | `/api/skills/{skill_id}/files` | Upload Skill File |
| skills | `DELETE` | `/api/skills/{skill_id}` | Delete Skill |
| skills | `GET` | `/api/skills/{skill_id}` | Get Skill |
| skills | `PATCH` | `/api/skills/{skill_id}` | Patch Skill Metadata |
| skills | `POST` | `/api/skills/upload` | Upload Package Skill |
| skills | `GET` | `/api/skills` | List Skills |
| skills | `POST` | `/api/skills` | Create Text Skill |
| system-llm-settings | `PUT` | `/api/system-llm-settings/{role}` | Update System Llm Setting |
| system-llm-settings | `GET` | `/api/system-llm-settings` | List System Llm Settings |
| templates | `GET` | `/api/templates/{template_id}` | Get Template |
| templates | `GET` | `/api/templates` | List Templates |
| tools | `GET` | `/api/tool-types/{key}` | Get Tool Type |
| tools | `GET` | `/api/tool-types` | List Tool Types |
| tools | `POST` | `/api/tools/{tool_id}/run` | Run Tool Endpoint |
| tools | `DELETE` | `/api/tools/{tool_id}` | Delete Tool |
| tools | `GET` | `/api/tools/{tool_id}` | Get Tool |
| tools | `PATCH` | `/api/tools/{tool_id}` | Update Tool |
| tools | `GET` | `/api/tools` | List Tools |
| tools | `POST` | `/api/tools` | Create Tool |
| triggers | `DELETE` | `/api/agents/{agent_id}/triggers/{trigger_id}` | Delete Agent Trigger |
| triggers | `PUT` | `/api/agents/{agent_id}/triggers/{trigger_id}` | Update Agent Trigger |
| triggers | `GET` | `/api/agents/{agent_id}/triggers` | List Agent Triggers |
| triggers | `POST` | `/api/agents/{agent_id}/triggers` | Create Trigger |
| triggers | `POST` | `/api/triggers/{trigger_id}/run-now` | Run Trigger Now |
| triggers | `GET` | `/api/triggers/{trigger_id}/runs` | List Trigger Runs |
| triggers | `DELETE` | `/api/triggers/{trigger_id}` | Delete Trigger Global |
| triggers | `PATCH` | `/api/triggers/{trigger_id}` | Update Trigger Global |
| triggers | `GET` | `/api/triggers/summary` | Trigger Summary |
| triggers | `GET` | `/api/triggers` | List All Triggers |
| untagged | `GET` | `/api/health` | Health Check |
| uploads | `GET` | `/api/uploads/{upload_id}` | Get Upload |
| uploads | `POST` | `/api/uploads` | Create Upload |
| usage | `GET` | `/api/agents/{agent_id}/usage` | Get Agent Usage |
| usage | `GET` | `/api/usage/daily` | Get Daily Spend |
| usage | `GET` | `/api/usage/summary` | Get Usage Summary |


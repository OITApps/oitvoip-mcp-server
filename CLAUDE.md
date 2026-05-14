# CLAUDE.md -- oitvoip-mcp-server

## Overview
MCP server for NetSapiens VoIP platform integration. Exposes user management, CDR records, call queues, agent operations, auto attendants, voicemail, and billing data to AI agents via the Model Context Protocol.

## Build and Run
- `npm run build` -- TypeScript compile (cleans `build/` first via prebuild)
- `npm run dev` -- Dev mode with tsx
- `npm start` -- Run compiled server (`build/index.js`)
- `npm run watch` -- Dev mode with file watching
- No test suite configured yet

## Architecture
- **TypeScript, ES2022/Node16, ESM modules** -- builds to `build/`
- `src/index.ts` -- MCP server setup, tool registration, request routing
- `src/netsapiens-client.ts` -- HTTP client for NetSapiens API (axios)
- `src/types/config.ts` -- Configuration types
- Uses `@modelcontextprotocol/sdk` for MCP protocol, `zod` for validation

## Tools (23)
User/domain: `search_users`, `get_user`, `get_domains`, `get_domain`, `get_user_devices`
Calls/CDR: `get_cdr_records`, `get_phone_numbers`, `get_phone_number`
Queues/agents: `get_call_queues`, `get_call_queue`, `get_call_queue_agents`, `get_agents`, `login_agent`, `logout_agent`, `get_agent_statistics`
PBX features: `get_auto_attendants`, `get_user_answer_rules`, `get_user_answer_rule`, `get_user_greetings`, `get_user_voicemails`, `get_music_on_hold`
Admin: `get_billing`, `test_connection`

## Secrets
All secrets stored in Azure Key Vault (`occ-secrets-ray`). Fetched via `occ-fetch-secrets.sh`. No `.env` files.
- `NETSAPIENS_API_TOKEN` -- required, NetSapiens API bearer token
- `NETSAPIENS_API_URL` -- optional, defaults to `https://api.ucaasnetwork.com`
- `DEBUG` -- optional, set `true` for verbose logging

## Rate Limiting
100 requests per 60 seconds to NetSapiens API (configured in code).

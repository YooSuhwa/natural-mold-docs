#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE22_BIN="/Users/chester/Library/Application Support/Logi/LogiPluginService/PluginHosts/node22/node/bin"
NPX_BIN="/Users/chester/.nvm/versions/node/v24.13.1/bin/npx"

cd "$ROOT/src"
PATH="$NODE22_BIN:$PATH" "$NPX_BIN" --yes mint@4.2.406 dev --port "${PORT:-3001}"

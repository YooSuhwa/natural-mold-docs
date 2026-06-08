import fs from "node:fs/promises";
import path from "node:path";

import { API_BASE, ROOT, ensureDir } from "./lib.mjs";

const response = await fetch(`${API_BASE}/openapi.json`);
if (!response.ok) {
  throw new Error(`Failed to fetch OpenAPI from ${API_BASE}: ${response.status}`);
}

const spec = await response.json();
spec.servers = [
  {
    url: API_BASE,
    description: "Local Moldy API server"
  }
];

const outputDir = path.join(ROOT, "src", "openapi");
await ensureDir(outputDir);
const output = path.join(outputDir, "moldy-openapi.json");
await fs.writeFile(output, `${JSON.stringify(spec, null, 2)}\n`);
console.log(`Wrote ${output}`);

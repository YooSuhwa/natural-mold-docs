import fs from "node:fs/promises";
import path from "node:path";

import { ROOT, readDotEnv, walkFiles } from "./lib.mjs";

const env = await readDotEnv();
const secrets = [
  env.USER_ID,
  env.USER_PW,
  env.USER_ID?.split("@")[0],
  ["llm-gw", "hancom", "com"].join("."),
  ["apps", "orca", "cloud", "hancom", "com"].join("."),
  ["mcp", "atlassian", "com"].join(".")
].filter((value) => value && value.length >= 4);

const textExtensions = new Set([
  ".css",
  ".json",
  ".md",
  ".mdx",
  ".mjs",
  ".js",
  ".ts",
  ".tsx",
  ".yml",
  ".yaml"
]);

const files = await walkFiles(ROOT, (file) => {
  if (file.includes(`${path.sep}node_modules${path.sep}`)) return false;
  if (file.includes(`${path.sep}.playwright-cli${path.sep}`)) return false;
  if (file.includes(`${path.sep}k8s${path.sep}`)) return false;
  if (path.basename(file) === ".env") return false;
  return textExtensions.has(path.extname(file));
});

const findings = [];
for (const file of files) {
  const text = await fs.readFile(file, "utf8");
  for (const secret of secrets) {
    if (text.includes(secret)) {
      findings.push(`${path.relative(ROOT, file)} contains a sensitive value or internal hostname`);
    }
  }
}

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exit(1);
}

console.log(`Checked ${files.length} text files; no sensitive values found.`);

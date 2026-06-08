import fs from "node:fs/promises";
import path from "node:path";

export const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
export const NATURAL_MOLD_ROOT = "/Users/chester/dev/ref/natural-mold";
export const API_BASE = process.env.MOLDY_API_BASE_URL || "http://localhost:8001";
export const APP_BASE = process.env.MOLDY_APP_BASE_URL || "http://localhost:3000";

export async function readDotEnv(file = path.join(ROOT, ".env")) {
  const text = await fs.readFile(file, "utf8");
  const env = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function walkFiles(dir, predicate = () => true) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath, predicate)));
    } else if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

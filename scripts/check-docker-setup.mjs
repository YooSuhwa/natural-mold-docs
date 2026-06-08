#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const requiredFiles = ['Dockerfile', '.dockerignore', 'docker-compose.yml'];

async function readRequiredFile(path) {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Missing ${path}`);
    }

    throw error;
  }
}

function assertIncludes(content, needle, label) {
  if (!content.includes(needle)) {
    throw new Error(`${label} must include ${needle}`);
  }
}

for (const file of requiredFiles) {
  await readRequiredFile(file);
}

const dockerfile = await readRequiredFile('Dockerfile');
const compose = await readRequiredFile('docker-compose.yml');

assertIncludes(dockerfile, 'node:22', 'Dockerfile');
assertIncludes(dockerfile, 'ca-certificates', 'Dockerfile');
assertIncludes(dockerfile, 'curl -fsSkL', 'Dockerfile');
assertIncludes(dockerfile, 'releases.mintlify.com', 'Dockerfile');
assertIncludes(dockerfile, 'mint@4.2.406', 'Dockerfile');
assertIncludes(dockerfile, 'mint dev', 'Dockerfile');
assertIncludes(dockerfile, '--no-open', 'Dockerfile');
assertIncludes(dockerfile, '--port', 'Dockerfile');
assertIncludes(dockerfile, '3001', 'Dockerfile');
assertIncludes(compose, '${DOCS_PORT:-3002}:3001', 'docker-compose.yml');

console.log('Docker setup looks ready.');

#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const projectPath = path.resolve(process.argv[2] || '.');
const docsPath = path.join(projectPath, 'docs');
const manifestPath = path.join(docsPath, 'manifest.json');
const handoffPath = path.join(docsPath, 'handoff.json');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

const markdownDocs = walk(docsPath).filter((filePath) => filePath.endsWith('.md'));
const hasManifest = fs.existsSync(manifestPath);
const hasHandoff = fs.existsSync(handoffPath);
const manifest = hasManifest ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
const registeredDocs = new Set(Object.keys(manifest));
const unregisteredDocs = markdownDocs
  .map((filePath) => path.relative(projectPath, filePath))
  .filter((filePath) => filePath !== 'docs/INDEX.md' && !registeredDocs.has(filePath));

console.log('# Qian Systems Engineering Audit\n');
console.log(`Project: ${projectPath}`);
console.log(`Manifest: ${hasManifest ? 'present' : 'missing'}`);
console.log(`Handoff: ${hasHandoff ? 'present' : 'missing'}`);
console.log(`Markdown docs: ${markdownDocs.length}`);
console.log(`Registered docs: ${registeredDocs.size}`);

if (unregisteredDocs.length > 0) {
  console.log('\n## Unregistered Docs\n');
  for (const docPath of unregisteredDocs) console.log(`- ${docPath}`);
}

console.log('\n## Suggested Next Actions\n');
if (!hasManifest) console.log('- Create docs/manifest.json from templates/manifest.template.json.');
if (!hasHandoff) console.log('- Create docs/handoff.json from templates/handoff.template.json.');
if (unregisteredDocs.length > 0) console.log('- Register untracked Markdown docs in docs/manifest.json.');
if (hasManifest && hasHandoff && unregisteredDocs.length === 0) {
  console.log('- No blocking governance gaps found by the lightweight audit.');
}

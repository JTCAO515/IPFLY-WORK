#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const projectIdx = args.indexOf('--project');
const projectPath = path.resolve(projectIdx >= 0 ? args[projectIdx + 1] : '.');
const docsPath = path.join(projectPath, 'docs');
const manifestPath = path.join(docsPath, 'manifest.json');
const handoffPath = path.join(docsPath, 'handoff.json');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`${path.relative(projectPath, filePath)} is not valid JSON: ${error.message}`);
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

function collectMarkdownLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const links = [];
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
  let match;

  while ((match = linkPattern.exec(content))) {
    const target = match[1].split('#')[0].trim();
    if (!target || /^(https?:|mailto:)/.test(target)) continue;
    links.push({ source: filePath, target });
  }

  return links;
}

const errors = [];

if (!fs.existsSync(manifestPath)) errors.push('docs/manifest.json is missing');
if (!fs.existsSync(handoffPath)) errors.push('docs/handoff.json is missing');

const manifest = fs.existsSync(manifestPath) ? readJson(manifestPath) : {};
const handoff = fs.existsSync(handoffPath) ? readJson(handoffPath) : {};

const markdownFiles = walk(docsPath)
  .filter((filePath) => filePath.endsWith('.md'))
  .map((filePath) => path.relative(projectPath, filePath));

const generatedDocs = new Set(['docs/INDEX.md']);
const registeredDocs = new Set(Object.keys(manifest));

for (const docPath of markdownFiles) {
  if (!generatedDocs.has(docPath) && !registeredDocs.has(docPath)) {
    errors.push(`${docPath} is not registered in docs/manifest.json`);
  }
}

for (const docPath of registeredDocs) {
  if (!fs.existsSync(path.join(projectPath, docPath))) {
    errors.push(`${docPath} is registered but does not exist`);
  }
}

if (!Array.isArray(handoff.readingOrder) || handoff.readingOrder.length === 0) {
  errors.push('docs/handoff.json must contain a non-empty readingOrder array');
}

for (const filePath of walk(docsPath).filter((filePath) => filePath.endsWith('.md'))) {
  for (const link of collectMarkdownLinks(filePath)) {
    const absoluteTarget = path.resolve(path.dirname(link.source), decodeURIComponent(link.target));
    if (!fs.existsSync(absoluteTarget)) {
      errors.push(`${path.relative(projectPath, link.source)} links to missing ${link.target}`);
    }
  }
}

if (errors.length > 0) {
  console.error('Documentation check failed:\n');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('Documentation check passed');
console.log(`  Registered docs: ${registeredDocs.size}`);
console.log(`  Markdown docs: ${markdownFiles.length}`);
console.log(`  Reading order entries: ${handoff.readingOrder.length}`);

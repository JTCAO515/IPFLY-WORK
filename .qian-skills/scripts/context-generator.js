#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const projectIdx = args.indexOf('--project');
const outputIdx = args.indexOf('--output');

const projectPath = path.resolve(projectIdx >= 0 ? args[projectIdx + 1] : '.');
const outputFile = path.resolve(projectPath, outputIdx >= 0 ? args[outputIdx + 1] : 'CONTEXT.md');
const docsPath = path.join(projectPath, 'docs');
const manifestPath = path.join(docsPath, 'manifest.json');
const handoffPath = path.join(docsPath, 'handoff.json');

function readJsonOrDefault(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const manifest = readJsonOrDefault(manifestPath, {});
const handoff = readJsonOrDefault(handoffPath, {
  currentPhase: 'unknown',
  activeWork: [],
  blockers: [],
  verificationEvidence: {},
  nextActions: [],
  readingOrder: [],
});

const registeredDocs = Object.entries(manifest)
  .map(([docPath, entry]) => `- ${docPath}: ${entry.summary || entry.type || 'registered document'}`)
  .join('\n') || '- No registered docs found yet.';

const activeWork = (handoff.activeWork || []).map((item) => `- ${item}`).join('\n') || '- None recorded.';
const blockers = (handoff.blockers || []).map((item) => `- ${item}`).join('\n') || '- None recorded.';
const nextActions = (handoff.nextActions || []).map((item) => `- ${item}`).join('\n') || '- None recorded.';
const readingOrder = (handoff.readingOrder || []).map((item, index) => `${index + 1}. ${item}`).join('\n') || '1. README.md';

const context = `# Project Context Package

Generated from qian-systems-engineering.

## Current State

- Phase: ${handoff.currentPhase || 'unknown'}
- Last updated: ${handoff.lastUpdated || 'unknown'}

## Active Work

${activeWork}

## Blockers

${blockers}

## Next Actions

${nextActions}

## Reading Order

${readingOrder}

## Registered Documents

${registeredDocs}
`;

fs.writeFileSync(outputFile, context);

console.log(`Context package generated: ${path.relative(projectPath, outputFile)}`);

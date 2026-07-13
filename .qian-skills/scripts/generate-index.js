#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const projectIdx = args.indexOf('--project');
const projectPath = path.resolve(projectIdx >= 0 ? args[projectIdx + 1] : '.');
const docsPath = path.join(projectPath, 'docs');
const manifestPath = path.join(docsPath, 'manifest.json');
const handoffPath = path.join(docsPath, 'handoff.json');
const indexPath = path.join(docsPath, 'INDEX.md');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const handoff = JSON.parse(fs.readFileSync(handoffPath, 'utf8'));

const readingOrder = (handoff.readingOrder || [])
  .map((docPath, index) => `${index + 1}. [${docPath}](../${docPath})`)
  .join('\n');

const registeredDocs = Object.entries(manifest)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([docPath, entry]) => `- [${docPath}](../${docPath}) - ${entry.summary || entry.type || 'registered document'}`)
  .join('\n');

const content = `# Documentation Index

Generated from docs/manifest.json and docs/handoff.json.

## Handoff Snapshot

- Current phase: ${handoff.currentPhase || 'unknown'}
- Last updated: ${handoff.lastUpdated || 'unknown'}
- Active work: ${(handoff.activeWork || []).join(', ') || 'none'}
- Blockers: ${(handoff.blockers || []).join(', ') || 'none'}
- Next actions: ${(handoff.nextActions || []).join(', ') || 'none'}

## Mandatory Reading Order

${readingOrder || '1. [README.md](../README.md)'}

## Registered Documents

${registeredDocs || '- No registered documents.'}
`;

fs.writeFileSync(indexPath, content);
console.log(`Generated ${path.relative(projectPath, indexPath)}`);

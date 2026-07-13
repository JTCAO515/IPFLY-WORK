#!/usr/bin/env node

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const baseIdx = args.indexOf('--base');
const projectIdx = args.indexOf('--project');
const baseRef = baseIdx >= 0 ? args[baseIdx + 1] : 'HEAD~1';
const projectPath = path.resolve(projectIdx >= 0 ? args[projectIdx + 1] : '.');
const manifestPath = path.join(projectPath, 'docs/manifest.json');

function git(args) {
  return execFileSync('git', args, {
    cwd: projectPath,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

if (!fs.existsSync(path.join(projectPath, '.git'))) {
  console.log('docs:impact skipped: project is not a git repository');
  process.exit(0);
}

if (!fs.existsSync(manifestPath)) {
  console.error('docs:impact failed: docs/manifest.json is missing');
  process.exit(1);
}

let changedFiles = [];
try {
  changedFiles = git(['diff', '--name-only', `${baseRef}..HEAD`]).split('\n').filter(Boolean);
} catch (error) {
  console.error(`docs:impact failed: unable to diff against ${baseRef}`);
  console.error(error.stderr || error.message);
  process.exit(1);
}

const sourceChanges = changedFiles.filter((filePath) => {
  if (filePath.startsWith('docs/')) return false;
  if (filePath.endsWith('.md')) return false;
  return true;
});

if (sourceChanges.length === 0) {
  console.log('docs:impact passed: no source changes detected');
  process.exit(0);
}

const docsChanged = changedFiles.some((filePath) => filePath.startsWith('docs/') && filePath.endsWith('.md'));
const handoffChanged = changedFiles.includes('docs/handoff.json');
const manifestChanged = changedFiles.includes('docs/manifest.json');

if (!docsChanged && !handoffChanged && !manifestChanged) {
  console.error('docs:impact failed: source changes require a docs update, manifest update, or handoff update');
  console.error(`Source changes:\n${sourceChanges.map((filePath) => `  - ${filePath}`).join('\n')}`);
  process.exit(1);
}

console.log('docs:impact passed');
console.log(`  Source changes: ${sourceChanges.length}`);
console.log(`  Documentation signal: ${[docsChanged && 'docs', handoffChanged && 'handoff', manifestChanged && 'manifest'].filter(Boolean).join(', ')}`);

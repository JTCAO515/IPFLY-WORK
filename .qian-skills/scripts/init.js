#!/usr/bin/env node

/**
 * Initialize a new project with Qian Systems Engineering framework
 * Usage: node scripts/init.js /path/to/project
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectPath = process.argv[2] || '.';

const requiredDirs = [
  'docs/governance',
  'docs/constraints',
  'docs/methodology',
  'docs/architecture',
  'docs/practices',
  'docs/operations',
  '.github/ISSUE_TEMPLATE',
];

const filesToCopy = [
  { src: '../docs/methodology/qian-systems-engineering.md', dst: 'docs/methodology/qian-systems-engineering.md' },
  { src: '../docs/constraints/qian-systems-engineering.md', dst: 'docs/constraints/qian-systems-engineering.md' },
  { src: '../docs/constraints/karpathy-guidelines.md', dst: 'docs/constraints/karpathy-guidelines.md' },
  { src: '../templates/manifest.template.json', dst: 'docs/manifest.json' },
  { src: '../templates/handoff.template.json', dst: 'docs/handoff.json' },
  { src: '../templates/issue-template.md', dst: '.github/ISSUE_TEMPLATE/standard.md' },
  { src: '../templates/pr-template.md', dst: '.github/PULL_REQUEST_TEMPLATE.md' },
];

const absoluteProjectPath = path.resolve(projectPath);

console.log(`Initializing Qian Systems Engineering framework in: ${absoluteProjectPath}\n`);

// Create directories
console.log('Creating directories...');
requiredDirs.forEach(dir => {
  const fullPath = path.join(absoluteProjectPath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`  ✓ ${dir}`);
  }
});

// Copy templates
console.log('\nCopying templates...');
filesToCopy.forEach(({ src, dst }) => {
  const srcPath = path.resolve(__dirname, src);
  const dstPath = path.join(absoluteProjectPath, dst);

  if (fs.existsSync(srcPath)) {
    fs.mkdirSync(path.dirname(dstPath), { recursive: true });
    fs.copyFileSync(srcPath, dstPath);
    console.log(`  ✓ ${dst}`);
  } else {
    console.warn(`  ! Template not found: ${src}`);
  }
});

console.log('\nInitialization complete!\n');
console.log('Next steps:');
console.log('  1. Edit docs/manifest.json and docs/handoff.json for this project.');
console.log('  2. Add project-specific governance and architecture docs as they become authoritative.');
console.log('  3. Review .github/ISSUE_TEMPLATE/standard.md.');
console.log('  4. Run: node .qian-skills/scripts/docs-check.js --project . or your package script alias.\n');
console.log('Read DEPLOYMENT.md for detailed integration steps.\n');

# 钱学森 Systems Engineering Skills

A lightweight, installable software systems engineering framework for AI-assisted projects.
It combines Qian Xuesen-inspired systems engineering, closed-loop feedback, documentation as
code, and Karpathy-style implementation discipline.

Version: 1.0.0
Status: Active
License: MIT

## What Ships

- [SKILL.md](SKILL.md): the agent skill entry point.
- [QUICK_START.md](QUICK_START.md): a 15-minute setup path.
- [DEPLOYMENT.md](DEPLOYMENT.md): a deeper adoption guide.
- [docs/methodology/qian-systems-engineering.md](docs/methodology/qian-systems-engineering.md):
  the core method.
- [docs/constraints/qian-systems-engineering.md](docs/constraints/qian-systems-engineering.md):
  mandatory lifecycle and governance rules.
- [docs/constraints/karpathy-guidelines.md](docs/constraints/karpathy-guidelines.md):
  simple, surgical, verifiable coding discipline.
- [templates/issue-template.md](templates/issue-template.md): executable Issue template.
- [templates/manifest.template.json](templates/manifest.template.json): controlled-doc registry.
- [templates/handoff.template.json](templates/handoff.template.json): current work snapshot.
- `scripts/init.js`: initializes the framework in a target project.
- `scripts/docs-check.js`: validates registered docs, handoff, and Markdown links.
- `scripts/docs-impact.js`: checks that source changes include a documentation signal.
- `scripts/generate-index.js`: generates `docs/INDEX.md`.
- `scripts/context-generator.js`: writes a compact `CONTEXT.md` for agents.
- `scripts/audit.js`: reports lightweight adoption gaps.

## Quick Start

### Install As A Codex Skill

Copy the pure skill folder into your Codex skills directory:

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R skill/qian-systems-engineering "${CODEX_HOME:-$HOME/.codex}/skills/"
```

Validate the installable skill folder:

```bash
python3 /path/to/quick_validate.py skill/qian-systems-engineering
```

The installable skill lives at:

```text
skill/qian-systems-engineering/
├── SKILL.md
├── agents/openai.yaml
├── references/
└── scripts/
```

### Add Governance To A Project

From the project you want to govern:

```bash
git submodule add https://github.com/JTCAO515/qian-systems-engineering.git .qian-skills
node .qian-skills/scripts/init.js .
node .qian-skills/scripts/docs-check.js --project .
node .qian-skills/scripts/generate-index.js --project .
node .qian-skills/scripts/context-generator.js --project .
```

Then review:

1. `docs/manifest.json`
2. `docs/handoff.json`
3. `.github/ISSUE_TEMPLATE/standard.md`
4. `CONTEXT.md`
5. `docs/INDEX.md`

## NPM Scripts In This Repository

```bash
npm run docs:check
npm run docs:generate-index
npm run context:generate
npm run audit
```

If published to npm, the same commands are available as bins:

```bash
qian-init .
qian-docs-check --project .
qian-generate-index --project .
qian-context --project .
qian-audit .
```

For impact checks against a git base:

```bash
npm run docs:impact -- --base HEAD~1
```

## Core Loop

```text
objective r(t) -> issue/plan -> implementation -> observation y(t)
      ^                                      |
      +--- control action u(t) <- deviation e(t)
                           ^
                    disturbance d(t)
```

- Define measurable objectives before decomposing work.
- Freeze cross-module contracts before parallel implementation.
- Treat one Issue as one reviewable control action.
- Update code, tests, docs, and handoff together.
- Verify with reproducible evidence.
- Classify deviations D0-D3 before choosing corrective action.

## Adoption Modes

| Mode | Use When | Required Evidence |
| --- | --- | --- |
| Micro | Local, reversible fix | Objective, change, check, docs if affected |
| Standard | Feature or module work | Issue, manifest/handoff update, verification |
| System | Architecture, data, permissions, payment, release, roadmap | Baseline or ADR, contract review, rollout/rollback |

## Repository Shape

```text
qian-systems-engineering/
├── SKILL.md
├── QUICK_START.md
├── DEPLOYMENT.md
├── docs/
│   ├── constraints/
│   │   ├── karpathy-guidelines.md
│   │   └── qian-systems-engineering.md
│   ├── handoff.json
│   ├── manifest.json
│   └── methodology/
│       └── qian-systems-engineering.md
├── scripts/
│   ├── audit.js
│   ├── context-generator.js
│   ├── docs-check.js
│   ├── docs-impact.js
│   ├── generate-index.js
│   └── init.js
└── templates/
    ├── handoff.template.json
    ├── issue-template.md
    └── manifest.template.json
```

## Verification

This package is considered internally consistent when these pass:

```bash
npm run docs:check
npm run docs:generate-index
npm run context:generate
node scripts/init.js /tmp/qian-init-smoke
node scripts/docs-check.js --project /tmp/qian-init-smoke
```

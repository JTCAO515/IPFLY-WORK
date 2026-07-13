---
name: qian-systems-engineering
description: Apply Qian Xuesen-inspired systems engineering to software and AI-assisted coding projects. Use for project bootstrap, architecture planning, subsystem decomposition, interface freezing, executable Issue breakdown, documentation-as-code governance, implementation discipline, verification, release control, feedback analysis, retrospectives, and roadmap correction when work must stay traceable, observable, reversible, and synchronized across code, docs, tests, and handoff state.
---

# 钱学森 Systems Engineering

Govern software as a controlled, evolving system. Connect objective, subsystem design, interface
baseline, executable Issue, implementation, observation, deviation, corrective action, and retained
knowledge.

## Operating Mode

Scale to risk:

- **Micro:** local reversible fix. Use objective -> change -> check -> docs if affected.
- **Standard:** feature or module work. Use lifecycle G0-G6 and update handoff.
- **System:** architecture, data, permissions, payment, commercial policy, release, or roadmap.
  Require interface baseline, owner, rollback, and usually ADR/operator decision.

Do not replace local repository governance. Inspect it first and apply the stricter rule.

## Workflow

1. **G0 intent:** inspect repo state, current docs, constraints, Issues, ADRs, and runtime facts.
   State assumptions, system boundary, anti-goals, observations, owner, and success criteria.
2. **G1 decomposition:** map business outcome -> user capability -> subsystem -> module/owner ->
   interface baseline -> Issue. Freeze cross-module contracts before parallel implementation.
3. **G2 executable Issue:** ensure the work can be executed without private chat history. Include
   scope, do-not-touch boundary, dependencies, acceptance checks, docs impact, observation window,
   risk, rollback, and owner.
4. **G3 implementation:** make the smallest sufficient code change. Keep tests, docs, and handoff
   synchronized. Avoid speculative features, abstraction, unrelated cleanup, and fake success.
5. **G4 verification:** run checks from fastest to slowest: unit/schema, contract/integration,
   lint/typecheck/build, migrations/evals/security/payment where relevant, browser/device,
   staging/production smoke, telemetry/cost/user evidence.
6. **G5 deviation control:** classify mismatches as D0-D3 before choosing action.
7. **G6 archival:** record expected vs observed result, side effects, residual unknowns, next action
   or no-action reason, and updated reading order/handoff.

## Deviation Classes

| Class | Meaning | Response |
| --- | --- | --- |
| D0 | within accepted tolerance | record observation |
| D1 | local, reversible, interface unchanged | current PR or small Issue |
| D2 | cross-module, contract, permission, commercial, data, or architecture | pause expansion; review/ADR |
| D3 | objective, positioning, roadmap, or governing model is wrong | operator decision; revise baseline |

## Bundled Resources

Read references only when needed:

- `references/methodology.md`: full Qian systems engineering adaptation and lifecycle.
- `references/constraints.md`: mandatory QSE rules and evidence gates.
- `references/karpathy-guidelines.md`: local coding discipline.
- `references/issue-template.md`: executable Issue format.
- `references/manifest.template.json`: controlled-document registry template.
- `references/handoff.template.json`: handoff snapshot template.
- `references/pr-template.md`: PR checklist template.

Use scripts for deterministic project setup and checks:

```bash
node scripts/init.js /path/to/project
node scripts/audit.js /path/to/project
node scripts/docs-check.js --project /path/to/project
node scripts/docs-impact.js --project /path/to/project --base main
node scripts/generate-index.js --project /path/to/project
node scripts/context-generator.js --project /path/to/project
```

When installed in a project as `.qian-skills`, call:

```bash
node .qian-skills/scripts/init.js .
node .qian-skills/scripts/docs-check.js --project .
node .qian-skills/scripts/generate-index.js --project .
node .qian-skills/scripts/context-generator.js --project .
```

## Hard Invariants

Never trade away authorization, least privilege, privacy, secret handling, data integrity, payment
evidence, truthful degraded states, source provenance, deterministic AI state changes, reversible
deployment, append-only migration history, explicit ownership, operational observability, or minimum
sufficient implementation.

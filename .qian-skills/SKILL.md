---
name: qian-systems-engineering
description: Apply Qian Xuesen-inspired systems engineering to software and AI-assisted projects. Use for project bootstrap, architecture planning, subsystem decomposition, interface design, executable Issue breakdown, documentation governance, implementation, verification, release control, feedback analysis, and roadmap correction.
---

# 钱学森 Systems Engineering Skill

Use this skill to govern software as a controlled, evolving system. Connect the overall objective,
subsystem design, interfaces, implementation actions, observations, deviations, corrective actions,
and retained knowledge.

## When To Use

- Bootstrapping or hardening a software project.
- Planning architecture, subsystem boundaries, or interface baselines.
- Breaking work into executable Issues.
- Coordinating human and AI agent work without relying on private chat history.
- Enforcing code, documentation, verification, and handoff synchronization.
- Reviewing deviations after tests, releases, incidents, telemetry, or user evidence.

Scale the workflow to risk. Local fixes use the micro loop; cross-module, data, permission, payment,
commercial, release, or roadmap work requires the fuller lifecycle and often an ADR.

## Core Loop

```text
objective r(t) -> issue/plan -> implementation -> observation y(t)
      ^                                      |
      +--- control action u(t) <- deviation e(t)
                           ^
                    disturbance d(t)
```

- `r(t)`: accepted user, business, engineering, or risk objective.
- `y(t)`: tests, telemetry, operations, cost, user evidence, and actual system state.
- `e(t)`: the gap between accepted intent and observed fact.
- `u(t)`: Issue, patch, rollback, flag change, runbook action, or ADR.
- `d(t)`: provider, policy, market, traffic, team, or dependency disturbance.

## Repository Setup

From a target project:

```bash
git submodule add https://github.com/JTCAO515/qian-systems-engineering.git .qian-skills
node .qian-skills/scripts/init.js .
node .qian-skills/scripts/docs-check.js --project .
node .qian-skills/scripts/generate-index.js --project .
node .qian-skills/scripts/context-generator.js --project .
```

This creates the minimum governance files:

- `docs/manifest.json`
- `docs/handoff.json`
- `docs/INDEX.md`
- `CONTEXT.md`
- `.github/ISSUE_TEMPLATE/standard.md`
- `docs/methodology/qian-systems-engineering.md`
- `docs/constraints/qian-systems-engineering.md`
- `docs/constraints/karpathy-guidelines.md`

## Lifecycle

### G0: Establish Overall Intent

Inspect local governance, git state, plans, ADRs, constraints, and real runtime. State assumptions,
system boundary, user outcome, anti-goals, owner, observations, and unresolved risk before changing
code.

### G1: Decompose And Freeze Interfaces

Decompose in this order:

```text
business outcome -> user capability -> subsystem -> module/owner -> interface baseline -> Issue
```

For cross-module schemas, APIs, events, migrations, state machines, and providers, define owner,
consumers, inputs, outputs, errors, authorization, privacy, idempotency, ordering, compatibility,
fixtures, and rollback.

### G2: Create Executable Issues

One Issue is one reviewable control action. It must include objective, subsystem, current
observation, deviation class, scope, do-not-touch boundary, interface/data/permission/commercial/docs
impact, dependencies, acceptance checks, observation window, risk, rollback, and owner.

### G3: Implement Code, Tests, And Docs Together

- Build the minimum authoritative context pack.
- Prefer a failing test, reproduction, contract example, or acceptance fixture first.
- Implement the simplest sufficient behavior.
- Keep edits surgical and local to the accepted scope.
- Update the smallest document that would otherwise become false.
- Record assumptions, unrun checks, and residual risk honestly.

### G4: Verify And Observe

Run the fastest relevant checks first, then broaden as risk requires:

1. schema and unit tests;
2. contract and integration tests;
3. lint, typecheck, build;
4. AI evals, migrations, permission, webhook, or payment tests when relevant;
5. browser/device acceptance;
6. staging or production smoke;
7. telemetry, operations, user outcomes, and cost.

### G5: Classify And Correct Deviations

| Class | Meaning | Response |
| --- | --- | --- |
| D0 | within accepted tolerance | record observation; no action |
| D1 | local, reversible, interface unchanged | current PR or small Issue |
| D2 | cross-module, contract, permission, commercial, or architectural | stop expansion; design/contract review |
| D3 | objective, positioning, roadmap, or governing model is wrong | accountable operator decision |

### G6: Archive Learning

After merge or the observation window, record expected versus observed result, side effects, new
unknowns, deviation class, continue/adjust/rollback/retire decision, next Issue or no-action reason,
and the updated handoff snapshot.

## Commands

```bash
node .qian-skills/scripts/init.js .
node .qian-skills/scripts/audit.js .
node .qian-skills/scripts/docs-check.js --project .
node .qian-skills/scripts/docs-impact.js --project . --base main
node .qian-skills/scripts/generate-index.js --project .
node .qian-skills/scripts/context-generator.js --project .
```

In this repository, the same commands are exposed as npm scripts:

```bash
npm run docs:check
npm run docs:impact -- --base HEAD~1
npm run docs:generate-index
npm run context:generate
npm run audit
```

## Hard Invariants

Never trade away authorization, least privilege, privacy, secret handling, data integrity, payment
evidence, truthful degraded states, source provenance, deterministic AI state changes, reversible
deployment, append-only migration history, explicit ownership, operational observability, or minimum
sufficient implementation.

## Deliverables For Substantial Work

Return or commit:

1. objective and boundary;
2. subsystem/interface map;
3. executable Issue or implementation diff;
4. synchronized docs and decision records;
5. verification output;
6. expected-versus-observed deviation statement;
7. rollout, rollback, owner/date, and archived learning;
8. updated handoff and mandatory reading order.

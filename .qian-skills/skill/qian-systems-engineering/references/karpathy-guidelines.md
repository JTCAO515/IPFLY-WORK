# Karpathy Guidelines

Status: active
Methodology: [钱学森 Skills](methodology.md)

These implementation rules reduce common AI coding failures. They are applied inside the
Qian systems engineering lifecycle as the local coding discipline.

## Think Before Coding

- State material assumptions before changing code.
- Inspect authoritative local context before asking for clarification.
- Use a bounded, reversible assumption for low-risk ambiguity.
- Ask the accountable operator when ambiguity can change contracts, permissions, money, data
  ownership, public promises, or irreversible outcomes.

## Simplicity First

- Implement the smallest behavior that satisfies the accepted objective and evidence.
- Do not add speculative features, abstraction, configuration, or dependencies.
- Prefer existing repository patterns over new local inventions.
- Reduce the diff when the implementation is larger than the behavior requires.

## Surgical Changes

- Touch only files required by the accepted scope.
- Match the existing style of the owning module.
- Remove only dead code made obsolete by the current change.
- Mention unrelated cleanup opportunities separately instead of bundling them into the change.

## Goal-Driven Execution

- Bind each implementation step to a reproducible check.
- Prefer a failing test, reproduction, contract fixture, or acceptance check before the fix.
- Continue until checks pass or an honest blocker is recorded.
- Report unrun checks and residual risk plainly.

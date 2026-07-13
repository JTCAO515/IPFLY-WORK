# Qian Systems Engineering PR Checklist

## Summary

<!-- Clear 1-2 sentence description of the change -->

## Issue Link

Closes #___

## Deviation Classification

**Level:** D0 / D1 / D2 / D3

**Rationale:** _(e.g., "Single-module, reversible, no interface change")_

## Documentation Updates

- [ ] Related docs in `docs/` updated
- [ ] `docs/manifest.json` updated (if new docs)
- [ ] `docs/handoff.json` synchronized
- [ ] Run: `npm run docs:impact --base main` (no failures)

## Testing

- [ ] Unit tests added/updated
- [ ] Acceptance criteria verified
- [ ] Related modules tested (if cross-module)

## Acceptance

- [ ] Implementation matches Issue acceptance criteria
- [ ] Diff is focused (no unrelated refactors)
- [ ] Assumptions documented (if any)
- [ ] Rollback procedure exists (if production code)

## Reviewer Checklist

- [ ] D0-D3 deviation justified
- [ ] No scope creep beyond Issue
- [ ] No breaking interface changes
- [ ] Tests and docs both present
- [ ] Can be reviewed without chat history

---

**Framework:** Qian Systems Engineering v1.0.0

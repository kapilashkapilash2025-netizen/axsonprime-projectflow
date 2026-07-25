# ADR 0005: Release Readiness Rules

## Status

Accepted

## Context

The MVP spec requires a release-readiness panel with three possible
statuses — Ready, At Risk, Not Ready — and "clear reasons for the calculated
status." A single blended score (like the health score in ADR 0004) is the
wrong shape here: some conditions (failing tests, open critical bugs) should
_always_ block a release regardless of how well everything else looks, while
others (changelog not updated yet) are worth flagging but shouldn't be
indistinguishable from "the build is broken."

## Decision

Implemented in `src/domain/releaseReadiness.ts` as `calculateReleaseReadiness`.
Every input criterion is evaluated into a boolean "satisfied" reason (all of
which are always returned, so the UI can show the full checklist, not just the
failures). Criteria are split into two tiers:

**Hard blockers — any one forces `NOT_READY`:**

- Not all required tasks are completed (`requiredTasksCompleted < requiredTasksTotal`).
- There is at least one open critical issue (`criticalOpenIssues > 0`).
- Any of the `UNIT_TESTS`, `E2E_TESTS`, or `PRODUCTION_BUILD` quality gates is
  not passing.

**Soft blockers — can only downgrade `READY` to `AT_RISK`, never force `NOT_READY` on their own:**

- Any other quality gate (lint, type check, integration tests, security
  review, accessibility review, documentation review) is not passing.
- Documentation has not been reviewed.
- The changelog has not been updated.
- No version has been assigned yet.

Status logic:

```
if any hard blocker:      NOT_READY
else if any soft blocker: AT_RISK
else:                     READY
```

## Consequences

- A project can never look "Ready" while its tests or build are failing, no
  matter how much of the soft checklist is done — this matches how a
  responsible team would actually gate a release.
- The reasons array is exhaustive (covers every criterion, satisfied or not),
  which is what lets the Reports page and the project detail panel render an
  actual checklist instead of a single opaque verdict.
- `tests/unit/releaseReadiness.test.ts` locks in the hard-vs-soft distinction
  explicitly (e.g. "is NOT_READY when unit tests or the production build are
  failing" as a dedicated case) so a future refactor can't accidentally
  demote a hard blocker to a soft one without a test failing.
- This is a simpler two-tier model, not a weighted score — deliberately, since
  "60% of criteria met" is a meaningless way to describe release safety.

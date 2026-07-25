# ADR 0004: Deterministic Project Health Score Formula

## Status

Accepted

## Context

The dashboard and project detail pages need a single number that summarizes
"how healthy is this project right now." The MVP spec requires this score to
be **deterministic** (same inputs always produce the same output — no random
jitter or time-of-day noise), **documented**, and **tested**. It must not be a
placeholder metric that looks like real analytics but isn't.

## Decision

Implemented in `src/domain/healthScore.ts` as `calculateProjectHealthScore`, a
pure function of `{ tasks, issues, qualityGates, milestones, now }`. The score
is 0–100, built from two positive components and three capped penalties:

**Positive components (max 100 combined):**

| Component       | Max points | Rule                                                                                                                                                                             |
| --------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Task completion | 50         | `(completed tasks / total tasks) * 50`. A project with **no tasks yet** scores the full 50 here — an empty backlog isn't evidence of a problem.                                  |
| Quality gates   | 50         | `(passed gates / total gates) * 50`. A project with **no quality gates configured** scores **0** here — unlike tasks, an unverified project is a real risk, not a neutral state. |

**Penalties (each independently capped, then summed and subtracted):**

| Penalty              | Cap | Rule                                                                                           |
| -------------------- | --- | ---------------------------------------------------------------------------------------------- |
| Critical/high issues | 30  | 10 points per open (`OPEN` or `IN_PROGRESS`) `CRITICAL` issue, 4 points per open `HIGH` issue. |
| Overdue tasks        | 20  | 3 points per incomplete task whose `dueDate` has passed.                                       |
| Overdue milestones   | 15  | 5 points per incomplete milestone whose `dueDate` has passed.                                  |

Final score = `clamp(taskCompletionScore + qualityGateScore - sum(penalties), 0, 100)`.

The function also returns a `breakdown` object with every intermediate value,
so the UI (or a future report) can explain _why_ a project scored what it
scored instead of presenting an opaque number.

## Consequences

- Because the function takes a plain data snapshot and `now` as an explicit
  argument (not `new Date()` internally), it is trivially testable —
  `tests/unit/healthScore.test.ts` covers the empty-project case, the
  perfect-project case, penalty capping, and that resolved/non-critical issues
  don't affect the score.
- The weights (50/50 split, 10/4/3/5 point penalties, caps) are a considered
  starting point, not derived from user data (there isn't any yet). If real
  usage shows the formula over- or under-weights a factor, change the
  constants at the top of `healthScore.ts` and update this ADR and its tests
  in the same change — the formula and its documentation must never drift
  apart.
- The score intentionally does **not** factor in project priority or status;
  it measures the state of the work, not how important the project is.

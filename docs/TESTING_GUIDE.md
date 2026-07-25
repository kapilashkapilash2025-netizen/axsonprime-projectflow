# Testing Guide

ProjectFlow has three layers of automated tests, matched to what each is good
at — this mirrors the "test failure cases and edge cases, not just the happy
path" requirement in the project brief.

## Unit tests (Vitest) — `tests/unit/`

Cover `src/domain` — pure, deterministic functions with no DOM and no
database. These are the fastest tests and the most important ones for the
project's two core guarantees: the health score and release-readiness status
are deterministic and documented (see ADR 0004 and ADR 0005).

Run: `pnpm test` (or `pnpm test:watch` while developing).

What's covered today:

- `healthScore.test.ts` — empty-project baseline, perfect score, determinism
  (same input twice → identical output), penalty capping at their maximums,
  that resolved issues don't count against the score, and that the score
  never leaves the 0–100 range.
- `releaseReadiness.test.ts` — the READY / AT_RISK / NOT_READY tri-state
  logic, specifically that hard blockers (failing tests/build, open critical
  issues, incomplete required tasks) force NOT_READY even when everything
  else is fine, while soft blockers (docs, changelog, version, non-critical
  gates) only ever produce AT_RISK.

When adding a new domain function, add both a "everything satisfied" test and
at least one test per failure/edge condition it's meant to catch — a domain
function with only a happy-path test hasn't proven its edge-case behavior.

## Component tests (Vitest + React Testing Library) — `tests/component/`

Cover presentational components in isolation — rendering, accessible names,
and text output — without a browser or a running server.

Run: `pnpm test` (same command; Vitest picks up both `tests/unit` and
`tests/component` per `vitest.config.ts`).

## End-to-end tests (Playwright) — `tests/e2e/`

Cover a small number of _critical_ flows end-to-end against a real dev server
and the real (seeded) SQLite database — deliberately not exhaustive UI
coverage, per the project brief's "critical end-to-end testing" scope:

- The dashboard loads and renders its summary cards.
- A user can create a project through the form and see it in the project
  list.
- A user can open a seeded project and see its quality checklist.

Run: `pnpm test:e2e` (starts its own dev server on port 3418 automatically;
see `playwright.config.ts`). First run on a new machine needs browser
binaries: `pnpm exec playwright install --with-deps chromium`.

## Coverage

`pnpm test:coverage` generates a v8 coverage report scoped to
`src/domain`, `src/services`, and `src/components` — the layers where logic
bugs are both likely and expensive. UI plumbing in `src/app` is exercised by
the Playwright suite instead of unit coverage targets.

## CI

Unit/component tests via Vitest, plus lint, typecheck, and build, run as the
required `CI` workflow on every push and pull request — see
`.github/workflows/ci.yml`.

Playwright runs in a separate `E2E (Playwright)` workflow
(`.github/workflows/e2e.yml`) against a freshly migrated and seeded
database, with the Chromium browser cached between runs and the HTML report
uploaded as a build artifact on every run (not just failures). This job is
intentionally **non-blocking** (`continue-on-error: true`) for now: browser
installs add real runtime, and we want a track record of green runs before
making it a hard merge gate — see `docs/ROADMAP.md`.

# Project Status

_Last updated: 2026-07-25 (initial baseline)._

## Summary

The MVP described in the project brief is implemented end-to-end: dashboard,
project management, phases/tasks, issues, quality gates, GitHub workflow
tracking (manual entry), release readiness, print-friendly reports,
search/filtering, and settings — all backed by a local SQLite database via
Prisma, with sample data that's clearly marked and removable.

## Validation status (this baseline)

| Check                                     | Status                     |
| ----------------------------------------- | -------------------------- |
| Install (`pnpm install`)                  | Passing                    |
| Lint (`pnpm lint`)                        | Passing, 0 errors/warnings |
| Type check (`pnpm typecheck`)             | Passing                    |
| Unit + component tests (`pnpm test`)      | 18/18 passing              |
| E2E critical-path tests (`pnpm test:e2e`) | 3/3 passing                |
| Production build (`pnpm build`)           | Passing                    |

## Known limitations

- No authentication or multi-user support (by design for this stage — see
  `docs/SECURITY_BASELINE.md`).
- GitHub workflow tracking is manual entry only; no live GitHub API sync yet.
- Playwright e2e tests are not yet wired into CI (see `docs/ROADMAP.md`).
- Task dependencies (`dependsOnIds`) exist in the data model but have no
  dedicated UI yet beyond being stored.
- No CSV/PDF export for reports yet.

## Remaining risks

- The health score and release-readiness formulas (ADR 0004, ADR 0005) are
  first-pass weights, not derived from real usage data — they may need
  tuning once the project has real projects tracked in it over time.
- Accessibility has been designed for (semantic HTML, labeled form fields,
  focus-visible states, skip link, `aria-current` on nav) but has not yet had
  a dedicated screen-reader/keyboard audit pass — tracked as a roadmap item.

## How this file is maintained

This file is a snapshot, not a changelog — it should be updated at the end of
each meaningful phase of work to reflect current reality, not appended to
indefinitely. See `CHANGELOG.md` for the historical record of what shipped
when.

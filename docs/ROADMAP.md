# Roadmap

This roadmap reflects genuine planned work, not a marketing wishlist. Items
move up as real usage surfaces real needs.

## Now (MVP, this repository's initial milestone)

- [x] Architecture, domain model, and Prisma schema
- [x] Responsive application shell, navigation, dark/light theme
- [x] Project management (create/edit/archive, status, priority, progress)
- [x] Phases, tasks, subtasks, labels, acceptance criteria
- [x] Issue and bug tracking
- [x] Deterministic, documented, tested project health score
- [x] Quality-gate checklist per project
- [x] Manual GitHub workflow tracking (repo/branch/PR/CI/review/merge fields)
- [x] Release-readiness panel with clear reasons
- [x] Print-friendly project status report
- [x] Search/filter on projects, tasks, and issues
- [x] Local settings (org name, default status, date format, theme)
- [x] Sample data, clearly marked, removable from Settings
- [x] Unit, component, and critical-path e2e test coverage
- [x] CI (lint, typecheck, test, build), CodeQL, Dependabot

## Next

- [ ] Wire Playwright into CI as a non-blocking job (needs browser binaries
      cached in the runner; see `docs/TESTING_GUIDE.md`)
- [ ] Phase/task drag-and-drop reordering (a genuine candidate for adopting
      React Hook Form on the client side — see ADR 0001)
- [ ] Task dependency graph visualization (the data model already has
      `dependsOnIds`; there's no UI for it yet)
- [ ] Bulk actions on the Tasks/Issues list views
- [ ] CSV export for reports

## Later

- [ ] Optional GitHub API integration to auto-populate `GitHubLink` fields
      (issue/PR status, CI status) instead of manual entry — the domain
      layer was deliberately designed so this doesn't require a schema or
      architecture change, only a new sync service (see
      `docs/ARCHITECTURE.md`)
- [ ] Multi-user support: authentication, per-user/organization data
      isolation, and rate limiting (see `docs/SECURITY_BASELINE.md` for the
      concrete plan)
- [ ] Swap SQLite for Postgres for hosted/team deployments
- [ ] PDF export for reports, if it can be added without meaningfully
      increasing bundle size or build complexity

## Explicitly not planned

- Paid/hosted infrastructure requirements for the core local-first experience
- Telemetry or usage analytics by default
- Fabricated or placeholder metrics anywhere in the UI

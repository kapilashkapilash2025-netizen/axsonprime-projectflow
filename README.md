# AXSONprime ProjectFlow

A local-first project and development workflow dashboard for solo developers,
students, startup founders, and small software teams — one place to track
projects, phases, tasks, bugs, quality gates, GitHub workflow status, and
release readiness, instead of juggling that across a dozen disconnected
tools.

## Overview

Solo developers and small teams typically track their work across a task
manager, a bug tracker, a spreadsheet for release checklists, and their
GitHub repository itself — with nothing tying those views together. Every bit
of that context lives somewhere else, so answering "is this project actually
ready to ship?" means checking four different tools.

ProjectFlow combines those workflows into a single, local dashboard: projects
and phases, tasks and subtasks, bugs and feature requests, per-project quality
gates, manually-tracked GitHub workflow state (branch/PR/CI/review/merge
status), and a deterministic release-readiness assessment with clear reasons
for its verdict — all backed by a SQLite database on your own machine, with
no required cloud service, account, or API token.

## Screenshots

_Screenshots will be added once the UI has stabilized past this initial
release — clone the repo and run `pnpm dev` to see it live in the meantime._

## Features

- **Dashboard** — total/active projects, task counts by state, upcoming
  milestones, per-project health scores, quality-gate pass rate, and
  release-readiness counts at a glance.
- **Project management** — create/edit/archive projects; track status,
  priority, tech stack, repository URL, target release date, and progress.
- **Phases, tasks & subtasks** — priorities, assignees (free text for the
  MVP), due dates, labels, dependencies, and acceptance criteria.
- **Issue & bug tracking** — bugs, feature requests, security items,
  documentation and testing work, and technical debt, each with severity,
  status, acceptance criteria, and resolution notes.
- **Quality gates** — a per-project checklist (lint, type check, unit/
  integration/E2E tests, production build, security/accessibility/
  documentation review) that feeds a deterministic, documented, and tested
  project health score.
- **GitHub workflow tracking** — manually record repository URL, branch,
  issue/PR numbers, CI/review/merge status per project. No GitHub token
  required; designed so real API integration can be added later without
  touching the domain layer (see `docs/ARCHITECTURE.md`).
- **Release readiness** — a Ready / At Risk / Not Ready verdict with the
  specific reasons behind it (see `docs/adr/0005-release-readiness-rules.md`).
- **Reports** — a print-friendly, per-project status report covering phase
  completion, quality checks, open risks, and release readiness.
- **Search & filtering** — across projects, tasks, and issues by name,
  status, priority, type, label, project, and date.
- **Settings** — application name, organization name (defaults to
  "AXSONprime", editable), default project status, date format, and theme.

## Architecture summary

Next.js App Router pages call small services and repositories; all business
rules (the health score, release readiness) live in framework-free,
independently unit-tested `src/domain` functions. Full details in
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and the decision records in
[`docs/adr/`](docs/adr/).

## Requirements

- Node.js 20.19+ / 22.12+ / 24+
- pnpm 9+

## Installation

```bash
git clone https://github.com/AXSONprime/axsonprime-projectflow.git
cd axsonprime-projectflow
pnpm install
```

## Database setup

```bash
cp .env.example .env
pnpm db:migrate
pnpm db:seed
```

This creates a local `prisma/dev.db` SQLite file and loads three sample
projects (clearly flagged as sample data — removable any time from the
Settings page).

## Development

```bash
pnpm dev
```

Then open http://localhost:3000. See [`docs/DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md)
for the full command reference and contribution workflow.

## Testing

```bash
pnpm test         # unit + component tests (Vitest + React Testing Library)
pnpm test:e2e     # critical-path end-to-end tests (Playwright)
```

Details in [`docs/TESTING_GUIDE.md`](docs/TESTING_GUIDE.md).

## Build

```bash
pnpm build
pnpm start
```

## Contributing

Contributions are welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md) for the
branch naming, commit message, and pull-request conventions this project
uses.

## Security

See [`SECURITY.md`](SECURITY.md) for how to report a vulnerability, and
[`docs/SECURITY_BASELINE.md`](docs/SECURITY_BASELINE.md) for the current
security posture and the plan for adding authentication/authorization later.

## Roadmap

See [`docs/ROADMAP.md`](docs/ROADMAP.md).

## License

MIT — see [`LICENSE`](LICENSE).

---

Built by AXSONprime

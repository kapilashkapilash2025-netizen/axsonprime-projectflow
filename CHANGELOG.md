# Changelog

All notable changes to this project are documented in this file. The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this project intends to adhere to [Semantic Versioning](https://semver.org/)
once it reaches its first tagged release.

## [Unreleased]

### Added

- Initial project scaffold: Next.js (App Router) + TypeScript strict mode +
  Tailwind CSS + Prisma/SQLite + Zod + Vitest + React Testing Library +
  Playwright + ESLint + Prettier, managed with pnpm.
- Domain model and Prisma schema for Project, Phase, Task, Issue,
  QualityGate, Milestone, Release, ActivityEvent, GitHubLink, and AppSettings.
- Deterministic, documented, unit-tested project health score
  (`src/domain/healthScore.ts`, ADR 0004).
- Deterministic, documented, unit-tested release-readiness assessment
  (`src/domain/releaseReadiness.ts`, ADR 0005).
- Dashboard, Projects, Tasks, Issues, Quality, Releases, Reports, and
  Settings pages with real create/edit/toggle functionality backed by
  Server Actions and Zod validation.
- Manual GitHub workflow tracking per project (repository, branch, issue/PR
  numbers, CI/review/merge status).
- Print-friendly per-project status report.
- Search and filtering across projects, tasks, and issues.
- Sample data (three projects, phases, tasks, issues, quality gates, one
  release) clearly flagged as sample data and removable from Settings.
- Responsive, accessible application shell with dark (default) and light
  themes, neon-blue/deep-maroon brand accents.
- Security headers, server-side validation on every mutation, and a
  documented security baseline (`docs/SECURITY_BASELINE.md`).
- CI (lint, typecheck, unit/component tests, build, dependency audit),
  CodeQL, and Dependabot.
- Full documentation set: README, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT,
  and `docs/` (architecture, development guide, testing guide, security
  baseline, roadmap, project status, GitHub workflow progress, and five
  ADRs).

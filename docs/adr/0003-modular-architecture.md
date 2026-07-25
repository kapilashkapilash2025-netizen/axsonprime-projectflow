# ADR 0003: Modular Architecture

## Status

Accepted

## Context

The MVP already spans nine feature areas (dashboard, projects, tasks, issues,
quality gates, GitHub tracking, releases, reports, settings). Without an
explicit layering rule, business logic (like the health score or release
readiness calculations) tends to leak into page components, becoming
untestable and hard to reuse across the dashboard, a project's detail page,
and the reports page simultaneously.

## Decision

Split the codebase into layers with a one-way dependency rule — each layer may
depend only on the layers listed after it:

1. **`src/app`** — Next.js routes (Server Components, Server Actions entry
   points via `src/features/*/actions.ts`). Pages fetch data through services/
   repositories and render presentation components. No business logic lives
   here beyond simple request parsing (search params, form data).
2. **`src/features/<name>`** — feature-scoped Server Actions and client form
   components (e.g. `src/features/projects/actions.ts`,
   `src/features/projects/ProjectForm.tsx`). This is the "application" layer:
   it orchestrates validation + repositories + activity logging for one
   feature, but contains no cross-feature business rules.
3. **`src/domain`** — pure, framework-free TypeScript: types (`types.ts`) and
   deterministic calculations (`healthScore.ts`, `releaseReadiness.ts`). These
   files import nothing from Next.js, Prisma, or React, which is what makes
   them unit-testable in milliseconds without a database (see
   `tests/unit/healthScore.test.ts`).
4. **`src/services`** — glue between domain calculations and the database:
   fetch the minimal Prisma projection a domain function needs, call the pure
   function, return the result. `getProjectHealth` and `getDashboardData` live
   here.
5. **`src/repositories`** — the only files allowed to import `@/lib/db`
   (the Prisma client). Each repository owns one Prisma model's CRUD
   operations and shapes Zod-validated form values into Prisma `data` objects.
6. **`src/validation`** — Zod schemas, one per form, shared between Server
   Actions (server-side enforcement) and, where useful, client components.
7. **`src/components`** — presentational, reusable UI (`ui/*` primitives plus
   cross-feature pieces like `StatusBadge`, `AppShell`). No data fetching.
8. **`src/lib`** — shared utilities with no feature awareness (`cn`,
   `formatDate`, the Prisma client singleton).

## Consequences

- The health score and release readiness formulas are pure functions with
  their own unit test files and their own ADRs (0004, 0005) — a reviewer can
  verify the business rule without standing up a database or a browser.
- Adding a new feature means adding a new `src/features/<name>` folder rather
  than editing a monolithic `actions.ts` or `api/` directory.
- The layering is enforced by convention and code review today, not by a lint
  rule. If the project grows enough contributors that violations become
  frequent, adding an ESLint import-boundary rule (e.g.
  `eslint-plugin-boundaries`) is the natural next step — deliberately deferred
  until there's evidence it's needed.

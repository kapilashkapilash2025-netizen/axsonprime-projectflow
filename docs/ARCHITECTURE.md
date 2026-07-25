# Architecture

ProjectFlow is a Next.js (App Router) application backed by a local SQLite
database via Prisma. This document is a map of the codebase; see
`docs/adr/` for the reasoning behind individual decisions.

## Layers

See [ADR 0003](adr/0003-modular-architecture.md) for the full rationale. In
short, dependencies flow one way:

```
app (routes)
  -> features (Server Actions + client forms)
    -> services (domain + repository glue)
      -> domain (pure calculations, no framework/DB imports)
      -> repositories (the only layer that imports the Prisma client)
        -> validation (Zod schemas)
components (presentational, no data fetching)
lib (framework-agnostic shared utilities)
```

## Directory structure

```text
src/
  app/            Next.js routes — pages, layouts, loading/error/not-found states
  components/     Reusable presentational components (ui/ primitives + shared pieces)
  features/       Per-feature Server Actions and client form components
  domain/         Pure TypeScript types and deterministic business calculations
  services/       Composes domain calculations with repository data for pages
  repositories/    Prisma-backed data access, one file per model area
  validation/     Zod schemas for every form
  lib/            Prisma client singleton, cn()/formatDate()/etc. utilities
prisma/
  schema.prisma   Data model
  migrations/     Generated SQL migrations
  seed.ts         Sample data, all rows flagged isSample: true
tests/
  unit/           Vitest tests for src/domain (no DOM, no DB)
  component/      Vitest + React Testing Library tests for src/components
  e2e/            Playwright tests for critical user flows
docs/
  adr/            Architecture Decision Records
```

## Domain model

Nine Prisma models back the feature set: `Project`, `Phase`, `Task`, `Issue`,
`QualityGate`, `Milestone`, `Release`, `ActivityEvent`, `GitHubLink`, plus a
singleton `AppSettings` row. See `prisma/schema.prisma` for the full field
list and enums (`ProjectStatus`, `Priority`, `TaskStatus`, `IssueType`,
`Severity`, `IssueStatus`, `QualityCheckType`, `PhaseStatus`) — the same enum
value sets are mirrored as plain TypeScript literal unions in
`src/domain/types.ts` so domain code has zero dependency on generated Prisma
types.

## Data flow for a typical page

Using the project detail page (`src/app/projects/[id]/page.tsx`) as an
example:

1. The page (Server Component) calls `getProjectById` (repository) for the
   raw data, and `getProjectHealth` / `getReleaseReadiness` (services) for
   the derived scores.
2. Services fetch a minimal Prisma projection and pass it into the relevant
   pure `src/domain` function.
3. The page renders presentational components (`Card`, `StatusBadge`,
   `HealthScore`, `QualityChecklist`, `ReleaseReadinessPanel`) with that data.
4. Mutations (toggling a quality gate, editing a project, recording a
   release) are Server Actions in `src/features/<feature>/actions.ts`, called
   directly from a `<form action={...}>` — no client-side fetch/JSON API
   layer exists for the MVP.

## GitHub workflow tracking

`GitHubLink` is deliberately a thin, manually-entered record (repository URL,
branch, issue/PR numbers, CI/review/merge status as free text) rather than a
GitHub API integration. This keeps the MVP free of required tokens while
leaving a clear seam: a future `services/githubSyncService.ts` could populate
the same `GitHubLink` rows from the GitHub REST/GraphQL API without any
change to the domain layer, repositories, or UI.

## Extensibility notes

- **Swapping SQLite for Postgres/MySQL**: change the `datasource` provider and
  connection string in `prisma/schema.prisma`; no application code depends on
  SQLite-specific behavior.
- **Multi-user / authentication**: see `docs/SECURITY_BASELINE.md` for how
  this would be layered on without restructuring the domain layer.

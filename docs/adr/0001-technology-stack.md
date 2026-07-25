# ADR 0001: Technology Stack

## Status

Accepted

## Context

ProjectFlow needs a stack that a solo developer or small team can run entirely on
their own machine, that is approachable for open-source contributors, and that
scales from a single-file SQLite database to a more heavily used deployment
later without a rewrite.

## Decision

- **Next.js (App Router) + React** for the application shell, routing, and
  server-rendered pages. Server Components let us query the database directly
  from page components without hand-rolling a separate API layer for the MVP.
- **TypeScript in strict mode** across the whole codebase.
- **Tailwind CSS** for styling, with design tokens (`src/app/globals.css`)
  driving the neon-blue / deep-maroon brand rather than one-off hex values.
- **Prisma ORM 6.x with SQLite** for data access. We deliberately stayed on the
  Prisma 6 line rather than 7: Prisma 7 (released the same week this project
  started) replaced the `datasource { url = env(...) }` schema pattern with a
  driver-adapter model requiring `prisma.config.ts` and an explicit adapter
  package. That's a reasonable direction, but adopting a brand-new major
  version's breaking config model on day one of a new project raised avoidable
  risk for a small, contributor-facing OSS project. Revisit this once Prisma 7
  has a few point releases behind it — see the "Future work" note below.
- **Zod** for all server-side input validation (see ADR 0003).
- **React Hook Form** is in the dependency tree for future complex,
  highly-interactive forms (e.g. a drag-and-drop task board or multi-step
  release wizard). The current MVP forms are plain HTML forms bound to Next.js
  Server Actions with Zod validation — that combination already gives
  progressive enhancement (forms work without client JS) and server-side
  validation for free, so adding a client form library on top of every CRUD
  form would be complexity without benefit. We reach for RHF the moment a form
  needs non-trivial client-side interactivity that Server Actions alone can't
  express.
- **Vitest** for domain/service unit tests and **React Testing Library** for
  component tests, run together via `vitest`.
- **Playwright** for a small number of _critical_ end-to-end flows (dashboard
  loads, create a project, open a project) rather than exhaustive UI coverage.
- **ESLint + Prettier** for linting and formatting, wired to Next.js's
  recommended config plus `eslint-config-prettier` to avoid conflicting rules.
- **pnpm** as the package manager.
- **GitHub Actions** for CI (lint, typecheck, unit tests, build) and CodeQL for
  static security analysis.

## Consequences

- No cloud infrastructure is required to run or develop ProjectFlow.
- Server Actions mean mutations are colocated with the feature that owns them
  (`src/features/<feature>/actions.ts`), keeping the domain/repository layers
  framework-agnostic.
- Pinning Prisma to 6.x is a conscious, temporary trade-off, not an oversight;
  it's recorded here so it isn't "rediscovered" as a bug later.

## Future work

- Re-evaluate a Prisma 7 upgrade (driver adapters + `prisma.config.ts`) once
  the release has matured, or when we're ready to add a non-SQLite datasource.
- Consider React Hook Form for a specific complex form once one exists.

# Development Guide

## Prerequisites

- Node.js 20.19+ or 22.12+ (see `package.json` engines note below)
- [pnpm](https://pnpm.io/) 9+
- Git

## First-time setup

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Visit http://localhost:3000. You should see three sample projects on the
dashboard.

## Everyday commands

| Command                             | What it does                                                |
| ----------------------------------- | ----------------------------------------------------------- |
| `pnpm dev`                          | Start the Next.js dev server                                |
| `pnpm build`                        | Production build (also runs the TypeScript check)           |
| `pnpm start`                        | Run the production build locally                            |
| `pnpm lint`                         | ESLint                                                      |
| `pnpm typecheck`                    | `tsc --noEmit`                                              |
| `pnpm format` / `pnpm format:check` | Prettier write / check                                      |
| `pnpm test`                         | Vitest (unit + component tests), single run                 |
| `pnpm test:watch`                   | Vitest in watch mode                                        |
| `pnpm test:coverage`                | Vitest with coverage report                                 |
| `pnpm test:e2e`                     | Playwright critical-path tests (starts its own dev server)  |
| `pnpm db:migrate`                   | Create/apply a Prisma migration in dev                      |
| `pnpm db:generate`                  | Regenerate the Prisma client after a schema change          |
| `pnpm db:seed`                      | Re-run the sample data seed script                          |
| `pnpm db:reset`                     | Drop and recreate the local database from migrations + seed |

## Working on a feature

1. Add or adjust the Prisma model in `prisma/schema.prisma`, then
   `pnpm db:migrate` to generate a migration.
2. Mirror any new enum/type in `src/domain/types.ts` — domain code should
   never import Prisma's generated types directly (see
   [ADR 0003](adr/0003-modular-architecture.md)).
3. Add repository functions in `src/repositories/<model>Repository.ts`.
4. Add a Zod schema in `src/validation/<form>.ts`.
5. Add Server Actions in `src/features/<feature>/actions.ts`.
6. Build the page/component in `src/app/...` or `src/features/<feature>/`.
7. Write or update tests (see `docs/TESTING_GUIDE.md`).
8. Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` before opening
   a pull request.

## Code style

- TypeScript strict mode is non-negotiable; don't add `any` or `@ts-ignore`
  without a comment explaining why it's unavoidable.
- Business rules (scoring, readiness, validation) belong in `src/domain` or
  `src/validation`, never inline in a page component.
- Prefer Server Components and Server Actions over client-side data fetching;
  reach for `"use client"` only when a component needs interactivity
  (form state, theme toggling, etc.).

# ADR 0002: Local-First Data Storage

## Status

Accepted

## Context

ProjectFlow's stated goal is to replace a scattering of disconnected tools for
a solo developer or small team, without requiring them to sign up for another
hosted service or pay for infrastructure just to track their own projects.

## Decision

Store all application data in a single SQLite file (`prisma/dev.db` locally,
configurable via `DATABASE_URL`) accessed exclusively through Prisma. There is
no hosted database, no required external service, and no network calls made
by the application itself at runtime.

Sample/demo data is seeded through `prisma/seed.ts` and every seeded row is
flagged `isSample: true`. The Settings page can delete all sample-flagged rows
in one action, so a new user can explore the app with realistic data and then
cleanly start from zero without hand-editing the database.

## Consequences

- **Single-user by design (for now).** SQLite's file-level locking makes it a
  poor fit for concurrent multi-user writes. ProjectFlow's MVP scope is a
  single developer or a small team taking turns on one machine/checkout, not a
  hosted multi-tenant product.
- **Migration path to a real backend is straightforward, not free.** Because
  all data access goes through Prisma repositories (`src/repositories/*`) and
  never through raw SQL scattered across pages, switching the datasource to
  Postgres/MySQL later is a `schema.prisma` + connection-string change, not an
  application rewrite. Multi-user authorization is a separate, larger addition
  — see `docs/SECURITY_BASELINE.md` for how that would be layered in.
- **No telemetry, no analytics, no phone-home.** This is a deliberate privacy
  and trust decision for a tool that stores someone's proprietary project and
  bug data, not just a cost-saving one.
- **Backups are the user's responsibility.** The database is a plain file;
  users who want history should back it up like any other local file (e.g.
  include it in their normal file backup routine), since ProjectFlow does not
  version or snapshot it automatically in the MVP.

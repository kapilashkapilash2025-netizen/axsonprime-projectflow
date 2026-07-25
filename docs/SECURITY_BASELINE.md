# Security Baseline

ProjectFlow is a local-first, single-user application in its current form.
This document records what's already in place, and how authentication,
authorization, and multi-user isolation would be layered in later without
requiring a rewrite. For how to _report_ a vulnerability, see `SECURITY.md`.

## What's implemented today

- **Server-side validation on every mutation.** Every Server Action parses
  its input through a Zod schema in `src/validation/` before touching the
  database — client-side validation is a UX nicety, never the source of
  truth. See `src/features/*/actions.ts`.
- **Safe error responses.** `src/app/error.tsx` renders a generic message and
  logs the real error to the server console only; no stack trace, query, or
  internal path is ever sent to the browser.
- **Parameterized queries only.** All database access goes through Prisma's
  query builder (`src/repositories/`); there is no raw SQL string
  concatenation anywhere in the codebase.
- **No unsanitized HTML rendering.** The codebase does not use
  `dangerouslySetInnerHTML` anywhere; all user-entered text (project
  descriptions, task titles, issue notes, etc.) is rendered as plain React
  text, which React escapes by default.
- **Open redirect protection.** The only redirects in the app
  (`redirect(...)` calls in Server Actions) target statically-known,
  same-origin paths built from a just-created record's own ID — never a
  user-supplied URL or query parameter.
- **Security headers** (`next.config.ts`): `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, a restrictive `Content-Security-Policy`
  (`default-src 'self'`, no third-party script/style/image/font/connect
  origins), `Referrer-Policy: strict-origin-when-cross-origin`, and a
  `Permissions-Policy` that denies camera/microphone/geolocation.
- **No secrets in the repository.** `.env` is gitignored; `.env.example`
  documents the one variable the app needs (`DATABASE_URL`) with no real
  values. There are no API keys or tokens required for the MVP at all.
- **No telemetry.** The application makes no outbound network calls of its
  own and collects no analytics.
- **Dependency auditing.** `pnpm audit` is run in CI (`.github/workflows/ci.yml`)
  and Dependabot (`.github/dependabot.yml`) opens PRs for outdated
  dependencies on a weekly schedule.
- **Static analysis.** CodeQL (`.github/workflows/codeql.yml`) scans the
  JavaScript/TypeScript codebase on every push to `main` and on a weekly
  schedule.

## Known gaps, by design, for the current single-user MVP

- **No authentication.** There is exactly one implicit "user" — whoever has
  filesystem access to the SQLite database file. This is appropriate for a
  local-first tool run by one developer, and inappropriate the moment the app
  is exposed on a network multiple people can reach.
- **No rate limiting.** Because the MVP has no network-exposed multi-tenant
  deployment target and no authentication to protect, there's no rate
  limiting on Server Actions. **This must be added before ProjectFlow is ever
  deployed anywhere reachable by untrusted clients** — see the plan below.
- **No CSRF token.** Next.js Server Actions carry built-in origin-checking
  protection against basic CSRF for same-origin deployments, but this hasn't
  been audited for a scenario where ProjectFlow is reverse-proxied behind a
  different origin.

## How authentication/authorization would be added later

This is a plan, not an implementation — recorded so the decision is
deliberate whenever the project takes on a hosted, multi-user deployment:

1. **Add a `User` model** to `prisma/schema.prisma` and a `userId` foreign key
   to `Project` (with cascading ownership down to `Task`, `Issue`, etc. via
   their existing `projectId` relation — no schema redesign needed, just one
   new column at the root).
2. **Introduce a session/auth layer** (e.g. an OSS-friendly library such as
   Auth.js) at the `src/app` layer only. Repositories would gain a required
   `userId` (or `organizationId`) parameter on every query — this is the
   single largest code change, but it's mechanical (add a `where: { userId }`
   clause) rather than architectural, because repositories already own 100%
   of the Prisma query surface (see ADR 0003).
3. **Authorization checks belong in `src/features/*/actions.ts`**, next to
   the validation that's already there: confirm the acting user owns (or is a
   collaborator on) the project referenced by a mutation before calling the
   repository.
4. **Add rate limiting** at the Server Action / route boundary once the app
   is network-exposed to more than one trusted user — a token-bucket
   middleware in front of mutating actions is enough for a self-hosted
   deployment; a hosted multi-tenant deployment would want it enforced at the
   edge/proxy layer too.
5. **Re-run the CSP and header review** once real user-generated content
   (e.g. avatars, uploaded attachments) is introduced — `img-src 'self' data:`
   would need to expand deliberately, not by default.

## Reporting a vulnerability

See `SECURITY.md`.

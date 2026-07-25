# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in ProjectFlow, please report it
privately rather than opening a public issue:

1. Use GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability)
   feature on this repository ("Security" tab → "Report a vulnerability"), if
   enabled.
2. If that isn't available, open a GitHub issue titled generically (e.g.
   "Security contact needed") without vulnerability details, and a maintainer
   will follow up with a private channel.

Please include:

- A description of the vulnerability and its potential impact
- Steps to reproduce, or a proof of concept
- The affected version/commit

We aim to acknowledge reports within 5 business days and to keep you updated
as the issue is investigated and (if confirmed) fixed. Please give us a
reasonable amount of time to address a confirmed issue before any public
disclosure.

## Supported versions

This project is pre-1.0. Security fixes are applied to the `main` branch;
there is no separate long-term-support branch yet.

## Scope and current security posture

ProjectFlow is a local-first, single-user application (see
[`docs/adr/0002-local-first-data-storage.md`](docs/adr/0002-local-first-data-storage.md)).
See [`docs/SECURITY_BASELINE.md`](docs/SECURITY_BASELINE.md) for a detailed
description of what's implemented today (input validation, safe error
handling, security headers, dependency auditing, CodeQL) and the known,
deliberate gaps for a single-user MVP (no authentication, no rate limiting)
along with the plan for closing them if/when ProjectFlow supports multi-user,
network-exposed deployments.

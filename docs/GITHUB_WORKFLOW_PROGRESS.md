# GitHub Workflow Progress

This document tracks legitimate repository workflows — issues, pull requests,
reviews, and releases — as they genuinely happen. It does not guarantee any
GitHub Achievement; GitHub determines eligibility independently, and nothing
in this file should be read as a claim that an achievement has been earned
until it is visibly confirmed on the profile (see "Achievement verification"
below).

## Pull requests

| PR                                                                                    | Purpose                                                                                                                         | Branch                       | Tests                                                                      | Status                          |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------- | ------------------------------- |
| [#12](https://github.com/kapilashkapilash2025-netizen/axsonprime-projectflow/pull/12) | Wire Playwright critical-path tests into CI as a non-blocking job; fixed a real strict-mode locator bug it surfaced (closes #5) | `ci/playwright-e2e-workflow` | Lint, typecheck, 18 unit/component tests, 3 e2e tests, build — all passing | Merged (squash), branch deleted |

## Co-authored contributions

| Commit or PR                                          | Contributors | Genuine contribution | Status |
| ----------------------------------------------------- | ------------ | -------------------- | ------ |
| _(none yet — no second contributor has participated)_ |              |                      |        |

## GitHub Discussions

| Repository   | Question | Answer summary | Accepted |
| ------------ | -------- | -------------- | -------- |
| _(none yet)_ |          |                |          |

## Repository quality improvements

| Improvement                                       | Status | Evidence                                                                                                                                                                                                           |
| ------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Initial architecture, domain model, Prisma schema | Done   | ADRs 0001–0005, `prisma/schema.prisma`                                                                                                                                                                             |
| CI (lint, typecheck, test, build)                 | Done   | `.github/workflows/ci.yml`                                                                                                                                                                                         |
| CodeQL static analysis                            | Done   | `.github/workflows/codeql.yml`                                                                                                                                                                                     |
| Dependabot                                        | Done   | `.github/dependabot.yml`                                                                                                                                                                                           |
| Issue/PR templates                                | Done   | `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md`                                                                                                                                                      |
| Full documentation set                            | Done   | `README.md`, `docs/`                                                                                                                                                                                               |
| Test coverage (unit/component/e2e)                | Done   | 18 Vitest tests, 3 Playwright tests                                                                                                                                                                                |
| Playwright wired into CI (non-blocking)           | Done   | `.github/workflows/e2e.yml`, [issue #5](https://github.com/kapilashkapilash2025-netizen/axsonprime-projectflow/issues/5), [PR #12](https://github.com/kapilashkapilash2025-netizen/axsonprime-projectflow/pull/12) |

## Releases

| Version                                                | Date | Status |
| ------------------------------------------------------ | ---- | ------ |
| _(none yet — no version has been tagged or published)_ |      |        |

## Achievement verification

| Achievement         | Confirmed on profile | Confirmation date |
| ------------------- | -------------------- | ----------------- |
| Pull Shark          | No                   | —                 |
| Pair Extraordinaire | No                   | —                 |
| Galaxy Brain        | No                   | —                 |
| Starstruck          | No                   | —                 |
| Quickdraw           | No                   | —                 |
| YOLO                | No                   | —                 |
| Public Sponsor      | No                   | —                 |

# Contributing to ProjectFlow

Thanks for considering a contribution. This project aims to stay genuinely
useful and maintainable — every pull request should represent real,
reviewable work.

## Getting set up

See [`docs/DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md) for install,
database setup, and the full command reference.

## Before you start

- For anything beyond a trivial fix, open an issue first describing the
  problem or feature, so we can agree on the approach before you write code.
- Check `docs/ROADMAP.md` and existing issues to avoid duplicate work.

## Branch naming

```text
feat/<feature-name>
fix/<bug-name>
docs/<documentation-name>
test/<test-area>
refactor/<component-name>
security/<security-improvement>
ci/<workflow-name>
chore/<maintenance-task>
```

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat(auth): add secure session handling
fix(api): handle invalid request payloads
docs(readme): add local development instructions
test(users): add registration edge-case coverage
security(headers): configure production security headers
ci(quality): add lint and test workflow
refactor(core): simplify service dependency boundaries
chore(deps): update development dependencies
```

Each commit should represent one logical change, be understandable on its
own, and avoid touching unrelated files.

## Before opening a pull request

Run the full validation suite locally:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If your change touches a critical user flow, also run `pnpm test:e2e`.

## Pull request description

Please include:

- What changed and why
- The issue it closes (`Closes #123`), if any
- Screenshots for any UI change
- Confirmation that lint/typecheck/tests/build passed
- Any risks, migrations, or rollback considerations

## Code review

Pull requests are reviewed for correctness, security, accessibility,
maintainability, and test coverage before merging. Please be patient — this
is a project maintained on a volunteer basis.

## Reporting bugs and requesting features

Use the issue templates under `.github/ISSUE_TEMPLATE/`. Include enough
detail (steps to reproduce, expected vs. actual behavior, environment) for a
maintainer to act without back-and-forth.

## Security issues

Do not open a public issue for a security vulnerability — see
[`SECURITY.md`](SECURITY.md) instead.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By
participating, you're expected to uphold it.

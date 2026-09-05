# Agent Guidance

## Project

This repository builds a small game. The game rules are documented in [docs/rules.md](docs/rules.md).

## Commit conventions

Commit messages must follow Conventional Commits.

Format: `<type>[optional scope]: <description>`

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

This is enforced by a `commit-msg` pre-commit hook (`.pre-commit-config.yaml`), so non-conforming commit messages will be rejected.

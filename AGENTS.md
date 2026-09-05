# Agent Guidance

## Project

This repository builds a small game. 

See [README.md](README.md) for the game rules, setup instructions, available scripts, and project structure.

## Commit conventions

Commit messages must follow Conventional Commits.

Format: `<type>[optional scope]: <description>`

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

This is enforced by a `commit-msg` pre-commit hook (`.pre-commit-config.yaml`), so non-conforming commit messages will be rejected.

## Testing

Unit tests are written with Vitest. All generated code must be covered by unit tests.

Tests run on the `pre-commit` stage (`.pre-commit-config.yaml`), so uncommitted test failures will block a commit.

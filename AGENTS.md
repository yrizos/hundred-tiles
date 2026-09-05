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

Unit tests are written with Vitest. All generated code must be covered by unit tests. When changing the UI, also add or update component tests using React Testing Library.

Unit tests (`src/game/`) run on the `pre-commit` stage; component tests (`src/App.test.tsx`, `src/components/`) run on the `pre-push` stage (`.pre-commit-config.yaml`).

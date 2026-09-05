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

## Accessibility

All UI must meet WCAG 2.2 AA. In particular:

- Any new or changed color pairing (text/background, border/background) must be contrast-checked against WCAG 2.2 AA (4.5:1 for normal text, 3:1 for large text and non-text UI components) before merging.
- Text conveyed only through color must also get a non-color cue (border, icon, shape, text) — color alone cannot be the only way to distinguish a state.
- Dynamic status text (game outcome, progress, errors) must be exposed to assistive tech via `aria-live` or `role="status"`/`role="alert"`, not just rendered visually.
- Interactive elements need an accessible name that reflects their current state (e.g. a board cell's `aria-label` must include whether it's filled, valid, empty, or otherwise notable), not just its static position.
- Respect `prefers-reduced-motion` for any new animation or transition.
- Component tests must include an automated accessibility check (`jest-axe`'s `toHaveNoViolations`) for any new or changed rendered UI, in addition to behavioral assertions.

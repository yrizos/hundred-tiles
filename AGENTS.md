# Agent Guidance

## Project

This repository builds a small game.

See [README.md](README.md) for the game rules, setup instructions, available scripts, and project structure.

## Code conventions

Game logic is pure and lives in `src/game/*.ts`: no JSX, no mutation, every function returns new state instead of changing existing objects (see `src/game/gameState.ts`). React components under `src/components/` hold only UI state (open/closed, focus tracking, and similar).

Shared types (`Position`, `Board`, `GameState`) live in `src/game/types.ts`. Reuse them for new game concepts instead of redefining equivalent shapes.

Every component file gets a matching `.css` and `.test.tsx` in `src/components/`. Every game-logic file gets a matching `.test.ts` in `src/game/`. Follow this pairing for new files.

`src/game/winningSequence.ts` holds a verified full 100-move solution. It's test fixture data only, used to drive full-playthrough tests, and isn't wired into the UI. Don't treat it as dead code, and don't duplicate it if you need a solved sequence elsewhere.

`prefers-reduced-motion` is handled once, globally, in `src/index.css`. Don't add a per-component media query for it. Extend the global rule instead.

`src/components/ConfirmDialog.tsx` is the reference implementation for a modal: it traps focus, cancels on Escape, and restores focus to the trigger element on close. Reuse this pattern for any new dialog rather than building focus handling from scratch.

`.oxlintrc.json` enables the `react`, `typescript`, `oxc`, and `jsx-a11y` plugins, with `react/rules-of-hooks` as an error. Running `npm run lint` already catches a class of hook and accessibility mistakes, so check it before assuming a change needs extra manual review.

## Commit conventions

Commit messages must follow Conventional Commits.

Format: `<type>[optional scope]: <description>`

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

This is enforced by a `commit-msg` pre-commit hook (`.pre-commit-config.yaml`), so non-conforming commit messages will be rejected.

## Testing

Unit tests are written with Vitest. New code needs unit test coverage. When changing the UI, also add or update component tests using React Testing Library.

Unit tests (`src/game/`) run on the `pre-commit` stage. Component tests (`src/App.test.tsx`, `src/components/`) run on the `pre-push` stage (`.pre-commit-config.yaml`).

## Accessibility

All UI must meet WCAG 2.2 AA. In particular:

- Any new or changed color pairing (text/background, border/background) must be contrast-checked against WCAG 2.2 AA (4.5:1 for normal text, 3:1 for large text and non-text UI components) before merging.
- Text conveyed only through color must also get a non-color cue (border, icon, shape, text). Color alone cannot be the only way to distinguish a state.
- Dynamic status text (game outcome, progress, errors) must be exposed to assistive tech via `aria-live` or `role="status"`/`role="alert"`, not just rendered visually.
- Interactive elements need an accessible name that reflects their current state, not just their static position. For example, a board cell's `aria-label` must say whether it's filled, a valid move, empty, or otherwise notable.
- Respect `prefers-reduced-motion` for any new animation or transition.
- Component tests must include an automated accessibility check (`jest-axe`'s `toHaveNoViolations`) for any new or changed rendered UI, in addition to behavioral assertions.

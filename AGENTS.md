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

### Test-writing rules

- Test observable behavior and public contracts, not implementation details, private helpers, React state, or CSS structure.
- For game logic, cover the happy path, empty and boundary states, invalid moves, terminal states, and immutability. Assert the complete returned state when a transition changes multiple fields.
- For components, query through accessible roles, names, and labels (`getByRole`, `getByLabelText`, and similar). Do not use CSS selectors, element order, or text that is only an implementation detail when an accessible query exists.
- Create a fresh game state and mock callback for each test. Do not share mutable fixtures between tests. Clear localStorage in cleanup whenever a test writes persistence state.
- Use `userEvent` for interactions and await every interaction that returns a promise. Prefer user-visible outcomes over callback-call assertions; use callback assertions only when the component contract is the callback itself.
- Test important state transitions as a sequence of user actions, including undo/redo, reset confirmation and cancellation, reload or remount persistence, and the full winning sequence when relevant.
- Every changed rendered component needs a `jest-axe` check with `expect(await axe(container)).toHaveNoViolations()` plus behavioral assertions. Keep accessibility assertions in the component test for the affected UI.
- Make tests deterministic: avoid timers, random values, network calls, and reliance on test execution order. Mock only external boundaries and restore mocks after each test.
- Name tests after the behavior and its outcome. Keep each test focused on one contract; use small local helpers only for repeated domain actions such as placing a move.
- Run the narrowest relevant Vitest test file first, then run `npm test -- --run` and `npm run lint` before considering the change complete.

## Accessibility

All UI must meet WCAG 2.2 AA. In particular:

- Any new or changed color pairing (text/background, border/background) must be contrast-checked against WCAG 2.2 AA (4.5:1 for normal text, 3:1 for large text and non-text UI components) before merging.
- Text conveyed only through color must also get a non-color cue (border, icon, shape, text). Color alone cannot be the only way to distinguish a state.
- Dynamic status text (game outcome, progress, errors) must be exposed to assistive tech via `aria-live` or `role="status"`/`role="alert"`, not just rendered visually.
- Interactive elements need an accessible name that reflects their current state, not just their static position. For example, a board cell's `aria-label` must say whether it's filled, a valid move, empty, or otherwise notable.
- Respect `prefers-reduced-motion` for any new animation or transition.
- Component tests must include an automated accessibility check (`jest-axe`'s `toHaveNoViolations`) for any new or changed rendered UI, in addition to behavioral assertions.

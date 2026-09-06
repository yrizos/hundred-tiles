# Hundred Tiles

A single-player number-placement puzzle played on a 10x10 board, built with React, TypeScript, and Vite.

Play it live at [yrizos.github.io/hundred-tiles](https://yrizos.github.io/hundred-tiles/).

## Rules

Place the numbers 1 through 100 on a 10x10 board, one at a time in sequence, until the board is full.

The number 1 can go anywhere. After that, each number must land a fixed distance from the one before it:

- **Horizontal or vertical**: 3 squares away in a straight line. For example, if 1 is at (1,1), 2 can go at (1,4).
- **Diagonal**: 2 squares away. For example, if 1 is at (1,1), 2 can go at (3,3).

A square that's already filled can't be used again. The game ends when the board is full or no legal move remains.

## Prerequisites

- [Node.js](https://nodejs.org/) 24 or later, and npm (this project uses `package-lock.json`).
- [pre-commit](https://pre-commit.com/), if you want the commit and push hooks described below to run. It's not required just to run or build the game.

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — run oxlint
- `npm test` — run the Vitest test suite

## Project structure

- `src/game/` — game logic (board, moves, game state)
- `src/components/` — React components
- `src/App.tsx` — top-level app state and layout
- `src/main.tsx` — entry point
- `src/test/` — shared test setup (jest-dom and jest-axe wiring)

## Development

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/). A `commit-msg` hook rejects non-conforming messages.

A `pre-commit` hook runs type-checking, linting, and the unit tests (`src/game/`) before each commit. A `pre-push` hook runs the slower component tests (`src/App.test.tsx`, `src/components/`) before each push.

After cloning, install the hooks:

```bash
pre-commit install
```

This covers the commit-msg and pre-commit stages. The pre-push stage needs a separate install, since `pre-commit install` doesn't set it up on its own:

```bash
pre-commit install --hook-type pre-push
```

## Deployment

Pushes to `main` that touch source or config files trigger a GitHub Actions workflow (`.github/workflows/deploy.yml`) that runs the test suite, builds the app, and deploys it to GitHub Pages. `vite.config.ts` sets `base: './'` so the build works correctly under the GitHub Pages subpath.

## License

MIT, see [LICENSE](LICENSE).

# Hundred Tiles

A single-player number-placement puzzle played on a 10x10 board, built with React, TypeScript, and Vite.

## Rules

The game is played on a 10x10 board. Place the numbers 1 through 100 on the board, one at a time in sequence, until the board is full.

The number 1 can be placed on any tile. Each subsequent number must be placed using one of the following moves from the tile holding the previous number:

- **Horizontal or vertical move**: skip over 2 tiles, landing 3 tiles away in that direction. For example, if 1 is placed at (1,1), 2 can be placed at (1,4).
- **Diagonal move**: skip over 1 tile, landing 2 tiles away diagonally. For example, if 1 is placed at (1,1), 2 can be placed at (3,3).

A tile can only hold one number, so a move cannot land on a tile that is already filled. The game ends when the board is full or no legal move remains.

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

## Development

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/). 

A `commit-msg` pre-commit hook rejects non-conforming messages, and a `pre-commit` hook runs the Vitest suite before each commit.
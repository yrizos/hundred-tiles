# Hundred Tiles

Hundred Tiles is a grid-based game played on a 10x10 board. The objective is to fill each tile in sequence from 1 to 100. Starting from any tile, each new tile must be selected by moving exactly 3 tiles horizontally or vertically, or exactly 2 tiles diagonally.

The game ends when all tiles are filled or no valid moves remain.

## Gameplay Example

The player starts at `(1, 1)` and marks it as `1`.

```
      1   2   3   4   5   6   7   8   9  10
   +----------------------------------------+
 1 |  1   .   .   .   .   .   .   .   .   . |
 2 |  .   .   .   .   .   .   .   .   .   . |
 3 |  .   .   .   .   .   .   .   .   .   . |
 4 |  .   .   .   .   .   .   .   .   .   . |
 5 |  .   .   .   .   .   .   .   .   .   . |
 6 |  .   .   .   .   .   .   .   .   .   . |
 7 |  .   .   .   .   .   .   .   .   .   . |
 8 |  .   .   .   .   .   .   .   .   .   . |
 9 |  .   .   .   .   .   .   .   .   .   . |
10 |  .   .   .   .   .   .   .   .   .   . |
   +----------------------------------------+
```

From `(1, 1)`, valid moves are:

- Horizontal/Vertical: `(1, 4)` or `(4, 1)`
- Diagonal: `(3, 3)`

The player chooses `(1, 4)` and marks it as `2`.

```
      1   2   3   4   5   6   7   8   9  10
   +----------------------------------------+
 1 |  1   .   .   2   .   .   .   .   .   . |
 2 |  .   .   .   .   .   .   .   .   .   . |
 3 |  .   .   .   .   .   .   .   .   .   . |
 4 |  .   .   .   .   .   .   .   .   .   . |
 5 |  .   .   .   .   .   .   .   .   .   . |
 6 |  .   .   .   .   .   .   .   .   .   . |
 7 |  .   .   .   .   .   .   .   .   .   . |
 8 |  .   .   .   .   .   .   .   .   .   . |
 9 |  .   .   .   .   .   .   .   .   .   . |
10 |  .   .   .   .   .   .   .   .   .   . |
   +----------------------------------------+
```

From `(1, 4)`, valid moves are:

- Horizontal/Vertical: `(1, 7)` or `(4, 4)`
- Diagonal: `(3, 2)` or `(3, 6)`

The player chooses `(3, 2)` and marks it as `3`.

```
      1   2   3   4   5   6   7   8   9  10
   +----------------------------------------+
 1 |  1   .   .   2   .   .   .   .   .   . |
 2 |  .   .   .   .   .   .   .   .   .   . |
 3 |  .   3   .   .   .   .   .   .   .   . |
 4 |  .   .   .   .   .   .   .   .   .   . |
 5 |  .   .   .   .   .   .   .   .   .   . |
 6 |  .   .   .   .   .   .   .   .   .   . |
 7 |  .   .   .   .   .   .   .   .   .   . |
 8 |  .   .   .   .   .   .   .   .   .   . |
 9 |  .   .   .   .   .   .   .   .   .   . |
10 |  .   .   .   .   .   .   .   .   .   . |
   +----------------------------------------+
```

Each new move follows the same rules, moving exactly 3 tiles horizontally or vertically or exactly 2 tiles diagonally, until the player fills all 100 tiles or runs out of valid moves.

## Setup

```sh
git clone https://github.com/yrizos/hundred-tiles.git
cd hundred-tiles
```

### Running the Application Locally

Install dependencies:

```sh
npm install
```

Build the TypeScript code:

```sh
npm run build
```

Start the application:

```sh
npm start
```

### Running in Docker

Build the Docker image:

```sh
docker build -t hundred-tiles .
```

Run the Docker container in interactive mode:

```sh
docker run -it hundred-tiles
```

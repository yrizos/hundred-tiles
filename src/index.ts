import { Board } from './board.js';
import * as readline from 'readline';
import chalk from 'chalk';

const board = new Board();
const cellWidth = 5;
const maxSize = 3;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function drawBorder(character: string, repeat: number = 1): string {
  return chalk.gray(character.repeat(repeat));
}

function drawCell(
  value: string,
  type:
    | 'none'
    | 'border'
    | 'available'
    | 'unavailable'
    | 'occupied'
    | 'current' = 'none',
  border: string = '|'
): string {
  const totalPadding = cellWidth - maxSize;
  const rightPadding = Math.round(totalPadding / 2);
  const leftPadding = totalPadding - rightPadding + (maxSize - value.length);

  value = ' '.repeat(leftPadding) + value + ' '.repeat(rightPadding);

  const styles = {
    none: value,
    border: chalk.gray(value),
    available: chalk.bgGreen(value),
    unavailable: chalk.bgGray(value),
    occupied: chalk.white(value),
    current: chalk.bgBlue.white(value),
  };

  return styles[type] + drawBorder(border);
}

function drawHorizontalBorder(boardSize: number): string {
  const size = boardSize * (cellWidth + 1) - 1;
  return ' '.repeat(cellWidth) + drawBorder('+' + '-'.repeat(size) + '+');
}

function drawBoard() {
  console.log(drawRowWithHeaders());
  console.log(drawHorizontalBorder(Board.SIZE));

  for (let row = 0; row < Board.SIZE; row++) {
    let rowString = drawCell((row + 1).toString(), 'border');
    for (let col = 0; col < Board.SIZE; col++) {
      const cellType = getCellType(row, col);
      const cellValue = board.isTileEmpty(row, col)
        ? ' '
        : board.getTileValue(row, col).toString();
      rowString += drawCell(cellValue, cellType);
    }

    rowString += drawCell((row + 1).toString(), 'border', '');

    console.log(rowString);
    console.log(drawHorizontalBorder(Board.SIZE));
  }

  console.log(drawRowWithHeaders());
  console.log();
}

function drawRowWithHeaders(): string {
  let headerRow = drawCell(' ', 'none', ' ');
  for (let col = 1; col <= Board.SIZE; col++) {
    headerRow += drawCell(col.toString(), 'border', ' ');
  }
  return headerRow;
}

function getCellType(
  row: number,
  col: number
): 'available' | 'unavailable' | 'occupied' | 'current' {
  if (!board.isTileEmpty(row, col)) {
    return board.isTileCurrent(row, col) ? 'current' : 'occupied';
  }
  return board.isTileValid(row, col) ? 'available' : 'unavailable';
}

function promptForPosition(
  callback: (row: number, col: number) => void,
  errorMessage: string = ''
): void {
  console.log('');
  if (errorMessage) {
    console.log(chalk.red(errorMessage));
  } else {
    console.log('');
  }

  rl.question(
    "Enter row and column (e.g., '1 4'), 'b' to go back, or 'q' to quit: ",
    (input) => {
      if (input.toLowerCase() === 'q') {
        rl.close();
        return;
      }

      if (input.toLowerCase() === 'b') {
        console.clear();
        board.goBack();
        drawBoard();
        promptForPosition(handleTileSelection);
        return;
      }

      const [rowStr, colStr] = input.split(' ');
      const row = parseInt(rowStr, 10);
      const col = parseInt(colStr, 10);

      if (isNaN(row) || isNaN(col)) {
        promptForPosition(
          callback,
          'Invalid input. Please enter two numbers separated by a space.'
        );
      } else {
        console.clear();
        callback(row, col);
        return;
      }
    }
  );
}

function handleTileSelection(row: number, col: number) {
  let errorMessage = '';

  try {
    board.goToTile(row - 1, col - 1);
  } catch (error) {
    errorMessage =
      '[' +
      row.toString() +
      ', ' +
      col.toString() +
      '] ' +
      (error instanceof Error ? error.message : 'An unknown error occurred');
  }

  drawBoard();
  promptForPosition(handleTileSelection, errorMessage);
}

console.clear();
drawBoard();
promptForPosition(handleTileSelection);

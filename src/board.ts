export class Board {
  public static readonly SIZE: number = 10;

  private board: number[][];
  private counter: number = 0;
  private moveHistory: { row: number; col: number }[] = [];

  constructor() {
    this.board = Array.from({ length: Board.SIZE }, () =>
      Array(Board.SIZE).fill(0)
    );
  }

  public getBoard(): number[][] {
    return this.board;
  }

  public goToTile(row: number, col: number): void {
    if (
      !this.isTileWithinBounds(row, col) ||
      !this.isTileEmpty(row, col) ||
      !this.isTileValid(row, col)
    ) {
      throw Error(this.getErrorMessage(row, col));
    }
    this.counter++;
    this.board[row][col] = this.counter;
    this.moveHistory.push({ row, col });
  }

  public goBack(): void {
    if (this.moveHistory.length > 0) {
      const lastPosition = this.moveHistory.pop();
      if (lastPosition) {
        this.board[lastPosition.row][lastPosition.col] = 0;
        this.counter--;
      }
    }
  }

  public getTileValue(row: number, col: number): number {
    if (!this.isTileWithinBounds(row, col)) {
      throw Error('Out of bounds');
    }
    return this.board[row][col];
  }

  public isTileEmpty(row: number, col: number): boolean {
    return this.getTileValue(row, col) === 0;
  }

  public isTileWithinBounds(row: number, col: number): boolean {
    return row >= 0 && row < Board.SIZE && col >= 0 && col < Board.SIZE;
  }

  public isTileCurrent(row: number, col: number): boolean {
    const currentPosition = this.moveHistory[this.moveHistory.length - 1];
    return currentPosition?.row === row && currentPosition?.col === col;
  }

  public isTileValid(row: number, col: number): boolean {
    if (this.moveHistory.length === 0) return true;
    const lastPosition = this.moveHistory[this.moveHistory.length - 1];
    const rowDiff = Math.abs(row - lastPosition.row);
    const colDiff = Math.abs(col - lastPosition.col);
    return (
      (rowDiff === 0 && colDiff === 3) ||
      (colDiff === 0 && rowDiff === 3) ||
      (rowDiff === 2 && colDiff === 2)
    );
  }

  private getErrorMessage(row: number, col: number): string {
    if (!this.isTileWithinBounds(row, col)) return 'Out of bounds';
    if (!this.isTileEmpty(row, col)) return 'Tile is not empty';
    return 'Tile is not valid';
  }
}

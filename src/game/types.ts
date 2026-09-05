export const BOARD_SIZE = 10
export const MAX_NUMBER = BOARD_SIZE * BOARD_SIZE

export interface Position {
  row: number
  col: number
}

export type Board = (number | null)[][]

export interface GameState {
  board: Board
  nextNumber: number
  lastPosition: Position | null
}

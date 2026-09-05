import { BOARD_SIZE, type Board, type Position } from './types'

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array<number | null>(BOARD_SIZE).fill(null),
  )
}

export function isOnBoard(pos: Position): boolean {
  return (
    pos.row >= 0 &&
    pos.row < BOARD_SIZE &&
    pos.col >= 0 &&
    pos.col < BOARD_SIZE
  )
}

export function isEmpty(board: Board, pos: Position): boolean {
  return board[pos.row][pos.col] === null
}

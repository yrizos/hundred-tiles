import { BOARD_SIZE, MAX_NUMBER, type GameState, type Position } from './types'
import { isEmpty, isOnBoard } from './board'

const JUMP_OFFSETS: Position[] = [
  { row: 0, col: 3 },
  { row: 0, col: -3 },
  { row: 3, col: 0 },
  { row: -3, col: 0 },
  { row: 2, col: 2 },
  { row: 2, col: -2 },
  { row: -2, col: 2 },
  { row: -2, col: -2 },
]

export function getValidMoves(state: GameState): Position[] {
  if (state.nextNumber > MAX_NUMBER) return []

  if (state.lastPosition === null) {
    const positions: Position[] = []
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        positions.push({ row, col })
      }
    }
    return positions
  }

  const { lastPosition } = state
  return JUMP_OFFSETS.map((offset) => ({
    row: lastPosition.row + offset.row,
    col: lastPosition.col + offset.col,
  })).filter((pos) => isOnBoard(pos) && isEmpty(state.board, pos))
}

export function isValidPlacement(state: GameState, pos: Position): boolean {
  return getValidMoves(state).some(
    (move) => move.row === pos.row && move.col === pos.col,
  )
}

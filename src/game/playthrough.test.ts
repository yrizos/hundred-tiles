import { describe, expect, it } from 'vitest'
import { createGameState, placeNumber } from './gameState'
import { isValidPlacement } from './moves'
import type { Position } from './types'

const PLAYTHROUGH: Position[] = [
  { row: 5, col: 8 },
  { row: 8, col: 8 },
  { row: 8, col: 5 },
  { row: 8, col: 2 },
  { row: 6, col: 0 },
  { row: 9, col: 0 },
  { row: 9, col: 3 },
  { row: 7, col: 1 },
  { row: 4, col: 1 },
  { row: 1, col: 1 },
  { row: 1, col: 4 },
  { row: 1, col: 7 },
  { row: 3, col: 9 },
  { row: 0, col: 9 },
  { row: 0, col: 6 },
  { row: 2, col: 8 },
  { row: 2, col: 5 },
  { row: 0, col: 7 },
  { row: 2, col: 9 },
  { row: 4, col: 7 },
  { row: 6, col: 9 },
  { row: 9, col: 9 },
  { row: 9, col: 6 },
  { row: 7, col: 8 },
  { row: 4, col: 8 },
  { row: 1, col: 8 },
  { row: 3, col: 6 },
  { row: 6, col: 6 },
  { row: 6, col: 3 },
  { row: 8, col: 1 },
  { row: 8, col: 4 },
  { row: 8, col: 7 },
  { row: 5, col: 7 },
  { row: 7, col: 9 },
  { row: 9, col: 7 },
  { row: 7, col: 5 },
  { row: 7, col: 2 },
  { row: 9, col: 4 },
  { row: 9, col: 1 },
  { row: 6, col: 1 },
  { row: 8, col: 3 },
  { row: 8, col: 0 },
  { row: 5, col: 0 },
  { row: 2, col: 0 },
  { row: 0, col: 2 },
  { row: 3, col: 2 },
  { row: 1, col: 0 },
  { row: 1, col: 3 },
  { row: 3, col: 1 },
  { row: 0, col: 1 },
]

describe('a hardcoded 50-move playthrough', () => {
  it('follows a known sequence of legal moves', () => {
    let state = createGameState()

    for (const position of PLAYTHROUGH) {
      expect(isValidPlacement(state, position)).toBe(true)
      state = placeNumber(state, position)
    }

    expect(state.nextNumber).toBe(51)

    PLAYTHROUGH.forEach((position, index) => {
      expect(state.board[position.row][position.col]).toBe(index + 1)
    })
  })
})

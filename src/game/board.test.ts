import { describe, expect, it } from 'vitest'
import { createEmptyBoard, isEmpty, isOnBoard } from './board'
import { BOARD_SIZE } from './types'

describe('createEmptyBoard', () => {
  it('creates a 10x10 board filled with null', () => {
    const board = createEmptyBoard()

    expect(board).toHaveLength(BOARD_SIZE)
    for (const row of board) {
      expect(row).toHaveLength(BOARD_SIZE)
      for (const cell of row) {
        expect(cell).toBeNull()
      }
    }
  })
})

describe('isOnBoard', () => {
  it('returns true for positions within bounds', () => {
    expect(isOnBoard({ row: 0, col: 0 })).toBe(true)
    expect(isOnBoard({ row: 9, col: 9 })).toBe(true)
    expect(isOnBoard({ row: 5, col: 5 })).toBe(true)
  })

  it('returns false for positions outside bounds', () => {
    expect(isOnBoard({ row: -1, col: 0 })).toBe(false)
    expect(isOnBoard({ row: 0, col: -1 })).toBe(false)
    expect(isOnBoard({ row: 10, col: 0 })).toBe(false)
    expect(isOnBoard({ row: 0, col: 10 })).toBe(false)
  })

  it('returns false for a position out of bounds on both axes at once', () => {
    expect(isOnBoard({ row: -1, col: 10 })).toBe(false)
  })
})

describe('isEmpty', () => {
  it('returns true for an empty cell', () => {
    const board = createEmptyBoard()
    expect(isEmpty(board, { row: 3, col: 4 })).toBe(true)
  })

  it('returns false for an occupied cell', () => {
    const board = createEmptyBoard()
    board[3][4] = 1
    expect(isEmpty(board, { row: 3, col: 4 })).toBe(false)
  })
})

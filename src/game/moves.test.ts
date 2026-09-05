import { describe, expect, it } from 'vitest'
import { createEmptyBoard } from './board'
import { getValidMoves, isValidPlacement } from './moves'
import { BOARD_SIZE, MAX_NUMBER, type GameState } from './types'

describe('getValidMoves', () => {
  it('returns every tile on the board for the first placement', () => {
    const state: GameState = {
      board: createEmptyBoard(),
      nextNumber: 1,
      lastPosition: null,
    }

    expect(getValidMoves(state)).toHaveLength(BOARD_SIZE * BOARD_SIZE)
  })

  it('returns the 8 jump destinations from an interior tile', () => {
    const state: GameState = {
      board: createEmptyBoard(),
      nextNumber: 2,
      lastPosition: { row: 5, col: 5 },
    }

    const moves = getValidMoves(state)

    expect(moves).toEqual(
      expect.arrayContaining([
        { row: 5, col: 8 },
        { row: 5, col: 2 },
        { row: 8, col: 5 },
        { row: 2, col: 5 },
        { row: 7, col: 7 },
        { row: 7, col: 3 },
        { row: 3, col: 7 },
        { row: 3, col: 3 },
      ]),
    )
    expect(moves).toHaveLength(8)
  })

  it('filters out destinations that fall off the board', () => {
    const state: GameState = {
      board: createEmptyBoard(),
      nextNumber: 2,
      lastPosition: { row: 0, col: 0 },
    }

    const moves = getValidMoves(state)

    expect(moves).toEqual(
      expect.arrayContaining([
        { row: 0, col: 3 },
        { row: 3, col: 0 },
        { row: 2, col: 2 },
      ]),
    )
    expect(moves).toHaveLength(3)
  })

  it('filters out destinations that are already occupied', () => {
    const board = createEmptyBoard()
    board[5][8] = 1
    const state: GameState = {
      board,
      nextNumber: 2,
      lastPosition: { row: 5, col: 5 },
    }

    const moves = getValidMoves(state)

    expect(moves).not.toEqual(
      expect.arrayContaining([{ row: 5, col: 8 }]),
    )
    expect(moves).toHaveLength(7)
  })

  it('returns no moves once the board is complete', () => {
    const state: GameState = {
      board: createEmptyBoard(),
      nextNumber: MAX_NUMBER + 1,
      lastPosition: { row: 5, col: 5 },
    }

    expect(getValidMoves(state)).toEqual([])
  })
})

describe('isValidPlacement', () => {
  it('accepts a legal jump destination', () => {
    const state: GameState = {
      board: createEmptyBoard(),
      nextNumber: 2,
      lastPosition: { row: 5, col: 5 },
    }

    expect(isValidPlacement(state, { row: 5, col: 8 })).toBe(true)
  })

  it('rejects a tile that is not a legal jump destination', () => {
    const state: GameState = {
      board: createEmptyBoard(),
      nextNumber: 2,
      lastPosition: { row: 5, col: 5 },
    }

    expect(isValidPlacement(state, { row: 5, col: 6 })).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { createGameState, isStuck, isWon, placeNumber } from './gameState'
import { createEmptyBoard } from './board'
import { MAX_NUMBER, type GameState } from './types'
import { WINNING_SEQUENCE } from './winningSequence'

describe('createGameState', () => {
  it('starts with an empty board and number 1 to place', () => {
    const state = createGameState()

    expect(state.nextNumber).toBe(1)
    expect(state.lastPosition).toBeNull()
    expect(state.board).toEqual(createEmptyBoard())
  })
})

describe('placeNumber', () => {
  it('places the next number and advances state without mutating the original', () => {
    const state = createGameState()
    const next = placeNumber(state, { row: 4, col: 4 })

    expect(next.board[4][4]).toBe(1)
    expect(next.nextNumber).toBe(2)
    expect(next.lastPosition).toEqual({ row: 4, col: 4 })

    expect(state.board[4][4]).toBeNull()
    expect(state.nextNumber).toBe(1)
  })

  it('returns board rows that are new array instances, not shared with the original', () => {
    const state = createGameState()
    const next = placeNumber(state, { row: 4, col: 4 })

    expect(next.board).not.toBe(state.board)
    next.board.forEach((row, index) => {
      expect(row).not.toBe(state.board[index])
    })
  })

  it('wins only after the 100th placement of a full game', () => {
    let state = createGameState()

    WINNING_SEQUENCE.forEach((position, index) => {
      state = placeNumber(state, position)
      if (index < WINNING_SEQUENCE.length - 1) {
        expect(isWon(state)).toBe(false)
      }
    })

    expect(isWon(state)).toBe(true)
  })
})

describe('isWon', () => {
  it('is false while numbers remain to be placed', () => {
    expect(isWon(createGameState())).toBe(false)
  })

  it('is true once every number has been placed', () => {
    const state: GameState = {
      board: createEmptyBoard(),
      nextNumber: MAX_NUMBER + 1,
      lastPosition: { row: 5, col: 5 },
    }

    expect(isWon(state)).toBe(true)
  })
})

describe('isStuck', () => {
  it('is false when valid moves remain', () => {
    expect(isStuck(createGameState())).toBe(false)
  })

  it('is true when no valid moves remain and the game is not won', () => {
    const board = createEmptyBoard()
    board[9][9] = 1
    board[9][6] = 2
    board[6][9] = 3
    board[7][7] = 4
    const state: GameState = {
      board,
      nextNumber: 5,
      lastPosition: { row: 9, col: 9 },
    }

    expect(isStuck(state)).toBe(true)
  })

  it('is false once the game is won, even with no moves left', () => {
    const state: GameState = {
      board: createEmptyBoard(),
      nextNumber: MAX_NUMBER + 1,
      lastPosition: { row: 5, col: 5 },
    }

    expect(isStuck(state)).toBe(false)
  })
})

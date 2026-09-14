import type { GameState, Position } from './types'
import { MAX_NUMBER } from './types'
import { createEmptyBoard } from './board'
import { getValidMoves } from './moves'

export function createGameState(): GameState {
  return {
    board: createEmptyBoard(),
    nextNumber: 1,
    lastPosition: null,
  }
}

export function placeNumber(state: GameState, pos: Position): GameState {
  const board = state.board.map((row) => [...row])
  board[pos.row][pos.col] = state.nextNumber

  return {
    board,
    nextNumber: state.nextNumber + 1,
    lastPosition: pos,
  }
}

export function undoLastMove(state: GameState): GameState {
  if (state.nextNumber === 1) return state

  const numberToRemove = state.nextNumber - 1
  const board = state.board.map((row) =>
    row.map((cell) => (cell === numberToRemove ? null : cell)),
  )
  const previousNumber = numberToRemove - 1
  let lastPosition: Position | null = null

  if (previousNumber > 0) {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === previousNumber) {
          lastPosition = { row, col }
        }
      }
    }
  }

  return {
    board,
    nextNumber: numberToRemove,
    lastPosition,
  }
}

export function isWon(state: GameState): boolean {
  return state.nextNumber > MAX_NUMBER
}

export function isStuck(state: GameState): boolean {
  return !isWon(state) && getValidMoves(state).length === 0
}

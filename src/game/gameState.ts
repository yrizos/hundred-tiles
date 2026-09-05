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

export function isWon(state: GameState): boolean {
  return state.nextNumber > MAX_NUMBER
}

export function isStuck(state: GameState): boolean {
  return !isWon(state) && getValidMoves(state).length === 0
}

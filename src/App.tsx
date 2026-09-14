import { useEffect, useState } from 'react'
import Board from './components/Board'
import ConfirmDialog from './components/ConfirmDialog'
import {
  createGameState,
  isStuck,
  isWon,
  placeNumber,
  undoLastMove,
} from './game/gameState'
import { BOARD_SIZE, MAX_NUMBER, type GameState, type Position } from './game/types'
import './App.css'

const STORAGE_KEY = 'hundred-tiles-game-state'
const MAX_UNDO_STEPS = 3

interface SavedGame {
  state: GameState
  undosRemaining: number
}

function isValidGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false

  const parsed = value as GameState
  const hasValidBoard =
    Array.isArray(parsed.board) &&
    parsed.board.length === BOARD_SIZE &&
    parsed.board.every(
      (row) =>
        Array.isArray(row) &&
        row.length === BOARD_SIZE &&
        row.every((cell) => cell === null || Number.isInteger(cell)),
    )
  const hasValidLastPosition =
    parsed.lastPosition === null ||
    (parsed.lastPosition !== undefined &&
      Number.isInteger(parsed.lastPosition.row) &&
      Number.isInteger(parsed.lastPosition.col) &&
      parsed.lastPosition.row >= 0 &&
      parsed.lastPosition.row < BOARD_SIZE &&
      parsed.lastPosition.col >= 0 &&
      parsed.lastPosition.col < BOARD_SIZE)

  return (
    hasValidBoard &&
    Number.isInteger(parsed.nextNumber) &&
    hasValidLastPosition
  )
}

function loadGame(): SavedGame {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return { state: createGameState(), undosRemaining: MAX_UNDO_STEPS }
    }

    const parsed: unknown = JSON.parse(saved)
    if (isValidGameState(parsed)) {
      return { state: parsed, undosRemaining: MAX_UNDO_STEPS }
    }

    if (!parsed || typeof parsed !== 'object') return {
      state: createGameState(),
      undosRemaining: MAX_UNDO_STEPS,
    }

    const savedGame = parsed as Partial<SavedGame>
    const undosRemaining = savedGame.undosRemaining
    if (
      isValidGameState(savedGame.state) &&
      typeof undosRemaining === 'number' &&
      Number.isInteger(undosRemaining) &&
      undosRemaining >= 0 &&
      undosRemaining <= MAX_UNDO_STEPS
    ) {
      return {
        state: savedGame.state,
        undosRemaining,
      }
    }
  } catch {
  }

  return { state: createGameState(), undosRemaining: MAX_UNDO_STEPS }
}

function App() {
  const [{ state, undosRemaining }, setGame] = useState(loadGame)
  const [confirmingReset, setConfirmingReset] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ state, undosRemaining } satisfies SavedGame),
      )
    } catch {
    }
  }, [state, undosRemaining])

  const won = isWon(state)
  const stuck = isStuck(state)

  const handleCellClick = (position: Position) => {
    setGame((current) => ({
      state: placeNumber(current.state, position),
      undosRemaining: current.undosRemaining,
    }))
  }

  const handleUndo = () => {
    if (undosRemaining === 0 || state.nextNumber === 1) return

    setGame((current) => ({
      state: undoLastMove(current.state),
      undosRemaining: current.undosRemaining - 1,
    }))
  }

  const handleReset = () => {
    setConfirmingReset(true)
  }

  const handleConfirmReset = () => {
    setGame({ state: createGameState(), undosRemaining: MAX_UNDO_STEPS })
    setConfirmingReset(false)
  }

  const handleCancelReset = () => {
    setConfirmingReset(false)
  }

  return (
    <main id="game">
      <h1>
        Hundred <span className="dim">Tiles</span>
      </h1>
      <output
        className={
          'status' + (won ? ' status--won' : stuck ? ' status--stuck' : '')
        }
        aria-live="polite"
      >
        {won
          ? 'You reached 100!'
          : stuck
            ? `Stuck at ${state.nextNumber - 1}. No legal moves remain.`
            : `Place number ${state.nextNumber} of ${MAX_NUMBER}`}
      </output>
      <Board state={state} onCellClick={handleCellClick} />
      <div className="actions">
        <button
          type="button"
          className="undo"
          disabled={undosRemaining === 0 || state.nextNumber === 1}
          onClick={handleUndo}
        >
          Undo ({undosRemaining} left)
        </button>
        <button
          type="button"
          className="reset"
          disabled={state.lastPosition === null}
          onClick={handleReset}
        >
          New game
        </button>
      </div>
      {confirmingReset && (
        <ConfirmDialog
          title="Start a new game?"
          message="This will reset your current progress."
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          onConfirm={handleConfirmReset}
          onCancel={handleCancelReset}
        />
      )}
    </main>
  )
}

export default App

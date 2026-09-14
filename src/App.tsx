import { useEffect, useState } from 'react'
import { Redo2, Undo2 } from 'lucide-react'
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
  redoStates: GameState[]
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

function isValidRedoStates(value: unknown): value is GameState[] {
  return Array.isArray(value) && value.every(isValidGameState)
}

function loadGame(): SavedGame {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return {
        state: createGameState(),
        undosRemaining: MAX_UNDO_STEPS,
        redoStates: [],
      }
    }

    const parsed: unknown = JSON.parse(saved)
    if (isValidGameState(parsed)) {
      return {
        state: parsed,
        undosRemaining: MAX_UNDO_STEPS,
        redoStates: [],
      }
    }

    if (!parsed || typeof parsed !== 'object') return {
      state: createGameState(),
      undosRemaining: MAX_UNDO_STEPS,
      redoStates: [],
    }

    const savedGame = parsed as Partial<SavedGame>
    const undosRemaining = savedGame.undosRemaining
    const redoStates = savedGame.redoStates ?? []
    if (
      isValidGameState(savedGame.state) &&
      typeof undosRemaining === 'number' &&
      Number.isInteger(undosRemaining) &&
      undosRemaining >= 0 &&
      undosRemaining <= MAX_UNDO_STEPS &&
      isValidRedoStates(redoStates)
    ) {
      return {
        state: savedGame.state,
        undosRemaining,
        redoStates,
      }
    }
  } catch {
  }

  return {
    state: createGameState(),
    undosRemaining: MAX_UNDO_STEPS,
    redoStates: [],
  }
}

function App() {
  const [{ state, undosRemaining, redoStates }, setGame] = useState(loadGame)
  const [confirmingReset, setConfirmingReset] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ state, undosRemaining, redoStates } satisfies SavedGame),
      )
    } catch {
    }
  }, [state, undosRemaining, redoStates])

  const won = isWon(state)
  const stuck = isStuck(state)

  const handleCellClick = (position: Position) => {
    setGame((current) => ({
      state: placeNumber(current.state, position),
      undosRemaining: current.undosRemaining,
      redoStates: [],
    }))
  }

  const handleUndo = () => {
    if (undosRemaining === 0 || state.nextNumber === 1) return

    setGame((current) => ({
      state: undoLastMove(current.state),
      undosRemaining: current.undosRemaining - 1,
      redoStates: [...current.redoStates, current.state],
    }))
  }

  const handleRedo = () => {
    if (redoStates.length === 0) return

    setGame((current) => ({
      state: current.redoStates[current.redoStates.length - 1],
      undosRemaining: Math.min(
        MAX_UNDO_STEPS,
        current.undosRemaining + 1,
      ),
      redoStates: current.redoStates.slice(0, -1),
    }))
  }

  const handleReset = () => {
    setConfirmingReset(true)
  }

  const handleConfirmReset = () => {
    setGame({
      state: createGameState(),
      undosRemaining: MAX_UNDO_STEPS,
      redoStates: [],
    })
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
          aria-label={`Undo (${undosRemaining} left)`}
          title={`undo (${undosRemaining} left)`}
          data-tooltip="undo"
          disabled={undosRemaining === 0 || state.nextNumber === 1}
          onClick={handleUndo}
        >
          <Undo2
            className="action-icon"
            size={34}
            strokeWidth={3}
            aria-hidden="true"
          />
          <span className="action-count">{undosRemaining}</span>
        </button>
        <button
          type="button"
          className="reset"
          disabled={state.lastPosition === null}
          onClick={handleReset}
        >
          New game
        </button>
        <button
          type="button"
          className="redo"
          aria-label={`Redo (${redoStates.length} available)`}
          title={`redo (${redoStates.length} available)`}
          data-tooltip="redo"
          disabled={redoStates.length === 0}
          onClick={handleRedo}
        >
          <Redo2
            className="action-icon"
            size={34}
            strokeWidth={3}
            aria-hidden="true"
          />
          <span className="action-count">{redoStates.length}</span>
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

import { useEffect, useState } from 'react'
import Board from './components/Board'
import ConfirmDialog from './components/ConfirmDialog'
import {
  createGameState,
  isStuck,
  isWon,
  placeNumber,
} from './game/gameState'
import { BOARD_SIZE, MAX_NUMBER, type GameState, type Position } from './game/types'
import './App.css'

const STORAGE_KEY = 'hundred-tiles-game-state'

function loadGameState(): GameState {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return createGameState()

    const parsed = JSON.parse(saved) as GameState
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

    if (
      !hasValidBoard ||
      !Number.isInteger(parsed.nextNumber) ||
      !hasValidLastPosition
    ) {
      return createGameState()
    }

    return parsed
  } catch {
    return createGameState()
  }
}

function App() {
  const [state, setState] = useState(loadGameState)
  const [confirmingReset, setConfirmingReset] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
    }
  }, [state])

  const won = isWon(state)
  const stuck = isStuck(state)

  const handleCellClick = (position: Position) => {
    setState((current) => placeNumber(current, position))
  }

  const handleReset = () => {
    setConfirmingReset(true)
  }

  const handleConfirmReset = () => {
    setState(createGameState())
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
      <button
        type="button"
        className="reset"
        disabled={state.lastPosition === null}
        onClick={handleReset}
      >
        New game
      </button>
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

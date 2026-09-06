import { useState } from 'react'
import Board from './components/Board'
import ConfirmDialog from './components/ConfirmDialog'
import { createGameState, isStuck, isWon, placeNumber } from './game/gameState'
import { MAX_NUMBER, type Position } from './game/types'
import './App.css'

function App() {
  const [state, setState] = useState(createGameState())
  const [confirmingReset, setConfirmingReset] = useState(false)

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

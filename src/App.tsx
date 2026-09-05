import { useState } from 'react'
import Board from './components/Board'
import { createGameState, isStuck, isWon, placeNumber } from './game/gameState'
import { MAX_NUMBER, type Position } from './game/types'
import './App.css'

function App() {
  const [state, setState] = useState(createGameState())

  const won = isWon(state)
  const stuck = isStuck(state)

  const handleCellClick = (position: Position) => {
    setState((current) => placeNumber(current, position))
  }

  const handleReset = () => {
    setState(createGameState())
  }

  return (
    <div id="game">
      <h1>
        Hundred <span className="dim">Tiles</span>
      </h1>
      <p className="status">
        {won
          ? 'You reached 100!'
          : stuck
            ? `Stuck at ${state.nextNumber - 1}. No legal moves remain.`
            : `Place number ${state.nextNumber} of ${MAX_NUMBER}`}
      </p>
      <Board state={state} onCellClick={handleCellClick} />
      <button type="button" className="reset" onClick={handleReset}>
        New game
      </button>
    </div>
  )
}

export default App

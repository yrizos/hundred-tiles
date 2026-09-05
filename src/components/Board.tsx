import { isValidPlacement } from '../game/moves'
import type { GameState, Position } from '../game/types'
import './Board.css'

interface BoardProps {
  state: GameState
  onCellClick: (position: Position) => void
}

function Board({ state, onCellClick }: BoardProps) {
  return (
    <div className="board">
      {state.board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const position: Position = { row: rowIndex, col: colIndex }
          const isValid = cell === null && isValidPlacement(state, position)

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}`}
              className={
                'cell' +
                (cell !== null ? ' cell--filled' : '') +
                (isValid ? ' cell--valid' : '')
              }
              disabled={!isValid}
              onClick={() => onCellClick(position)}
            >
              {cell ?? ''}
            </button>
          )
        }),
      )}
    </div>
  )
}

export default Board

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
          const isCurrent =
            state.lastPosition?.row === rowIndex &&
            state.lastPosition?.col === colIndex

          const label = [
            `Row ${rowIndex + 1}, column ${colIndex + 1}`,
            cell !== null ? `filled with ${cell}` : isValid ? 'valid move' : '',
            isCurrent ? 'last placed' : '',
          ]
            .filter(Boolean)
            .join(', ')

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              aria-label={label}
              className={
                'cell' +
                (cell !== null ? ' cell--filled' : '') +
                (isValid ? ' cell--valid' : '') +
                (isCurrent ? ' cell--current' : '')
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

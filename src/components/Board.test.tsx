import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createGameState, placeNumber } from '../game/gameState'
import Board from './Board'

describe('Board', () => {
  it('renders a legal move as enabled and clickable', async () => {
    const state = createGameState()
    const onCellClick = vi.fn()
    render(<Board state={state} onCellClick={onCellClick} />)

    const cell = screen.getByLabelText('Row 1, column 1')
    expect(cell).toBeEnabled()

    await userEvent.click(cell)
    expect(onCellClick).toHaveBeenCalledWith({ row: 0, col: 0 })
  })

  it('shows the placed number and disables a filled tile', () => {
    const state = placeNumber(createGameState(), { row: 0, col: 0 })
    render(<Board state={state} onCellClick={vi.fn()} />)

    const cell = screen.getByLabelText('Row 1, column 1')
    expect(cell).toHaveTextContent('1')
    expect(cell).toBeDisabled()
  })

  it('disables a tile that is not a legal move', async () => {
    const state = placeNumber(createGameState(), { row: 0, col: 0 })
    const onCellClick = vi.fn()
    render(<Board state={state} onCellClick={onCellClick} />)

    const illegalCell = screen.getByLabelText('Row 1, column 2')
    expect(illegalCell).toBeDisabled()

    await userEvent.click(illegalCell)
    expect(onCellClick).not.toHaveBeenCalled()
  })
})

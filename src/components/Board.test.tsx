import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'jest-axe'
import { createGameState, placeNumber } from '../game/gameState'
import Board from './Board'

describe('Board', () => {
  it('renders a legal move as enabled and clickable', async () => {
    const state = createGameState()
    const onCellClick = vi.fn()
    render(<Board state={state} onCellClick={onCellClick} />)

    const cell = screen.getByLabelText('Row 1, column 1, valid move')
    expect(cell).toBeEnabled()

    await userEvent.click(cell)
    expect(onCellClick).toHaveBeenCalledWith({ row: 0, col: 0 })
  })

  it('shows the placed number and disables a filled tile, and marks it as last placed', () => {
    const state = placeNumber(createGameState(), { row: 0, col: 0 })
    render(<Board state={state} onCellClick={vi.fn()} />)

    const cell = screen.getByLabelText(
      'Row 1, column 1, filled with 1, last placed',
    )
    expect(cell).toHaveTextContent('1')
    expect(cell).toBeDisabled()
    expect(cell).toHaveClass('cell--current')
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

  it('gives a valid move the valid class without the filled or current classes', () => {
    const state = placeNumber(createGameState(), { row: 0, col: 0 })
    render(<Board state={state} onCellClick={vi.fn()} />)

    const validCell = screen.getByLabelText('Row 1, column 4, valid move')
    expect(validCell.className).toContain('cell--valid')
    expect(validCell.className).not.toContain('cell--filled')
    expect(validCell.className).not.toContain('cell--current')
  })

  it('gives an illegal, unfilled tile neither the valid nor the filled class', () => {
    const state = placeNumber(createGameState(), { row: 0, col: 0 })
    render(<Board state={state} onCellClick={vi.fn()} />)

    const illegalCell = screen.getByLabelText('Row 1, column 2')
    expect(illegalCell.className).not.toContain('cell--valid')
    expect(illegalCell.className).not.toContain('cell--filled')
  })

  it('has no automatically detectable accessibility violations', async () => {
    const state = placeNumber(createGameState(), { row: 0, col: 0 })
    const { container } = render(
      <Board state={state} onCellClick={vi.fn()} />,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})

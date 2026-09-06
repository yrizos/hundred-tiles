import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { axe } from 'jest-axe'
import App from './App'
import { WINNING_SEQUENCE } from './game/winningSequence'

const STUCK_SEQUENCE = [
  { row: 0, col: 3 },
  { row: 3, col: 3 },
  { row: 3, col: 0 },
  { row: 5, col: 2 },
  { row: 2, col: 2 },
  { row: 0, col: 0 },
]

function cellLabel(row: number, col: number) {
  return new RegExp(`^Row ${row + 1}, column ${col + 1}(,|$)`)
}

describe('App', () => {
  it('starts with a message to place number 1', () => {
    render(<App />)
    expect(screen.getByText('Place number 1 of 100')).toBeInTheDocument()
  })

  it('announces the status as a live region', () => {
    render(<App />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Place number 1 of 100')
  })

  it('advances the status after placing a number', async () => {
    render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))

    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()
  })

  it('resets the game when "New game" is clicked', async () => {
    render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))
    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'New game' }))

    expect(screen.getByText('Place number 1 of 100')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = render(<App />)

    expect(await axe(container)).toHaveNoViolations()
  })

  it('does nothing when clicking a tile that is not a legal move', async () => {
    render(<App />)

    await userEvent.click(screen.getByLabelText(cellLabel(0, 0)))
    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(cellLabel(0, 1)))
    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()
  })

  it('shows the stuck message once no legal moves remain', async () => {
    render(<App />)

    for (const { row, col } of STUCK_SEQUENCE) {
      await userEvent.click(screen.getByLabelText(cellLabel(row, col)))
    }

    expect(
      screen.getByText('Stuck at 6. No legal moves remain.'),
    ).toBeInTheDocument()
  })

  it('shows the win message after a full game and resets from it', async () => {
    render(<App />)

    for (const { row, col } of WINNING_SEQUENCE) {
      await userEvent.click(screen.getByLabelText(cellLabel(row, col)))
    }

    expect(screen.getByText('You reached 100!')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'New game' }))
    expect(screen.getByText('Place number 1 of 100')).toBeInTheDocument()
  }, 20000)
})

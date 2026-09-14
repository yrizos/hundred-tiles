import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
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
  afterEach(() => {
    window.localStorage.clear()
  })

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

  it('undoes the latest move', async () => {
    render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))
    await userEvent.click(screen.getByRole('button', { name: 'Undo (3 left)' }))

    expect(screen.getByText('Place number 1 of 100')).toBeInTheDocument()
    expect(screen.getByLabelText('Row 1, column 1, valid move')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Undo (2 left)' })).toBeDisabled()
  })

  it('shows undo and redo icons with counters around the new game button', () => {
    render(<App />)

    const actions = screen.getByRole('button', { name: 'New game' }).parentElement
    const buttons = actions?.querySelectorAll('button')

    expect(buttons).toHaveLength(3)
    expect(buttons?.[0]).toHaveAttribute('title', 'undo (3 left)')
    expect(buttons?.[0]?.querySelector('svg')).toBeInTheDocument()
    expect(buttons?.[0]).toHaveTextContent('3')
    expect(buttons?.[1]).toHaveTextContent('New game')
    expect(buttons?.[2]).toHaveAttribute('title', 'redo (0 available)')
    expect(buttons?.[2]?.querySelector('svg')).toBeInTheDocument()
    expect(buttons?.[2]).toHaveTextContent('0')
  })

  it('redoes the latest undone move and restores its undo allowance', async () => {
    render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))
    await userEvent.click(screen.getByRole('button', { name: 'Undo (3 left)' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Redo (1 available)' }),
    )

    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Row 1, column 1, filled with 1, last placed'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Undo (3 left)' })).toBeEnabled()
    expect(
      screen.getByRole('button', { name: 'Redo (0 available)' }),
    ).toBeDisabled()
  })

  it('redoes multiple undone moves in order', async () => {
    render(<App />)

    for (const position of [
      [0, 0],
      [0, 3],
      [0, 6],
    ]) {
      await userEvent.click(
        screen.getByLabelText(cellLabel(position[0], position[1])),
      )
    }

    await userEvent.click(screen.getByRole('button', { name: 'Undo (3 left)' }))
    await userEvent.click(screen.getByRole('button', { name: 'Undo (2 left)' }))
    await userEvent.click(screen.getByRole('button', { name: 'Undo (1 left)' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Redo (3 available)' }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Redo (2 available)' }),
    )

    expect(screen.getByText('Place number 3 of 100')).toBeInTheDocument()
    expect(screen.getByLabelText(cellLabel(0, 0))).toHaveTextContent('1')
    expect(screen.getByLabelText(cellLabel(0, 3))).toHaveTextContent('2')
    expect(
      screen.getByLabelText('Row 1, column 7, valid move'),
    ).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Undo (2 left)' })).toBeEnabled()
    expect(
      screen.getByRole('button', { name: 'Redo (1 available)' }),
    ).toBeEnabled()
  })

  it('allows only three undos and restores the allowance after a reset', async () => {
    render(<App />)

    for (const position of [
      [0, 0],
      [0, 3],
      [0, 6],
    ]) {
      await userEvent.click(
        screen.getByLabelText(cellLabel(position[0], position[1])),
      )
    }

    await userEvent.click(screen.getByRole('button', { name: 'Undo (3 left)' }))
    await userEvent.click(screen.getByRole('button', { name: 'Undo (2 left)' }))
    await userEvent.click(screen.getByRole('button', { name: 'Undo (1 left)' }))

    expect(screen.getByRole('button', { name: 'Undo (0 left)' })).toBeDisabled()
    expect(screen.getByText('Place number 1 of 100')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))
    await userEvent.click(screen.getByRole('button', { name: 'New game' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(screen.getByRole('button', { name: 'Undo (3 left)' })).toBeDisabled()
  })

  it('persists the remaining undo allowance after a reload', async () => {
    const firstRender = render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))
    await userEvent.click(screen.getByRole('button', { name: 'Undo (3 left)' }))
    firstRender.unmount()
    render(<App />)

    expect(screen.getByRole('button', { name: 'Undo (2 left)' })).toBeDisabled()
  })

  it('persists redo history after a reload', async () => {
    const firstRender = render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))
    await userEvent.click(screen.getByRole('button', { name: 'Undo (3 left)' }))
    firstRender.unmount()
    render(<App />)

    expect(
      screen.getByRole('button', { name: 'Redo (1 available)' }),
    ).toBeEnabled()
    await userEvent.click(
      screen.getByRole('button', { name: 'Redo (1 available)' }),
    )
    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()
  })

  it('does not create a redo after placing a new move following an undo', async () => {
    render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))
    await userEvent.click(screen.getByRole('button', { name: 'Undo (3 left)' }))
    await userEvent.click(screen.getByLabelText('Row 1, column 2, valid move'))

    expect(
      screen.getByRole('button', { name: 'Redo (0 available)' }),
    ).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Undo (2 left)' })).toBeEnabled()
    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()
  })

  it('restores the game after the app is remounted', async () => {
    const firstRender = render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))
    firstRender.unmount()
    render(<App />)

    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Row 1, column 1, filled with 1, last placed'),
    ).toBeInTheDocument()
  })

  it('disables "New game" until a number has been placed', async () => {
    render(<App />)

    const resetButton = screen.getByRole('button', { name: 'New game' })
    expect(resetButton).toBeDisabled()

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))

    expect(resetButton).toBeEnabled()
  })

  it('asks for confirmation and resets the game once confirmed', async () => {
    render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))
    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'New game' }))
    expect(
      screen.getByRole('alertdialog', { name: 'Start a new game?' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Confirm' }),
    )

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByText('Place number 1 of 100')).toBeInTheDocument()
  })

  it('does not restore progress after a confirmed reset', async () => {
    const firstRender = render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))
    await userEvent.click(screen.getByRole('button', { name: 'New game' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    firstRender.unmount()
    render(<App />)

    expect(screen.getByText('Place number 1 of 100')).toBeInTheDocument()
  })

  it('starts a new game when saved state is invalid', () => {
    window.localStorage.setItem('hundred-tiles-game-state', '{invalid')

    render(<App />)

    expect(screen.getByText('Place number 1 of 100')).toBeInTheDocument()
  })

  it('keeps the game unchanged when the reset confirmation is cancelled', async () => {
    render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))
    await userEvent.click(screen.getByRole('button', { name: 'New game' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()
  })

  it('keeps the game unchanged when the reset confirmation is dismissed with Escape', async () => {
    render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1, valid move'))
    await userEvent.click(screen.getByRole('button', { name: 'New game' }))
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()
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
    ).toHaveClass('status--stuck')
  })

  it('does not apply the stuck or won style while moves remain', () => {
    render(<App />)

    const status = screen.getByText('Place number 1 of 100')
    expect(status).not.toHaveClass('status--stuck')
    expect(status).not.toHaveClass('status--won')
  })

  it('shows the win message after a full game and resets from it', async () => {
    render(<App />)

    for (const { row, col } of WINNING_SEQUENCE) {
      await userEvent.click(screen.getByLabelText(cellLabel(row, col)))
    }

    expect(screen.getByText('You reached 100!')).toHaveClass('status--won')

    await userEvent.click(screen.getByRole('button', { name: 'New game' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Confirm' }),
    )
    expect(screen.getByText('Place number 1 of 100')).toBeInTheDocument()
  }, 20000)
})

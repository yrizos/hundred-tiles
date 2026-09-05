import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('starts with a message to place number 1', () => {
    render(<App />)
    expect(screen.getByText('Place number 1 of 100')).toBeInTheDocument()
  })

  it('advances the status after placing a number', async () => {
    render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1'))

    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()
  })

  it('resets the game when "New game" is clicked', async () => {
    render(<App />)

    await userEvent.click(screen.getByLabelText('Row 1, column 1'))
    expect(screen.getByText('Place number 2 of 100')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'New game' }))

    expect(screen.getByText('Place number 1 of 100')).toBeInTheDocument()
  })
})

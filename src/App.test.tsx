import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { axe } from 'jest-axe'
import App from './App'

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
})

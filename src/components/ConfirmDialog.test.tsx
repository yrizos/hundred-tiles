import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'jest-axe'
import ConfirmDialog from './ConfirmDialog'

function renderDialog() {
  const onConfirm = vi.fn()
  const onCancel = vi.fn()
  const { container } = render(
    <ConfirmDialog
      title="Start a new game?"
      message="This will reset your current progress."
      confirmLabel="Confirm"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />,
  )
  return { onConfirm, onCancel, container }
}

describe('ConfirmDialog', () => {
  it('renders the title and message and exposes them as the accessible name/description', () => {
    renderDialog()

    const dialog = screen.getByRole('alertdialog', {
      name: 'Start a new game?',
    })
    expect(dialog).toHaveAccessibleDescription(
      'This will reset your current progress.',
    )
  })

  it('focuses the cancel button on mount', () => {
    renderDialog()

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  it('calls onConfirm when the confirm button is clicked', async () => {
    const { onConfirm, onCancel } = renderDialog()

    await userEvent.click(
      screen.getByRole('button', { name: 'Confirm' }),
    )

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const { onConfirm, onCancel } = renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('calls onCancel when Escape is pressed', async () => {
    const { onCancel } = renderDialog()

    await userEvent.keyboard('{Escape}')

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('traps Tab focus between the cancel and confirm buttons', async () => {
    renderDialog()

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    const confirmButton = screen.getByRole('button', {
      name: 'Confirm',
    })

    expect(cancelButton).toHaveFocus()

    await userEvent.tab()
    expect(confirmButton).toHaveFocus()

    await userEvent.tab()
    expect(cancelButton).toHaveFocus()

    await userEvent.tab({ shift: true })
    expect(confirmButton).toHaveFocus()
  })

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = renderDialog()

    expect(await axe(container)).toHaveNoViolations()
  })
})

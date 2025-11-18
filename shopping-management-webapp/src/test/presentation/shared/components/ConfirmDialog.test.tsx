import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from '../../../../presentation/shared/components/ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={false}
        title="Delete item"
        message="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders dialog when isOpen is true', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Delete item"
        message="Are you sure you want to delete this item?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Delete item')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument()
  })

  it('renders with confirm and cancel buttons', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm action"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const handleConfirm = vi.fn()
    const handleCancel = vi.fn()
    const user = userEvent.setup()

    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm action"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    )

    await user.click(screen.getByRole('button', { name: /confirmar/i }))

    expect(handleConfirm).toHaveBeenCalledTimes(1)
    expect(handleCancel).not.toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const handleConfirm = vi.fn()
    const handleCancel = vi.fn()
    const user = userEvent.setup()

    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm action"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    )

    await user.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(handleCancel).toHaveBeenCalledTimes(1)
    expect(handleConfirm).not.toHaveBeenCalled()
  })

  it('calls onCancel when pressing Escape key', async () => {
    const handleCancel = vi.fn()
    const user = userEvent.setup()

    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm action"
        onConfirm={() => {}}
        onCancel={handleCancel}
      />
    )

    await user.keyboard('{Escape}')

    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it('renders with danger variant (red confirm button)', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm action"
        variant="danger"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    expect(confirmButton).toHaveClass('bg-danger')
  })

  it('renders with warning variant (yellow confirm button)', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Warning"
        message="Are you sure?"
        variant="warning"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    expect(confirmButton).toHaveClass('bg-warning')
  })

  it('renders with info variant (blue confirm button)', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Info"
        message="Just checking"
        variant="info"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    expect(confirmButton).toHaveClass('bg-primary')
  })

  it('uses custom confirm button text', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm"
        confirmText="Eliminar ahora"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: 'Eliminar ahora' })).toBeInTheDocument()
  })

  it('uses custom cancel button text', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm"
        cancelText="No, volver"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: 'No, volver' })).toBeInTheDocument()
  })

  it('disables confirm button when loading', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm"
        loading={true}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /cargando/i })
    expect(confirmButton).toBeDisabled()
  })

  it('disables cancel button when loading', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm"
        loading={true}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    expect(cancelButton).toBeDisabled()
  })

  it('shows loading state on confirm button', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm"
        loading={true}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('does not call onConfirm when loading', async () => {
    const handleConfirm = vi.fn()
    const user = userEvent.setup()

    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm"
        loading={true}
        onConfirm={handleConfirm}
        onCancel={() => {}}
      />
    )

    await user.click(screen.getByRole('button', { name: /cargando/i }))

    expect(handleConfirm).not.toHaveBeenCalled()
  })

  it('focuses confirm button by default', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    expect(confirmButton).toHaveFocus()
  })

  it('focuses cancel button when defaultFocus is cancel', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm"
        defaultFocus="cancel"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    expect(cancelButton).toHaveFocus()
  })

  it('renders with icon for danger variant', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm"
        variant="danger"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    // Check for danger icon (AlertTriangle from lucide-react)
    const icon = document.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('does not close on backdrop click (critical action)', async () => {
    const handleCancel = vi.fn()
    const user = userEvent.setup()

    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm"
        onConfirm={() => {}}
        onCancel={handleCancel}
      />
    )

    const backdrop = document.querySelector('[data-testid="modal-backdrop"]')!
    await user.click(backdrop)

    expect(handleCancel).not.toHaveBeenCalled()
  })

  it('renders as small modal size', () => {
    render(
      <ConfirmDialog
        isOpen
        title="Delete"
        message="Confirm"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('max-w-sm')
  })
})
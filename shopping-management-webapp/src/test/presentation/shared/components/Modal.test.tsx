import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '../../../../presentation/shared/components/Modal'

describe('Modal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Modal content</div>
      </Modal>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders modal content when isOpen is true', () => {
    render(
      <Modal isOpen onClose={() => {}}>
        <div>Modal content</div>
      </Modal>
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('renders with role="dialog" and aria-modal="true"', () => {
    render(
      <Modal isOpen onClose={() => {}}>
        <div>Content</div>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('renders with backdrop', () => {
    render(
      <Modal isOpen onClose={() => {}}>
        <div>Content</div>
      </Modal>
    )
    // Modal is rendered via portal, so it's in document.body
    const backdrop = document.querySelector('[data-testid="modal-backdrop"]')
    expect(backdrop).toBeInTheDocument()
  })

  it('calls onClose when clicking backdrop', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal isOpen onClose={handleClose}>
        <div>Content</div>
      </Modal>
    )

    const backdrop = document.querySelector('[data-testid="modal-backdrop"]')!
    await user.click(backdrop)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when clicking modal content', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal isOpen onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    )

    await user.click(screen.getByText('Modal content'))

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('calls onClose when pressing Escape key', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal isOpen onClose={handleClose}>
        <div>Content</div>
      </Modal>
    )

    await user.keyboard('{Escape}')

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not close on Escape when closeOnEscape is false', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal isOpen onClose={handleClose} closeOnEscape={false}>
        <div>Content</div>
      </Modal>
    )

    await user.keyboard('{Escape}')

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('does not close on backdrop click when closeOnBackdropClick is false', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal isOpen onClose={handleClose} closeOnBackdropClick={false}>
        <div>Content</div>
      </Modal>
    )

    const backdrop = document.querySelector('[data-testid="modal-backdrop"]')!
    await user.click(backdrop)

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('applies custom title with aria-labelledby', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Modal Title">
        <div>Content</div>
      </Modal>
    )

    const dialog = screen.getByRole('dialog')
    const title = screen.getByText('Modal Title')

    expect(title).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-labelledby', expect.stringContaining('modal-title'))
  })

  it('uses aria-label when provided instead of aria-labelledby', () => {
    render(
      <Modal isOpen onClose={() => {}} ariaLabel="Custom label">
        <div>Content</div>
      </Modal>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-label', 'Custom label')
    expect(dialog).not.toHaveAttribute('aria-labelledby')
  })

  it('renders close button when showCloseButton is true', () => {
    render(
      <Modal isOpen onClose={() => {}} showCloseButton>
        <div>Content</div>
      </Modal>
    )

    expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument()
  })

  it('calls onClose when clicking close button', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal isOpen onClose={handleClose} showCloseButton>
        <div>Content</div>
      </Modal>
    )

    await user.click(screen.getByRole('button', { name: /cerrar/i }))

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('applies custom size classes', () => {
    const { rerender } = render(
      <Modal isOpen onClose={() => {}} size="sm">
        <div>Content</div>
      </Modal>
    )
    let dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('max-w-sm')

    rerender(
      <Modal isOpen onClose={() => {}} size="md">
        <div>Content</div>
      </Modal>
    )
    dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('max-w-md')

    rerender(
      <Modal isOpen onClose={() => {}} size="lg">
        <div>Content</div>
      </Modal>
    )
    dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('max-w-lg')

    rerender(
      <Modal isOpen onClose={() => {}} size="xl">
        <div>Content</div>
      </Modal>
    )
    dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('max-w-xl')
  })

  it('applies custom className to dialog', () => {
    render(
      <Modal isOpen onClose={() => {}} className="custom-modal">
        <div>Content</div>
      </Modal>
    )

    expect(screen.getByRole('dialog')).toHaveClass('custom-modal')
  })

  it('traps focus within modal when focusTrap is true', async () => {
    const user = userEvent.setup()

    render(
      <Modal isOpen onClose={() => {}} focusTrap>
        <button>First button</button>
        <button>Second button</button>
      </Modal>
    )

    const firstButton = screen.getByRole('button', { name: 'First button' })
    const secondButton = screen.getByRole('button', { name: 'Second button' })

    // Focus should start on first focusable element
    expect(firstButton).toHaveFocus()

    // Tab to second button
    await user.tab()
    expect(secondButton).toHaveFocus()

    // Tab again should wrap to first button (focus trap)
    await user.tab()
    expect(firstButton).toHaveFocus()

    // Shift+Tab should go backwards to last button
    await user.tab({ shift: true })
    expect(secondButton).toHaveFocus()
  })

  it('sets initial focus to specified element', () => {
    render(
      <Modal isOpen onClose={() => {}} focusTrap>
        <button>First button</button>
        <button data-autofocus>Auto focus button</button>
      </Modal>
    )

    const autoFocusButton = screen.getByRole('button', { name: 'Auto focus button' })
    expect(autoFocusButton).toHaveFocus()
  })

  it('restores focus to previous element when closed', async () => {
    const { rerender } = render(
      <>
        <button>Trigger button</button>
        <Modal isOpen={false} onClose={() => {}}>
          <div>Content</div>
        </Modal>
      </>
    )

    const triggerButton = screen.getByRole('button', { name: 'Trigger button' })
    triggerButton.focus()
    expect(triggerButton).toHaveFocus()

    // Open modal
    rerender(
      <>
        <button>Trigger button</button>
        <Modal isOpen onClose={() => {}} focusTrap>
          <button>Modal button</button>
        </Modal>
      </>
    )

    const modalButton = screen.getByRole('button', { name: 'Modal button' })
    expect(modalButton).toHaveFocus()

    // Close modal
    rerender(
      <>
        <button>Trigger button</button>
        <Modal isOpen={false} onClose={() => {}}>
          <div>Content</div>
        </Modal>
      </>
    )

    // Focus should be restored to trigger button
    expect(triggerButton).toHaveFocus()
  })

  it('prevents body scroll when modal is open', () => {
    const { rerender } = render(
      <Modal isOpen onClose={() => {}}>
        <div>Content</div>
      </Modal>
    )

    expect(document.body.style.overflow).toBe('hidden')

    rerender(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Content</div>
      </Modal>
    )

    expect(document.body.style.overflow).toBe('')
  })

  it('renders with animation classes', () => {
    render(
      <Modal isOpen onClose={() => {}}>
        <div>Content</div>
      </Modal>
    )

    const dialog = screen.getByRole('dialog')
    // Should have animation/transition classes
    expect(dialog.className).toMatch(/animate|transition|fade|scale/)
  })
})
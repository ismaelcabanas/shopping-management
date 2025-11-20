import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TicketScanModal } from '../../../presentation/components/TicketScanModal'

describe('TicketScanModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render modal when closed', () => {
    const mockOnClose = vi.fn()
    const mockOnConfirm = vi.fn()

    render(
      <TicketScanModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    )

    expect(screen.queryByText(/escanear ticket/i)).not.toBeInTheDocument()
  })

  it('should render modal with upload view when open', () => {
    const mockOnClose = vi.fn()
    const mockOnConfirm = vi.fn()

    render(
      <TicketScanModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    )

    expect(screen.getByRole('dialog', { name: /escanear ticket/i })).toBeInTheDocument()
    expect(screen.getByText(/selecciona una imagen del ticket/i)).toBeInTheDocument()
  })

  it('should have file input for uploading tickets', () => {
    render(<TicketScanModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />)

    const input = screen.getByLabelText(/selecciona una imagen del ticket/i, { selector: 'input' })
    expect(input).toHaveAttribute('type', 'file')
    expect(input).toHaveAttribute('accept', 'image/*')
  })

  // Note: Full file upload -> processing -> results flow is validated in E2E tests
  // This is due to complexity of testing FileReader async behavior in unit tests
  // Individual components (TicketUploadView, TicketProcessingView, TicketResultsView) are tested separately
})

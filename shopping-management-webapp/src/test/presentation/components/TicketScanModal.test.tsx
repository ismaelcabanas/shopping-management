import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TicketScanModal } from '../../../presentation/components/TicketScanModal'

describe('TicketScanModal', () => {
  it('should render modal when open', () => {
    const mockOnClose = vi.fn()
    const mockOnConfirm = vi.fn()

    render(
      <TicketScanModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    )

    expect(screen.getByText(/escanear ticket/i)).toBeInTheDocument()
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
})

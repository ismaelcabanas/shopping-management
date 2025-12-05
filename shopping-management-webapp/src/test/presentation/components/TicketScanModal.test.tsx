import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TicketScanModal } from '../../../presentation/components/TicketScanModal'
import { MockOCRService } from '../../../infrastructure/services/MockOCRService'
import { LocalStorageProductRepository } from '../../../infrastructure/repositories/LocalStorageProductRepository'

describe('TicketScanModal', () => {
  let mockOcrService: MockOCRService
  let mockProductRepository: LocalStorageProductRepository

  beforeEach(() => {
    vi.clearAllMocks()
    mockOcrService = new MockOCRService('Mock product | 1')
    mockProductRepository = new LocalStorageProductRepository()
  })

  it('should not render modal when closed', () => {
    const mockOnClose = vi.fn()
    const mockOnConfirm = vi.fn()

    render(
      <TicketScanModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        ocrService={mockOcrService}
        productRepository={mockProductRepository}
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
        ocrService={mockOcrService}
        productRepository={mockProductRepository}
      />
    )

    expect(screen.getByRole('dialog', { name: /escanear ticket/i })).toBeInTheDocument()
    expect(screen.getByText(/selecciona una imagen del ticket/i)).toBeInTheDocument()
  })

  it('should have file input for uploading tickets', () => {
    render(
      <TicketScanModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        ocrService={mockOcrService}
        productRepository={mockProductRepository}
      />
    )

    const input = screen.getByLabelText(/selecciona una imagen del ticket/i, { selector: 'input' })
    expect(input).toHaveAttribute('type', 'file')
    expect(input).toHaveAttribute('accept', 'image/*')
  })

  // Note: Full file upload -> processing -> results flow is validated in E2E tests
  // This is due to complexity of testing FileReader async behavior in unit tests
  // Individual components (TicketUploadView, TicketProcessingView, TicketResultsView) are tested separately
})

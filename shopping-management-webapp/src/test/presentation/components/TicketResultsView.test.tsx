import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TicketResultsView } from '../../../presentation/components/TicketResultsView'
import type { MatchedDetectedItem } from '../../../application/dtos/TicketScanResult'

describe('TicketResultsView', () => {
  const mockMatchedItem: MatchedDetectedItem = {
    id: '1',
    rawLine: 'LECHE 2 3.50',
    productName: 'LECHE',
    quantity: 2,
    confidence: 0.9,
    matchedProductId: 'prod-1',
    matchedProductName: 'Leche Entera',
    status: 'matched'
  }

  const mockLowConfidenceItem: MatchedDetectedItem = {
    id: '2',
    rawLine: 'PAN 1 1.20',
    productName: 'PAN',
    quantity: 1,
    confidence: 0.6,
    matchedProductId: 'prod-2',
    matchedProductName: 'Pan de Molde',
    status: 'low-confidence'
  }

  const mockUnmatchedItem: MatchedDetectedItem = {
    id: '3',
    rawLine: 'PRODUCTO DESCONOCIDO 3 5.00',
    productName: 'PRODUCTO DESCONOCIDO',
    quantity: 3,
    confidence: 0.3,
    status: 'unmatched'
  }

  it('should render results header with item count', () => {
    const items = [mockMatchedItem, mockLowConfidenceItem]
    render(<TicketResultsView items={items} onConfirm={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByRole('heading', { name: /productos detectados \(2\)/i })).toBeInTheDocument()
  })

  it('should render list of detected items', () => {
    const items = [mockMatchedItem, mockLowConfidenceItem]
    render(<TicketResultsView items={items} onConfirm={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByText('Leche Entera')).toBeInTheDocument()
    expect(screen.getByText('Pan de Molde')).toBeInTheDocument()
  })

  it('should show quantity for each item', () => {
    const items = [mockMatchedItem]
    render(<TicketResultsView items={items} onConfirm={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByText(/2/)).toBeInTheDocument()
  })

  it('should show visual indicator for matched items', () => {
    const items = [mockMatchedItem]
    const { container } = render(<TicketResultsView items={items} onConfirm={vi.fn()} onCancel={vi.fn()} />)

    // Check for success indicator (green color class or check icon)
    expect(container.querySelector('[data-status="matched"]')).toBeInTheDocument()
  })

  it('should show visual indicator for low-confidence items', () => {
    const items = [mockLowConfidenceItem]
    const { container } = render(<TicketResultsView items={items} onConfirm={vi.fn()} onCancel={vi.fn()} />)

    // Check for warning indicator (yellow/orange color or alert icon)
    expect(container.querySelector('[data-status="low-confidence"]')).toBeInTheDocument()
  })

  it('should show visual indicator for unmatched items', () => {
    const items = [mockUnmatchedItem]
    const { container } = render(<TicketResultsView items={items} onConfirm={vi.fn()} onCancel={vi.fn()} />)

    // Check for error indicator (red color or x icon)
    expect(container.querySelector('[data-status="unmatched"]')).toBeInTheDocument()
  })

  it('should render confirm and cancel buttons', () => {
    const items = [mockMatchedItem]
    render(<TicketResultsView items={items} onConfirm={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument()
  })

  it('should call onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnConfirm = vi.fn()
    const items = [mockMatchedItem]

    render(<TicketResultsView items={items} onConfirm={mockOnConfirm} onCancel={vi.fn()} />)

    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    await user.click(confirmButton)

    expect(mockOnConfirm).toHaveBeenCalledWith(items)
  })

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnCancel = vi.fn()
    const items = [mockMatchedItem]

    render(<TicketResultsView items={items} onConfirm={vi.fn()} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByRole('button', { name: /cerrar/i })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })
})

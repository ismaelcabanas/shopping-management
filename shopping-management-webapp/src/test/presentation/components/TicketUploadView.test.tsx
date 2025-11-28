import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TicketUploadView } from '../../../presentation/components/TicketUploadView'

describe('TicketUploadView', () => {
  it('should render upload area', () => {
    const mockOnFileSelect = vi.fn()

    render(<TicketUploadView onFileSelect={mockOnFileSelect} />)

    expect(screen.getByText(/selecciona una imagen del ticket/i)).toBeInTheDocument()
  })

  it('should call onFileSelect when file is selected', async () => {
    const user = userEvent.setup()
    const mockOnFileSelect = vi.fn()
    const file = new File(['ticket'], 'ticket.jpg', { type: 'image/jpeg' })

    render(<TicketUploadView onFileSelect={mockOnFileSelect} />)

    const input = screen.getByLabelText(/selecciona una imagen del ticket/i, { selector: 'input' })
    await user.upload(input, file)

    expect(mockOnFileSelect).toHaveBeenCalledWith(file)
  })
})

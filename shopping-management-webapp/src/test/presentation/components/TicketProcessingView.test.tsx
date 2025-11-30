import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TicketProcessingView } from '../../../presentation/components/TicketProcessingView'

describe('TicketProcessingView', () => {
  it('should render processing message', () => {
    render(<TicketProcessingView />)

    expect(screen.getByText(/procesando ticket/i)).toBeInTheDocument()
  })

  it('should show loading spinner', () => {
    render(<TicketProcessingView />)

    // The loading spinner should be present (lucide-react Loader2 component)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
  })
})

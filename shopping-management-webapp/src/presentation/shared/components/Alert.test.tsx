import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { AlertTriangle } from 'lucide-react'
import { Alert } from './Alert'

describe('Alert', () => {
  describe('Basic rendering', () => {
    it('should render with children', () => {
      render(<Alert>This is an alert message</Alert>)

      expect(screen.getByText('This is an alert message')).toBeInTheDocument()
    })

    it('should render with title and children', () => {
      render(<Alert title="Warning">Please check your settings</Alert>)

      expect(screen.getByText('Warning')).toBeInTheDocument()
      expect(screen.getByText('Please check your settings')).toBeInTheDocument()
    })

    it('should have proper accessibility attributes', () => {
      const { container } = render(<Alert>Alert message</Alert>)
      const alert = container.firstChild

      expect(alert).toHaveAttribute('role', 'alert')
      expect(alert).toHaveAttribute('aria-live', 'assertive')
    })
  })

  describe('Variants', () => {
    it('should render info variant with default styling', () => {
      const { container } = render(<Alert variant="info">Info message</Alert>)

      expect(container.firstChild).toHaveClass('bg-blue-50')
      expect(container.firstChild).toHaveClass('border-blue-200')
    })

    it('should render success variant', () => {
      const { container } = render(<Alert variant="success">Success message</Alert>)

      expect(container.firstChild).toHaveClass('bg-green-50')
      expect(container.firstChild).toHaveClass('border-green-200')
    })

    it('should render warning variant', () => {
      const { container } = render(<Alert variant="warning">Warning message</Alert>)

      expect(container.firstChild).toHaveClass('bg-yellow-50')
      expect(container.firstChild).toHaveClass('border-yellow-200')
    })

    it('should render error variant', () => {
      const { container } = render(<Alert variant="error">Error message</Alert>)

      expect(container.firstChild).toHaveClass('bg-red-50')
      expect(container.firstChild).toHaveClass('border-red-200')
    })

    it('should default to info variant when not specified', () => {
      const { container } = render(<Alert>Default message</Alert>)

      expect(container.firstChild).toHaveClass('bg-blue-50')
    })
  })

  describe('Auto icon selection', () => {
    it('should show Info icon for info variant', () => {
      render(<Alert variant="info">Info message</Alert>)

      const icon = screen.getByTestId('alert-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should show CheckCircle icon for success variant', () => {
      render(<Alert variant="success">Success message</Alert>)

      const icon = screen.getByTestId('alert-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should show AlertTriangle icon for warning variant', () => {
      render(<Alert variant="warning">Warning message</Alert>)

      const icon = screen.getByTestId('alert-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should show XCircle icon for error variant', () => {
      render(<Alert variant="error">Error message</Alert>)

      const icon = screen.getByTestId('alert-icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Custom icon', () => {
    it('should render custom icon when provided', () => {
      render(
        <Alert icon={<AlertTriangle data-testid="custom-icon" />}>
          Custom icon alert
        </Alert>
      )

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
      expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument()
    })

    it('should hide icon when icon is null', () => {
      render(<Alert icon={null}>No icon alert</Alert>)

      expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument()
    })
  })

  describe('Closable functionality', () => {
    it('should not render close button by default', () => {
      render(<Alert>Alert message</Alert>)

      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
    })

    it('should render close button when closable is true', () => {
      const mockOnClose = vi.fn()
      render(<Alert closable onClose={mockOnClose}>Closable alert</Alert>)

      const closeButton = screen.getByRole('button', { name: /close alert/i })
      expect(closeButton).toBeInTheDocument()
    })

    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      const mockOnClose = vi.fn()
      render(<Alert closable onClose={mockOnClose}>Closable alert</Alert>)

      const closeButton = screen.getByRole('button', { name: /close alert/i })
      await user.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledOnce()
    })

    it('should have accessible close button', () => {
      const mockOnClose = vi.fn()
      render(<Alert closable onClose={mockOnClose}>Alert</Alert>)

      const closeButton = screen.getByRole('button', { name: /close alert/i })
      expect(closeButton).toHaveAttribute('aria-label', 'Close alert')
    })
  })

  describe('Full width', () => {
    it('should not be full width by default', () => {
      const { container } = render(<Alert>Alert message</Alert>)

      expect(container.firstChild).not.toHaveClass('w-full')
    })

    it('should be full width when fullWidth is true', () => {
      const { container } = render(<Alert fullWidth>Full width alert</Alert>)

      expect(container.firstChild).toHaveClass('w-full')
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<Alert className="custom-class">Alert</Alert>)

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should preserve default classes when custom className is added', () => {
      const { container } = render(<Alert className="custom-class">Alert</Alert>)

      expect(container.firstChild).toHaveClass('rounded-lg')
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Complete example', () => {
    it('should render fully featured alert', async () => {
      const user = userEvent.setup()
      const mockOnClose = vi.fn()

      render(
        <Alert
          variant="warning"
          title="API Key Missing"
          closable
          onClose={mockOnClose}
          fullWidth
          icon={<AlertTriangle data-testid="warning-icon" />}
        >
          Please configure your VITE_OCR_LLM_API_KEY environment variable to enable ticket scanning.
        </Alert>
      )

      // Check all elements are present
      expect(screen.getByText('API Key Missing')).toBeInTheDocument()
      expect(screen.getByText(/Please configure your VITE_OCR_LLM_API_KEY/)).toBeInTheDocument()
      expect(screen.getByTestId('warning-icon')).toBeInTheDocument()

      const closeButton = screen.getByRole('button', { name: /close alert/i })
      expect(closeButton).toBeInTheDocument()

      // Test close functionality
      await user.click(closeButton)
      expect(mockOnClose).toHaveBeenCalledOnce()
    })
  })
})

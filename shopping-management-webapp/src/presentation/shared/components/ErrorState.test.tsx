import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  describe('Basic rendering', () => {
    it('should render with default props', () => {
      render(<ErrorState />)

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('should render with custom title', () => {
      render(<ErrorState title="Custom Error Title" />)

      expect(screen.getByText('Custom Error Title')).toBeInTheDocument()
    })

    it('should render with custom message', () => {
      render(<ErrorState message="Custom error description" />)

      expect(screen.getByText('Custom error description')).toBeInTheDocument()
    })
  })

  describe('Error details', () => {
    it('should show error message when error prop is provided', () => {
      const error = new Error('Detailed error message')

      render(<ErrorState error={error} />)

      expect(screen.getByText('Detailed error message')).toBeInTheDocument()
    })

    it('should show default message when no error prop is provided', () => {
      render(<ErrorState />)

      expect(screen.getByText(/unexpected error/i)).toBeInTheDocument()
    })
  })

  describe('Reset functionality', () => {
    it('should render reset button when onReset is provided', () => {
      const mockOnReset = vi.fn()
      render(<ErrorState onReset={mockOnReset} />)

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })

    it('should call onReset when button is clicked', async () => {
      const user = userEvent.setup()
      const mockOnReset = vi.fn()

      render(<ErrorState onReset={mockOnReset} />)

      const resetButton = screen.getByRole('button', { name: /try again/i })
      await user.click(resetButton)

      expect(mockOnReset).toHaveBeenCalledOnce()
    })

    it('should not render reset button when onReset is not provided', () => {
      render(<ErrorState onReset={undefined} />)

      expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { container } = render(<ErrorState />)

      expect(container.firstChild).toHaveAttribute('role', 'alert')
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<ErrorState className="custom-error" />)

      expect(container.firstChild).toHaveClass('custom-error')
    })
  })

  describe('Complete example', () => {
    it('should render fully customized error state with custom message', async () => {
      const user = userEvent.setup()
      const mockOnReset = vi.fn()
      const testError = new Error('Network request failed')

      render(
        <ErrorState
          title="Network Error"
          message="Failed to load data from the server"
          error={testError}
          onReset={mockOnReset}
        />
      )

      expect(screen.getByText('Network Error')).toBeInTheDocument()
      // Custom message takes priority over error.message
      expect(screen.getByText('Failed to load data from the server')).toBeInTheDocument()
      expect(screen.queryByText('Network request failed')).not.toBeInTheDocument()

      const resetButton = screen.getByRole('button', { name: /try again/i })
      await user.click(resetButton)

      expect(mockOnReset).toHaveBeenCalledOnce()
    })

    it('should render error message when no custom message provided', () => {
      const testError = new Error('Network request failed')

      render(
        <ErrorState
          title="Network Error"
          error={testError}
          onReset={vi.fn()}
        />
      )

      expect(screen.getByText('Network Error')).toBeInTheDocument()
      // Error.message is used when no custom message provided
      expect(screen.getByText('Network request failed')).toBeInTheDocument()
    })
  })
})

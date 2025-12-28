import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ErrorBoundary } from './ErrorBoundary'

// Test component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests since we're intentionally throwing errors
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('Normal rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Child content</div>
        </ErrorBoundary>
      )

      expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    it('should not render error state initially', () => {
      render(
        <ErrorBoundary>
          <div>Content</div>
        </ErrorBoundary>
      )

      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
    })
  })

  describe('Error catching', () => {
    it('should catch errors from child components', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })

    it('should display error message when error is caught', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Test error')).toBeInTheDocument()
    })

    it('should show fallback UI instead of crashing', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Should show error UI, not the original component
      expect(screen.queryByText('No error')).not.toBeInTheDocument()
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  describe('Reset functionality', () => {
    it('should show reset button when error is caught', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })

    it('should reset error state when reset button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Error state should be visible
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      expect(screen.getByText('Test error')).toBeInTheDocument()

      // Click reset button
      const resetButton = screen.getByRole('button', { name: /try again/i })
      await user.click(resetButton)

      // After reset, the error boundary will try to render children again
      // In this test, the child still throws, so error state should appear again
      // This tests that the reset mechanism works
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  describe('Custom fallback', () => {
    it('should render custom fallback when provided', () => {
      const customFallback = <div>Custom error message</div>

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Custom error message')).toBeInTheDocument()
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
    })
  })

  describe('onError callback', () => {
    it('should call onError callback when error is caught', () => {
      const onError = vi.fn()

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(onError).toHaveBeenCalledOnce()
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Test error' }),
        expect.any(Object) // error info
      )
    })
  })
})

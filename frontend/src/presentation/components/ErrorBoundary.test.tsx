/**
 * @vitest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

// Component that throws error during render based on prop
const BuggyComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error from BuggyComponent')
  }
  return <div data-testid="child-content">OK</div>
}

// Test wrapper that can trigger errors
const TestWrapper: React.FC<{ hasError: boolean; onReset?: () => void }> = ({
  hasError,
  onReset
}) => {
  return (
    <ErrorBoundary onReset={onReset}>
      <BuggyComponent shouldThrow={hasError} />
    </ErrorBoundary>
  )
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Mock console.error to avoid noise in test output
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders children when no error', () => {
    render(<TestWrapper hasError={false} />)

    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('catches errors from children and shows fallback', () => {
    render(<TestWrapper hasError={true} />)

    expect(screen.getByText('Ha ocurrido un error')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recargar página' })).toBeInTheDocument()
  })

  it('calls onReset when Reintentar is clicked', () => {
    const onReset = vi.fn()

    render(<TestWrapper hasError={true} onReset={onReset} />)

    const retryButton = screen.getByRole('button', { name: 'Reintentar' })
    fireEvent.click(retryButton)

    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('displays error message when available', () => {
    render(<TestWrapper hasError={true} />)

    expect(screen.getByText('Ha ocurrido un error')).toBeInTheDocument()
    expect(screen.getByText('Test error from BuggyComponent')).toBeInTheDocument()
  })

  it('can recover from error state when reset', () => {
    const TestRecovery: React.FC = () => {
      const [hasError, setHasError] = React.useState(true)

      const handleReset = () => {
        setHasError(false)
      }

      return (
        <ErrorBoundary onReset={handleReset}>
          <BuggyComponent shouldThrow={hasError} />
        </ErrorBoundary>
      )
    }

    render(<TestRecovery />)

    // Initially should show error
    expect(screen.getByText('Ha ocurrido un error')).toBeInTheDocument()

    // Click retry button
    const retryButton = screen.getByRole('button', { name: 'Reintentar' })
    fireEvent.click(retryButton)

    // Should now show normal content
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('OK')).toBeInTheDocument()
  })
})

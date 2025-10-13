/**
 * @vitest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

// Simple component that throws an error immediately
const ThrowError: React.FC<{ message?: string }> = ({ message = 'Test error' }) => {
  throw new Error(message)
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
    render(
      <ErrorBoundary>
        <div data-testid="child-content">OK</div>
      </ErrorBoundary>
    )

    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('catches errors from children and shows fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Ha ocurrido un error')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recargar página' })).toBeInTheDocument()
  })

  it('calls onReset when Reintentar is clicked', () => {
    const onReset = vi.fn()

    render(
      <ErrorBoundary onReset={onReset}>
        <ThrowError />
      </ErrorBoundary>
    )

    const retryButton = screen.getByRole('button', { name: 'Reintentar' })
    fireEvent.click(retryButton)

    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('displays error message when available', () => {
    const errorMessage = 'Custom error message'

    render(
      <ErrorBoundary>
        <ThrowError message={errorMessage} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Ha ocurrido un error')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })
})

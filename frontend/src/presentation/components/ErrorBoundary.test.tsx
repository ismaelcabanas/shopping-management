/**
 * @vitest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

// Wrapper para forzar el error después del renderizado
const ErrorThrower: React.FC<{ shouldThrow: boolean; children: React.ReactNode }> = ({
  shouldThrow,
  children
}) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <>{children}</>
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: any

  beforeEach(() => {
    // Mock console.error para evitar que los errores aparezcan en la consola durante los tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>OK</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('OK')).toBeDefined()
  })

  it('catches errors from children and shows fallback', () => {
    const TestComponent = () => {
      const [shouldThrow, setShouldThrow] = React.useState(false)

      React.useEffect(() => {
        setShouldThrow(true)
      }, [])

      return (
        <ErrorBoundary>
          <ErrorThrower shouldThrow={shouldThrow}>
            <div>No error</div>
          </ErrorThrower>
        </ErrorBoundary>
      )
    }

    render(<TestComponent />)

    expect(screen.getByText(/Ha ocurrido un error/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Reintentar/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Recargar página/i })).toBeDefined()
  })

  it('calls onReset when Reintentar is clicked', () => {
    const onReset = vi.fn()

    const TestComponent = () => {
      const [shouldThrow, setShouldThrow] = React.useState(false)

      React.useEffect(() => {
        setShouldThrow(true)
      }, [])

      return (
        <ErrorBoundary onReset={onReset}>
          <ErrorThrower shouldThrow={shouldThrow}>
            <div>No error</div>
          </ErrorThrower>
        </ErrorBoundary>
      )
    }

    render(<TestComponent />)

    const retry = screen.getByRole('button', { name: /Reintentar/i })
    fireEvent.click(retry)

    expect(onReset).toHaveBeenCalled()
  })
})

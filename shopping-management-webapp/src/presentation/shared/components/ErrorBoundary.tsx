import { Component, type ReactNode, type ErrorInfo } from 'react'
import { ErrorState } from './ErrorState'

/**
 * Props for ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  /** Child components to wrap with error boundary */
  children: ReactNode
  /** Custom fallback UI - if not provided, uses default ErrorState */
  fallback?: ReactNode
  /** Error callback - called when error is caught, useful for logging */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

/**
 * Internal state for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary catches React errors in child component tree and displays fallback UI.
 *
 * Prevents white screen crashes by gracefully handling errors at component level.
 * Must be a class component as error boundaries require lifecycle methods.
 *
 * @example
 * ```tsx
 * // Wrap routes with error boundary
 * <ErrorBoundary onError={(error) => console.error(error)}>
 *   <Routes>
 *     <Route path="/" element={<HomePage />} />
 *   </Routes>
 * </ErrorBoundary>
 *
 * // Custom fallback UI
 * <ErrorBoundary fallback={<div>Custom error message</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 *
 * @accessibility
 * - Default ErrorState fallback includes proper ARIA attributes
 * - Reset button allows error recovery
 * - Screen reader friendly error messages
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Render default error state
      return (
        <ErrorState
          error={this.state.error || undefined}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

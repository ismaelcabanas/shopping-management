import type { HTMLAttributes } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

/**
 * Props for ErrorState component
 */
export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Error title - defaults to "Something went wrong" */
  title?: string
  /** Error message/description - takes priority over error.message */
  message?: string
  /** Error object - message will be displayed if no custom message provided */
  error?: Error
  /** Reset/retry handler - shows "Try Again" button when provided */
  onReset?: () => void
}

/**
 * ErrorState component displays user-friendly error messages with retry option.
 *
 * Used as fallback UI in ErrorBoundary or for error states in async operations.
 * Provides clear feedback with optional retry mechanism.
 *
 * @example
 * ```tsx
 * // Basic error state
 * <ErrorState error={new Error('Failed to load')} />
 *
 * // Custom title and message with retry
 * <ErrorState
 *   title="Network Error"
 *   message="Unable to connect to server"
 *   onReset={() => refetch()}
 * />
 *
 * // Error from boundary
 * <ErrorState
 *   error={boundaryError}
 *   onReset={() => resetErrorBoundary()}
 * />
 * ```
 *
 * @accessibility
 * - Uses role="alert" for immediate screen reader announcements
 * - AlertTriangle icon provides visual cue
 * - Retry button clearly labeled
 * - WCAG 2.1 Level AA compliant
 */
export function ErrorState({
  title = 'Something went wrong',
  message,
  error,
  onReset,
  className = '',
  ...props
}: ErrorStateProps) {
  // Priority: custom message > error.message > default message
  const errorMessage = message || error?.message || 'An unexpected error occurred. Please try again.'

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      {...props}
    >
      <div className="flex flex-col items-center space-y-4 max-w-md">
        {/* Icon */}
        <div className="text-red-500">
          <AlertTriangle className="w-12 h-12" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>

        {/* Error Message */}
        <p className="text-gray-600 text-sm">
          {errorMessage}
        </p>

        {/* Reset Button */}
        {onReset && (
          <div className="mt-4">
            <Button variant="primary" onClick={onReset}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

import type { HTMLAttributes } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Error title */
  title?: string
  /** Error message/description */
  message?: string
  /** Error object */
  error?: Error
  /** Reset/retry handler */
  onReset?: () => void
}

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

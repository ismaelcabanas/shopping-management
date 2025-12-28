import { useCallback } from 'react'
import { toast } from 'react-hot-toast'

export interface RetryState {
  error: Error
  message: string
  retry: () => void
}

/**
 * Hook for centralized error handling
 * Integrates with toast system and provides retry mechanism
 */
export function useErrorHandler() {
  /**
   * Extract error message from various error types
   */
  const getErrorMessage = useCallback((error: unknown): string => {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return 'An unexpected error occurred'
  }, [])

  /**
   * Handle error by showing toast notification
   */
  const handleError = useCallback(
    (error: unknown, customMessage?: string) => {
      const message = customMessage || getErrorMessage(error)
      toast.error(message)
    },
    [getErrorMessage]
  )

  /**
   * Handle error with retry mechanism
   * Returns error state and retry function
   */
  const handleErrorWithRetry = useCallback(
    (error: Error, retryFn: () => void, customMessage?: string): RetryState => {
      const message = customMessage || getErrorMessage(error)

      return {
        error,
        message,
        retry: retryFn,
      }
    },
    [getErrorMessage]
  )

  return {
    handleError,
    handleErrorWithRetry,
  }
}

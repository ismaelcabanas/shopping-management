import { useCallback } from 'react'
import { toast } from 'react-hot-toast'

/**
 * Return value for handleErrorWithRetry
 */
export interface RetryState {
  /** The error object */
  error: Error
  /** Formatted error message */
  message: string
  /** Retry function */
  retry: () => void
}

/**
 * Hook for centralized error handling with toast integration.
 *
 * Provides consistent error handling across the application with two main functions:
 * - handleError: Show toast notification for errors
 * - handleErrorWithRetry: Return error state with retry mechanism
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { handleError, handleErrorWithRetry } = useErrorHandler()
 *
 *   // Simple error handling with toast
 *   try {
 *     await saveData()
 *   } catch (error) {
 *     handleError(error, 'Failed to save data')
 *   }
 *
 *   // Error handling with retry
 *   try {
 *     await fetchData()
 *   } catch (error) {
 *     const retryState = handleErrorWithRetry(
 *       error as Error,
 *       () => refetch(),
 *       'Failed to load data'
 *     )
 *     setErrorState(retryState)
 *   }
 * }
 * ```
 *
 * @returns Object with handleError and handleErrorWithRetry functions
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

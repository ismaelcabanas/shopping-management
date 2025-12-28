import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { toast } from 'react-hot-toast'
import { useErrorHandler } from './useErrorHandler'

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
  },
}))

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('handleError', () => {
    it('should show toast with error message', () => {
      const { result } = renderHook(() => useErrorHandler())
      const error = new Error('Test error message')

      act(() => {
        result.current.handleError(error)
      })

      expect(toast.error).toHaveBeenCalledWith('Test error message')
    })

    it('should handle string errors', () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.handleError('String error message')
      })

      expect(toast.error).toHaveBeenCalledWith('String error message')
    })

    it('should handle unknown error types with default message', () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.handleError({ code: 500 })
      })

      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred')
    })

    it('should use custom message when provided', () => {
      const { result } = renderHook(() => useErrorHandler())
      const error = new Error('Network failed')

      act(() => {
        result.current.handleError(error, 'Custom error message')
      })

      expect(toast.error).toHaveBeenCalledWith('Custom error message')
    })
  })

  describe('handleErrorWithRetry', () => {
    it('should return error and retry function', () => {
      const { result } = renderHook(() => useErrorHandler())
      const error = new Error('Test error')
      const mockRetryFn = vi.fn()

      const retryState = result.current.handleErrorWithRetry(error, mockRetryFn)

      expect(retryState.error).toBe(error)
      expect(typeof retryState.retry).toBe('function')
    })

    it('should call retry function when retry is invoked', () => {
      const { result } = renderHook(() => useErrorHandler())
      const mockRetryFn = vi.fn()

      const retryState = result.current.handleErrorWithRetry(
        new Error('Test error'),
        mockRetryFn
      )

      act(() => {
        retryState.retry()
      })

      expect(mockRetryFn).toHaveBeenCalledOnce()
    })

    it('should use custom message when provided', () => {
      const { result } = renderHook(() => useErrorHandler())
      const error = new Error('Original message')

      const retryState = result.current.handleErrorWithRetry(
        error,
        vi.fn(),
        'Custom retry message'
      )

      expect(retryState.message).toBe('Custom retry message')
    })

    it('should extract error message when no custom message provided', () => {
      const { result } = renderHook(() => useErrorHandler())
      const error = new Error('Error message')

      const retryState = result.current.handleErrorWithRetry(error, vi.fn())

      expect(retryState.message).toBe('Error message')
    })
  })

  describe('Error message extraction', () => {
    it('should extract message from Error object', () => {
      const { result } = renderHook(() => useErrorHandler())
      const error = new Error('Error object message')

      act(() => {
        result.current.handleError(error)
      })

      expect(toast.error).toHaveBeenCalledWith('Error object message')
    })

    it('should handle null or undefined', () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.handleError(null as unknown as Error)
      })

      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred')
    })
  })
})

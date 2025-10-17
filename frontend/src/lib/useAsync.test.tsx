/**
 * @vitest-environment jsdom
 */
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useAsync } from './useAsync'

describe('useAsync', () => {
  it('handles success state and provides data', async () => {
    const fetcher = vi.fn(async () => {
      await new Promise(r => setTimeout(r, 5))
      return 42
    })

  const { result } = renderHook(() => useAsync(fetcher, []))

  // Initially loading
  expect(result.current.loading).toBe(true)

  // Wait for async to resolve
  await waitFor(() => expect(result.current.loading).toBe(false))

  expect(result.current.error).toBeNull()
  expect(result.current.data).toBe(42)
  expect(fetcher).toHaveBeenCalled()
  })

  it('handles errors and exposes error state', async () => {
    const error = new Error('boom')
    const fetcher = vi.fn(async () => {
      await new Promise(r => setTimeout(r, 5))
      throw error
    })

  const { result } = renderHook(() => useAsync(fetcher, []))

  expect(result.current.loading).toBe(true)

  await waitFor(() => expect(result.current.loading).toBe(false))

  expect(result.current.data).toBeNull()
  expect(result.current.error).toBeInstanceOf(Error)
  expect(String(result.current.error)).toContain('boom')
  })

  it('allows manual run to refresh data', async () => {
    let counter = 0
    const fetcher = vi.fn(async () => {
      await new Promise(r => setTimeout(r, 5))
      return ++counter
    })

    const { result } = renderHook(() => useAsync(fetcher, []))
    await waitFor(() => expect(result.current.data).toBe(1))

    await act(async () => {
      const val = await result.current.run()
      // run should return the latest value (or undefined if canceled)
      expect(val).toBe(2)
    })

    await waitFor(() => expect(result.current.data).toBe(2))
  })
})

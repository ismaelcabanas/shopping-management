import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

/**
 * Test utilities and helpers for integration and e2e tests
 */

// Custom render function with providers (when we add Context providers later)
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: unknown // Add at least one property to avoid empty interface
}

export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  // For now, just use the standard render
  // Later, this can be extended to include React Context providers,
  // Redux store, React Router, etc.
  return render(ui, options)
}

// User event setup with default configuration
export const setupUserEvent = () => {
  return userEvent.setup({
    // Add default user event configuration here
    // advanceTimers: vi.advanceTimersByTime // For vitest instead of jest
  })
}

// Test data generators
export const generateShoppingListItems = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `generated-item-${index + 1}`,
    productName: `Generated Product ${index + 1}`,
    quantity: Math.floor(Math.random() * 10) + 1,
    unit: ['ud', 'kg', 'l', 'g'][Math.floor(Math.random() * 4)],
    status: Math.random() > 0.5 ? 'needed' : 'bought',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))
}

// Mock data helpers
export const mockRepository = {
  createMockShoppingListRepository: () => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    markAllAsBought: vi.fn(),
    markAllAsNeeded: vi.fn()
  })
}

// Assertion helpers
export const waitForElement = async (selector: string, timeout: number = 1000) => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector)
      if (element) {
        observer.disconnect()
        resolve(element)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    setTimeout(() => {
      observer.disconnect()
      reject(new Error(`Element ${selector} not found within ${timeout}ms`))
    }, timeout)
  })
}

// Performance testing helpers
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now()
  await renderFn()
  const end = performance.now()
  return end - start
}

// Accessibility testing helpers
export const checkAccessibility = async (container: HTMLElement) => {
  // This would integrate with axe-core or similar a11y testing library
  // For now, just basic checks
  const missingAltImages = container.querySelectorAll('img:not([alt])')
  const missingLabels = container.querySelectorAll('input:not([aria-label]):not([aria-labelledby]):not([title])')

  return {
    violations: [
      ...Array.from(missingAltImages).map(img => ({
        type: 'missing-alt',
        element: img,
        message: 'Image missing alt attribute'
      })),
      ...Array.from(missingLabels).map(input => ({
        type: 'missing-label',
        element: input,
        message: 'Input missing accessible label'
      }))
    ]
  }
}

// Error handling helpers for testing
export const captureError = (fn: () => void): Error | null => {
  try {
    fn()
    return null
  } catch (error) {
    return error as Error
  }
}

export const captureAsyncError = async (fn: () => Promise<void>): Promise<Error | null> => {
  try {
    await fn()
    return null
  } catch (error) {
    return error as Error
  }
}
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Package } from 'lucide-react'
import { EmptyState } from '../../../../presentation/shared/components/EmptyState'

describe('EmptyState', () => {
  describe('Basic rendering', () => {
    it('should render with title only', () => {
      render(<EmptyState title="No products found" />)

      expect(screen.getByText('No products found')).toBeInTheDocument()
    })

    it('should render with title and description', () => {
      render(
        <EmptyState
          title="No products found"
          description="Add your first product to get started"
        />
      )

      expect(screen.getByText('No products found')).toBeInTheDocument()
      expect(screen.getByText('Add your first product to get started')).toBeInTheDocument()
    })

    it('should have proper accessibility attributes', () => {
      const { container } = render(<EmptyState title="No products found" />)
      const emptyState = container.firstChild

      expect(emptyState).toHaveAttribute('role', 'status')
      expect(emptyState).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Icon rendering', () => {
    it('should render with emoji icon', () => {
      render(<EmptyState title="No products" icon="📦" />)

      expect(screen.getByText('📦')).toBeInTheDocument()
    })

    it('should render with Lucide icon', () => {
      render(<EmptyState title="No products" icon={<Package data-testid="package-icon" />} />)

      expect(screen.getByTestId('package-icon')).toBeInTheDocument()
    })

    it('should not render icon when not provided', () => {
      const { container } = render(<EmptyState title="No products" />)

      // Check that no icon container exists
      expect(container.querySelector('[class*="text-6xl"]')).not.toBeInTheDocument()
    })
  })

  describe('Action button', () => {
    it('should render action button when provided', () => {
      const mockAction = vi.fn()
      render(
        <EmptyState
          title="No products"
          action={{ label: 'Add Product', onClick: mockAction }}
        />
      )

      const button = screen.getByRole('button', { name: 'Add Product' })
      expect(button).toBeInTheDocument()
    })

    it('should call onClick when action button is clicked', async () => {
      const user = userEvent.setup()
      const mockAction = vi.fn()
      render(
        <EmptyState
          title="No products"
          action={{ label: 'Add Product', onClick: mockAction }}
        />
      )

      const button = screen.getByRole('button', { name: 'Add Product' })
      await user.click(button)

      expect(mockAction).toHaveBeenCalledOnce()
    })

    it('should not render action button when not provided', () => {
      render(<EmptyState title="No products" />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('Size variants', () => {
    it('should render compact size', () => {
      const { container } = render(<EmptyState title="No products" size="compact" />)
      const title = screen.getByText('No products')

      expect(title).toHaveClass('text-lg')
      expect(container.firstChild).toHaveClass('py-8')
    })

    it('should render default size', () => {
      const { container } = render(<EmptyState title="No products" />)
      const title = screen.getByText('No products')

      expect(title).toHaveClass('text-2xl')
      expect(container.firstChild).toHaveClass('py-12')
    })

    it('should render large size', () => {
      const { container } = render(<EmptyState title="No products" size="large" />)
      const title = screen.getByText('No products')

      expect(title).toHaveClass('text-3xl')
      expect(container.firstChild).toHaveClass('py-16')
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <EmptyState title="No products" className="custom-class" />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should preserve default classes when custom className is added', () => {
      const { container } = render(
        <EmptyState title="No products" className="custom-class" />
      )

      expect(container.firstChild).toHaveClass('text-center')
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Complete example', () => {
    it('should render full featured empty state', () => {
      const mockAction = vi.fn()
      render(
        <EmptyState
          title="Your shopping list is empty"
          description="Start by adding products from your catalog"
          icon="🛒"
          action={{ label: 'Browse Products', onClick: mockAction }}
          size="large"
        />
      )

      expect(screen.getByText('Your shopping list is empty')).toBeInTheDocument()
      expect(screen.getByText('Start by adding products from your catalog')).toBeInTheDocument()
      expect(screen.getByText('🛒')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Browse Products' })).toBeInTheDocument()
    })
  })
})

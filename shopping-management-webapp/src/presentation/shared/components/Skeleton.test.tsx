import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  describe('Basic rendering', () => {
    it('should render with default variant', () => {
      const { container } = render(<Skeleton />)

      expect(container.firstChild).toBeInTheDocument()
      expect(container.firstChild).toHaveClass('animate-pulse')
    })

    it('should have proper accessibility attributes', () => {
      const { container } = render(<Skeleton />)

      expect(container.firstChild).toHaveAttribute('aria-busy', 'true')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Loading...')
    })
  })

  describe('Variants', () => {
    it('should render text variant', () => {
      const { container } = render(<Skeleton variant="text" />)

      expect(container.firstChild).toHaveClass('h-4')
      expect(container.firstChild).toHaveClass('rounded')
    })

    it('should render card variant', () => {
      const { container } = render(<Skeleton variant="card" />)

      expect(container.firstChild).toHaveClass('h-32')
      expect(container.firstChild).toHaveClass('rounded-lg')
    })

    it('should render avatar variant', () => {
      const { container } = render(<Skeleton variant="avatar" />)

      expect(container.firstChild).toHaveClass('w-12')
      expect(container.firstChild).toHaveClass('h-12')
      expect(container.firstChild).toHaveClass('rounded-full')
    })

    it('should render button variant', () => {
      const { container } = render(<Skeleton variant="button" />)

      expect(container.firstChild).toHaveClass('h-10')
      expect(container.firstChild).toHaveClass('rounded-lg')
    })

    it('should render custom variant with default dimensions', () => {
      const { container } = render(<Skeleton variant="custom" />)

      expect(container.firstChild).toHaveClass('w-full')
      expect(container.firstChild).toHaveClass('h-4')
    })
  })

  describe('Custom dimensions', () => {
    it('should apply custom width', () => {
      const { container } = render(<Skeleton width="200px" />)

      expect(container.firstChild).toHaveStyle({ width: '200px' })
    })

    it('should apply custom height', () => {
      const { container } = render(<Skeleton height="100px" />)

      expect(container.firstChild).toHaveStyle({ height: '100px' })
    })

    it('should apply both custom width and height', () => {
      const { container } = render(<Skeleton width="300px" height="150px" />)

      expect(container.firstChild).toHaveStyle({
        width: '300px',
        height: '150px',
      })
    })
  })

  describe('Count/repetition', () => {
    it('should render single skeleton by default', () => {
      const { container } = render(<Skeleton />)

      const skeletons = container.querySelectorAll('[aria-busy="true"]')
      expect(skeletons).toHaveLength(1)
    })

    it('should render multiple skeletons when count is specified', () => {
      const { container } = render(<Skeleton count={3} />)

      const skeletons = container.querySelectorAll('[aria-busy="true"]')
      expect(skeletons).toHaveLength(3)
    })

    it('should apply gap between multiple skeletons', () => {
      const { container } = render(<Skeleton count={3} />)

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('space-y-2')
    })

    it('should render each skeleton independently', () => {
      render(<Skeleton variant="text" count={2} data-testid="skeleton-group" />)

      const skeletons = screen.getAllByLabelText('Loading...')
      expect(skeletons).toHaveLength(2)

      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveClass('animate-pulse')
      })
    })
  })

  describe('Custom className', () => {
    it('should apply custom className to single skeleton', () => {
      const { container } = render(<Skeleton className="custom-class" />)

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should preserve default classes', () => {
      const { container } = render(<Skeleton className="custom-class" />)

      expect(container.firstChild).toHaveClass('animate-pulse')
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Variant-specific features', () => {
    it('should render text skeleton with 80% width by default', () => {
      const { container } = render(<Skeleton variant="text" />)

      expect(container.firstChild).toHaveClass('w-4/5')
    })

    it('should render avatar as square (same width and height)', () => {
      const { container } = render(<Skeleton variant="avatar" />)

      expect(container.firstChild).toHaveClass('w-12')
      expect(container.firstChild).toHaveClass('h-12')
    })

    it('should render button with fixed height', () => {
      const { container } = render(<Skeleton variant="button" />)

      expect(container.firstChild).toHaveClass('h-10')
    })
  })

  describe('Complete examples', () => {
    it('should render product list skeleton as shown in proposal', () => {
      const { container } = render(
        <Skeleton variant="card" count={3} />
      )

      const skeletons = container.querySelectorAll('[aria-busy="true"]')
      expect(skeletons).toHaveLength(3)

      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveClass('rounded-lg')
        expect(skeleton).toHaveClass('h-32')
      })
    })

    it('should render custom skeleton for product item', () => {
      render(
        <Skeleton
          variant="custom"
          width="100%"
          height="120px"
          count={2}
        />
      )

      const skeletons = screen.getAllByLabelText('Loading...')
      expect(skeletons).toHaveLength(2)

      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveStyle({
          width: '100%',
          height: '120px',
        })
      })
    })
  })
})

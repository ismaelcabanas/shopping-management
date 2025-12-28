import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AlertCircle } from 'lucide-react'
import { Badge } from './Badge'

describe('Badge', () => {
  describe('Basic rendering', () => {
    it('should render with text', () => {
      render(<Badge>Active</Badge>)

      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('should have proper semantic element', () => {
      const { container } = render(<Badge>Badge</Badge>)

      expect(container.firstChild?.nodeName).toBe('SPAN')
    })
  })

  describe('Variants', () => {
    it('should render default variant', () => {
      const { container } = render(<Badge variant="default">Default</Badge>)

      expect(container.firstChild).toHaveClass('bg-gray-100')
      expect(container.firstChild).toHaveClass('text-gray-800')
    })

    it('should render primary variant', () => {
      const { container } = render(<Badge variant="primary">Primary</Badge>)

      expect(container.firstChild).toHaveClass('bg-blue-100')
      expect(container.firstChild).toHaveClass('text-blue-800')
    })

    it('should render success variant', () => {
      const { container } = render(<Badge variant="success">Success</Badge>)

      expect(container.firstChild).toHaveClass('bg-green-100')
      expect(container.firstChild).toHaveClass('text-green-800')
    })

    it('should render warning variant', () => {
      const { container } = render(<Badge variant="warning">Warning</Badge>)

      expect(container.firstChild).toHaveClass('bg-yellow-100')
      expect(container.firstChild).toHaveClass('text-yellow-800')
    })

    it('should render danger variant', () => {
      const { container } = render(<Badge variant="danger">Danger</Badge>)

      expect(container.firstChild).toHaveClass('bg-red-100')
      expect(container.firstChild).toHaveClass('text-red-800')
    })

    it('should render info variant', () => {
      const { container } = render(<Badge variant="info">Info</Badge>)

      expect(container.firstChild).toHaveClass('bg-cyan-100')
      expect(container.firstChild).toHaveClass('text-cyan-800')
    })
  })

  describe('Sizes', () => {
    it('should render small size', () => {
      const { container } = render(<Badge size="sm">Small</Badge>)

      expect(container.firstChild).toHaveClass('text-xs')
      expect(container.firstChild).toHaveClass('px-2')
      expect(container.firstChild).toHaveClass('py-0.5')
    })

    it('should render medium size by default', () => {
      const { container } = render(<Badge>Medium</Badge>)

      expect(container.firstChild).toHaveClass('text-sm')
      expect(container.firstChild).toHaveClass('px-2.5')
      expect(container.firstChild).toHaveClass('py-1')
    })

    it('should render large size', () => {
      const { container } = render(<Badge size="lg">Large</Badge>)

      expect(container.firstChild).toHaveClass('text-base')
      expect(container.firstChild).toHaveClass('px-3')
      expect(container.firstChild).toHaveClass('py-1.5')
    })
  })

  describe('Icon support', () => {
    it('should render with icon', () => {
      render(
        <Badge icon={<AlertCircle data-testid="badge-icon" />}>
          With Icon
        </Badge>
      )

      expect(screen.getByTestId('badge-icon')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })

    it('should not render icon when not provided', () => {
      const { container } = render(<Badge>No Icon</Badge>)

      expect(container.querySelector('svg')).not.toBeInTheDocument()
    })

    it('should render icon with proper spacing', () => {
      const { container } = render(
        <Badge icon={<AlertCircle />}>Icon Badge</Badge>
      )

      const flexContainer = container.querySelector('.flex')
      expect(flexContainer).toHaveClass('gap-1')
    })
  })

  describe('Pill style', () => {
    it('should have rounded corners by default', () => {
      const { container } = render(<Badge>Default</Badge>)

      expect(container.firstChild).toHaveClass('rounded-md')
    })

    it('should have pill style when pill is true', () => {
      const { container } = render(<Badge pill>Pill Badge</Badge>)

      expect(container.firstChild).toHaveClass('rounded-full')
      expect(container.firstChild).not.toHaveClass('rounded-md')
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<Badge className="custom-class">Badge</Badge>)

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should preserve default classes', () => {
      const { container } = render(<Badge className="custom-class">Badge</Badge>)

      expect(container.firstChild).toHaveClass('inline-flex')
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Accessibility', () => {
    it('should be accessible when used as status indicator', () => {
      render(<Badge role="status">In Progress</Badge>)

      const badge = screen.getByRole('status')
      expect(badge).toBeInTheDocument()
    })

    it('should support aria-label for screen readers', () => {
      render(<Badge aria-label="High priority">!</Badge>)

      const badge = screen.getByLabelText('High priority')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Complete examples', () => {
    it('should render pill badge with icon', () => {
      render(
        <Badge
          variant="success"
          size="lg"
          pill
          icon={<AlertCircle data-testid="success-icon" />}
        >
          Completed
        </Badge>
      )

      expect(screen.getByText('Completed')).toBeInTheDocument()
      expect(screen.getByTestId('success-icon')).toBeInTheDocument()

      const { container } = render(
        <Badge variant="success" size="lg" pill icon={<AlertCircle />}>
          Completed
        </Badge>
      )

      expect(container.firstChild).toHaveClass('rounded-full')
      expect(container.firstChild).toHaveClass('text-base')
      expect(container.firstChild).toHaveClass('bg-green-100')
    })

    it('should render urgency badge as shown in proposal', () => {
      render(
        <Badge variant="danger" size="sm" pill>
          Urgente
        </Badge>
      )

      const badge = screen.getByText('Urgente')
      expect(badge).toBeInTheDocument()

      const { container } = render(
        <Badge variant="danger" size="sm" pill>
          Urgente
        </Badge>
      )

      expect(container.firstChild).toHaveClass('bg-red-100')
      expect(container.firstChild).toHaveClass('text-xs')
      expect(container.firstChild).toHaveClass('rounded-full')
    })
  })
})

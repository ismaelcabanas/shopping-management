import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Card } from '../../../../presentation/shared/components/Card'

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card content</p>
      </Card>
    )

    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders with default variant by default', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement

    expect(card).toHaveClass('shadow-card')
    expect(card).not.toHaveClass('cursor-pointer')
  })

  it('renders with interactive variant', () => {
    const { container } = render(<Card variant="interactive">Content</Card>)
    const card = container.firstChild as HTMLElement

    expect(card).toHaveClass('shadow-card')
    expect(card).toHaveClass('hover:shadow-card-hover')
    expect(card).toHaveClass('cursor-pointer')
    expect(card).toHaveClass('active:shadow-card-active')
  })

  it('applies base styles', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement

    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('rounded-lg')
    expect(card).toHaveClass('p-4')
    expect(card).toHaveClass('transition-shadow')
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>)
    const card = container.firstChild as HTMLElement

    expect(card).toHaveClass('custom-class')
    expect(card).toHaveClass('bg-white') // Still has base styles
  })

  it('forwards HTML div attributes', () => {
    render(
      <Card data-testid="test-card" aria-label="Test Card">
        Content
      </Card>
    )
    const card = screen.getByTestId('test-card')

    expect(card).toHaveAttribute('aria-label', 'Test Card')
  })

  it('calls onClick handler when interactive', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    const { container } = render(
      <Card variant="interactive" onClick={handleClick}>
        Clickable Content
      </Card>
    )
    const card = container.firstChild as HTMLElement

    await user.click(card)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be used as a semantic element', () => {
    const { container } = render(
      <Card role="article">
        <h2>Article Title</h2>
      </Card>
    )
    const card = container.firstChild as HTMLElement

    expect(card).toHaveAttribute('role', 'article')
  })
})
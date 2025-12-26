import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Navigation } from './Navigation'

// Helper to render Navigation with Router context
const renderNavigation = () => {
  return render(
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  )
}

describe('Navigation - Desktop', () => {
  it('renders navigation component', () => {
    renderNavigation()
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('renders brand with full text on desktop', () => {
    renderNavigation()
    expect(screen.getByText('Shopping Manager')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    renderNavigation()
    expect(screen.getByTestId('nav-home')).toBeInTheDocument()
    expect(screen.getByTestId('nav-catalog')).toBeInTheDocument()
    expect(screen.getByTestId('nav-shopping-list')).toBeInTheDocument()
    expect(screen.getByTestId('nav-dashboard')).toBeInTheDocument()
  })
})

describe('Navigation - Mobile', () => {
  it('should have mobile menu state initially closed', () => {
    renderNavigation()
    // Mobile menu drawer should not be visible initially
    expect(screen.queryByTestId('mobile-menu-drawer')).not.toBeInTheDocument()
  })

  it('renders hamburger menu button', () => {
    renderNavigation()
    const hamburgerButton = screen.getByTestId('hamburger-button')
    expect(hamburgerButton).toBeInTheDocument()
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Abrir menú de navegación')
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
    expect(hamburgerButton).toHaveAttribute('aria-controls', 'mobile-menu')
  })
})

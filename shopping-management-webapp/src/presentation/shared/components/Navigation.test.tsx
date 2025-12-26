import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
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

  it('opens mobile menu when hamburger button is clicked', async () => {
    const user = userEvent.setup()
    renderNavigation()

    const hamburgerButton = screen.getByTestId('hamburger-button')
    await user.click(hamburgerButton)

    // Mobile menu drawer should be visible
    const mobileMenu = screen.getByTestId('mobile-menu-drawer')
    expect(mobileMenu).toBeInTheDocument()
    expect(mobileMenu).toHaveAttribute('id', 'mobile-menu')
    expect(mobileMenu).toHaveAttribute('aria-label', 'Navegación principal móvil')

    // Hamburger button should show menu is expanded
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders backdrop when mobile menu is open', async () => {
    const user = userEvent.setup()
    renderNavigation()

    await user.click(screen.getByTestId('hamburger-button'))

    const backdrop = screen.getByTestId('mobile-menu-backdrop')
    expect(backdrop).toBeInTheDocument()
    expect(backdrop).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders close button in mobile menu', async () => {
    const user = userEvent.setup()
    renderNavigation()

    await user.click(screen.getByTestId('hamburger-button'))

    const closeButton = screen.getByTestId('mobile-menu-close')
    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toHaveAttribute('aria-label', 'Cerrar menú')
  })

  it('renders navigation links in mobile menu', async () => {
    const user = userEvent.setup()
    renderNavigation()

    await user.click(screen.getByTestId('hamburger-button'))

    // Check all nav links are in mobile menu
    const mobileMenu = screen.getByTestId('mobile-menu-drawer')
    expect(mobileMenu).toBeInTheDocument()

    // Links should be present (we'll check by text content)
    expect(screen.getAllByText('Inicio').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Mi Despensa').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Lista de Compras').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
  })

  it('closes mobile menu when close button is clicked', async () => {
    const user = userEvent.setup()
    renderNavigation()

    // Open menu
    await user.click(screen.getByTestId('hamburger-button'))
    expect(screen.getByTestId('mobile-menu-drawer')).toBeInTheDocument()

    // Close menu
    await user.click(screen.getByTestId('mobile-menu-close'))
    expect(screen.queryByTestId('mobile-menu-drawer')).not.toBeInTheDocument()
  })

  it('locks body scroll when mobile menu is open', async () => {
    const user = userEvent.setup()

    // Store initial overflow state
    const initialOverflow = document.body.style.overflow

    renderNavigation()

    // Open menu - body should be locked
    await user.click(screen.getByTestId('hamburger-button'))
    expect(document.body.style.overflow).toBe('hidden')

    // Close menu - body should be scrollable again
    await user.click(screen.getByTestId('mobile-menu-close'))
    expect(document.body.style.overflow).toBe('unset')

    // Restore initial state for other tests
    document.body.style.overflow = initialOverflow
  })

  it('closes mobile menu when Escape key is pressed', async () => {
    const user = userEvent.setup()
    renderNavigation()

    // Open menu
    await user.click(screen.getByTestId('hamburger-button'))
    expect(screen.getByTestId('mobile-menu-drawer')).toBeInTheDocument()

    // Press Escape key
    await user.keyboard('{Escape}')

    // Menu should be closed
    expect(screen.queryByTestId('mobile-menu-drawer')).not.toBeInTheDocument()
  })

  it('moves focus to close button when mobile menu opens', async () => {
    const user = userEvent.setup()
    renderNavigation()

    const hamburgerButton = screen.getByTestId('hamburger-button')

    // Open menu
    await user.click(hamburgerButton)

    // Focus should move to close button
    const closeButton = screen.getByTestId('mobile-menu-close')
    expect(closeButton).toHaveFocus()
  })

  it('returns focus to hamburger button when mobile menu closes', async () => {
    const user = userEvent.setup()
    renderNavigation()

    const hamburgerButton = screen.getByTestId('hamburger-button')

    // Open menu
    await user.click(hamburgerButton)

    // Close menu
    const closeButton = screen.getByTestId('mobile-menu-close')
    await user.click(closeButton)

    // Focus should return to hamburger button
    expect(hamburgerButton).toHaveFocus()
  })
})

describe('Navigation - Accessibility', () => {
  it('has correct ARIA attributes on hamburger button', () => {
    renderNavigation()

    const hamburgerButton = screen.getByTestId('hamburger-button')

    // Check initial ARIA attributes
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Abrir menú de navegación')
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
    expect(hamburgerButton).toHaveAttribute('aria-controls', 'mobile-menu')
  })

  it('updates aria-expanded when menu opens', async () => {
    const user = userEvent.setup()
    renderNavigation()

    const hamburgerButton = screen.getByTestId('hamburger-button')

    // Initially closed
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')

    // Open menu
    await user.click(hamburgerButton)
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('has correct ARIA attributes on mobile menu drawer', async () => {
    const user = userEvent.setup()
    renderNavigation()

    // Open menu
    await user.click(screen.getByTestId('hamburger-button'))

    const mobileMenu = screen.getByTestId('mobile-menu-drawer')

    // Check ARIA attributes
    expect(mobileMenu).toHaveAttribute('id', 'mobile-menu')
    expect(mobileMenu).toHaveAttribute('role', 'navigation')
    expect(mobileMenu).toHaveAttribute('aria-label', 'Navegación principal móvil')
  })

  it('has correct ARIA attributes on backdrop', async () => {
    const user = userEvent.setup()
    renderNavigation()

    // Open menu
    await user.click(screen.getByTestId('hamburger-button'))

    const backdrop = screen.getByTestId('mobile-menu-backdrop')

    // Backdrop should be hidden from screen readers
    expect(backdrop).toHaveAttribute('aria-hidden', 'true')
  })

  it('has correct ARIA label on close button', async () => {
    const user = userEvent.setup()
    renderNavigation()

    // Open menu
    await user.click(screen.getByTestId('hamburger-button'))

    const closeButton = screen.getByTestId('mobile-menu-close')

    // Check ARIA label
    expect(closeButton).toHaveAttribute('aria-label', 'Cerrar menú')
  })
})

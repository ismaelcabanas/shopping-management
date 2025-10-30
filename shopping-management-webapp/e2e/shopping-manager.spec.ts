import { test, expect } from '@playwright/test'

test.describe('Shopping Manager E2E Tests', () => {
  test('should navigate through the complete user flow', async ({ page }) => {
    // Visit home page
    await page.goto('/')

    // Verify home page is loaded
    await expect(page.locator('h1')).toContainText('Bienvenido a Shopping Manager')

    // Click on "Go to Dashboard" button
    await page.getByTestId('go-to-dashboard').click()

    // Verify we're on dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard - Mis Productos')

    // Verify products are displayed
    await expect(page.getByText('Leche')).toBeVisible()
    await expect(page.getByText('Pan')).toBeVisible()
    await expect(page.getByText('Huevos')).toBeVisible()
    await expect(page.getByText('Manzanas')).toBeVisible()
  })

  test('should add products to shopping cart', async ({ page }) => {
    await page.goto('/dashboard')

    // Initially cart should be empty
    await expect(page.getByTestId('cart-count')).toContainText('Productos en la lista: 0')

    // Add first product (Leche)
    const addButtons = page.getByTestId('add-to-cart-button')
    await addButtons.first().click()

    // Verify cart count increased
    await expect(page.getByTestId('cart-count')).toContainText('Productos en la lista: 1')

    // Verify product appears in cart
    await expect(page.getByTestId('cart-items')).toContainText('Leche')
  })

  test('should display low stock warning', async ({ page }) => {
    await page.goto('/dashboard')

    // Pan has low stock (3 < 5)
    const lowStockWarnings = page.getByTestId('low-stock-warning')
    await expect(lowStockWarnings.first()).toBeVisible()
    await expect(lowStockWarnings.first()).toContainText('Stock bajo')
  })

  test('should disable add button for out of stock products', async ({ page }) => {
    await page.goto('/dashboard')

    // Huevos has stock=0
    const addButtons = page.getByTestId('add-to-cart-button')
    const huevosButton = addButtons.nth(2)

    await expect(huevosButton).toBeDisabled()
    await expect(huevosButton).toContainText('Sin stock')
  })

  test('should remove products from shopping cart', async ({ page }) => {
    await page.goto('/dashboard')

    // Add Leche to cart
    const addButtons = page.getByTestId('add-to-cart-button')
    await addButtons.first().click()

    await expect(page.getByTestId('cart-count')).toContainText('Productos en la lista: 1')

    // Remove Leche from cart
    await page.getByTestId('remove-1').click()

    await expect(page.getByTestId('cart-count')).toContainText('Productos en la lista: 0')
    await expect(page.getByTestId('cart-items')).not.toBeVisible()
  })

  test('should navigate using navigation bar', async ({ page }) => {
    await page.goto('/dashboard')

    // Click on Home in navigation
    await page.getByTestId('nav-home').click()

    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toContainText('Bienvenido a Shopping Manager')

    // Click on Dashboard in navigation
    await page.getByTestId('nav-dashboard').click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard - Mis Productos')
  })

  test('should highlight active navigation link', async ({ page }) => {
    await page.goto('/')

    // Home should be active
    const homeLink = page.getByTestId('nav-home')
    await expect(homeLink).toHaveClass(/bg-primary/)

    // Navigate to dashboard
    await page.getByTestId('nav-dashboard').click()

    // Dashboard should be active now
    const dashboardLink = page.getByTestId('nav-dashboard')
    await expect(dashboardLink).toHaveClass(/bg-primary/)
  })

  test('should navigate to home when clicking logo', async ({ page }) => {
    await page.goto('/dashboard')

    await page.getByTestId('nav-home-link').click()

    await expect(page).toHaveURL('/')
  })
})


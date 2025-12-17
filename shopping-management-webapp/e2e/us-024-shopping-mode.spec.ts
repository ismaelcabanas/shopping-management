import { test, expect } from '@playwright/test'

test.describe('US-024: Shopping Mode with Dedicated Page', () => {
  test.beforeEach(async ({ page, context }) => {
    // Setup localStorage BEFORE any page loads
    await context.addInitScript(() => {
      const products = [
        { id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', name: 'Eggs', unitType: 'units' },
        { id: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', name: 'Milk', unitType: 'liters' },
        { id: 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', name: 'Bread', unitType: 'units' },
      ]

      const inventory = [
        { productId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', currentStock: 2, unitType: 'units', stockLevel: 'low' },
        { productId: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', currentStock: 0, unitType: 'liters', stockLevel: 'empty' },
        { productId: 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', currentStock: 10, unitType: 'units', stockLevel: 'high' },
      ]

      const shoppingList = [
        {
          productId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
          reason: 'auto',
          stockLevel: 'low',
          addedAt: new Date().toISOString(),
          checked: true // Previously checked from another session
        },
        {
          productId: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e',
          reason: 'auto',
          stockLevel: 'empty',
          addedAt: new Date().toISOString(),
          checked: false
        }
      ]

      localStorage.setItem('shopping_manager_products', JSON.stringify(products))
      localStorage.setItem('shopping_manager_inventory', JSON.stringify(inventory))
      localStorage.setItem('shopping_manager_shopping-list', JSON.stringify(shoppingList))
    })

    await page.goto('http://localhost:5173/shopping-list')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForLoadState('networkidle')
  })

  test('@smoke @critical - Complete shopping flow with manual registration', async ({ page }) => {
    // Given: products in shopping list (some checked from before)
    await expect(page.getByText('2 productos')).toBeVisible({ timeout: 10000 })

    // And: Shopping list is in readonly mode (no checkboxes)
    await expect(page.getByRole('checkbox')).not.toBeVisible()

    // When: user clicks "Iniciar Compra"
    const iniciarCompraButton = page.getByRole('button', { name: /Iniciar Compra/i })
    await expect(iniciarCompraButton).toBeVisible()
    await iniciarCompraButton.click()

    // Then: navigates to /shopping/start
    await expect(page).toHaveURL(/\/shopping\/start/)
    await expect(page.getByText(/Comprando/i)).toBeVisible()

    // And: all checkboxes are unchecked (reset)
    const checkboxes = page.getByRole('checkbox')
    await expect(checkboxes.first()).toBeVisible({ timeout: 5000 })
    const checkboxCount = await checkboxes.count()
    expect(checkboxCount).toBe(2)

    for (let i = 0; i < checkboxCount; i++) {
      await expect(checkboxes.nth(i)).not.toBeChecked()
    }

    // When: user marks first checkbox
    await checkboxes.first().click()
    await expect(checkboxes.first()).toBeChecked()

    // When: user clicks "Registrar Manual"
    const registerButton = page.getByRole('button', { name: /Registrar Manual/i })
    await expect(registerButton).toBeVisible()
    await registerButton.click()

    // Then: RegisterPurchaseModal opens
    await expect(page.getByTestId('register-purchase-modal')).toBeVisible({ timeout: 5000 })

    // When: user adds a product and confirms
    await page.getByTestId('product-input').fill('Eggs')
    await page.getByTestId('quantity-input').fill('12')
    await page.getByTestId('add-item-button').click()

    // And: user saves the purchase
    await page.getByTestId('confirm-purchase-button').click()

    // Then: success message appears
    await expect(page.getByText(/Compra registrada y lista actualizada/i)).toBeVisible({ timeout: 10000 })

    // And: navigates back to /shopping-list
    await expect(page).toHaveURL(/\/shopping-list/, { timeout: 10000 })

    // And: list is recalculated (should be empty or updated based on inventory)
    await page.waitForLoadState('networkidle')
  })

  test('@smoke - Shopping flow with Cancel', async ({ page }) => {
    // Given: user in /shopping-list with some checkboxes marked
    await expect(page.getByText('2 productos')).toBeVisible({ timeout: 10000 })

    // When: user clicks "Iniciar Compra"
    await page.getByRole('button', { name: /Iniciar Compra/i }).click()

    // Then: navigates to /shopping/start
    await expect(page).toHaveURL(/\/shopping\/start/)

    // When: user marks some checkboxes
    const checkbox = page.getByRole('checkbox').first()
    await expect(checkbox).toBeVisible({ timeout: 5000 })
    await checkbox.click()
    await expect(checkbox).toBeChecked()

    // When: user clicks "Cancelar"
    await page.getByRole('button', { name: /Cancelar/i }).click()

    // Then: navigates back to /shopping-list
    await expect(page).toHaveURL(/\/shopping-list/)

    // When: user clicks "Iniciar Compra" again
    await page.getByRole('button', { name: /Iniciar Compra/i }).click()
    await expect(page).toHaveURL(/\/shopping\/start/)

    // Then: checkboxes are reset (not preserved from cancel)
    const checkboxes = page.getByRole('checkbox')
    await expect(checkboxes.first()).toBeVisible({ timeout: 5000 })
    const checkboxCount = await checkboxes.count()

    for (let i = 0; i < checkboxCount; i++) {
      await expect(checkboxes.nth(i)).not.toBeChecked()
    }
  })

  test('@smoke - Readonly mode in shopping list page', async ({ page }) => {
    // Given: user in /shopping-list
    await expect(page.getByRole('heading', { name: 'Lista de Compras' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('2 productos')).toBeVisible()

    // Then: no checkboxes should be visible (readonly mode)
    await expect(page.getByRole('checkbox')).not.toBeVisible()

    // And: "Iniciar Compra" button should be visible
    await expect(page.getByRole('button', { name: /Iniciar Compra/i })).toBeVisible()

    // And: products should be displayed
    await expect(page.getByText('Eggs')).toBeVisible()
    await expect(page.getByText('Milk')).toBeVisible()
  })

  test('@smoke - Active shopping page with checkboxes enabled', async ({ page }) => {
    // Given: user navigates to active shopping page
    await page.getByRole('button', { name: /Iniciar Compra/i }).click()
    await expect(page).toHaveURL(/\/shopping\/start/)

    // Then: header shows "Comprando..."
    await expect(page.getByText(/Comprando/i)).toBeVisible()

    // And: checkboxes are enabled and visible
    const checkboxes = page.getByRole('checkbox')
    await expect(checkboxes.first()).toBeVisible({ timeout: 5000 })
    expect(await checkboxes.count()).toBeGreaterThan(0)

    // And: action buttons are visible
    await expect(page.getByRole('button', { name: /Escanear Ticket/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Registrar Manual/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Cancelar/i })).toBeVisible()

    // When: user toggles checkbox
    const firstCheckbox = checkboxes.first()
    await firstCheckbox.click()

    // Then: checkbox is checked
    await expect(firstCheckbox).toBeChecked()

    // And: item shows visual feedback (line-through)
    // Note: This is verified by component tests, not E2E
  })

  test('@smoke - Empty shopping list shows correct message', async ({ page, context }) => {
    // Given: empty shopping list
    await context.addInitScript(() => {
      const products = [
        { id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', name: 'Eggs', unitType: 'units' },
      ]
      const inventory = [
        { productId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', currentStock: 10, unitType: 'units', stockLevel: 'high' },
      ]
      localStorage.setItem('shopping_manager_products', JSON.stringify(products))
      localStorage.setItem('shopping_manager_inventory', JSON.stringify(inventory))
      localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([]))
    })

    await page.goto('http://localhost:5173/shopping-list')
    await page.waitForLoadState('networkidle')

    // Then: empty state message is shown
    await expect(page.getByText('No hay productos en la lista de compras')).toBeVisible()

    // And: "Iniciar Compra" button is NOT visible (no items to shop)
    await expect(page.getByRole('button', { name: /Iniciar Compra/i })).not.toBeVisible()
  })
})

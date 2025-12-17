import { test, expect } from '@playwright/test'

test.describe('US-012: Consumption Tracking by Levels', () => {
  test.beforeEach(async ({ page, context }) => {
    // Setup localStorage BEFORE any page loads
    // IMPORTANT: LocalStorageClient uses 'shopping_manager_' prefix!
    await context.addInitScript(() => {
      const products = [
        { id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', name: 'Milk', unitType: 'units' },
        { id: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', name: 'Bread', unitType: 'units' },
        { id: 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', name: 'Rice', unitType: 'units' },
        { id: 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', name: 'Coffee', unitType: 'units' },
      ]

      const inventory = [
        { productId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', currentStock: 10, unitType: 'units', stockLevel: 'high' },
        { productId: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', currentStock: 5, unitType: 'units', stockLevel: 'medium' },
        { productId: 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', currentStock: 2, unitType: 'units', stockLevel: 'low' },
        { productId: 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', currentStock: 0, unitType: 'units', stockLevel: 'empty' },
      ]

      const shoppingList = [
        {
          productId: 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
          reason: 'auto',
          stockLevel: 'low',
          addedAt: new Date().toISOString()
        },
        {
          productId: 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a',
          reason: 'auto',
          stockLevel: 'empty',
          addedAt: new Date().toISOString()
        }
      ]

      // Use the correct storage keys with prefixes
      // All repositories use LocalStorageClient with 'shopping_manager_' prefix
      localStorage.setItem('shopping_manager_products', JSON.stringify(products))
      localStorage.setItem('shopping_manager_inventory', JSON.stringify(inventory))
      localStorage.setItem('shopping_manager_shopping-list', JSON.stringify(shoppingList))
    })

    // Navigate to catalog page
    await page.goto('http://localhost:5173/catalog')

    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded')
    await page.waitForLoadState('networkidle')
  })

  test('@smoke @critical - Display stock level indicators for all products', async ({ page }) => {
    // Given: Products with different stock levels (high, medium, low, empty)

    // Wait for products to be visible
    await expect(page.getByTestId('product-list-item').first()).toBeVisible({ timeout: 10000 })

    // Then: All products should have the update stock level button
    const updateButtons = page.getByTestId('update-stock-level-button')
    const count = await updateButtons.count()
    expect(count).toBeGreaterThan(0)

    // And: Each product should have a stock level indicator (progress bar)
    const progressBars = page.locator('[role="progressbar"]')
    expect(await progressBars.count()).toBeGreaterThan(0)
  })

  test('@smoke @critical - Update stock level from high to low', async ({ page }) => {
    // Given: Milk has high stock level

    // Wait for Milk to be visible
    const milkItem = page.getByTestId('product-list-item').filter({ hasText: 'Milk' })
    await expect(milkItem).toBeVisible({ timeout: 10000 })

    // When: I click the update stock button
    await milkItem.getByTestId('update-stock-level-button').click()

    // Then: The update stock modal should open
    await expect(page.getByTestId('update-stock-modal')).toBeVisible()
    await expect(page.getByTestId('modal-title')).toContainText('Milk')

    // And: I should see the current stock level
    await expect(page.getByTestId('current-stock-level')).toBeVisible()

    // When: I select "Bajo" level
    await page.getByTestId('stock-level-low').click()

    // And: I confirm the update
    await page.getByTestId('confirm-update-button').click()

    // Then: The modal should close
    await expect(page.getByTestId('update-stock-modal')).not.toBeVisible()

    // And: I should see a success message (toast)
    await expect(page.locator('.Toastify__toast--success, [role="status"]').filter({ hasText: /actualizado|éxito/i })).toBeVisible({ timeout: 5000 })

    // And: The stock level indicator should reflect the new level
    await page.waitForTimeout(500) // Wait for state update
    const updatedMilkItem = page.getByTestId('product-list-item').filter({ hasText: 'Milk' })
    await expect(updatedMilkItem.locator('[role="progressbar"]')).toBeVisible()
  })

  test('@smoke @critical - Product with low stock appears in shopping list', async ({ page }) => {
    // Given: Rice has low stock and should be in shopping list

    // When: I navigate to shopping list
    await page.getByTestId('nav-shopping-list').click()

    // Then: I should be on the shopping list page
    await expect(page).toHaveURL('/shopping-list')
    await expect(page.locator('h1')).toContainText('Lista de Compras')

    // And: Rice should be in the list with "Stock bajo" badge
    await expect(page.locator('text=Rice')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Stock bajo')).toBeVisible()
  })

  test('@smoke @critical - Product with empty stock appears in shopping list', async ({ page }) => {
    // Given: Coffee has empty stock and should be in shopping list

    // When: I navigate to shopping list
    await page.getByTestId('nav-shopping-list').click()

    // Then: Coffee should be in the list with "Sin stock" badge
    await expect(page.locator('text=Coffee')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Sin stock')).toBeVisible()
  })

  test('@critical - Complete flow: Update stock to low and verify in shopping list', async ({ page }) => {
    // Given: Milk has high stock (not in shopping list)

    // When: I update Milk stock to low
    const milkItem = page.getByTestId('product-list-item').filter({ hasText: 'Milk' })
    await expect(milkItem).toBeVisible({ timeout: 10000 })

    await milkItem.getByTestId('update-stock-level-button').click()
    await expect(page.getByTestId('update-stock-modal')).toBeVisible()

    await page.getByTestId('stock-level-low').click()
    await page.getByTestId('confirm-update-button').click()

    // Wait for modal to close and update to complete
    await expect(page.getByTestId('update-stock-modal')).not.toBeVisible()
    await page.waitForTimeout(1000)

    // Then: I navigate to shopping list
    await page.getByTestId('nav-shopping-list').click()
    await expect(page).toHaveURL('/shopping-list')

    // And: Milk should be automatically added to shopping list
    const milkListItem = page.locator('text=Milk').locator('..')
    await expect(page.locator('text=Milk')).toBeVisible({ timeout: 10000 })
    await expect(milkListItem.locator('text=Stock bajo')).toBeVisible()
  })

  // TODO: Re-enable this test after implementing US-024 (Shopping Mode)
  // This test expects checkboxes to be available in /shopping-list
  // However, the current design (US-024) separates the functionality:
  // - /shopping-list: read-only view
  // - /shopping/start: active shopping with checkboxes
  test.skip('@critical - Check product in shopping list marks it as purchased', async ({ page }) => {
    // Given: Rice is in the shopping list with low stock

    // When: I navigate to shopping list
    await page.getByTestId('nav-shopping-list').click()
    await expect(page).toHaveURL('/shopping-list')

    // Then: Rice should be visible
    await expect(page.locator('text=Rice')).toBeVisible({ timeout: 10000 })

    // When: I check the checkbox for Rice
    const riceCheckbox = page.getByRole('checkbox', { name: /Marcar Rice como comprado/i })
    await expect(riceCheckbox).toBeVisible()
    await expect(riceCheckbox).not.toBeChecked()
    await riceCheckbox.click()

    // Then: Rice should remain visible but marked as checked
    await expect(page.locator('text=Rice')).toBeVisible()
    await expect(riceCheckbox).toBeChecked()

    // And: Rice text should have line-through styling (visual feedback)
    const riceText = page.locator('h3:has-text("Rice")')
    await expect(riceText).toHaveClass(/line-through/)
  })

  test('@critical - Update stock from low to high removes from shopping list', async ({ page }) => {
    // Given: Rice has low stock and is in shopping list

    // When: I update Rice stock to high
    const riceItem = page.getByTestId('product-list-item').filter({ hasText: 'Rice' })
    await expect(riceItem).toBeVisible({ timeout: 10000 })

    await riceItem.getByTestId('update-stock-level-button').click()
    await expect(page.getByTestId('update-stock-modal')).toBeVisible()

    await page.getByTestId('stock-level-high').click()
    await page.getByTestId('confirm-update-button').click()

    await expect(page.getByTestId('update-stock-modal')).not.toBeVisible()
    await page.waitForTimeout(1000)

    // Then: I navigate to shopping list
    await page.getByTestId('nav-shopping-list').click()
    await expect(page).toHaveURL('/shopping-list')

    // And: Rice should no longer be in the shopping list
    await expect(page.locator('text=Rice')).not.toBeVisible({ timeout: 5000 })
  })

  test('@critical - Cancel stock update keeps original level', async ({ page }) => {
    // Given: Milk has high stock level

    const milkItem = page.getByTestId('product-list-item').filter({ hasText: 'Milk' })
    await expect(milkItem).toBeVisible({ timeout: 10000 })

    // When: I open update stock modal
    await milkItem.getByTestId('update-stock-level-button').click()
    await expect(page.getByTestId('update-stock-modal')).toBeVisible()

    // And: I select "Bajo" level but cancel
    await page.getByTestId('stock-level-low').click()
    await page.getByTestId('cancel-update-button').click()

    // Then: The modal should close
    await expect(page.getByTestId('update-stock-modal')).not.toBeVisible()

    // And: I navigate to shopping list
    await page.getByTestId('nav-shopping-list').click()

    // And: Milk should NOT be in the shopping list (still high)
    await expect(page.locator('text=Milk')).not.toBeVisible({ timeout: 5000 })
  })

  test('@smoke - Shopping list shows product count', async ({ page }) => {
    // Given: Rice and Coffee are in shopping list (2 products)

    // When: I navigate to shopping list
    await page.getByTestId('nav-shopping-list').click()

    // Then: I should see the count
    await expect(page.locator('text=2 productos')).toBeVisible({ timeout: 10000 })
  })
})

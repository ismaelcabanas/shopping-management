import { test, expect } from '@playwright/test';

test.describe('US-008: Register Purchase and Update Inventory', () => {
  test.beforeEach(async ({ page, context }) => {
    // Setup localStorage BEFORE any page loads using context.addInitScript
    // IMPORTANT: LocalStorageClient uses 'shopping_manager_' prefix!
    await context.addInitScript(() => {
      const products = [
        { id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', name: 'Milk', unitType: 'units' },
        { id: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', name: 'Bread', unitType: 'units' },
        { id: 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', name: 'Rice', unitType: 'units' },
      ];

      const inventory = [
        { productId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', currentStock: 5, unitType: 'units' },
        { productId: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', currentStock: 2, unitType: 'units' },
        { productId: 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', currentStock: 0, unitType: 'units' },
      ];

      // Use the same prefix as LocalStorageClient
      localStorage.setItem('shopping_manager_products', JSON.stringify(products));
      localStorage.setItem('shopping_manager_inventory', JSON.stringify(inventory));
    });

    // Navigate to catalog page
    await page.goto('http://localhost:5173/catalog');

    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
  });

  test('@smoke @critical - Register purchase updates inventory', async ({ page }) => {
    // Given: Background setup (products with stock: Milk=5, Bread=2, Rice=0)

    // Wait for the "Register Purchase" button to be visible (confirms products are loaded)
    await expect(page.getByTestId('register-purchase-button')).toBeVisible({ timeout: 10000 });

    // Open register purchase modal
    await page.getByTestId('register-purchase-button').click();

    // Wait for modal to be visible
    await expect(page.getByTestId('register-purchase-modal')).toBeVisible();

    // When: I register a purchase containing Milk (3) and Bread (4)

    // Add Milk - 3 units
    await page.getByTestId('product-selector').selectOption({ label: 'Milk' });
    await page.getByTestId('quantity-input').fill('3');
    await page.getByTestId('add-item-button').click();

    // Verify item is added to the purchase list
    await expect(page.getByTestId('purchase-item-Milk')).toBeVisible();
    await expect(page.getByTestId('purchase-item-Milk')).toContainText('3');

    // Add Bread - 4 units
    await page.getByTestId('product-selector').selectOption({ label: 'Bread' });
    await page.getByTestId('quantity-input').fill('4');
    await page.getByTestId('add-item-button').click();

    // Verify item is added to the purchase list
    await expect(page.getByTestId('purchase-item-Bread')).toBeVisible();
    await expect(page.getByTestId('purchase-item-Bread')).toContainText('4');

    // Confirm the purchase
    await page.getByTestId('confirm-purchase-button').click();

    // Then: I receive confirmation that the purchase was registered
    await expect(page.getByTestId('register-purchase-modal')).not.toBeVisible();

    // And: my inventory shows updated values
    // Wait for the inventory to update
    await page.waitForTimeout(500);

    // Verify Milk stock is now 8 (5 + 3)
    const milkItem = page.getByTestId('product-list-item').filter({ hasText: 'Milk' });
    await expect(milkItem).toContainText('8');

    // Verify Bread stock is now 6 (2 + 4)
    const breadItem = page.getByTestId('product-list-item').filter({ hasText: 'Bread' });
    await expect(breadItem).toContainText('6');
  });

  test('@smoke @critical - Build purchase incrementally and confirm', async ({ page }) => {
    // Given: I am preparing a purchase
    await page.getByTestId('register-purchase-button').click();
    await expect(page.getByTestId('register-purchase-modal')).toBeVisible();

    // When: I add 3 units of Milk
    await page.getByTestId('product-selector').selectOption({ label: 'Milk' });
    await page.getByTestId('quantity-input').fill('3');
    await page.getByTestId('add-item-button').click();

    // Verify Milk is in the purchase list
    await expect(page.getByTestId('purchase-item-Milk')).toBeVisible();
    await expect(page.getByTestId('purchase-item-Milk')).toContainText('3');

    // And: I add 4 units of Bread
    await page.getByTestId('product-selector').selectOption({ label: 'Bread' });
    await page.getByTestId('quantity-input').fill('4');
    await page.getByTestId('add-item-button').click();

    // Verify Bread is in the purchase list
    await expect(page.getByTestId('purchase-item-Bread')).toBeVisible();
    await expect(page.getByTestId('purchase-item-Bread')).toContainText('4');

    // And: I confirm the purchase
    await page.getByTestId('confirm-purchase-button').click();

    // Then: my inventory shows updated values
    await page.waitForTimeout(500);

    const milkItem = page.getByTestId('product-list-item').filter({ hasText: 'Milk' });
    await expect(milkItem).toContainText('8');

    const breadItem = page.getByTestId('product-list-item').filter({ hasText: 'Bread' });
    await expect(breadItem).toContainText('6');
  });

  test('@critical - Cancel purchase leaves inventory unchanged', async ({ page }) => {
    // Given: I am preparing a purchase of 3 units of Milk
    await page.getByTestId('register-purchase-button').click();
    await expect(page.getByTestId('register-purchase-modal')).toBeVisible();

    // Add 3 units of Milk
    await page.getByTestId('product-selector').selectOption({ label: 'Milk' });
    await page.getByTestId('quantity-input').fill('3');
    await page.getByTestId('add-item-button').click();

    // Verify item is in the purchase list
    await expect(page.getByTestId('purchase-item-Milk')).toBeVisible();

    // When: I cancel the purchase
    await page.getByTestId('cancel-purchase-button').click();

    // Then: I do not receive any confirmation message
    await expect(page.getByTestId('register-purchase-modal')).not.toBeVisible();

    // And: my Milk inventory remains at 5 units
    const milkItem = page.getByTestId('product-list-item').filter({ hasText: 'Milk' });
    await expect(milkItem).toContainText('5');
  });
});

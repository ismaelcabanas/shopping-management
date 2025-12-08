import { test, expect } from './setup/msw-setup';

test.describe('US-011: Exclude Products from Scanned Ticket', () => {
  test.beforeEach(async ({ page, context }) => {
    // Setup localStorage BEFORE any page loads using context.addInitScript
    // IMPORTANT: LocalStorageClient uses 'shopping_manager_' prefix!
    // NOTE: MSW is automatically started in main.tsx when VITE_ENABLE_MSW=true
    await context.addInitScript(() => {
      const products = [
        { id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', name: 'Milk', unitType: 'units' },
        { id: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', name: 'Bread', unitType: 'units' },
        { id: 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', name: 'Rice', unitType: 'units' },
        { id: 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f80', name: 'Eggs', unitType: 'units' },
      ];

      const inventory = [
        { productId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', currentStock: 5, unitType: 'units' },
        { productId: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', currentStock: 2, unitType: 'units' },
        { productId: 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', currentStock: 0, unitType: 'units' },
        { productId: 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f80', currentStock: 10, unitType: 'units' },
      ];

      // Use the same prefix as LocalStorageClient
      localStorage.setItem('shopping_manager_products', JSON.stringify(products));
      localStorage.setItem('shopping_manager_inventory', JSON.stringify(inventory));
    });

    // Navigate to catalog page
    await page.goto('http://localhost:5173/catalog');

    // Wait for page to be fully loaded and MSW to be initialized
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');

    // Wait for MSW service worker to be active
    await page.waitForTimeout(1000);
  });

  test('@smoke @critical - Exclude product from ticket scan and verify not added to inventory', async ({ page }) => {
    // Enable console logging to debug MSW
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    // Given: I have products in my catalog (Milk=5, Bread=2, Rice=0, Eggs=10)

    // Wait for the "Scan Ticket" button to be visible
    await expect(page.getByTestId('scan-ticket-button')).toBeVisible({ timeout: 10000 });

    // When: I open the ticket scan modal
    await page.getByTestId('scan-ticket-button').click();

    // Wait for the ticket scan modal to be visible (using role dialog)
    await expect(page.getByRole('dialog', { name: /escanear ticket/i })).toBeVisible();

    // Upload a fake ticket image (any image will work since we're using mock service)
    // Note: The file input is hidden, but we can still interact with it
    const fileInput = page.locator('input[type="file"]');

    // Create a fake image blob
    const buffer = Buffer.from('fake-image-data');
    await fileInput.setInputFiles({
      name: 'test-ticket.jpg',
      mimeType: 'image/jpeg',
      buffer: buffer
    });

    // Wait for processing to complete and results to appear
    // First, we might see "procesando"
    await page.waitForTimeout(500); // Give it time to start processing

    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/after-upload.png', fullPage: true });

    // Then: I should see the scanned products list with 4 products
    await expect(page.getByText('Productos Detectados (4)')).toBeVisible({ timeout: 10000 });

    // Verify all 4 products are shown
    const productItems = page.locator('[data-status]');
    await expect(productItems).toHaveCount(4);

    // Verify each product is present (using data-status context to avoid ambiguity)
    await expect(productItems.filter({ hasText: 'Milk' })).toBeVisible();
    await expect(productItems.filter({ hasText: 'Bread' })).toBeVisible();
    await expect(productItems.filter({ hasText: 'Rice' })).toBeVisible();
    await expect(productItems.filter({ hasText: 'Eggs' })).toBeVisible();

    // When: I remove "Bread" from the list
    // Find the product item containing "Bread" and click its trash button
    const breadItem = productItems.filter({ hasText: 'Bread' });
    await expect(breadItem).toBeVisible();

    const trashButton = breadItem.locator('button[aria-label="Eliminar producto"]');
    await trashButton.click();

    // Then: The product count should update to 3
    await expect(page.getByText('Productos Detectados (3)')).toBeVisible();

    // And: Bread should no longer be visible in the list
    await expect(breadItem).not.toBeVisible();

    // Verify the remaining 3 products are still visible
    await expect(productItems.filter({ hasText: 'Milk' })).toBeVisible();
    await expect(productItems.filter({ hasText: 'Rice' })).toBeVisible();
    await expect(productItems.filter({ hasText: 'Eggs' })).toBeVisible();

    // When: I confirm the remaining products
    await page.getByRole('button', { name: /confirmar/i }).click();

    // Then: The ticket scan modal should close
    await expect(page.getByRole('dialog', { name: /escanear ticket/i })).not.toBeVisible();

    // And: The register purchase modal should open with the remaining 3 products
    await expect(page.getByTestId('register-purchase-modal')).toBeVisible();

    // Verify that only 3 products are pre-filled (Milk, Rice, Eggs - NOT Bread)
    await expect(page.getByTestId('purchase-item-Milk')).toBeVisible();
    await expect(page.getByTestId('purchase-item-Rice')).toBeVisible();
    await expect(page.getByTestId('purchase-item-Eggs')).toBeVisible();
    await expect(page.getByTestId('purchase-item-Bread')).not.toBeVisible();

    // Verify quantities
    await expect(page.getByTestId('purchase-item-Milk')).toContainText('3');
    await expect(page.getByTestId('purchase-item-Rice')).toContainText('1');
    await expect(page.getByTestId('purchase-item-Eggs')).toContainText('6');

    // When: I save the purchase
    await page.getByTestId('confirm-purchase-button').click();

    // Then: The modal should close
    await expect(page.getByTestId('register-purchase-modal')).not.toBeVisible();

    // Wait for inventory to update
    await page.waitForTimeout(500);

    // And: My inventory should show updated values for the 3 products
    // Milk: 5 + 3 = 8
    const milkItem = page.getByTestId('product-list-item').filter({ hasText: 'Milk' });
    await expect(milkItem).toContainText('8');

    // Bread: Should remain 2 (NOT updated because it was excluded)
    const breadInventoryItem = page.getByTestId('product-list-item').filter({ hasText: 'Bread' });
    await expect(breadInventoryItem).toContainText('2');

    // Rice: 0 + 1 = 1
    const riceItem = page.getByTestId('product-list-item').filter({ hasText: 'Rice' });
    await expect(riceItem).toContainText('1');

    // Eggs: 10 + 6 = 16
    const eggsItem = page.getByTestId('product-list-item').filter({ hasText: 'Eggs' });
    await expect(eggsItem).toContainText('16');
  });
});
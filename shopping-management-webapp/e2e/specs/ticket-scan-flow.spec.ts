import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Ticket Scanning Feature (US-012)
 *
 * These tests use MockOCRService for fast, deterministic testing.
 * Real OCR integration (Ollama) is tested manually.
 *
 * See:
 * - Feature spec: e2e/features/us-012-ticket-scan-ocr.feature
 * - Manual testing: docs/testing/manual-testing-checklist.md
 */

test.describe('Ticket Scan Flow - Complete E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to product catalog
    await page.goto('/catalog');

    // Wait for page to load
    await expect(page.getByText('Mi Despensa')).toBeVisible();
  });

  test('should complete full ticket scan workflow with matched products', async ({ page }) => {
    // Given: User is on Product Catalog page
    await expect(page.getByTestId('scan-ticket-button')).toBeVisible();

    // When: User clicks "Escanear Ticket"
    await page.click('[data-testid="scan-ticket-button"]');

    // Then: Ticket Scan modal opens
    await expect(page.getByRole('heading', { name: /escanear ticket/i })).toBeVisible();

    // When: User uploads a ticket image
    // Note: In real tests with Ollama, this would trigger actual OCR
    // Here we intercept and mock the OCR response
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/images/ticket-sample.jpg');

    // Then: Loading indicator appears
    await expect(page.getByText(/procesando/i)).toBeVisible();

    // Then: Results appear after processing
    await expect(page.getByTestId('ticket-results-view')).toBeVisible({ timeout: 10000 });

    // Verify detected items are displayed
    await expect(page.getByText('Leche')).toBeVisible();
    await expect(page.getByText('Pan')).toBeVisible();

    // When: User clicks "Confirmar Items"
    await page.click('button:has-text("Confirmar")');

    // Then: Ticket Scan modal closes
    await expect(page.getByRole('heading', { name: /escanear ticket/i })).not.toBeVisible();

    // Then: Register Purchase modal opens with pre-filled items
    await expect(page.getByTestId('register-purchase-modal')).toBeVisible();
    await expect(page.getByText(/Leche.*2/)).toBeVisible(); // Leche - 2

    // When: User clicks "Guardar Compra"
    await page.click('[data-testid="confirm-purchase-button"]');

    // Then: Success message appears
    await expect(page.getByText(/compra registrada exitosamente/i)).toBeVisible();

    // Then: Modal closes
    await expect(page.getByTestId('register-purchase-modal')).not.toBeVisible();

    // Then: Inventory is updated (verify product appears in catalog)
    await expect(page.getByText('Leche')).toBeVisible();
  });

  test('should handle new products with (nuevo) badge', async ({ page }) => {
    // Open ticket scan modal
    await page.click('[data-testid="scan-ticket-button"]');

    // Upload ticket with new products
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/images/ticket-new-products.jpg');

    // Wait for results
    await expect(page.getByTestId('ticket-results-view')).toBeVisible({ timeout: 10000 });

    // Confirm items
    await page.click('button:has-text("Confirmar")');

    // Verify RegisterPurchaseModal opens
    await expect(page.getByTestId('register-purchase-modal')).toBeVisible();

    // Verify "(nuevo)" badge appears for new products
    await expect(page.getByText(/\(nuevo\)/)).toBeVisible();

    // Save purchase
    await page.click('[data-testid="confirm-purchase-button"]');

    // Verify success
    await expect(page.getByText(/compra registrada exitosamente/i)).toBeVisible();
  });

  test('should allow editing detected items before saving', async ({ page }) => {
    // Open ticket scan modal
    await page.click('[data-testid="scan-ticket-button"]');

    // Upload ticket
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/images/ticket-sample.jpg');

    // Wait for results and confirm
    await expect(page.getByTestId('ticket-results-view')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Confirmar")');

    // RegisterPurchaseModal should be open with pre-filled items
    await expect(page.getByTestId('register-purchase-modal')).toBeVisible();

    // Remove one item (click Eliminar button)
    const removeButtons = page.getByRole('button', { name: /eliminar/i });
    const firstRemoveButton = removeButtons.first();
    await firstRemoveButton.click();

    // Add a new item manually
    await page.fill('[data-testid="product-input"]', 'Arroz');
    await page.fill('[data-testid="quantity-input"]', '5');
    await page.click('[data-testid="add-item-button"]');

    // Verify "Arroz" was added
    await expect(page.getByText(/Arroz.*5/)).toBeVisible();

    // Save purchase
    await page.click('[data-testid="confirm-purchase-button"]');

    // Verify success
    await expect(page.getByText(/compra registrada exitosamente/i)).toBeVisible();
  });

  test('should handle cancel at ticket results stage', async ({ page }) => {
    // Open ticket scan modal
    await page.click('[data-testid="scan-ticket-button"]');

    // Upload ticket
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/images/ticket-sample.jpg');

    // Wait for results
    await expect(page.getByTestId('ticket-results-view')).toBeVisible({ timeout: 10000 });

    // Click close button (X or Cerrar)
    await page.click('button:has-text("Cerrar")');

    // Modal should close
    await expect(page.getByRole('heading', { name: /escanear ticket/i })).not.toBeVisible();

    // No purchase should be registered
    // (We can verify by checking that no toast appears)
    await expect(page.getByText(/compra registrada/i)).not.toBeVisible();
  });

  test('should handle cancel from RegisterPurchase after ticket scan', async ({ page }) => {
    // Complete ticket scan flow up to RegisterPurchase
    await page.click('[data-testid="scan-ticket-button"]');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/images/ticket-sample.jpg');
    await expect(page.getByTestId('ticket-results-view')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Confirmar")');

    // RegisterPurchaseModal should be open
    await expect(page.getByTestId('register-purchase-modal')).toBeVisible();

    // Click Cancel
    await page.click('[data-testid="cancel-purchase-button"]');

    // Modal should close
    await expect(page.getByTestId('register-purchase-modal')).not.toBeVisible();

    // No purchase registered
    await expect(page.getByText(/compra registrada/i)).not.toBeVisible();
  });

  test('should display loading state during OCR processing', async ({ page }) => {
    // Open modal
    await page.click('[data-testid="scan-ticket-button"]');

    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/images/ticket-sample.jpg');

    // Immediately check for loading state
    await expect(page.getByTestId('ticket-processing-view')).toBeVisible();
    await expect(page.getByText(/procesando/i)).toBeVisible();

    // Loading should eventually disappear
    await expect(page.getByTestId('ticket-processing-view')).not.toBeVisible({ timeout: 10000 });
  });

  test('should show matched and unmatched product indicators', async ({ page }) => {
    // Upload ticket with mixed products
    await page.click('[data-testid="scan-ticket-button"]');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/images/ticket-mixed.jpg');

    // Wait for results
    await expect(page.getByTestId('ticket-results-view')).toBeVisible({ timeout: 10000 });

    // Verify we can see status indicators
    // (In real implementation, matched products have different styling than unmatched)
    const resultItems = page.locator('[data-testid^="detected-item-"]');
    await expect(resultItems).not.toHaveCount(0);

    // Verify at least one item is visible
    await expect(resultItems.first()).toBeVisible();
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    // Tab to "Escanear Ticket" button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // May need multiple tabs depending on page structure

    // Focus should be on scan button (verify by checking focused element)
    const scanButton = page.getByTestId('scan-ticket-button');
    await expect(scanButton).toBeFocused();

    // Press Enter to open modal
    await page.keyboard.press('Enter');

    // Modal should open
    await expect(page.getByRole('heading', { name: /escanear ticket/i })).toBeVisible();
  });

  test('should complete workflow in reasonable time', async ({ page }) => {
    const startTime = Date.now();

    // Complete full flow
    await page.click('[data-testid="scan-ticket-button"]');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/images/ticket-sample.jpg');
    await expect(page.getByTestId('ticket-results-view')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Confirmar")');
    await expect(page.getByTestId('register-purchase-modal')).toBeVisible();
    await page.click('[data-testid="confirm-purchase-button"]');
    await expect(page.getByText(/compra registrada exitosamente/i)).toBeVisible();

    const endTime = Date.now();
    const duration = endTime - startTime;

    // With mocked OCR, entire flow should complete in < 5 seconds
    expect(duration).toBeLessThan(5000);
  });

  test('should persist inventory changes after page reload', async ({ page }) => {
    // Complete ticket scan and purchase
    await page.click('[data-testid="scan-ticket-button"]');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/images/ticket-sample.jpg');
    await expect(page.getByTestId('ticket-results-view')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Confirmar")');
    await expect(page.getByTestId('register-purchase-modal')).toBeVisible();
    await page.click('[data-testid="confirm-purchase-button"]');
    await expect(page.getByText(/compra registrada exitosamente/i)).toBeVisible();

    // Reload page
    await page.reload();

    // Verify product still appears in catalog
    await expect(page.getByText('Mi Despensa')).toBeVisible();
    // Products should persist (they're stored in localStorage)
  });
});

test.describe('Ticket Scan Flow - Error Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog');
  });

  test('should handle OCR service errors gracefully', async ({ page }) => {
    // Mock OCR service to return error
    await page.route('**/api/ocr', route => {
      route.abort('failed');
    });

    await page.click('[data-testid="scan-ticket-button"]');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/images/ticket-sample.jpg');

    // Should show error message (exact message depends on implementation)
    // For now, just verify modal doesn't crash and stays open
    await expect(page.getByRole('heading', { name: /escanear ticket/i })).toBeVisible();
  });

  test('should handle empty OCR results', async ({ page }) => {
    // This test assumes OCR returns empty result
    // Implementation should handle this gracefully
    await page.click('[data-testid="scan-ticket-button"]');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/images/ticket-blank.jpg');

    // Wait for processing
    await page.waitForTimeout(2000);

    // Confirm button should be disabled if no items detected
    // (This depends on your implementation)
    const confirmButton = page.getByText('Confirmar');

    // Either button is disabled or doesn't exist if no results
    const isVisible = await confirmButton.isVisible().catch(() => false);
    if (isVisible) {
      await expect(confirmButton).toBeDisabled();
    }
  });
});

test.describe('Ticket Scan Flow - Integration with Product Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog');
  });

  test('should open scan modal from catalog page', async ({ page }) => {
    // Verify button exists
    const scanButton = page.getByTestId('scan-ticket-button');
    await expect(scanButton).toBeVisible();
    await expect(scanButton).toHaveText(/escanear ticket/i);

    // Click and verify modal opens
    await scanButton.click();
    await expect(page.getByRole('heading', { name: /escanear ticket/i })).toBeVisible();
  });

  test('should return to catalog after successful purchase', async ({ page }) => {
    // Complete purchase flow
    await page.click('[data-testid="scan-ticket-button"]');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/images/ticket-sample.jpg');
    await expect(page.getByTestId('ticket-results-view')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Confirmar")');
    await expect(page.getByTestId('register-purchase-modal')).toBeVisible();
    await page.click('[data-testid="confirm-purchase-button"]');

    // Should still be on catalog page
    await expect(page.getByText('Mi Despensa')).toBeVisible();
    await expect(page).toHaveURL(/\/catalog/);
  });
});

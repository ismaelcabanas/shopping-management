# E2E Test Fixtures

This directory contains test fixtures for E2E tests.

## Images

The `images/` directory should contain sample receipt images for testing the ticket scanning feature.

### Required Test Images

Create or add these images for E2E tests to work:

1. **ticket-sample.jpg**
   - A clear supermarket receipt
   - Should contain 2-3 common products (Leche, Pan, Arroz)
   - Used for: Basic happy path testing

2. **ticket-new-products.jpg**
   - Receipt with products not in catalog
   - Products: Tomates, Plátanos, Manzanas
   - Used for: Testing new product creation

3. **ticket-mixed.jpg**
   - Receipt with both known and unknown products
   - Mix of products in catalog and new ones
   - Used for: Testing matched/unmatched indicators

4. **ticket-blank.jpg**
   - Empty or very poor quality image
   - Should result in no products detected
   - Used for: Error handling tests

### Creating Test Images

#### Option 1: Use Real Receipts (Recommended for Manual Tests)

Take photos of actual receipts and add them to this directory.

#### Option 2: Generate Mock Images (For Automated Tests)

Since E2E tests use MockOCRService, the actual image content doesn't matter much.
You can create simple placeholder images:

```bash
# Create 1x1 pixel placeholder images (macOS/Linux)
convert -size 1x1 xc:white e2e/fixtures/images/ticket-sample.jpg
convert -size 1x1 xc:white e2e/fixtures/images/ticket-new-products.jpg
convert -size 1x1 xc:white e2e/fixtures/images/ticket-mixed.jpg
convert -size 1x1 xc:white e2e/fixtures/images/ticket-blank.jpg
```

Or using ImageMagick:
```bash
magick -size 100x100 xc:white e2e/fixtures/images/ticket-sample.jpg
```

Or manually:
- Create a 100x100 white image in any image editor
- Save as JPEG
- Copy for each required file

#### Option 3: Use Sample Data URLs

For very simple tests, you can even use tiny base64 images directly in tests.

### Why It Doesn't Matter for E2E Tests

Our E2E tests use **MockOCRService**, which returns predefined responses regardless of the actual image content. The images just need to:
- Be valid JPEG/PNG files
- Not be corrupted
- Be uploadable via file input

The actual OCR processing (with real images) is tested:
- **Unit tests:** For OllamaVisionOCRService logic
- **Manual tests:** With real Ollama + real receipts

### .gitignore

Real receipt images should NOT be committed to git (may contain sensitive info).

Add to `.gitignore`:
```
e2e/fixtures/images/*.jpg
e2e/fixtures/images/*.png
!e2e/fixtures/images/.gitkeep
```

Keep `.gitkeep` file to preserve directory structure.

### Alternative: Mock at Network Level

If you don't want to deal with image files at all, you can mock at the network level in tests:

```typescript
await page.route('**/api/ocr', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ text: 'Leche | 2\nPan | 3' })
  });
});
```

This way, the file upload is mocked entirely and no actual images are needed.

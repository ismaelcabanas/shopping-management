# Manual Testing Checklist - Ticket Scanning Feature

**Feature:** US-012 - Ticket Scanning with OCR
**Test Type:** Manual / Exploratory
**Prerequisites:** Ollama + LLaVA installed and running
**Version:** 1.0
**Last Updated:** 2024-01-21

---

## ⚙️ Setup Prerequisites

Before starting manual tests, ensure:

- [ ] Ollama is installed (`ollama --version`)
- [ ] LLaVA model is pulled (`ollama list` shows llava)
- [ ] Ollama server is running (`ollama serve`)
- [ ] Verify Ollama API: `curl http://localhost:11434/api/version`
- [ ] App is running locally (`npm run dev`)
- [ ] Browser DevTools console is open (check for errors)

---

## 📱 Test Environment

- **Device:** [iOS/Android/Desktop]
- **Browser:** [Chrome/Safari/Firefox] Version: _____
- **OS:** [macOS/Windows/Linux] Version: _____
- **Network:** [Online/Offline]
- **Ollama Model:** llava:[7b/13b/34b]

---

## 🧪 Test Cases

### TC-001: Basic Supermarket Receipt Scanning

**Objective:** Verify that a standard supermarket receipt is processed correctly

**Priority:** 🔴 Critical
**Type:** Smoke Test

**Preconditions:**
- At least 3 products already exist in catalog (e.g., Leche, Pan, Arroz)
- Products in receipt match catalog products

**Test Data:**
- Receipt image: Supermarket ticket with 3-5 common products

**Steps:**
1. Navigate to Product Catalog (`/catalog`)
2. Click "Escanear Ticket" button
3. Verify Ticket Scan modal opens
4. Click "Seleccionar Imagen" or drag-and-drop
5. Select a clear supermarket receipt image
6. Wait for processing (5-15 seconds)

**Expected Results:**
- [ ] Loading spinner appears during processing
- [ ] Processing completes within 20 seconds
- [ ] At least 70% of products are detected
- [ ] Matched products show green checkmark ✅
- [ ] Product names are reasonably accurate
- [ ] Quantities are correct (or close ±1)
- [ ] No crashes or console errors

**Actual Results:**
```
Date/Time: __________
Products detected: _____ / _____ (expected)
Accuracy: ____%
Processing time: _____ seconds
Notes: _________________________
```

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-002: Mixed Matched and Unmatched Products

**Objective:** Verify handling of receipts with both existing and new products

**Priority:** 🔴 Critical
**Type:** Functional

**Preconditions:**
- Some products in receipt exist in catalog
- Some products are new (not in catalog)

**Test Data:**
- Receipt with: 2 known products + 2 unknown products

**Steps:**
1. Scan a receipt with mixed products
2. Observe the results view

**Expected Results:**
- [ ] Known products: Green checkmark + "matched" indicator
- [ ] Unknown products: Warning icon + "unmatched" indicator
- [ ] Can distinguish between matched/unmatched visually
- [ ] Confirm button is enabled
- [ ] All detected items are listed

**Actual Results:**
```
Known products detected correctly: [ ] Yes [ ] No
Unknown products marked correctly: [ ] Yes [ ] No
Visual indicators clear: [ ] Yes [ ] No
Notes: _________________________
```

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-003: New Product Auto-Creation

**Objective:** Verify that unmatched products are created automatically

**Priority:** 🟡 High
**Type:** Functional

**Preconditions:**
- Empty or minimal catalog

**Test Data:**
- Receipt with products NOT in catalog

**Steps:**
1. Scan receipt with new products (e.g., "Tomates", "Plátanos")
2. Click "Confirmar Items"
3. Verify RegisterPurchaseModal shows "(nuevo)" badges
4. Click "Guardar Compra"
5. Navigate to Product Catalog
6. Verify new products appear in list

**Expected Results:**
- [ ] "(nuevo)" badge appears for new products
- [ ] Products are created successfully
- [ ] New products have correct names
- [ ] Inventory is updated with purchase quantities
- [ ] No duplicate products created

**Actual Results:**
```
Products created: _____
Correct names: [ ] Yes [ ] No
Inventory correct: [ ] Yes [ ] No
Notes: _________________________
```

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-004: Poor Quality Image Handling

**Objective:** Test robustness with low-quality receipt images

**Priority:** 🟡 High
**Type:** Negative Testing

**Test Data:**
- Blurry receipt photo
- Crumpled/folded receipt
- Low lighting photo
- Partial receipt (cut off)

**Steps:**
1. Try scanning each problematic image type
2. Observe OCR results

**Expected Results:**
- [ ] Some products still detected (>30%)
- [ ] No crashes or hangs
- [ ] Processing completes (may take longer)
- [ ] Clear error message if no products detected
- [ ] Option to retry with different image

**Actual Results:**
```
Blurry: Detected _____ products
Crumpled: Detected _____ products
Low light: Detected _____ products
Partial: Detected _____ products
Notes: _________________________
```

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-005: Different Store Formats

**Objective:** Verify OCR works across different store receipt formats

**Priority:** 🟡 High
**Type:** Compatibility

**Test Data:**
- Receipt from: Supermarket (e.g., Mercadona)
- Receipt from: Pharmacy
- Receipt from: Hardware store
- Receipt from: Bakery

**Steps:**
1. Scan receipt from each store type
2. Compare detection rates

**Expected Results:**
- [ ] Works with multiple formats
- [ ] Detection rate >50% for each type
- [ ] Handles different layouts (items below/above price)

**Actual Results:**
```
Supermarket: ____% accuracy
Pharmacy: ____% accuracy
Hardware: ____% accuracy
Bakery: ____% accuracy
Notes: _________________________
```

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-006: Large Receipt (Many Items)

**Objective:** Test performance with receipts containing many items

**Priority:** 🟢 Medium
**Type:** Performance

**Test Data:**
- Receipt with 15-30 products

**Steps:**
1. Scan large receipt
2. Measure processing time
3. Verify all items detected

**Expected Results:**
- [ ] Processing completes within 30 seconds
- [ ] >60% of items detected
- [ ] UI remains responsive
- [ ] No memory issues

**Actual Results:**
```
Items on receipt: _____
Items detected: _____
Processing time: _____ seconds
Browser memory: Before _____ MB / After _____ MB
Notes: _________________________
```

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-007: Edit Detected Items Before Saving

**Objective:** Verify users can modify OCR results before registering

**Priority:** 🔴 Critical
**Type:** Functional

**Steps:**
1. Scan receipt
2. Click "Confirmar Items"
3. In RegisterPurchaseModal:
   - Remove one detected item
   - Manually add a new item
   - Change quantity of one item
4. Save purchase

**Expected Results:**
- [ ] Can remove items from pre-filled list
- [ ] Can add new items manually
- [ ] Can edit quantities
- [ ] Final purchase reflects edits (not original OCR)
- [ ] Inventory updated correctly based on edits

**Actual Results:**
```
Edits applied correctly: [ ] Yes [ ] No
Inventory accurate: [ ] Yes [ ] No
Notes: _________________________
```

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-008: Cancel Workflow at Different Stages

**Objective:** Verify cancellation works at each step

**Priority:** 🟡 High
**Type:** Functional

**Steps:**
1. **Cancel during upload:** Open modal → Close immediately
2. **Cancel during processing:** Upload → Close while processing
3. **Cancel after results:** View results → Close modal
4. **Cancel from RegisterPurchase:** Confirm items → Cancel purchase

**Expected Results:**
- [ ] Can cancel at any stage
- [ ] No purchase registered when cancelled
- [ ] No partial data saved
- [ ] Inventory unchanged
- [ ] No console errors

**Actual Results:**
```
Stage 1 cancel: [ ] OK [ ] Issue: _____
Stage 2 cancel: [ ] OK [ ] Issue: _____
Stage 3 cancel: [ ] OK [ ] Issue: _____
Stage 4 cancel: [ ] OK [ ] Issue: _____
```

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-009: Non-Receipt Image Upload

**Objective:** Test behavior when uploading non-receipt images

**Priority:** 🟢 Medium
**Type:** Negative Testing

**Test Data:**
- Photo of a product (not receipt)
- Random document
- Screenshot
- Photo of person/landscape

**Steps:**
1. Upload non-receipt image
2. Observe behavior

**Expected Results:**
- [ ] OCR completes without crashing
- [ ] Either: no products detected (correct behavior)
- [ ] Or: few/random products detected (acceptable)
- [ ] Clear message: "No se detectaron productos"
- [ ] Option to try again

**Actual Results:**
```
Image type: _____________
Behavior: _____________
Message shown: [ ] Yes [ ] No
Notes: _________________________
```

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-010: Network Offline (Ollama Unreachable)

**Objective:** Test error handling when Ollama is not available

**Priority:** 🔴 Critical
**Type:** Error Handling

**Steps:**
1. Stop Ollama service (`pkill ollama`)
2. Try scanning a receipt
3. Observe error behavior

**Expected Results:**
- [ ] Clear error message displayed
- [ ] Error indicates connection problem
- [ ] No indefinite loading/hanging
- [ ] Option to retry
- [ ] App doesn't crash

**Actual Results:**
```
Error message: _____________
Timeout: _____ seconds
Recovery options: [ ] Yes [ ] No
Notes: _________________________
```

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-011: Complete End-to-End Flow

**Objective:** Verify entire workflow from scan to inventory update

**Priority:** 🔴 Critical
**Type:** Smoke Test / Integration

**Preconditions:**
- Known initial inventory state

**Steps:**
1. Note current inventory for "Leche": _____ units
2. Scan receipt with "Leche | 3"
3. Confirm detected items
4. Save purchase
5. Verify success message
6. Check Product Catalog
7. Verify "Leche" inventory = initial + 3

**Expected Results:**
- [ ] Complete flow works end-to-end
- [ ] Inventory updated correctly
- [ ] Success toast notification shown
- [ ] Product card shows new quantity
- [ ] Changes persist after page refresh

**Actual Results:**
```
Initial inventory: _____
Expected final: _____
Actual final: _____
Flow completed: [ ] Yes [ ] No
Notes: _________________________
```

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-012: Mobile Responsive Testing

**Objective:** Verify feature works on mobile devices

**Priority:** 🟡 High
**Type:** Compatibility

**Test on:**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet

**Steps:**
1. Access app on mobile device
2. Click "Escanear Ticket"
3. Use camera to take photo of receipt
4. Complete flow

**Expected Results:**
- [ ] Modal fits screen properly
- [ ] Camera integration works
- [ ] Touch interactions smooth
- [ ] Buttons are tap-friendly (min 44x44px)
- [ ] Text is readable
- [ ] Processing time acceptable on mobile

**Actual Results:**
```
Device: _____________
Issues: _____________
UX rating: [ ] Good [ ] Acceptable [ ] Poor
Notes: _________________________
```

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

## 🐛 Defect Report Template

**Defect ID:** DEF-___
**Test Case:** TC-___
**Severity:** [ ] Critical [ ] High [ ] Medium [ ] Low

**Summary:**
_Brief description of the issue_

**Steps to Reproduce:**
1.
2.
3.

**Expected Result:**


**Actual Result:**


**Screenshots/Video:**
_Attach if available_

**Environment:**
- OS: _____
- Browser: _____
- Ollama Model: _____

**Console Errors:**
```
Paste console errors here
```

**Reproducibility:** [ ] Always [ ] Sometimes [ ] Once

---

## 📊 Test Summary

**Date:** __________
**Tester:** __________
**Total Test Cases:** 12
**Passed:** _____
**Failed:** _____
**Blocked:** _____
**Pass Rate:** _____%

**Overall Assessment:**
- [ ] Ready for release
- [ ] Minor issues, can release with known limitations
- [ ] Major issues, not ready for release

**Critical Issues Found:**
1.
2.

**Recommendations:**


**Sign-off:** __________

---

## 🔄 Regression Testing Checklist

Run these tests before each release:

**Quick Smoke Test (5-10 minutes):**
- [ ] TC-001: Basic receipt scanning
- [ ] TC-011: End-to-end flow
- [ ] Check console for errors

**Full Regression (30-45 minutes):**
- [ ] All test cases above
- [ ] Cross-browser testing
- [ ] Mobile device testing

---

## 📝 Notes and Observations

Use this space for additional notes, observations, or suggestions during testing:

```
[Date] [Tester]:
- Observation 1
- Observation 2


```

---

**Related Documents:**
- Feature Specification: `e2e/features/us-012-ticket-scan-ocr.feature`
- Setup Guide: `docs/setup/ollama-setup.md`
- Architecture Decision: `docs/architecture/ocr-providers.md`
- E2E Automated Tests: `e2e/specs/ticket-scan-flow.spec.ts`

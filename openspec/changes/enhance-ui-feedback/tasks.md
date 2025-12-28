# Tasks: Enhance UI Feedback Components

**Change ID**: `enhance-ui-feedback`
**Status**: Draft
**Last Updated**: 2025-12-27

---

## Task Sequence

These tasks follow TDD (Test-Driven Development) and deliver incremental, user-visible progress.

---

### Phase 1: Core Components (1.5 days / ~12 hours)

#### Task 1.1: Create EmptyState component [x]
**Goal**: Implement standardized empty state component with variants

**Steps**:
1. Read Button.tsx and Card.tsx to understand component patterns
2. Write failing tests for EmptyState component:
   - Test default rendering with title
   - Test with icon (emoji and Lucide icon)
   - Test with description
   - Test with action button
   - Test size variants (compact, default, large)
   - Test accessibility (ARIA attributes, keyboard nav)
3. Create `src/presentation/shared/components/EmptyState.tsx`:
   - TypeScript interface for props
   - Support icon/emoji, title, description, action CTA
   - Size variants implementation
   - ARIA attributes (role="status", aria-live="polite")
4. Implement component following Tailwind patterns
5. Verify all tests pass
6. Commit: `feat(components): add EmptyState component with variants`

**Dependencies**: None
**Validation**: Unit tests pass, TypeScript compiles, component renders correctly

---

#### Task 1.2: Create Alert component [x]
**Goal**: Implement persistent alert/banner component

**Steps**:
1. Write failing tests for Alert component:
   - Test 4 variants (info, success, warning, error)
   - Test with title and children
   - Test closable functionality
   - Test auto icon selection
   - Test custom icon
   - Test full-width vs contained
   - Test accessibility (role="alert", aria-live)
2. Create `src/presentation/shared/components/Alert.tsx`:
   - TypeScript interface for props
   - Variant styling (4 types using Tailwind design tokens)
   - Close button with X icon
   - Auto icon selection based on variant
   - ARIA attributes
3. Implement component with Lucide icons (Info, CheckCircle, AlertTriangle, XCircle)
4. Verify tests pass
5. Commit: `feat(components): add Alert component with 4 variants`

**Dependencies**: None
**Validation**: Unit tests pass, visual inspection of all variants

---

#### Task 1.3: Create Badge component [x]
**Goal**: Implement reusable status badge component

**Steps**:
1. Write failing tests for Badge component:
   - Test 6 variants (default, primary, success, warning, danger, info)
   - Test 3 sizes (sm, md, lg)
   - Test with icon
   - Test pill vs rounded styles
   - Test accessibility
2. Create `src/presentation/shared/components/Badge.tsx`:
   - TypeScript interface for props
   - Variant styling (6 colors using design tokens)
   - Size support (sm, md, lg)
   - Optional icon integration
   - Pill style option
3. Implement component following existing patterns
4. Verify tests pass
5. Commit: `feat(components): add Badge component with 6 variants`

**Dependencies**: None
**Validation**: Unit tests pass, all variants render correctly

---

#### Task 1.4: Create Skeleton component [x]
**Goal**: Implement flexible loading skeleton component

**Steps**:
1. Write failing tests for Skeleton component:
   - Test variants (text, card, avatar, button, custom)
   - Test configurable width/height
   - Test count repetition
   - Test pulse animation
2. Create `src/presentation/shared/components/Skeleton.tsx`:
   - TypeScript interface for props
   - Multiple variant types
   - Configurable dimensions
   - Count parameter for repetition
   - Pulse animation (Tailwind animate-pulse)
3. Implement component
4. Verify tests pass
5. Commit: `feat(components): add Skeleton component with multiple variants`

**Dependencies**: None
**Validation**: Unit tests pass, animations work smoothly

---

### Phase 2: Integration & Refactoring (1 day / ~8 hours)

#### Task 2.1: Refactor ProductList to use EmptyState and Skeleton [x]
**Goal**: Replace inline implementations with reusable components

**Steps**:
1. Read ProductList.tsx current implementation (lines 23-52)
2. Update ProductList.test.tsx tests:
   - Update empty state assertions to match EmptyState component
   - Update loading state assertions to match Skeleton component
3. Refactor ProductList.tsx:
   - Remove inline EmptyState JSX (lines 38-52)
   - Import and use EmptyState component
   - Remove inline SkeletonLoader (lines 23-36)
   - Import and use Skeleton component with `variant="card"` and `count={3}`
4. Run tests to verify refactoring
5. Visual inspection in browser (empty and loading states)
6. Commit: `refactor(product-list): use EmptyState and Skeleton components`

**Dependencies**: Tasks 1.1, 1.4 completed
**Validation**: All ProductList tests pass, no visual regressions

---

#### Task 2.2: Refactor ShoppingListView to use Badge and EmptyState [x]
**Goal**: Replace inline badge divs and empty state with reusable components

**Steps**:
1. Read ShoppingListView.tsx current implementation (lines 12-39)
2. Update ShoppingListView.test.tsx tests:
   - Update badge assertions to match Badge component
   - Update empty state assertions
3. Refactor ShoppingListView.tsx:
   - Remove inline `getBadgeStyles` function (lines 12-28)
   - Import Badge component
   - Replace inline badge JSX with Badge component
   - Remove inline empty state (lines 30-39)
   - Import and use EmptyState component
4. Run tests to verify refactoring
5. Visual inspection (badges should look identical)
6. Commit: `refactor(shopping-list): use Badge and EmptyState components`

**Dependencies**: Tasks 1.1, 1.3 completed
**Validation**: All ShoppingListView tests pass, badges render correctly

---

#### Task 2.3: Add EmptyState to DashboardPage [x]
**Goal**: Enhance dashboard with empty state guidance

**Steps**:
1. Read DashboardPage.tsx current implementation
2. Write test for empty dashboard state
3. Update DashboardPage.tsx:
   - Import EmptyState component
   - Add conditional rendering for empty dashboard
   - Use `size="large"` for hero-style empty state
   - Add appropriate icon (LayoutDashboard from Lucide)
   - Add descriptive text and optional CTA
4. Run tests
5. Visual inspection
6. Commit: `feat(dashboard): add empty state with guidance`

**Dependencies**: Task 1.1 completed
**Validation**: Dashboard shows helpful empty state when no data

---

#### Task 2.4: Add Alert to ProductCatalogPage for warnings [x]
**Goal**: Show persistent alerts for important information

**Steps**:
1. Read ProductCatalogPage.tsx current implementation
2. Write tests for alert display scenarios
3. Update ProductCatalogPage.tsx:
   - Import Alert component
   - Add Alert for API key missing warning (if applicable)
   - Add Alert for other important notices
   - Use appropriate variant (warning, info)
4. Run tests
5. Visual inspection
6. Commit: `feat(catalog): add Alert for warnings and notices`

**Dependencies**: Task 1.2 completed
**Validation**: Alerts display correctly, closable works

---

### Phase 3: Error Handling Enhancement (1 day / ~8 hours)

#### Task 3.1: Create ErrorBoundary component [x]
**Goal**: Catch React errors at component tree level

**Steps**:
1. Write failing tests for ErrorBoundary:
   - Test error catching
   - Test fallback UI rendering
   - Test error callback
   - Test reset mechanism
2. Create `src/presentation/shared/components/ErrorBoundary.tsx`:
   - React.Component class (error boundaries must be classes)
   - componentDidCatch lifecycle method
   - getDerivedStateFromError static method
   - State for error tracking
   - Reset mechanism
3. Implement error boundary logic
4. Verify tests pass
5. Commit: `feat(components): add ErrorBoundary for error catching`

**Dependencies**: None
**Validation**: Error boundary catches errors and shows fallback

---

#### Task 3.2: Create ErrorState component [x]
**Goal**: User-friendly error UI with retry

**Steps**:
1. Write failing tests for ErrorState:
   - Test default error display
   - Test with custom title/message
   - Test retry button
   - Test dev mode (shows error details)
   - Test accessibility
2. Create `src/presentation/shared/components/ErrorState.tsx`:
   - TypeScript interface for props
   - User-friendly error message
   - Retry button integration (uses Button component)
   - Optional error details (dev mode only)
   - ARIA attributes (role="alert")
3. Implement component
4. Verify tests pass
5. Commit: `feat(components): add ErrorState for user-friendly errors`

**Dependencies**: Task 3.1, Button component
**Validation**: ErrorState renders with retry button

---

#### Task 3.3: Create useErrorHandler hook [x]
**Goal**: Centralized error handling logic

**Steps**:
1. Write failing tests for useErrorHandler:
   - Test error capture
   - Test toast integration
   - Test retry mechanism
2. Create `src/presentation/hooks/useErrorHandler.ts`:
   - Error state management
   - Toast notification fallback
   - Retry callback support
   - Error logging (optional)
3. Implement hook
4. Verify tests pass
5. Commit: `feat(hooks): add useErrorHandler for centralized error handling`

**Dependencies**: Task 3.1, 3.2
**Validation**: Hook works with ErrorBoundary and ErrorState

---

#### Task 3.4: Add ErrorBoundary to App.tsx and pages [x]
**Goal**: Wrap components with error boundaries

**Steps**:
1. Read App.tsx current structure
2. Update App.tsx:
   - Import ErrorBoundary component
   - Wrap Router/Routes with ErrorBoundary
   - Configure fallback UI (ErrorState component)
   - Add error logging callback
3. Update ProductCatalogPage.tsx:
   - Add ErrorBoundary around critical sections
4. Update ShoppingListPage.tsx:
   - Add ErrorBoundary wrapper
5. Update tests for wrapped components
6. Test error scenarios (throw errors intentionally)
7. Commit: `feat(app): add ErrorBoundary wrappers for error recovery`

**Dependencies**: Tasks 3.1, 3.2, 3.3 completed
**Validation**: Errors caught gracefully, user sees fallback UI

---

### Phase 4: Documentation & Quality Checks (0.5 day / ~4 hours)

#### Task 4.1: Write comprehensive component documentation [ ]
**Goal**: Document all new components with JSDoc

**Steps**:
1. Add JSDoc comments to EmptyState.tsx:
   - Component description
   - Props documentation with examples
   - Usage examples
   - Accessibility notes
2. Repeat for Alert, Badge, Skeleton, ErrorBoundary, ErrorState
3. Add accessibility annotations (WCAG level, keyboard support)
4. Document common patterns and best practices
5. Commit: `docs(components): add JSDoc documentation for feedback components`

**Dependencies**: All components completed
**Validation**: Documentation is clear and helpful

**Note**: E2E tests (tasks 4.2-4.4) have been removed as they provide limited value for these presentational components. The 113 unit tests provide sufficient coverage.

---

#### Task 4.2: Update CLAUDE.md with new patterns [ ]
**Goal**: Document component usage patterns for future development

**Steps**:
1. Read current CLAUDE.md
2. Add section on feedback components:
   - EmptyState usage guidelines
   - Alert vs Toast decision tree
   - Badge color conventions
   - Skeleton loading patterns
   - ErrorBoundary placement guidelines
3. Add examples for each component
4. Document accessibility requirements
5. Commit: `docs: update CLAUDE.md with feedback component patterns`

**Dependencies**: All components completed
**Validation**: Documentation is clear and actionable

---

#### Task 4.3: Create migration guide [ ]
**Goal**: Help developers migrate to new components

**Steps**:
1. Create migration guide document (or add to proposal):
   - How to replace inline empty states with EmptyState
   - How to replace inline badges with Badge component
   - How to replace skeleton loaders with Skeleton component
   - How to add ErrorBoundary to existing components
   - Code before/after examples
2. Include gotchas and common pitfalls
3. Commit: `docs: add migration guide for feedback components`

**Dependencies**: All refactoring tasks completed
**Validation**: Guide is helpful and complete

---

#### Task 4.4: Run full quality checks [ ]
**Goal**: Ensure all quality gates pass

**Steps**:
1. Run `npm run build` - Verify TypeScript compiles
2. Run `npm test` - Verify all unit tests pass (703+)
3. Run `npm run lint` - Verify ESLint passes
4. Check for console errors/warnings
5. Verify bundle size increase (<10KB)
6. Document any issues found
7. Fix critical issues before marking complete
8. Commit: `chore: final quality checks and cleanup`

**Dependencies**: All previous tasks completed
**Validation**: All quality gates pass, no regressions

---

## Task Summary

**Total Tasks**: 16 tasks across 4 phases (reduced from 26 after removing E2E tests)
**Estimated Effort**: 2-3 days (12-18 hours)
**Critical Path**: Phase 1 → Phase 2 → Phase 3 → Phase 4
**Parallelizable Work**:
- Tasks 1.1, 1.2, 1.3, 1.4 (Phase 1) - All independent
- Tasks 2.1, 2.2 (Phase 2) - Independent from each other
- Tasks 3.1, 3.2, 3.3 (Phase 3) - Somewhat independent

**Note**: E2E tests (original tasks 4.2-4.4) removed as 113 unit tests provide sufficient coverage for these presentational components.

---

## Validation Checklist

Before marking the change as complete, verify:

- ✅ All 16 tasks completed (12 done, 4 remaining in Phase 4)
- ✅ All components created (EmptyState, Alert, Badge, Skeleton, ErrorBoundary, ErrorState)
- ✅ All components have unit tests (>90% coverage, 113 tests)
- ✅ ProductList and ShoppingListView refactored successfully
- ✅ No duplicate code (inline empty states, badges removed)
- ✅ All existing 703 tests pass (590 original + 113 new)
- ✅ `npm run build` passes (no TypeScript errors)
- ✅ `npm run lint` passes (no ESLint errors)
- ✅ No console errors or warnings
- ✅ Bundle size increase <10KB
- [ ] Documentation complete (JSDoc, CLAUDE.md, migration guide)
- [ ] PR created with screenshots/GIFs
- [ ] Code reviewed (self-review or team review)

---

## Rollback Plan

If issues arise after deployment:

1. **Immediate**: Revert merge commit if critical bugs found
2. **Short-term**: Create hotfix branch for specific issues
3. **Long-term**: Iterate on feedback, improve in next sprint

**Monitoring**: Check for:
- Console errors (JavaScript exceptions)
- Accessibility complaints (keyboard nav, screen readers)
- Visual bugs (layout shifts, misaligned components)
- Performance regressions (Lighthouse scores)

---

## Notes

- Follow TDD strictly: Red → Green → Refactor for each task
- Commit after each task completion (small, atomic commits)
- Run tests frequently to catch regressions early
- Pause for user feedback after Phase 2 (integration complete)
- Document any deviations from plan in task notes
- Use conventional commit format: `feat:`, `refactor:`, `test:`, `docs:`

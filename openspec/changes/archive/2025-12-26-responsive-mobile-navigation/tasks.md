# Tasks: Responsive Mobile Navigation

**Change ID**: `responsive-mobile-navigation`
**Status**: Draft
**Last Updated**: 2025-12-26

## Task Sequence

These tasks follow TDD (Test-Driven Development) and deliver incremental, user-visible progress.

---

### Phase 1: Foundation & Mobile Menu State (2-3 hours)

#### Task 1.1: Add mobile menu state management
**Goal**: Add state hooks for mobile menu open/closed state

**Steps**:
1. Read existing `Navigation.tsx` to understand current implementation
2. Write failing test: "should toggle mobile menu state when hamburger clicked"
3. Add `useState` hook for `isMobileMenuOpen` state
4. Add `toggleMobileMenu` and `closeMobileMenu` functions
5. Verify test passes
6. Commit: `feat: add mobile menu state management`

**Dependencies**: None
**Validation**: Unit test passes, TypeScript compiles

---

#### Task 1.2: Implement hamburger button (mobile only)
**Goal**: Add hamburger menu button visible only on mobile (<768px)

**Steps**:
1. Write failing test: "should render hamburger button on mobile viewport"
2. Add hamburger button with `Menu` icon from Lucide
3. Apply Tailwind classes: `md:hidden` (hide on desktop), `min-h-touch`
4. Wire up `onClick` to `toggleMobileMenu`
5. Add ARIA attributes: `aria-label`, `aria-expanded`, `aria-controls`
6. Verify test passes
7. Commit: `feat: add mobile hamburger button`

**Dependencies**: Task 1.1 completed
**Validation**: Unit test passes, button appears on mobile viewport

---

#### Task 1.3: Hide desktop navigation on mobile
**Goal**: Show desktop navigation only on viewports ≥768px

**Steps**:
1. Write failing test: "should hide desktop navigation on mobile viewport"
2. Wrap existing desktop nav links in container with `hidden md:flex`
3. Verify desktop navigation visible on ≥768px
4. Verify desktop navigation hidden on <768px
5. Verify test passes
6. Commit: `feat: hide desktop navigation on mobile`

**Dependencies**: None (parallel with 1.2)
**Validation**: Unit test passes, desktop nav hidden on mobile

---

### Phase 2: Mobile Menu Drawer (3-4 hours)

#### Task 2.1: Create mobile menu drawer structure
**Goal**: Build the slide-in drawer UI without animation

**Steps**:
1. Write failing test: "should render mobile menu drawer when open"
2. Create mobile menu drawer JSX:
   - Fixed position, full height, 80% width (max-w-sm)
   - White background, shadow-2xl
   - Conditional rendering based on `isMobileMenuOpen`
3. Add navigation links (reuse/adapt from desktop nav)
4. Add close button (X icon) in top-right
5. Add proper ARIA attributes: `id`, `role`, `aria-label`, `aria-hidden`
6. Verify test passes
7. Commit: `feat: create mobile menu drawer structure`

**Dependencies**: Task 1.1, 1.2 completed
**Validation**: Unit test passes, drawer renders when state is true

---

#### Task 2.2: Add backdrop overlay
**Goal**: Create semi-transparent backdrop behind drawer

**Steps**:
1. Write failing test: "should render backdrop when mobile menu is open"
2. Add backdrop element:
   - Fixed position, full viewport
   - `bg-black bg-opacity-40`
   - `z-40` (below drawer's z-50)
   - Conditional rendering based on `isMobileMenuOpen`
3. Wire up `onClick` to `closeMobileMenu`
4. Add `aria-hidden="true"`
5. Verify test passes
6. Commit: `feat: add mobile menu backdrop overlay`

**Dependencies**: Task 2.1 completed
**Validation**: Unit test passes, backdrop appears when menu open

---

#### Task 2.3: Make mobile menu links functional
**Goal**: Enable navigation from mobile menu and auto-close on click

**Steps**:
1. Write failing test: "should close mobile menu when link is clicked"
2. Add `onClick={closeMobileMenu}` to each mobile nav link
3. Apply touch-friendly styles: `min-h-touch-lg`, `px-6 py-4`
4. Add icons and labels (matching desktop nav)
5. Add hover state: `hover:bg-gray-100`
6. Verify test passes
7. Commit: `feat: make mobile menu links functional`

**Dependencies**: Task 2.1 completed
**Validation**: Unit test passes, clicking link closes menu and navigates

---

### Phase 3: Animations & Polish (2-3 hours)

#### Task 3.1: Add slide-in animation for drawer
**Goal**: Animate drawer sliding in from left (250ms)

**Steps**:
1. Write test: "should animate drawer slide-in when opening" (can be manual test)
2. Add transition classes to drawer:
   - `transition-transform duration-250 ease-in-out`
   - Closed state: `translate-x-full` → `translate-x-0` (opened)
3. Update conditional rendering to toggle classes, not mount/unmount
4. Test animation smoothness manually (60fps target)
5. Commit: `feat: add slide-in animation for mobile menu`

**Dependencies**: Task 2.1 completed
**Validation**: Manual testing, animation is smooth

---

#### Task 3.2: Add fade-in animation for backdrop
**Goal**: Animate backdrop fading in/out (250ms)

**Steps**:
1. Add transition classes to backdrop:
   - `transition-opacity duration-250 ease-in-out`
   - Closed state: `opacity-0 pointer-events-none`
   - Opened state: `opacity-40`
2. Update conditional rendering to toggle classes, not mount/unmount
3. Test fade animation manually
4. Commit: `feat: add fade-in animation for backdrop`

**Dependencies**: Task 2.2 completed
**Validation**: Manual testing, fade animation is smooth

---

#### Task 3.3: Add body scroll lock
**Goal**: Prevent page scrolling when mobile menu is open

**Steps**:
1. Write failing test: "should lock body scroll when mobile menu opens"
2. Add `useEffect` to manage body overflow:
   - Set `document.body.style.overflow = 'hidden'` when open
   - Set `document.body.style.overflow = 'unset'` when closed
   - Cleanup function to restore scroll
3. Verify test passes
4. Commit: `feat: add body scroll lock for mobile menu`

**Dependencies**: Task 1.1 completed (can be parallel with Phase 2)
**Validation**: Unit test passes, page doesn't scroll when menu open

---

### Phase 4: Responsive Brand/Logo (1 hour)

#### Task 4.1: Make brand responsive
**Goal**: Show icon-only on mobile, full text on desktop

**Steps**:
1. Write failing test: "should show icon-only brand on mobile"
2. Wrap brand text in `<span className="hidden md:inline">`
3. Ensure icon always visible
4. Verify test passes
5. Commit: `feat: make brand responsive (icon-only on mobile)`

**Dependencies**: None (can be done in parallel)
**Validation**: Unit test passes, brand adapts to viewport

---

### Phase 5: Keyboard Navigation & Accessibility (2-3 hours)

#### Task 5.1: Add Escape key to close menu
**Goal**: Allow users to close mobile menu with Escape key

**Steps**:
1. Write failing test: "should close menu when Escape key is pressed"
2. Add `useEffect` with keydown event listener:
   - Listen for `Escape` key
   - Call `closeMobileMenu()` if menu is open
   - Cleanup listener on unmount
3. Verify test passes
4. Commit: `feat: add Escape key support for mobile menu`

**Dependencies**: Task 1.1 completed
**Validation**: Unit test passes, Escape closes menu

---

#### Task 5.2: Add focus management
**Goal**: Move focus into menu when opened, restore when closed

**Steps**:
1. Write failing test: "should move focus to first menu item when opened"
2. Add ref to mobile menu drawer
3. Add `useEffect` to manage focus:
   - When menu opens, find first focusable element and focus it
   - When menu closes, focus hamburger button
4. Verify test passes
5. Commit: `feat: add focus management for mobile menu`

**Dependencies**: Task 2.1 completed
**Validation**: Unit test passes, focus moves correctly

---

#### Task 5.3: Verify ARIA attributes
**Goal**: Ensure all ARIA attributes are correctly applied

**Steps**:
1. Write tests for ARIA attributes:
   - Hamburger button: `aria-label`, `aria-expanded`, `aria-controls`
   - Mobile menu: `id`, `role`, `aria-label`, `aria-hidden`
   - Backdrop: `aria-hidden`
2. Verify attributes are present in component (already added in previous tasks)
3. Update any missing attributes
4. Verify all tests pass
5. Commit: `test: verify ARIA attributes for accessibility`

**Dependencies**: Tasks 2.1, 2.2 completed
**Validation**: Unit tests pass, screen reader compatible

---

### Phase 6: Active Route Indication (1 hour)

#### Task 6.1: Highlight active route in mobile menu
**Goal**: Visually indicate current page in mobile menu

**Steps**:
1. Write failing test: "should highlight active route in mobile menu"
2. Use existing `isActive()` function from current nav
3. Apply conditional classes to mobile nav links:
   - Active: `bg-primary text-white`
   - Inactive: `text-gray-700`
4. Verify test passes
5. Commit: `feat: highlight active route in mobile menu`

**Dependencies**: Task 2.3 completed
**Validation**: Unit test passes, active route is highlighted

---

### Phase 7: Testing & QA (2-3 hours)

#### Task 7.1: Update existing Navigation tests
**Goal**: Ensure existing tests still pass with new changes

**Steps**:
1. Run all existing Navigation tests
2. Update any tests that break due to responsive changes
3. Ensure desktop navigation tests still pass
4. Add viewport mocking for responsive tests (if needed)
5. Verify all tests pass
6. Commit: `test: update existing Navigation tests for responsive changes`

**Dependencies**: All implementation tasks completed
**Validation**: All unit tests pass (100% of existing tests)

---

#### Task 7.2: Add comprehensive mobile menu tests
**Goal**: Ensure mobile menu functionality is fully tested

**Steps**:
1. Write test: "should open menu when hamburger clicked"
2. Write test: "should close menu when backdrop clicked"
3. Write test: "should close menu when link clicked"
4. Write test: "should close menu when Escape pressed"
5. Write test: "should lock body scroll when menu open"
6. Write test: "should restore scroll when menu closed"
7. Write test: "should trap focus within menu"
8. Verify all new tests pass
9. Commit: `test: add comprehensive mobile menu tests`

**Dependencies**: All implementation tasks completed
**Validation**: New tests pass, coverage maintained at 90%+

---

#### Task 7.3: Manual testing on real devices
**Goal**: Verify mobile navigation works on physical devices

**Test Devices**:
- iPhone (Safari) - iOS 16+
- Android phone (Chrome) - Android 12+
- iPad (Safari) - iPadOS 16+
- Desktop (Chrome, Firefox, Safari)

**Test Scenarios**:
1. Hamburger menu opens/closes smoothly
2. Animations are performant (60fps)
3. Touch targets are easy to tap (no mis-taps)
4. Keyboard navigation works (Tab, Escape, Enter)
5. Screen reader announces menu state (VoiceOver, TalkBack)
6. No layout shifts or visual bugs
7. Viewport rotation adapts correctly

**Validation**: All scenarios pass, no critical issues found

---

#### Task 7.4: Run pre-commit checks
**Goal**: Ensure all quality gates pass before committing final changes

**Steps**:
1. Run `npm run build` - TypeScript compilation must pass
2. Run `npm test` - All unit tests must pass
3. Run `npm run lint` - ESLint must pass with no errors
4. Review code for any TODOs or debug statements
5. Verify no console errors in browser
6. Commit: `chore: final cleanup and quality checks`

**Dependencies**: All tasks completed
**Validation**: Build passes, tests pass, lint passes (zero tolerance)

---

### Phase 8: Documentation & Completion (1 hour)

#### Task 8.1: Update README.md (if needed)
**Goal**: Document any user-facing changes

**Steps**:
1. Check if README mentions navigation behavior
2. Add section on responsive navigation (if relevant)
3. Mention mobile menu pattern
4. Commit: `docs: update README for responsive navigation`

**Dependencies**: All implementation completed
**Validation**: Documentation is clear and accurate

---

#### Task 8.2: Update CHANGELOG.md
**Goal**: Record this feature in the changelog

**Steps**:
1. Add entry to CHANGELOG.md:
   - **Sprint**: Current sprint number
   - **Feature**: Responsive Mobile Navigation
   - **Description**: Added mobile hamburger menu, responsive brand, touch-friendly navigation
   - **User Story**: Link to US-XXX (if exists)
2. Commit: `docs: add responsive navigation to changelog`

**Dependencies**: All implementation completed
**Validation**: Changelog entry is accurate

---

#### Task 8.3: Create final PR and merge
**Goal**: Merge responsive navigation to main branch

**Steps**:
1. Create pull request from feature branch
2. Write clear PR description with:
   - Problem statement
   - Solution summary
   - Screenshots/GIFs (mobile and desktop)
   - Testing performed
3. Self-review code changes
4. Merge PR to main
5. Delete feature branch

**Dependencies**: All tasks completed, all checks passed
**Validation**: PR merged, feature live on main

---

## Task Summary

**Total Tasks**: 19 tasks across 8 phases
**Estimated Effort**: 15-20 hours total
**Critical Path**: Phase 1 → Phase 2 → Phase 3 → Phase 7
**Parallelizable Work**:
- Task 1.2 and 1.3 (Phase 1)
- Task 4.1 (Phase 4) can be done anytime
- Task 3.3 (body scroll lock) can be done earlier

## Validation Checklist

Before marking the change as complete, verify:

- ✅ All 19 tasks completed
- ✅ All unit tests pass (90%+ coverage)
- ✅ Manual testing on real devices completed
- ✅ Pre-commit checks pass (build, test, lint)
- ✅ Documentation updated (README, CHANGELOG)
- ✅ PR merged to main branch
- ✅ No console errors or warnings
- ✅ Accessibility verified (keyboard, screen reader)
- ✅ Animations are smooth (60fps)
- ✅ Touch targets meet iOS guidelines (44px+)

## Rollback Plan

If issues arise after deployment:

1. **Immediate**: Revert merge commit if critical bugs found
2. **Short-term**: Create hotfix branch for specific issues
3. **Long-term**: Iterate on feedback, improve in next sprint

## Notes

- Follow TDD strictly: Red → Green → Refactor for each task
- Commit after each task completion (small, atomic commits)
- Run tests frequently to catch regressions early
- Pause for user feedback after Phase 3 (animations complete)
- Document any deviations from plan in task notes
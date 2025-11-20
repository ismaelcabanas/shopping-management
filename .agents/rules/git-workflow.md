# Git Workflow Rules

This document defines the Git workflow and branching strategy for the project.

## 1. Branching Strategy

### Feature Branches (MANDATORY)

**Rule:** Before starting development on any new feature, you MUST create a new branch following the naming convention:

```
feature/descriptive-feature-name
```

**Examples:**
- `feature/add-product-catalog`
- `feature/shopping-list-generation`
- `feature/price-comparison`
- `feature/user-authentication`

**Process:**
1. Ensure you're on the main branch and it's up to date:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Create and checkout the new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Develop the feature following TDD and other project rules

4. Push the feature branch to remote:
   ```bash
   git push -u origin feature/your-feature-name
   ```

5. Create a Pull Request when ready for review

### Branch Types

The project uses the following branch types:

- **`main`** - Production-ready code. Always stable and deployable.
- **`feature/*`** - New features or enhancements (e.g., `feature/inventory-management`)
- **`fix/*`** - Bug fixes (e.g., `fix/product-deletion-error`)
- **`refactor/*`** - Code refactoring without changing functionality (e.g., `refactor/repository-pattern`)
- **`docs/*`** - Documentation updates (e.g., `docs/update-readme`)
- **`test/*`** - Test improvements or additions (e.g., `test/add-integration-tests`)

### Branch Naming Conventions

- Use lowercase letters
- Use hyphens to separate words (kebab-case)
- Be descriptive but concise
- Avoid generic names like `feature/updates` or `fix/bugs`

**Good examples:**
- `feature/register-purchase`
- `fix/inventory-stock-calculation`
- `refactor/use-case-dependencies`
- `docs/add-architecture-diagrams`

**Bad examples:**
- `feature/new-stuff` (too vague)
- `fix/bug` (not descriptive)
- `feature/Feature_Name` (wrong case/format)
- `my-changes` (no type prefix)

## 2. Working on Features

### Before Starting Work

**AI Agent Checklist:**
1. Confirm you're working on a feature branch (not `main`)
2. If not on a feature branch, ask the user if you should create one
3. Verify the branch name follows the conventions

### During Development

- Make small, focused commits following TDD red-green-refactor cycle
- Run tests before each commit (`npm test` and `npm run build`)
- Keep commits atomic - one logical change per commit
- Write clear commit messages (see Commit Message Guidelines below)

### Completing a Feature

1. Ensure all tests pass
2. Ensure TypeScript builds successfully
3. Push the feature branch to remote
4. Create a Pull Request to `main`
5. Request code review if applicable
6. Address review feedback on the same branch
7. Merge after approval (or merge directly if working solo)

## 3. Commit Message Guidelines

Follow the Conventional Commits format:

```
<type>(<scope>): <short description>

<optional detailed description>

<optional footer>
```

### Commit Types

- **`feat`** - New feature
- **`fix`** - Bug fix
- **`refactor`** - Code refactoring (no functional changes)
- **`test`** - Adding or updating tests
- **`docs`** - Documentation changes
- **`style`** - Code style changes (formatting, missing semicolons, etc.)
- **`chore`** - Maintenance tasks, dependency updates

### Examples

```
feat(inventory): add product deletion functionality

Implement use case and repository method for deleting products
from inventory. Includes validation and error handling.
```

```
fix(purchase): correct total price calculation

Fixed rounding error in purchase total calculation that occurred
when dealing with prices with more than 2 decimal places.
```

```
refactor(domain): extract value objects from Product entity

Extracted ProductId and Money as separate value objects to improve
domain model clarity and type safety.
```

## 4. Pull Request Guidelines

### Creating Pull Requests

- Base all PRs against `main` branch
- Use a descriptive PR title (similar to commit message format)
- Include a summary of changes in the PR description
- Reference related issues if applicable
- Ensure all CI checks pass before requesting review

### PR Title Format

```
<type>: <description>
```

Examples:
- `feat: Add shopping list generation feature`
- `fix: Resolve inventory stock calculation bug`
- `refactor: Improve repository pattern implementation`

### PR Description Template

```markdown
## Summary
- Brief description of what this PR does
- Why this change is needed

## Changes
- List of specific changes made
- Components/files affected

## Testing
- How this was tested
- Test coverage added/updated

## Screenshots (if applicable)
- UI changes screenshots
```

## 5. AI Agent Responsibilities

When working with Git, AI agents MUST:

### Branch Management
- **Never commit directly to `main`** without explicit user permission
- Always verify current branch before committing
- Suggest creating a feature branch if working on `main`
- Use appropriate branch naming conventions

### Before Committing
- Run `npm test` to ensure all tests pass
- Run `npm run build` to ensure TypeScript compiles
- Only commit when both checks pass (zero tolerance)

### Commit Process
- Write clear, descriptive commit messages
- Follow Conventional Commits format
- Include the Claude Code footer
- Stage only relevant files for each commit

### Branch Creation Flow
If the user starts working on a new feature and is on `main`:

1. **Detect**: Notice we're on `main` branch
2. **Ask**: "I notice we're on the main branch. Should I create a feature branch for this work? What would you like to name it (e.g., feature/your-feature-name)?"
3. **Create**: Once confirmed, create and checkout the new branch
4. **Proceed**: Continue with development on the feature branch

## 6. Common Scenarios

### Scenario 1: Starting a New Feature

```bash
# User is on main branch
git checkout main
git pull origin main

# AI agent should suggest:
"I'll create a feature branch for this work: feature/add-inventory-filtering"
git checkout -b feature/add-inventory-filtering

# Proceed with TDD development
```

### Scenario 2: User Forgot to Create Feature Branch

```bash
# User has been working on main with uncommitted changes

# AI agent should:
1. Create the feature branch
git checkout -b feature/appropriate-name

2. Changes automatically come with us to the new branch
3. Proceed with committing on feature branch
```

### Scenario 3: Switching Between Features

```bash
# Save current work
git add .
git commit -m "wip: save progress on feature A"

# Switch to other feature
git checkout feature/other-feature

# Work on other feature...

# Return to previous feature
git checkout feature/feature-a
```

## 7. Quick Reference

**Before every new feature:**
```bash
git checkout main && git pull && git checkout -b feature/name
```

**Before every commit:**
```bash
npm test && npm run build
```

**Commit format:**
```
type(scope): description

Details...
```

**Push feature branch:**
```bash
git push -u origin feature/name
```

## 8. Anti-Patterns to Avoid

❌ **Don't:**
- Commit directly to `main` without a feature branch
- Create branches without type prefixes
- Use vague branch names
- Commit without running tests
- Force push to shared branches
- Mix multiple unrelated changes in one commit

✅ **Do:**
- Always create feature branches
- Use descriptive branch names
- Run tests before committing
- Make atomic commits
- Write clear commit messages
- Keep feature branches focused on one feature
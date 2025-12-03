# Project Context

## Purpose

**Shopping Manager** is an intelligent personal inventory management and purchase optimization system. The application helps users:

- **Manage Personal Inventory**: Track stock levels of frequently purchased products at home
- **Auto-Generate Shopping Lists**: Automatically suggest products to buy based on current stock and consumption patterns
- **Optimize Purchase Prices**: Compare and predict costs across different stores to optimize where to shop
- **Provide Purchase Intelligence**: Analyze price history and consumption patterns for better shopping decisions

**Current Status**: Feature 009 (OCR ticket scanning) completed. Working on Feature 010 (improve product matching algorithm).

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 5.9** (strict mode) - Type safety
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Shadcn/UI** - Component library (headless components)
- **React Router DOM 7** - Client-side routing
- **Zustand 5** - State management
- **React Query** - Server state management
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Testing & Quality
- **Vitest 3** - Unit testing framework
- **@testing-library/react 16** - Component testing utilities
- **Playwright 1.56** - End-to-end testing
- **ESLint 9** + **Prettier 3** - Code quality and formatting
- **jsdom** - DOM testing environment

### External Services
- **Google Gemini Vision API (gemini-2.0-flash)** - OCR for ticket scanning

### Backend (Planned)
- **FastAPI** (Python) - REST API
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **Pytest** - Backend testing

### Storage (Current)
- **LocalStorage** - Client-side data persistence (temporary until backend is built)

## Project Conventions

### Code Style

#### Naming Conventions
- **Files**: PascalCase for components (`ProductCard.tsx`), camelCase for utilities (`productMatcher.ts`)
- **Components**: PascalCase (`ProductCatalogPage`, `RegisterPurchaseModal`)
- **Functions/Variables**: camelCase (`getProductById`, `currentStock`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_QUANTITY`, `DEFAULT_THRESHOLD`)
- **Types/Interfaces**: PascalCase (`Product`, `InventoryItem`, `TicketScanResult`)
- **Test Files**: `.test.ts` or `.test.tsx` suffix (`ProductMatcher.test.ts`)
- **E2E Test Files**: `.spec.ts` suffix in `e2e/` directory

#### Language Standards
- **Code & Artifacts**: English ONLY (code, docs, commits, tests, issues, schemas)
- **Team Communication**: Spanish or English for convenience
- **User-Facing Content**: Spanish (the app is for Spanish users)

#### Formatting
- **Indentation**: 2 spaces
- **Line Length**: 100 characters max (enforced by Prettier)
- **Quotes**: Single quotes for strings
- **Semicolons**: No semicolons (Prettier config)
- **Trailing Commas**: Always (for better diffs)

#### Comments
- **Self-Documenting Code**: Prefer clear names over comments
- **Avoid Superficial Comments**: No Arrange/Act/Assert, obvious code descriptions, or historical references (Git handles history)
- **When to Comment**: Complex algorithms, non-obvious business logic, or architectural decisions only

### Architecture Patterns

#### Clean Architecture + Domain-Driven Design (DDD)

The project follows **Hexagonal Architecture** (Ports & Adapters) with DDD tactical patterns:

```
src/
├── domain/              # Business logic (pure, no dependencies)
│   ├── model/          # Entities, Value Objects, Aggregates
│   ├── services/       # Domain Services
│   └── repositories/   # Repository Interfaces (Ports)
├── application/         # Use Cases (orchestration)
│   ├── use-cases/      # Application services
│   └── dtos/           # Data Transfer Objects
├── infrastructure/      # External concerns (Adapters)
│   ├── repositories/   # Repository Implementations
│   └── services/       # External service adapters
└── presentation/        # UI layer
    ├── pages/          # Route components
    ├── components/     # React components
    └── hooks/          # Custom React hooks
```

#### Dependency Rule
Dependencies **ALWAYS** point inward:
- `presentation` → `application` → `domain`
- `infrastructure` → `application` → `domain`
- **NEVER**: `domain` → anything
- **NEVER**: `application` → `infrastructure` or `presentation`

#### Key DDD Patterns Used
- **Entities**: `Product`, `InventoryItem`, `Purchase` (have identity)
- **Value Objects**: `ProductId`, `Quantity`, `UnitType`, `PurchaseItem` (immutable, no identity)
- **Aggregates**: `Purchase` (with `PurchaseItem`), `InventoryItem`
- **Repositories**: `IProductRepository`, `IInventoryRepository` (ports in domain, adapters in infrastructure)
- **Domain Services**: `ProductMatcher`, `TicketParser` (business logic that doesn't belong to entities)
- **Use Cases**: `GetAllProducts`, `RegisterPurchase`, `ScanTicket` (application orchestration)

#### Component Organization
- **Feature-Based**: Group by domain concept (not by technical layer)
- **Colocation**: Keep related files close (component + test + hook)
- **Shared Components**: Reusable UI components in `presentation/components/shared/`
- **Page Components**: Top-level route components that compose features

#### Custom Hooks Pattern
Every feature should have a custom hook encapsulating:
- State management
- Use case invocation
- Error handling
- Loading states

**Example**: `useProducts()`, `useInventory()`, `useTicketScan()`

**Hook Structure**:
```typescript
export function useFeature() {
  return {
    data: T | null,
    isLoading: boolean,
    error: Error | null,
    refetch: () => Promise<void>
  }
}
```

### Testing Strategy

#### Test-Driven Development (TDD)
**MANDATORY**: Follow Red-Green-Refactor cycle:
1. **Red**: Write failing test first
2. **Green**: Write minimal code to pass test
3. **Refactor**: Improve code while keeping tests green

#### Test Pyramid
- **Many Unit Tests** (domain, use cases, services) - 90% of tests
- **Some Integration Tests** (hooks, components) - 9% of tests
- **Few E2E Tests** (critical user flows) - 1% of tests

#### Coverage Requirements
- **Target**: 90%+ code coverage
- **Minimum**: Never commit code without tests
- **Domain Layer**: 100% coverage required (pure business logic)
- **Application Layer**: 95%+ coverage required
- **Presentation Layer**: 80%+ coverage acceptable

#### Unit Testing (Vitest)
- **Location**: `src/test/` directory (mirrors `src/` structure)
- **Naming**: `[ComponentName].test.ts` or `[ComponentName].test.tsx`
- **Mocking**: Use `vi.mock()` for external dependencies
- **Assertions**: Prefer specific assertions (`toBe`, `toEqual`) over generic ones

#### Component Testing (React Testing Library)
- **User-Centric**: Test behavior, not implementation
- **Queries Priority**: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`
- **Avoid**: Testing internal state, implementation details
- **Focus**: User interactions and visible outcomes

#### E2E Testing (Playwright)
- **Location**: `e2e/` directory in webapp root
- **Naming**: `[feature].spec.ts` (e.g., `us-008-register-purchase.spec.ts`)
- **Scope**: Critical user paths only (happy paths + major error cases)
- **Data**: Use mock data, avoid real API calls
- **Environment Variables**: Mock in `playwright.config.ts` (see OCR example)

#### Pre-Commit Validation (MANDATORY)
**Zero tolerance for failures**. Before EVERY commit, run:
```bash
npm run build    # TypeScript compilation
npm test         # Unit tests
npm run lint     # ESLint
```

All must pass. No exceptions.

### Git Workflow

#### Branching Strategy
- **main**: Production-ready code (protected)
- **feature/[name]**: Feature branches (e.g., `feature/ticket-scan-ocr-2`)
- **hotfix/[name]**: Urgent production fixes
- **Naming**: kebab-case, descriptive (e.g., `feature/improve-product-matching`)

#### Commit Message Format
```
<type>: <subject>

[optional body]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Rules**:
- Subject: Imperative mood, lowercase, no period, <50 chars
- Body: Wrap at 72 chars, explain *what* and *why* (not *how*)
- Include Claude attribution footer (when AI-assisted)

#### Pull Request Process
1. Create feature branch from `main`
2. Implement feature with TDD
3. Run pre-commit checks (build + test + lint)
4. Create PR with clear description
5. Request review (if team)
6. Merge after approval

#### Never Commit
- `node_modules/`
- `.env` (use `.env.example` as template)
- IDE-specific files (`.vscode/`, `.idea/`)
- Build artifacts (`dist/`, `build/`)
- Test coverage reports
- API keys or secrets

## Domain Context

### Ubiquitous Language

#### Core Concepts
- **Product**: Item that can be purchased (e.g., "Milk", "Bread")
- **Inventory Item**: Product + current stock quantity + metadata
- **Stock**: Current quantity of a product at home
- **Minimum Stock**: Threshold to trigger "need to buy" alert
- **Unit Type**: Measurement unit (kg, liters, units)
- **Purchase**: Transaction recording products bought
- **Shopping List**: Generated list of products to buy
- **Store**: Physical store where products are purchased
- **Ticket**: Receipt from a purchase (paper or digital)
- **OCR**: Optical Character Recognition (extracting text from ticket images)
- **Matching**: Linking ticket products to catalog products (normalization)

#### Domain Rules
- A Product can exist in catalog without inventory (not yet purchased)
- An InventoryItem must reference an existing Product
- Stock cannot be negative (business invariant)
- A Purchase must have at least one PurchaseItem
- Ticket scanning creates unmatched products if not found in catalog
- Product matching uses fuzzy algorithm (similarity threshold)

### Current Implementation State

#### Completed Features (Sprint 1-5)
- ✅ Product CRUD (create, read, update, delete)
- ✅ Inventory management
- ✅ Product catalog view with stock
- ✅ Manual purchase registration
- ✅ Ticket OCR scanning (Gemini Vision API)
- ✅ Automatic product extraction from tickets

#### Known Issues
- ❌ **Product Matching Algorithm**: Current threshold (80%) too strict
  - "PLATANO GABECERAS CANARIO" doesn't match "Plátanos" → creates duplicate
  - "TOMATE ROJO RAMA" doesn't match "Tomates" → creates duplicate
  - Singular/plural mismatch
  - Brand names prevent matching
  - **Impact**: Catalog gets polluted with duplicates

#### Next Priorities (Sprint 6)
- 🔴 **US-010**: Fix product matching algorithm (CRITICAL)
- 🔴 **US-011**: Register product consumption
- 🔴 **US-013**: Low stock alerts
- 🔴 **US-014**: Auto-generate shopping list

### Business Constraints

#### User Context
- **Target User**: Individual managing home grocery inventory
- **Primary Language**: Spanish (Spain)
- **Typical Catalog Size**: 20-30 products (static, frequently repeated)
- **Usage Pattern**: Scan ticket after shopping, track consumption at home

#### Functional Constraints
- Inventory is **per-household**, not multi-user
- No multi-tenancy (single user system for now)
- Products are groceries/consumables (not durable goods)
- Focus on **consumption tracking**, not financial accounting

#### Technical Constraints
- Frontend-only for now (no backend yet)
- LocalStorage has ~5-10MB limit
- OCR requires internet connection (Gemini API)
- Free tier limits: 60 requests/minute (Gemini)

## Important Constraints

### Performance
- OCR processing: <10 seconds target (currently 2-4s ✅)
- UI interactions: <200ms response time
- Initial page load: <2 seconds

### Security
- **API Keys**: NEVER commit to Git
  - Use `.env` file (gitignored)
  - Provide `.env.example` template
  - Document in README-SETUP.md
- **VITE env vars**: Prefix with `VITE_` for client exposure
- **Secrets**: Rotate keys if accidentally exposed

### Accessibility
- WCAG 2.1 Level AA compliance (target)
- Keyboard navigation for all features
- Screen reader compatible (use semantic HTML)
- Color contrast ratios ≥4.5:1

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## External Dependencies

### Google Gemini Vision API
- **Purpose**: OCR for ticket scanning
- **Model**: `gemini-2.0-flash-exp`
- **Free Tier**: 60 requests/minute (sufficient for personal use)
- **Input**: Image file (JPG, PNG, HEIC) up to 10MB
- **Output**: Structured text (pipe-separated format: `product | quantity`)
- **API Key**: Required, stored in `VITE_GEMINI_API_KEY`
- **Setup**: https://makersuite.google.com/app/apikey
- **Fallback**: `MockOCRService` for tests (no API key needed)

### Alternative OCR Providers (Documented but NOT Recommended)
- **Ollama (llava)**: ⚠️ NOT RECOMMENDED
  - Reason: Infinite output loops, hallucinations, privacy rejections
  - Status: Available as fallback but marked as unreliable
- **Tesseract.js**: Future consideration for offline mode

### Development Tools
- **Node.js**: v20+ required
- **npm**: v10+ required
- **Git**: v2.40+ required

## Project-Specific Conventions

### Folder Naming
- **Flat Structure**: Avoid deep nesting (max 3 levels in `src/`)
- **Domain-First**: Organize by domain concept, not technical layer
- **Colocation**: Keep tests near implementation

### File Size Limits
- **Components**: <200 lines (split if larger)
- **Functions**: <20 lines ideal, <50 lines max
- **Test Files**: Can exceed limits (each test is independent)

### Import Organization
```typescript
// 1. External dependencies
import { useState } from 'react'
import { toast } from 'react-hot-toast'

// 2. Internal absolute imports (domain → application → infrastructure)
import { Product } from '../../domain/model/Product'
import { GetAllProducts } from '../../application/use-cases/GetAllProducts'

// 3. Relative imports (same layer)
import { ProductCard } from './ProductCard'

// 4. Types (if separated)
import type { ProductDTO } from './types'
```

### Error Handling
- **User-Facing Errors**: Use toast notifications (react-hot-toast)
- **Developer Errors**: Console.error() with context
- **Async Errors**: Always use try-catch in hooks/components
- **Domain Errors**: Throw custom errors with clear messages

### State Management
- **Local State**: useState for component-specific state
- **Shared State**: Zustand for cross-component state (minimal usage)
- **Server State**: React Query for API data (future)
- **Form State**: Controlled components with React state

### Baby Steps Philosophy
- **One Change at a Time**: Never implement multiple features simultaneously
- **Incremental Commits**: Commit after each passing test
- **Progressive Revelation**: Show code step-by-step, not all at once
- **Question Assumptions**: Always clarify before proceeding
# Migration Guide: UI Feedback Components

This guide helps migrate existing inline implementations to the new standardized feedback components.

## Table of Contents

- [EmptyState Migration](#emptystate-migration)
- [Badge Migration](#badge-migration)
- [Skeleton Migration](#skeleton-migration)
- [Alert Migration](#alert-migration)
- [ErrorBoundary Integration](#errorboundary-integration)

---

## EmptyState Migration

### Before: Inline Empty State

```tsx
// OLD: Inline implementation in ProductList.tsx
function EmptyState() {
  return (
    <div data-testid="empty-state" className="text-center py-12 px-4">
      <div data-testid="empty-state-icon" className="text-6xl mb-4">
        📦
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No hay productos en tu despensa
      </h3>
      <p className="text-gray-500">
        Añade tu primer producto pulsando el botón +
      </p>
    </div>
  )
}

// Usage
if (products.length === 0) {
  return <EmptyState />
}
```

### After: Shared EmptyState Component

```tsx
// NEW: Import shared component
import { EmptyState } from '../shared/components/EmptyState'

// Usage
if (products.length === 0) {
  return (
    <EmptyState
      title="No hay productos en tu despensa"
      description="Añade tu primer producto pulsando el botón +"
      icon={<span data-testid="empty-state-icon" className="text-6xl">📦</span>}
      data-testid="empty-state"
    />
  )
}
```

### Benefits
- ✅ Consistent styling across app
- ✅ Built-in accessibility (role="status", aria-live="polite")
- ✅ Size variants (compact, default, large)
- ✅ Optional action button support
- ✅ 15 lines removed per usage

### Size Variants

```tsx
// Compact for sidebars
<EmptyState
  title="No items"
  icon="📭"
  size="compact"
/>

// Large for hero sections
<EmptyState
  title="Welcome to Shopping Manager"
  description="Start by adding your first product"
  icon={<LayoutDashboard className="w-16 h-16" />}
  size="large"
  action={{ label: "Add Product", onClick: () => navigate('/add') }}
/>
```

---

## Badge Migration

### Before: Inline Badge Styling

```tsx
// OLD: Inline badge generation in ShoppingListView.tsx
const getStockLevelBadge = (stockLevel?: string) => {
  if (!stockLevel) return null

  const badges = {
    low: { text: 'Stock bajo', color: 'bg-yellow-100 text-yellow-800' },
    empty: { text: 'Sin stock', color: 'bg-red-100 text-red-800' }
  }

  const badge = badges[stockLevel as keyof typeof badges]
  if (!badge) return null

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>
      {badge.text}
    </span>
  )
}

// Usage
{getStockLevelBadge(item.stockLevel)}
```

### After: Shared Badge Component

```tsx
// NEW: Import shared component
import { Badge } from '../shared/components/Badge'

const getStockLevelBadge = (stockLevel?: string) => {
  if (!stockLevel) return null

  const badgeConfig = {
    low: { text: 'Stock bajo', variant: 'warning' as const },
    empty: { text: 'Sin stock', variant: 'danger' as const }
  }

  const config = badgeConfig[stockLevel as keyof typeof badgeConfig]
  if (!config) return null

  return (
    <Badge variant={config.variant} size="sm">
      {config.text}
    </Badge>
  )
}

// Usage
{getStockLevelBadge(item.stockLevel)}
```

### Benefits
- ✅ Semantic color variants (warning, danger, success, info, etc.)
- ✅ Consistent sizing (sm, md, lg)
- ✅ Icon support built-in
- ✅ Pill style option
- ✅ Easier to maintain globally

### Color Variant Mapping

```tsx
// Stock levels
'low' → variant="warning"    // Yellow
'empty' → variant="danger"   // Red
'high' → variant="success"   // Green

// Status indicators
'active' → variant="success"
'pending' → variant="warning"
'failed' → variant="danger"
'info' → variant="info"
```

---

## Skeleton Migration

### Before: Inline Skeleton Loader

```tsx
// OLD: Custom skeleton in ProductList.tsx
function SkeletonLoader() {
  return (
    <div
      data-testid="skeleton-loader"
      className="bg-white border border-gray-200 rounded-lg py-4 px-4 shadow-sm animate-pulse"
      style={{ minHeight: '60px' }}
    >
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  )
}

// Usage
if (isLoading) {
  return (
    <div className="space-y-3">
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
    </div>
  )
}
```

### After: Shared Skeleton Component

```tsx
// NEW: Import shared component
import { Skeleton } from '../shared/components/Skeleton'

// Usage
if (isLoading) {
  return (
    <div className="space-y-3">
      <Skeleton
        variant="card"
        height="60px"
        data-testid="skeleton-loader"
      />
      <Skeleton
        variant="card"
        height="60px"
        data-testid="skeleton-loader"
      />
      <Skeleton
        variant="card"
        height="60px"
        data-testid="skeleton-loader"
      />
    </div>
  )
}
```

### Even Better: Use count parameter

```tsx
// Cleaner with count
if (isLoading) {
  return (
    <div className="space-y-3">
      <Skeleton variant="card" height="60px" count={3} />
    </div>
  )
}
```

### Benefits
- ✅ Predefined variants (text, card, avatar, button, custom)
- ✅ Count parameter for multiple skeletons
- ✅ Consistent pulse animation
- ✅ Built-in accessibility (aria-busy, aria-label)
- ✅ 14 lines removed per skeleton

### Variant Usage

```tsx
// Text lines
<Skeleton variant="text" count={3} />

// Avatar circles
<Skeleton variant="avatar" />

// Button shapes
<Skeleton variant="button" />

// Custom dimensions
<Skeleton variant="custom" width="200px" height="100px" />
```

---

## Alert Migration

### Before: Toast-only Feedback

```tsx
// OLD: Temporary toast for persistent issues
const getOCRService = () => {
  try {
    return OCRServiceFactory.create()
  } catch (error) {
    console.error('Failed to initialize OCR service:', error)
    toast.error('No se pudo inicializar el servicio OCR. Verifica la configuración de la API key.')
    return null
  }
}
```

### After: Persistent Alert

```tsx
// NEW: Persistent Alert component
import { Alert } from '../shared/components/Alert'

// In component state
const [showOCRWarning, setShowOCRWarning] = useState(false)
const [ocrWarningMessage, setOcrWarningMessage] = useState('')

// Check on mount
useEffect(() => {
  try {
    OCRServiceFactory.create()
    setShowOCRWarning(false)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error de configuración OCR'
    setOcrWarningMessage(message)
    setShowOCRWarning(true)
  }
}, [])

// In JSX
{showOCRWarning && (
  <Alert
    variant="warning"
    title="Configuración OCR incompleta"
    closable
    onClose={() => setShowOCRWarning(false)}
  >
    {ocrWarningMessage}. La función de escanear tickets no estará disponible hasta que se configure correctamente.
  </Alert>
)}
```

### Benefits
- ✅ Persistent visibility (not auto-dismissed like toasts)
- ✅ User can dismiss when ready
- ✅ 4 semantic variants (info, success, warning, error)
- ✅ Auto icon selection
- ✅ Better for important information

### When to Use Alert vs Toast

| Use Alert When | Use Toast When |
|---------------|----------------|
| Configuration issues | Action confirmations |
| Missing API keys | Save success |
| Important warnings | Temporary errors |
| Persistent notices | Quick feedback |
| User needs time to read | Brief acknowledgments |

---

## ErrorBoundary Integration

### Before: No Error Catching

```tsx
// OLD: Routes without error handling
<BrowserRouter>
  <Navigation />
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/catalog" element={<ProductCatalogPage />} />
  </Routes>
</BrowserRouter>
```

### After: Wrapped with ErrorBoundary

```tsx
// NEW: App-level error catching
import { ErrorBoundary } from './presentation/shared/components/ErrorBoundary'

<BrowserRouter>
  <Navigation />
  <ErrorBoundary onError={(error) => console.error('App error:', error)}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<ProductCatalogPage />} />
    </Routes>
  </ErrorBoundary>
</BrowserRouter>
```

### Benefits
- ✅ Prevents white screen crashes
- ✅ Shows user-friendly error message
- ✅ Retry button for recovery
- ✅ Error logging capability
- ✅ Graceful degradation

### Error Handling Patterns

```tsx
// 1. App-level boundary (catch all)
<ErrorBoundary onError={logToMonitoring}>
  <App />
</ErrorBoundary>

// 2. Feature-level boundaries
<ErrorBoundary fallback={<CustomErrorUI />}>
  <ComplexFeature />
</ErrorBoundary>

// 3. With useErrorHandler hook
const { handleError } = useErrorHandler()

try {
  await fetchData()
} catch (error) {
  handleError(error, 'Failed to load data')
}
```

---

## Common Gotchas

### 1. Test IDs Preservation

When migrating, ensure test IDs are preserved:

```tsx
// Preserve data-testid for existing tests
<EmptyState
  title="No products"
  icon={<span data-testid="empty-state-icon">📦</span>}
  data-testid="empty-state"  // Add this if tests expect it
/>
```

### 2. Icon Types

EmptyState accepts both emoji strings and React elements:

```tsx
// Emoji string (simple)
<EmptyState icon="📦" />

// Lucide icon (recommended for consistency)
<EmptyState icon={<Package className="w-16 h-16" />} />
```

### 3. Badge Sizing

Match badge size to context:

```tsx
// In lists (small)
<Badge variant="warning" size="sm">Low</Badge>

// In headers (medium - default)
<Badge variant="primary">Premium</Badge>

// In hero sections (large)
<Badge variant="success" size="lg">Active</Badge>
```

### 4. Skeleton Count

Use count parameter instead of repeating components:

```tsx
// ❌ Don't repeat
<Skeleton variant="text" />
<Skeleton variant="text" />
<Skeleton variant="text" />

// ✅ Use count
<Skeleton variant="text" count={3} />
```

---

## Migration Checklist

When migrating a component:

- [ ] Import shared component
- [ ] Remove inline implementation
- [ ] Update props to match new API
- [ ] Preserve test IDs if tests exist
- [ ] Run tests to verify behavior
- [ ] Check visual appearance in browser
- [ ] Update any related documentation
- [ ] Commit with descriptive message

---

## Questions?

See the JSDoc documentation in each component file for detailed API documentation and more examples.

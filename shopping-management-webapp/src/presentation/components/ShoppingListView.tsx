import { cn } from '../../lib/utils'
import { Badge } from '../shared/components/Badge'
import { EmptyState } from '../shared/components/EmptyState'
import type { ProductId } from '../../domain/model/ProductId'
import type { ShoppingListItemWithDetails } from '../hooks/useShoppingList'

interface ShoppingListViewProps {
  items: ShoppingListItemWithDetails[]
  readonly: boolean
  onToggleChecked?: (productId: ProductId) => void
}

export function ShoppingListView({ items, readonly, onToggleChecked }: ShoppingListViewProps) {
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

  if (items.length === 0) {
    return (
      <EmptyState
        title="No hay productos en la lista de compras"
        description="Los productos con stock bajo se agregarán automáticamente"
        icon="🛒"
        size="compact"
      />
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b">
        <p className="text-sm text-gray-600">
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>
      <ul className="divide-y">
        {items.map((item) => (
          <li
            key={item.productId.value}
            className="px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Checkbox - only show if not readonly */}
              {!readonly && (
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => onToggleChecked?.(item.productId)}
                  className="w-5 h-5 min-w-[44px] min-h-[44px] cursor-pointer rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label={`Marcar ${item.productName} como comprado`}
                />
              )}

              {/* Product info with conditional styling */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    className={cn(
                      "text-lg font-medium text-gray-900",
                      !readonly && item.checked && "line-through opacity-60"
                    )}
                  >
                    {item.productName}
                  </h3>
                  {/* Badge always visible (opacity-100) */}
                  <span className="opacity-100">
                    {getStockLevelBadge(item.stockLevel)}
                  </span>
                </div>
                {item.stockLevel && (
                  <p
                    className={cn(
                      "text-sm text-gray-500 mt-1",
                      !readonly && item.checked && "opacity-60"
                    )}
                  >
                    Agregado automáticamente
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

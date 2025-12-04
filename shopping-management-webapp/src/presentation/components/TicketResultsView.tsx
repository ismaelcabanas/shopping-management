import { useState } from 'react'
import { CheckCircle, AlertCircle, XCircle, Trash2 } from 'lucide-react'
import { Button } from '../shared/components/Button'
import type { MatchedDetectedItem } from '../../application/dtos/TicketScanResult'

interface TicketResultsViewProps {
  items: MatchedDetectedItem[]
  onConfirm: (items: MatchedDetectedItem[]) => void
  onCancel: () => void
}

export function TicketResultsView({ items, onConfirm, onCancel }: TicketResultsViewProps) {
  const [displayedItems, setDisplayedItems] = useState<MatchedDetectedItem[]>(items)
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'low-confidence':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'unmatched':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getDisplayName = (item: MatchedDetectedItem) => {
    if (item.status === 'matched' || item.status === 'low-confidence') {
      return item.matchedProductName
    }
    return item.productName
  }

  const handleRemoveItem = (itemId: string) => {
    setDisplayedItems(displayedItems.filter(item => item.id !== itemId))
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Productos Detectados ({displayedItems.length})
        </h3>
        <p className="text-sm text-gray-500">
          Revisa y confirma los productos detectados en el ticket
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-2">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            data-status={item.status}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex-shrink-0">{getStatusIcon(item.status)}</div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {getDisplayName(item)}
              </p>
              {item.status === 'low-confidence' && (
                <p className="text-xs text-yellow-600">
                  Confianza baja - Verificar
                </p>
              )}
              {item.status === 'unmatched' && (
                <p className="text-xs text-red-600">
                  No encontrado en catálogo
                </p>
              )}
            </div>

            <div className="flex-shrink-0 text-sm font-semibold text-gray-700">
              {item.quantity}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(item.id)}
              className="text-danger hover:text-danger-hover flex-shrink-0"
              aria-label="Eliminar producto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onCancel} fullWidth>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={() => onConfirm(displayedItems)}
          fullWidth
          disabled={displayedItems.length === 0}
        >
          Confirmar
        </Button>
      </div>
    </div>
  )
}

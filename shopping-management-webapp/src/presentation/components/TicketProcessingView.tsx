import { Loader2 } from 'lucide-react'

export function TicketProcessingView() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4" data-testid="ticket-processing-view">
      <Loader2
        className="w-16 h-16 text-primary animate-spin"
        data-testid="loading-spinner"
      />

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Procesando Ticket
        </h3>
        <p className="text-sm text-gray-500">
          Analizando la imagen y extrayendo productos...
        </p>
      </div>
    </div>
  )
}

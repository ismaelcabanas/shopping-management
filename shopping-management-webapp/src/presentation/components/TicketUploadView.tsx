import { Upload } from 'lucide-react'
import { Button } from '../shared/components/Button'

interface TicketUploadViewProps {
  onFileSelect: (file: File) => void
}

export function TicketUploadView({ onFileSelect }: TicketUploadViewProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4" data-testid="ticket-upload-view">
      <Upload className="w-16 h-16 text-gray-400" />

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Escanear Ticket de Compra
        </h3>
        <p className="text-sm text-gray-500">
          Selecciona una imagen del ticket para extraer los productos automáticamente
        </p>
      </div>

      <input
        id="ticket-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Selecciona una imagen del ticket"
      />
      <label htmlFor="ticket-upload">
        <Button variant="primary" type="button">
          Seleccionar Imagen
        </Button>
      </label>

      <p className="text-xs text-gray-400">
        Formatos soportados: JPG, PNG (máx. 10MB)
      </p>
    </div>
  )
}

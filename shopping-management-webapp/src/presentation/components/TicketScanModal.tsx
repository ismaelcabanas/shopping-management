import { Modal } from '../shared/components/Modal'
import type { MatchedDetectedItem } from '../../application/dtos/TicketScanResult'

interface TicketScanModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (items: MatchedDetectedItem[]) => void
}

export function TicketScanModal({ isOpen, onClose }: TicketScanModalProps) {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Escanear Ticket">
      <div className="p-4">
        <p>Funcionalidad de escaneo de ticket</p>
      </div>
    </Modal>
  )
}

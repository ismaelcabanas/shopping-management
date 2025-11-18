import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

export interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  variant?: 'danger' | 'warning' | 'info'
  confirmText?: string
  cancelText?: string
  loading?: boolean
  defaultFocus?: 'confirm' | 'cancel'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  variant = 'danger',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  defaultFocus = 'confirm',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-danger',
      iconBg: 'bg-danger-light/10',
      buttonVariant: 'danger' as const,
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-warning',
      iconBg: 'bg-warning-light/10',
      buttonVariant: 'primary' as const, // warning button uses warning bg
    },
    info: {
      icon: Info,
      iconColor: 'text-primary',
      iconBg: 'bg-primary-light/10',
      buttonVariant: 'primary' as const,
    },
  }

  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      closeOnBackdropClick={false} // Prevent accidental dismissal
      closeOnEscape={true}
      focusTrap={true}
      ariaLabel={title}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            fullWidth
            onClick={onCancel}
            disabled={loading}
            data-autofocus={defaultFocus === 'cancel' ? true : undefined}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'warning' ? 'primary' : config.buttonVariant}
            fullWidth
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className={variant === 'warning' ? 'bg-warning hover:bg-warning-hover' : ''}
            data-autofocus={defaultFocus === 'confirm' ? true : undefined}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
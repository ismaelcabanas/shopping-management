import { type ReactNode, useEffect, useRef, useId } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  ariaLabel?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnEscape?: boolean
  closeOnBackdropClick?: boolean
  focusTrap?: boolean
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  ariaLabel,
  size = 'md',
  showCloseButton = false,
  closeOnEscape = true,
  closeOnBackdropClick = true,
  focusTrap = true,
  className = '',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const titleId = useId()

  // Store the previously focused element
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen || !focusTrap || !dialogRef.current) return

    const dialog = dialogRef.current
    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    // Try to find element with data-autofocus attribute
    const autoFocusElement = dialog.querySelector<HTMLElement>('[data-autofocus]')
    const elementToFocus = autoFocusElement || firstFocusable

    // Set initial focus
    if (elementToFocus) {
      elementToFocus.focus()
    }

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        // Shift + Tab: move backwards
        if (document.activeElement === firstFocusable) {
          event.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        // Tab: move forwards
        if (document.activeElement === lastFocusable) {
          event.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    dialog.addEventListener('keydown', handleTabKey)

    return () => {
      dialog.removeEventListener('keydown', handleTabKey)
    }
  }, [isOpen, focusTrap])

  // Restore focus when modal closes
  useEffect(() => {
    if (!isOpen && previousActiveElement.current) {
      previousActiveElement.current.focus()
      previousActiveElement.current = null
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  const ariaProps = ariaLabel
    ? { 'aria-label': ariaLabel }
    : title
      ? { 'aria-labelledby': `modal-title-${titleId}` }
      : {}

  const modalContent = (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4 animate-fade-in"
      data-testid="modal-backdrop"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        {...ariaProps}
        className={`
          relative bg-white rounded-lg shadow-2xl w-full
          ${sizeClasses[size]}
          animate-scale-in
          transition-all
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with title and close button */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2
                id={`modal-title-${titleId}`}
                className="text-xl font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="ml-auto p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
import type { HTMLAttributes, ReactNode } from 'react'
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'

/**
 * Props for Alert component
 */
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /** Variant type - determines color scheme and default icon */
  variant?: 'info' | 'success' | 'warning' | 'error'
  /** Optional title */
  title?: string
  /** Alert content */
  children: ReactNode
  /** Custom icon - set to null to hide icon, undefined for auto icon based on variant */
  icon?: ReactNode | null
  /** Show close button */
  closable?: boolean
  /** Close handler - required when closable is true */
  onClose?: () => void
  /** Full width - spans entire container width */
  fullWidth?: boolean
}

/**
 * Alert component displays persistent inline messages for important information.
 *
 * Use for persistent feedback that complements temporary toast notifications.
 * Suitable for warnings, errors, informational messages, and success confirmations
 * that need to remain visible until user dismisses them.
 *
 * @example
 * ```tsx
 * // Info alert with auto icon
 * <Alert variant="info" title="New Feature">
 *   Check out our new dashboard analytics!
 * </Alert>
 *
 * // Warning alert with close button
 * <Alert
 *   variant="warning"
 *   title="API Key Missing"
 *   closable
 *   onClose={() => setShowAlert(false)}
 * >
 *   Configure your API key to enable OCR features.
 * </Alert>
 *
 * // Error alert without icon
 * <Alert variant="error" icon={null}>
 *   Failed to save changes. Please try again.
 * </Alert>
 * ```
 *
 * @accessibility
 * - Uses role="alert" for immediate screen reader announcements
 * - aria-live="assertive" for high-priority messages
 * - Close button includes aria-label
 * - WCAG 2.1 Level AA compliant
 */
export function Alert({
  variant = 'info',
  title,
  children,
  icon,
  closable = false,
  onClose,
  fullWidth = false,
  className = '',
  ...props
}: AlertProps) {
  const variantStyles = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: 'text-blue-500',
      title: 'text-blue-900',
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-900',
      icon: 'text-green-500',
      title: 'text-green-900',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      icon: 'text-yellow-500',
      title: 'text-yellow-900',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-900',
      icon: 'text-red-500',
      title: 'text-red-900',
    },
  }

  const styles = variantStyles[variant]

  // Auto icon selection based on variant
  const defaultIcons = {
    info: <Info className="w-5 h-5" data-testid="alert-icon" />,
    success: <CheckCircle className="w-5 h-5" data-testid="alert-icon" />,
    warning: <AlertTriangle className="w-5 h-5" data-testid="alert-icon" />,
    error: <XCircle className="w-5 h-5" data-testid="alert-icon" />,
  }

  // Determine which icon to show
  const showIcon = icon !== null
  const displayIcon = icon !== undefined ? icon : defaultIcons[variant]

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        rounded-lg border p-4
        ${styles.container}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="flex gap-3">
        {/* Icon */}
        {showIcon && (
          <div className={`flex-shrink-0 ${styles.icon}`}>
            {displayIcon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-semibold mb-1 ${styles.title}`}>
              {title}
            </h4>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>

        {/* Close Button */}
        {closable && onClose && (
          <button
            onClick={onClose}
            className={`
              flex-shrink-0 rounded-md p-1
              hover:bg-black/5
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
              ${styles.icon}
            `}
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

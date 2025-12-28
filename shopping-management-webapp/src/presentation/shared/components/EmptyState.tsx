import type { HTMLAttributes, ReactNode } from 'react'
import { Button } from './Button'

export interface EmptyStateAction {
  label: string
  onClick: () => void
}

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Main title text */
  title: string
  /** Optional description text */
  description?: string
  /** Optional icon - can be emoji string or React element (Lucide icon) */
  icon?: string | ReactNode
  /** Optional action button */
  action?: EmptyStateAction
  /** Size variant */
  size?: 'compact' | 'default' | 'large'
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  size = 'default',
  className = '',
  ...props
}: EmptyStateProps) {
  const sizeStyles = {
    compact: {
      container: 'py-8',
      icon: 'text-4xl mb-3',
      title: 'text-lg',
      description: 'text-sm',
      gap: 'space-y-2',
    },
    default: {
      container: 'py-12',
      icon: 'text-6xl mb-4',
      title: 'text-2xl',
      description: 'text-base',
      gap: 'space-y-3',
    },
    large: {
      container: 'py-16',
      icon: 'text-7xl mb-6',
      title: 'text-3xl',
      description: 'text-lg',
      gap: 'space-y-4',
    },
  }

  const styles = sizeStyles[size]

  const isEmoji = typeof icon === 'string'

  return (
    <div
      role="status"
      aria-live="polite"
      className={`text-center ${styles.container} ${className}`}
      {...props}
    >
      <div className={`flex flex-col items-center ${styles.gap}`}>
        {/* Icon */}
        {icon && (
          <div className="flex justify-center">
            {isEmoji ? (
              <span className={styles.icon} aria-hidden="true">
                {icon}
              </span>
            ) : (
              <div className={`${styles.icon} text-gray-400`} aria-hidden="true">
                {icon}
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className={`font-semibold text-gray-900 ${styles.title}`}>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className={`text-gray-600 max-w-md ${styles.description}`}>
            {description}
          </p>
        )}

        {/* Action Button */}
        {action && (
          <div className="mt-2">
            <Button variant="primary" onClick={action.onClick}>
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

import type { HTMLAttributes, ReactNode } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Badge variant/color */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Badge size */
  size?: 'sm' | 'md' | 'lg'
  /** Optional icon */
  icon?: ReactNode
  /** Pill style (fully rounded) */
  pill?: boolean
  /** Badge content */
  children: ReactNode
}

export function Badge({
  variant = 'default',
  size = 'md',
  icon,
  pill = false,
  children,
  className = '',
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  }

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium
        ${pill ? 'rounded-full' : 'rounded-md'}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {icon ? (
        <span className="flex items-center gap-1">
          <span className={iconSizes[size]}>{icon}</span>
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </span>
  )
}

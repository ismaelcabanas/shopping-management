import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive'
  children: ReactNode
}

export function Card({
  variant = 'default',
  children,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'bg-white rounded-lg p-4 transition-shadow'

  const variantStyles = {
    default: 'shadow-card',
    interactive: 'shadow-card hover:shadow-card-hover cursor-pointer active:shadow-card-active',
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
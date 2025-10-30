import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary disabled:opacity-60',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 disabled:opacity-60',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400 disabled:opacity-60',
    danger: 'bg-danger text-white hover:bg-danger-hover focus:ring-danger disabled:opacity-60',
  }

  const sizeStyles = {
    sm: 'py-2 px-4 text-sm min-h-touch',
    md: 'py-3 px-6 text-base min-h-touch',
    lg: 'py-4 px-8 text-lg min-h-touch-lg',
  }

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Cargando...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}
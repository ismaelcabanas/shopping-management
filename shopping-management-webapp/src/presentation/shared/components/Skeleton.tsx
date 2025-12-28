import type { HTMLAttributes } from 'react'

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Skeleton variant */
  variant?: 'text' | 'card' | 'avatar' | 'button' | 'custom'
  /** Custom width */
  width?: string
  /** Custom height */
  height?: string
  /** Number of skeleton items to render */
  count?: number
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 w-4/5 rounded',
    card: 'h-32 w-full rounded-lg',
    avatar: 'w-12 h-12 rounded-full',
    button: 'h-10 w-24 rounded-lg',
    custom: 'w-full h-4 rounded',
  }

  const skeletonStyles = variantStyles[variant]

  const customStyles = {
    ...(width && { width }),
    ...(height && { height }),
    ...style,
  }

  const renderSkeleton = (index: number) => (
    <div
      key={index}
      className={`
        bg-gray-200
        animate-pulse
        ${skeletonStyles}
        ${className}
      `}
      style={customStyles}
      aria-busy="true"
      aria-label="Loading..."
      {...props}
    />
  )

  if (count === 1) {
    return renderSkeleton(0)
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </div>
  )
}

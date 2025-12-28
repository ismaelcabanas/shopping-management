import type { HTMLAttributes } from 'react'

/**
 * Props for Skeleton component
 */
export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Skeleton variant - predefined shapes for common use cases */
  variant?: 'text' | 'card' | 'avatar' | 'button' | 'custom'
  /** Custom width - overrides variant default */
  width?: string
  /** Custom height - overrides variant default */
  height?: string
  /** Number of skeleton items to render */
  count?: number
}

/**
 * Skeleton component displays loading placeholders during async operations.
 *
 * Provides better UX than spinners by showing approximate content layout.
 * Includes predefined variants for common UI patterns and custom dimensions support.
 *
 * @example
 * ```tsx
 * // Text skeleton (default)
 * <Skeleton variant="text" />
 *
 * // Multiple card skeletons
 * <Skeleton variant="card" count={3} />
 *
 * // Avatar skeleton
 * <Skeleton variant="avatar" />
 *
 * // Custom dimensions
 * <Skeleton variant="custom" width="200px" height="60px" />
 * ```
 *
 * @accessibility
 * - Uses aria-busy="true" during loading state
 * - Includes aria-label for screen readers
 * - Pulse animation provides visual feedback
 * - WCAG 2.1 Level AA compliant
 */
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

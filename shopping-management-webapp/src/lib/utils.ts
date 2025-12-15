/**
 * Utility function to merge classnames conditionally
 * Simple implementation without external dependencies
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

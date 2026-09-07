export type IconButtonVariant = 'secondary' | 'danger'

const variantClasses: Record<IconButtonVariant, string> = {
  secondary: 'border border-primary text-primary hover:bg-primary/5',
  danger: 'border border-red-600 text-red-600 hover:bg-red-50',
}

export function iconButtonClassName(variant: IconButtonVariant = 'secondary', className = '') {
  return `inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`
}

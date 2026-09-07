import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { iconButtonClassName, type IconButtonVariant } from '@/lib/icon-button-class'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  variant?: IconButtonVariant
}

function IconButton({ icon, label, variant = 'secondary', className = '', ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={iconButtonClassName(variant, className)}
      {...props}
    >
      {icon}
    </button>
  )
}

export default IconButton

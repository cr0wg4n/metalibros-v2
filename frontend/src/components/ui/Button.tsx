import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-none bg-gradient-to-br from-secondary to-primary text-white hover:scale-[1.02]',
  secondary: 'border border-primary bg-white text-primary hover:bg-primary/5',
  danger: 'border border-red-600 bg-white text-red-600 hover:bg-red-50',
}

function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`cursor-pointer rounded-xl px-4 py-3.5 text-center font-bold transition-transform disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}

export default Button

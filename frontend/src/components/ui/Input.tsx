import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-primary" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-xl border border-primary bg-white px-4 py-3.5 text-text focus:outline focus:outline-primary ${className}`}
        {...props}
      />
    </div>
  )
}

export default Input

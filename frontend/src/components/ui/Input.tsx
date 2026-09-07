import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

function Input({ label, id, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-primary" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-xl border bg-white px-4 py-3.5 text-text focus:outline focus:outline-primary ${error ? 'border-red-500' : 'border-primary'} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input

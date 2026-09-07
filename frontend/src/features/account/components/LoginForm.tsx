import { useState, type SubmitEvent } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { LoginFormValues } from '../schemas/login-schema'

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>

interface LoginFormProps {
  fieldErrors?: FieldErrors
  formError?: string | null
  isSubmitting?: boolean
  onSubmit: (values: LoginFormValues) => void
}

function LoginForm({ fieldErrors = {}, formError, isSubmitting = false, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <Input
        label="Correo electrónico"
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
      />

      <Input
        label="Contraseña"
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
      />

      {formError && (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando…' : 'Entrar'}
      </Button>
    </form>
  )
}

export default LoginForm

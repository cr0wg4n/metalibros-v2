import { useState, type SubmitEvent } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { SignUpFormValues } from '../schemas/sign-up-schema'

type FieldErrors = Partial<Record<keyof SignUpFormValues, string>>

interface SignUpFormProps {
  fieldErrors?: FieldErrors
  formError?: string | null
  isSubmitting?: boolean
  onSubmit: (values: SignUpFormValues) => void
}

function SignUpForm({ fieldErrors = {}, formError, isSubmitting = false, onSubmit }: SignUpFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ name, email, password, confirmPassword })
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <Input
        label="Nombre"
        id="name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={fieldErrors.name}
      />

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

      <Input
        label="Repetir contraseña"
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        error={fieldErrors.confirmPassword}
      />

      {formError && (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>
    </form>
  )
}

export default SignUpForm

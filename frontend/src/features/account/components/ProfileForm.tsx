import { useState, type SubmitEvent } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

export interface ProfileFormValues {
  name: string
  email: string
  about: string
  phone: string
}

type FieldErrors = Partial<Record<keyof ProfileFormValues, string>>

interface ProfileFormProps {
  initialValues: ProfileFormValues
  fieldErrors?: FieldErrors
  formError?: string | null
  isSubmitting?: boolean
  onSubmit: (values: ProfileFormValues) => void
}

function ProfileForm({ initialValues, fieldErrors = {}, formError, isSubmitting = false, onSubmit }: ProfileFormProps) {
  const [name, setName] = useState(initialValues.name)
  const [email, setEmail] = useState(initialValues.email)
  const [about, setAbout] = useState(initialValues.about)
  const [phone, setPhone] = useState(initialValues.phone)

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ name, email, about, phone })
  }

  return (
    <form className="grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
      <div className="sm:col-span-2">
        <Input
          label="Nombre completo"
          id="name"
          placeholder="Tu nombre completo"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
        />
      </div>

      <div className="sm:col-span-2">
        <Textarea
          label="Biografía"
          id="about"
          rows={3}
          placeholder="Escribe una breve biografía…"
          value={about}
          onChange={(event) => setAbout(event.target.value)}
          error={fieldErrors.about}
        />
      </div>

      <Input
        label="Correo"
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
      />

      <Input
        label="Teléfono"
        id="phone"
        type="tel"
        placeholder="7XXXXXX"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        error={fieldErrors.phone}
      />

      {formError && (
        <p className="text-sm text-red-600 sm:col-span-2" role="alert">
          {formError}
        </p>
      )}

      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}

export default ProfileForm

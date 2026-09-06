import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SignUpForm from '../components/SignUpForm'
import { signUpSchema, type SignUpFormValues } from '../schemas/sign-up-schema'
import { signUp } from '../services/auth-service'
import { ROUTES } from '@/config/routes'

type FieldErrors = Partial<Record<keyof SignUpFormValues, string>>

function SignUpPage() {
  const navigate = useNavigate()
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(values: SignUpFormValues) {
    setFormError(null)

    const result = signUpSchema.safeParse(values)
    if (!result.success) {
      const errors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors
        errors[field] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const { name, email, password } = result.data
      await signUp({ name, email, password })
      navigate(ROUTES.account)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo crear la cuenta')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-8" aria-label="Formulario de registro">
      <section className="w-full max-w-115 rounded-2xl border border-primary/12 bg-white p-8 shadow-[0_18px_38px_rgba(51,104,160,0.12)]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">Crea tu cuenta</h1>
        </div>

        <SignUpForm
          fieldErrors={fieldErrors}
          formError={formError}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />

        <p className="mt-6 text-center text-sm text-muted">
          ¿Ya tienes cuenta?{' '}
          <Link className="font-semibold text-primary no-underline" to={ROUTES.login}>
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  )
}

export default SignUpPage

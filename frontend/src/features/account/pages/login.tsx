import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { loginSchema, type LoginFormValues } from '../schemas/login-schema'
import { login } from '../services/auth-service'
import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/auth-store'

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>

function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  async function handleSubmit(values: LoginFormValues) {
    setFormError(null)

    const result = loginSchema.safeParse(values)
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
      await login(result.data)
      navigate(ROUTES.dashboard)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo iniciar sesión')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-8" aria-label="Formulario de ingreso">
      <section className="w-full max-w-115 rounded-2xl border border-primary/12 bg-white p-8 shadow-[0_18px_38px_rgba(51,104,160,0.12)]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">Inicia sesión</h1>
        </div>

        <LoginForm
          fieldErrors={fieldErrors}
          formError={formError}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />

        <p className="mt-6 text-center text-sm text-muted">
          ¿No tienes cuenta?{' '}
          <Link className="font-semibold text-primary no-underline" to={ROUTES.signup}>
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage

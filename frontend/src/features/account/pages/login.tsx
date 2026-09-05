import LoginForm from '../components/LoginForm'

function LoginPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-8" aria-label="Formulario de ingreso">
      <section className="w-full max-w-115 rounded-2xl border border-primary/12 bg-white p-8 shadow-[0_18px_38px_rgba(51,104,160,0.12)]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">Inicia sesión</h1>
        </div>

        <LoginForm />
      </section>
    </main>
  )
}

export default LoginPage

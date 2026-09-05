import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

function LoginForm() {
  const navigate = useNavigate()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/account')
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <Input label="Correo electrónico" id="email" type="email" required />
      <Input label="Contraseña" id="password" type="password" required />

      <div className="flex items-center justify-between gap-4 text-sm">
        <a className="font-semibold text-primary no-underline" href="#">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <Button type="submit">Entrar</Button>
    </form>
  )
}

export default LoginForm

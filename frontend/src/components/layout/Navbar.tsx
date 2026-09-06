import { Link, useNavigate } from 'react-router-dom'
import logo from '@/assets/images/brand/metalibros.png'
import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/auth-store'
import { logout } from '@/features/account/services/auth-service'

function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  async function handleLogout() {
    await logout()
    navigate(ROUTES.home)
  }

  return (
    <nav className="flex items-center justify-between border-b border-primary/10 bg-white/80 backdrop-blur-sm">
      <Link className="px-4" to={ROUTES.home}>
        <img className="w-20" src={logo} alt="Metalibros Logo" />
      </Link>

      <div className="flex items-center justify-center gap-6 p-8">
        {user ? (
          <>
            <span className="text-sm text-muted">Hola, {user.name}</span>
            <button
              className="cursor-pointer text-base font-medium text-primary select-none active:text-accent"
              onClick={handleLogout}
              type="button"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            className="cursor-pointer text-base font-medium text-primary no-underline select-none active:text-accent"
            to={ROUTES.login}
          >
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar

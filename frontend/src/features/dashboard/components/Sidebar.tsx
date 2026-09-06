import { useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Settings } from 'lucide-react'
import logo from '@/assets/images/brand/metalibros.png'
import { ROUTES } from '@/config/routes'
import { logout } from '@/features/account/services/auth-service'

const NAV_ITEMS = [
  { to: ROUTES.dashboard, label: 'Dashboard' },
  { to: ROUTES.dashboardBooks, label: 'Libros Publicados' },
  { to: ROUTES.dashboardBooksNew, label: 'Registro de Libros' },
  { to: ROUTES.dashboardBooksManage, label: 'Administración de Libros' },
]

function navItemClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-2 rounded-xl px-4 py-3.5 font-medium no-underline transition-colors ${
    isActive ? 'bg-gradient-to-br from-secondary to-primary font-bold text-white' : 'text-primary hover:font-bold'
  }`
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()

  async function handleLogout() {
    onClose()
    await logout()
    navigate(ROUTES.home)
  }

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-dark/40 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 max-w-[80%] flex-col justify-between bg-white px-2 py-4 pb-3 shadow-[0_10px_24px_rgba(51,104,160,0.15)] transition-transform duration-300 ease-in-out md:static md:z-auto md:w-auto md:min-w-65 md:max-w-65 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar de navegación"
      >
        <div>
          <div className="flex items-center justify-center">
            <Link to={ROUTES.home} onClick={onClose}>
              <img className="w-20" src={logo} alt="Metalibros Logo" />
            </Link>
          </div>

          <nav className="mt-4 flex flex-1 flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end className={navItemClass} onClick={onClose}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-4 flex flex-col gap-1 border-t border-primary/10 pt-3">
          <NavLink to={ROUTES.dashboardProfile} end className={navItemClass} onClick={onClose}>
            <Settings className="h-5 w-5" />
            Configurar perfil
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-left font-medium text-primary transition-colors hover:font-bold"
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

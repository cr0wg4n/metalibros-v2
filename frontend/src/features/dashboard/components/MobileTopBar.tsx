import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import logo from '@/assets/images/brand/metalibros.png'
import { ROUTES } from '@/config/routes'

interface MobileTopBarProps {
  onOpenMenu: () => void
}

function MobileTopBar({ onOpenMenu }: MobileTopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-primary/10 bg-white px-4 py-3 md:hidden">
      <Link to={ROUTES.home}>
        <img className="w-16" src={logo} alt="Metalibros Logo" />
      </Link>

      <button type="button" onClick={onOpenMenu} className="p-1 text-primary" aria-label="Abrir menú">
        <Menu className="h-6 w-6" />
      </button>
    </header>
  )
}

export default MobileTopBar

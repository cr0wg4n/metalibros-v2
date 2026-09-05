import { Link } from 'react-router-dom'
import logo from '@/assets/images/brand/metalibros.png'

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-primary/10 bg-white/80 backdrop-blur-sm">
      <Link className="px-4" to="/">
        <img className="w-20" src={logo} alt="Metalibros Logo" />
      </Link>

      <div className="flex items-center justify-center gap-6 p-8">
        <Link
          className="cursor-pointer text-base font-medium text-primary no-underline select-none active:text-accent"
          to="/login"
        >
          Ingresar
        </Link>
      </div>
    </nav>
  )
}

export default Navbar

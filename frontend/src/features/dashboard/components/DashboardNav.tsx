import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import { resolveAvatarUrl } from '@/features/account/services/profile-service'
import { ROUTES } from '@/config/routes'

interface DashboardNavProps {
  title: string
}

function DashboardNav({ title }: DashboardNavProps) {
  const user = useAuthStore((state) => state.user)
  const avatarUrl = resolveAvatarUrl(user?.avatar ?? null)

  return (
    <nav className="flex w-full items-center justify-between bg-white p-6">
      <h1 className="text-xl font-bold text-primary">{title}</h1>

      <Link to={ROUTES.dashboardProfile} aria-label="Ir a mi perfil">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-sm font-bold text-primary">
            {user?.name.charAt(0).toUpperCase() ?? '?'}
          </div>
        )}
      </Link>
    </nav>
  )
}

export default DashboardNav

import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../features/dashboard/components/Sidebar'
import MobileTopBar from '../../features/dashboard/components/MobileTopBar'
import { useAuthStore } from '@/store/auth-store'
import { getProfile } from '@/features/account/services/profile-service'

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  useEffect(() => {
    if (isInitializing) return
    getProfile().catch(() => {})
  }, [isInitializing])

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <MobileTopBar onOpenMenu={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout

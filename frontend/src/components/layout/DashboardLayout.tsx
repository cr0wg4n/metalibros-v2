import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../features/dashboard/components/Sidebar'
import MobileTopBar from '../../features/dashboard/components/MobileTopBar'

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

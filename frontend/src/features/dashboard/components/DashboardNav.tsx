interface DashboardNavProps {
  title: string
}

function DashboardNav({ title }: DashboardNavProps) {
  return (
    <nav className="w-full bg-white p-6">
      <h1 className="text-xl font-bold text-primary">{title}</h1>
    </nav>
  )
}

export default DashboardNav

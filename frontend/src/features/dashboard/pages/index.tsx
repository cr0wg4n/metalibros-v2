import { useEffect, useState } from 'react'
import DashboardNav from '../components/DashboardNav'
import InsightCard from '../components/InsightCard'
import TopListPanel from '../components/TopListPanel'
import MetricPanel from '../components/MetricPanel'
import BreakdownChart from '../components/BreakdownChart'
import { formatUnits } from '../utils/format-units'
import { useAuthStore } from '@/store/auth-store'
import {
  getMetricsOverview,
  getTopCategories,
  getTopCities,
  type MetricsOverview,
  type TopCategoryMetric,
  type TopCityMetric,
} from '../services/metrics-service'

const currencyFormatter = new Intl.NumberFormat('es-BO', {
  style: 'currency',
  currency: 'BOB',
  maximumFractionDigits: 0,
})
const percentFormatter = new Intl.NumberFormat('es-BO', { style: 'percent', maximumFractionDigits: 1 })

function DashboardPage() {
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const [overview, setOverview] = useState<MetricsOverview | null>(null)
  const [topCategories, setTopCategories] = useState<TopCategoryMetric[]>([])
  const [topCities, setTopCities] = useState<TopCityMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isInitializing) return

    Promise.all([getMetricsOverview(), getTopCategories(), getTopCities()])
      .then(([overviewData, categories, cities]) => {
        setOverview(overviewData)
        setTopCategories(categories)
        setTopCities(cities)
      })
      .catch(() => setError('No se pudieron cargar las métricas'))
      .finally(() => setIsLoading(false))
  }, [isInitializing])

  return (
    <section className="w-full pb-8" aria-label="Contenido principal del dashboard">
      <DashboardNav title="Dashboard" />

      <div className="flex flex-col gap-6 p-6">
        {isLoading && <p className="text-muted">Cargando métricas…</p>}

        {error && (
          <p className="text-red-600" role="alert">
            {error}
          </p>
        )}

        {overview && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <InsightCard label="Total de ventas" value={String(overview.totalSalesCount)} />
              <InsightCard label="Ganancia total" value={currencyFormatter.format(overview.totalProfit)} />
              <InsightCard label="ROI" value={percentFormatter.format(overview.roi)} />
            </div>

            <div className="grid grid-cols-1 gap-5">
              <MetricPanel title="Categorías más vendidas">
                <BreakdownChart
                  items={topCategories.map((category) => ({ label: category.name, value: category.unitsSold }))}
                  emptyMessage="Aún no hay ventas registradas."
                />
              </MetricPanel>
              <TopListPanel
                title="Departamentos con más ventas"
                items={topCities.map((city) => ({
                  label: city.city,
                  value: city.unitsSold,
                  displayValue: formatUnits(city.unitsSold),
                }))}
                emptyMessage="Aún no hay ventas registradas."
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default DashboardPage

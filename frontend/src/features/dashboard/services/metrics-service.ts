import { api } from '@/lib/api'

export interface MetricsOverview {
  totalSalesCount: number
  totalRevenue: number
  totalProfit: number
  roi: number
}

export interface TopCategoryMetric {
  id: string
  name: string
  unitsSold: number
  revenue: number
}

export interface TopCityMetric {
  city: string
  unitsSold: number
  revenue: number
}

export async function getMetricsOverview(): Promise<MetricsOverview> {
  const { data } = await api.get<MetricsOverview>('/metrics/overview')
  return data
}

export async function getTopCategories(): Promise<TopCategoryMetric[]> {
  const { data } = await api.get<TopCategoryMetric[]>('/metrics/top-categories', { params: { limit: 50 } })
  return data
}

export async function getTopCities(): Promise<TopCityMetric[]> {
  const { data } = await api.get<TopCityMetric[]>('/metrics/top-cities', { params: { limit: 9 } })
  return data
}

import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const sales = await this.prisma.sale.findMany({
      select: { revenue: true, book: { select: { costPrice: true } } },
    })

    const totalSalesCount = sales.length
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.revenue, 0)
    const totalCost = sales.reduce((sum, sale) => sum + sale.book.costPrice, 0)
    const totalProfit = totalRevenue - totalCost
    const roi = totalCost > 0 ? totalProfit / totalCost : 0

    return { totalSalesCount, totalRevenue, totalProfit, roi }
  }

  async getTopCategories(limit: number) {
    const sales = await this.prisma.sale.findMany({
      select: { revenue: true, book: { select: { categories: { select: { id: true, name: true } } } } },
    })

    const byCategory = new Map<string, { id: string; name: string; unitsSold: number; revenue: number }>()

    for (const sale of sales) {
      for (const category of sale.book.categories) {
        const entry = byCategory.get(category.id) ?? {
          id: category.id,
          name: category.name,
          unitsSold: 0,
          revenue: 0,
        }
        entry.unitsSold += 1
        entry.revenue += sale.revenue
        byCategory.set(category.id, entry)
      }
    }

    return [...byCategory.values()].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, limit)
  }

  async getTopCities(limit: number) {
    const grouped = await this.prisma.sale.groupBy({
      by: ['city'],
      _count: { city: true },
      _sum: { revenue: true },
      orderBy: { _count: { city: 'desc' } },
      take: limit,
    })

    return grouped.map((row) => ({
      city: row.city,
      unitsSold: row._count.city,
      revenue: row._sum.revenue ?? 0,
    }))
  }
}

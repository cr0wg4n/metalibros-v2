import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'
import type { Prisma } from '../../generated/prisma/client.js'
import type { CreateSaleDto } from './dto/create-sale.dto.js'
import type { ListSalesQueryDto } from './dto/list-sales-query.dto.js'

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSaleDto) {
    const book = await this.prisma.book.findUnique({ where: { id: dto.bookId } })
    if (!book) {
      throw new NotFoundException('Libro no encontrado')
    }

    return this.prisma.$transaction(async (tx) => {
      const stockAgg = await tx.stockMovement.aggregate({
        where: { bookId: dto.bookId },
        _sum: { quantity: true },
      })
      const currentStock = stockAgg._sum.quantity ?? 0

      if (currentStock <= 0) {
        throw new ConflictException('No hay stock disponible para este libro')
      }

      const sale = await tx.sale.create({
        data: {
          city: dto.city,
          revenue: dto.revenue,
          bookId: dto.bookId,
          soldAt: new Date(),
        },
      })

      await tx.stockMovement.create({
        data: { bookId: dto.bookId, quantity: -1, type: 'SALE', saleId: sale.id },
      })

      return sale
    })
  }

  async findAll(query: ListSalesQueryDto) {
    const where: Prisma.SaleWhereInput = {}
    if (query.bookId) where.bookId = query.bookId
    if (query.city) where.city = query.city

    const [data, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        include: { book: { select: { id: true, name: true } } },
        orderBy: { soldAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.sale.count({ where }),
    ])

    return { data, meta: { page: query.page, limit: query.limit, total } }
  }
}

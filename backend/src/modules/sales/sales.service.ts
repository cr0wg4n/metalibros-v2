import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { Prisma } from '../../generated/prisma/client.js';
import type { CreateSaleDto } from './dto/create-sale.dto.js';
import type { UpdateSaleDto } from './dto/update-sale.dto.js';
import type { ListSalesQueryDto } from './dto/list-sales-query.dto.js';

const SALE_INCLUDE = { book: { select: { id: true, name: true } } } as const;

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSaleDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: dto.bookId },
    });
    if (!book) {
      throw new NotFoundException('Libro no encontrado');
    }

    return this.prisma.$transaction(async (tx) => {
      const stockAgg = await tx.stockMovement.aggregate({
        where: { bookId: dto.bookId },
        _sum: { quantity: true },
      });
      const currentStock = stockAgg._sum.quantity ?? 0;

      if (currentStock <= 0) {
        throw new ConflictException('No hay stock disponible para este libro');
      }

      const sale = await tx.sale.create({
        data: {
          city: dto.city,
          revenue: dto.revenue,
          bookId: dto.bookId,
          soldAt: dto.soldAt ? new Date(dto.soldAt) : new Date(),
        },
        include: SALE_INCLUDE,
      });

      await tx.stockMovement.create({
        data: {
          bookId: dto.bookId,
          quantity: -1,
          type: 'SALE',
          saleId: sale.id,
        },
      });

      return sale;
    });
  }

  async findAll(query: ListSalesQueryDto) {
    const where: Prisma.SaleWhereInput = {};
    if (query.bookId) where.bookId = query.bookId;
    if (query.city) where.city = { contains: query.city };
    if (query.search) {
      where.OR = [
        { city: { contains: query.search } },
        { book: { name: { contains: query.search } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        include: SALE_INCLUDE,
        orderBy: { soldAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.sale.count({ where }),
    ]);

    return { data, meta: { page: query.page, limit: query.limit, total } };
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: SALE_INCLUDE,
    });
    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }
    return sale;
  }

  async update(id: string, dto: UpdateSaleDto) {
    const existing = await this.findOne(id);
    const nextBookId = dto.bookId ?? existing.bookId;

    return this.prisma.$transaction(async (tx) => {
      if (nextBookId !== existing.bookId) {
        const book = await tx.book.findUnique({ where: { id: nextBookId } });
        if (!book) {
          throw new NotFoundException('Libro no encontrado');
        }

        const stockAgg = await tx.stockMovement.aggregate({
          where: { bookId: nextBookId },
          _sum: { quantity: true },
        });
        const currentStock = stockAgg._sum.quantity ?? 0;

        if (currentStock <= 0) {
          throw new ConflictException(
            'No hay stock disponible para este libro',
          );
        }

        await tx.stockMovement.updateMany({
          where: { saleId: id },
          data: { bookId: nextBookId },
        });
      }

      return tx.sale.update({
        where: { id },
        data: {
          city: dto.city,
          revenue: dto.revenue,
          bookId: dto.bookId,
          soldAt: dto.soldAt ? new Date(dto.soldAt) : undefined,
        },
        include: SALE_INCLUDE,
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.$transaction([
      this.prisma.stockMovement.deleteMany({ where: { saleId: id } }),
      this.prisma.sale.delete({ where: { id } }),
    ]);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateStockMovementDto } from './dto/create-stock-movement.dto.js';

@Injectable()
export class StockMovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStockMovementDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: dto.bookId },
    });
    if (!book) {
      throw new NotFoundException('Libro no encontrado');
    }

    return this.prisma.stockMovement.create({
      data: {
        bookId: dto.bookId,
        quantity: dto.quantity,
        type: dto.type,
        note: dto.note,
      },
    });
  }

  async getStockForBook(bookId: string) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Libro no encontrado');
    }

    return { bookId, stock: await this.sumStock(bookId) };
  }

  async getHistoryForBook(bookId: string) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Libro no encontrado');
    }

    return this.prisma.stockMovement.findMany({
      where: { bookId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sumStock(bookId: string): Promise<number> {
    const result = await this.prisma.stockMovement.aggregate({
      where: { bookId },
      _sum: { quantity: true },
    });
    return result._sum.quantity ?? 0;
  }

  async sumStockForBooks(bookIds: string[]): Promise<Map<string, number>> {
    if (bookIds.length === 0) {
      return new Map();
    }

    const grouped = await this.prisma.stockMovement.groupBy({
      by: ['bookId'],
      where: { bookId: { in: bookIds } },
      _sum: { quantity: true },
    });

    return new Map(grouped.map((row) => [row.bookId, row._sum.quantity ?? 0]));
  }
}

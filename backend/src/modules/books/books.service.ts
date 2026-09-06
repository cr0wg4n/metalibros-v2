import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service.js'
import { StockMovementsService } from '../stock-movements/stock-movements.service.js'
import type { Prisma } from '../../generated/prisma/client.js'
import type { CreateBookDto } from './dto/create-book.dto.js'
import type { UpdateBookDto } from './dto/update-book.dto.js'
import type { UpdateBookStatusDto } from './dto/update-book-status.dto.js'
import type { ListBooksQueryDto } from './dto/list-books-query.dto.js'

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stockMovementsService: StockMovementsService,
  ) {}

  async create(dto: CreateBookDto) {
    const { categoryIds, releaseDate, ...rest } = dto

    const book = await this.prisma.book.create({
      data: {
        ...rest,
        releaseDate: new Date(releaseDate),
        categories: categoryIds ? { connect: categoryIds.map((id) => ({ id })) } : undefined,
      },
      include: { categories: true },
    })

    return { ...book, stock: 0 }
  }

  async findAll(query: ListBooksQueryDto, isAuthenticated = true) {
    const where: Prisma.BookWhereInput = {}

    if (!isAuthenticated) {
      where.status = 'PUBLISHED'
    } else if (query.status) {
      where.status = query.status
    }

    if (query.categoryId) {
      where.categories = { some: { id: query.categoryId } }
    }

    if (query.search) {
      where.OR = [{ name: { contains: query.search } }, { author: { contains: query.search } }]
    }

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: { categories: true },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.book.count({ where }),
    ])

    const stockByBookId = await this.stockMovementsService.sumStockForBooks(books.map((book) => book.id))
    const data = books.map((book) => ({ ...book, stock: stockByBookId.get(book.id) ?? 0 }))

    return { data, meta: { page: query.page, limit: query.limit, total } }
  }

  async findOne(id: string, isAuthenticated = true) {
    const book = await this.prisma.book.findUnique({ where: { id }, include: { categories: true } })

    if (!book || (!isAuthenticated && book.status !== 'PUBLISHED')) {
      throw new NotFoundException('Libro no encontrado')
    }

    return { ...book, stock: await this.stockMovementsService.sumStock(id) }
  }

  async update(id: string, dto: UpdateBookDto) {
    await this.findOne(id)

    const { categoryIds, releaseDate, ...rest } = dto

    const book = await this.prisma.book.update({
      where: { id },
      data: {
        ...rest,
        ...(releaseDate ? { releaseDate: new Date(releaseDate) } : {}),
        ...(categoryIds ? { categories: { set: categoryIds.map((categoryId) => ({ id: categoryId })) } } : {}),
      },
      include: { categories: true },
    })

    return { ...book, stock: await this.stockMovementsService.sumStock(id) }
  }

  async updateStatus(id: string, dto: UpdateBookStatusDto) {
    await this.findOne(id)
    return this.prisma.book.update({ where: { id }, data: { status: dto.status } })
  }

  async updateCoverImage(id: string, coverImage: string) {
    await this.findOne(id)
    return this.prisma.book.update({ where: { id }, data: { coverImage } })
  }

  async remove(id: string) {
    await this.findOne(id)

    try {
      await this.prisma.book.delete({ where: { id } })
    } catch {
      throw new ConflictException('No se puede eliminar un libro con ventas o movimientos de stock registrados')
    }
  }
}

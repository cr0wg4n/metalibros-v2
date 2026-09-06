import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import type { CreateCategoryDto } from './dto/create-category.dto.js'

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } })
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { name: dto.name } })
    if (existing) {
      throw new ConflictException('Ya existe una categoría con este nombre')
    }
    return this.prisma.category.create({ data: { name: dto.name } })
  }
}

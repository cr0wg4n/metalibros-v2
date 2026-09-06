import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { CategoriesService } from './categories.service.js'
import { CreateCategoryDto } from './dto/create-category.dto.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll()
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto)
  }
}

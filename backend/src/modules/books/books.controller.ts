import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import type { Request } from 'express'
import { BooksService } from './books.service.js'
import { CreateBookDto } from './dto/create-book.dto.js'
import { UpdateBookDto } from './dto/update-book.dto.js'
import { UpdateBookStatusDto } from './dto/update-book-status.dto.js'
import { ListBooksQueryDto } from './dto/list-books-query.dto.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard.js'
import { createImageUploadInterceptor } from '../../common/create-image-upload-interceptor.js'
import { StockMovementsService } from '../stock-movements/stock-movements.service.js'

const coverUploadInterceptor = createImageUploadInterceptor('books')

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly stockMovementsService: StockMovementsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto)
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@Req() request: Request, @Query() query: ListBooksQueryDto) {
    return this.booksService.findAll(query, Boolean(request.user))
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.booksService.findOne(id, Boolean(request.user))
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto)
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBookStatusDto) {
    return this.booksService.updateStatus(id, dto)
  }

  @Post(':id/cover')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(coverUploadInterceptor)
  uploadCover(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Falta el archivo de imagen')
    }
    return this.booksService.updateCoverImage(id, `/uploads/books/${file.filename}`)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.booksService.remove(id)
  }

  @Get(':id/stock')
  @UseGuards(JwtAuthGuard)
  getStock(@Param('id') id: string) {
    return this.stockMovementsService.getStockForBook(id)
  }

  @Get(':id/stock-movements')
  @UseGuards(JwtAuthGuard)
  getStockMovements(@Param('id') id: string) {
    return this.stockMovementsService.getHistoryForBook(id)
  }
}

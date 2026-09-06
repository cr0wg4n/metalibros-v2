import { randomUUID } from 'node:crypto'
import { extname, join } from 'node:path'
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
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { BooksService } from './books.service.js'
import { CreateBookDto } from './dto/create-book.dto.js'
import { UpdateBookDto } from './dto/update-book.dto.js'
import { UpdateBookStatusDto } from './dto/update-book-status.dto.js'
import { ListBooksQueryDto } from './dto/list-books-query.dto.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'

const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const coverUploadInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: join(process.cwd(), 'uploads', 'books'),
    filename: (_req, file, callback) => callback(null, `${randomUUID()}${extname(file.originalname)}`),
  }),
  fileFilter: (_req, file, callback) => {
    if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
      callback(new UnsupportedMediaTypeException('Solo se aceptan imágenes JPEG, PNG o WEBP'), false)
      return
    }
    callback(null, true)
  },
  limits: { fileSize: 5 * 1024 * 1024 },
})

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto)
  }

  @Get()
  findAll(@Query() query: ListBooksQueryDto) {
    return this.booksService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id)
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
}

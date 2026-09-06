import { Module } from '@nestjs/common'
import { BooksController } from './books.controller.js'
import { BooksService } from './books.service.js'
import { AuthModule } from '../auth/auth.module.js'
import { StockMovementsModule } from '../stock-movements/stock-movements.module.js'

@Module({
  imports: [AuthModule, StockMovementsModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}

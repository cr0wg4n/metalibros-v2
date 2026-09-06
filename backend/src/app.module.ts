import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BooksModule } from './books/books.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { StockMovementsModule } from './stock-movements/stock-movements.module.js';
import { SalesModule } from './sales/sales.module.js';
import { MetricsModule } from './metrics/metrics.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BooksModule,
    CategoriesModule,
    StockMovementsModule,
    SalesModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

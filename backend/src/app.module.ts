import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { BooksModule } from './modules/books/books.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { StockMovementsModule } from './modules/stock-movements/stock-movements.module.js';
import { SalesModule } from './modules/sales/sales.module.js';
import { MetricsModule } from './modules/metrics/metrics.module.js';

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
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { StockMovementsController } from './stock-movements.controller.js'
import { StockMovementsService } from './stock-movements.service.js'
import { AuthModule } from '../auth/auth.module.js'

@Module({
  imports: [AuthModule],
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
  exports: [StockMovementsService],
})
export class StockMovementsModule {}

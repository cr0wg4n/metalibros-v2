import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { SalesService } from './sales.service.js'
import { CreateSaleDto } from './dto/create-sale.dto.js'
import { ListSalesQueryDto } from './dto/list-sales-query.dto.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() dto: CreateSaleDto) {
    return this.salesService.create(dto)
  }

  @Get()
  findAll(@Query() query: ListSalesQueryDto) {
    return this.salesService.findAll(query)
  }
}

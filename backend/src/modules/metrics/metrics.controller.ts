import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service.js';
import { TopListQueryDto } from './dto/top-list-query.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('metrics')
@UseGuards(JwtAuthGuard)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('overview')
  getOverview() {
    return this.metricsService.getOverview();
  }

  @Get('top-categories')
  getTopCategories(@Query() query: TopListQueryDto) {
    return this.metricsService.getTopCategories(query.limit);
  }

  @Get('top-cities')
  getTopCities(@Query() query: TopListQueryDto) {
    return this.metricsService.getTopCities(query.limit);
  }
}

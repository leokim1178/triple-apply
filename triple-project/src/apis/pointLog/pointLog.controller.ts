import { Controller, Get, Param } from '@nestjs/common';
import { PointLog } from './entities/pointLog.entity';
import { PointLogService } from './pointLog.service';

@Controller('point')
export class PointLogController {
  constructor(private readonly pointLogService: PointLogService) {}

  @Get(':id')
  fetchCurrentPoint(@Param('id') userId: string): Promise<PointLog> {
    return this.pointLogService.currentPoint({ userId });
  }
}

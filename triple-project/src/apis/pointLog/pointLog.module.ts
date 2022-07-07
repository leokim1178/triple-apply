import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../review/entities/review.entity';
import { User } from '../user/entities/user.entity';
import { PointLog } from './entities/pointLog.entity';
import { PointLogController } from './pointLog.controller';
import { PointLogService } from './pointLog.service';

@Module({
  imports: [TypeOrmModule.forFeature([PointLog, User, Review])],
  controllers: [PointLogController],
  providers: [PointLogService],
})
export class PointLogModule {}

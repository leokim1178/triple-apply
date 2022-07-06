import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointLog } from '../pointLog/entities/pointLog.entity';
import { Review } from '../review/entities/review.entity';
import { User } from '../user/entities/user.entity';
import { Event } from './entites/event.entity';
import { EventController } from './event.controller';

import { EventService } from './event.service';
import { ReviewEventHandler } from './eventHandlers/reviewEvent.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User, Review, PointLog]), CqrsModule],
  controllers: [EventController],
  providers: [ReviewEventHandler, EventService],
})
export class EventModule {}

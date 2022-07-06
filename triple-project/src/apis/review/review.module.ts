import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../event/entites/event.entity';

// import { ReviewUpdatedHandler } from './eventHandlers/reviewUpdated.eventHandler';

import { Place } from '../place/entities/place.entity';
import { PointLog } from '../pointLog/entities/pointLog.entity';
import { ReviewImage } from '../reviewImage/entities/reviewImage.entity';
import { User } from '../user/entities/user.entity';
import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewImage, Place, User, Event, PointLog]), CqrsModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}

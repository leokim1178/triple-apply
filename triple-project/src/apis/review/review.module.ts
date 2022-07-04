import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from '../place/entities/place.entity';
import { ReviewImage } from '../reviewImage/entities/reviewImage.entity';
import { User } from '../user/entities/user.entity';
import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewEventsHandler } from './review.eventHandler';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewImage, Place, User]), CqrsModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewEventsHandler],
})
export class ReviewModule {}

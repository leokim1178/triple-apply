import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/apis/review/entities/review.entity';
import { Repository } from 'typeorm';
import { Event } from '../entites/event.entity';
import { PointLog } from '../../pointLog/entities/pointLog.entity';
import { User } from '../../user/entities/user.entity';
import { ReviewUpdatedEvent, ReviewUpdatedPointEvent } from '../events/reviewUpdated.event';

@EventsHandler(ReviewUpdatedEvent, ReviewUpdatedPointEvent)
export class ReviewUpdatedHandler implements IEventHandler<ReviewUpdatedEvent | ReviewUpdatedPointEvent> {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>, //
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @InjectRepository(PointLog) private readonly pointLogRepository: Repository<PointLog>,
  ) {}

  async handle(event: ReviewUpdatedEvent | ReviewUpdatedPointEvent) {
    switch (event.name) {
      case ReviewUpdatedEvent.name: {
        const { name, lastImagePoint, attachedPhotoIds, ...rest } = event;
        const imagesString = JSON.stringify(event.attachedPhotoIds);
        await this.eventRepository.save({ ...rest, attachedPhotoIds: imagesString });
      }
      case ReviewUpdatedPointEvent.name: {
        const review = await this.reviewRepository.findOne({ where: { id: event.reviewId } });
        const updatedPoint = review.imagePoint - event.lastImagePoint;
        const user = await this.userRepository.findOne({ where: { id: event.userId } });

        const updateUser = await this.userRepository.save({ ...user, point: user.point + updatedPoint });
        await this.pointLogRepository.save({
          point: updatedPoint,
          total: updateUser.point,
          type: event.type,
          action: event.action,
          user: updateUser,
        });

        break;
      }
      default:
        break;
    }
  }
}

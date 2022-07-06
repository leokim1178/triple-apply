import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/apis/review/entities/review.entity';
import { Repository } from 'typeorm';
import { Event } from '../entites/event.entity';
import { PointLog } from '../../pointLog/entities/pointLog.entity';
import { User } from '../../user/entities/user.entity';
import {
  ReviewLogEvent,
  ReviewCreatedPointEvent,
  ReviewUpdatedPointEvent,
  ReviewDeletedPointEvent,
} from '../events/review.events';

@EventsHandler(
  ReviewLogEvent,
  ReviewCreatedPointEvent,

  ReviewUpdatedPointEvent,

  ReviewDeletedPointEvent,
)
export class ReviewEventHandler
  implements
    IEventHandler<
      | ReviewLogEvent //
      | ReviewCreatedPointEvent
      | ReviewUpdatedPointEvent
      | ReviewDeletedPointEvent
    >
{
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>, //
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @InjectRepository(PointLog) private readonly pointLogRepository: Repository<PointLog>,
  ) {}

  async handle(
    event: ReviewLogEvent & //
      ReviewCreatedPointEvent &
      ReviewUpdatedPointEvent &
      ReviewDeletedPointEvent,
  ) {
    switch (event.name) {
      case ReviewLogEvent.name: {
        const { name, attachedPhotoIds, ...rest } = event;
        const imagesString = JSON.stringify(event.attachedPhotoIds);
        await this.eventRepository.save({ ...rest, attachedPhotoIds: imagesString });
        break;
      }
      case ReviewCreatedPointEvent.name: {
        const review = await this.reviewRepository.findOne({ where: { id: event.reviewId } });
        const createdPoint = review.imagePoint + review.bonusPoint + review.defaultPoint;
        const user = await this.userRepository.findOne({ where: { id: event.userId } });
        const updateUser = await this.userRepository.save({ ...user, point: user.point + createdPoint });
        await this.pointLogRepository.save({
          point: createdPoint,
          total: updateUser.point,
          type: event.type,
          action: event.action,
          user: updateUser,
          review,
        });

        break;
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
          review,
        });

        break;
      }
      case ReviewDeletedPointEvent.name: {
        const review = await this.reviewRepository.findOne({ where: { id: event.reviewId } });
        const user = await this.userRepository.findOne({ where: { id: event.userId } });
        const updateUser = await this.userRepository.save({ ...user, point: user.point - event.reviewPoint });
        await this.pointLogRepository.save({
          point: -event.reviewPoint,
          total: updateUser.point,
          type: event.type,
          action: event.action,
          user: updateUser,
          review,
        });

        break;
      }
      default:
        break;
    }
  }
}

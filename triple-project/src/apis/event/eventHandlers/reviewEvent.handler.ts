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
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

@EventsHandler(ReviewLogEvent, ReviewCreatedPointEvent, ReviewUpdatedPointEvent, ReviewDeletedPointEvent)
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
        try {
          const { name, attachedPhotoIds, ...rest } = event;
          const imagesString = JSON.stringify(event.attachedPhotoIds);
          await this.eventRepository.save({ ...rest, attachedPhotoIds: imagesString });
          break;
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
      }
      case ReviewCreatedPointEvent.name: {
        const review = await this.reviewRepository.findOne({ where: { id: event.reviewId } });
        if (!review) throw new NotFoundException(`리뷰 정보가 존재하지 않습니다`);

        const user = await this.userRepository.findOne({ where: { id: event.userId } });
        if (!user) throw new NotFoundException('유저 정보가 존재하지 않습니다');
        try {
          const createdPoint = review.imagePoint + review.bonusPoint + review.defaultPoint;
          const updateUser = await this.userRepository.save({ ...user, point: user.point + createdPoint });
          await this.pointLogRepository.save({
            recentChange: createdPoint,
            total: updateUser.point,
            type: event.type,
            action: event.action,
            user: updateUser,
            review,
          });

          break;
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
      }
      case ReviewUpdatedPointEvent.name: {
        const review = await this.reviewRepository.findOne({ where: { id: event.reviewId } });
        if (!review) throw new NotFoundException(`리뷰 정보가 존재하지 않습니다`);

        const user = await this.userRepository.findOne({ where: { id: event.userId } });
        if (!user) throw new NotFoundException('유저 정보가 존재하지 않습니다');

        try {
          const updatedPoint = review.imagePoint - event.lastImagePoint;

          const updateUser = await this.userRepository.save({ ...user, point: user.point + updatedPoint });
          await this.pointLogRepository.save({
            recentChange: updatedPoint,
            total: updateUser.point,
            type: event.type,
            action: event.action,
            user: updateUser,
            review,
          });

          break;
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
      }
      case ReviewDeletedPointEvent.name: {
        const review = await this.reviewRepository.findOne({ where: { id: event.reviewId } });
        if (!review) throw new NotFoundException(`리뷰 정보가 존재하지 않습니다`);

        const user = await this.userRepository.findOne({ where: { id: event.userId } });
        if (!user) throw new NotFoundException('유저 정보가 존재하지 않습니다');
        try {
          const updateUser = await this.userRepository.save({ ...user, point: user.point - event.reviewPoint });
          await this.pointLogRepository.save({
            recentChange: -event.reviewPoint,
            total: updateUser.point,
            type: event.type,
            action: event.action,
            user: updateUser,
            review,
          });

          break;
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
      }
      default:
        break;
    }
  }
}

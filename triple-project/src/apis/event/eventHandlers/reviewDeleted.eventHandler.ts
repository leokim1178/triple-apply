import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/apis/review/entities/review.entity';
import { Repository } from 'typeorm';
import { Event } from '../entites/event.entity';
import { PointLog } from '../../pointLog/entities/pointLog.entity';
import { User } from '../../user/entities/user.entity';
import { ReviewDeletedPointEvent, ReviewDeletedEvent } from '../events/reviewDeleted.event';

@EventsHandler(ReviewDeletedEvent, ReviewDeletedPointEvent)
export class ReviewDeletedHandler implements IEventHandler<ReviewDeletedEvent | ReviewDeletedPointEvent> {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>, //
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @InjectRepository(PointLog) private readonly pointLogRepository: Repository<PointLog>,
  ) {}

  async handle(event: ReviewDeletedEvent | ReviewDeletedPointEvent) {
    switch (event.name) {
      case ReviewDeletedEvent.name: {
        const { name, attachedPhotoIds, ...rest } = event;
        const imagesString = JSON.stringify(event.attachedPhotoIds);
        await this.eventRepository.save({ ...rest, attachedPhotoIds: imagesString });
      }
      case ReviewDeletedPointEvent.name: {
        const result = await this.reviewRepository
          .createQueryBuilder('review')
          .where({ place: event.placeId })
          .select('review.place', 'place')
          .addSelect('COUNT(*) AS reviewCount')
          .groupBy('review.place')
          .getRawMany();
        const reviewCount = result[0].reviewCount;

        const user = await this.userRepository.findOne({ where: { id: event.userId } });
        let updateUser;
        if (reviewCount === 1) {
          updateUser = await this.userRepository.save({ ...user, point: user.point + 2 });
          await this.pointLogRepository.save({
            point: 2,
            total: updateUser.point,
            type: event.type,
            action: event.action,
            user: updateUser,
          });
        }

        updateUser = await this.userRepository.save({ ...user, point: user.point + 1 });
        await this.pointLogRepository.save({
          point: 1,
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

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
    /**
     * @author leokim1178
     * @description
     * CQRS 패턴을 이용해 IEvent파생 클래스를 이용해 이벤트를 감지 하도록 했습니다
     * review api(CUD)를 사용하거나 event api(C)를 사용할 때 eventBus를 통해 해당 로직이 실행됩니다
     * 리뷰 이벤트 종류에 따라 switch문을 통해 실행되도록 구성
     * ReviewLogEvent는 이벤트 로그 저장을
     * ReviewPointEvent는 포인트 로그 저장을 수행합니다
     */
    switch (event.name) {
      /**
       * @description
       * 이벤트의 발생 로그를 저장합니다
       * 로그이므로 테이블 관계를 이어놓지 않았습니다
       * 때문에 리뷰 이미지 배열은 JSON.stringify로 문자열 처리 했습니다
       */
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
      /**
       * @description
       * 리뷰의 포인트들을 모두 더해 기존 유저의 포인트에 추가합니다
       * 포인트 변경사항과 포인트가 추가된 유저의 현재포인트로 포인트 로그를 저장합니다
       */
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
      /**
       * @description
       * ( 수정된 리뷰의 포인트값 - 수정전 리뷰의 포인트값 )을 유저의 현재 포인트에 추가합니다
       * 포인트 변경사항과 포인트가 추가된 유저의 현재포인트로 포인트 로그를 저장합니다
       */
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
      /**
       * @description
       * 리뷰가 가진 포인트 값을 유저의 현재 포인트에서 삭감합니다
       * 포인트 변경사항과 포인트가 추가된 유저의 현재포인트로 포인트 로그를 저장합니다
       */
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

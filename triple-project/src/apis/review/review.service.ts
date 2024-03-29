import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from '../place/entities/place.entity';
import { ReviewImage } from '../reviewImage/entities/reviewImage.entity';
import { User } from '../user/entities/user.entity';
import { Review } from './entities/review.entity';

import { Type, Action } from '../event/type/event.type';

import {
  ReviewLogEvent,
  ReviewCreatedPointEvent,
  ReviewUpdatedPointEvent,
  ReviewDeletedPointEvent,
} from '../event/events/review.events';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewImage) private readonly reviewImageRepository: Repository<ReviewImage>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Place) private readonly placeRepository: Repository<Place>,
    private readonly eventBus: EventBus,
  ) {}

  async fetch({ id }) {
    const result = await this.reviewRepository.findOne({ where: { id }, relations: ['reviewImages', 'user', 'place'] });
    if (!result) throw new NotFoundException('리뷰 정보가 존재하지 않습니다');
    return result;
  }

  async fetchAll() {
    return await this.reviewRepository.find({ relations: ['reviewImages', 'user', 'place'] });
  }

  async create({ user, place, imgUrls, content }) {
    try {
      let images;
      let imagePoint = 0;
      if (imgUrls.length > 0) {
        images = await Promise.all(
          imgUrls.map(el => {
            return this.reviewImageRepository.save({ url: el });
          }),
        );
        imagePoint++;
      }

      let bonusPoint = 0;
      const reviewCount = await this.reviewRepository
        .createQueryBuilder('review')
        .where({ place: place.id })
        .select('review.place', 'place')
        .addSelect('COUNT(*) AS reviewCount')
        .groupBy('review.place')
        .getRawMany();

      if (reviewCount.length == 0) {
        bonusPoint++;
      }

      const isExist = await this.reviewRepository
        .createQueryBuilder('review')
        .leftJoin('review.user', 'user')
        .leftJoin('review.place', 'place')
        .where({ user })
        .andWhere({ place })
        .getOne();
      if (isExist) throw new UnprocessableEntityException('장소에 대한 리뷰가 이미 존재합니다');

      const result = await this.reviewRepository.save({
        user,
        place,
        content,
        reviewImages: images,
        imagePoint,
        bonusPoint,
      });

      const userId = user.id;
      const placeId = place.id;
      const reviewId = result.id;

      const type = Type.REVIEW;
      const action = Action.ADD;
      let attachedPhotoIds;
      if (result.reviewImages) {
        attachedPhotoIds = result.reviewImages.map(el => el.id);
      } else {
        attachedPhotoIds = [];
      }

      this.eventBus.publish(new ReviewLogEvent(content, userId, reviewId, placeId, type, action, attachedPhotoIds));
      this.eventBus.publish(new ReviewCreatedPointEvent(userId, reviewId, type, action));

      return result;
    } catch (error) {
      throw new InternalServerErrorException('서버 내부 오류입니다');
    }
  }

  async update({ review, updateReviewInput }) {
    try {
      const { imgUrls, content } = updateReviewInput;

      const lastImagePoint = review.imagePoint;

      await this.reviewImageRepository.delete({ review });

      let images;
      let imagePoint = 0;
      if (imgUrls?.length > 0) {
        images = await Promise.all(
          imgUrls.map(el => {
            return this.reviewImageRepository.save({ url: el });
          }),
        );
        if (review.reviewImages?.length == 0 || review.reviewImages?.length > 0) {
          imagePoint++;
        }
      }

      const result = await this.reviewRepository.save({
        ...review,
        content,
        reviewImages: images,
        imagePoint,
      });
      const userId = review.user.id;
      const placeId = result.place.id;
      const reviewId = result.id;

      const type = Type.REVIEW;
      const action = Action.MOD;
      let attachedPhotoIds;
      if (result.reviewImages) {
        attachedPhotoIds = result.reviewImages.map(el => el.id);
      } else {
        attachedPhotoIds = [];
      }
      this.eventBus.publish(new ReviewLogEvent(content, userId, reviewId, placeId, type, action, attachedPhotoIds));
      this.eventBus.publish(new ReviewUpdatedPointEvent(userId, reviewId, type, action, lastImagePoint));

      return result;
    } catch (error) {
      throw new InternalServerErrorException('서버 내부 오류입니다');
    }
  }

  async delete({ review }) {
    try {
      const content = review.content;
      const userId = review.user.id;
      const reviewId = review.id;
      const placeId = review.place.id;
      const type = Type.REVIEW;
      const action = Action.DELETE;
      const attachedPhotoIds = await review.reviewImages?.map(el => el.id);
      const reviewPoint = review.defaultPoint + review.imagePoint + review.bonusPoint;

      this.eventBus.publish(new ReviewLogEvent(content, userId, reviewId, placeId, type, action, attachedPhotoIds));
      this.eventBus.publish(new ReviewDeletedPointEvent(userId, reviewId, type, action, reviewPoint));

      await this.reviewImageRepository.delete({ review: reviewId });
      const result = await this.reviewRepository.softDelete({ id: reviewId });
      return result.affected ? true : false;
    } catch (error) {
      throw new InternalServerErrorException('서버 내부 오류입니다');
    }
  }

  async isExist({ reviewId, placeId, userId }: { reviewId?: string; placeId?: string; userId?: string }) {
    const id = reviewId || placeId || userId;
    switch (id) {
      case reviewId: {
        const review = await this.reviewRepository.findOne({
          where: { id: reviewId },
          relations: ['user', 'place', 'reviewImages'],
        });
        if (review) {
          return review;
        } else throw new NotFoundException(`리뷰 정보가 존재하지 않습니다`);
      }
      case placeId: {
        const place = await this.placeRepository.findOne({
          where: { id: placeId },
        });
        if (place) {
          return place;
        } else throw new NotFoundException('장소 정보가 존재하지 않습니다');
      }
      case userId: {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        if (user) {
          return user;
        } else throw new NotFoundException('유저 정보가 존재하지 않습니다');
      }
      default:
        break;
    }
  }
}

import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from '../place/entities/place.entity';
import { ReviewImage } from '../reviewImage/entities/reviewImage.entity';
import { User } from '../user/entities/user.entity';
import { Review } from './entities/review.entity';
import { ReviewCreatedEvent } from './event/review.events';
import { Type, Action } from '../pointLog/type/pointLog.type';

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
    return await this.reviewRepository.findOne({ where: { id }, relations: ['reviewImages', 'user', 'place'] });
  }

  async fetchAll() {
    return await this.reviewRepository.find({ relations: ['reviewImages', 'user', 'place'] });
  }

  async create({ user, place, imgUrls, content }) {
    const images = await Promise.all(
      imgUrls.map(el => {
        return this.reviewImageRepository.save({ url: el });
      }),
    );

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
    });
    const userId = user.id;
    const placeId = place.id;
    const reviewId = result.id;
    const attachedPhotoIds = result.reviewImages.map(el => el.id);
    const type = Type.REVIEW;
    const action = Action.ADD;

    const eventResult = await this.eventBus.publish(
      new ReviewCreatedEvent(content, userId, reviewId, placeId, attachedPhotoIds, type, action),
    );
    // await this.eventBus.publish(
    //   new ReviewCreatedPointEvent(userId, reviewId, placeId, type, action, content, attachedPhotoIds),
    // );

    return new ReviewCreatedEvent(content, userId, reviewId, placeId, attachedPhotoIds, type, action);
  }

  async update({ review, updateReviewInput }) {
    const deleteResult = await this.reviewImageRepository.delete({ review });
    console.log(deleteResult);
    if (!deleteResult) throw new UnprocessableEntityException();
    const { imgUrls, content } = updateReviewInput;
    const images = await Promise.all(
      imgUrls.map(el => {
        return this.reviewImageRepository.save({ url: el });
      }),
    );
    return await this.reviewRepository.save({
      ...review,
      content,
      reviewImages: images,
    });
  }

  async delete({ id }) {
    const result = await this.reviewRepository.softDelete({ id });
    return result.affected ? true : false;
  }

  async isExist({ reviewId, placeId, userId }: { reviewId?: string; placeId?: string; userId?: string }) {
    if (reviewId) {
      const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
      if (review) {
        return review;
      } else throw new NotFoundException(`리뷰 정보가 존재하지 않습니다`);
    }
    if (placeId) {
      const place = await this.placeRepository.findOne({ where: { id: placeId } });
      if (place) {
        return place;
      } else throw new NotFoundException('장소 정보가 존재하지 않습니다');
    }
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        return user;
      } else throw new NotFoundException('유저 정보가 존재하지 않습니다');
    }
  }
}

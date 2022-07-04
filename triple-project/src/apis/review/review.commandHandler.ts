import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from '../place/entities/place.entity';
import { ReviewImage } from '../reviewImage/entities/reviewImage.entity';
import { User } from '../user/entities/user.entity';
import { Review } from './entities/review.entity';
import { CreateReviewCommand } from './review.command';
import { ReviewCreatedEvent, TestEvent } from './review.event';

export enum Type {
  REVIEW = 'REVIEW',
}

export enum Action {
  ADD = 'ADD',
  MOD = 'MOD',
  DELETE = 'DELETE',
}

@Injectable()
@CommandHandler(CreateReviewCommand)
export class CreateReviewHandler implements ICommandHandler<CreateReviewCommand> {
  constructor(
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewImage) private readonly reviewImageRepository: Repository<ReviewImage>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Place) private readonly placeRepository: Repository<Place>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateReviewCommand): Promise<ReviewCreatedEvent> {
    const { placeId, userId, content, imgUrls } = command;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const place = await this.placeRepository.findOne({ where: { id: placeId } });

    const isExist = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoin('review.user', 'user')
      .leftJoin('review.place', 'place')
      .where({ user })
      .andWhere({ place })
      .getOne();
    if (isExist) throw new UnprocessableEntityException('장소에 대한 리뷰가 이미 존재합니다');

    const images = await Promise.all(
      imgUrls.map(el => {
        return this.reviewImageRepository.save({ url: el });
      }),
    );

    const result = await this.reviewRepository.save({
      user,
      place,
      content,
      reviewImages: images,
    });
    const reviewId = result.id;
    const attachedPhotoIds = result.reviewImages.map(el => el.id);
    const type = Type.REVIEW;
    const action = Action.ADD;

    this.eventBus.publish(new ReviewCreatedEvent(content, userId, reviewId, placeId, attachedPhotoIds, type, action));
    this.eventBus.publish(new TestEvent());

    return new ReviewCreatedEvent(content, userId, reviewId, placeId, attachedPhotoIds, type, action);
  }
}

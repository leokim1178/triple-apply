import { Body, Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from './type/event.type';
import { Review } from '../review/entities/review.entity';

import { EventInput } from './dto/reviewEventInput';
import { Event } from './entites/event.entity';
import { EventService } from './event.service';
import { ReviewEventHandler } from './eventHandlers/reviewEvent.handler';
import {
  ReviewCreatedPointEvent,
  ReviewDeletedPointEvent,
  ReviewLogEvent,
  ReviewUpdatedPointEvent,
} from './events/review.events';

@ApiTags('이벤트')
@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly eventBus: EventBus,
    private readonly reviewEventHandler: ReviewEventHandler,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  @Post()
  @ApiResponse({ type: ReviewLogEvent, status: 200, description: '이벤트 생성 성공' })
  @ApiOperation({ description: '이벤트 생성 api입니다', summary: '이벤트 생성' })
  @ApiBody({ type: EventInput })
  async createReviewEvent(@Body() event: EventInput): Promise<ReviewLogEvent> {
    const content = event.content;
    const userId = event.userId;
    const reviewId = event.reviewId;
    const placeId = event.placeId;
    const type = event.type;
    const action = event.action;
    const attachedPhotoIds = event.attachedPhotoIds;
    this.eventBus.publish(new ReviewLogEvent(content, userId, reviewId, placeId, type, action, attachedPhotoIds));

    const review = await this.reviewRepository.findOne({
      where: {
        id: reviewId,
      },
      relations: ['user', 'place', 'reviewImages'],
    });
    if (!review) throw new NotFoundException(`리뷰 정보가 존재하지 않습니다`);

    if (action === Action.ADD) {
      this.eventBus.publish(new ReviewCreatedPointEvent(userId, reviewId, type, action));
    }

    if (action === Action.MOD) {
      const lastImagePoint = review.imagePoint;

      this.eventBus.publish(new ReviewUpdatedPointEvent(userId, reviewId, type, action, lastImagePoint));
    }

    if (action === Action.DELETE) {
      const reviewPoint = review.defaultPoint + review.imagePoint + review.bonusPoint;
      this.eventBus.publish(new ReviewDeletedPointEvent(userId, reviewId, type, action, reviewPoint));
    }

    return new ReviewLogEvent(content, userId, reviewId, placeId, type, action, attachedPhotoIds);
  }
}

import { BadRequestException, Body, Controller, NotFoundException, Post, ValidationPipe } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action, Type } from './type/event.type';
import { Review } from '../review/entities/review.entity';
import { EventInput } from './dto/ReviewEventInput';
import {
  ReviewCreatedPointEvent,
  ReviewDeletedPointEvent,
  ReviewLogEvent,
  ReviewUpdatedPointEvent,
} from './events/review.events';

/**
 * @author leokim1178
 * @summary 이벤트 관련 api입니다
 * @link http://localhost:3001/api-docs/#/%EC%9D%B4%EB%B2%A4%ED%8A%B8
 */
@ApiTags('이벤트')
@Controller('events')
export class EventController {
  constructor(
    private readonly eventBus: EventBus,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  @Post()
  @ApiResponse({ type: ReviewLogEvent, status: 200, description: '이벤트 생성 성공' })
  @ApiBadRequestResponse({ status: 400, description: '올바른 요청이 아닙니다' })
  @ApiNotFoundResponse({ status: 404, description: '리뷰 정보가 존재하지 않습니다' })
  @ApiOperation({ description: '이벤트 생성 api입니다', summary: '이벤트 생성' })
  @ApiBody({ type: EventInput })
  async createReviewEvent(@Body(ValidationPipe) event: EventInput): Promise<ReviewLogEvent> {
    const content = event.content;
    const userId = event.userId;
    const reviewId = event.reviewId;
    const placeId = event.placeId;
    const type = event.type;
    const action = event.action;
    const attachedPhotoIds = event.attachedPhotoIds;

    const logEvent = new ReviewLogEvent(content, userId, reviewId, placeId, type, action, attachedPhotoIds);

    if (Type.REVIEW === type) this.eventBus.publish(logEvent);
    else throw new BadRequestException('이벤트 type이 REVIEW가 아닙니다');
    const review = await this.reviewRepository.findOne({
      where: {
        id: reviewId,
      },
      relations: ['user', 'place', 'reviewImages'],
    });
    if (!review) throw new NotFoundException(`리뷰 정보가 존재하지 않습니다`);

    switch (action) {
      case Action.ADD: {
        this.eventBus.publish(new ReviewCreatedPointEvent(userId, reviewId, type, action));
        break;
      }
      case Action.MOD: {
        const lastImagePoint = review.imagePoint;
        this.eventBus.publish(new ReviewUpdatedPointEvent(userId, reviewId, type, action, lastImagePoint));
        break;
      }
      case Action.DELETE: {
        const reviewPoint = review.defaultPoint + review.imagePoint + review.bonusPoint;
        this.eventBus.publish(new ReviewDeletedPointEvent(userId, reviewId, type, action, reviewPoint));
        break;
      }
      default:
        throw new BadRequestException('이벤트 action이 올바르지 않습니다');
    }

    return logEvent;
  }
}

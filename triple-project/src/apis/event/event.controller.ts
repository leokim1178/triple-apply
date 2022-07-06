import { Body, Controller, Patch, Post } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Action } from '../pointLog/type/pointLog.type';
import { ReviewEventOutput } from '../review/dto/ReviewOutput';
import { ReviewCreatedEvent } from '../review/events/reviewCreated.events';
import { ReviewDeletedEvent } from '../review/events/reviewDeleted.event';
import { ReviewUpdatedEvent } from '../review/events/reviewUpdated.event';
import { ReviewEventInput } from './dto/ReviewEventInput';

@ApiTags('이벤트')
@Controller('events')
export class EventController {
  constructor(private readonly eventBus: EventBus) {}

  @Post()
  @ApiResponse({ type: ReviewEventOutput, status: 200, description: '이벤트 생성 성공' })
  @ApiOperation({ description: '이벤트 생성 api입니다', summary: '이벤트 생성' })
  @ApiBody({ type: ReviewEventInput })
  createReviewEvent(@Body() event: ReviewEventInput) {
    const content = event.content;
    const userId = event.userId;
    const reviewId = event.reviewId;
    const placeId = event.placeId;
    const type = event.type;
    const action = event.action;
    const attachedPhotoIds = event.attachedPhotoIds;
    if (action === Action.ADD)
      this.eventBus.publish(new ReviewCreatedEvent(content, userId, reviewId, placeId, type, action, attachedPhotoIds));

    if (action === Action.MOD)
      this.eventBus.publish(new ReviewUpdatedEvent(content, userId, reviewId, placeId, type, action, attachedPhotoIds));

    if (action === Action.DELETE)
      this.eventBus.publish(new ReviewDeletedEvent(content, userId, reviewId, placeId, type, action, attachedPhotoIds));

    return new ReviewCreatedEvent(content, userId, reviewId, placeId, type, action, attachedPhotoIds);
  }
}

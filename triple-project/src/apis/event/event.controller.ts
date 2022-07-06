import { Body, Controller, Patch, Post } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CreateReviewEventInput } from './dto/createReviewEventInput';
import { ReviewCreatedEvent } from './events/reviewCreated.event';

@ApiTags('이벤트')
@Controller('events')
export class EventController {
  constructor(private readonly eventBus: EventBus) {}

  @Post()
  createReviewEvent(@Body() event: CreateReviewEventInput) {
    const content = event.content;
    const userId = event.userId;
    const reviewId = event.reviewId;
    const placeId = event.placeId;
    const type = event.type;
    const action = event.action;
    const attachedPhotoIds = event.attachedPhotoIds;
    this.eventBus.publish(new ReviewCreatedEvent(content, userId, reviewId, placeId, type, action, attachedPhotoIds));
    return new ReviewCreatedEvent(content, userId, reviewId, placeId, type, action, attachedPhotoIds);
  }
}

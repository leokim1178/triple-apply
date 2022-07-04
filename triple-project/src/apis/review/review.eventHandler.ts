import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReviewCreatedEvent, TestEvent } from './dto/review.events';

@EventsHandler(ReviewCreatedEvent, TestEvent)
export class ReviewEventsHandler implements IEventHandler<ReviewCreatedEvent | TestEvent> {
  //
  async handle(event: ReviewCreatedEvent | TestEvent) {
    switch (event.name) {
      case ReviewCreatedEvent.name: {
        console.log('create Event!');
        const { content, userId, reviewId, placeId, attachedPhotoIds, type, action } = event as ReviewCreatedEvent;
        break;
      }
      case TestEvent.name: {
        console.log('TestEvent!');
        break;
      }
      default:
        break;
    }
  }
}

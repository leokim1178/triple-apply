import { IEvent } from '@nestjs/cqrs';

export abstract class CqrsEvent {
  constructor(readonly name: string) {}
}

export class ReviewCreatedEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly content: string, //
    readonly userId: string,
    readonly reviewId: string,
    readonly placeId: number,
    readonly attachedPhotoIds: string[],
    readonly type: string,
    readonly action: string,
  ) {
    super(ReviewCreatedEvent.name);
  }
}

export class TestEvent extends CqrsEvent implements IEvent {
  constructor() {
    super(TestEvent.name);
  }
}

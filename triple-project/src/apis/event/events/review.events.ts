import { IEvent } from '@nestjs/cqrs';
import { Action, Type } from 'src/apis/event/type/event.type';

export abstract class CqrsEvent {
  constructor(readonly name: string) {}
}

export class ReviewLogEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly content: string, //
    readonly userId: string,
    readonly reviewId: string,
    readonly placeId: string,
    readonly type: Type,
    readonly action: Action,
    readonly attachedPhotoIds?: string[],
  ) {
    super(ReviewLogEvent.name);
  }
}
export class ReviewCreatedPointEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly userId: string, //
    readonly reviewId: string,
    readonly type: Type,
    readonly action: Action,
  ) {
    super(ReviewCreatedPointEvent.name);
  }
}

export class ReviewUpdatedPointEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly userId: string, //
    readonly reviewId: string,
    readonly type: Type,
    readonly action: Action,
    readonly lastImagePoint: number,
  ) {
    super(ReviewUpdatedPointEvent.name);
  }
}

export class ReviewDeletedPointEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly userId: string, //
    readonly reviewId: string,
    readonly type: Type,
    readonly action: Action,
    readonly reviewPoint: number,
  ) {
    super(ReviewDeletedPointEvent.name);
  }
}

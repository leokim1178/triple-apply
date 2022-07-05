import { IEvent } from '@nestjs/cqrs';
import { Action, Type } from 'src/apis/pointLog/type/pointLog.type';

export abstract class CqrsEvent {
  constructor(readonly name: string) {}
}

export class ReviewUpdatedEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly content: string, //
    readonly userId: string,
    readonly reviewId: string,
    readonly placeId: string,
    readonly type: Type,
    readonly action: Action,
    readonly attachedPhotoIds?: string[],
    readonly lastImagePoint?: number,
  ) {
    super(ReviewUpdatedEvent.name);
  }
}
export class ReviewUpdatedPointEvent extends ReviewUpdatedEvent {}

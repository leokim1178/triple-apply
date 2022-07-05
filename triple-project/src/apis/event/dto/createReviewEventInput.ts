import { Action, Type } from 'src/apis/pointLog/type/pointLog.type';

export class CreateReviewEventInput {
  content: string;
  userId: string;
  reviewId: string;
  placeId: string;
  attachedPhotoIds: string[];
  type: Type;
  action: Action;
}

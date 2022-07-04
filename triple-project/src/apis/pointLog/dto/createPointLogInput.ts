export class CreatePointLogInput {
  content: string;
  userId: string;
  reviewId: string;
  placeId: number;
  attachedPhotoIds: string[];
  type: string;
  action: string;
}

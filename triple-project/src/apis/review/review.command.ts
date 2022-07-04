import { ICommand } from '@nestjs/cqrs';

export class CreateReviewCommand implements ICommand {
  constructor(
    readonly placeId: number,
    readonly userId: string, //
    readonly content?: string,
    readonly imgUrls?: string[],
  ) {}
}

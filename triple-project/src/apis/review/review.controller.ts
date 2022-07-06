import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReviewInput } from './dto/createReviewInput';
import { UpdateReviewInput } from './dto/updateReviewInput';
import { ReviewService } from './review.service';

@ApiTags('리뷰')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService, private commandBus: CommandBus) {}

  @Get(':id')
  @ApiOperation({ description: '리뷰 조회 api입니다', summary: '리뷰 조회' })
  fetchReview(@Param('id') id: string) {
    return this.reviewService.fetch({ id });
  }

  @Get()
  fetchReviews() {
    return this.reviewService.fetchAll();
  }

  @Post()
  async createReview(
    @Body() createReviewInput: CreateReviewInput, //
  ) {
    const { placeId, imgUrls, content, userId } = createReviewInput;

    const place = await this.reviewService.isExist({ placeId });
    const user = await this.reviewService.isExist({ userId });
    return await this.reviewService.create({ user, place, imgUrls, content });
  }

  @Patch(':id')
  async updateReview(
    @Param('id') id: string, //
    @Body() updateReviewInput: UpdateReviewInput,
  ) {
    return await this.reviewService.update({ id, updateReviewInput });
  }

  @Delete(':id')
  deleteReview(@Param('id') id: string) {
    return this.reviewService.delete({ id });
  }
}

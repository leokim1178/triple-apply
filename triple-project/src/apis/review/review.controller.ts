import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReviewInput } from './dto/createReviewInput';
import { UpdateReviewInput } from './dto/updateReviewInput';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';

@ApiTags('리뷰')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService, private commandBus: CommandBus) {}

  @Get(':id')
  @ApiResponse({ type: Review, status: 200, description: '리뷰 정보 조회 성공' })
  @ApiParam({ name: 'id', description: '리뷰의 PK(uuid)입니다' })
  @ApiOperation({ description: '리뷰 조회 api입니다', summary: '리뷰 조회' })
  fetchReview(@Param('id') id: string): Promise<Review> {
    return this.reviewService.fetch({ id });
  }

  @Get('list')
  @ApiResponse({ type: Review, isArray: true, status: 200, description: '리뷰 리스트 조회 성공' })
  @ApiOperation({ description: '리뷰 리스트 조회 api입니다', summary: '리뷰 리스트 조회' })
  fetchReviews(): Promise<Review[]> {
    return this.reviewService.fetchAll();
  }

  @Post()
  @ApiResponse({ type: Review, status: 200, description: '리뷰 생성 성공' })
  @ApiOperation({ description: '리뷰 생성 api입니다', summary: '리뷰 생성' })
  @ApiBody({ type: CreateReviewInput })
  async createReview(
    @Body() createReviewInput: CreateReviewInput, //
  ): Promise<Review> {
    const { placeId, imgUrls, content, userId } = createReviewInput;

    const place = await this.reviewService.isExist({ placeId });
    const user = await this.reviewService.isExist({ userId });
    return await this.reviewService.create({ user, place, imgUrls, content });
  }

  @Patch(':id')
  @ApiResponse({ type: Review, status: 200, description: '리뷰 수정 성공' })
  @ApiOperation({ description: '리뷰 수정 api입니다', summary: '리뷰 수정' })
  @ApiBody({ type: UpdateReviewInput })
  @ApiParam({ name: 'id', description: '리뷰의 PK(uuid)입니다' })
  async updateReview(
    @Param('id') id: string, //
    @Body() updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    return await this.reviewService.update({ id, updateReviewInput });
  }

  @Delete(':id')
  @ApiResponse({ type: Boolean, status: 200, description: '리뷰 삭제 성공' })
  @ApiOperation({ description: '리뷰 삭제 api입니다', summary: '리뷰 삭제' })
  @ApiParam({ name: 'id', description: '리뷰의 PK(uuid)입니다' })
  deleteReview(@Param('id') id: string): Promise<boolean> {
    return this.reviewService.delete({ id });
  }
}

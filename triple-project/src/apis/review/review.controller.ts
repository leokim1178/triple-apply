import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';

import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateReviewInput } from './dto/createReviewInput';
import { UpdateReviewInput } from './dto/updateReviewInput';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';

/**
 * @author leokim1178
 * @summary 이벤트 관련 api입니다
 * @link http://localhost:3001/api-docs/#/%EB%A6%AC%EB%B7%B0
 * @description api 설명은 주석 대신 swagger description으로 대체했습니다
 */
@ApiTags('리뷰')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiResponse({ type: Review, status: 200, description: '리뷰 정보 조회 성공' })
  @ApiNotFoundResponse({ status: 404, description: '리뷰 정보가 존재하지 않습니다' })
  @ApiQuery({ name: 'id', description: '리뷰의 PK(uuid)입니다' })
  @ApiOperation({ description: '리뷰 조회 api입니다', summary: '리뷰 조회' })
  fetchReview(@Query('id') id: string): Promise<Review> {
    return this.reviewService.fetch({ id });
  }

  @Get('list')
  @ApiResponse({ type: Review, isArray: true, status: 200, description: '리뷰 리스트 조회 성공' })
  @ApiNotFoundResponse({ status: 404, description: '리뷰 정보가 존재하지 않습니다' })
  @ApiOperation({ description: '리뷰 리스트 조회 api입니다', summary: '리뷰 리스트 조회' })
  fetchReviews(): Promise<Review[]> {
    return this.reviewService.fetchAll();
  }

  @Post()
  @ApiResponse({ type: Review, status: 201, description: '리뷰 생성 성공' })
  @ApiNotFoundResponse({ status: 404, description: '리뷰 정보가 존재하지 않습니다' })
  @ApiUnprocessableEntityResponse({ status: 422, description: '장소에 대한 리뷰가 이미 존재합니다' })
  @ApiInternalServerErrorResponse({ status: 500, description: '서버 내부 오류입니다' })
  @ApiOperation({
    description: `
    리뷰 생성 api입니다
    생성과 동시에 eventBus를 통해 해당이벤트가 eventHandler로 전달됩니다
    eventHandler는 이벤트 로그 저장과 유저 포인트 추가&포인트 로그 저장을 수행합니다
    `,
    summary: '리뷰 생성',
  })
  @ApiBody({ type: CreateReviewInput })
  async createReview(
    @Body(ValidationPipe) createReviewInput: CreateReviewInput, //
  ): Promise<Review> {
    const { placeId, imgUrls, content, userId } = createReviewInput;

    const place = await this.reviewService.isExist({ placeId });
    const user = await this.reviewService.isExist({ userId });
    return await this.reviewService.create({ user, place, imgUrls, content });
  }

  @Patch(':id')
  @ApiResponse({ type: Review, status: 200, description: '리뷰 수정 성공' })
  @ApiNotFoundResponse({ status: 404, description: '관련 정보가 존재하지 않습니다' })
  @ApiInternalServerErrorResponse({ status: 500, description: '서버 내부 오류입니다' })
  @ApiOperation({
    description: `
    리뷰 수정 api입니다
    수정과 동시에 eventBus를 통해 해당이벤트가 eventHandler로 전달됩니다
    eventHandler는 이벤트 로그 저장과 유저 포인트 수정&포인트 로그 저장을 수행합니다
    `,
    summary: '리뷰 수정',
  })
  @ApiBody({ type: UpdateReviewInput })
  @ApiParam({ name: 'id', description: '리뷰의 PK(uuid)입니다' })
  async updateReview(
    @Param('id') id: string, //
    @Body(ValidationPipe) updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    const review = await this.reviewService.isExist({ reviewId: id });
    return await this.reviewService.update({ review, updateReviewInput });
  }

  @Delete(':id')
  @ApiResponse({ type: Boolean, status: 200, description: '리뷰 삭제 성공' })
  @ApiNotFoundResponse({ status: 404, description: '관련 정보가 존재하지 않습니다' })
  @ApiInternalServerErrorResponse({ status: 500, description: '서버 내부 오류입니다' })
  @ApiOperation({
    description: `
    리뷰 삭제 api입니다
    삭제와 동시에 eventBus를 통해 해당이벤트가 eventHandler로 전달됩니다
    eventHandler는 이벤트 로그 저장과 유저 포인트 삭감&포인트 로그 저장을 수행합니다
    `,
    summary: '리뷰 삭제',
  })
  @ApiParam({ name: 'id', description: '리뷰의 PK(uuid)입니다' })
  async deleteReview(@Param('id') id: string): Promise<boolean> {
    const review = await this.reviewService.isExist({ reviewId: id });
    return this.reviewService.delete({ review });
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PointLogsOutput } from './dto/pointLogsOutput';
import { RecentPointOutput } from './dto/RecentPointOutput';
import { PointLogService } from './pointLog.service';

/**
 * @author leokim1178
 * @summary 포인트 로그 관련 api입니다
 * @link http://localhost:3001/api-docs/#/%ED%8F%AC%EC%9D%B8%ED%8A%B8%20%EB%A1%9C%EA%B7%B8
 */
@ApiTags('포인트 로그')
@Controller('point')
export class PointLogController {
  constructor(private readonly pointLogService: PointLogService) {}

  @Get(':userId')
  @ApiResponse({
    type: RecentPointOutput,
    status: 200,
    description: '유저가 보유한 현재 포인트와 가장 최근의 포인트로그를 불러옵니다',
  })
  @ApiNotFoundResponse({ status: 404, description: '유저 정보가 존재하지 않습니다' })
  @ApiInternalServerErrorResponse({ status: 500, description: '서버 내부 오류입니다' })
  @ApiOperation({
    description: '유저의 가장 최근 포인트 관련 로그를 불러오는 api입니다',
    summary: '유저 최근 포인트 로그 조회',
  })
  @ApiParam({ name: 'userId', description: '유저의 PK(uuid)입니다' })
  fetchRecentLog(
    @Param('userId')
    userId: string,
  ): Promise<RecentPointOutput> {
    return this.pointLogService.findRecentLog({ userId });
  }

  @Get('list/:userId')
  @ApiResponse({
    type: PointLogsOutput,
    status: 200,
    description: '유저가 보유한 현재 포인트와 가장 최근의 포인트 로그 리스트를 불러옵니다',
  })
  @ApiNotFoundResponse({ status: 404, description: '관련 정보가 존재하지 않습니다' })
  @ApiInternalServerErrorResponse({ status: 500, description: '서버 내부 오류입니다' })
  @ApiOperation({
    description: `
    유저의 가장 최근의 포인트 관련 로그 리스트를 불러오는 api입니다 
    page 쿼리 파라미터를 입력할 시 10개씩 페이지네이션 됩니다 
    review 쿼리 파라미터를 입력할 시 리뷰 Id에 관련된 로그들로 필터링됩니다`,
    summary: '유저 최근 포인트 로그 리스트 조회',
  })
  @ApiParam({ name: 'userId', description: '유저의 PK(uuid)입니다' })
  @ApiQuery({
    name: 'reviewId',
    description: `
    리뷰의 PK(uuid)입니다 
    선택값입니다 
    입력하지 않을 경우 유저의 모든 로그를 불러옵니다`,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    example: 1,
    description: `
    페이지 번호입니다
    10개씩 카운트하여 페이지네이션합니다
    입력하지 않을 경우 유저의 모든 로그를 불러옵니다
    `,
    required: false,
  })
  fetchLogs(
    @Param('userId') userId: string,
    @Query('reviewId') reviewId?: string,
    @Query('page') page?: number,
  ): Promise<PointLogsOutput> {
    return this.pointLogService.findLogs({ userId, reviewId, page });
  }
}

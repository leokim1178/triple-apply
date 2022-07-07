import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PointLog } from '../entities/pointLog.entity';

export class PointLogsOutput {
  @ApiPropertyOptional({
    description: `
    포인트 로그 배열
    로그 관련 리뷰와 리뷰 관련 여행지까지 리턴합니다
    `,
    isArray: true,
    example: [
      {
        id: 'c0200841-6f31-4355-99c9-7c3808807356',
        recentChange: 3,
        total: 65,
        type: 'REVIEW',
        action: 'ADD',
        createdAt: '2022-07-07T03:20:25.096Z',
        review: {
          id: 'db69ce2f-145a-4f7c-bef5-b6be7ecb0d4c',
          content: '오늘 가봤는데 너무 좋아요!',
          defaultPoint: 1,
          imagePoint: 1,
          bonusPoint: 1,
          createdAt: '2022-07-07T03:20:25.040Z',
          updatedAt: '2022-07-07T03:20:25.040Z',
          deletedAt: null,
          place: {
            id: '6b77df3b-0c63-4c81-b5a0-465b7037fb71',
            name: '한옥마을 카페',
            region: '서울',
            detail: '대표메뉴 : 아메리카노',
            createdAt: '2022-07-06T23:46:58.697Z',
            updatedAt: '2022-07-06T23:46:58.697Z',
            deletedAt: null,
          },
        },
      },
    ],
  })
  pointLogs: PointLog[];

  @ApiProperty({ description: '유저에 해당하는 포인트 로그의 총개수입니다', example: 12 })
  total: number;

  @ApiProperty({
    description: `
    한 페이지에 해당하는 포인트 로그의 개수입니다
    페이지네이션이 되었을때 나타납니다
    기본값 10으로 설정했습니다
  `,
    example: 10,
  })
  count?: number;

  @ApiProperty({ description: '사용자가 요청한 페이지 수를 나타냅니다', example: 1 })
  page?: number;
}

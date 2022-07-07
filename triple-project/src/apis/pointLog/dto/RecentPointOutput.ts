import { ApiProperty } from '@nestjs/swagger';
import { PointLog } from '../entities/pointLog.entity';

export class RecentPointOutput {
  @ApiProperty({ description: '조회한 사용자의 이메일입니다', example: 'leo3179@naver.com' })
  userEmail: string;
  @ApiProperty({ description: '유저가 보유한 총 포인트양입니다', example: 58 })
  totalPoint: number;
  @ApiProperty({
    description: '가장 최근 포인트 로그 하나를 불러옵니다',
    example: {
      id: 'c0200841-6f31-4355-99c9-7c3808807356',
      recentChange: 3,
      total: 65,
      type: 'REVIEW',
      action: 'ADD',
      createdAt: '2022-07-07T03:20:25.096Z',
    },
  })
  recentPointLog: PointLog;
}

import { ApiProperty } from '@nestjs/swagger';
import { Action, Type } from 'src/config/type/pointLog.type';

export class EventInput {
  @ApiProperty({ description: '리뷰 내용', example: '오늘 가봤는데 너무 좋아요!' })
  content: string;

  @ApiProperty({ description: '리뷰의 작성자 Id(uuid)', example: 'uuid' })
  userId: string;

  @ApiProperty({ description: '리뷰가 작성된 장소 Id(uuid)', example: 'uuid' })
  placeId: string;

  @ApiProperty({ description: '리뷰 Id(uuid)', example: 'uuid' })
  reviewId: string;

  @ApiProperty({ description: '이벤트 주제', example: 'REVIEW', enum: Type })
  type: Type;

  @ApiProperty({ description: '이벤트 내용', example: 'ADD', enum: Action })
  action: Action;

  @ApiProperty({
    description: '리뷰에 첨부된 이미지 Id(uuid) 배열',
    isArray: true,
    nullable: true,
    example: ['uuid1', 'uuid2'],
  })
  attachedPhotoIds?: string[];
}

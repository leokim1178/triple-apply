import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewInput {
  @ApiProperty({ description: '리뷰 내용', example: '오늘 가봤는데 너무 좋아요!' })
  content: string;
  @ApiProperty({
    description: '리뷰에 첨부된 이미지 Id(uuid) 배열',
    nullable: true,
    example: ['photo1.png', 'photo2.jpg'],
  })
  imgUrls?: string[];

  @ApiProperty({ description: '리뷰가 작성된 장소 Id(uuid)', example: 'uuid' })
  placeId: string;

  @ApiProperty({ description: '리뷰의 작성자 Id(uuid)', example: 'uuid' })
  userId: string;
}

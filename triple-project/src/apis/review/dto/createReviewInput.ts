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

  @ApiProperty({ description: '리뷰가 작성된 여행지 Id(uuid)', example: '6b77df3b-0c63-4c81-b5a0-465b7037fb71' })
  placeId: string;

  @ApiProperty({ description: '리뷰의 작성자 Id(uuid)', example: '3f586904-201b-49ab-95e0-d36e9f3cf935' })
  userId: string;
}

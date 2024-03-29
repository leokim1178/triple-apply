import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateReviewInput {
  @IsString()
  @ApiProperty({ description: '리뷰 내용', example: '오늘 가봤는데 너무 좋아요!' })
  content: string;

  @ApiProperty({
    description: '리뷰에 첨부된 이미지 url 배열',
    nullable: true,
    isArray: true,
    example: ['photo3.png', 'photo4.jpg'],
  })
  imgUrls?: string[];
}

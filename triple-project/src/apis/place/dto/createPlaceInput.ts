import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePlaceInput {
  @IsString()
  @ApiProperty({
    example: '서울',
    description: '여행지가 위치한 지역',
  })
  region: string;

  @IsString()
  @ApiProperty({
    example: '한옥마을 카페',
    description: '여행지 이름',
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: '대표메뉴 : 아메리카노',
    description: '여행지 상세 설명',
  })
  detail: string;
}

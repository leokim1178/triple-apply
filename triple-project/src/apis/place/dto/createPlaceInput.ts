import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceInput {
  @ApiProperty({
    example: '서울',
    description: '여행지가 위치한 지역',
  })
  region: string;

  @ApiProperty({
    example: '한옥마을 카페',
    description: '여행지 이름',
  })
  name: string;

  @ApiProperty({
    example: '대표메뉴 : 아메리카노',
    description: '여행지 상세 설명',
  })
  detail: string;
}

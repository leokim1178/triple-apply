import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInput {
  @ApiProperty({ description: '유저 정보', example: '부산 거주중인 김태영이라고 합니다' })
  information: string;
}

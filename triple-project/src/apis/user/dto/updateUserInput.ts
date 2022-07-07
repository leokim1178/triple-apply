import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserInput {
  @IsString()
  @ApiProperty({ description: '유저 정보', example: '부산 거주중인 김태영이라고 합니다' })
  information: string;
}

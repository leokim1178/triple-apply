import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInput {
  @ApiProperty({ description: '이메일 주소', example: 'leo3179@naver.com' })
  email: string;
  @ApiProperty({ description: '비밀번호', example: '1234' })
  password: string;
  @ApiProperty({ description: '유저 정보', example: '서울 거주중인 김태영이라고 합니다' })
  information: string;
}

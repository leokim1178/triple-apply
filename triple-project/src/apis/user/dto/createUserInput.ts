import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserInput {
  @IsEmail()
  @ApiProperty({ description: '이메일 주소', example: 'leo3179@naver.com' })
  email: string;

  @IsString()
  @ApiProperty({ description: '비밀번호', example: '1234' })
  password: string;

  @IsString()
  @ApiProperty({ description: '유저 정보', example: '서울 거주중인 김태영이라고 합니다' })
  information: string;
}

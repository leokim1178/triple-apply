import { Body, Controller, Delete, Get, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiNotFoundResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserInput } from './dto/createUserInput';
import { UpdateUserInput } from './dto/updateUserInput';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

/**
 * @author leokim1178
 * @summary 이벤트 관련 api입니다
 * @link http://localhost:3001/api-docs/#/%EC%9C%A0%EC%A0%80
 */
@ApiTags('유저')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //
  @Get()
  @ApiResponse({ type: User, status: 200, description: '유저 정보 조회 성공' })
  @ApiNotFoundResponse({ status: 404, description: '유저 정보가 존재하지 않습니다' })
  @ApiParam({ name: 'email', example: 'leo3179@naver.com' })
  @ApiOperation({ description: '유저 조회 api입니다', summary: '유저 조회' })
  fetchUser(@Query('email') email: string): Promise<User> {
    return this.userService.fetch({ email });
  }

  //
  @Get('list')
  @ApiResponse({ type: User, isArray: true, status: 200, description: '유저 리스트 조회 성공' })
  @ApiNotFoundResponse({ status: 404, description: '유저 정보가 존재하지 않습니다' })
  @ApiOperation({ description: '유저 리스트 조회 api입니다', summary: '유저 리스트 조회' })
  fetchUsers(): Promise<User[]> {
    return this.userService.fetchAll();
  }

  //
  @Post()
  @ApiResponse({ type: User, status: 200, description: '유저 생성 성공' })
  @ApiBody({ type: CreateUserInput })
  @ApiOperation({ description: '유저 생성 api입니다', summary: '유저 생성' })
  createUser(
    @Body(ValidationPipe)
    createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.create({ createUserInput });
  }

  //
  @Patch()
  @ApiResponse({ type: User, status: 200, description: '유저 정보 수정 성공' })
  @ApiNotFoundResponse({ status: 404, description: '유저 정보가 존재하지 않습니다' })
  @ApiQuery({ name: 'email', example: 'leo3179@naver.com' })
  @ApiBody({
    type: UpdateUserInput,
  })
  @ApiOperation({ description: '유저 정보 수정 api입니다', summary: '유저 정보 수정' })
  updateUser(
    @Query('email') email: string,
    @Body(ValidationPipe)
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update({ email, updateUserInput });
  }

  //
  @Delete()
  @ApiResponse({ type: Boolean, status: 200, description: '유저 정보 삭제 성공' })
  @ApiNotFoundResponse({ status: 404, description: '유저 정보가 존재하지 않습니다' })
  @ApiQuery({ name: 'email', example: 'leo3179@naver.com' })
  @ApiOperation({ description: '유저 정보 삭제 api입니다', summary: '유저 정보 삭제' })
  deleteUser(@Query('email') email: string): Promise<boolean> {
    return this.userService.delete({ email });
  }
}

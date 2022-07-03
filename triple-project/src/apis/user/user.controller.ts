import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { CreateUserInput } from './dto/createUserInput';
import { UpdateUserInput } from './dto/updateUserInput';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  fetchUser(@Query('email') email: string) {
    return this.userService.fetch({ email });
  }

  @Get('list')
  fetchUsers() {
    return this.userService.fetchAll();
  }

  @Post()
  createUser(
    @Body()
    createUserInput: CreateUserInput,
  ) {
    return this.userService.create({ createUserInput });
  }

  @Patch()
  updateUser(
    @Query('email') email: string,
    @Body()
    updateUserInput: UpdateUserInput,
  ) {
    return this.userService.update({ email, updateUserInput });
  }

  @Delete()
  deleteUser(@Query('email') email: string) {
    return this.userService.delete({ email });
  }
}

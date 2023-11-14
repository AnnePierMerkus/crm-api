import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/create')
  async create(@Body() createUserDto: UserDto) {
    const user = await this.userService.newCreate(createUserDto);
    return {
      success: true,
      user: user,
    };
  }

  @Get()
  async findAll() {
    return {
      success: true,
      users: await this.userService.findAll(),
    };
  }
}

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { RegisterDTO } from 'src/user/dto/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('/onlyauth')
  @UseGuards(AuthGuard('jwt'))
  async hiddenInformation() {
    return 'hidden information';
  }
  @Get('/anyone')
  async publicInformation() {
    return 'this can be seen by anyone';
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    const user = await this.userService.create(registerDTO);
    const payload = {
      email: user.email,
    };

    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const user = await this.userService.findByLogin(loginDTO);
    const payload = {
      email: user.email,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async profile(/*@Req() req: Request*/) {
    return { success: true };
  }

  @Post('forgotpassword')
  async forgotPassword(@Body() body: { email: string }) {
    return {
      success: await this.authService.forgotPassword(body.email),
    };
  }

  @Post('resetpassword')
  async resetPassword(
    @Body() resetPassword: { newPasswordToken: string; newPassword: string },
  ) {
    console.debug(resetPassword);
    const forgottenPasswordModel =
      await this.authService.getForgottenPasswordModel(
        resetPassword.newPasswordToken,
      );
    if (!forgottenPasswordModel) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
    const isNewPasswordChanged = await this.userService.setPassword(
      forgottenPasswordModel.email,
      resetPassword.newPassword,
    );

    if (forgottenPasswordModel) {
      await forgottenPasswordModel.deleteOne();
    }

    return { success: isNewPasswordChanged };
  }
}

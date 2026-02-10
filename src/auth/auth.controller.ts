import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { responseHandler } from 'src/libs/helpers/response.helper';
import { StatusType } from 'src/libs/utils/constants/enums';
import { Messages } from 'src/libs/utils/constants/messages';
import { ForgetPassDto } from './dto/forget-pass.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      message: Messages.LOGIN_SUCCESS,
      data: data,
    });
  }

  @Post('/forget-pass')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Body() dto: ForgetPassDto) {
    await this.authService.forgetPassword(dto);

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      message: Messages.RESET_LINK_SENT,
    });
  }
}

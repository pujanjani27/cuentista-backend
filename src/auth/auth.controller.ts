import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, ForgetPassDto, ResetPassDto } from './dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Forget Password' })
  @Post('/forget-password')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Body() dto: ForgetPassDto) {
    return await this.authService.forgetPassword(dto);
  }

  @ApiOperation({ summary: 'Reset Password' })
  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPassDto) {
    return await this.authService.resetPassword(dto);
  }
}

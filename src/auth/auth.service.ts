import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { Messages } from 'src/libs/utils/constants/messages';
import { compare, hash } from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDto, ForgetPassDto, ResetPassDto } from './dto';
import { resetPasswordTemplate } from 'src/libs/templates/reset-password.template';
import { responseHandler } from 'src/libs/helpers/response.helper';
import { StatusType } from 'src/libs/utils/constants/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private jwtService: JwtService,
    private config: ConfigService,
    private mailerService: MailerService,
  ) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const findUser = await this.userModel.findOne({ where: { email } });
    if (!findUser) {
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.NOT_FOUND,
        message: `User ${Messages.NOT_FOUND}`,
      });
    }

    const isPasswordValid = await compare(password, findUser.password);
    if (!isPasswordValid)
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.UNAUTHORIZED,
        message: Messages.CREDENTIALS_INVALID,
      });

    const payload = { id: +findUser.id, role: findUser.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      message: Messages.LOGIN_SUCCESS,
      data: { id: +findUser.id, accessToken },
    });
  }

  async forgetPassword(dto: ForgetPassDto) {
    const { email } = dto;

    const findUser = await this.userModel.findOne({
      where: { email },
    });

    if (!findUser)
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.NOT_FOUND,
        message: `User ${Messages.NOT_FOUND}`,
      });

    const otp = Math.floor(100000 + Math.random() * 900000);

    const hashedOtp = await hash(otp.toString(), 10);

    findUser.resetPasswordOtp = hashedOtp;
    findUser.resetPasswordOtpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await findUser.save();

    await this.mailerService.sendMail({
      to: findUser.email,
      subject: 'Reset Password',
      html: resetPasswordTemplate({
        otp: otp.toString(),
        expiresInMinutes: 15,
        appName: 'Cuentista',
      }),
    });

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      message: Messages.OTP_SENT,
    });
  }

  async resetPassword(dto: ResetPassDto) {
    const { otp, email, password } = dto;

    const findUser = await this.userModel.findOne({ where: { email } });
    if (!findUser)
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.NOT_FOUND,
        message: `User ${Messages.NOT_FOUND}`,
      });

    if (!findUser.resetPasswordOtp || !findUser.resetPasswordOtpExpiresAt)
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.BAD_REQUEST,
        message: Messages.INVALID_OTP,
      });

    if (findUser.resetPasswordOtpExpiresAt < new Date())
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.BAD_REQUEST,
        message: Messages.INVALID_OTP,
      });

    const isOtpValid = await compare(otp.toString(), findUser.resetPasswordOtp);
    if (!isOtpValid)
      return responseHandler({
        status: StatusType.ERROR,
        statusCode: HttpStatus.BAD_REQUEST,
        message: Messages.INVALID_OTP,
      });

    findUser.password = password;

    findUser.resetPasswordOtp = null;
    findUser.resetPasswordOtpExpiresAt = null;

    await findUser.save();

    return responseHandler({
      status: StatusType.SUCCESS,
      statusCode: HttpStatus.OK,
      message: Messages.PASSWORD_RESET_SUCCESS,
    });
  }
}

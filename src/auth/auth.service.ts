import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { Messages } from 'src/libs/utils/constants/messages';
import { compare, hash } from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDto, ForgetPassDto, ResetPassDto } from './dto';
import { resetPasswordTemplate } from 'src/libs/templates/reset-password.template';

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

    const user = await this.userModel.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException(Messages.CREDENTIALS_INVALID);

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException(Messages.CREDENTIALS_INVALID);

    const payload = { id: +user.id, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });

    return { id: +user.id, accessToken };
  }

  async forgetPassword(dto: ForgetPassDto) {
    const { email } = dto;

    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) throw new BadRequestException(Messages.NOT_FOUND);

    const otp = Math.floor(100000 + Math.random() * 900000);

    const hashedOtp = await hash(otp.toString(), 10);

    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordOtpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset Password',
      html: resetPasswordTemplate({
        otp: otp.toString(),
        expiresInMinutes: 15,
        appName: 'Cuentista',
      }),
    });
  }

  async resetPassword(dto: ResetPassDto) {
    const { otp, email, password } = dto;

    const user = await this.userModel.findOne({ where: { email } });
    if (!user) throw new BadRequestException(Messages.NOT_FOUND);

    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiresAt) {
      throw new BadRequestException(Messages.INVALID_OTP);
    }

    if (user.resetPasswordOtpExpiresAt < new Date()) {
      throw new BadRequestException(Messages.INVALID_OTP);
    }

    const isOtpValid = await compare(otp.toString(), user.resetPasswordOtp);
    if (!isOtpValid) throw new BadRequestException(Messages.INVALID_OTP);

    user.password = password;

    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiresAt = null;

    await user.save();
  }
}

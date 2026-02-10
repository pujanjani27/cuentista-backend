import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { LoginDto } from './dto/login.dto';
import { Messages } from 'src/libs/utils/constants/messages';
import { compare } from 'bcrypt';
import { ForgetPassDto } from './dto/forget-pass.dto';
import crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

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

    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    // const resetLink = '';

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset Password',
      text: `Your reset token is: ${token}`,
    });
  }
}

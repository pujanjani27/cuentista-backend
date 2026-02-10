import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { LoginDto } from './dto/login.dto';
import { Messages } from 'src/libs/utils/constants/messages';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private jwtService: JwtService,
    private config: ConfigService,
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
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
    });

    return { id: +user.id, accessToken };
  }
}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';

@Module({
  imports: [JwtModule.register({}), SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin@1234' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword()
  password: string;
}

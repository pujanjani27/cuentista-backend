import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetPassDto {
  @ApiProperty({ example: 'token' })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'Password123!' })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}

import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetPassDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}

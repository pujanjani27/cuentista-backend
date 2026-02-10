import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPassDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

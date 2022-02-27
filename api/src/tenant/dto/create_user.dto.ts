import { IsBoolean, IsOptional, IsString, IsEmail, MinLength, Matches, MaxLength } from 'class-validator';

export default class CreateUserDto {
  @Matches(/^[A-Za-z][A-Za-z0-9_].{8,32}$/)
  @MinLength(8)
  @MaxLength(32)
  username: string;

  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/)
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsBoolean()
  temporary_password?: boolean;

  @IsEmail()
  email: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsBoolean()
  admin: boolean;
}

import { IsAlpha, Matches, MaxLength, MinLength } from 'class-validator';

export default class LoginDto {
  @IsAlpha()
  @MinLength(3)
  @MaxLength(32)
  realm: string;

  @Matches(/^[A-Za-z][A-Za-z0-9_].{8,32}$/)
  @MinLength(8)
  @MaxLength(32)
  username: string;

  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/)
  @MinLength(8)
  @MaxLength(32)
  password: string;
}

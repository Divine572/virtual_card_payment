import { IsOptional, IsBoolean } from 'class-validator';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // @IsString()
  // @IsNotEmpty()
  // @Match('password')
  // passwordConfirm: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  address: string;

}





export default CreateUserDto;
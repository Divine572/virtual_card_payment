import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsBoolean} from 'class-validator';
import { Match } from 'src/users/decorators/match.decorator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match'})  
  @ApiProperty()
  passwordConfirm: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  state: string;


  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;


  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsBoolean()
  @ApiProperty()
  acceptTerms: boolean;
}



export default RegisterDto;

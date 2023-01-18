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

}



export default RegisterDto;

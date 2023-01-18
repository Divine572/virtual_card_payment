import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  
}



export default LoginDto;

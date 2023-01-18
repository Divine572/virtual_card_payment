import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty} from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty()
  email: string;

}



export default ForgotPasswordDto;

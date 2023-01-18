import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty} from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  passwordConfirm: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  oldPassword: string
  
}



export default UpdatePasswordDto;

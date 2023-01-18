import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsBoolean} from 'class-validator';
import { Match } from 'src/users/decorators/match.decorator';
import { CustomerType } from 'src/users/dtos/createUserDto.dto';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
 

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  customerType: CustomerType

  @IsString()
  @IsNotEmpty()
  phoneNumber: string


  @IsString()
  @IsNotEmpty()
  address: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  state: string

  @IsString()
  @IsNotEmpty()
  postalCode: string

  @IsString()
  @IsNotEmpty()
  country: string

}



export default RegisterDto;

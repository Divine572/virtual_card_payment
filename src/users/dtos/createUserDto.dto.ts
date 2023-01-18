import { IsOptional, IsBoolean } from 'class-validator';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Match } from '../decorators/match.decorator';


export enum CustomerType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company'
}

export class CreateUserDto {
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





export default CreateUserDto;
import { IsOptional, IsBoolean } from 'class-validator';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Match } from '../decorators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';


export enum CustomerType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company'
}

export enum IdentityType {
  NIN = 'NIN',
  BVN = 'BVN',
  CAC = 'CAC',
  TIN = 'TIN'
}

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
 
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerType: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string


  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postalCode: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dob: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identityType: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identityNumber: string

  @ApiProperty()
  companyName?: string

}





export default CreateUserDto;
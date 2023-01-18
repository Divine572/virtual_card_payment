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
  customerType: CustomerType

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
  firstName: string


  @ApiProperty()
  lastName: string

  @ApiProperty()
  dob: string

  @ApiProperty()
  identityType: string

  @ApiProperty()
  identityNumber: string

  @ApiProperty()
  companyName: string

  @ApiProperty()
  companIdentityType: IdentityType

  @ApiProperty()
  companyIdentityNumber: string

}





export default CreateUserDto;
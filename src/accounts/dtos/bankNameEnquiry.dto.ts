import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';


export class BankNameEnquiryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    bankCode: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    accountNumber: string
}
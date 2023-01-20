import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDecimal } from 'class-validator';


export class FundTransferDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    debitAccountId: string;
  
    @ApiProperty()
    @IsOptional()
    creditAccountId?: string

    @ApiProperty()
    @IsOptional()
    beneficiaryBankCode?: string

    @ApiProperty()
    @IsOptional()
    beneficiaryAccountNumber?: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: number

    @ApiProperty()
    @IsOptional()
    narration: string
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CurrencyPair } from 'src/cards/dtos/createCard.dto';

export enum Type {
    WALLET = 'wallet',
    Account = 'account'
}


export enum AccountType {
    SAVINGS = 'savings',
    CURRENT = 'current'
}


export class CreateAccountDto {
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    accountType: AccountType
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    type: Type
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    currency: CurrencyPair
  
}
import { SpendingLimitIntervalType } from './../card.schema';
import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export enum BrandType {
    MASTERCARD = 'MasterCard',
    VERVE = 'Verve',
    VISA = 'Visa'
}

export enum CurrencyPair {
    NGA = 'NGA',
    USA = 'USA'
}


export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    customerId: string;
  
    @IsString()
    @IsNotEmpty()
    type: string;
  
    @IsString()
    @IsNotEmpty()
    brand: BrandType
  
    @IsString()
    @IsNotEmpty()
    currency: CurrencyPair

    @IsNumber()
    @IsNotEmpty()
    spendingLimitAmount: number
  
    @IsString()
    @IsNotEmpty()
    spendingLimitInterval: SpendingLimitIntervalType
  
}
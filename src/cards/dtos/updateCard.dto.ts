import { CurrencyPair, BrandType } from './createCard.dto';
import { SpendingLimitIntervalType } from './../card.schema';
import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';



export class UpdateCardDto {
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
import { CurrencyPair, BrandType } from './createCard.dto';
import { CardStatusType, SpendingLimitIntervalType } from './../card.schema';
import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class UpdateCardDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    status: CardStatusType;

  
}
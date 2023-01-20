import { CurrencyPair, BrandType } from './createCard.dto';
import { CardStatusType, SpendingLimitIntervalType } from './../card.schema';
import { IsEmail, IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class UpdateCardDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    status: CardStatusType;

    @ApiProperty()
    @IsOptional()
    spendingLimitAmount?: number
  
    @ApiProperty()
    @IsOptional()
    spendingLimitInterval?: SpendingLimitIntervalType

  
}
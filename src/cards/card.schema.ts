import { BrandType, CurrencyPair } from './dtos/createCard.dto';
import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import mongoose, { Document, ObjectId } from 'mongoose'
import { Exclude, Transform } from 'class-transformer';

export type CardDocument = Card & Document


export enum SpendingLimitIntervalType {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    YEARLY = 'yearly'
}

export enum CardStatusType {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}


@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true
})
export class Card {

    @Prop()
    sudoID: string
  
    @Prop()
    debitAccountId: string

    @Prop()
    customerId: string
  
    @Prop()
    expirationDate: string

    @Prop()
    type: string;
  
    @Prop()
    brand: BrandType
  
    @Prop()
    currency: CurrencyPair
  
    @Prop()
    status: CardStatusType

    // @Prop()
    // accountNumber: string

    @Prop()
    bankCode: string

    @Prop()
    atmChannel: boolean

    @Prop()
    posChannel: boolean

    @Prop()
    webChannel: boolean

    @Prop()
    mobileChannel: boolean

    @Prop()
    spendingLimitAmount: number

    @Prop()
    spendingLimitInterval: SpendingLimitIntervalType

    // @Prop()
    // cancellationReason: string

    // @Prop()
    // creditAccountId: string

    @Prop()
    maskedPan: string

    @Prop()
    expiryMonth: string

    @Prop()
    expiryYear: string
}

const CardSchema = SchemaFactory.createForClass(Card)





export {CardSchema}
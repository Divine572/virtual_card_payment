import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import mongoose, { Document, ObjectId } from 'mongoose'
import { Exclude, Transform } from 'class-transformer';
import { AccountType, Type } from './dtos/createAccount.dto';
import { CurrencyPair } from 'src/cards/dtos/createCard.dto';

export type AccountDocument = Account & Document




@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true
})
export class Account {
    @Transform(({value}) => value.toString())
    _id: ObjectId

    @Prop()
    sudoID: string

    @Prop()
    customerId?: string;
  
    @Prop()
    accountType: AccountType
  
    @Prop()
    type: Type
  
    @Prop()
    currency: CurrencyPair

    @Prop()
    currentBalance: string

    @Prop()
    availableBalance: string

    @Prop()
    accountName: string

    @Prop()
    creditAccountId: string

    @Prop()
    debitAccountId: string

    @Prop()
    bankCode: string
}

const AccountSchema = SchemaFactory.createForClass(Account)





export {AccountSchema}
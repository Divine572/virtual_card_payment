import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import mongoose, { Document, ObjectId } from 'mongoose'
import { Exclude, Transform } from 'class-transformer';
import { CustomerType } from './dtos/createUserDto.dto';

export type UserDocument = User & Document


@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true
})
export class User {
    @Transform(({value}) => value.toString())
    _id: ObjectId

    @Prop()
    email: string;
  
    @Prop()
    password: string;
   
  
    @Prop()
    fullName: string;
  
    @Prop()
    customerType: CustomerType
  
    @Prop()
    phoneNumber: string
  
    @Prop()
    address: string
  
    @Prop()
    city: string
  
    @Prop()
    state: string
  
    @Prop()
    postalCode: string
  
    @Prop()
    country: string

    @Prop()
    currentHashedRefreshToken?: string

    @Prop()
    status: string
 
}

const UserSchema = SchemaFactory.createForClass(User)


UserSchema.index({ email: 1 });





export {UserSchema}
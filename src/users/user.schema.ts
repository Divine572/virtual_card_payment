import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import mongoose, { Document, ObjectId } from 'mongoose'
import { Exclude, Transform } from 'class-transformer';

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
    fullName: string

    @Prop({ unique: true })
    email: string

    @Prop()
    @Exclude()
    currentHashedRefreshToken?: string;

    @Prop()
    @Exclude()
    password: string


 
}

const UserSchema = SchemaFactory.createForClass(User)


UserSchema.index({ email: 1 });


UserSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user',
});





export {UserSchema}
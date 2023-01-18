import { Order } from 'src/orders/order.schema';
import { Cart } from './../carts/cart.schema';
import { Product } from './../products/product.schema';
import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import mongoose, { Document, ObjectId } from 'mongoose'
import { Exclude, Transform } from 'class-transformer';

export type UserDocument = User & Document

export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
    doctor = 'doctor',
    DELIVERY_AGENT = 'delivery-agent'
}

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

    @Prop()
    country: string

    @Prop()
    gender: string

    @Prop()
    city: string

    @Prop({ enum: UserRole, default: UserRole.CUSTOMER })
    roles: UserRole

    @Prop()
    state: string

    @Prop()
    address: string

    @Prop()
    acceptTerms: boolean

    @Prop()
    rememberMe: boolean

    @Prop({ default: false })
    isVerified: boolean

    @Prop()
    photo: string

    @Prop()
    phoneNumber: string

    @Prop()
    passwordResetToken: string

    @Prop({ type: Date })
    passwordResetExpires: Date

    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}]})
    orders: Order[]

    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]})
    favouriteProducts: Product[]
}

const UserSchema = SchemaFactory.createForClass(User)


UserSchema.index({ email: 1 });


UserSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user',
});





export {UserSchema}
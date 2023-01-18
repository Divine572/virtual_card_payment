import { ResetPasswordDto } from './../authentication/dtos/resetPassword.dto';
import { UpdateUserDto } from './dtos/updateUserDto.dto';
import { CreateUserDto } from './dtos/createUserDto.dto';
import { User, UserDocument } from './user.schema';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'
import crypto from 'crypto';
import UpdatePasswordDto from 'src/authentication/dtos/updatePassword.dto';




@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    }


    async get() {
        return this.userModel.find()
    }

    async getByEmail(email: string) {
        const user = await this.userModel.findOne({ email })

        if (!user) {
            throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
        }

        return user
    }

    

    async getById(id: string) {
        const user = await this.userModel.findById(id)

        if (!user) {
            throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
        }

        return user
    }

    async create(userData: CreateUserDto) {
        const newProduct = new this.userModel(userData)
        return newProduct.save()
    }

    async delete(id: string) {
        const user = await this.userModel.findById(id)

        if (!user) {
            throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
        } 

        await this.userModel.findByIdAndDelete(id)
    }

    async update(id: string, userData: UpdateUserDto) {
        const user = await this.userModel.findById(id)

        if (!user) {
            throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
        } 

        const updatedUser = await this.userModel.findByIdAndUpdate(id, userData, {
            overwrite: true,
            new: true
        })

        return updatedUser
    }

    async setCurrentRefreshToken(refreshToken: string, userId: string) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userModel.findByIdAndUpdate(userId, {
            currentHashedRefreshToken: currentHashedRefreshToken
        }, {
            new: true,
            overwrite: true
        });
      }

      async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
        const user = await this.getById(userId);
     
        const isRefreshTokenMatching = await bcrypt.compare(
          refreshToken,
          user.currentHashedRefreshToken
        );
     
        if (isRefreshTokenMatching) {
          return user;
        }
      }

    async removeRefreshToken(userId: string) {
        return this.userModel.findByIdAndUpdate(userId, {
          currentHashedRefreshToken: null
        })
    }


    async confirmUserAccount(userId: string) {
        return this.userModel.findByIdAndUpdate(userId, {
            isVerified: true
        })
    }

    async createPasswordResetToken(userId: string) {
        const resetToken = crypto.randomBytes(32).toString('hex')

        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

        const passwordResetExpires = Date.now() + 10 * 60 * 1000

        
        const user = await this.userModel.findByIdAndUpdate(userId, {
            passwordResetToken: passwordResetToken,
            passwordResetExpires: passwordResetExpires
        })

        if (!user) {
            throw new HttpException(
                'User token not set',
                HttpStatus.NOT_FOUND
            )
        }

        return resetToken

    }

    async verifyResetToken(token: string) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        const user = await this.userModel.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() } 
        })

        if (!user) {
            throw new HttpException(
                'Token has expired or invalid',
                HttpStatus.BAD_REQUEST
            )
        }
        return user
    }


    async updateResetPassword(userId: string, userData: ResetPasswordDto) {
        const user = await this.userModel.findByIdAndUpdate(userId, {
            password: userData.newPassword,
            passwordResetToken: undefined,
            passwordResetExpires: undefined
        })
        return user
    }

    async updateUserPassword(userId: string, userData: UpdatePasswordDto) {
        const user = this.userModel.findById(userId)

        if (!user) {
            throw new HttpException(
                'User not found',
                HttpStatus.NOT_FOUND
            )
        }
 

        const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
            password: userData.password
        })

        return updatedUser

    }


    async addFavouriteProduct(userId: string, productId: string) {
        const user = await this.userModel.findById(userId)

        if (!user) {
            throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
        }

        await user.updateOne(
            { _id: userId },
            { $addToSet: { 
                favouriteProducts: [productId]
            }}
        )
    }

    async removeFavouriteProduct(userId: string, productId: string) {
        const user = await this.userModel.findById(userId)

        if (!user) {
            throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
        }

        await user.updateOne(
            { _id: userId },
            { $unset: { 
                favouriteProducts: [productId]
            }}
        )
    }

    async getFavouriteProducts(userId: string) {
        const user = await this.userModel.findById(userId).populate('favouriteProducts')

        if (!user) {
            throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
        }

        return user.favouriteProducts
    }

}

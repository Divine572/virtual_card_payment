
import { CreateUserDto } from './dtos/createUserDto.dto';
import { User, UserDocument } from './user.schema';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'
import crypto from 'crypto';




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



   



}

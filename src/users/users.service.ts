import { ConfigService } from '@nestjs/config';

import { CreateUserDto } from './dtos/createUserDto.dto';
import { User, UserDocument } from './user.schema';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'
import crypto from 'crypto';
import axios  from 'axios';



@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private configService: ConfigService) {
    }

   
    headers = {
        accept: 'application/json',
        "Authorization": `Bearer ${this.configService.get('SUDO_API_KEY')}`,
        'content-type': 'application/json',
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
        try {
            const url = this.configService.get('NODE_ENV') == 'deveopment' ? this.configService.get('SUDO_BASE_TEST_URL'): this.configService.get('SUDO_BASE_URL')
            const options = {
                method: 'POST',
                url: url,
                headers: this.headers,
                data: {
                    type: userData.customerType,
                    name: userData.fullName,
                    phoneNumber: userData.phoneNumber,
                    emailAddress: userData.email,
                    status: 'active',
                    billingAddress: {
                        line1: userData.address,
                        city: userData.city,
                        state: userData.state,
                        postalCode: userData.postalCode,
                        country: userData.country
                    }
                }
            }
                    
            const response = await axios.request(options);
            const user = await this.userModel.create({
                customerType : response.data.type,
                email: response.data.emailAddress,
                password: userData.password,
                fullName: response.data.name,
                phoneNumber: response.data.phoneNumber,
                address: response.data.billingAddress.line1,
                city: response.data.billingAddress.city,
                state: response.data.billingAddress.state,
                postalCode: response.data.billingAddress.postalCode,
                country: response.data.billingAddress.country
            })
            return user

        } catch (err) {
            throw new HttpException(
                'Something went wrong while creating an account, Try again!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
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

import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { EmailService } from './../email/email.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dtos/registerDto.dto';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import MongoError from 'src/utils/mongoError.enum';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from './tokenPayload.interface';
import ForgotPasswordDto from './dtos/forgotPassword.dto';
import ResetPasswordDto from './dtos/resetPassword.dto';




@Injectable()
export class AuthenticationService {
    constructor(private readonly usersService: UsersService, 
        private readonly jwtService: JwtService, 
        private readonly configService: ConfigService,
        private readonly emailService: EmailService
        )
         {

    }

    async register(user: RegisterDto) {
        const userEmail = await this.usersService.getByEmail(user.email)
        if (user.email !== userEmail.email) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
        }
        const hashedPassword = await bcrypt.hash(user.password, 10)
        try {
            const createdUser = await this.usersService.create({
                ...user,
                password: hashedPassword
            })
            createdUser.password = undefined
            return createdUser
        } catch(err) {
            if (err?.code === MongoError.DuplicateKey) {
                console.log(err)
                throw new HttpException(
                    'User with that email already exists',
                    HttpStatus.BAD_REQUEST
                )
            }
            throw new HttpException(
                'Something went wrong',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }



    }

    private async verifyPassword(password: string, hashedPassword: string) {
        const isCorrectPassword = await bcrypt.compare(password, hashedPassword)
        if (!isCorrectPassword) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    async getAuthenticatedUser(email: string, plainPassword: string) {
            try {
                const user = await this.usersService.getByEmail(email)
                await this.verifyPassword(plainPassword,  user.password)
                user.password = undefined
                return user
            } catch (err) {
                throw new HttpException(
                    'Wrong credentials provided',
                    HttpStatus.BAD_REQUEST
                )
            }
    }



    // public getCookieWithJwtToken(userId: string) {
    //     const payload: TokenPayload = { userId };
    //     const token = this.jwtService.sign(payload);
    //     return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    //   }


    public getCookiesForLogOut() {
        return [
          'Authentication=; HttpOnly; Path=/; Max-Age=0',
          'Refresh=; HttpOnly; Path=/; Max-Age=0'
        ];
    }


    public getCookieWithJwtAccessToken(userId: string) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    }
     
    public getCookieWithJwtRefreshToken(userId: string) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
        });
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
        return {
          cookie,
          token
        }
    }


    public async getUserFromAuthenticationToken(token: string) {
        const payload: TokenPayload = this.jwtService.verify(token, {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        });
        if (payload.userId) {
          return this.usersService.getById(payload.userId);
        }
    }



    private async getUserFromToken(token: string) {
        const user = await this.usersService.verifyResetToken(token)
        return user
    }


    async resetPassword(token: string, userData: ResetPasswordDto) {
        const user = await this.getUserFromToken(token)

        if (userData.newPassword !== userData.newPasswordConfirm) {
            throw new HttpException(
                'Passwords do not match',
                HttpStatus.BAD_REQUEST
            )
        }

        const updatedUser = await this.usersService.updateResetPassword(user._id, userData)
        return updatedUser
    }


    async forgotPassword(userData: ForgotPasswordDto) {
        const user = await this.usersService.getByEmail(userData.email)

        if (!user) {
            throw new HttpException(
                `User email doesn't exist `,
                HttpStatus.NOT_FOUND
            )
        }

        const resetToken = this.usersService.createPasswordResetToken(user._id)
        await user.save({ validateBeforeSave: false })

        const url = `${this.configService.get('EMAIL_RESET_TOKEN_URL')}?token=${resetToken}`;

        const message = `Use this link to reset your password: ${url}`;

        const mailSubject = 'Reset Password'

        return this.emailService.sendEmail(mailSubject, message, user.fullName, user.email, user.phoneNumber)
    }

    async updatePassword(userId: string, userData: UpdatePasswordDto) {
        const user = await this.usersService.getById(userId)
        await this.verifyPassword(userData.oldPassword,  user.password)


        const updatedUser = await this.usersService.updateUserPassword(userId, userData)
        return updatedUser
    }




}











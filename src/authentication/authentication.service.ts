import { CreateUserDto } from './../users/dtos/createUserDto.dto';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dtos/registerDto.dto';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import MongoError from 'src/utils/mongoError.enum';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from './tokenPayload.interface';





@Injectable()
export class AuthenticationService {
    constructor(private readonly usersService: UsersService, 
        private readonly jwtService: JwtService, 
        private readonly configService: ConfigService,
        )
         {

    }

    async register(userData: RegisterDto) {
        const user = await this.usersService.createUser(userData)
        return user
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










}











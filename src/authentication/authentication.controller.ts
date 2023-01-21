import { CreateUserDto } from './../users/dtos/createUserDto.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt-authentication.guard';
import { User } from 'src/users/user.schema';
import MongooseClassSerializerInterceptor  from 'src/utils/mongooseClassSerializer.interceptor';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { AuthenticationService } from './authentication.service';
import { Body, Controller, Post, HttpCode, UseGuards, Req, UseInterceptors, Get, Put, Param } from '@nestjs/common';
import RegisterDto from './dtos/registerDto.dto';
import RequestWithUser from './requestWithUser.interface';
import { ApiBody, ApiCreatedResponse, ApiHeaders, ApiOkResponse } from '@nestjs/swagger';
import LoginDto from './dtos/login.dto';

@Controller('authentication')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService, 
        private readonly usersService: UsersService
        ) {

    }

    @ApiCreatedResponse({
        status: 201,
        description: 'A User has been successfully created',
        type: RegisterDto
    })
    @HttpCode(201)
    @Post('register')
    async register(@Body() user: CreateUserDto) {
        return this.authenticationService.register(user)
    }

    @ApiOkResponse({
        status: 200,
        description: 'A User has been successfully loggedin',
        type: LoginDto
    })
    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    @ApiBody({ type: LoginDto })
    async login(@Req() request: RequestWithUser) {
        const {user} = request
        const userData = user.toObject()
        const accessToken = this.authenticationService.getJwtAccessToken(
            user.sudoID,
        );

        return {
            ...userData,
            accessToken
        }
    }
   

  
    @ApiOkResponse({
        status: 200,
        description: 'Get currently logged in user',
        type: User
    })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req() request: RequestWithUser) {
        const user =  request.user;
        return user
    }

 


    

    




}

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
import JwtRefreshGuard from './jwt-refresh.guard';
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
        const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(
            user._id,
        );
        const {
        cookie: refreshTokenCookie,
        token: refreshToken,
        } = this.authenticationService.getCookieWithJwtRefreshToken(user._id);
      
        await this.usersService.setCurrentRefreshToken(refreshToken, user._id);
      
        request.res.setHeader('Set-Cookie', [
            accessTokenCookie,
            refreshTokenCookie,
        ]);

        return user
    }



    @ApiOkResponse({
        status: 200,
        description: 'A User has been successfully loggedout',
    })
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(200)
    async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user._id);

    request.res?.setHeader(
        'Set-Cookie',
        this.authenticationService.getCookiesForLogOut(),
      );
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
        console.log(user)
        return user
    }

    @ApiOkResponse({
        status: 200,
        description: 'Used to get set access token to cookies when a user jwt token expires and and still has a valid access token. Returns User details',
    })
    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@Req() request: RequestWithUser) {
      const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(
        request.user._id,
    );
  
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
    }

    




}

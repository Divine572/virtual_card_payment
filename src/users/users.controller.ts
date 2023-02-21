import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.schema';
import  MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
@ApiTags('Users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async getUsers() {
        return this.usersService.get();
    }

    @Get(':id')
    async getUser(@Param() id: string) {
        return this.usersService.getBySudoId(id);
    }
}




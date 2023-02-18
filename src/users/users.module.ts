import { ConfigService, ConfigModule } from '@nestjs/config';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Account, AccountSchema } from 'src/accounts/account.schema';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Account.name, schema: AccountSchema },
        ]),
    ],
    providers: [UsersService, ConfigService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
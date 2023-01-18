import { ConfigService, ConfigModule } from '@nestjs/config';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  imports: [ConfigModule ,MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService, ConfigService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
import { INestApplication, Module } from '@nestjs/common';
import {  ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CardsModule } from './cards/cards.module';

import mongodbConfig from './shared/config/mongodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mongodbConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),

    UsersModule,

    AuthenticationModule,

    CardsModule,

  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string

  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get('PORT')
  }

  static getBaseUrl(app: INestApplication): string {
    let baseUrl = app.getHttpServer().address().address
    if (baseUrl =='0.0.0.0' || baseUrl == '::') {
      return (baseUrl = 'localhost')
    }
  }
}

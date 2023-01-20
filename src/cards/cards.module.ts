import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Card, CardSchema } from './card.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]), ConfigModule],
  controllers: [CardsController],
  providers: [CardsService]
})
export class CardsModule {}

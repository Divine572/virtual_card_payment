import { UpdateCardDto } from './dtos/updateCard.dto';
import  RequestWithUser  from 'src/authentication/requestWithUser.interface';
import { JwtAuthGuard } from './../authentication/jwt-authentication.guard';
import { CreateCardDto } from './dtos/createCard.dto';
import { CardsService } from './cards.service';
import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';

@Controller('cards')
export class CardsController {
    constructor(private cardsService: CardsService) {}

    @Get()
    async getCards() {
        return this.cardsService.get()
    }

    @Get(':id')
    async getCard(@Param() id: string) {
        return this.cardsService.getById(id)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createCard(@Body() cardData: CreateCardDto, @Req() request: RequestWithUser) {
        return this.cardsService.create(cardData, request.user.sudoID)
    }

    @Get('/customer/:id') 
    @UseGuards(JwtAuthGuard)
    async getCustomerCards(@Req() request: RequestWithUser) {
        return this.cardsService.getCustomerCards(request.user.sudoID)
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateCard(@Body() cardData: UpdateCardDto, @Req() request: RequestWithUser, @Param() id: string) {
        return this.cardsService.updateCard(id, cardData)
    }

    @Get('/cards/:id/token') 
    @UseGuards(JwtAuthGuard)
    async generateCardToken(@Param() id: string) {
        return this.cardsService.generateCardToken(id)
    }

    @Get('transactions') 
    @UseGuards(JwtAuthGuard)
    async getAllTransactions() {
        return this.getAllTransactions()
    }

    @Get(':id/transactions') 
    @UseGuards(JwtAuthGuard)
    async getCardTransactions(@Param() id: string) {
        return this.cardsService.getCardTransactions(id)
    }
}

import { ConfigService } from '@nestjs/config';
import { Card, CardDocument, CardStatusType } from './card.schema';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BrandType, CreateCardDto } from './dtos/createCard.dto';
import axios from 'axios';


@Injectable()
export class CardsService {
    constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>, private configService: ConfigService) {}

    headers = {
        accept: 'application/json',
        "Authorization": `Bearer ${this.configService.get('SUDO_API_KEY')}`,
        'content-type': 'application/json',
    }


    async get() {
        return this.cardModel.find()
    }

    

    async getById(id: string) {
        const card = await this.cardModel.findById(id)

        if (!card) {
            throw new HttpException('Card with this id does not exist', HttpStatus.NOT_FOUND);
        }

        return card
    }

    async create(cardData: CreateCardDto, sudoID: string) {
        try {
            const url = this.configService.get('NODE_ENV') == 'deveopment' ? `${this.configService.get('SUDO_BASE_TEST_URL')}/cards`: `${this.configService.get('SUDO_BASE_URL')}/cards`

            enum cardType {
                VIRTUAL = 'virtual'
            }

            const data = {
                customerId: sudoID,
                type: cardType.VIRTUAL,
                brand: cardData.brand,
                currency: cardData.currency,
                status: CardStatusType.ACTIVE,
                spendingControls: {
                    channels: {
                        atm: true,
                        pos: true,
                        web: true,
                        mobile: true,
                    },
                    spendingLimits: [
                        {
                            amount: cardData.spendingLimitAmount,
                            interval: cardData.spendingLimitInterval
                        }
                    ]

                }


            }

            if (data.brand === BrandType.VISA) data['expirationDate'] = cardData.expirationDate

            const options = {
                method: 'POST',
                url: url,
                headers: this.headers,
                data: data
            }
                    
            const response = await axios.request(options);
            const card = await this.cardModel.create({
                sudoID: response.data._id,
                type: response.data?.type,
                brand: response.data?.brand,
                currency: response.data?.currency,
                maskedPan: response.data?.maskedPan,
                expiryMonth: response.data?.expiryMonth,
                expiryYear: response.data?.expiryYear,
                status: response.data?.status,
                atmChannel: response.data?.spendingControls?.channels?.atm,
                posChannel: response.data?.spendingControls?.channels?.pos,
                webChannel: response.data?.spendingControls?.channels?.web,
                mobileChannel: response.data?.spendingControls?.channels?.mobile,
                spendingLimitAmount: response.data?.spendingControls?.spendingLimits?.amount,
                spendingLimitInterval: response.data?.spendingControls?.spendingLimits?.interval,
            })
            return card

        } catch (err) {
            throw new HttpException(
                'Something went wrong while creating a card, Try again!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}

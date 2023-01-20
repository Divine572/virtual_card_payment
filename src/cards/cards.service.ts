import { UpdateCardDto } from './dtos/updateCard.dto';
import { UsersService } from './../users/users.service';
import { ConfigService } from '@nestjs/config';
import { Card, CardDocument, CardStatusType } from './card.schema';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BrandType, CreateCardDto } from './dtos/createCard.dto';
import axios from 'axios';


@Injectable()
export class CardsService {
    constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>, private configService: ConfigService, private usersService: UsersService) {}

    headers = {
        accept: 'application/json',
        "Authorization": `Bearer ${this.configService.get('SUDO_API_KEY')}`,
        'content-type': 'application/json',
    }


    async get() {
        return this.cardModel.find()
    }

    

    async getById(sudoID: string) {
        const card = await this.cardModel.findById(sudoID)

        if (!card) {
            throw new HttpException('Card with this id does not exist', HttpStatus.NOT_FOUND);
        }

        return card
    }

    async create(cardData: CreateCardDto, userSudoID: string) {
        try {
            const url = this.configService.get('NODE_ENV') == 'deveopment' ? `${this.configService.get('SUDO_BASE_TEST_URL')}/cards`: `${this.configService.get('SUDO_BASE_URL')}/cards`

            enum cardType {
                VIRTUAL = 'virtual'
            }

            const data = {
                customerId: userSudoID,
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
                },
                sendPINSMS: false,
                bankCode: cardData?.bankCode,
                accountNumber: cardData.accountNumber
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
                sudoID: response.data?._id,
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


    async getCustomerCards(userSudoID: string) {
        try {
            const url = this.configService.get('NODE_ENV') == 'deveopment' ? `${this.configService.get('SUDO_BASE_TEST_URL')}/cards/customer/${userSudoID}`: `${this.configService.get('SUDO_BASE_URL')}/cards/customer/${userSudoID}`

           

            const options = {
                method: 'GET',
                url: url,
                headers: this.headers,
            }
                    
            const response = await axios.request(options);
    
            return response

        } catch (err) {
            throw new HttpException(
                'Something went wrong while creating a card, Try again!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }



    async updateCard(sudoID: string, cardData: UpdateCardDto) {
        try {
            const url = this.configService.get('NODE_ENV') == 'deveopment' ? `${this.configService.get('SUDO_BASE_TEST_URL')}/cards/${sudoID}`: `${this.configService.get('SUDO_BASE_URL')}/cards/${sudoID}`

            
            const data = {
                status: CardStatusType.ACTIVE,
                spendingControls: {
                    spendingLimits: [
                        {
                            amount: cardData?.spendingLimitAmount,
                            interval: cardData?.spendingLimitInterval
                        }
                    ]
                },
            }

            const options = {
                method: 'PUT',
                url: url,
                headers: this.headers,
                data: data
            }
                    
            const response = await axios.request(options);
            const card = await this.cardModel.findByIdAndUpdate(sudoID, {
                status: response.data?.status,
                spendingLimitAmount: response.data?.spendingControls?.spendingLimits?.amount,
                spendingLimitInterval: response.data?.spendingControls?.spendingLimits?.interval,
            }, )
            return card

        } catch (err) {
            throw new HttpException(
                'Something went wrong while updating card, Try again!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }


    async generateCardToken(sudoID: string) {
        try {
            const url = this.configService.get('NODE_ENV') == 'deveopment' ? `${this.configService.get('SUDO_BASE_TEST_URL')}/cards/${sudoID}/token`: `${this.configService.get('SUDO_BASE_URL')}/cards/${sudoID}/token`
           

            const options = {
                method: 'GET',
                url: url,
                headers: this.headers,
            }
                    
            const response = await axios.request(options);
    
            return response

        } catch (err) {
            throw new HttpException(
                'Something went wrong while generating card token, Try again!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getAllTransactions() {
        try {
            const url = this.configService.get('NODE_ENV') == 'deveopment' ? `${this.configService.get('SUDO_BASE_TEST_URL')}/cards/transactions`: `${this.configService.get('SUDO_BASE_URL')}/cards/transactions`
           

            const options = {
                method: 'GET',
                url: url,
                headers: this.headers,
            }
                    
            const response = await axios.request(options);
    
            return response

        } catch (err) {
            throw new HttpException(
                'Something went wrong while sending transactions, Try again!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }


    async getCardTransactions(sudoID: string) {
        try {
            const url = this.configService.get('NODE_ENV') == 'deveopment' ? `${this.configService.get('SUDO_BASE_TEST_URL')}/cards/${sudoID}/transactions`: `${this.configService.get('SUDO_BASE_URL')}/cards/${sudoID}/transactions`
           

            const options = {
                method: 'GET',
                url: url,
                headers: this.headers,
            }
                    
            const response = await axios.request(options);
    
            return response

        } catch (err) {
            throw new HttpException(
                'Something went wrong while sending card transactions, Try again!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }


    // async getTransactionDetails(cardSudoID: string) {
    //     const cardTransactions = await this.getCardTransactions(cardSudoID)
    //     for (let i = 0; i < (cardTransactions.data)) {
    //         transaction = cardTransactions.data
    //         let transactionId = transaction?._id
    //         try {
    //             const url = this.configService.get('NODE_ENV') == 'deveopment' ? `${this.configService.get('SUDO_BASE_TEST_URL')}/cards/transactions/${transactionId}`: `${this.configService.get('SUDO_BASE_URL')}/cards/transactions/${transactionId}`
               
    
    //             const options = {
    //                 method: 'GET',
    //                 url: url,
    //                 headers: this.headers,
    //             }
                        
    //             const response = await axios.request(options);
        
    //             return response
    
    //         } catch (err) {
    //             throw new HttpException(
    //                 'Something went wrong while sending card transactions, Try again!',
    //                 HttpStatus.INTERNAL_SERVER_ERROR
    //             )
    //         }

    //     }
    // }


    










        


}




import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    email: string;

    @IsOptional()
    fullName: string;

    @IsOptional()
    country: string;

    @IsOptional()
    gender: string;

    @IsOptional()
    city: string;

    @IsOptional()
    state: string;

    @IsOptional()
    address: string;

    @IsOptional()
    phoneNumber
}

export default UpdateUserDto;



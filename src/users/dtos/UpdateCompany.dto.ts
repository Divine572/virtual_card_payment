import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';


export class UpdateCompanyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    identityName: string


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    identityNumber: string


}





export default UpdateCompanyDto;
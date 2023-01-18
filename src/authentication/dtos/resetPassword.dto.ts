import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty} from 'class-validator';
import { Match } from 'src/users/decorators/match.decorator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Match('newPassword', { message: 'Passwords do not match'})
  newPasswordConfirm: string

}



export default ResetPasswordDto;

import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
    @ApiProperty({
		description: 'accessToken of facebook or google',
		required: true,
	})
    @IsNotEmpty({ message: 'Mã là bắt buộc' })
    accessToken: string;
}
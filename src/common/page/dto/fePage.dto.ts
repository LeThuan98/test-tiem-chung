import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsOptional, IsNotEmpty } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class FePageDto {

    @ApiProperty({
        type: String,
        description: 'HOMEPAGE, POST',
        required: true,
        example: 'HOMEPAGE'
    })
    @IsNotEmpty()
    pageCode: string;

}

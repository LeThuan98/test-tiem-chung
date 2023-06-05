import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class BeAskDto {
    @IsNotEmpty({ message: 'Nội dung là bắt buộc!' })
    @ApiProperty()
    content: string;

}

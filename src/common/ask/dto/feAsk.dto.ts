import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class FeAskDto {
    @IsNotEmpty({ message: 'Nội dung là bắt buộc!' })
    @ApiProperty()
    question: string;

}

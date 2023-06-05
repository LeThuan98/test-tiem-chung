import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class FeResultDto {
    @IsNotEmpty({ message: 'bắt buộc!' })
    @ApiProperty()
    answer: object;

}

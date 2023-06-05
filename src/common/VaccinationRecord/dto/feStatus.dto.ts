import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class FeStatusDto {

    @IsNotEmpty({ message: 'Id đợt là bắt buộc!' })
    @ApiProperty()
    vaxId: string;

    @IsNotEmpty({ message: 'Key vaccine là bắt buộc!' })
    @ApiProperty()
    vaxKey: string;

}

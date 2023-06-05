import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class FeNoteDto {

    @ApiProperty()
    @IsNotEmpty({ message: 'Id đợt là bắt buộc!' })
    vaxId: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Key note vaccine là bắt buộc!' })
    vaxKey: string;

    @ApiProperty({
        description: 'note vaccine',
        maxLength: 255,
        nullable: true
    })
    @IsOptional()
    vaxNote: string;

}

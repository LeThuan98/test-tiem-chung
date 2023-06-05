import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from 'src/core/validator/IsExistFileTmp';

export class BeFaqDto {
    @IsNotEmpty({ message: 'Tiêu đề là bắt buộc!' })
    @ApiProperty()
    title: string;

    @ApiProperty({
        required: true,
        type: String
    })
    @IsNotEmpty({ message: 'Nội dung là bắt buộc!' })
    content: string;

}

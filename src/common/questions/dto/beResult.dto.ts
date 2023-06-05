import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';
export class BeResultDto {
    @ApiProperty({
        type: String,
        description: 'content',
        required: true,
    })
    @IsNotEmpty({ message: 'Nội dung câu trả lời là bắt buộc!' })
    content: string;

    @ApiProperty({
        description: 'mostAnswered',
        required: true,
    })
    mostAnswered: string;

}

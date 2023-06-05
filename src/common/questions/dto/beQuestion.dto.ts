import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';
export class BeQuestionDto {
    @ApiProperty({
        type: String,
        description: 'content',
        required: true,
    })
    @IsNotEmpty({ message: 'Nội dung câu hỏi là bắt buộc!' })
    content: string;

    @ApiProperty({
        description: 'answer',
        required: true,
    })
    answer: Array<object>;

}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from 'src/core/validator/IsExistFileTmp';
import { IsValidFileTrans } from 'src/core/validator/IsValidFileTrans';

export class BePageDto {
    @ApiProperty({
        description: 'active',
        required: true,
    })
    @IsNotEmpty({message: 'Trạng thái là bắt buộc!'})
    active: boolean;

    @IsNotEmpty({ message: 'Page Code là bắt buộc!' })
    @ApiProperty()
    code: string;

    @IsNotEmpty({ message: 'Tên là bắt buộc!' })
    @ApiProperty()
    name: string;

    @ApiProperty({
        type: Object,
        description: 'content',
        required: false,
    })
    @IsOptional()
    content: Object;

    @ApiProperty({
        type: Object,
        description: 'metaImage',
        required: false
    })
    @IsOptional()
    @IsValidFileTrans(['transFile:page'], {})
    metaImage: Object;

    @ApiProperty({
        type: Object,
        description: 'meta title',
        required: false,
    })
    @ApiProperty()
    metaTitle: Object;

    @ApiProperty({
        type: Object,
        description: 'meta keyword',
        required: false,
    })
    @ApiProperty()
    metaKeyword: Object;

    @ApiProperty({
        type: Object,
        description: 'meta description',
        required: false,
    })
    @ApiProperty()
    metaDescription: Object;
}

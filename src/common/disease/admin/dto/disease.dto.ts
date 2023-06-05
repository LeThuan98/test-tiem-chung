import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from 'src/core/validator/IsExistFileTmp';

export class BeDiseaseDto {

    @ApiProperty({
        description: 'readTime',
        required: false
    })
    @IsOptional()
    readTime: string;

    @ApiProperty({
        description: 'active',
        required: true,
    })
    @IsNotEmpty({message: 'Trạng thái là bắt buộc!'})
    active: boolean;

    @ApiProperty({
        description: 'active sub page',
        required: false,
    })
    @IsOptional()
    activeSub: boolean;

    @IsOptional()
    @MaxLength(255)
    @IsExistFileTmp([], {
        message: 'Ảnh không hợp lệ!',
    })
    banner: any;

    @IsNotEmpty({ message: 'Tên là bắt buộc!' })
    @ApiProperty({
        required: true,
    })
    title: string;

    @IsOptional()
    @ApiProperty({
        required: true,
    })
    subTitle: string;

    @ApiProperty({
        description: 'slug',
        required: true,
    })
    slug: string;

    @IsOptional()
    @ApiProperty()
    link: string;

    @IsOptional()
    @ApiProperty()
    description: string;

    @ApiProperty({
        type: Object,
        description: 'content',
        required: false,
    })
    @IsOptional()
    content: Object;

    @ApiProperty({
        description: 'sortOrder',
        required: false
    })
    @IsOptional()
    sortOrder: number;

    @IsOptional()
    @MaxLength(255)
    @IsExistFileTmp([], {
        message: 'Ảnh không hợp lệ!',
    })
    metaImage: any;

    @ApiProperty()
    metaTitle: string;

    @ApiProperty()
    metaKeyword: string;

    @ApiProperty()
    metaDescription: string;
}

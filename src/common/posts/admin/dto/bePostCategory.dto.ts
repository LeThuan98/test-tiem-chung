import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class BePostCategoryDto {
    @ApiProperty({
        type: String,
        description: 'title',
        required: true,
    })
    title: string;

    @ApiProperty({
        type: String,
        description: 'slug',
        required: true,
    })
    slug: string;

    @ApiProperty({
        type: String,
        description: 'shortDescription',
        required: true,
    })
    shortDescription: string;

    @ApiProperty({
        type: String,
        description: 'color',
        required: true,
    })
    tagColor: string;

    @ApiProperty({
        description: 'active',
        required: true,
    })
    @IsNotEmpty({message: 'Trạng thái là bắt buộc!'})
    active: boolean;

    @ApiProperty({
        description: 'sortOrder',
        required: true
    })
    @IsNotEmpty({message: 'Thứ tự là bắt buộc!'})
    sortOrder: number;

    @ApiProperty({ required: false })
    metaTitle: string;

    @ApiProperty({
        type: 'File',
        description: 'metaImage',
        maxLength: 255,
        nullable: true,
        required: false
    })
    @IsOptional()
    @MaxLength(255)
    @IsExistFileTmp([], {
        message: 'Ảnh không hợp lệ!',
    })
    metaImage: any;

    @ApiProperty({
        type: Object,
        description: 'meta description',
        required: true,
    })
    metaDescription: string;

    @ApiProperty({
        type: Object,
        description: 'meta keyword',
        required: true,
    })
    metaKeyword: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, MaxLength, IsIn } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';
import { MyDate } from '@core/validator/myDate';
import { StatusEnum } from '@core/constants/post.enum'; 
export class BePostDto {

    @ApiProperty({
        description: 'readTime',
        required: false
    })
    @IsOptional()
    readTime: string;

    @ApiProperty({
        description: 'postCategory',
        required: true,
    })
    @IsNotEmpty({message: 'Danh mục là bắt buộc!'})
    postCategory: string;

    @ApiProperty({
        description: 'image',
        maxLength: 255,
        nullable: true
    })
    @IsOptional()
    @MaxLength(255, {message: 'Tối đa 255 ký tự!'})
    @IsExistFileTmp([], {message: 'Hình ảnh không hợp lệ!'})
    image: string;

    @ApiProperty({
        description: 'imageMb',
        maxLength: 255,
        nullable: true
    })
    @IsOptional()
    @MaxLength(255, {message: 'Tối đa 255 ký tự'})
    @IsExistFileTmp([], {message: 'Hình ảnh di động không hợp lệ!'})
    imageMb: string;

    @ApiProperty({
        type: Object,
        description: 'title',
        required: true,
    })
    title: string;

    @ApiProperty({
        description: 'slug',
        required: true,
    })
    slug: string;

    @ApiProperty({
        type: Object,
        description: 'shortDescription',
        required: false,
    })
    shortDescription: string;

    @ApiProperty({
        type: Object,
        description: 'content',
        required: false,
    })
    @IsOptional()
    content: Object;

    @ApiProperty({
        type: Number,
        description: 'status',
        required: true,
    })
    @IsNotEmpty({message: 'Trạng thái là bắt buộc!'})
    @IsIn(Object.keys(StatusEnum).map(k => StatusEnum[k].toString()).filter(k => parseInt(k)))
    status: number;

    @ApiProperty({
        type: String,
        description: 'publishedAt',
        required: false,
    })
    @IsOptional()
    publishedAt: string;

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
        required: false,
    })
    metaDescription: string;

    @ApiProperty({
        type: Object,
        description: 'meta keyword',
        required: false,
    })
    metaKeyword: string;
}

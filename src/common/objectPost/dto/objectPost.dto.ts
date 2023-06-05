import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from 'src/core/validator/IsExistFileTmp';

export class BeObjectPostDto {

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
    @ApiProperty()
    link: string;

    @IsOptional()
    @ApiProperty()
    description: string;

    @IsNotEmpty({ message: 'Danh mục là bắt buộc!' })
    @ApiProperty()
    objectVaccinationId: string;

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
    mataImage: any;

    @ApiProperty()
    metaTitle: string;

    @ApiProperty()
    metaKeyword: string;

    @ApiProperty()
    metaDescription: string;
}

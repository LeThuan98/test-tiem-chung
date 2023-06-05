import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from 'src/core/validator/IsExistFileTmp';

export class BeObjectVaccinationDto {
    @ApiProperty({
        description: 'active',
        required: true,
    })
    @IsNotEmpty({message: 'Trạng thái là bắt buộc!'})
    active: boolean;

    @IsNotEmpty({ message: 'Tên là bắt buộc!' })
    @ApiProperty()
    name: string;

    @IsNotEmpty({ message: 'Slug là bắt buộc!' })
    @ApiProperty()
    slug: string;

    @IsOptional()
    @ApiProperty()
    isParent: string;

    @ApiProperty({
        description: 'sortOrder',
        required: false
    })
    @IsOptional()
    sortOrder: number;

    @ApiProperty({
        type: Object,
        description: 'content',
        required: false,
    })
    @IsOptional()
    shortDescription: Object;

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

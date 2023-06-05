import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, MaxLength, IsIn } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class BeVaxScheduleDto {

    @IsNotEmpty({ message: 'Danh mục là bắt buộc!' })
    @ApiProperty()
    objectVaccinationId: string;

    @ApiProperty({
        description: 'name',
        maxLength: 255,
        nullable: true
    })
    @IsOptional()
    @MaxLength(255, {message: 'Tối đa 255 ký tự!'})
    name: string;

    @ApiProperty({
        description: 'slug',
        maxLength: 255,
        nullable: true
    })
    @IsOptional()
    slug: string;

    @ApiProperty({
        description: 'shortDescription',
        required: false,
    })
    @IsOptional()
    shortDescription: string;

    @ApiProperty({
        type: String,
        description: 'tableLabel1',
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @MaxLength(255, {message: 'Tên tối đa 255 ký tự'})
    tableLabel1: string;

    @ApiProperty({
        type: Array,
        description: 'members',
        required: false,
    })
    @IsOptional()
    table1: [];

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
    mataImage: any;

    @ApiProperty()
    metaTitle: string;

    @ApiProperty()
    metaKeyword: string;

    @ApiProperty()
    metaDescription: string;
}

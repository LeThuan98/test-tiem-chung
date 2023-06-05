import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class FeCustomerDto {

    @ApiProperty({
        type: 'File',
        description: 'profileImage',
        maxLength: 255,
        nullable: true,
    })
    @IsOptional()
    @MaxLength(255)
    @IsExistFileTmp([], {
        message: 'Ảnh đại diện không hợp lệ!',
    })
    profileImage: any;

    @IsNotEmpty({ message: 'Tên là bắt buộc!' })
    @ApiProperty({ required: false})
    name: string;

    @ApiProperty({
        type: String,
        description: 'email',
        required: false
    })
    email: string;

    @ApiProperty({
        type: String,
        description: 'phone',
        required: false
    })
    phone: string;

    @ApiProperty({
        type: String,
        description: 'gender',
        uniqueItems: true,
        required: false
    })
    gender: string;

    @ApiProperty({
        description: 'dateOfBirth',
        uniqueItems: true,
        required: false
    })
    dateOfBirth: Date;

    @ApiProperty({
        type: String,
        description: 'address',
        uniqueItems: true,
        required: false
    })
    address: string;

    @ApiProperty({
        type: String,
        description: 'province',
        uniqueItems: true,
        required: false
    })
    province: string;

    @ApiProperty({
        type: String,
        description: 'district',
        uniqueItems: true,
        required: false
    })
    district: string;

    
}

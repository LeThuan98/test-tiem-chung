import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty, IsOptional } from 'class-validator';
import { IsValidTrans } from '@core/validator/IsValidTrans';

export class BeZoneProvinceDto {
    @ApiProperty({
        type: String,
        description: 'code',
        nullable: true
    })
    @IsOptional()
    code: string;

    @ApiProperty({
        type: Boolean,
        description: 'active',
        required: true,
    })
    @IsNotEmpty({message: 'Thuộc tính hoạt động là bắt buộc!'})
    active: boolean;

    @ApiProperty({
        type: String,
        description: 'name',
        required: true,
        maxLength: 255,
    })
    @IsValidTrans([
        'required:true',
        'maxlength:255',
    ], {})
    name: string;

    @ApiProperty({
        type: Number,
        description: 'lat',
        nullable: true
    })
    @IsOptional()
    lat: number;

    @ApiProperty({
        description: 'lng',
        nullable: true
    })
    @IsOptional()
    lng: number;

    @ApiProperty({
        type: Number,
        description: 'sortOrder',
        required: true
    })
    @IsNotEmpty({message: 'Thứ tự là bắt buộc!'})
    sortOrder: number;
}

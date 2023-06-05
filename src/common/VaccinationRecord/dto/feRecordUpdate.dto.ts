import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class FeRecordUpdateDto {

    @IsNotEmpty({ message: 'Tên là bắt buộc!' })
    @ApiProperty()
    name: string;

    @IsNotEmpty({ message: 'Mối quan hệ là bắt buộc!' })
    @ApiProperty()
    relationship: string;

    @IsNotEmpty({ message: 'Giới tính là bắt buộc!' })
    @ApiProperty()
    gender: string;

    @IsNotEmpty({ message: 'Ngày sinh là bắt buộc!' })
    @ApiProperty({
        description: 'Date type'
    })
    dateOfBirth: Date;
    
    @IsNotEmpty({ message: 'Địa chỉ là bắt buộc!' })
    @ApiProperty({
        type: 'string',
    })
    Address: string;
    
    @IsNotEmpty({ message: 'Tỉnh/Thành phố là bắt buộc!' })
    @ApiProperty({
        description: 'Id province'
    })
    province: string;
    
    @IsNotEmpty({ message: 'Quận/Huyện là bắt buộc!' })
    @ApiProperty({
        description: 'Id district'
    })
    district: string;


}

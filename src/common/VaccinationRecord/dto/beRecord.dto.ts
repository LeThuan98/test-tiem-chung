import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class BeRecordDto {
    @IsNotEmpty({ message: 'Mã khách hàng là bắt buộc!' })
    @ApiProperty({
        required: true,
        description: 'customer id'
    })
    customer: string;

    @IsNotEmpty({ message: 'Tên là bắt buộc!' })
    @ApiProperty()
    name: string;

    @IsNotEmpty({ message: 'Đối tượng tiêm chủng là bắt buộc!' })
    @ApiProperty()
    objectVaccinationId: string;

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

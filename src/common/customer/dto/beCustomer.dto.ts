import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty} from '@nestjs/swagger';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class BeCustomerDto {
    @ApiProperty({
        required: false
    })
    gender: string;

    @ApiProperty({
        type: 'file',
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

    @ApiProperty({
        required: false
    })
    name: string;    

    @IsNotEmpty({ message: 'Tên người dùng là bắt buộc!' })
    @ApiProperty()
    username: string;    
    
    @ApiProperty()
    password: string;    
    
    @ApiProperty({
        required: false
    })
    email: string;    
    
    @ApiProperty({
        required: false
    })
    phone: string;    

    @ApiProperty({
        description: 'Date type',
        required: false
    })
    dateOfBirth: Date;
    
    @ApiProperty({
        type: 'string',
        required: false
    })
    Address: string;
    
    @ApiProperty({
        description: 'Id province',
        required: false,
    })
    province: string;
    
    @ApiProperty({
        description: 'Id district',
        required: false,
    })
    district: string;
    
    @ApiProperty()
    active: boolean;

}

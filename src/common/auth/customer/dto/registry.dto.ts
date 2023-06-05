import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length, IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';
// import { StrongPassword } from '@core/validator/strongPassword';
import { isNull } from 'util';
export class RegistryDto {

    @ApiProperty({
        type: String,
        description: 'username',
        minLength: 5,
        maxLength: 255,
        required: true
    })
    @IsNotEmpty({message: 'Tên là bắt buộc!'})
    @Length(5, 255, {message: 'Tên khoảng từ 5 - 255 ký tự!'})
    username: string;

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
        description: 'name',
        required: false
    })
    name: string;

    @ApiProperty({
        type: String,
        description: 'Password',
        minLength: 6,
        maxLength: 255,
        required: true,
    })
    @IsNotEmpty({message: 'Mật khẩu là bắt buộc!'})
    password: string;
}
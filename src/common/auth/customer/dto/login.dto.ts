import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsNotEmpty({ message: 'Username là bắt buộc!' })
    @ApiProperty()
    username: string;

    @IsNotEmpty({ message: 'Mật khẩu là bắt buộc!' })
    @ApiProperty()
    password: string;
}

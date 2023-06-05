import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { AuthController } from './controllers/auth.controller';
import { UserAuthService } from './services/auth.service';
import { UserModule } from '../../../common/users/user.module';
@Module({
    imports: [UserModule, SchemasModule],
    providers: [UserAuthService],
    controllers: [AuthController],
    exports: [UserAuthService]
})
export class UserAuthModule {
}
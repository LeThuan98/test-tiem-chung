import { Module } from '@nestjs/common';
import { SchemasModule } from 'src/schemas/schemas.module';
import { UserService } from '../users/services/user.service';
import { UserAuthService } from '../auth/user/services/auth.service';
import { ActivityModule } from 'src/common/activities/activity.module';
import { BeObjectPostController } from './admin/beObjectPost.controller';
import { ObjectPostService } from './services/objectPost.service';
import { TransformerObjectPostService } from './services/transformerObjectPost.service';
import { FeObjectPostController } from './frontend/feObjectPost.controller';

@Module({
    imports: [SchemasModule, ActivityModule],
    controllers: [BeObjectPostController, FeObjectPostController],
    providers: [ObjectPostService, UserService, UserAuthService, TransformerObjectPostService],
    exports: [ObjectPostService, UserService, UserAuthService, TransformerObjectPostService],
})
export class ObjectPostModule {}

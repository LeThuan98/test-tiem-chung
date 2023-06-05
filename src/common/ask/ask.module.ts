import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { AskService } from './services/ask.service';
import { BeAskController } from './admin/beAsk.controller';
import { FeAskController } from './frontend/feAsk.controller';
import { UserService } from '../users/services/user.service';
import { UserAuthService } from '../auth/user/services/auth.service';
import { TransformerAskService } from './services/transformerAsk.service';
import { ActivityModule } from '@common/activities/activity.module';
import { QueueModule } from '@common/queues/queue.module';

@Module({
    imports: [SchemasModule, ActivityModule, QueueModule],
    controllers: [BeAskController, FeAskController],
    providers: [AskService, UserService, UserAuthService, TransformerAskService],
    exports: [AskService, UserService, UserAuthService, TransformerAskService],
})
export class AskModule {}

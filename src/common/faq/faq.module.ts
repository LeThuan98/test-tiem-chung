import { Module } from '@nestjs/common';
import { SchemasModule } from 'src/schemas/schemas.module';
import { FaqService } from './services/faq.service';
import { UserService } from '../users/services/user.service';
import { UserAuthService } from '../auth/user/services/auth.service';
import { TransformerFaqService } from './services/transformerFaq.service';
import { ActivityModule } from 'src/common/activities/activity.module';
import { BeFaqController } from './admin/beFaq.controller';
import { FeFaqController } from './frontend/feFaq.controller';

@Module({
    imports: [SchemasModule, ActivityModule],
    controllers: [BeFaqController, FeFaqController],
    providers: [FaqService, UserService, UserAuthService, TransformerFaqService],
    exports: [FaqService, UserService, UserAuthService, TransformerFaqService],
})
export class FaqModule {}

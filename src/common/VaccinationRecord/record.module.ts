import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { VaccinationRecordService } from './services/record.service';
import { BeRecordController } from './admin/beRecord.controller';
import { FeRecordController } from './frontend/feRecord.controller';
import { UserService } from '../users/services/user.service';
import { UserAuthService } from '../auth/user/services/auth.service';
import { TransformerRecordService } from './services/transformerRecord.service';
import { ActivityModule } from '@common/activities/activity.module';

@Module({
    imports: [SchemasModule, ActivityModule],
    controllers: [BeRecordController, FeRecordController],
    providers: [VaccinationRecordService, UserService, UserAuthService, TransformerRecordService],
    exports: [VaccinationRecordService, UserService, UserAuthService, TransformerRecordService],
})
export class RecordModule {}

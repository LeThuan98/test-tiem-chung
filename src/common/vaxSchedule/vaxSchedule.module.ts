import { Module } from '@nestjs/common';
import { BeVaxScheduleController } from './admin/beVaxSchedule.controller';
import { FeVaxScheduleController } from './frontend/feVaxSchedule.controller';
import { VaxScheduleService } from './services/vaxSchedule.service';
import { TransformerVaxScheduleService } from './services/transformerVaxSchedule.service';
import { SchemasModule } from "@schemas/schemas.module";
import { ActivityModule } from '../activities/activity.module';

@Module({
    imports: [SchemasModule, ActivityModule],
    controllers: [BeVaxScheduleController, FeVaxScheduleController],
    providers: [VaxScheduleService, TransformerVaxScheduleService],
    exports: [VaxScheduleService, TransformerVaxScheduleService]
})
export class VaxScheduleModule {
}

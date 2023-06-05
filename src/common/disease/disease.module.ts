import { Module } from '@nestjs/common';
import { SchemasModule } from 'src/schemas/schemas.module';
import { UserService } from '../users/services/user.service';
import { UserAuthService } from '../auth/user/services/auth.service';
import { ActivityModule } from 'src/common/activities/activity.module';
import { BeDiseaseController } from './admin/beDisease.controller';
import { DiseaseService } from './services/disease.service';
import { TransformerDiseaseService } from './services/transformerDisease.service';
import { FeDiseaseController } from './frontend/feDisease.controller';

@Module({
    imports: [SchemasModule, ActivityModule],
    controllers: [BeDiseaseController, FeDiseaseController],
    providers: [DiseaseService, UserService, UserAuthService, TransformerDiseaseService],
    exports: [DiseaseService, UserService, UserAuthService, TransformerDiseaseService],
})
export class DiseaseModule {}

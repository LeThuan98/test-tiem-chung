import { Module } from '@nestjs/common';
import { SchemasModule } from 'src/schemas/schemas.module';
import { UserService } from '../users/services/user.service';
import { UserAuthService } from '../auth/user/services/auth.service';
import { ActivityModule } from 'src/common/activities/activity.module';
import { BeObjectVaccinationController } from './admin/beObjectVaccination.controller';
import { ObjectVaccinationService } from './services/objectVaccination.service';
import { TransformerObjectVaccinationService } from './services/transformerObjectVaccination.service';
import { FeObjectVaccinationController } from './frontend/feObjectVaccination.controller';

@Module({
    imports: [SchemasModule, ActivityModule],
    controllers: [BeObjectVaccinationController, FeObjectVaccinationController],
    providers: [ObjectVaccinationService, UserService, UserAuthService, TransformerObjectVaccinationService],
    exports: [ObjectVaccinationService, UserService, UserAuthService, TransformerObjectVaccinationService],
})
export class ObjectVaccinationModule {}

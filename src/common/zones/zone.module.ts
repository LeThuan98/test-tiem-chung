import { Module } from '@nestjs/common';
import { BeZoneSyncController } from './admin/beZoneSync.controller';
import { BeZoneProvinceController } from './admin/beZoneProvince.controller';
import { BeZoneDistrictController } from './admin/beZoneDistrict.controller';
import { BeZoneWardController } from './admin/beZoneWard.controller';
import { FeZoneProvinceController } from './frontend/feZoneProvince.controller';
import { FeZoneDistrictController } from './frontend/feZoneDistrict.controller';
import { FeZoneWardController } from './frontend/feZoneWard.controller';
import { SchemasModule } from "@schemas/schemas.module";
import { ZoneProvinceService } from './services/zoneProvince.service';
import { ZoneDistrictService } from './services/zoneDistrict.service';
import { ZoneWardService } from './services/zoneWard.service';
import { TransformerZoneService } from './services/transformerZone.service';
import { ActivityModule } from '../activities/activity.module';
@Module({
    imports: [SchemasModule, ActivityModule],
    controllers: [
        BeZoneSyncController,
        BeZoneProvinceController,
        BeZoneWardController,
        BeZoneDistrictController,
        FeZoneProvinceController,
        FeZoneDistrictController,
        FeZoneWardController,
    ],
    providers: [
        ZoneProvinceService,
        ZoneDistrictService,
        ZoneWardService,
        TransformerZoneService
    ],
    exports: [
        TransformerZoneService,
        ZoneProvinceService,
        ZoneDistrictService,
        ZoneWardService,
    ],
})
export class ZoneModule {
}

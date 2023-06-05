import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { ZoneWardService } from '../services/zoneWard.service';
import { TransformerZoneService } from '../services/transformerZone.service';
import { HelperService } from '@core/services/helper.service';
@ApiTags('Frontend/ZoneWard')
@Controller('zone-wards')
@UseInterceptors(CoreTransformInterceptor)
export class FeZoneWardController {
    constructor(
        private zoneWardService: ZoneWardService,
        private transformer: TransformerZoneService,
        private response: ResponseService,
        private helperService: HelperService
    ) {}

    @Get()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.zoneWardService.findAllFrontend(query);
        return this.response.fetchListSuccess(this.transformer.transformZoneWardList(items));
    }
}

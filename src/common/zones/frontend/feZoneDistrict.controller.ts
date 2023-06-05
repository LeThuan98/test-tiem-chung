import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { ZoneDistrictService } from '../services/zoneDistrict.service';
import { TransformerZoneService } from '../services/transformerZone.service';
import { HelperService } from '@core/services/helper.service';

@ApiTags('Frontend/ZoneDistrict')
@Controller('zone-districts')
@UseInterceptors(CoreTransformInterceptor)
export class FeZoneDistrictController {
    constructor(
        private zoneDistrictService: ZoneDistrictService,
        private transformer: TransformerZoneService,
        private response: ResponseService,
        private helperService: HelperService
    ) {}

    @Get()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.zoneDistrictService.findAllFrontend(query);
        return this.response.fetchListSuccess(this.transformer.transformZoneDistrictList(items));
    }
}

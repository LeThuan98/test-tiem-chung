import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { ZoneProvinceService } from '../services/zoneProvince.service';
import { TransformerZoneService } from '../services/transformerZone.service';
import { HelperService } from '@core/services/helper.service';
@ApiTags('Frontend/ZoneProvince')
@Controller('zone-provinces')
@UseInterceptors(CoreTransformInterceptor)
export class FeZoneProvinceController {
    constructor(
        private zoneProvinceService: ZoneProvinceService,
        private transformer: TransformerZoneService,
        private response: ResponseService,
        private helperService: HelperService
    ) {}

    @Get()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.zoneProvinceService.findAllFrontend(query);
        return this.response.fetchListSuccess(this.transformer.transformZoneProvinceList(items));
    }
}

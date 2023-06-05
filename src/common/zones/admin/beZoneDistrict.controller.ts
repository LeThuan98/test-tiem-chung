import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { Permissions } from "@core/services/permission.service";
import { UserSecure } from "@src/common/auth/user/decorators/userSecure.decorator";
import { ACL } from '@common/auth/decorators/acl.decorator';
import { ResponseService } from '@core/services/response.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { ZoneProvinceService } from '../services/zoneProvince.service';
import { ZoneDistrictService } from '../services/zoneDistrict.service';
import { TransformerZoneService } from '../services/transformerZone.service';
import { HelperService } from '@core/services/helper.service';
import { BeZoneDistrictDto } from './dto/beZoneDistrict.dto';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
@ApiTags('Admin/ZoneDistrict')
@Controller('admin/zone-districts')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
export class BeZoneDistrictController {
    constructor(
        private zoneProvinceService: ZoneProvinceService,
        private zoneDistrictService: ZoneDistrictService,
        private transformer: TransformerZoneService,
        private response: ResponseService,
        private helperService: HelperService
    ) {}

    @Get()
    @ACL(Permissions.zone_district_list)
    @ApiExcludeEndpoint()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.zoneDistrictService.findAll(query);
        if (query.get && query.export) return this.transformer.transformDistrictExport(items);
        return this.response.fetchListSuccess(this.transformer.transformZoneDistrictList(items));
    }

    @Get(':id')
    @ACL(Permissions.zone_district_detail)
    @ApiExcludeEndpoint()
    async findById(@Param('id') id: string): Promise<any> {
        let item = await this.zoneDistrictService.findById(id);
        if (!item) return this.response.detailFail();
        return this.response.detailSuccess(this.transformer.transformZoneDistrictDetail(item));
    }

    @Post()
    @ACL(Permissions.zone_district_add)
    @ApiExcludeEndpoint()
    async add(@Body() dto: BeZoneDistrictDto): Promise<any> {
        let province = await this.zoneProvinceService.findById(dto.zoneProvince);
        if (!province) return this.response.detailFail('Province not found');
        //
        let item = await this.zoneDistrictService.create(dto);
        if (!item) return this.response.createdFail();
        return this.response.createdSuccess(this.transformer.transformZoneDistrictDetail(item));
    }

    @Put(':id')
    @ACL(Permissions.zone_district_edit)
    @ApiExcludeEndpoint()
    async edit(@Param('id') id: string, @Body() dto: BeZoneDistrictDto): Promise<any> {
        let province = await this.zoneProvinceService.findById(dto.zoneProvince);
        if (!province) return this.response.detailFail('Province not found');
        //
        let item = await this.zoneDistrictService.update(id, dto);
        if (!item) return this.response.updatedFail();
        return this.response.updatedSuccess(this.transformer.transformZoneDistrictDetail(item));
    }

    @Delete()
    @ACL(Permissions.zone_district_delete)
    @ApiExcludeEndpoint()
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        let items = await this.zoneDistrictService.deleteManyById(ids);
        if (!items) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { Permissions } from "@core/services/permission.service";
import { UserSecure } from "@src/common/auth/user/decorators/userSecure.decorator";
import { ACL } from '@common/auth/decorators/acl.decorator';
import { ResponseService } from '@core/services/response.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { ZoneProvinceService } from '../services/zoneProvince.service';
import { TransformerZoneService } from '../services/transformerZone.service';
import { HelperService } from '@core/services/helper.service';
import { BeZoneProvinceDto } from './dto/beZoneProvince.dto';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
@ApiTags('Admin/ZoneProvince')
@Controller('admin/zone-provinces')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
export class BeZoneProvinceController {
    constructor(
        private zoneProvinceService: ZoneProvinceService,
        private transformer: TransformerZoneService,
        private response: ResponseService,
        private helperService: HelperService
    ) {}

    @Get()
    @ACL(Permissions.zone_province_list)
    @ApiExcludeEndpoint()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.zoneProvinceService.findAll(query);
        if(query.get && query.export) return this.transformer.transformProvinceExport(items);
        return this.response.fetchListSuccess(this.transformer.transformZoneProvinceList(items, {}, false));
    }

    @Get(':id')
    @ACL(Permissions.zone_province_detail)
    @ApiExcludeEndpoint()
    async findById(@Param('id') id: string): Promise<any> {
        let item = await this.zoneProvinceService.findById(id);
        if (!item) return this.response.detailFail();
        return this.response.detailSuccess(this.transformer.transformZoneProvinceDetail(item));
    }

    @Post()
    @ACL(Permissions.zone_province_add)
    @ApiExcludeEndpoint()
    async add(@Body() dto: BeZoneProvinceDto): Promise<any> {
        let item = await this.zoneProvinceService.create(dto);
        if (!item) return this.response.createdFail();
        return this.response.createdSuccess(this.transformer.transformZoneProvinceDetail(item));
    }

    @Put(':id')
    @ACL(Permissions.zone_province_edit)
    @ApiExcludeEndpoint()
    async edit(@Param('id') id: string, @Body() dto: BeZoneProvinceDto): Promise<any> {
        let item = await this.zoneProvinceService.update(id, dto);
        if (!item) return this.response.updatedFail();
        return this.response.updatedSuccess(this.transformer.transformZoneProvinceDetail(item));
    }

    @Delete()
    @ACL(Permissions.zone_province_delete)
    @ApiExcludeEndpoint()
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        let items = await this.zoneProvinceService.deleteManyById(ids);
        if (!items) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

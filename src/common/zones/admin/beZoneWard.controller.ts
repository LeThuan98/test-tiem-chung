import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { Permissions } from "@core/services/permission.service";
import { UserSecure } from "@src/common/auth/user/decorators/userSecure.decorator";
import { ACL } from '@common/auth/decorators/acl.decorator';
import { ResponseService } from '@core/services/response.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { ZoneWardService } from '../services/zoneWard.service';
import { ZoneDistrictService } from '../services/zoneDistrict.service';
import { TransformerZoneService } from '../services/transformerZone.service';
import { HelperService } from '@core/services/helper.service';
import { BeZoneWardDto } from './dto/beZoneWard.dto';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
@ApiTags('Admin/ZoneWard')
@Controller('admin/zone-wards')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
export class BeZoneWardController {
    constructor(
        private zoneWardService: ZoneWardService,
        private zoneDistrict: ZoneDistrictService,
        private transformer: TransformerZoneService,
        private response: ResponseService,
        private helperService: HelperService
    ) {}

    @Get()
    @ACL(Permissions.zone_ward_list)
    @ApiExcludeEndpoint()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.zoneWardService.findAll(query);
        if(query.get && query.export) return this.transformer.transformWardExport(items);
        return this.response.fetchListSuccess(this.transformer.transformZoneWardList(items));
    }

    @Get(':id')
    @ACL(Permissions.zone_ward_detail)
    @ApiExcludeEndpoint()
    async findById(@Param('id') id: string): Promise<any> {
        let item = await this.zoneWardService.findById(id);
        if (!item) return this.response.detailFail();
        return this.response.detailSuccess(this.transformer.transformZoneWardDetail(item));
    }

    @Post()
    @ACL(Permissions.zone_ward_add)
    @ApiExcludeEndpoint()
    async add(@Body() dto: BeZoneWardDto): Promise<any> {
        let district = await this.zoneDistrict.findById(dto.zoneDistrict);
        if (!district) return this.response.detailFail('District not found');
        //
        let item = await this.zoneWardService.create(dto);
        if (!item) return this.response.createdFail();
        return this.response.createdSuccess(this.transformer.transformZoneWardDetail(item));
    }

    @Put(':id')
    @ACL(Permissions.zone_ward_edit)
    @ApiExcludeEndpoint()
    async edit(@Param('id') id: string, @Body() dto: BeZoneWardDto): Promise<any> {
        let district = await this.zoneDistrict.findById(dto.zoneDistrict);
        if (!district) return this.response.detailFail('District not found');
        //
        let item = await this.zoneWardService.update(id, dto);
        if (!item) return this.response.updatedFail();
        return this.response.updatedSuccess(this.transformer.transformZoneWardDetail(item));
    }

    @Delete()
    @ACL(Permissions.zone_ward_delete)
    @ApiExcludeEndpoint()
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        let items = await this.zoneWardService.deleteManyById(ids);
        if (!items) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

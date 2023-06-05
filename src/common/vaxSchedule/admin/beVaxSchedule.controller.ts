import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { HelperService } from '@core/services/helper.service';
import { BeVaxScheduleDto } from './dto/beVaxSchedule.dto';
import { VaxScheduleService } from '../services/vaxSchedule.service';
import { TransformerVaxScheduleService } from '../services/transformerVaxSchedule.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UserSecure } from "@src/common/auth/user/decorators/userSecure.decorator";
import { ACL } from '@common/auth/decorators/acl.decorator';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { Permissions } from "@core/services/permission.service";
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { saveFileContent } from '@src/core/helpers/content';

@ApiTags('Admin/VaxSchedule')
@Controller('admin/vax-schedule')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
export class BeVaxScheduleController {
    constructor(
        private vaxSchedule: VaxScheduleService,
        private transformer: TransformerVaxScheduleService,
        private response: ResponseService,
        private helper: HelperService
    ) {}

    @Get()
    @ACL(Permissions.schedule_list)
    @DefaultListQuery()
    @ApiExcludeEndpoint()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.vaxSchedule.findAll(query);
        return this.response.fetchListSuccess(this.transformer.transformVaxScheduleList(items));
    }

    @Get(':id')
    @ACL(Permissions.schedule_detail)
    @ApiExcludeEndpoint()
    async findById(@Param('id') id: string): Promise<any> {
        let item = await this.vaxSchedule.findById(id);
        if (!item) return this.response.detailFail();
        
        return this.response.detailSuccess(this.transformer.transformVaxScheduleDetail(item));
    }

    @Post()
    @ACL(Permissions.schedule_add)
    @HasFile()
    @ApiExcludeEndpoint()
    async add(@UploadedFiles() files, @Body('contentRmImgs') contentRmImgs: Array<string>, @Body() dto: BeVaxScheduleDto): Promise<any> {
        let item = await this.vaxSchedule.create(dto, files, contentRmImgs);
        if (!item) return this.response.createdFail();
        return this.response.createdSuccess(this.transformer.transformVaxScheduleDetail(item));
    }

    @Put(':id')
    @ACL(Permissions.schedule_edit)
    @HasFile()
    @ApiExcludeEndpoint()
    async edit(
        @UploadedFiles() files, @Body('contentRmImgs') contentRmImgs: Array<string>,
        @Param('id') id: string, @Body() dto: BeVaxScheduleDto): Promise<any> {
        let item = await this.vaxSchedule.update(id, dto, files, contentRmImgs);
        if (!item) return this.response.updatedFail();
        return this.response.updatedSuccess(this.transformer.transformVaxScheduleDetail(item));
    }

    @Delete()
    @ACL(Permissions.schedule_delete)
    @ApiExcludeEndpoint()
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        let items = await this.vaxSchedule.deleteManyById(ids);
        if (!items) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

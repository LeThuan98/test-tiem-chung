import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    UseInterceptors,
    Param,
    Query,
    Delete,
} from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { UserAuthService } from '@common/auth/user/services/auth.service';
import { HelperService } from '@core/services/helper.service';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { Permissions } from '@core/services/permission.service';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { ApiTags, ApiBody, ApiHeader, ApiParam, ApiExcludeController } from '@nestjs/swagger';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { VaccinationRecordService } from '../services/record.service';
import { TransformerRecordService } from '../services/transformerRecord.service';
import { BeRecordDto } from '../dto/beRecord.dto';

@ApiTags('Admin/Vaccination Record')
@Controller('admin/vaccination-record')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@ApiExcludeController()
export class BeRecordController {
    constructor(
        private recordService: VaccinationRecordService,
        private response: ResponseService,
        private userAuthService: UserAuthService,
        private helperService: HelperService,
        private transformer: TransformerRecordService,
    ) {}


    @Get()
    @DefaultListQuery()
    @ACL(Permissions.message_list)
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.recordService.findAll(query);
        if (query.get && query.export) return await this.transformer.transformRecordExport(items);
        return this.response.fetchListSuccess(await this.transformer.transformRecordList(items));
    }


    @ApiParam({ name: 'id', type: String })
    @Get(':id')
    @ACL(Permissions.message_detail)
    async detail(@Param('id') id) {
        let record = await this.recordService.detail(id);
        if (!record) return this.response.detailFail();
        return this.response.detailSuccess(
            await this.transformer.transformRecordDetail(record),
        );
    }

    


    @Put(':id')
    @ApiParam({ name: 'id', type: String })
    @ACL(Permissions.message_edit)
    async update(@Param('id') id, @Body() dto: BeRecordDto): Promise<any> {
        try {
            let record = await this.recordService.update(id, dto);
            if (!record) return this.response.updatedFail();
            return this.response.updatedSuccess(
                await this.transformer.transformRecordDetail(record),
            );
        } catch (error) {
            return this.response.updatedFail(error.message);
        }
    }


    @Delete()
    @ApiBody({ type: Array })  
    @ACL(Permissions.message_delete)
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        let item = await this.recordService.deletes(ids);
        if (!item) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

import { ACL } from '@common/auth/decorators/acl.decorator';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { HelperService } from '@core/services/helper.service';
import { Permissions } from '@core/services/permission.service';
import { ResponseService } from '@core/services/response.service';
import {
    Body, Controller, Delete, Get, Param, Post, Put, Query, 
    UploadedFiles, UseInterceptors
} from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { TransformerQuestionService } from '../services/transformerQuestion.service';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ResultService } from '../services/result.service';
import { BeResultDto } from '../dto/beResult.dto';

@ApiTags('Admin/Result')
@Controller('admin/results')
@UserSecure()
@ApiExcludeController()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeResultController {
    constructor(
        private resultService: ResultService,
        private helperService: HelperService,
        private transformer: TransformerQuestionService,
        private response: ResponseService,
    ) {}

    @Get()
    @DefaultListQuery()
    @ACL(Permissions.user_list)
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.resultService.findAll(query);
        if (query.get && query.export) return this.transformer.transformResultExport(items);
        return this.response.fetchListSuccess(this.transformer.transformResultList(items));
    }

    @Get(':id')
    @ACL(Permissions.user_detail)
    async detail(@Param('id') id: string): Promise<any> {
        let item = (await this.resultService.detail(id)) as any;
        if (!item) return this.response.detailFail();
        return this.response.detailSuccess(this.transformer.transformResultDetail(item));
    }

    @Post()
    @ACL(Permissions.user_add)
    @HasFile()
    async create(@Body() dto: BeResultDto): Promise<any> {
        let item = await this.resultService.create(dto);
        if (!item) return this.response.createdFail();
        return this.response.createdSuccess(this.transformer.transformResultDetail(item));
    }

    @Put(':id')
    @ACL(Permissions.user_edit)
    @HasFile()
    async update( @Param('id') id: string, @Body() dto: BeResultDto, ): Promise<any> {
        let item = await this.resultService.update(id, dto);
        if (!item) return this.response.updatedFail();
        return this.response.updatedSuccess(this.transformer.transformResultDetail(item));    
    }

    @Delete()
    @ACL(Permissions.user_delete)
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        let item = await this.resultService.deletes(ids);
        if (!item) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

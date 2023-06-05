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
import { AskService } from '../services/ask.service';
import { TransformerAskService } from '../services/transformerAsk.service';
import { BeAskDto } from '../dto/beAsk.dto';

@ApiTags('Admin/Ask')
@Controller('admin/asks')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@ApiExcludeController()
export class BeAskController {
    constructor(
        private askService: AskService,
        private response: ResponseService,
        private userAuthService: UserAuthService,
        private helperService: HelperService,
        private transformer: TransformerAskService,
    ) {}


    @Get()
    @DefaultListQuery()
    @ACL(Permissions.ask_list)
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.askService.findAll(query);
        if (query.get && query.export) return await this.transformer.transformAskExport(items);
        return this.response.fetchListSuccess(await this.transformer.transformAskList(items));
    }


    @ApiParam({ name: 'id', type: String })
    @Get(':id')
    @ACL(Permissions.ask_detail)
    async detail(@Param('id') id) {
        let ask = await this.askService.detail(id);
        if (!ask) return this.response.detailFail();
        return this.response.detailSuccess(
            await this.transformer.transformAskDetail(ask),
        );
    }

    
    @Put(':id')
    @ApiParam({ name: 'id', type: String })
    @ACL(Permissions.ask_edit)
    async sendAnswer(@Param('id') id, @Body() dto: BeAskDto): Promise<any> {
        try {
            let ask = await this.askService.sendAnswer(id, dto);
            if (!ask) return this.response.updatedFail();
            return this.response.updatedSuccess(
                await this.transformer.transformAskDetail(ask),
            );
        } catch (error) {
            return this.response.updatedFail(error.message);
        }
    }


    @Delete()
    @ApiBody({ type: Array })  
    @ACL(Permissions.ask_delete)
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        let item = await this.askService.deletes(ids);
        if (!item) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Request,
    UseInterceptors,
    UploadedFiles,
    Param,
    Query,
    HttpStatus,
    Delete,
} from '@nestjs/common';
import { ResponseService } from 'src/core/services/response.service';
import { FaqService } from '../services/faq.service';
import { UserAuthService } from 'src/common/auth/user/services/auth.service';
import { HelperService } from 'src/core/services/helper.service';
import { ACL } from 'src/common/auth/decorators/acl.decorator';
import { Permissions } from 'src/core/services/permission.service';
import { UserSecure } from 'src/common/auth/user/decorators/userSecure.decorator';
import { BeFaqDto } from '../dto/beFaq.dto';
import { ApiTags, ApiBody, ApiHeader, ApiParam, ApiExcludeController } from '@nestjs/swagger';
import { TransformerFaqService } from '../services/transformerFaq.service';
import { ActivityInterceptor } from 'src/core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from 'src/core/interceptors/coreTransform.interceptor';
import { HasFile } from 'src/core/decorators/hasFile.decorator';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';

@ApiTags('Admin/Faq')
@Controller('admin/faqs')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@ApiExcludeController()
export class BeFaqController {
    constructor(
        private faqService: FaqService,
        private response: ResponseService,
        private userAuthService: UserAuthService,
        private helperService: HelperService,
        private transformer: TransformerFaqService,
    ) {}


    @Get()
    @ACL(Permissions.faq_list)
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.faqService.findAll(query);
        if (query.get && query.export) return await this.transformer.transformFaqExport(items);
        return this.response.fetchListSuccess(await this.transformer.transformFaqList(items));
    }


    @ApiParam({ name: 'id', type: String })
    @Get(':id')
    @ACL(Permissions.faq_detail)
    async detail(@Param('id') id) {
        let faq = await this.faqService.detail(id);
        if (!faq) return this.response.detailFail();
        return this.response.detailSuccess(
            await this.transformer.transformFaqDetail(faq),
        );
    }

    @Post()
    // @ApiBody({ type: BeFaqDto })  
    @ACL(Permissions.faq_add)    
    async create(@Body() dto: BeFaqDto): Promise<any> {
        try {
            let faq = await this.faqService.create(dto);
            if (!faq) return this.response.createdFail();
            return this.response.createdSuccess(
                await this.transformer.transformFaqDetail(faq),
            );
        } catch (error) {
            return this.response.createdFail(error.message);
        }
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: String })
    @ACL(Permissions.faq_edit)
    async update(@Param('id') id, @Body() dto: BeFaqDto): Promise<any> {
        try {
            let faq = await this.faqService.update(id, dto);
            if (!faq) return this.response.updatedFail();
            return this.response.updatedSuccess(
                await this.transformer.transformFaqDetail(faq),
            );
        } catch (error) {
            return this.response.updatedFail(error.message);
        }
    }

    @Delete()
    @ApiParam({ name: 'id', type: String })
    @ACL(Permissions.faq_delete)
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        let item = await this.faqService.deletes(ids);
        if (!item) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

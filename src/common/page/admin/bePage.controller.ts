import {
    Body, Controller,
    Get, Post, Put,
    Request, UseInterceptors,
    UploadedFiles, Param,
    Query, HttpStatus,
    Delete,
} from '@nestjs/common';
import { ResponseService } from 'src/core/services/response.service';
import { PageService } from '../services/page.service';
import { UserAuthService } from 'src/common/auth/user/services/auth.service';
import { HelperService } from 'src/core/services/helper.service';
import { ACL } from 'src/common/auth/decorators/acl.decorator';
import { Permissions } from 'src/core/services/permission.service';
import { UserSecure } from 'src/common/auth/user/decorators/userSecure.decorator';
import { BePageDto } from '../dto/bePage.dto';
import { ApiTags, ApiBody, ApiHeader, ApiParam, ApiExcludeEndpoint } from '@nestjs/swagger';
import { TransformerPageService } from '../services/transformerPage.service';
import { ActivityInterceptor } from 'src/core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from 'src/core/interceptors/coreTransform.interceptor';
import { HasFile } from 'src/core/decorators/hasFile.decorator';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';

@ApiTags('Admin/Page')
@Controller('admin/pages')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BePageController {
    constructor(
        private pageService: PageService,
        private response: ResponseService,
        private userAuthService: UserAuthService,
        private helperService: HelperService,
        private transformer: TransformerPageService,
    ) {}

    @Get()
    @ApiExcludeEndpoint()
    @ACL(Permissions.page_list)
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.pageService.findAll(query);
        if (query.get && query.export) return await this.transformer.transformPageExport(items);
        return this.response.fetchListSuccess(await this.transformer.transformPageList(items, {}, false, {}, true));
    }

    @Get(':id')
    @ApiExcludeEndpoint()
    @ACL(Permissions.page_detail)
    async detail(@Param('id') id) {
        let page = await this.pageService.detail(id);
        if (!page) return this.response.detailFail();
        return this.response.detailSuccess( await this.transformer.transformPageDetail(page) );
    }

    @Post()
    @HasFile() 
    @ApiExcludeEndpoint()
    @ACL(Permissions.page_add)
    async create(@UploadedFiles() files: Record<any, any>, @Body() dto: BePageDto): Promise<any> {
        let page = await this.pageService.create(dto, files);
        if (!page) return this.response.createdFail();
        return this.response.createdSuccess(
            await this.transformer.transformPageDetail(page),
        );
    }

    @Put(':id')
    @HasFile()
    @ApiExcludeEndpoint()
    @ACL(Permissions.page_edit)
    async update(@UploadedFiles() files, @Body('contentRmImgs') contentRmImgs: Array<string>,  @Param('id') id: string, @Body() dto: BePageDto): Promise<any> {
        let page = await this.pageService.update(id, dto, files, contentRmImgs);
        if (!page) return this.response.updatedFail();
        return this.response.updatedSuccess( await this.transformer.transformPageDetail(page) );
    }

    // @Delete()
    // @ApiExcludeEndpoint()
    // @ACL(Permissions.page_delete)
    // async deletes(@Body('ids') ids: Array<string>): Promise<any> {
    //     let item = await this.pageService.deletes(ids);
    //     if (!item) return this.response.deletedFail();
    //     return this.response.deletedSuccess();
    // }
}

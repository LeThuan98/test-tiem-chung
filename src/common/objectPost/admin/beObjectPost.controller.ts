import {
    Body, Controller,
    Get, Post, Put,
    Request, UseInterceptors,
    UploadedFiles, Param,
    Query, HttpStatus,
    Delete,
} from '@nestjs/common';
import { ResponseService } from 'src/core/services/response.service';
import { UserAuthService } from 'src/common/auth/user/services/auth.service';
import { HelperService } from 'src/core/services/helper.service';
import { ACL } from 'src/common/auth/decorators/acl.decorator';
import { Permissions } from 'src/core/services/permission.service';
import { UserSecure } from 'src/common/auth/user/decorators/userSecure.decorator';
import { ApiTags, ApiBody, ApiHeader, ApiParam, ApiExcludeEndpoint, ApiExcludeController } from '@nestjs/swagger';
import { ActivityInterceptor } from 'src/core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from 'src/core/interceptors/coreTransform.interceptor';
import { HasFile } from 'src/core/decorators/hasFile.decorator';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ObjectPostService } from '../services/objectPost.service';
import { TransformerObjectPostService } from '../services/transformerObjectPost.service';
import { BeObjectPostDto } from '../dto/objectPost.dto';
import { isNotEmpty } from 'class-validator';

@ApiTags('Admin/ObjectPost')
@Controller('admin/objectpost')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@ApiExcludeController()
export class BeObjectPostController {
    constructor(
        private objectPostService: ObjectPostService,
        private response: ResponseService,
        private userAuthService: UserAuthService,
        private helperService: HelperService,
        private transformer: TransformerObjectPostService,
    ) {}

    @Get()
    @ACL(Permissions.object_post_list)
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.objectPostService.findAll(query);
        if (query.get && query.export) return await this.transformer.transformPageExport(items);
        return this.response.fetchListSuccess(await this.transformer.transformPageList(items, {}, false, {}, true));
    }

    @ApiHeader({ name: 'Authorization', description: 'token' })
    @ApiParam({ name: 'id', type: String })
    @Get(':id')
    @ACL(Permissions.object_post_edit)
    async detail(@Param('id') id) {
        let page = await this.objectPostService.detail(id);
        if (!page) return this.response.detailFail();
        return this.response.detailSuccess( await this.transformer.transformPageDetail(page) );
    }

    @Post()
    @ApiBody({ type: BeObjectPostDto })
    @HasFile()
    @ACL(Permissions.object_post_add)
    async create(@UploadedFiles() files: Record<any, any>, @Body() dto: BeObjectPostDto): Promise<any> {
        let objectVaccination = await this.objectPostService.create(dto, files);
        if (!objectVaccination) return this.response.createdFail();
        return this.response.createdSuccess(
            await this.transformer.transformPageDetail(objectVaccination),
        );
    }

    @Put(':id')
    @ApiBody({ type: BeObjectPostDto })
    @HasFile()
    @ACL(Permissions.object_post_add)
    async update(@UploadedFiles() files: Record<any, any>, @Body('contentRmImgs') contentRmImgs: Array<string>,  @Param('id') id: string, @Body() dto: BeObjectPostDto): Promise<any> {
        let objectVaccination = await this.objectPostService.update(id, dto, files, contentRmImgs);
        if (!objectVaccination) return this.response.createdFail();
        return this.response.createdSuccess(
            await this.transformer.transformPageDetail(objectVaccination),
        );
    }

    @Delete()
    @ACL(Permissions.object_post_delete)
    @ApiExcludeEndpoint()
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        if(!isNotEmpty(ids[0])) return this.response.deletedFail("Chọn một trường để xoá!!");
        let items = await this.objectPostService.deletes(ids);
        if (!items) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }

}

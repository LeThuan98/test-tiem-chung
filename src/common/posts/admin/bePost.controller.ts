import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { HelperService } from '@core/services/helper.service';
import { BePostDto } from './dto/bePost.dto';
import { PostService } from '../services/post.service';
import { TransformerPostService } from '../services/transformerPost.service';
import { ApiExcludeController, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UserSecure } from "@src/common/auth/user/decorators/userSecure.decorator";
import { ACL } from '@common/auth/decorators/acl.decorator';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { Permissions } from "@core/services/permission.service";
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { isNotEmpty } from 'class-validator';
@ApiTags('Admin/Post')
@Controller('admin/posts')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
@ApiExcludeController()
export class BePostController {
    constructor(
        private post: PostService,
        private transformer: TransformerPostService,
        private response: ResponseService,
        private helper: HelperService
    ) {}

    @Get()
    @ACL(Permissions.post_list)
    @DefaultListQuery()
    @ApiExcludeEndpoint()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.post.findAll(query);
        if (query.export && query.get) return await this.transformer.transformPostExport(items);
        return this.response.fetchListSuccess(await this.transformer.transformPostList(items, {}, false, {}, true));
    }

    @Get(':id')
    @ACL(Permissions.post_detail)
    @ApiExcludeEndpoint()
    async findById(@Param('id') id: string): Promise<any> {
        let item = await this.post.findById(id);
        if (!item) return this.response.detailFail();
        return this.response.detailSuccess(this.transformer.transformPostDetail(item));
    }

    @Post()
    @ACL(Permissions.post_add)
    @ApiExcludeEndpoint()
    @HasFile()
    async add(@UploadedFiles() files, @Body() dto: BePostDto): Promise<any> {
        try {
            let item = await this.post.create(dto, files);
            if (!item) return this.response.createdFail();
            return this.response.createdSuccess(this.transformer.transformPostDetail(item));            
        } catch (error) {
            return this.response.createdFail(error.message);
        }
    }

    @Put(':id')
    @ACL(Permissions.post_edit)
    @ApiExcludeEndpoint()
    @HasFile()
    async edit(@UploadedFiles() files, @Param('id') id: string, @Body() dto: BePostDto, @Body('contentRmImgs') contentRmImgs: Array<string>): Promise<any> {
        try {
            let item = await this.post.update(id, dto, files, contentRmImgs);
            if (!item) return this.response.updatedFail();
            return this.response.updatedSuccess(this.transformer.transformPostDetail(item));            
        } catch (error) {
            return this.response.updatedFail(error.message);
        }
    }

    @Delete()
    @ACL(Permissions.post_delete)
    @ApiExcludeEndpoint()
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        if(!isNotEmpty(ids[0])) return this.response.deletedFail("Chọn một trường để xoá!!");
        let items = await this.post.deleteManyById(ids);
        if (!items) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

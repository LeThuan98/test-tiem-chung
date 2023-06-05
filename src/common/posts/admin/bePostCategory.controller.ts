import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { BePostCategoryDto } from './dto/bePostCategory.dto';
import { PostCategoryService } from '../services/postCategory.service';
import { TransformerPostService } from '../services/transformerPost.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UserSecure } from "@src/common/auth/user/decorators/userSecure.decorator";
import { ACL } from '@common/auth/decorators/acl.decorator';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { saveFileContent } from '@core/helpers/content';
import { Permissions } from "@core/services/permission.service";
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { isNotEmpty } from 'class-validator';
@ApiTags('Admin/PostCategory')
@Controller('admin/post-categories')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
export class BePostCategoryController {
    constructor(
        private category: PostCategoryService,
        private transformer: TransformerPostService,
        private response: ResponseService
    ) {}

    @Get()
    @ACL(Permissions.post_category_list)
    @ApiExcludeEndpoint()
    @DefaultListQuery()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.category.findAll(query);
        if (query.export && query.get) return this.transformer.transformCategoryExport(items);
        return this.response.fetchListSuccess(this.transformer.transformCategoryList(items));
    }

    @Get(':id')
    @ACL(Permissions.post_category_detail)
    @ApiExcludeEndpoint()
    async findById(@Param('id') id: string): Promise<any> {
        let item = await this.category.findById(id);
        if (!item) return this.response.detailFail();
        await saveFileContent('content', item, 'postCategories', false);
        return this.response.detailSuccess(this.transformer.transformCategoryDetail(item));
    }

    @Post()
    @ACL(Permissions.post_category_add)
    @HasFile()
    @ApiExcludeEndpoint()
    async add(@UploadedFiles() files, @Body() dto: BePostCategoryDto): Promise<any> {
        try {
            let item = await this.category.create(dto, files);
            if (!item) return this.response.createdFail();
            return this.response.createdSuccess(this.transformer.transformCategoryDetail(item));            
        } catch (error) {
            return this.response.createdFail(error.message);
        }
    }

    @Put(':id')
    @ACL(Permissions.post_category_edit)
    @HasFile()
    @ApiExcludeEndpoint()
    async edit(
        @UploadedFiles() files, @Body('contentRmImgs') contentRmImgs: Array<string>,
        @Param('id') id: string, @Body() dto: BePostCategoryDto): Promise<any> 
    {
        try {
            let item = await this.category.update(id, dto, files, contentRmImgs);
            if (!item) return this.response.updatedFail();
            return this.response.updatedSuccess(this.transformer.transformCategoryDetail(item));            
        } catch (error) {
            return this.response.updatedFail(error.message);
        }
    }

    @Delete()
    @ACL(Permissions.post_category_delete)
    @ApiExcludeEndpoint()
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        if(!isNotEmpty(ids[0])) return this.response.deletedFail("Chọn một trường để xoá!!");
        let items = await this.category.deletes(ids);
        if (!items) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

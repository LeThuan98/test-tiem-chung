import { Controller, Get, Query, Param, UseInterceptors } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { PostCategoryService } from '../services/postCategory.service';
import { TransformerPostService } from '../services/transformerPost.service';
import { ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { saveFileContent } from '@core/helpers/content';
import { DefaultListQuery } from '@src/core/decorators/defaultListQuery.decorator';
@ApiTags('Frontend/PostCategory')
@Controller('post-categories')
@UseInterceptors(CoreTransformInterceptor)
export class FePostCategoryController {
    constructor(
        private category: PostCategoryService,
        private transformer: TransformerPostService,
        private response: ResponseService
    ) {}

    @DefaultListQuery()
    @Get()
    async findByPageCode(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.category.findAllFrontend(query);
        return this.response.fetchListSuccess(this.transformer.transformCategoryList(items));
    }

    @Get(':slug')
    async findById(@Param('slug') slug: string): Promise<any> {
        let item = await this.category.findBySlug(slug);
        if (!item) return this.response.detailFail();
        return this.response.detailSuccess(this.transformer.transformCategoryDetail(item));
    }
}

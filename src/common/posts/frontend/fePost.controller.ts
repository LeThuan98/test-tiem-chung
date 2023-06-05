import { Controller, Get, Query, Param, UseInterceptors } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { PostService } from '../services/post.service';
import { TransformerPostService } from '../services/transformerPost.service';
import { ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@src/core/decorators/defaultListQuery.decorator';
import { saveFileContent } from '@src/core/helpers/content';
@ApiTags('Frontend/Post')
@Controller('posts')
@UseInterceptors(CoreTransformInterceptor)
export class FePostController {
    constructor(
        private post: PostService,
        private transformer: TransformerPostService,
        private response: ResponseService
    ) {}

    @DefaultListQuery()
    @Get()
    async findByPageCode(@Query() query: Record<string, any>): Promise<any> {
        query.populate = ['postCategory','author','lastEditor'];
        let items = await this.post.findAllFrontend(query);
        return this.response.fetchListSuccess(await this.transformer.transformPostList(items, {}, false, {}, true));
    }

    @Get(':slug')
    async findById(@Param('slug') slug: string): Promise<any> {
        let item = await this.post.findBySlug(slug);
        if (!item) return this.response.detailFail();
        // await saveFileContent('content', item, 'posts', false);
        return this.response.detailSuccess(await this.transformer.transformPostDetail(item.post,{
            related: this.transformer.transformPostList(item.related, {}, false, {}, true) 
        }, false, true));
    }
}

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
} from '@nestjs/common';
import { ResponseService } from 'src/core/services/response.service';
import { PageService } from '../services/page.service';
import { ApiTags } from '@nestjs/swagger';
import { TransformerPageService } from '../services/transformerPage.service';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { FePageDto } from '../dto/fePage.dto';
import { saveFileContent } from '@src/core/helpers/content';
import { CoreTransformInterceptor } from '@src/core/interceptors/coreTransform.interceptor';

@ApiTags('Page')
@Controller('pages')
@UseInterceptors(CoreTransformInterceptor)
export class FePageController {
    constructor(
        private pageService: PageService,
        private response: ResponseService,
        private transformer: TransformerPageService,
    ) {}

    // @Get()
    // @DefaultListQuery()
    // async findAll(@Query() query: Record<string, any>): Promise<any> {
    //     let items = await this.pageService.findAll(query);
    //     return this.response.fetchListSuccess(await this.transformer.transformPageList(items));
    // }

    @Get('find-by-page-code')
    async findByPageCode(@Query() query: FePageDto): Promise<any> {
        let page = await this.pageService.findByCodeFrontend(query.pageCode);
        if (!page) return this.response.detailFail();
        await saveFileContent('content', page, 'pages', false);
        return this.response.detailSuccess(await this.transformer.transformPageDetail(page));
    }
}

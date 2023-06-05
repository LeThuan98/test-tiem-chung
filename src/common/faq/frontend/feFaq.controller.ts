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
import { FaqService } from '../services/faq.service';
import { ApiTags } from '@nestjs/swagger';
import { TransformerFaqService } from '../services/transformerFaq.service';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';

@ApiTags('Faq')
@Controller('faqs')
// @UseInterceptors(CoreTransformInterceptor)
export class FeFaqController {
    constructor(
        private faqService: FaqService,
        private response: ResponseService,
        private transformer: TransformerFaqService,
    ) {}

    @Get()
    @DefaultListQuery()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.faqService.findAll(query);
        return this.response.fetchListSuccess(await this.transformer.transformFaqList(items));
    }

    @Get(':id')
    @DefaultListQuery()
    async detail(@Param('id') id) {
        let faq = await this.faqService.detail(id);
        if (!faq) return this.response.detailFail();
        return this.response.detailSuccess(
            await this.transformer.transformFaqDetail(faq),
        );
    }
}

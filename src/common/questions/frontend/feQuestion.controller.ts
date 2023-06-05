import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { ApiTags, ApiQuery, ApiBody} from '@nestjs/swagger';
import { QuestionService } from '../services/question.service';
import { TransformerQuestionService } from '../services/transformerQuestion.service';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { FeResultDto } from '../dto/feResult.dto';

@ApiTags('Question')
@Controller('questions')
export class FeQuestionController {
    constructor(
        private questionService: QuestionService,
        private response: ResponseService,
        private transformer: TransformerQuestionService,
    ) {}

    @Get()
    @DefaultListQuery()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.questionService.findAll(query);
        if (query.get && query.export) return await this.transformer.transformQuestionExport(items);
        return this.response.fetchListSuccess(await this.transformer.transformQuestionList(items));
    }

    @Post()
    async result(@Body() dto: FeResultDto): Promise<any> {
        let item = await this.questionService.checkResult(dto);
        if (!item) return this.response.detailFail();
        return this.response.detailSuccess(this.transformer.transformResultDetail(item));
    }

}

import { ACL } from '@common/auth/decorators/acl.decorator';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { HelperService } from '@core/services/helper.service';
import { Permissions } from '@core/services/permission.service';
import { ResponseService } from '@core/services/response.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { BeQuestionDto } from '../dto/beQuestion.dto';
import { TransformerQuestionService } from '../services/transformerQuestion.service';
import { QuestionService } from '../services/question.service';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';

@ApiTags('Admin/Question')
@Controller('admin/questions')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
@ApiExcludeController()
export class QuestionController {
    constructor(
        private questionService: QuestionService,
        private helperService: HelperService,
        private transformer: TransformerQuestionService,
        private response: ResponseService,
    ) {}

    @Get()
    @DefaultListQuery()
    @ACL(Permissions.user_list)
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.questionService.findAll(query);
        if (query.get && query.export) return this.transformer.transformQuestionExport(items);
        return this.response.fetchListSuccess(this.transformer.transformQuestionList(items));
    }

    @Get(':id')
    @ACL(Permissions.user_detail)
    async detail(@Param('id') id: string): Promise<any> {
        let item = (await this.questionService.detail(id)) as any;
        if (!item) return this.response.detailFail();
        return this.response.detailSuccess(this.transformer.transformQuestionDetail(item));
    }

    @Post()
    @ACL(Permissions.user_add)
    @HasFile()
    async create(@Body() dto: BeQuestionDto): Promise<any> {
        try {
            let item = await this.questionService.create(dto);
            if (!item) return this.response.createdFail();
            return this.response.createdSuccess(this.transformer.transformQuestionDetail(item));
        } catch (error) {
            return this.response.createdFail(error.message);
        }
    }

    @Put(':id')
    @ACL(Permissions.user_edit)
    @HasFile()
    async update(
        @Param('id') id: string,
        @Body() dto: BeQuestionDto,
    ): Promise<any> {
        try {
            let item = await this.questionService.update(id, dto);
            if (!item) return this.response.updatedFail();
            return this.response.updatedSuccess(this.transformer.transformQuestionDetail(item));            
        } catch (error) {
            return this.response.updatedFail(error.message);
        }
    }

    @Delete()
    @ACL(Permissions.user_delete)
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        let item = await this.questionService.deletes(ids);
        if (!item) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

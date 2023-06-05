import { Controller, Get, Query, Param, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { VaxScheduleService } from '../services/vaxSchedule.service';
import { TransformerVaxScheduleService } from '../services/transformerVaxSchedule.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { saveFileContent } from '@src/core/helpers/content';

@ApiTags('Frontend/VaxSchedule')
@Controller('vax-schedule')
@UseInterceptors(CoreTransformInterceptor)
export class FeVaxScheduleController {
    constructor(
        private vaxSchedule: VaxScheduleService,
        private transformer: TransformerVaxScheduleService,
        private response: ResponseService
    ) {}

    @Get()
    async findByPageCode(@Query() query: Record<string, any>): Promise<any> {
        // query.populate = '';
        query.order = 1;
        let items = await this.vaxSchedule.findAllFrontend(query);
        return this.response.fetchListSuccess(this.transformer.transformVaxScheduleListFe(items));
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<any> {
        let item = await this.vaxSchedule.findByTargetId(id);
        if (!item) return this.response.detailFail();
        
        return this.response.detailSuccess(this.transformer.transformVaxScheduleDetailFe(item));
    }
}

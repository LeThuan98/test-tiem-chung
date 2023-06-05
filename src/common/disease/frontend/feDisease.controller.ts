import {
    Body, Controller, Get, Post, Put, Request, UseInterceptors,
    UploadedFiles, Param, Query, HttpStatus, Delete,
} from '@nestjs/common';
import { ResponseService } from 'src/core/services/response.service';
import { UserAuthService } from 'src/common/auth/user/services/auth.service';
import { HelperService } from 'src/core/services/helper.service';
import { ApiTags, ApiBody, ApiHeader, ApiParam } from '@nestjs/swagger';
import { DiseaseService } from '../services/disease.service';
import { TransformerDiseaseService } from '../services/transformerDisease.service';
import { saveFileContent } from '@src/core/helpers/content';
import { DefaultListQuery } from '@src/core/decorators/defaultListQuery.decorator';

@ApiTags('Frontend/Disease')
@Controller('disease')
export class FeDiseaseController {
    constructor(
        private diseaseService: DiseaseService,
        private response: ResponseService,
        private helperService: HelperService,
        private transformer: TransformerDiseaseService,
    ) {}

    @DefaultListQuery()
    @Get()
    async findByPageCode(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.diseaseService.findAllFrontend(query);
        return this.response.fetchListSuccess( await this.transformer.transformDiseaseList(items, {}, false, {}, true));
    }

    @ApiParam({ name: 'slug', type: String })
    @Get(':slug')
    async detail(@Param('slug') slug) {
        let page = await this.diseaseService.findBySlugFrontend(slug);
        if (!page) return this.response.detailFail();
        await saveFileContent('content', page, 'diseases', false);
        return this.response.detailSuccess( await this.transformer.transformDiseaseDetail(page) );
    }

}

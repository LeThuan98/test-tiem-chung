import {
    Body, Controller, Get, Post, Put, Request, UseInterceptors,
    UploadedFiles, Param, Query, HttpStatus, Delete,
} from '@nestjs/common';
import { ResponseService } from 'src/core/services/response.service';
import { UserAuthService } from 'src/common/auth/user/services/auth.service';
import { HelperService } from 'src/core/services/helper.service';
import { ACL } from 'src/common/auth/decorators/acl.decorator';
import { Permissions } from 'src/core/services/permission.service';
import { UserSecure } from 'src/common/auth/user/decorators/userSecure.decorator';
import { ApiTags, ApiBody, ApiHeader, ApiParam, ApiExcludeEndpoint, ApiExcludeController } from '@nestjs/swagger';
import { ActivityInterceptor } from 'src/core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from 'src/core/interceptors/coreTransform.interceptor';
import { HasFile } from 'src/core/decorators/hasFile.decorator';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { DiseaseService } from '../services/disease.service';
import { TransformerDiseaseService } from '../services/transformerDisease.service';
import { BeDiseaseDto } from './dto/disease.dto';
import { isNotEmpty } from 'class-validator';

@ApiTags('Admin/Disease')
@Controller('admin/disease')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@ApiExcludeController()
export class BeDiseaseController {
    constructor(
        private diseaseService: DiseaseService,
        private response: ResponseService,
        private userAuthService: UserAuthService,
        private helperService: HelperService,
        private transformer: TransformerDiseaseService,
    ) {}

    @Get()
    @ACL(Permissions.disease_list)
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.diseaseService.findAll(query);
        if (query.get && query.export) return await this.transformer.transformDiseaseExport(items);
        return this.response.fetchListSuccess(await this.transformer.transformDiseaseList(items, {}, false, {}, true));
    }

    @ApiHeader({ name: 'Authorization', description: 'token' })
    @ApiParam({ name: 'id', type: String })
    @Get(':id')
    @ACL(Permissions.disease_detail)
    async detail(@Param('id') id) {
        let page = await this.diseaseService.detail(id);
        if (!page) return this.response.detailFail();
        return this.response.detailSuccess( await this.transformer.transformDiseaseDetail(page) );
    }

    @Post()
    @ApiBody({ type: BeDiseaseDto })
    @HasFile()
    @ACL(Permissions.disease_add)
    async create(@UploadedFiles() files: Record<any, any>, @Body() dto: BeDiseaseDto): Promise<any> {
        let objectVaccination = await this.diseaseService.create(dto, files);
        if (!objectVaccination) return this.response.createdFail();
        return this.response.createdSuccess(
            await this.transformer.transformDiseaseDetail(objectVaccination),
        );
    }

    @Put(':id')
    @ApiBody({ type: BeDiseaseDto })
    @HasFile()
    @ACL(Permissions.disease_edit)
    async update(@UploadedFiles() files: Record<any, any>, @Body('contentRmImgs') contentRmImgs: Array<string>,  @Param('id') id: string, @Body() dto: BeDiseaseDto): Promise<any> {
        let objectVaccination = await this.diseaseService.update(id, dto, files, contentRmImgs);
        if (!objectVaccination) return this.response.createdFail();
        return this.response.createdSuccess(
            await this.transformer.transformDiseaseDetail(objectVaccination),
        );
    }

    @Delete()
    @ACL(Permissions.disease_delete)
    @ApiExcludeEndpoint()
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        if(!isNotEmpty(ids[0])) return this.response.deletedFail("Chọn một trường để xoá!!");
        let items = await this.diseaseService.deletes(ids);
        if (!items) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }

}

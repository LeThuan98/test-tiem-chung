import {
    Body, Controller,
    Get, Post, Put,
    Request, UseInterceptors,
    UploadedFiles, Param,
    Query, HttpStatus,
    Delete,
} from '@nestjs/common';
import { ResponseService } from 'src/core/services/response.service';
import { UserAuthService } from 'src/common/auth/user/services/auth.service';
import { HelperService } from 'src/core/services/helper.service';
import { ACL } from 'src/common/auth/decorators/acl.decorator';
import { Permissions } from 'src/core/services/permission.service';
import { UserSecure } from 'src/common/auth/user/decorators/userSecure.decorator';
import { ApiTags, ApiBody, ApiHeader, ApiParam, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ActivityInterceptor } from 'src/core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from 'src/core/interceptors/coreTransform.interceptor';
import { HasFile } from 'src/core/decorators/hasFile.decorator';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ObjectVaccinationService } from '../services/objectVaccination.service';
import { TransformerObjectVaccinationService } from '../services/transformerObjectVaccination.service';
import { BeObjectVaccinationDto } from '../dto/objectVaccination.dto';

@ApiTags('frontend/objectVaccination')
@Controller('objectVaccination')
export class FeObjectVaccinationController {
    constructor(
        private objectService: ObjectVaccinationService,
        private response: ResponseService,
        private userAuthService: UserAuthService,
        private helperService: HelperService,
        private transformer: TransformerObjectVaccinationService,
    ) {}

    @Get()
    @DefaultListQuery()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.objectService.findAllFe(query);
        let pagination = items[0].paginator[0];

        pagination = {
            "total": pagination.total,
            "limit": pagination.limit,
            "pageCount": pagination.limit,
            "currentPage": pagination.page,
            "hasPrevPage": pagination.page > 1 ? true : false,
            "hasNextPage": pagination.total / (pagination.limit * pagination.page) > 1 ? true : false,
            "prev": null,
            "next": pagination.page + 1
        }

        let data = {
            docs: items[0].data,
            paginator: pagination
        }
        if (query.get && query.export) return await this.transformer.transformPageExport(data);
        return this.response.fetchListSuccess(await this.transformer.transformPageList(data));
    }
}

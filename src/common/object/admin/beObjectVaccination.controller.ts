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
import { ApiTags, ApiBody, ApiHeader, ApiParam, ApiExcludeEndpoint, ApiExcludeController } from '@nestjs/swagger';
import { ActivityInterceptor } from 'src/core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from 'src/core/interceptors/coreTransform.interceptor';
import { HasFile } from 'src/core/decorators/hasFile.decorator';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ObjectVaccinationService } from '../services/objectVaccination.service';
import { TransformerObjectVaccinationService } from '../services/transformerObjectVaccination.service';
import { BeObjectVaccinationDto } from '../dto/objectVaccination.dto';

@ApiTags('Admin/objectVaccination')
@Controller('admin/objectVaccination')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@ApiExcludeController()
export class BeObjectVaccinationController {
    constructor(
        private objectService: ObjectVaccinationService,
        private response: ResponseService,
        private userAuthService: UserAuthService,
        private helperService: HelperService,
        private transformer: TransformerObjectVaccinationService,
    ) {}

    @Get()
    @ACL(Permissions.object_list)
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        // query['admin'] = true;
        let items = await this.objectService.findAll(query);
        if (query.get && query.export) return await this.transformer.transformPageExport(items);
        if (query.get ) return this.response.fetchListSuccess(await this.transformer.transformPageList(items));
        // let pagination = items[0].paginator[0];

        // pagination = {
        //     "total": pagination.total,
        //     "limit": pagination.limit,
        //     "pageCount": pagination.limit,
        //     "currentPage": pagination.page,
        //     "hasPrevPage": pagination.page > 1 ? true : false,
        //     "hasNextPage": pagination.total / (pagination.limit * pagination.page) > 1 ? true : false,
        //     "prev": null,
        //     "next": pagination.page + 1
        // }

        // let data = {
        //     docs: items[0].data,
        //     paginator: pagination
        // }
        // // if (query.get && query.export) return await this.transformer.transformPageExport(data);
        // return this.response.fetchListSuccess(await this.transformer.transformPageList(data));
        
        return this.response.fetchListSuccess(await this.transformer.transformPageList(items));
    }

    @ApiHeader({ name: 'Authorization', description: 'token' })
    @ApiParam({ name: 'id', type: String })
    @Get(':id')
    @ACL(Permissions.object_edit)
    async detail(@Param('id') id) {
        let page = await this.objectService.detail(id);
        if (!page) return this.response.detailFail();
        return this.response.detailSuccess( await this.transformer.transformPageDetail(page) );
    }

    @Post()
    @ApiBody({ type: BeObjectVaccinationDto })
    @HasFile()
    @ACL(Permissions.object_add)
    async create(@UploadedFiles() files: Record<any, any>, @Body() dto: BeObjectVaccinationDto): Promise<any> {
        let objectVaccination = await this.objectService.create(dto, files);
        if (!objectVaccination) return this.response.createdFail();
        return this.response.createdSuccess(
            await this.transformer.transformPageDetail(objectVaccination),
        );
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: String })
    @HasFile()
    @ACL(Permissions.object_edit)
    async update(@Param('id') id, @UploadedFiles() files: Record<any, any>, @Body() dto: BeObjectVaccinationDto): Promise<any> {
        let page = await this.objectService.update(id, dto, files);
        if (!page) return this.response.updatedFail();
        return this.response.updatedSuccess( await this.transformer.transformPageDetail(page) );
    }

    @Delete()
    @ApiParam({ name: 'id', type: String })
    @ACL(Permissions.object_delete)
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        let item = await this.objectService.deletes(ids);
        if (!item) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

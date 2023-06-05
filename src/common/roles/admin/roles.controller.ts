import { ACL } from '@common/auth/decorators/acl.decorator';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
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
    UseInterceptors
} from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { TransformerRoleService } from '../services/transformerRole.service';
import { BeRoleDto } from './dto/beRole.dto';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';

@ApiTags('Admin/Role')
@Controller('admin/roles')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
@ApiExcludeController()
export class RolesController {
    constructor(
        private roleService: RolesService,
        private transformer: TransformerRoleService,
        private response: ResponseService,
    ) {}

    @Get()
    @DefaultListQuery()
    @ACL(Permissions.role_list)
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.roleService.findAll(query);
        if (query.get && query.export) return this.transformer.transformRoleExport(items);
        return this.response.fetchListSuccess(this.transformer.transformRoleList(items));
    }

    @Get(':id')
    @ACL(Permissions.role_detail)
    async findById(@Param('id') id: string): Promise<any> {
        let item = await this.roleService.findById(id);
        if (!item) return this.response.detailFail();
        return this.response.detailSuccess(this.transformer.transformRoleDetail(item));
    }

    @Post()
    @ACL(Permissions.role_add)
    async add(@Body() dto: BeRoleDto): Promise<any> {
        let item = await this.roleService.create(dto);
        if (!item) return this.response.createdFail();
        return this.response.createdSuccess(this.transformer.transformRoleDetail(item));
    }

    @Put(':id')
    @ACL(Permissions.role_edit)
    async edit(@Param('id') id: string, @Body() dto: BeRoleDto): Promise<any> {
        let item = await this.roleService.update(id, dto);
        if (!item) return this.response.updatedFail();
        return this.response.updatedSuccess(this.transformer.transformRoleDetail(item));
    }

    @Delete()
    @ACL(Permissions.role_delete)
    async delete(@Body('ids') ids: Array<string>): Promise<any> {
        let items = await this.roleService.deletes(ids);
        if (!items) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

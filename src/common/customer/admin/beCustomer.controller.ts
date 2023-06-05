import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Request,
    UseInterceptors,
    UploadedFiles,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { TransformerCustomerService } from '@common/customer/services/transformerCustomer.service';
import { ResponseService } from '@core/services/response.service';
import { BeCustomerDto } from '../dto/beCustomer.dto';
import { CustomerService } from '../services/customer.service';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { ApiBody, ApiTags, ApiHeader, ApiExcludeController } from '@nestjs/swagger';
import { Permissions } from '@core/services/permission.service';
const moment = require('moment');
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { HasFile } from '@src/core/decorators/hasFile.decorator';

@ApiTags('Admin/Customer')
@Controller('admin/customers')
@UserSecure()
@ApiExcludeController()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeCustomerController {
    constructor(
        private customerService: CustomerService,
        private transformer: TransformerCustomerService,
        private response: ResponseService,
    ) {}

    @Get()
    @DefaultListQuery()
    @ACL(Permissions.customer_list)
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.customerService.findAll(query);
        if (query.get && query.export) return await this.transformer.transformCustomerExport(items);
        return this.response.fetchListSuccess(await this.transformer.transformCustomerList(items));
    }

    @Get(':id')
    @ACL(Permissions.customer_detail)
    async getById(@Param('id') id: string): Promise<any> {
        let customer = await this.customerService.detail(id);
        if (!customer) return this.response.detailFail();
        return this.response.detailSuccess(await this.transformer.transformCustomerDetail(customer));
    }

    @Post()
    @HasFile()
    @ACL(Permissions.customer_edit)
    async create(@UploadedFiles() files: Record<any, any>, @Body() dto: BeCustomerDto): Promise<any> {
        let item = await this.customerService.create(dto, files);
        if(!item.status) return this.response.createdFail(item.message);
        return this.response.createdSuccess(this.transformer.transformCustomerDetail(item.data));
    }

    @Put(':id')
    @HasFile()
    @ACL(Permissions.customer_edit)
    async update(
        @Param('id') id: string,
        @Body() dto: BeCustomerDto,
        @UploadedFiles() files: Record<any, any>,
    ): Promise<any> {
        let item = await this.customerService.update(id, dto, files);
        if (!item.status) return this.response.updatedFail(item.message);
        return this.response.updatedSuccess(await this.transformer.transformCustomerDetail(item.data));
    }

    @ApiBody({ type: Array })  
    @Delete()
    @ACL(Permissions.customer_delete)
    async deletes(@Body('ids') ids: Array<string>): Promise<any> {
        let item = await this.customerService.deletes(ids);
        if (!item) return this.response.deletedFail();
        return this.response.deletedSuccess();
    }
}

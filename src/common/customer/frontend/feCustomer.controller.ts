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
import { HelperService } from '@core/services/helper.service';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from '@common/customer/services/customer.service';
// import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { ResponseService } from '@core/services/response.service';
import { TransformerCustomerService } from '../services/transformerCustomer.service';
import { ApiBody, ApiHeader } from '@nestjs/swagger';
import { BeCustomerDto } from '../dto/beCustomer.dto';
@ApiTags('Customer')
@Controller('customer')

// @UseInterceptors(CoreTransformInterceptor)
export class FeCustomerController {
    constructor(
        private customerService: CustomerService,
        private helperService: HelperService,
        private response: ResponseService,
        private transformer: TransformerCustomerService,
    ) {}


    @Get()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.customerService.findAll(query);
        if(query.get && query.export) return this.transformer.transformCustomerExport(items);
        return this.response.fetchListSuccess(this.transformer.transformCustomerList(items));
    }
    // @Post()
    // @ApiBody({type: BeCustomerDto})
    // async create(
    //     @Body() dto: BeCustomerDto,
    // ): Promise<any> {
    //     if(dto.agency.length<8){
    //         return this.response.createdFail('Mã đại lý ít nhất 8 ký tự');
    //     }
    //     let item = await this.customerService.create(dto);
    //     if (!item) return this.response.createdFail();
    //     return this.response.createdSuccess(await this.transformer.transformCustomerDetail(item));
    // }
}

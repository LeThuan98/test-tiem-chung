import {
    Controller,
    Get,
    Query,
    Post,
    Body
} from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { ApiTags, ApiQuery, ApiBody} from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { FeAskDto } from '../dto/feAsk.dto';
import { AskService } from '../services/ask.service';
import { TransformerAskService } from '../services/transformerAsk.service';
const imageToBase64 = require('image-to-base64');
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { CustomerAuth } from '@src/common/auth/customer/decorators/customer.decorator';
import { Customer } from '@src/schemas/customer/customer.schemas';

@ApiTags('Ask')
@Controller('asks')
export class FeAskController {
    constructor(
        private askService: AskService,
        private response: ResponseService,
        private transformer: TransformerAskService,
    ) {}

    // @Get()
    // @DefaultListQuery()
    // async findAll(@Query() query: Record<string, any>): Promise<any> {
    //     let items = await this.askService.findAll(query);
    //     if (query.get && query.export) return await this.transformer.transformAskExport(items);
    //     return this.response.fetchListSuccess(await this.transformer.transformAskList(items));
    // }

    @Post()
    @ApiBody({ type: FeAskDto })  
    // async create( @Body() dto: FeAskDto, @CustomerAuth() customer: Customer): Promise<any> {
    async create( @Body() dto: FeAskDto): Promise<any> {
        try {
            let ask = await this.askService.create({
                ...dto,
                // customer: customer.id
            });
            if (!ask) return this.response.createdFail();
            return this.response.createdSuccess(
                await this.transformer.transformAskDetail(ask),
            );            
        } catch (error) {
            return this.response.createdFail(error.message);
        }
    }

}

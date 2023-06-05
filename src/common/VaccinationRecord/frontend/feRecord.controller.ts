import {
    Controller,
    Get,
    Query,
    Post,
    Body,
    Param,
    Put,
} from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { ApiTags, ApiQuery, ApiBody, ApiParam, ApiBearerAuth} from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BeRecordDto } from '../dto/beRecord.dto';
import { VaccinationRecordService } from '../services/record.service';
import { TransformerRecordService } from '../services/transformerRecord.service';
const imageToBase64 = require('image-to-base64');
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { FeRecordDto } from '../dto/feRecord.dto';
import { CustomerAuth } from '@src/common/auth/customer/decorators/customer.decorator';
import { Customer } from '@src/schemas/customer/customer.schemas';
import { FeStatusDto } from '../dto/feStatus.dto';
import { FeNoteDto } from '../dto/feNote.dto';
import { FeRecordUpdateDto } from '../dto/feRecordUpdate.dto';

@ApiTags('Vaccination Record')
@Controller('vaccination-record')
export class FeRecordController {
    constructor(
        private recordService: VaccinationRecordService,
        private response: ResponseService,
        private transformer: TransformerRecordService,
    ) {}

    @Get()
    @ApiBearerAuth()
    @DefaultListQuery()
    async findAll(@Query() query: Record<string, any>): Promise<any> {
        let items = await this.recordService.findAll(query);
        if (query.get && query.export) return await this.transformer.transformRecordExport(items);
        return this.response.fetchListSuccess(await this.transformer.transformRecordList(items));
    }

    @Post()
    @ApiBearerAuth()
    @ApiBody({ type: FeRecordDto })  
    async create( @Body() dto: FeRecordDto, @CustomerAuth() customer: Customer): Promise<any> {
        try {
            let record = await this.recordService.create({
                ...dto,
                customer: customer.id
            });
            if (!record) return this.response.createdFail();
            return this.response.createdSuccess(
                await this.transformer.transformRecordDetail(record),
            );            
        } catch (error) {
            return this.response.createdFail(error.message);
        }
    }

    @Put(':id/status')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    async updateVaxStatus(@Param('id') id, @Body() dto: FeStatusDto, @CustomerAuth() customer: Customer): Promise<any> {
        try {
            let record = await this.recordService.updateVaxStatus(id, {
                ...dto,
                customer: customer.id
            });
            if (!record) return this.response.updatedFail();
            return this.response.updatedSuccess(
                await this.transformer.transformRecordDetail(record),
            );
        } catch (error) {
            return this.response.updatedFail(error.message);
        }
    }

    @Put(':id/note')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    async updateVaxNote(@Param('id') id, @Body() dto: FeNoteDto, @CustomerAuth() customer: Customer): Promise<any> {
        try {
            let record = await this.recordService.updateVaxNote(id, {
                ...dto,
                customer: customer.id
            });
            if (!record) return this.response.updatedFail();
            return this.response.updatedSuccess(
                await this.transformer.transformRecordDetail(record),
            );
        } catch (error) {
            return this.response.updatedFail(error.message);
        }
    }

    @Put(':id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    async update(@Param('id') id, @Body() dto: FeRecordUpdateDto, @CustomerAuth() customer: Customer): Promise<any> {
        try {
            let record = await this.recordService.update(id, {
                ...dto,
                customer: customer.id
            });
            if (!record) return this.response.updatedFail();
            return this.response.updatedSuccess(
                await this.transformer.transformRecordDetail(record),
            );
        } catch (error) {
            return this.response.updatedFail(error.message);
        }
    }

}

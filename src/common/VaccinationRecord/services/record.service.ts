import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { HelperService } from '@core/services/helper.service';
import { VaccinationRecord } from '@schemas/vaccination/vaccinationRecord.schema';
// import { convertContentFileDto, saveThumbOrPhotos } from '@core/helpers/content';
import { Customer } from '@src/schemas/customer/customer.schemas';
import { VaxSchedule } from '@src/schemas/vaxSchedule/vaxSchedule.schemas';
const moment = require('moment');
const _ = require('lodash');
@Injectable()
export class VaccinationRecordService {
    constructor(
        @InjectModel(VaccinationRecord.name) private record: PaginateModel<VaccinationRecord>,
        @InjectModel(VaxSchedule.name) private vaxSchedule: PaginateModel<VaxSchedule>,
        @InjectModel(Customer.name) private customer: PaginateModel<Customer>,
        private helperService: HelperService,
    ) {}

    async detail(id: string): Promise<any> {
        return this.record.findOne({ _id: id, deleteAt: null }).populate('customer');
    }

    async findAll(query: Record<string, any>): Promise<any> {
        let conditions = {};
        conditions['deletedAt'] = null;
        let sort = Object();
        sort[query.orderBy] = query.order;

        let projection = {};

        if (isNotEmpty(query.selects)) {
            query.selects.split(',').forEach((select) => {
                projection[select] = 1;
            });
        }


        if (isNotEmpty(query.idNotIn)) {
            conditions['_id'] = {
                $nin: query.idNotIn,
            };
        }

        if (isNotEmpty(query.idIn)) {
            conditions['_id'] = {
                $in: query.idIn,
            };
        }
        

        if (isNotEmpty(query.customer)) {
            conditions['customer'] = {
                $in: query.customer.split(","),
            };
        }
        if (isNotEmpty(query.name)) {
            let nameNon = this.helperService.removeSignVietnamese(query['name']);
            conditions['nameNon'] = {
                $regex: new RegExp(nameNon, 'img'),
            };
        }

        if (isNotEmpty(query.createdFrom) || isNotEmpty(query.createdTo)) {
            let createdFrom = moment(query.createdFrom || '1000-01-01').startOf('day');
            let createdTo = moment(query.createdTo || '3000-01-01').endOf('day');
            conditions[`createdAt`] = {
                $gte: createdFrom,
                $lte: createdTo,
            };
        }

        if (isNotEmpty(query.get)) {
            let get = parseInt(query.get);
            let result = this.record.find(conditions).sort(sort).select(projection).populate('customer');
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.record.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
                populate: 'customer',
            });
        }
    }


    async create(data: object): Promise<any> {
        data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);

        if(data['objectVaccinationId']){
            const schedule = await this.vaxSchedule.findOne({ objectVaccinationId: data['objectVaccinationId'], active: true });
            
            if(schedule){
                const newArray = []; 
                for (let row of schedule.table1) {
                    row = _.omit(row,'_id');
                    row = _.omit(row,'id');

                    let newrow = {
                        ...row
                    };
                    console.log(newrow);
                    delete newrow._id;
                    delete newrow.id;
                    console.log(newrow);

                    newArray.push(newrow);
                }
                data['table1'] = newArray;
            }
        }

        let item = await new this.record(data).save();
        return item;
    }

    async update(id: string, data: object): Promise<VaccinationRecord> {
        data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);
        let item = await this.record.findByIdAndUpdate(id, data, { returnOriginal: false });
        return item;
    }

    async updateVaxStatus(id: string, data: object): Promise<VaccinationRecord> {
        
        let item = await this.record.findById(id);
        if(item){
            console.log(data['vaxId']);
            
            const newData = item.table1;
            const index = newData.findIndex((item) => data['vaxId'] === item.id);
            // const oldrow = newData[index];
            const newrow = newData[index];

            newrow[`${data['vaxKey']}Checked`] = !newrow[`${data['vaxKey']}Checked`];

            // newData.splice(index, 1, { ...oldrow, ...newrow });
            newData[index] = newrow;

            item = await this.record.findByIdAndUpdate(id, {table1: newData}, { returnOriginal: false });
        }

        return item;
    }

    async updateVaxNote(id: string, data: object): Promise<VaccinationRecord> {
        
        let item = await this.record.findById(id);
        if(item){
            const newData = item.table1;
            const index = newData.findIndex((item) => data['vaxId'] === item.id);
            // const oldrow = newData[index];
            const newrow = newData[index];

            newrow[`${data['vaxKey']}Note`] = data['vaxNote'];

            // newData.splice(index, 1, { ...oldrow, ...newrow });
            newData[index] = newrow

            item = await this.record.findByIdAndUpdate(id, {table1: newData}, { returnOriginal: false });
        }

        return item;
    }

    async deletes(ids: Array<string>): Promise<any> {
        return this.record.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
    }
}

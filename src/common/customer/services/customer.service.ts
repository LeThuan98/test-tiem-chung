import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import  from 'mongoose';
import { isIn, isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { HelperService } from '@core/services/helper.service';
import { Customer } from '@schemas/customer/customer.schemas';
import { convertContentFileDto, saveThumbOrPhotos } from '@core/helpers/content';
const moment = require('moment');
@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name) private customer: PaginateModel<Customer>,
        private helperService: HelperService,
    ) {}

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

        if (isNotEmpty(query.name)) {
            let nameNon = this.helperService.removeSignVietnamese(query['name']);
            conditions['nameNon'] = {
                $regex: new RegExp(nameNon, 'img'),
            };
        }

        if (isNotEmpty(query.consultants)) {
            let consultantsNon = this.helperService.removeSignVietnamese(query['consultants']);
            conditions['consultantsNon'] = {
                $regex: new RegExp(consultantsNon, 'img'),
            };
        }

        if (isNotEmpty(query.agency)) {
            conditions['agency'] = {
                $regex: new RegExp(query.agency, 'img'),
            };
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
            let result = this.customer.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.customer.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }

    async findOne(query: Record<string, any>): Promise<Customer> {
        return this.customer.findOne(query);
    }

    // async createSocial(data: Object): Promise<Customer> {
    //     data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);
    //     let item = await new this.customer(data).save();
    //     return item;
    // }
    async create(data: Object, files: Record<any, any>): Promise<any> {
        if(data['name'])
        data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);
        data['password'] = await this.helperService.hash(data['password']);
        if(!data['username']) return false;

        let customer = await this.customer.find({username: data['username'], deletedAt: null});
        if(customer.length>0){
            return {
                status: false,
                data: null,
                message: 'Username đã tồn tại!'
            }
        }
        await convertContentFileDto(data, files, ['profileImage']);
        let item = await new this.customer(data).save();
        if (item) await saveThumbOrPhotos(item);
        return {
            status: true,
            data: item,
            message: ''
        }
    }

    async update(id: string, data: Object, files: Record<any, any>): Promise<any> {
        data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);
        if (typeof data['password'] != 'undefined')
            data['password'] = await this.helperService.hash(data['password']);
        let customer = await this.customer.find({username: data['username'], deletedAt: null});
        if(customer.length>0){
            return {
                status: false,
                data: null,
                message: 'Username đã tồn tại!'
            }
        }
        await convertContentFileDto(data, files, ['profileImage']);
        let item = await this.customer.findByIdAndUpdate(id, data, { new: true }).populate('role');
        if (item) await saveThumbOrPhotos(item);
        return {
            status: true,
            data: item,
            message: ''
        }
    }

    async detail(id: string): Promise<Customer> {
        return this.customer.findById(id);
    }

    async deletes(ids: Array<string>): Promise<any> {
        return this.customer.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
    }
}

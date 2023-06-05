import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { HelperService } from '@core/services/helper.service';
import { Ask } from '@schemas/ask/ask.schema';
import { Customer } from "@schemas/customer/customer.schemas";
import { CommonProducerService } from '@src/common/queues/services/common.producer.service';
const moment = require('moment');

@Injectable()
export class AskService {
    constructor(
        @InjectModel(Ask.name) private ask: PaginateModel<Ask>,
        @InjectModel(Customer.name) private customer: PaginateModel<Customer>,
        private helperService: HelperService,
        private commonProducerService: CommonProducerService,
    ) {}

    async detail(id: string): Promise<any> {
        return this.ask.findOne({ _id: id, deleteAt: null }).populate('customer');
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
        
        if (isNotEmpty(query.customerName)) {
            let nameNon = this.helperService.removeSignVietnamese(query['customerName']);
            let customer = await this.customer.find({ nameNon: new RegExp(nameNon, 'img') }).select(['_id'])
            let customerIds = customer.map((item) => { return item._id})

            conditions['customer'] = {
                $in: customerIds
            };
        }
        
        if (isNotEmpty(query.customerEmail)) {
            let customer = await this.customer.find({ email: new RegExp(query['customerEmail'], 'img') }).select(['_id'])
            let customerIds = customer.map((item) => { return item._id})

            conditions['customer'] = {
                $in: customerIds
            };
        }
        if (isNotEmpty(query.question)) {
            let questionNon = this.helperService.removeSignVietnamese(query['question']);
            conditions['questionNon'] = {
                $regex: new RegExp(questionNon, 'img'),
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
            let result = this.ask.find(conditions).sort(sort).select(projection).populate('customer');
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.ask.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
                populate: 'customer',
            });
        }
    }


    async create(data: object): Promise<any> {
        data['questionNon'] = this.helperService.nonAccentVietnamese(data['question']);
        let item = await new this.ask(data).save();
        return item;
    }

    // async update(id: string, data: object): Promise<Ask> {
    //     data['questionNon'] = this.helperService.nonAccentVietnamese(data['question']);
    //     let item = await this.ask.findByIdAndUpdate(id, data, { returnOriginal: false });
    //     return item;
    // }
    async sendAnswer(id: string, data: object): Promise<any> {
        let ask = await this.ask.findOne({_id:id}).populate('customer');
        if(!ask) return this.helperService.throwException('Câu hỏi không tồn tại!',HttpStatus.BAD_REQUEST);
        if(ask.customer['email']){
            ask.content = data['content'];
            ask.save();
            this.commonProducerService.sendAnswer({
                ...data,
                email: ask.customer['email'],
            });
            return ask; 
        }else return this.helperService.throwException('Người dùng chưa cập nhật email',HttpStatus.BAD_REQUEST);
    }


    async deletes(ids: Array<string>): Promise<any> {
        return this.ask.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
    }
}

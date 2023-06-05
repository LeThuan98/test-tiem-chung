import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import  from 'mongoose';
import { isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { HelperService } from 'src/core/services/helper.service';
import { UserService } from 'src/common/users/services/user.service';
import { convertContentFileDto, saveThumbOrPhotos } from 'src/core/helpers/content';
import { Faq } from '@src/schemas/faqs/faq.schema';
const moment = require('moment');
@Injectable()
export class FaqService {
    constructor(
        @InjectModel(Faq.name) private faqs: PaginateModel<Faq>,
        private helperService: HelperService,
        private userService: UserService,
    ) {}

    async detail(id: string): Promise<any> {
        return this.faqs.findOne({ _id: id, deleteAt: null });
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

        if (isNotEmpty(query.title)) {
            let titleNon = this.helperService.nonAccentVietnamese(query['title']);
            conditions['titleNon'] = {
                $regex: new RegExp(titleNon, 'img'),
            };
        }
        if (isNotEmpty(query.content)) {
            let contentNon = this.helperService.nonAccentVietnamese(query['content']);
            conditions['contentNon'] = {
                $regex: new RegExp(contentNon, 'img'),
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
            let result = this.faqs.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.faqs.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }

    async create(data: object): Promise<any> {
        data['titleNon'] = this.helperService.nonAccentVietnamese(data['title']);
        data['contentNon'] = this.helperService.nonAccentVietnamese(data['content']);
        let item = await new this.faqs(data).save();
        return item;
    }

    async update(id: string, data: object): Promise<Faq> {
        data['titleNon'] = this.helperService.nonAccentVietnamese(data['title']);
        data['contentNon'] = this.helperService.nonAccentVietnamese(data['content']);
        let item = await this.faqs.findByIdAndUpdate(id, data, { returnOriginal: false });
        return item;
    }
    async deletes(ids: Array<string>): Promise<any> {
        return this.faqs.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
    }
}

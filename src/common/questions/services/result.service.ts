import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { isIn, isNotEmpty } from 'class-validator';
import { convertContentFileDto, saveThumbOrPhotos } from '@core/helpers/content';
import { HelperService } from '@core/services/helper.service';
import { Result } from '@src/schemas/questions/result.schema';
const moment = require('moment');
@Injectable()
export class ResultService {
    constructor(
        @InjectModel(Result.name) private result: PaginateModel<Result>,
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

        if (isNotEmpty(query.content)) {
            let contentNon = this.helperService.nonAccentVietnamese(query.content);
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
            let result = this.result.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.result.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }

    async create(data: Object): Promise<Result> {
        data['contentNon'] = this.helperService.nonAccentVietnamese(data['content']);
        let item = await new this.result(data).save();
        return item;
    }

    async update(id: string, data: Object): Promise<Result> {
        data['contentNon'] = this.helperService.nonAccentVietnamese(data['content']);
        let item = await this.result.findByIdAndUpdate(id, data, { returnOriginal: false });
        return item;
    }

    async detail(id: string): Promise<Result> {
        return this.result.findById(id);
    }

    async deletes(ids: Array<string>): Promise<any> {
        return this.result.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
    }
}

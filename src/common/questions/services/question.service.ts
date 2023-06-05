import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { isIn, isNotEmpty } from 'class-validator';
import { Question } from '@schemas/questions/question.schema';
import { convertContentFileDto, saveThumbOrPhotos } from '@core/helpers/content';
import { HelperService } from '@core/services/helper.service';
import { Result } from '@src/schemas/questions/result.schema';
import { ResultEnum } from '@src/core/constants/result.enum';
const moment = require('moment');
@Injectable()
export class QuestionService {
    constructor(
        @InjectModel(Question.name) private question: PaginateModel<Question>,
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
            let result = this.question.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.question.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }

    async create(data: Object): Promise<Question> {
        data['contentNon'] = this.helperService.nonAccentVietnamese(data['content']);
        let item = await new this.question(data).save();
        return item;
    }

    async update(id: string, data: Object): Promise<Question> {
        data['contentNon'] = this.helperService.nonAccentVietnamese(data['content']);
        let item = await this.question.findByIdAndUpdate(id, data, { returnOriginal: false });
        return item;
    }

    async detail(id: string): Promise<Question> {
        return this.question.findById(id);
    }

    async deletes(ids: Array<string>): Promise<any> {
        return this.question.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
    }

    async checkResult(data: any): Promise<any> {
        let mostAnswered = ResultEnum.A;

        let answer = data.answer;
        
        // data = JSON.parse(data.answer.toString());

        if(answer['B'] > answer['A']) mostAnswered = ResultEnum.B;
        if(answer['C'] > answer['B'] && answer['C'] > answer['A'] ) mostAnswered = ResultEnum.C;
        if(answer['D'] > answer['C'] && answer['D'] > answer['B'] && answer['D'] > answer['A']) mostAnswered = ResultEnum.D;
        
        const item = await this.result.findOne({mostAnswered: mostAnswered, deletedAt: null}).exec();
        return item;
    }
}

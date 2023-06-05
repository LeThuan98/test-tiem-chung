import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty, isIn } from 'class-validator';
import { VaxSchedule } from '@src/schemas/vaxSchedule/vaxSchedule.schemas';
import { convertContent, convertContentFileDto, deleteSpecifyFile, saveFileContent, saveThumbOrPhotos } from '@core/helpers/content';
import { HelperService } from '@core/services/helper.service';

const moment = require('moment');

@Injectable()
export class VaxScheduleService {
    private locale;
    private user;

    constructor(
        @InjectModel(VaxSchedule.name) private vaxSchedule: PaginateModel<VaxSchedule>,
        @Inject(REQUEST) private request: any,
        private helper: HelperService
    ) {
        this.locale = this.request.locale == 'vi' ? 'viNon' : this.request.locale;
        this.user = this.request.user;
    }

    async totalVaxSchedule(): Promise<any> {
        return this.vaxSchedule.countDocuments();
    }

    async totalActiveVaxSchedule(): Promise<any> {
        return this.vaxSchedule.countDocuments({active: true});
    }

    async totalInActiveVaxSchedule(): Promise<any> {
        return this.vaxSchedule.countDocuments({active: false});
    }

    async findAll(query: Record<string, any>): Promise<any> {
        let locale = this.locale;
        let conditions = {};
        let sort = Object();
        query.orderBy = [
            'title', 'shortDescription'
        ].indexOf(query.orderBy) != -1 ? `${query.orderBy}.${this.locale}` : query.orderBy;
        sort[query.orderBy] = query.order;

        let projection = {};
    
        if (isNotEmpty(query.selects)) {
            query.selects.split(',').forEach(select => {
                projection[select] = 1;
            });
        }

        if (isNotEmpty(query.title)) {
            let temp_title = this.helper.nonAccentVietnamese(query.title)
            // conditions[`title.${locale}`] = {
            //     $regex: new RegExp(temp_title, "img"),
            // };
            conditions[`$or`] = [
                {
                    [`title.${locale}`]: { $regex: new RegExp(temp_title, 'img') }
                },
                {
                    [`titleEnNon`]: { $regex: new RegExp(temp_title, 'img') }
                },
            ]
        }

        if (isNotEmpty(query.shortDescription)) {
            conditions[`shortDescription.${locale}`] = {
                $regex: new RegExp(query.shortDescription, "img"),
            };
        }

        if (isNotEmpty(query.status)) {
            conditions['status'] = query.status;
        }
        
        if (isNotEmpty(query.target)) {
            conditions['objectVaccinationId'] = {
                $in: query.target
            };
        }

        if (isNotEmpty(query.idNotIn)) {
            conditions['_id'] = {
                $nin: query.idNotIn
            };
        }

        if (isNotEmpty(query.idIn)) {
            conditions['_id'] = {
                $in: query.idIn
            };
        }

        if (isNotEmpty(query.publishedFrom) || isNotEmpty(query.publishedTo)) {
            let publishedFrom = moment(query.publishedFrom || '1000-01-01').startOf('day');
            let publishedTo = moment(query.publishedTo || '3000-01-01').endOf('day');
            conditions[`publishedAt`] = {
                $gte: publishedFrom,
                $lte: publishedTo,
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

        if(isNotEmpty(query.get)) { 
            let get = parseInt(query.get);
            let result = this.vaxSchedule.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.vaxSchedule.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }

    async findAllFrontend(query: Record<string, any>): Promise<any> {
        let locale = this.locale;
        let conditions = {};
        conditions['active'] = true;
        // conditions['publishedAt'] = { $lte: moment().format('YYYY-MM-DD HH:mm:ss') };
        let sort = Object();
        query.orderBy = [
            'title', 'shortDescription'
        ].indexOf(query.orderBy) != -1 ? `${query.orderBy}.${this.locale}` : query.orderBy;
        sort[query.orderBy] = query.order;

        let projection = {};
    
        if (isNotEmpty(query.selects)) {
            query.selects.split(',').forEach(select => {
                projection[select] = 1;
            });
        }

        if (isNotEmpty(query.title)) {
            let temp_title = this.helper.nonAccentVietnamese(query.title)
            // conditions[`title.${locale}`] = {
            //     $regex: new RegExp(temp_title, "img"),
            // };
            conditions[`$or`] = [
                {
                    [`title.${locale}`]: { $regex: new RegExp(temp_title, 'img') }
                },
                {
                    [`titleEnNon`]: { $regex: new RegExp(temp_title, 'img') }
                },
            ]
        }

        if (isNotEmpty(query.target)) {
            conditions['objectVaccinationId'] = {
                $in: query.target
            };
        }

        if (isNotEmpty(query.idNotIn)) {
            conditions['_id'] = {
                $nin: query.idNotIn
            };
        }

        if (isNotEmpty(query.idIn)) {
            conditions['_id'] = {
                $in: query.idIn
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

        if(isNotEmpty(query.get)) { 
            let get = parseInt(query.get);
            let result = this.vaxSchedule.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.vaxSchedule.paginate(conditions, {
                populate: query.populate || '',
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }

    async findByTargetId(id: string): Promise<VaxSchedule> {
        
        let conditions = {};
        conditions[`objectVaccinationId`] =  id;
        conditions[`active`] =  true;
        
        return await this.vaxSchedule.findOne(conditions);
    }

    async findById(id: string): Promise<VaxSchedule | Boolean> {
        let item = await this.vaxSchedule.findById(id);
        return item;
    }

    async findBySlug(slug: string): Promise<VaxSchedule> {
        let locale = this.request.locale;
        let conditions = {};
        conditions[`slug.${locale}`] =  slug;
        conditions[`active`] =  true;
        conditions['publishedAt'] = { $lte: moment().format('YYYY-MM-DD HH:mm:ss') };
        return await this.vaxSchedule.findOne(conditions);
    }

    async create(data: Object, files: Record<any, any>, contentRmImgs: Array<string>): Promise<VaxSchedule> {
        let self = this;
        //
        await convertContent('content', data, files, 
            ['metaImage'], 
            {
                'metaImage': 'exts:jpg|jpeg|png|gif;size:5',
            });

        
        data['publishedAt'] = data['publishedAt'] || moment().format('YYYY-MM-DD HH:mm:ss');
        let item = await new this.vaxSchedule(data).save();
        if(item) await saveThumbOrPhotos(item);
        
        return item;
    }

    async update(id: string, data: Object, files: Record<any, any>, contentRmImgs: Array<string>): Promise<any> {
        let self = this;
        //
        let item = await this.findById(id);
        if(!item) return false;
        //
        await convertContent('content', data, files, 
            ['metaImage',], 
            {
                'metaImage': 'exts:jpg|jpeg|png|gif;size:5',
            });

        item = await this.vaxSchedule.findByIdAndUpdate(id, data, {new: true});
        if(item) await saveThumbOrPhotos(item);
        
        return item;

    }

    async deleteManyById(ids: Array<string>): Promise<any> {
        
        let now     = Date.now();
        let date    = new Date;

        let updateData;

        let set                 = {};
        
        set['deletedAt']        = date;
        set['active']           = true;
        updateData = [{
            $set: set
        }];

        
        for (let id of ids) {
            let result = await this.vaxSchedule.findOneAndUpdate(
                { _id: id, deletedAt: null },
                updateData,
                {new: true}
            );
        }

        return true;
    }
}

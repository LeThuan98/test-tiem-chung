import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty, isIn } from 'class-validator';
import { PostCategory } from "@schemas/posts/postCategory.schemas";
import { convertContent, saveThumbOrPhotos, saveFileContent, deleteSpecifyFile, deleteFileContent, convertContentFileDto } from '@core/helpers/content';
const moment = require('moment');
@Injectable()
export class PostCategoryService {
    constructor(
        @InjectModel(PostCategory.name) private category: PaginateModel<PostCategory>,
        @Inject(REQUEST) private request: any
    ) {
    }

    async totalPostCategory(): Promise<any> {
        return this.category.countDocuments();
    }

    async findAll(query: Record<string, any>): Promise<any> {
        // let locale = this.locale;
        let conditions = {};
        conditions['deletedAt'] = null;

        let sort = Object();
        sort[query.orderBy] = query.order;

        let projection = {};
    
        if (isNotEmpty(query.selects)) {
            query.selects.split(',').forEach(select => {
                projection[select] = 1;
            });
        }

        if (isNotEmpty(query.name)) {
            conditions[`name`] = {
                $regex: new RegExp(query.name, "img"),
            };
        }

        if (isNotEmpty(query.title)) {
            conditions[`title`] = {
                $regex: new RegExp(query.title, "img"),
            };
        }

        if (isNotEmpty(query.shortDescription)) {
            conditions[`shortDescription`] = {
                $regex: new RegExp(query.shortDescription, "img"),
            };
        }

        if (isIn(query['active'], ['true', 'false', true, false])) {
            conditions['active'] = query['active'];
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
            let result = this.category.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.category.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }

    async findAllFrontend(query: Record<string, any>): Promise<any> {
        let conditions = {};
        conditions['active'] = true;
        conditions['deletedAt'] = null;

        let sort = Object();
        sort[query.orderBy] = query.order;

        let projection = {};
    
        if (isNotEmpty(query.selects)) {
            query.selects.split(',').forEach(select => {
                projection[select] = 1;
            });
        }

        if (isNotEmpty(query.name)) {
            conditions[`name`] = {
                $regex: new RegExp(query.name, "img"),
            };
        }

        if (isNotEmpty(query.title)) {
            conditions[`title`] = {
                $regex: new RegExp(query.title, "img"),
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
            let result = this.category.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.category.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }

    async findById(id: string): Promise<PostCategory> {
        return this.category.findById(id).exec();
    }

    async findBySlug(slug: string): Promise<PostCategory> {
        let conditions = {};
        conditions[`slug`] =  slug;
        conditions[`active`] =  true;
        conditions['deletedAt'] = null;

        return this.category.findOne(conditions).exec();
    }

    async create(data: Object, files: Record<any, any>): Promise<PostCategory> {
        await convertContentFileDto(data, files, ['metaImage']);
        let item = await new this.category(data).save();
        if(item) await saveThumbOrPhotos(item);
        return item;
    }

    async update(id: string, data: Object, files: Record<any, any>, contentRmImgs: Array<string>): Promise<PostCategory> {
        await convertContentFileDto(data, files, ['metaImage']);
        let item = await this.category.findByIdAndUpdate(id, data, {new: true});
        if(item) await saveThumbOrPhotos(item);
        return item;
    }

    async deletes(ids: Array<string>): Promise<any> {
        return this.category.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
    }
}

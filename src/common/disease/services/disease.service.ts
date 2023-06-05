import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { HelperService } from 'src/core/services/helper.service';
import { convertContent, convertContentFileDto, deleteSpecifyFile, saveFileContent, saveThumbOrPhotos } from 'src/core/helpers/content';
import { throwError } from 'rxjs';
import { Diseases } from '@src/schemas/disease/disease.schema';
import { ObjectVaccinations } from '@src/schemas/objectVaccination/objectVaccination.schemas';

const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;

@Injectable()
export class DiseaseService {
    constructor(
        @InjectModel(Diseases.name) private disease: PaginateModel<Diseases>,
        @InjectModel(ObjectVaccinations.name) private objectVaccination: PaginateModel<ObjectVaccinations>,
        private helperService: HelperService,
    ) {}

    async findAllFrontend(query: Record<string, any>): Promise<any> {
        let conditions = {};
        conditions['active'] = true;
        conditions['deletedAt'] = null;

        let sort = Object();

        query.orderBy = [
            'title', 'shortDescription'
        ].indexOf(query.orderBy) != -1 ? `${query.orderBy}` : query.orderBy;
        sort[query.orderBy] = query.order;

        let projection = {};
    
        if (isNotEmpty(query.selects)) {
            query.selects.split(',').forEach(select => {
                projection[select] = 1;
            });
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
            let result = this.disease.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.disease.paginate(conditions, {
                populate: query.populate || '',
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort
            });
        }
    }

    async findBySlugFrontend(slug: string): Promise<Diseases> {
        let post = await this.disease.findOne({slug: slug, deleteAt: null, active: true });
        if(post){
            const viewCount = post.viewCount++;
            await this.disease.findByIdAndUpdate(post.id, {viewCount: viewCount}, { returnOriginal: false });
        }

        return post;
        // return this.disease.findOne({slug: slug, deleteAt: null, active: true }).exec();
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

        if (isNotEmpty(query.name)) {
            conditions['name'] = {
                $regex: new RegExp(query.name, 'img'),
            };
        }

        if (isNotEmpty(query.metaTitle)) {
            conditions['metaTitle'] = {
                $regex: new RegExp(query.metaTitle, 'img'),
            };
        }

        if (isNotEmpty(query.metaKeyword)) {
            conditions['metaKeyword'] = {
                $regex: new RegExp(query.metaKeyword, 'img'),
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
            let result = this.disease.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.disease.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }

    async detail(id: string): Promise<any> {
        let item = await this.objectVaccination.findById(id);
        return item;
    }

    async create(data: object, files: Record<any, any>): Promise<any> {
        await convertContent('content', data, files, [ 'banner', 'metaImage', ], 
        {
            'banner': 'exts:jpg|jpeg|png|gif;size:5',
            'metaImage': 'exts:jpg|jpeg|png|gif;size:5',
        });

        console.log(data);
        console.log(files);
        
        
        let item = await new this.disease(data).save();
        if (item) await saveThumbOrPhotos(item);

        if(item) await saveFileContent('content', item, 'diseases');
        return item;
    }

    async update(id: string, data: object, files: Record<any, any>, contentRmImgs: Array<string>): Promise<Diseases> {
        await convertContent('content', data, files, [ 'banner', 'metaImage', ], 
        {
            'banner': 'exts:jpg|jpeg|png|gif;size:5',
            'metaImage': 'exts:jpg|jpeg|png|gif;size:5',
        });
        console.log(data);
        console.log(files);

        let item = await this.disease.findByIdAndUpdate(id, data, { returnOriginal: false });
        if(item) await saveThumbOrPhotos(item);

        if(item) await saveFileContent('content', item, 'diseases');
        // deleteSpecifyFile(contentRmImgs, `diseases/${item.id}/content`);
        
        return item;
    }

    async deletes(ids: Array<string>): Promise<any> {
        return this.disease.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
    }
}

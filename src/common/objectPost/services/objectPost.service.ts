import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import  from 'mongoose';
import { isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { HelperService } from 'src/core/services/helper.service';
import { UserService } from 'src/common/users/services/user.service';
import { convertContent, convertContentFileDto, deleteSpecifyFile, saveFileContent, saveThumbOrPhotos } from 'src/core/helpers/content';
import { Page } from '@src/schemas/page/page.schema';
import { throwError } from 'rxjs';
import { ObjectPosts } from '@src/schemas/objectVaccination/postVaccination.schemas';
import { ObjectVaccinations } from '@src/schemas/objectVaccination/objectVaccination.schemas';
const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;

@Injectable()
export class ObjectPostService {
    constructor(
        @InjectModel(ObjectPosts.name) private objectPost: PaginateModel<ObjectPosts>,
        @InjectModel(ObjectVaccinations.name) private objectVaccination: PaginateModel<ObjectVaccinations>,
        private helperService: HelperService,
    ) {}

    async detail(id: string): Promise<any> {
        let item = await this.objectPost.findById(id);
        return item;
    }

    async findBySlugFrontend(slug: string): Promise<ObjectPosts> {
        let data = await this.objectVaccination.findOne({ slug: slug, deleteAt: null });

        let post = await this.objectPost.findOne({ objectVaccinationId: data.id, deleteAt: null });
        if(post){
            const viewCount = post.viewCount++;
            await this.objectPost.findByIdAndUpdate(post.id, {viewCount: viewCount}, { returnOriginal: false });
        }

        return post;
    }

    async findChildMenu(idMenu: string): Promise<any> {
        return this.objectPost.find({ isParent: idMenu, deleteAt: null, active: true }).exec();
    }

    async findAll(query: Record<string, any>): Promise<any> {
        let conditions = {};
        conditions['deletedAt'] = null;
        conditions['isParent'] = null;
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
            let result = this.objectPost.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.objectPost.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }

    async create(data: object, files: Record<any, any>): Promise<any> {
        await convertContent('content', data, files, [ 'banner', 'metaImage', ], 
        {
            'banner': 'exts:jpg|jpeg|png|gif;size:5',
            'metaImage': 'exts:jpg|jpeg|png|gif;size:5',
        });
        
        let item = await new this.objectPost(data).save();
        if (item) await saveThumbOrPhotos(item);

        if(item) await saveFileContent('content', item, 'objectPosts');
        return item;
    }

    async update(id: string, data: object, files: Record<any, any>, contentRmImgs: Array<string>): Promise<ObjectPosts> {
        await convertContent('content', data, files, [ 'banner', 'metaImage', ], 
        {
            'banner': 'exts:jpg|jpeg|png|gif;size:5',
            'metaImage': 'exts:jpg|jpeg|png|gif;size:5',
        });

        let item = await this.objectPost.findByIdAndUpdate(id, data, { returnOriginal: false });
        if(item) await saveThumbOrPhotos(item);

        if(item) await saveFileContent('content', item, 'objectPosts');
        // deleteSpecifyFile(contentRmImgs, `objectPosts/${item.id}/content`);
        
        return item;
    }

    async deletes(ids: Array<string>): Promise<any> {
        return this.objectPost.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
    }
}

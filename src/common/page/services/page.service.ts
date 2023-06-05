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
const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;

@Injectable()
export class PageService {
    constructor(
        @InjectModel(Page.name) private pages: PaginateModel<Page>,
        private helperService: HelperService,
        private userService: UserService,
    ) {}

    async detail(id: string): Promise<any> {
        return this.pages.findOne({ _id: id, deleteAt: null });
    }

    async findByCodeFrontend(pageCode: string): Promise<Page> {
        return this.pages.findOne({code: pageCode, deleteAt: null, active: true }).exec();
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

        if (isNotEmpty(query.metaDescription)) {
            conditions['metaDescription'] = {
                $regex: new RegExp(query.metaDescriptionn, 'img'),
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
            let result = this.pages.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.pages.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }

    async create(data: object, files: Record<any, any>): Promise<any> {
        await convertContentFileDto(data, files, ['metaImage']);

        data['code'] = data['code'].toUpperCase();

        let check = await this.pages.findOne({code: data['code'], deleteAt: null }).exec();
        if(check) this.helperService.throwException("Page Code đã tồn tại", 424);

        let item = await new this.pages(data).save();
        if (item) await saveThumbOrPhotos(item);
        if(item) await saveFileContent('content', item, 'pages');
        return item;
    }

    async update(id: string, data: object, files: Record<any, any>, contentRmImgs: Array<string>): Promise<Page> {
        await convertContent('content', data, files, [ 'metaImage', ], 
        {
            'metaImage': 'exts:jpg|jpeg|png|gif;size:5',
        });

        data['code'] = data['code'].toUpperCase();

        let check = await this.pages.findOne({code: data['code'], _id: {$ne: id}, deleteAt: null }).exec();
        if(check) this.helperService.throwException("Page Code đã tồn tại", 424);

        let item = await this.pages.findByIdAndUpdate(id, data, { returnOriginal: false });
        if(item) await saveThumbOrPhotos(item);

        if(item) await saveFileContent('content', item, 'pages');
        // deleteSpecifyFile(contentRmImgs, `pages/${item.id}/content`);
        
        return item;
    }

    async deletes(ids: Array<string>): Promise<any> {
        return this.pages.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
    }
}

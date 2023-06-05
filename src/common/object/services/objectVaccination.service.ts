import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import  from 'mongoose';
import { isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { HelperService } from 'src/core/services/helper.service';
import { UserService } from 'src/common/users/services/user.service';
import { convertContentFileDto, saveFileContent, saveThumbOrPhotos } from 'src/core/helpers/content';
import { Page } from '@src/schemas/page/page.schema';
import { throwError } from 'rxjs';
import { ObjectVaccinations } from '@src/schemas/objectVaccination/objectVaccination.schemas';
import { ObjectPosts } from '@src/schemas/objectVaccination/postVaccination.schemas';
const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;

@Injectable()
export class ObjectVaccinationService {
    constructor(
        @InjectModel(ObjectVaccinations.name) private objectVaccination: PaginateModel<ObjectVaccinations>,
        @InjectModel(ObjectPosts.name) private objectPost: PaginateModel<ObjectPosts>,
        private helperService: HelperService,
    ) {}

    async detail(id: string): Promise<any> {
        return await this.objectVaccination.findOne({ _id: id, deleteAt: null });
    }

    async findBySlugFrontend(slug: string): Promise<ObjectVaccinations> {
        return this.objectVaccination.findOne({slug: slug, deleteAt: null, active: true }).exec();
    }

    async findChildMenu(idMenu: string): Promise<any> {
        return this.objectVaccination.find({ isParent: idMenu, deleteAt: null, active: true }).exec();
    }

    async findAll(query: Record<string, any>): Promise<any> {
        let conditions = {};
        conditions['deletedAt'] = null;
        if(!isNotEmpty(query.admin)) conditions['isParent'] = null;
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
            let result = this.objectVaccination.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {

            // return this.objectVaccination.aggregate([
            //     {
            //         $match: {
            //           "isParent": null
            //         }
            //     },
            //     {
            //         $lookup: {
            //           from: "objectVaccinations",
            //           localField: "_id",
            //           foreignField: "isParent",
            //           as: "submenu"
            //         }
            //     },
            //     { '$facet'    : {
            //         paginator: [ { $count: "total" }, { $addFields: {
            //             page: query.page,
            //             limit: query.limit,
            //         } } ],
            //         data: [ { $skip: parseInt(query.page) - 1}, { $limit: parseInt(query.limit) } ] // add projection here wish you re-shape the docs
            //     } }
            // ]);

            return this.objectVaccination.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }



    async findAllFe(query: Record<string, any>): Promise<any> {
        let conditions = {};
        conditions['deletedAt'] = null;
        if(!isNotEmpty(query.admin)) conditions['isParent'] = null;
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
            let result = this.objectVaccination.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {

            return this.objectVaccination.aggregate([
                {
                    $match: {
                      "isParent": null
                    }
                },
                {
                    $lookup: {
                      from: "objectVaccinations",
                      localField: "_id",
                      foreignField: "isParent",
                      as: "submenu"
                    }
                },
                { '$facet'    : {
                    paginator: [ { $count: "total" }, { $addFields: {
                        page: query.page,
                        limit: query.limit,
                    } } ],
                    data: [ { $skip: parseInt(query.page) - 1}, { $limit: parseInt(query.limit) } ] // add projection here wish you re-shape the docs
                } }
            ]);
            // return this.objectVaccination.paginate(conditions, {
            //     select: projection,
            //     page: query.page,
            //     limit: query.limit,
            //     sort: sort,
            // });
        }
    }

    async create(data: object, files: Record<any, any>): Promise<any> {
        await convertContentFileDto(data, files, ['metaImage']);

        let check = await this.objectVaccination.findOne({slug: data['slug'], deleteAt: null }).exec();
        if(check) this.helperService.throwException("Slug đã tồn tại", 424);
        
        if (!isNotEmpty(data['isParent']) || data['isParent'] == "undefined" || data['isParent'] == "null") {
            delete data['isParent'];
        }

        let item = await new this.objectVaccination(data).save();
        if (item) await saveThumbOrPhotos(item);
        // if(item) await saveFileContent('content', item, 'objectVaccination');
        return item;
    }

    async update(id: string, data: object, files: Record<any, any>): Promise<any> {
        await convertContentFileDto(data, files, ['metaImage']);

        let check = await this.objectVaccination.findOne({slug: data['slug'], _id: {$ne: id}, deleteAt: null }).exec();
        if(check) this.helperService.throwException("Slug đã tồn tại", 424);

        if (!isNotEmpty(data['isParent']) || data['isParent'] == "undefined" || data['isParent'] == "null") {
            delete data['isParent'];
        }

        let item = await this.objectVaccination.findByIdAndUpdate(id, data, { returnOriginal: false });
        if (item) await saveThumbOrPhotos(item);
        // if(item) await saveFileContent('content', item, 'objectVaccination');
        return item;
    }

    async deletes(ids: Array<string>): Promise<any> {
        return this.objectVaccination.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
    }
}

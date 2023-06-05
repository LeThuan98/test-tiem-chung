import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty, isIn } from 'class-validator';
import { Post } from "@schemas/posts/post.schemas";
import { StatusEnum } from '@core/constants/post.enum';
import { convertContent, convertContentFileDto, deleteSpecifyFile, saveFileContent, saveThumbOrPhotos } from '@core/helpers/content';
import { HelperService } from '@core/services/helper.service';
const moment = require('moment');
@Injectable()
export class PostService {
    // private locale;
    private user;
    private readonly statusCode: number;
    // private role;
    // private permissions;
    // private viewStatus;
    // private defaultStatus;
    // private onSelf;

    constructor(
        @InjectModel(Post.name) private post: PaginateModel<Post>,
        @Inject(REQUEST) private request: any,
        private helper: HelperService
    ) {
        // this.locale = this.request.locale == 'vi' ? 'viNon' : this.request.locale;
        this.user = this.request.user;
        this.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;

    }

    async totalPost(): Promise<any> {
        return this.post.countDocuments();
    }

    async totalNewPost(): Promise<any> {
        return this.post.countDocuments({status: StatusEnum.NEW});
    }

    async totalReviewPost(): Promise<any> {
        return this.post.countDocuments({status: StatusEnum.IN_REVIEW});
    }

    async totalPublishedPost(): Promise<any> {
        return this.post.countDocuments({status: StatusEnum.PUBLISHED});
    }

    async totalDraftPost(): Promise<any> {
        return this.post.countDocuments({status: StatusEnum.IN_DRAFT});
    }

    async totalInActivePost(): Promise<any> {
        return this.post.countDocuments({status: StatusEnum.IN_ACTIVE});
    }

    async findAll(query: Record<string, any>): Promise<any> {
        // let locale = this.locale;
        let conditions = {};
        conditions['deletedAt'] = null;
        // conditions['status'] = { $in: this.viewStatus }
        // if(this.onSelf) conditions['author'] = this.user._id;
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
        if (isNotEmpty(query.slug)) {
            conditions[`slug`] = {
                $regex: new RegExp(query.slug, "img"),
            };
        }

        if (isNotEmpty(query.shortDescription)) {
            conditions[`shortDescription`] = {
                $regex: new RegExp(query.shortDescription, "img"),
            };
        }

        // if (isNotEmpty(query.status) && this.viewStatus.includes(parseInt(query.status))) {
        if (isNotEmpty(query.status)) {
            conditions['status'] = {
                $in: query.status.split(",")
            };
        }
        
        if (isNotEmpty(query.postCategory)) {
            conditions['postCategory'] = {
                $in: query.postCategory.split(",")
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
            let result = this.post.find(conditions).sort(sort).select(projection).populate('postCategory').populate('author').populate('lastEditor');
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.post.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
                populate: ['lastEditor','author', 'postCategory']
            });
        }
    }

    async findAllFrontend(query: Record<string, any>): Promise<any> {
        let conditions = {};
        conditions['status'] = StatusEnum.PUBLISHED;
        conditions['publishedAt'] = { $lte: moment().format('YYYY-MM-DD HH:mm:ss') };
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


        if (isNotEmpty(query.postCategory)) {
            conditions['postCategory'] = {
                $in: query.postCategory
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
            let result = this.post.find(conditions).sort(sort).select(projection).populate('author').populate('lastEditor');
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.post.paginate(conditions, {
                populate: query.populate || '',
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort
            });
        }
    }

    async findById(id: string): Promise<Post | Boolean> {
        let item = await this.post.findById(id);
        // if(!this.viewStatus.includes(item.status)) return false;
        // if(this.onSelf && item.author != this.user._id) return false;
        return item;
    }

    async findBySlug(slug: string): Promise<any> {
        let conditions = {};
        conditions[`slug`] =  slug;
        conditions[`active`] =  true;
        conditions['publishedAt'] = { $lte: moment().format('YYYY-MM-DD HH:mm:ss') };
        let post = await this.post.findOne(conditions).populate('postCategory');
        if(!post) return this.helper.throwException('Không tìm thấy bài viết!', this.statusCode);
        let related = await this.post.aggregate([
            { 
                $match : {
                    postCategory: post.postCategory._id, 
                    _id: {$ne: post._id},
                    status: StatusEnum.PUBLISHED,
                }
            },
            {
                $sample: {size: 3}
            },
            {
                $lookup: {from: 'postCategories', localField: 'postCategory', foreignField: '_id', as: 'postCategory'}
            }
        ]);
        return {
            post,
            related,
        }
    }

    async create(data: Object, files: Record<any, any>): Promise<Post> {
        // await convertContentFileDto(data, files, ['image', 'imageMb', 'metaImage']);
        await convertContent('content', data, files, ['image', 'imageMb', 'metaImage'], 
        {
            'image': 'exts:jpg|jpeg|png|gif;size:5',
            'imageMb': 'exts:jpg|jpeg|png|gif;size:5',
            'metaImage': 'exts:jpg|jpeg|png|gif;size:5',
        });

        data['author'] = this.user._id;
        data['publishedAt'] = data['publishedAt'] || moment().format('DD-MM-YYYY HH:mm:ss');
        let item = await new this.post(data).save();
        if(item) await saveThumbOrPhotos(item);
        if(item) await saveFileContent('content', item, 'posts');
        return item;
    }

    async update(id: string, data: Object, files: Record<any, any>, contentRmImgs: Array<string>): Promise<any> {
        let item = await this.findById(id);
        if(!item) return false;
        //
        // await convertContentFileDto(data, files, ['image', 'imageMb', 'metaImage']);
        await convertContent('content', data, files, ['image', 'imageMb', 'metaImage'], 
        {
            'image': 'exts:jpg|jpeg|png|gif;size:5',
            'imageMb': 'exts:jpg|jpeg|png|gif;size:5',
            'metaImage': 'exts:jpg|jpeg|png|gif;size:5',
        });
        
        // if(typeof data['status'] != 'undefined' && !this.viewStatus.includes(parseInt(data['status']))) return false;
        data['publishedAt'] = data['publishedAt'] || moment().format('DD-MM-YYYY HH:mm:ss');
        data['lastEditor'] = this.user._id;
        item = await this.post.findByIdAndUpdate(id, data, {new: true});
        if(item) await saveThumbOrPhotos(item);

        if(item) await saveFileContent('content', item, 'posts');
        // deleteSpecifyFile(contentRmImgs, `posts/${id}/content`);

        return item;

    }

    async deleteManyById(ids: Array<string>): Promise<any> {
        return this.post.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
    }
}

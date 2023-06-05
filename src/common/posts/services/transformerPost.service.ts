import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from '@core/constants/dateTime.enum';
import { StatusTrans } from '@core/constants/post.enum';
import { thumb } from '@src/core/helpers/file';
import { saveFileContent } from '@src/core/helpers/content';
const moment = require('moment');
@Injectable({ scope: Scope.REQUEST })
export class TransformerPostService {
    // private locale;

    constructor(
        @Inject(REQUEST) private request: any
    ) {
        // this.locale = this.request.locale;
    }
    
    transformCategoryList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}){
        var self = this;
        if(docs.docs) {
            docs.docs = docs.docs.map(function(doc) {
                return self.transformCategoryDetail(doc, appendDetailData, isTranslate);
            });
            return {
                ...docs,
                ...appendListData,
            };
        } else {
            docs = docs.map(function(doc) {
                return self.transformCategoryDetail(doc, appendDetailData, isTranslate);
            });
            return docs;
        }
    }

    transformCategoryDetail(doc, appendData = {}, isTranslate = false) {
        // let locale = this.locale;
        // let mustTranslate = locale && isTranslate;
        if(!doc || doc == doc._id) return doc;
        return {
            id: doc.id,
            title: doc.title,
            slug: doc.slug,
            tagColor: doc.tagColor,
            shortDescription: doc.shortDescription ? doc.shortDescription : undefined,
            active: doc.active ? doc.active : undefined,
            sortOrder: doc.sortOrder,
            metaTitle: doc.metaTitle ? doc.metaTitle : undefined,
            metaImage: doc.metaImage ? doc.thumb('metaImage') : undefined,
            metaDescription: doc.metaDescription ? doc.metaDescription : undefined,
            metaKeyword: doc.metaKeyword ? doc.metaKeyword : undefined,
            updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
            ...appendData
        };
    }

    transformCategoryExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>){
        return {
            excel: {
                name: fileName || `PostCategories-${moment().format('YYYY-MM-DD')}`,
                data: docs.map(function(doc) {
                    return {
                        id: `${doc._id}`,
                        name: doc.name,
                        slug: doc.slug,
                        tagColor: doc.tagColor,
                        shortDescription: JSON.stringify(doc.shortDescription),
                        active: doc.active == true ? 'Có' : 'Không',
                        sortOrder: doc.sortOrder,
                        updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                    };
                }),
                customHeaders: customHeaders || [
                    'ID',
                    'Tên',
                    'Slug',
                    'tag color',
                    'Mô tả ngắn',
                    'Trạng thái',
                    'Thứ tự',
                    'Modified',
                ],
            }
        };
    }

    async transformPostList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}, content= false ){
        var self = this;
        if(docs.docs) {
            for (let i = 0; i < docs.docs.length; i++) {
                docs.docs[i] = await self.transformPostDetail(
                    docs.docs[i],
                    appendDetailData,
                    isTranslate,
                    content,
                );
            }
            return await {
                ...docs,
                ...appendListData,
            };
        } else {
            for (let i = 0; i < docs.length; i++) {
                docs[i] = await self.transformPostDetail(
                    docs[i],
                    appendDetailData,
                    isTranslate,
                    content,
                );
            }
            return await docs;
        }
    }

    async transformPostDetail(doc, appendData = {}, isTranslate = false, content = false) {
        // let locale = this.locale;
        // let mustTranslate = locale && isTranslate;
        if(!doc || doc == doc._id) return doc;
        // if(doc._id) doc.id=doc._id;

        if(content) await saveFileContent('content', doc, 'posts', false);

        return {
            id: doc._id,
            author: doc.author,
            lastEditor: doc.lastEditor,
            postCategory: this.transformCategoryDetail(doc.postCategory),
            image: doc.image ? thumb(doc,'image', 'posts') : undefined,//doc.image ? doc.thumb('image') : undefined,
            imageMb: doc.imageMb ? thumb(doc,'imageMb', 'posts') : undefined,
            title: doc.title,
            slug: doc.slug,
            shortDescription:doc.shortDescription,
            content: doc.content,
            status: doc.status,
            statusText: StatusTrans(doc.status),
            publishedAt: doc.publishedAt ? doc.publishedAt : undefined,
            sortOrder: doc.sortOrder,
            metaTitle: doc.metaTitle,
            metaImage: doc.metaImage ? thumb(doc,'metaImage', 'posts') : undefined,
            metaDescription: doc.metaDescription,
            metaKeyword: doc.metaKeyword,
            updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
            ...appendData
        };
    }

    transformPostExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>){
        const self = this;
        return {
            excel: {
                name: fileName || `Posts-${moment().format('YYYY-MM-DD')}`,
                data: docs.length > 0
                ? docs.map(function (doc) {
                    return {
                        id: `${doc._id}`,
                        postCategory: JSON.stringify(self.transformCategoryDetail(doc.postCategory)),
                        image: doc.image ? doc.thumb('image') : undefined,
                        imageMb: doc.imageMb ? doc.thumb('imageMb') : undefined,
                        title: JSON.stringify(doc.title),
                        slug: JSON.stringify(doc.slug),
                        shortDescription: JSON.stringify(doc.shortDescription),
                        content: JSON.stringify(doc.content),
                        statusText: StatusTrans(doc.status),
                        publishedAt: doc.publishedAt ? doc.publishedAt : undefined,
                        sortOrder: doc.sortOrder,
                        createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                    };
                })
                : [{}],
                customHeaders: customHeaders || [
                    'ID',
                    'Chuyên mục',
                    'Hình',
                    'Hình di động',
                    'Tiêu đề',
                    'Slug',
                    'Mô tả ngắn',
                    'Nội dung',
                    'Trạng thái',
                    'Ngày đăng',
                    'Thứ tự',
                    'Ngày tạo',
                ],
            }
        };
    }

    // Tag
    transformTagList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}){
        var self = this;
        if(docs.docs) {
            docs.docs = docs.docs.map(function(doc) {
                return self.transformTagDetail(doc, appendDetailData, isTranslate);
            });
            return {
                ...docs,
                ...appendListData,
            };
        } else {
            docs = docs.map(function(doc) {
                return self.transformTagDetail(doc, appendDetailData, isTranslate);
            });
            return docs;
        }
    }

    transformTagDetail(doc, appendData = {}, isTranslate = false) {
        // let locale = this.locale;
        // let mustTranslate = locale && isTranslate;
        if(!doc || doc == doc._id) return doc;
        return {
            id: doc.id,
            name: doc.name,
            slug: doc.slug,
            active: doc.active,
            sortOrder: doc.sortOrder,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            ...appendData
        };
    }

    transformTagExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>){
        return {
            excel: {
                name: fileName || `Tags-${moment().format('YYYY-MM-DD')}`,
                data: docs.map(function(doc) {
                    return {
                        id: `${doc._id}`,
                        name: doc.name,
                        slug: doc.slug,
                        active: doc.active == true ? 'Có' : 'Không',
                        sortOrder: doc.sortOrder,
                        createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                    };
                }),
                customHeaders: customHeaders || [
                    'ID',
                    'Tên',
                    'Slug',
                    'Trạng thái',
                    'Thứ tự',
                    'Ngày tạo',
                ],
            }
        };
    }
}

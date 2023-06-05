import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { TransformerRoleService } from 'src/common/roles/services/transformerRole.service';
import { DateTime } from 'src/core/constants/dateTime.enum';
// import { SubCategory } from 'src/schemas/category/subCategory.schema';
const moment = require('moment');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class TransformerFaqService {
    private locale;

    constructor(
        @Inject(REQUEST) private request: any, // private readonly transformerRole: TransformerRoleService,
        // @InjectModel(SubCategory.name) private subCategory: Model<SubCategory>,
    ) {
        this.locale = this.request.locale;
    }

    async transformFaqList(
        docs,
        appendDetailData = {},
        isTranslate = false,
        appendListData = {},
    ) {
        var self = this;
        if (docs.docs) {
            for (let i = 0; i < docs.docs.length; i++) {
                docs.docs[i] = await self.transformFaqDetail(
                    docs.docs[i],
                    appendDetailData,
                    isTranslate,
                );
            }
            return await {
                ...docs,
                ...appendListData,
            };
        } else {
            for (let i = 0; i < docs.length; i++) {
                docs[i] = await self.transformFaqDetail(
                    docs[i],
                    appendDetailData,
                    isTranslate,
                );
            }
            return await docs;
        }
    }

    async transformFaqDetail(doc, appendData = {}, isTranslate = false) {
        if (!doc || doc == doc._id) return doc;
        //let subCategory = await this.subCategory.find({ parentCategory: doc.id });
        return {
            id: doc._id,
            title: doc.title,
            content: doc.content,
            deletedAt: doc.deletedAt ? doc.deletedAt : null,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
            ...appendData,
        };
    }

    async transformFaqExport(
        docs,
        appendData = {},
        fileName?: string,
        customHeaders?: Array<string>,
    ) {
        let data = [];
        for (let i = 0; i < docs.length; i++) {
            // let subCategory = await this.subCategory.find({
            //     parentCategory: docs[i]._id,
            // });
            data.push({
                id: `${docs[i]._id}`,
                title: docs[i].title,
                content: docs[i].content,
                createdAt: moment(docs[i].createdAt).format(DateTime.CREATED_AT),
                updatedAt: moment(docs[i].updatedAt).format(DateTime.CREATED_AT),
            });
        }
        return {
            excel: {
                name: fileName || `Faqs-${moment().format('YYYY-MM-DD')}`,
                data,
                customHeaders: customHeaders || [
                    'ID',
                    'Tiêu đề',
                    'Nội dung',
                    'createdAt',
                    'Date Modified',
                ],
            },
        };
    }
}

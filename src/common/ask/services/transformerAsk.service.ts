import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { TransformerRoleService } from '@common/roles/services/transformerRole.service';
import { DateTime } from '@core/constants/dateTime.enum';
// import { SubCategory } from '@schemas/category/subCategory.schema';
const moment = require('moment');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class TransformerAskService {
    private locale;

    constructor(
        @Inject(REQUEST) private request: any, // private readonly transformerRole: TransformerRoleService,
        // @InjectModel(SubCategory.name) private subCategory: Model<SubCategory>,
    ) {
        this.locale = this.request.locale;
    }

    async transformAskList(
        docs,
        appendDetailData = {},
        isTranslate = false,
        appendListData = {},
    ) {
        var self = this;
        if (docs.docs) {
            for (let i = 0; i < docs.docs.length; i++) {
                docs.docs[i] = await self.transformAskDetail(
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
                docs[i] = await self.transformAskDetail(
                    docs[i],
                    appendDetailData,
                    isTranslate,
                );
            }
            return await docs;
        }
    }

    async transformAskDetail(doc, appendData = {}, isTranslate = false) {
        if (!doc || doc == doc._id) return doc;
        //let subCategory = await this.subCategory.find({ parentCategory: doc.id });
        return {
            id: doc._id,
            content: doc.content ? doc.content : undefined,
            question: doc.question ? doc.question : undefined,
            customer: doc.customer ? doc.customer : undefined,
            deletedAt: doc.deletedAt ? doc.deletedAt : null,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
            ...appendData,
        };
    }

    async transformAskExport(
        docs,
        appendData = {},
        fileName?: string,
        customHeaders?: Array<string>,
    ) {
        let data = [];
        for (let i = 0; i < docs.length; i++) {
            data.push({
                id: `${docs[i]._id}`,
                question: docs[i].question ? docs[i].question : undefined,
                content: docs[i].content ? docs[i].content : undefined,
                customer: docs[i].customer ? docs[i].customer.name : undefined,
                createdAt: moment(docs[i].createdAt).format(DateTime.CREATED_AT),
                updatedAt: moment(docs[i].updatedAt).format(DateTime.CREATED_AT),
            });
        }
        return {
            excel: {
                name: fileName || `Asks-${moment().format('YYYY-MM-DD')}`,
                data,
                customHeaders: customHeaders || [
                    'ID',
                    'Câu hỏi',
                    'Câu trả lời',
                    'Người gửi',
                    'createdAt',
                    'Date Modified',
                ],
            },
        };
    }
}

import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { TransformerRoleService } from 'src/common/roles/services/transformerRole.service';
import { DateTime } from 'src/core/constants/dateTime.enum';
// import { SubCategory } from 'src/schemas/category/subCategory.schema';
const moment = require('moment');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { thumb } from '@src/core/helpers/file';

@Injectable({ scope: Scope.REQUEST })
export class TransformerObjectVaccinationService {
    private locale;

    constructor(
        @Inject(REQUEST) private request: any, // private readonly transformerRole: TransformerRoleService,
        // @InjectModel(SubCategory.name) private subCategory: Model<SubCategory>,
    ) {
        this.locale = this.request.locale;
    }

    async transformPageList(
        docs,
        appendDetailData = {},
        isTranslate = false,
        appendListData = {},
    ) {
        var self = this;
        if (docs.docs) {
            for (let i = 0; i < docs.docs.length; i++) {
                docs.docs[i] = await self.transformPageDetail(
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
                docs[i] = await self.transformPageDetail(
                    docs[i],
                    appendDetailData,
                    isTranslate,
                );
            }
            return await docs;
        }
    }

    async transformPageDetail(doc, appendData = {}, isTranslate = false) {
        if (!doc || doc == doc._id) return doc;
        //let subCategory = await this.subCategory.find({ parentCategory: doc.id });
        return {
            id: doc._id,
            name: doc.name,
            slug: doc.slug,
            active: doc.active,
            sub: doc.submenu,
            shortDescription: doc.shortDescription,
            sortOrder: doc.sortOrder,
            isParent: doc.isParent,
            metaImage: doc.metaImage ? thumb(doc, "metaImage", "objectVaccinations", {"FB": "600x315"}, "FB") : null,
            metaTitle: doc.metaTitle ? doc.metaTitle : null,
            metaKeyword: doc.metaKeyword ? doc.metaKeyword : null,
            metaDescription: doc.metaDescription ? doc.metaDescription : null,
            deletedAt: doc.deletedAt ? doc.deletedAt : null,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
            ...appendData,
        };
    }

    async transformPageExport(
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
                name: docs[i].name,
                metaImage: docs[i].metaImage ? docs[i].thumb('metaImage','FB') : null,
                metaTitle: docs[i].metaTitle ? docs[i].metaTitle : null,
                metaKeyword: docs[i].metaKeyword ? docs[i].metaKeyword : null,
                metaDescription: docs[i].metaDescription ? docs[i].metaDescription : null,
                createdAt: moment(docs[i].createdAt).format(DateTime.CREATED_AT),
                updatedAt: moment(docs[i].updatedAt).format(DateTime.CREATED_AT),
            });
        }
        return {
            excel: {
                name: fileName || `Pages-${moment().format('YYYY-MM-DD')}`,
                data,
                customHeaders: customHeaders || [
                    'ID',
                    'Name',
                    'Meta Image',
                    'Meta Title',
                    'Meta Keyword',
                    'Meta Description',
                    'createdAt',
                    'Date Modified',
                ],
            },
        };
    }
}

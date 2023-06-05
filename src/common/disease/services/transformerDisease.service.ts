import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from 'src/core/constants/dateTime.enum';
import { saveFileContent } from '@src/core/helpers/content';

const moment = require('moment');

@Injectable({ scope: Scope.REQUEST })
export class TransformerDiseaseService {
    private locale;

    constructor(
        @Inject(REQUEST) private request: any,
    ) {
        this.locale = this.request.locale;
    }

    async transformDiseaseList( docs, appendDetailData = {}, isTranslate = false, appendListData = {}, content= false ) {
        var self = this;
        if (docs.docs) {
            for (let i = 0; i < docs.docs.length; i++) {
                docs.docs[i] = await self.transformDiseaseDetail(
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
                docs[i] = await self.transformDiseaseDetail(
                    docs[i],
                    appendDetailData,
                    isTranslate,
                    content,
                );
            }
            return await docs;
        }
    }

    async transformDiseaseDetail(doc, appendData = {}, isTranslate = false, content = false) {
        if (!doc || doc == doc._id) return doc;

        if(content) await saveFileContent('content', doc, 'diseases', false);

        return {
            id: doc._id,
            banner: doc.banner ? doc.thumb('banner', 'L') : null,
            title: doc.title,
            slug: doc.slug,
            subtitle: doc.subtitle,
            objectVaccinationId: doc.objectVaccinationId,
            description: doc.description,
            link: doc.link,
            readTime: doc.readTime,
            viewCount: doc.viewCount,
            bannerImg: doc.bannerImg,
            active: doc.active,
            activeSub: doc.activeSub,
            content: doc.content,
            metaImage: doc.metaImage ? doc.thumb('metaImage','FB') : null,
            metaTitle: doc.metaTitle ? doc.metaTitle : null,
            metaKeyword: doc.metaKeyword ? doc.metaKeyword : null,
            metaDescription: doc.metaDescription ? doc.metaDescription : null,
            deletedAt: doc.deletedAt ? doc.deletedAt : null,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
            ...appendData,
        };
    }

    async transformDiseaseExport( docs, appendData = {}, fileName?: string, customHeaders?: Array<string>, ) {
        let data = [];
        for (let i = 0; i < docs.length; i++) {
            
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

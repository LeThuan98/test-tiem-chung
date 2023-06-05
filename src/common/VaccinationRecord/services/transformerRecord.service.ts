import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { TransformerRoleService } from '@common/roles/services/transformerRole.service';
import { DateTime } from '@core/constants/dateTime.enum';
// import { SubCategory } from '@schemas/category/subCategory.schema';
const moment = require('moment');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class TransformerRecordService {
    private locale;

    constructor(
        @Inject(REQUEST) private request: any, // private readonly transformerRole: TransformerRoleService,
        // @InjectModel(SubCategory.name) private subCategory: Model<SubCategory>,
    ) {
        this.locale = this.request.locale;
    }

    async transformRecordList(
        docs,
        appendDetailData = {},
        isTranslate = false,
        appendListData = {},
    ) {
        var self = this;
        if (docs.docs) {
            for (let i = 0; i < docs.docs.length; i++) {
                docs.docs[i] = await self.transformRecordDetail(
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
                docs[i] = await self.transformRecordDetail(
                    docs[i],
                    appendDetailData,
                    isTranslate,
                );
            }
            return await docs;
        }
    }

    async transformRecordDetail(doc, appendData = {}, isTranslate = false) {
        if (!doc || doc == doc._id) return doc;
        //let subCategory = await this.subCategory.find({ parentCategory: doc.id });
        return {
            id: doc._id,
            table1: doc.table1,
            objectVaccinationId: doc.objectVaccinationId,
            name: doc.name ? doc.name : undefined,
            customer: doc.customer ? doc.customer : undefined,
            subject: doc.subject ? doc.subject : undefined,
            gender: doc.gender ? doc.gender : undefined,
            address: doc.address ? doc.address : undefined,
            province: doc.province ? doc.province : undefined,
            district: doc.district ? doc.district : undefined,
            dateOfBirth: doc.dateOfBirth ? doc.dateOfBirth : undefined,
            deletedAt: doc.deletedAt ? doc.deletedAt : null,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
            ...appendData,
        };
    }

    async transformRecordExport(
        docs,
        appendData = {},
        fileName?: string,
        customHeaders?: Array<string>,
    ) {
        let data = [];
        for (let i = 0; i < docs.length; i++) {
            data.push({
                id: `${docs[i]._id}`,
                name: docs[i].name ? docs[i].name : undefined,
                subject: docs[i].subject ? docs[i].subject : undefined,
                gender: docs[i].gender ? docs[i].gender : undefined,
                dateOfBirth: docs[i].dateOfBirth ? docs[i].dateOfBirth : undefined,
                address: docs[i].address ? docs[i].address : undefined,
                province: docs[i].province ? docs[i].province : undefined,
                district: docs[i].district ? docs[i].district : undefined,
                createdAt: moment(docs[i].createdAt).format(DateTime.CREATED_AT),
                updatedAt: moment(docs[i].updatedAt).format(DateTime.CREATED_AT),
            });
        }
        return {
            excel: {
                name: fileName || `Records-${moment().format('YYYY-MM-DD')}`,
                data,
                customHeaders: customHeaders || [
                    'ID',
                    'Tên',
                    'Đối tượng tiên chủng',
                    'Giới tính',
                    'Ngày sinh',
                    'Địa chỉ',
                    'Tỉnh/Thành phố',
                    'Quận/Huyện',
                    'createdAt',
                    'Date Modified',
                ],
            },
        };
    }
}

import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from '@core/constants/dateTime.enum';

const moment = require('moment');

@Injectable({ scope: Scope.REQUEST })
export class TransformerVaxScheduleService {
    private locale;

    constructor(
        @Inject(REQUEST) private request: any
    ) {
        this.locale = this.request.locale;
    }
    
    transformVaxScheduleList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}){
        var self = this;
        if(docs.docs) {
            docs.docs = docs.docs.map(function(doc) {
                return self.transformVaxScheduleDetail(doc, appendDetailData, isTranslate);
            });
            return {
                ...docs,
                ...appendListData,
            };
        } else {
            docs = docs.map(function(doc) {
                return self.transformVaxScheduleDetail(doc, appendDetailData, isTranslate);
            });
            return docs;
        }
    }

    transformVaxScheduleDetail(doc, appendData = {}, isTranslate = false) {
        let locale = this.locale;
        let mustTranslate = locale && isTranslate;
        if(!doc || doc == doc._id) return doc;
        return {
            id: doc.id,
            tableLabel1: doc.tableLabel1,
            table1: doc.table1,
            name: doc.name,
            slug: doc.slug,
            shortDescription:doc.shortDescription,
            objectVaccinationId:doc.objectVaccinationId,
            active: doc.active,
            metaTitle: doc.metaTitle,
            metaImage: doc.thumb('metaImage', 'FB'),
            metaDescription: doc.metaDescription,
            metaKeyword: doc.metaKeyword,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            ...appendData
        };
    }

    //Product FE

    transformVaxScheduleListFe(docs, appendDetailData = {}, isTranslate = false, appendListData = {}){
        var self = this;
        if(docs.docs) {
            docs.docs = docs.docs.map(function(doc) {
                return self.transformVaxScheduleDetailFe(doc, appendDetailData, isTranslate);
            });
            return {
                ...docs,
                ...appendListData,
            };
        } else {
            docs = docs.map(function(doc) {
                return self.transformVaxScheduleDetailFe(doc, appendDetailData, isTranslate);
            });
            return docs;
        }
    }

    transformVaxScheduleDetailFe(doc, appendData = {}, isTranslate = false) {
        let locale = this.locale;
        let mustTranslate = locale && isTranslate;
        if(!doc || doc == doc._id) return doc;
        return {
            id: doc.id,
            tableLabel1: doc.tableLabel1,
            table1: doc.table1,
            name: doc.name,
            slug: doc.slug,
            shortDescription:doc.shortDescription,
            metaTitle: doc.metaTitle,
            metaImage: doc.thumb('metaImage', 'FB'),
            metaDescription: doc.metaDescription,
            metaKeyword: doc.metaKeyword,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            ...appendData
        };
    }

    
}

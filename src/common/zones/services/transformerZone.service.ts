import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from '@src/core/constants/dateTime.enum';
const moment = require('moment');
@Injectable({ scope: Scope.REQUEST })
export class TransformerZoneService {
    private locale;

    constructor( @Inject(REQUEST) private request: any) {
        this.locale = this.request.locale;
    }

    transformZoneProvinceList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}){
        var self = this;
        if(docs.docs) {
            docs.docs = docs.docs.map(function(doc) {
                return self.transformZoneProvinceDetail(doc, appendDetailData, isTranslate);
            });
            return {
                ...docs,
                appendListData,
            };
        } else {
            docs = docs.map(function(doc) {
                return self.transformZoneProvinceDetail(doc, appendDetailData, isTranslate);
            });
            return docs;
        }
    }

    transformZoneProvinceDetail(doc, appendData = {}, isTranslate = false) {
        let locale = this.locale;
        let mustTranslate = locale && isTranslate;
        if(!doc || doc == doc._id) return doc;
        return {
            id: doc._id,
            code: doc.code,
            normalId: doc.normalId,
            active: doc.active,
            name: mustTranslate ? doc.name[locale] : doc.name,
            lat: doc.lat,
            lng: doc.lng,
            sortOrder: doc.sortOrder,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            ...appendData
        };
    }

    transformZoneDistrictList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}){
        var self = this;
        if(docs.docs) {
            docs.docs = docs.docs.map(function(doc) {
                return self.transformZoneDistrictDetail(doc, appendDetailData, isTranslate);
            });
            return {
                ...docs,
                appendListData,
            };
        } else {
            docs = docs.map(function(doc) {
                return self.transformZoneDistrictDetail(doc, appendDetailData, isTranslate);
            });
            return docs;
        }
    }

    transformZoneDistrictDetail(doc, appendData = {}, isTranslate = false) {
        let locale = this.locale;
        let mustTranslate = locale && isTranslate;
        if(!doc || doc == doc._id) return doc;
        return {
            id: doc._id,
            zoneProvince: doc.zoneProvince,
            code: doc.code,
            normalId: doc.normalId,
            active: doc.active,
            name: mustTranslate ? doc.name[locale] : doc.name,
            lat: doc.lat,
            lng: doc.lng,
            sortOrder: doc.sortOrder,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            ...appendData
        };
    }

    transformZoneWardList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}){
        var self = this;
        if(docs.docs) {
            docs.docs = docs.docs.map(function(doc) {
                return self.transformZoneWardDetail(doc, appendDetailData, isTranslate);
            });
            return {
                ...docs,
                appendListData,
            };
        } else {
            docs = docs.map(function(doc) {
                return self.transformZoneWardDetail(doc, appendDetailData, isTranslate);
            });
            return docs;
        }
    }

    transformZoneWardDetail(doc, appendData = {}, isTranslate = false) {
        let locale = this.locale;
        let mustTranslate = locale && isTranslate;
        if(!doc || doc == doc._id) return doc;
        return {
            id: doc._id,
            zoneDistrict: doc.zoneDistrict,
            code: doc.code,
            normalId: doc.normalId,
            active: doc.active,
            name: mustTranslate ? doc.name[locale] : doc.name,
            lat: doc.lat,
            lng: doc.lng,
            sortOrder: doc.sortOrder,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            ...appendData
        };
    }

    transformProvinceExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>){
        return {
            excel: {
                name: fileName || `Province-${moment().format('YYYY-MM-DD')}`,
                data: docs.length > 0 ? docs.map(function(doc) {
                    return {
                        id: `${doc._id}`,
                        code: doc.code,
                        active: doc.active,
                        name: JSON.stringify(doc.name),
                        lat: doc.lat,
                        lng: doc.lng,
                        sortOrder: doc.sortOrder,
                        createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                    };
                }) : [{}],
                customHeaders: customHeaders || [
                    'ID',
                    'Mã',
                    'Trạng thái',
                    'Tên',
                    'Lat',
                    'Lng',
                    'Thứ tự',
                    'Ngày tạo',
                ],
            }
        };
    }

    transformDistrictExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>){
        return {
            excel: {
                name: fileName || `District-${moment().format('YYYY-MM-DD')}`,
                data: docs.length > 0 ? docs.map(function(doc) {
                    return {
                        id: `${doc._id}`,
                        zoneProvince: JSON.stringify(doc.zoneProvince),
                        code: doc.code,
                        active: doc.active,
                        name: JSON.stringify(doc.name),
                        lat: doc.lat,
                        lng: doc.lng,
                        sortOrder: doc.sortOrder,
                        createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                    };
                }) : [{}],
                customHeaders: customHeaders || [
                    'ID',
                    'Tỉnh/Thành phố',
                    'Mã',
                    'Trạng thái',
                    'Tên',
                    'Lat',
                    'Lng',
                    'Thứ tự',
                    'Ngày tạo',
                ],
            }
        };
    }

    transformWardExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>){
        return {
            excel: {
                name: fileName || `Ward-${moment().format('YYYY-MM-DD')}`,
                data: docs.length > 0 ? docs.map(function(doc) {
                    return {
                        id: `${doc._id}`,
                        zoneDistrict: JSON.stringify(doc.zoneDistrict),
                        code: doc.code,
                        active: doc.active,
                        name: JSON.stringify(doc.name),
                        lat: doc.lat,
                        lng: doc.lng,
                        sortOrder: doc.sortOrder,
                        createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                    };
                }) : [{}],
                customHeaders: customHeaders || [
                    'ID',
                    'Quận/Huyện',
                    'Mã',
                    'Trạng thái',
                    'Tên',
                    'Lat',
                    'Lng',
                    'Thứ tự',
                    'Ngày tạo',
                ],
            }
        };
    }
}

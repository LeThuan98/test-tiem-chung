import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { TransformerRoleService } from '@common/roles/services/transformerRole.service';
import { DateTime } from '@core/constants/dateTime.enum';
const moment = require('moment');
@Injectable({ scope: Scope.REQUEST })
export class TransformerCustomerService {
    private locale;

    constructor(
        @Inject(REQUEST) private request: any, // private readonly transformerRole: TransformerRoleService,
    ) {
        this.locale = this.request.locale;
    }

    transformCustomerList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
        var self = this;
        if (docs.docs) {
            docs.docs = docs.docs.map(function (doc) {
                return self.transformCustomerDetail(doc, appendDetailData, isTranslate);
            });
            return {
                ...docs,
                ...appendListData,
            };
        } else {
            docs = docs.map(function (doc) {
                return self.transformCustomerDetail(doc, appendDetailData, isTranslate);
            });
            return docs;
        }
    }

    transformCustomerDetail(doc, appendData = {}, isTranslate = false) {
        if (!doc || doc == doc._id) return doc;
        let profileImage = null;
        if(doc.profileImage){
            doc.profileImage.includes('http') || doc.profileImage.includes('https') ? profileImage = doc.profileImage :
            profileImage = doc.thumb('profileImage', 'FB')
        }
        return {
            id: doc._id,
            profileImage,
            uid: doc.uid ? doc.uid : undefined,
            username: doc.username,
            name: doc.name ? doc.name : undefined,
            gender: doc.gender ? doc.gender : undefined,
            email: doc.email ? doc.email : undefined,
            phone: doc.phone ? doc.phone : undefined,
            social: doc.social ? doc.social : undefined,
            address: doc.address ? doc.address : undefined,
            province: doc.province ? doc.province : undefined,
            district: doc.district ? doc.district : undefined,
            active: doc.active,
            dateOfBirth: doc.dateOfBirth ? doc.dateOfBirth : undefined,
            authType: doc.authType,
            deletedAt: doc.deletedAt ? doc.deletedAt : null,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
            ...appendData,
        };
    }

    transformCustomerExport(
        docs,
        appendData = {},
        fileName?: string,
        customHeaders?: Array<string>,
    ) {
        return {
            excel: {
                name: fileName || `Customers-${moment().format('YYYY-MM-DD')}`,
                data:
                    docs.length > 0
                        ? docs.map(function (doc) {
                            let profileImage = null;
                            if(doc.profileImage){
                                doc.profileImage.includes('http') || doc.profileImage.includes('https') ? profileImage = doc.profileImage :
                                profileImage = doc.thumb('profileImage')
                            }
                                return {
                                    id: `${doc._id}`,
                                    profileImage: doc.profileImage ? doc.thumb('profileImage') : undefined,
                                    username: doc.username,
                                    name: doc.name ? doc.name : undefined,
                                    gender: doc.gender ? doc.gender : undefined,
                                    dateOfBirth: doc.dateOfBirth ? doc.dateOfBirth : undefined,
                                    email: doc.email ? doc.email : undefined,
                                    phone: doc.phone ? doc.phone : undefined,
                                    address: doc.address ? doc.address : undefined,
                                    province: doc.province ? doc.province : undefined,
                                    district: doc.district ? doc.district : undefined,
                                    active: doc.active,
                                    createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                                    updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                                };
                            })
                        : [{}],
                customHeaders: customHeaders || [
                    'ID',
                    'profile image',
                    'Tài khoản',
                    'Tên',
                    'Giới tính',
                    'Ngày sinh',
                    'Email',
                    'Số điện thoại',
                    'Địa chỉ',
                    'Tỉnh/Thành phố',
                    'Quận/huyện',
                    'Kích hoạt',
                    'createdAt',
                    'Date Modified',
                ],
            },
        };
    }
}

import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TransformerRoleService } from '@common/roles/services/transformerRole.service';
import { DateTime } from '@core/constants/dateTime.enum';
const moment = require('moment');
@Injectable({ scope: Scope.REQUEST })
export class TransformerQuestionService {
    private locale;

    constructor(
        @Inject(REQUEST) private request: any,
        private readonly transformerRole: TransformerRoleService,
    ) {
        this.locale = this.request.locale;
    }

    // Role
    transformQuestionList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
        let self = this;
        if (docs.docs) {
            docs.docs = docs.docs.map(function (doc) {
                return self.transformQuestionDetail(doc, appendDetailData, isTranslate);
            });
            return {
                ...docs,
                ...appendListData,
            };
        } else {
            docs = docs.map(function (doc) {
                return self.transformQuestionDetail(doc, appendDetailData, isTranslate);
            });
            return docs;
        }
    }

    transformQuestionDetail(doc, appendData = {}, isTranslate = false) {
        if (!doc || doc == doc._id) return doc;
        return {
            id: doc._id,
            content: doc.content,
            answer: doc.answer,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
            ...appendData,
        };
    }

    transformQuestionExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
        let self = this;
        return {
            excel: {
                name: fileName || `Questions-${moment().format('YYYY-MM-DD')}`,
                data:
                    docs.length > 0
                        ? docs.map(function (doc) {
                              return {
                                  id: `${doc._id}`,
                                  content: doc.content,
                                  answer: JSON.stringify(doc.answer),
                                  createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                                  updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                              };
                          })
                        : [{}],
                customHeaders: customHeaders || [
                    'ID',
                    'Nội dung câu hỏi',
                    'Đáp án',
                    'Create At',
                    'modified At',
                ],
            },
        };
    }

    transformResultList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
        let self = this;
        if (docs.docs) {
            docs.docs = docs.docs.map(function (doc) {
                return self.transformResultDetail(doc, appendDetailData, isTranslate);
            });
            return {
                ...docs,
                ...appendListData,
            };
        } else {
            docs = docs.map(function (doc) {
                return self.transformResultDetail(doc, appendDetailData, isTranslate);
            });
            return docs;
        }
    }

    transformResultDetail(doc, appendData = {}, isTranslate = false) {
        if (!doc || doc == doc._id) return doc;
        return {
            id: doc._id,
            content: doc.content,
            mostAnswered: doc.mostAnswered,
            createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
            updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
            ...appendData,
        };
    }

    transformResultExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
        let self = this;
        return {
            excel: {
                name: fileName || `Questions-${moment().format('YYYY-MM-DD')}`,
                data:
                    docs.length > 0
                        ? docs.map(function (doc) {
                              return {
                                  id: `${doc._id}`,
                                  content: doc.content,
                                  mostAnswered: doc.mostAnswered,
                                  createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                                  updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                              };
                          })
                        : [{}],
                customHeaders: customHeaders || [
                    'ID',
                    'Nội dung câu trả lời',
                    'Đáp án',
                    'Create At',
                    'modified At',
                ],
            },
        };
    }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.schemas';
import { TokenBlacklist, TokenBlacklistSchema } from './user/tokenBlacklist.schema';
import { User, UserSchema } from './user/user.schemas';
import { Customer, CustomerSchema } from './customer/customer.schemas';
import { Activity, ActivitySchema } from '@schemas/activities/activity.schema';
const mongoosePaginate = require('mongoose-paginate-v2');
import { Page, PageSchema } from './page/page.schema';
import { Setting, SettingSchema } from './setting.schemas';

import { ZoneProvince, ZoneProvinceSchema } from './zones/zoneProvince.schemas';
import { ZoneDistrict, ZoneDistrictSchema } from './zones/zoneDistrict.schemas';
import { ZoneWard, ZoneWardSchema } from './zones/zoneWard.schemas';

import { PostCategory, PostCategorySchema } from './posts/postCategory.schemas';
import { Post, PostSchema } from './posts/post.schemas';
import { VaccinationRecord, VaccinationRecordSchema } from './vaccination/vaccinationRecord.schema';
import { Question, QuestionSchema } from './questions/question.schema';
import { Result, ResultSchema } from './questions/result.schema';
import { Ask, AskSchema } from './ask/ask.schema';
import { Faq, FaqSchema } from './faqs/faq.schema';
import { VaxSchedule, VaxScheduleSchema } from './vaxSchedule/vaxSchedule.schemas';
import { ObjectVaccinations, ObjectVaccinationsSchema } from './objectVaccination/objectVaccination.schemas';
import { ObjectPosts, ObjectPostsSchema } from './objectVaccination/postVaccination.schemas';
import { Diseases, DiseasesSchema } from './disease/disease.schema';

const modelSchemas = [
    MongooseModule.forFeature([{ name: TokenBlacklist.name, schema: TokenBlacklistSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
    MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }]),
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),

    
    MongooseModule.forFeature([{ name: ZoneProvince.name, schema: ZoneProvinceSchema }]),
    MongooseModule.forFeature([{ name: ZoneDistrict.name, schema: ZoneDistrictSchema }]),
    MongooseModule.forFeature([{ name: ZoneWard.name, schema: ZoneWardSchema }]),

    MongooseModule.forFeature([{ name: VaxSchedule.name, schema: VaxScheduleSchema }]),

    MongooseModule.forFeature([{ name: PostCategory.name, schema: PostCategorySchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: VaccinationRecord.name, schema: VaccinationRecordSchema }]),
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
    MongooseModule.forFeature([{ name: Ask.name, schema: AskSchema }]),
    MongooseModule.forFeature([{ name: Faq.name, schema: FaqSchema }]),
    MongooseModule.forFeature([{ name: ObjectVaccinations.name, schema: ObjectVaccinationsSchema }]),
    MongooseModule.forFeature([{ name: ObjectPosts.name, schema: ObjectPostsSchema }]),

    MongooseModule.forFeature([{ name: Diseases.name, schema: DiseasesSchema }]),
];

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [],
            inject: [],
            useFactory: async () => {
                mongoosePaginate.paginate.options = {
                    customLabels: {
                        docs: 'docs',
                        totalDocs: 'total',
                        limit: 'limit',
                        page: 'currentPage',
                        nextPage: 'next',
                        prevPage: 'prev',
                        totalPages: 'pageCount',
                        pagingCounter: 'slNo',
                        meta: 'paginator',
                    },
                };
                return {
                    uri: process.env.DB_CONNECTION_STRING,
                    connectionFactory: (connection: Record<any, any>): any => {
                        connection.plugin(require('./utils/plugins/uploadFile'));
                        // connection.plugin(require('./utils/plugins/setViNon'));
                        // connection.plugin(require('./plugins/updatedAt'));
                        connection.plugin(require('mongoose-paginate-v2'));
                        return connection;
                    },
                };
            },
        }),
        ...modelSchemas,
    ],
    exports: [MongooseModule, ...modelSchemas],
})
export class SchemasModule {}

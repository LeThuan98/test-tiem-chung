import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
    collection: 'postCategories'
})
export class PostCategory extends Document {
    @Prop({
        required: true
    })
    title: string;

    @Prop({
        required: true
    })
    slug: string;

    @Prop({
        required: true
    })
    tagColor: string;

    @Prop()
    shortDescription: string;

    @Prop({
        required: true,
        default: 0,
    })
    sortOrder: number;

    @Prop({
        required: true,
        default: true,
    })
    active: boolean;

    @Prop()
    metaTitle: string;

    @Prop()
    metaImage: string;

    @Prop()
    metaDescription: string;

    @Prop()
    metaKeyword: string;

    @Prop({
        default: null,
    })
    deletedAt: Date;

    @Prop({
        required: true,
        default: Date.now
    })
    createdAt: Date;

    @Prop({
        required: true,
        default: Date.now
    })
    updatedAt: Date;
}

export const PostCategorySchema = SchemaFactory.createForClass(PostCategory);


PostCategorySchema.methods.thumbnail = function (field: string, type: string): object {
    return {
        'collection': 'postCategories',
        'method': 'inside',
        'fields': {
            'metaImage': {}
        }
    };
};

// PostCategorySchema.methods.fieldTranslations = function (): any {
//     return {
//         'name': true,
//         'title': true,
//         'shortDescription': true,
//     };
// };

PostCategorySchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        let fieldName = error.errmsg.substring(error.errmsg.indexOf('index: ') + 7, error.errmsg.indexOf('_1'));
        let msg = '';
        if(fieldName == 'slug') {
            msg = 'Slug đã được đăng ký';
        }
        next(new Error(msg));
    } else {
        next(error);
    }
});
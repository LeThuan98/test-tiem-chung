import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { MultiLanguageContentProp, MultiLanguageProp, MultiLanguageSlugProp } from '@schemas/utils/multiLanguageProp';
import { PostCategory } from '@schemas/posts/postCategory.schemas';
import { User } from '@schemas/user/user.schemas';
import { StatusEnum } from '@core/constants/post.enum';
@Schema({
    timestamps: true,
    collection: 'posts'
})
export class Post extends Document {
    @Prop({
        index: true,
        type: SchemaTypes.ObjectId,
        ref: User.name,
        default: null,
    })
    author: any;

    @Prop({
        index: true,
        type: SchemaTypes.ObjectId,
        ref: User.name,
        default: null,
    })
    lastEditor: any;

    @Prop({
        trim: true
    })
    readTime: string;

    @Prop({
        default: 0
    })
    viewCount: number;

    @Prop({
        index: true,
        type: SchemaTypes.ObjectId,
        ref: PostCategory.name,
    })
    postCategory: any;

    @Prop({
        default: null,
    })
    image: string;

    @Prop({
        default: null,
    })
    imageMb: string;

    @Prop({
        type: String,
        default: null,
        trim: true
    })
    title: string;

    @Prop({
        type: String,
        default: null,
        trim: true
    })
    titleNon: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        unique: true,
        set: function(vi) {
            vi = vi.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            vi = vi.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            vi = vi.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            vi = vi.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            vi = vi.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            vi = vi.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            vi = vi.replace(/đ/g, "d");
            // Some system encode vietnamese combining accent as individual utf-8 characters
            vi = vi.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
            vi = vi.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

            vi = vi.replace(/^\s+|\s+$/g, "");
            vi = vi.replace(/\ +/g, "-");
            vi = vi.toLowerCase();
            return vi;
        }
    })
    slug: string;

    @Prop({
        trim: true,
        default: null,
    })
    shortDescription: string;

    @Prop({
        trim: true,
        default: null,
    })
    shortDescriptionNon: string;

    @Prop(MultiLanguageContentProp)
    content: Object;

    @Prop({
        required: true,
        default: 0,
    })
    sortOrder: number;

    @Prop({
        required: true,
        default: StatusEnum.NEW,
    })
    status: number;

    @Prop({
        nullable: true,
        default: null,
        index: true,
    })
    publishedAt: string;

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

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.methods.thumbnail = function (field: string, type: string): object {
    return {
        'collection': 'posts',
        'method': 'inside',
        'fields': {
            'image': {
                'L': '1000x1000'
            },
            'imageMb': {
                'L': '1000x1000'
            },
            'metaImage': {
                'FB': '600x315'
            }
        },
    };
};

PostSchema.methods.fieldTranslations = function (): any {
    return {
        'title': true,
        'shortDescription': true,
    };
};

PostSchema.post('save', function(error, doc, next) {
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

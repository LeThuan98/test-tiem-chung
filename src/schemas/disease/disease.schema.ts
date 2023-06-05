import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { MultiLanguageContentProp } from '../utils/multiLanguageProp';

@Schema({
    timestamps: true,
    collection: 'disease'
})
export class Diseases extends Document {

    @Prop({
        trim: true
    })
    readTime: string;

    @Prop({
        default: 0
    })
    viewCount: number;

    @Prop({
        type: String,
        default: null,
        trim: true
    })
    banner: string;

    @Prop({
        required: true,
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
        required: false
    })
    subTitle: string;

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
        required: false
    })
    description: string;

    @Prop({
        trim: true,
        default: null,
    })
    descriptionNon: string;

    @Prop({
        trim: true,
        default: null,
    })
    link: string;

    @Prop({
        trim: true,
        default: null,
    })
    subtitle: string;

    @Prop(MultiLanguageContentProp)
    content: Object;

    @Prop({
        required: true,
        default: true,
    })
    active: boolean;

    @Prop({
        required: false,
        default: false,
    })
    activeSub: boolean;

    @Prop({
        required: false,
        default: 0,
    })
    sortOrder: number;

    @Prop({
        trim: true,
        default: null,
    })
    metaTitle: string;

    @Prop({
        trim: true,
        default: null,
    })
    metaImage: string;

    @Prop({
        trim: true,
        default: null,
    })
    metaDescription: string;

    @Prop({
        trim: true,
        default: null,
    })
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

export const DiseasesSchema = SchemaFactory.createForClass(Diseases);

DiseasesSchema.methods.fieldTranslations = function (): any {
    return {
        'title': true,
        'description': true,
    };
};

DiseasesSchema.methods.thumbnail = function (field: string, type: string): object {
    return {
        'collection': 'diseases',
        'method': 'inside',
        'fields': {
            'metaImage': {
                'FB': '600x315'
            },
            'banner': {
                'S': '500x500',
                'M': '700x700',
                'L': '1000x1000',
                'XL': '1500x465',
                'FB': '600x315'
            }
        }
    };
};

DiseasesSchema.post('save', function(error, doc, next) {
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
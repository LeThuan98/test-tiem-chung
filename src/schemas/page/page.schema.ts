import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { MultiLanguageContentProp, MultiLanguageProp } from '../utils/multiLanguageProp';

@Schema({
    timestamps: true,
    collection: 'pages',
})
export class Page extends Document implements TimestampInterface {
    @Prop({
        required: true,
        default: true,
    })
    active: boolean;

    @Prop({
        unique: true,
        required: true,
        trim: true,
    })
    code: string;

    @Prop(MultiLanguageProp)
    name: Object;

    @Prop(MultiLanguageContentProp)
    content: Object;

    @Prop(MultiLanguageProp)
    metaTitle: Object;

    @Prop(MultiLanguageProp)
    metaImage: Object;

    @Prop(MultiLanguageProp)
    metaDescription: Object;

    @Prop(MultiLanguageProp)
    metaKeyword: Object;
    
    @Prop({
        default: null,
    })
    deletedAt: Date;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const PageSchema = SchemaFactory.createForClass(Page);

PageSchema.methods.thumbnail = function (): any {
    return {
        'collection': 'pages',
        'method': 'inside',
        'fields': {
            'bannerImg': {
                'S': '500x500',
                'M': '700x700',
                'L': '1000x1000',
                'FB': '600x315'
            },
            'bannerImgMb': {
                'S': '500x500',
                'M': '700x700',
                'L': '1000x1000',
                'FB': '600x315'
            },
        },
        'fieldTrans': {
            'metaImage': {
                'FB': '600x314',
            },
        }
    };
};

PageSchema.methods.fieldTranslations = function (): any {
    return {
        'name': true,
        'content': false,
        'metaImage': false,
        'metaDescription': false,
        'metaKeyword': false,
    };
};

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { MultiLanguageContentProp } from '../utils/multiLanguageProp';
import { ObjectVaccinations } from './objectVaccination.schemas';

@Schema({
    timestamps: true,
    collection: 'objectPosts'
})
export class ObjectPosts extends Document {
    
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
        trim: true,
        default: null,
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
        index: true,
        default: null,
        type: SchemaTypes.ObjectId,
        ref: ObjectVaccinations.name
    })
    objectVaccinationId: Object;

    @Prop({
        required: true,
        default: true,
    })
    active: boolean;

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

export const ObjectPostsSchema = SchemaFactory.createForClass(ObjectPosts);

ObjectPostsSchema.methods.fieldTranslations = function (): any {
    return {
        'title': true,
        'description': true,
    };
};

ObjectPostsSchema.methods.thumbnail = function (field: string, type: string): object {
    return {
        'collection': 'objectPosts',
        'method': 'inside',
        'fields': {
            'metaImage': {
                'FB': '600x315'
            },
            'banner': {
                'S': '500x500',
                'M': '700x700',
                'L': '1000x1000',
                'FB': '600x315'
            }
        }
    };
};

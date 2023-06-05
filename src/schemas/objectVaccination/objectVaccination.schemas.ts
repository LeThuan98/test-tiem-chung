import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({
    timestamps: true,
    collection: 'objectVaccinations'
})
export class ObjectVaccinations extends Document {
    @Prop({
        required: true
    })
    name: string;

    @Prop({
        required: true
    })
    slug: string;

    @Prop()
    shortDescription: string;

    @Prop({
        index: true,
        default: null,
        type: SchemaTypes.ObjectId,
        ref: ObjectVaccinations.name
    })
    isParent: string;

    @Prop({
        required: false,
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

export const ObjectVaccinationsSchema = SchemaFactory.createForClass(ObjectVaccinations);


ObjectVaccinationsSchema.methods.thumbnail = function (field: string, type: string): object {
    return {
        'collection': 'objectVaccinations',
        'method': 'inside',
        'fields': {
            'metaImage': {
                'S': '500x500',
                'M': '700x700',
                'L': '1000x1000',
                'FB': '600x315'
            }
        }
    };
};
ObjectVaccinationsSchema.post('save', function(error, doc, next) {
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
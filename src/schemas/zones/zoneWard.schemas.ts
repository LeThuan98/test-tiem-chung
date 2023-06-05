import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { MultiLanguageProp } from '../utils/multiLanguageProp';
import { ZoneDistrict } from '@schemas/zones/zoneDistrict.schemas';

@Schema({
    timestamps: true,
    collection: 'zoneWards'
})
export class ZoneWard extends Document {
    @Prop({
        nullable: true,
        trim: true,
    })
    normalId: number;

    @Prop({
        index: true,
        type: SchemaTypes.ObjectId,
        ref: ZoneDistrict.name,
    })
    zoneDistrict: any;

    @Prop({
        nullable: true,
        trim: true,
    })
    code: string;

    @Prop({
        required: true,
        default: true,
    })
    active: boolean;

    @Prop(MultiLanguageProp)
    name: object;

    @Prop({
        nullable: true,
        default: null,
    })
    lat: number;

    @Prop({
        nullable: true,
        default: null,
    })
    lng: number;

    @Prop({
        required: true,
        default: 0,
    })
    sortOrder: number;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const ZoneWardSchema = SchemaFactory.createForClass(ZoneWard);

ZoneWardSchema.methods.fieldTranslations = function (): any {
    return {
        'name': true,
    };
};
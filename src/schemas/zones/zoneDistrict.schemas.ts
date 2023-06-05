import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { MultiLanguageProp } from '../utils/multiLanguageProp';
import { ZoneProvince } from '@schemas/zones/zoneProvince.schemas';

@Schema({
    timestamps: true,
    collection: 'zoneDistricts'
})
export class ZoneDistrict extends Document {
    @Prop({
        nullable: true,
        trim: true,
    })
    normalId: number;
    
    @Prop({
        index: true,
        type: SchemaTypes.ObjectId,
        ref: ZoneProvince.name,
    })
    zoneProvince: any;

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

export const ZoneDistrictSchema = SchemaFactory.createForClass(ZoneDistrict);

ZoneDistrictSchema.methods.fieldTranslations = function (): any {
    return {
        'name': true,
    };
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MultiLanguageProp } from '../utils/multiLanguageProp';

@Schema({
    timestamps: true,
    collection: 'zoneProvinces'
})
export class ZoneProvince extends Document {
    @Prop({
        nullable: true,
        trim: true,
    })
    normalId: number;

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

export const ZoneProvinceSchema = SchemaFactory.createForClass(ZoneProvince);

ZoneProvinceSchema.methods.fieldTranslations = function (): any {
    return {
        'name': true,
    };
};
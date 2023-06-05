import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { MultiLanguageContentProp, MultiLanguageProp, MultiLanguageSlugProp } from '@schemas/utils/multiLanguageProp';
import { ObjectVaccinations } from '../objectVaccination/objectVaccination.schemas';

@Schema({
    timestamps: true,
    collection: 'vaxSchedules'
})
export class VaxSchedule extends Document {

    @Prop({
        index: true,
        default: null,
        type: SchemaTypes.ObjectId,
        ref: ObjectVaccinations.name
    })
    objectVaccinationId: Object;

    @Prop({
        required: false
    })
    name: string;

    @Prop({
        required: false
    })
    slug: string;

    @Prop()
    shortDescription: string;

    @Prop({
        required: false,
        default: 0,
    })
    sortOrder: number;

    @Prop({
        required: false,
        trim: true,
    })
    tableLabel1: string;

	@Prop([
		{
			vaxDate: { default: "", type: String},
			lao: { default: 2, type: Number },
            laoName: { default: "No", type: String},
            laoChecked: { default: false, type: Boolean},
            laoNote: { default: "", type: String},
			sieuvib: { default: 2, type: Number },
            sieuvibName: { default: "No", type: String},
            sieuvibChecked: { default: false, type: Boolean},
            sieuvibNote: { default: "", type: String},
			hib: { default: 2, type: Number },
            hibName: { default: "No", type: String},
            hibChecked: { default: false, type: Boolean},
            hibNote: { default: "", type: String},
			rota: { default: 2, type: Number },
            rotaName: { default: "No", type: String},
            rotaChecked: { default: false, type: Boolean},
            rotaNote: { default: "", type: String},
			cum: { default: 2, type: Number },
            cumName: { default: "No", type: String},
            cumChecked: { default: false, type: Boolean},
            cumNote: { default: "", type: String},
			thuydau: { default: 2, type: Number },
            thuydauName: { default: "No", type: String},
            thuydauChecked: { default: false, type: Boolean},
            thuydauNote: { default: "", type: String},
			soi: { default: 2, type: Number },
            soiName: { default: "No", type: String},
            soiChecked: { default: false, type: Boolean},
            soiNote: { default: "", type: String},
			rubella: { default: 2, type: Number },
            rubellaName: { default: "No", type: String},
            rubellaChecked: { default: false, type: Boolean},
            rubellaNote: { default: "", type: String},
			naonhat: { default: 2, type: Number },
            naonhatName: { default: "No", type: String},
            naonhatChecked: { default: false, type: Boolean},
            naonhatNote: { default: "", type: String},
			sieuvia: { default: 2, type: Number },
            sieuviaName: { default: "No", type: String},
            sieuviaChecked: { default: false, type: Boolean},
            sieuviaNote: { default: "", type: String},
			dai: { default: 2, type: Number },
            daiName: { default: "No", type: String},
            daiChecked: { default: false, type: Boolean},
            daiNote: { default: "", type: String},
			naomocau: { default: 2, type: Number },
            naomocauName: { default: "No", type: String},
            naomocauChecked: { default: false, type: Boolean},
            naomocauNote: { default: "", type: String},
			createdAt: { type: Date, default: Date.now},
		},
	])
	table1: any[];

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

export const VaxScheduleSchema = SchemaFactory.createForClass(VaxSchedule);

VaxScheduleSchema.methods.thumbnail = function (field: string, type: string): object {
    return {
        'collection': 'vaxSchedules',
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

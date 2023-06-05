import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema, SchemaTypes } from 'mongoose';
import { Customer } from '../customer/customer.schemas';
import { ObjectVaccinations } from '../objectVaccination/objectVaccination.schemas';

@Schema({
    timestamps: true,
    collection: 'vaccinationRecords',
})
export class VaccinationRecord extends Document implements TimestampInterface {

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: Customer.name,
        required: true
    })
    customer: MongooseSchema.Types.ObjectId;

    @Prop({
        required: true,
        trim: true,
    })
    name: string;   

    @Prop({
        required: false
    })
    nameNon: string;

    @Prop({
        index: true,
        default: null,
        type: SchemaTypes.ObjectId,
        ref: ObjectVaccinations.name
    })
    objectVaccinationId: Object; 

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
        trim: true,
    })
    relationship: string;   
    
    @Prop()
    gender: string;   

    @Prop({
        required: true,
    })
    dateOfBirth: Date

    @Prop({
        trim: true,
        required: false,
    })
    address: string;    

    @Prop({
        trim: true,
        required: false,
    })
    province: string;    

    @Prop({
        trim: true,
        required: false,
    })
    district: string;

    @Prop({
        default: null,
    })
    deletedAt: Date;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const VaccinationRecordSchema = SchemaFactory.createForClass(VaccinationRecord);

// PageSchema.methods.thumbnail = function (): any {
//     return {
//         collection: 'pages',
//         method: 'inside',
//         fields: {
//             metaImage: {},
//         },
//     };
// };

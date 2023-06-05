import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Customer } from '../customer/customer.schemas';

@Schema({
    timestamps: true,
    collection: 'asks',
})
export class Ask extends Document implements TimestampInterface {

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: Customer.name,
        required: false
    })
    customer: MongooseSchema.Types.ObjectId;

    @Prop({
        required: false,
        trim: true,
    })
    content: string;   

    @Prop({
        required: true,
        trim: true,
    })
    question: string;   

    @Prop({
        required: false
    })
    questionNon: string;

    @Prop({
        required: false
    })
    contentNon: string;

    @Prop({
        default: null,
    })
    deletedAt: Date;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const AskSchema = SchemaFactory.createForClass(Ask);

// PageSchema.methods.thumbnail = function (): any {
//     return {
//         collection: 'pages',
//         method: 'inside',
//         fields: {
//             metaImage: {},
//         },
//     };
// };

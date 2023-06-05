import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Customer } from '../customer/customer.schemas';

@Schema({
    timestamps: true,
    collection: 'questions',
})
export class Question extends Document implements TimestampInterface {

    @Prop({
        required: true,
        trim: true,
    })
    content: string;   

    @Prop({
        required: false,
    })
    contentNon: string;   

    @Prop([
        {
            value: {type: String, required: true},
        }
    ])
    answer: Array<object>;

    @Prop({
        default: null,
    })
    deletedAt: Date;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

// PageSchema.methods.thumbnail = function (): any {
//     return {
//         collection: 'pages',
//         method: 'inside',
//         fields: {
//             metaImage: {},
//         },
//     };
// };

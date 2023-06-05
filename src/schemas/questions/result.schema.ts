import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({
    timestamps: true,
    collection: 'results',
})
export class Result extends Document implements TimestampInterface {

    @Prop({
        required: true,
        trim: true,
    })
    mostAnswered: string; 

    @Prop({
        required: true,
        trim: true,
    })
    content: string;   

    @Prop({
        required: false,
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

export const ResultSchema = SchemaFactory.createForClass(Result);

// PageSchema.methods.thumbnail = function (): any {
//     return {
//         collection: 'pages',
//         method: 'inside',
//         fields: {
//             metaImage: {},
//         },
//     };
// };

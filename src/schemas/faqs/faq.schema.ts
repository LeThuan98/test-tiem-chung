import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({
    timestamps: true,
    collection: 'faqs',
})
export class Faq extends Document implements TimestampInterface {
    @Prop({
        required: true,
        trim: true,
    })
    title: string;   

    @Prop()
    titleNon: string;
    
    @Prop({
        required: true,
        trim: true,
    })
    content: string;   

    @Prop()
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

export const FaqSchema = SchemaFactory.createForClass(Faq);


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthTypeEnum } from '@src/core/constants/customer.enum';
import { Document, SchemaTypes } from 'mongoose';
@Schema({
    timestamps: true,
    collection: 'customers',
})
export class Customer extends Document implements TimestampInterface {

    @Prop({
        trim: true,
        required: false,
    })
    profileImage: string;

    @Prop({
        required: false,
    })
    gender: string;

    @Prop({
        required: false,
        trim: true,
    })
    username: string;

    @Prop({
        required: false,
        trim: true,
    })
    name: string;

    @Prop()
    nameNon: string;

    @Prop({
        type: SchemaTypes.Mixed,
        google: {
            id: { type: String, default: null },
            name: { type: String, default: null },
            email: { type: String, default: null },
        },
        facebook: {
            id: { type: String, default: null },
            name: { type: String, default: null },
            email: { type: String, default: null },
        }
    })
    social: Object;

    @Prop({
        required: false,
        trim: true,
    })
    email: string;

    @Prop({
        required: false,
        trim: true,
    })
    phone: string;

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
        trim: true,
    })
    password: string;

    @Prop({
        required: true,
        default: true,
    })
    active: boolean;

    @Prop({
        required: false,
    })
    token: string;

    @Prop({
        required: false,
    })
    refreshToken: string;

    @Prop({
        required: false,
        default: null
    })
    dateOfBirth: Date;

    @Prop({
        default: null
    })
    lastLogin: Date;

    @Prop({
        default: null,
    })
    deletedAt: Date;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.methods.thumbnail = function (): any {
    return {
        collection: 'users',
        method: 'inside',
        fields: {
            profileImage: {},
        },
    };
};
CustomerSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};
// CustomerSchema.post('save', function (error, doc, next) {
//     if (error.name === 'MongoError' && error.code === 11000) {
//         let fieldName = error.errmsg.substring(
//             error.errmsg.indexOf('index: ') + 7,
//             error.errmsg.indexOf('_1'),
//         );
//         let msg = '';
//         if (fieldName == 'email') {
//             msg = 'Email đã được đăng ký';
//         }
//         next(new Error(msg));
//     } else {
//         next(error);
//     }
// });

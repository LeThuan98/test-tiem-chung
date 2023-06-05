import { Injectable, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '@schemas/customer/customer.schemas';
import { GuardEnum } from '@core/constants/guard.enum';
import { FastJwtService } from '@core/services/fastJwt.service';
import { HelperService } from '@core/services/helper.service';
import { CustomerService } from '@common/customer/services/customer.service';
import { TokenBlacklist } from '@schemas/user/tokenBlacklist.schema';
import { AuthTypeEnum } from '@core/constants/customer.enum';
import { DateTime } from '@core/constants/dateTime.enum';
import { FbGraphService } from '@core/services/fbGraph.service';
import { GoogleApiService } from '@core/services/googleApi.service';
const moment = require('moment');
import { ConfigService } from '@nestjs/config';
import { convertContentFileDto, saveThumbOrPhotos } from '@core/helpers/content';

@Injectable()
export class CustomerAuthService {
    private readonly statusCode: number;
    constructor(
        @InjectModel(TokenBlacklist.name) private tokenBlacklist: Model<TokenBlacklist>,
        @InjectModel(Customer.name) private customer: Model<Customer>,
        private customerService: CustomerService,
        private helperService: HelperService,
        private fastJwtService: FastJwtService,
        private readonly configService: ConfigService,
        private readonly fbGraphService: FbGraphService,
        private readonly googleApiService: GoogleApiService,
    ) {
        this.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    }

    async login(data: Object): Promise<any> {
        let username = data['username'];
        let password = data['password'];
        let item = await this.customerService.findOne({username: username, active: true});
        if(!item) return false;
        if(!item.password){
            return {login: false, isNew: true}
        }
        let processes = await Promise.all([
            this.helperService.compareHash(password, item.password),
            this.signToken(item),
            this.signRefreshToken(item),
        ]);
        if(!processes[0]) return false;
        let token           = processes[1];
        let refreshToken    = processes[2];
        item.lastLogin = new Date;
        item = await item.save();
        return {customer: item, token, refreshToken};
    }

    async loginSocial(query: Record<string, any>, data: {
        accessToken: string,
    }, social: string): Promise<any> {
        let authType;
        let socialRes;
        if(social == 'facebook') authType = AuthTypeEnum.FACEBOOK;
        if(social == 'google') authType = AuthTypeEnum.GOOGLE;
        if(!authType) return this.helperService.throwException('Sai hệ thống!', this.statusCode);
        
        if(authType == AuthTypeEnum.FACEBOOK) socialRes = await this.fbGraphService.getProfile(data.accessToken);
        if(authType == AuthTypeEnum.GOOGLE) socialRes = await this.googleApiService.getProfile(data.accessToken);

        if(!socialRes.status) return this.helperService.throwException('Không thể đăng nhập!', this.statusCode);
        let socialProfile = socialRes.data;
        let existAccount;
        
        if(authType == AuthTypeEnum.FACEBOOK){
            existAccount = await this.customer.findOne({ 'social.facebook.id': socialProfile.id });
        }else if(authType == AuthTypeEnum.GOOGLE){
            existAccount = await this.customer.findOne({ 'social.google.id': socialProfile.id });
        }

        if(existAccount && (!existAccount.active || existAccount.deletedAt)) return this.helperService.throwException('Tài khoản đã bị khóa!', this.statusCode);
        
        if(existAccount) {
            let processes = await Promise.all([
                this.signToken(existAccount),
                this.signRefreshToken(existAccount),
            ]);
            let token           = processes[0];
            let refreshToken    = processes[1];
            existAccount.lastLogin = new Date;
            existAccount.token = token;
            existAccount.refreshToken = refreshToken;
            existAccount.save();
            if(!existAccount.password){
                return {customer: existAccount, token: token, refreshToken, isNew: true};
            } else {
                return {customer: existAccount, token: token, refreshToken, isNew: false};
            }
        }

        let socialInfo = {};
        socialInfo[social] = {
            id: socialProfile.id,
            name: socialProfile.name,
            email: socialProfile.email,
        };
        
        let customer = await new this.customer({
            name: socialProfile.name,
            uid: socialProfile.id,
            email: socialProfile.email,
            social: socialInfo,
            profileImage: socialProfile.picture ? socialProfile.picture : null
        }).save();
        if(!customer) return this.helperService.throwException('Không thể đăng ký tài khoản mới!', this.statusCode);
        //
        let processes = await Promise.all([
            this.signToken(customer),
            this.signRefreshToken(customer),
        ]);
        let token           = processes[0];
        let refreshToken    = processes[1];
        customer.lastLogin = new Date;
        customer.token = token;
        customer.refreshToken = refreshToken;
        customer = await customer.save();
        return {customer, token: token, refreshToken, isNew: false};
    }

    async registry(data: Object): Promise<any> {
        let item = await this.customerService.create(data, null);
        if(!item.status) return item
        let processes   = await Promise.all([
            this.signToken(item.data),
            this.signRefreshToken(item.data),
        ]);
        let token           = processes[0];
        let refreshToken    = processes[1];
        item.data.token = token;
        item.data.refreshToken = refreshToken;
        return item;
    }
    
    async logout(data: {token: string, guard: string, expireAt: string, refreshToken: string}): Promise<any> {
        let refreshToken = data.refreshToken;
        let payload = await this.fastJwtService.verifyToken(refreshToken, GuardEnum.CUSTOMER, {
            ttl: parseInt(process.env.JWT_CUSTOMER_TTL),
            key: process.env.JWT_CUSTOMER_SECRET,
            algorithm: process.env.JWT_CUSTOMER_ALGORITHM,  
        });
        return await Promise.all([
            new this.tokenBlacklist({token: refreshToken, guard: GuardEnum.CUSTOMER, expireAt: payload.expireAt}).save(),
            new this.tokenBlacklist({token: data.token, guard: GuardEnum.CUSTOMER, expireAt: data.expireAt}).save(),
        ]);
    }
    async verifyToken(token: string): Promise<any> {
        let processes = await Promise.all([
            this.tokenBlacklist.findOne({ token: token, guard: GuardEnum.CUSTOMER }),
            this.fastJwtService.verifyToken(token, GuardEnum.CUSTOMER, {
                ttl: Number(this.configService.get('jwtCustomer.options.ttl')),
                key: this.configService.get('jwtCustomer.secretKey'),
                algorithm: this.configService.get('jwtCustomer.options.algorithm'),
            }),
        ]);
        let tokenBlacklist = processes[0];
        let payload = processes[1];
        if (tokenBlacklist)
            return this.helperService.throwException('Token is in-valid', HttpStatus.FORBIDDEN);
        let customer = await this.customerService.findOne({ _id: payload.id });
        if (!customer)
            return this.helperService.throwException('Token is in-valid', HttpStatus.FORBIDDEN);
        return { customer, payload };
    }

    // private async signToken(id): Promise<any> {
    //     let expireAtArr = this.configService.get('jwtCustomer.options.expiresIn').split(/(\d+)/).filter(Boolean);
    //     let expireAt = this.helperService.addDateTime(expireAtArr[0], expireAtArr[1]);
    //     let token = await this.fastJwtService.signToken(
    //         {
    //             guard: GuardEnum.CUSTOMER,
    //             id,
    //             expireAt: expireAt,
    //         },
    //         {
    //             ttl: Number(this.configService.get('jwtCustomer.options.ttl')),
    //             key: this.configService.get('jwtCustomer.secretKey'),
    //             algorithm: this.configService.get('jwtCustomer.options.algorithm'),
    //         },
    //     );
    //     return token;
    // }
    async signToken(customer: Customer | {_id: string}): Promise<any>  {
        let expireAtArr = process.env.JWT_CUSTOMER_EXPIRE.split(/(\d+)/).filter(Boolean);
        let expireAt    = this.helperService.addDateTime(expireAtArr[0], expireAtArr[1]);
        let token       = await this.fastJwtService.signToken({
            guard: GuardEnum.CUSTOMER,
            id: customer._id,
            expireAt: expireAt,
        }, {
            ttl: Number(this.configService.get('jwtCustomer.options.ttl')),
                key: this.configService.get('jwtCustomer.secretKey'),
                algorithm: this.configService.get('jwtCustomer.options.algorithm'),
        });
        return token;
    }
    async refreshToken(data: Object): Promise<any> {
        let refreshToken    = data['refreshToken'];
        let payload         = await this.fastJwtService.verifyToken(refreshToken, GuardEnum.CUSTOMER, {
            ttl: 604800000,
            key: this.configService.get('jwtCustomer.secretKey'),
            algorithm: this.configService.get('jwtCustomer.options.algorithm'),  
        }, this.statusCode);
        let processes       = await Promise.all([
            this.customer.findOne({_id: payload.id, active: true, deletedAt: null}, {}).lean(),
            this.signToken({_id: payload.id}),
            this.signRefreshToken({_id: payload.id}),
            this.existInBlacklist({ token: refreshToken, guard: GuardEnum.CUSTOMER })
        ]);
        let customer    = processes[0];
        let token       = processes[1];
        let blackList   = processes[3];
        if(!customer || blackList) return this.helperService.throwException('Thất bại', this.statusCode);
        await new this.tokenBlacklist({token: refreshToken, guard: GuardEnum.CUSTOMER, expireAt: payload.expireAt}).save();
        refreshToken    = processes[2];
        return {token, refreshToken: refreshToken};
    }
    async signRefreshToken(customer: Customer | {_id: string}): Promise<any> {
        let expireAt    = moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss');
        return await this.fastJwtService.signToken({
            id: customer._id,
            guard: GuardEnum.CUSTOMER,
            expireAt: expireAt,
        }, {
            ttl: 604800000,
            key: this.configService.get('jwtCustomer.secretKey'),
            algorithm: this.configService.get('jwtCustomer.options.algorithm'),
        });
    }
    async existInBlacklist(query: Record<string, any>): Promise<TokenBlacklist> {
        return this.tokenBlacklist.findOne(query);
    }
    async updateProfile(id: string, data: Object, files: Record<any, any>): Promise<any> {
        await convertContentFileDto(data, files, ['profileImage']);
        let customer = await this.customer.findByIdAndUpdate(id, data, { returnOriginal: false });
        let processes = await Promise.all([
            this.signToken(customer),
            this.signRefreshToken(customer),
        ]);
        let token           = processes[0];
        let refreshToken    = processes[1];
        customer.lastLogin  = new Date;
        customer.token  = token;
        customer.refreshToken  = refreshToken;
        customer.save();
        if (customer) await saveThumbOrPhotos(customer);
        return customer;
    }

    async linkFacebook(id: string, data: Object): Promise<any> {
        let socialRes = await this.fbGraphService.getProfile(data['accessToken']);
        let socialProfile = socialRes.data;
        let existAccount = await this.customer.findOne({ 'social.facebook.id': socialProfile.id });
        if(existAccount) return this.helperService.throwException('Facebook đã được link đến tài khoản khác!', this.statusCode)
        let socialInfo = {};
        socialInfo['facebook'] = {
            id: socialProfile.id,
            name: socialProfile.name,
            email: socialProfile.email,
        };
        return await this.customer.findByIdAndUpdate(id, {
            social: socialInfo,
            profileImage: socialProfile.picture ? socialProfile.picture : null,
        }, { returnOriginal: false })
    }
    async linkGoogle(id: string, data: Object): Promise<any> {
        let socialRes = await this.googleApiService.getProfile(data['accessToken']);
        let socialProfile = socialRes.data;
        let socialInfo = {};
        let existAccount = await this.customer.findOne({ 'social.google.id': socialProfile.id });
        if(existAccount) return this.helperService.throwException('Google đã được link đến tài khoản khác!', this.statusCode);
        socialInfo['google'] = {
            id: socialProfile.id,
            name: socialProfile.name,
            email: socialProfile.email,
        };
        return await this.customer.findByIdAndUpdate(id, {
            social: socialInfo,
            profileImage: socialProfile.picture ? socialProfile.picture : null,
        }, { returnOriginal: false })
    }
    async getProfile(id: string): Promise<any> {
        return this.customerService.findOne({ _id: id, active: true, });
    }
}

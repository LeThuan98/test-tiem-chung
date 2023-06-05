import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { REQUEST } from '@nestjs/core';
var qs = require('qs');
@Injectable()
export class GoogleApiService {
    constructor(
        private httpService: HttpService,
        @Inject(REQUEST) private request: any
    ) {}

    async getProfile(accessToken: string, fields: string = 'id,name,email'): Promise<{
        status: boolean,
        data?: { id: string, name: string, email: string, picture: string }
    }> {
        return await this.httpService.request({
            url: `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
            method: 'GET',
            maxRedirects: 1,
            timeout: 5000,

        }).toPromise().then((res) => {
            let data = res.data;
            return {
                status: true,
                data: {
                    id: data['sub'],
                    name: data['name'],
                    email: data['email'],
                    picture: data['picture'],
                }
            }

        }).catch((err) => {
            return { status: false };
        });
    }

    async verifyCapcha(reCaptchaCode: string): Promise<{status: boolean}> {
        return await this.httpService.request({
            url: `https://www.google.com/recaptcha/api/siteverify`,
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            },
            data: qs.stringify({
                secret: `${process.env.RECAPTCHA_SECRET_KEY}`,
                response: `${reCaptchaCode}`,
            }),
            maxRedirects: 1,
            timeout: 5000,

        }).toPromise().then((res) => {
            let data = res.data;
            let status = typeof data['success'] != 'undefined' && data['success'] == true ? true : false;
            return {status};
        }).catch((err) => {
            return { status: false };
        });
    }

    async findLatLngByAddress(accessToken: string, address: string): Promise<{
        status: boolean,
        data?: { formatted_address: string, name?: string, placeId: string, geometry: Object, addressComponents: Array<Object>, openingHours?: Object}
    }> {
        let urlEncode = encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?address='${address}'&key=${accessToken}`)      
        return await this.httpService.request({
            url: urlEncode,
            method: 'GET',
            maxRedirects: 1,
            timeout: 5000,
        }).toPromise().then((res) => {
            let data = res.data.results[0];
            return {
                status: true,
                data: {
                    formatted_address: data.formatted_address,
                    placeId:data.place_id,
                    geometry: data.geometry,
                    addressComponents: data.address_components,
                }
            }
        }).catch((err) => {                 
            return { status: false };
        });
    }

    async findPlacesByName(accessToken: string, name: string): Promise<{
        status: boolean,
        data?: { formattedAddress: string, name: string, place_id: string, location: Object, addressComponents: Array<Object>, rating: string, openingHours: Object}
    }> {
        let urlEncode = encodeURI(`https://maps.googleapis.com/maps/api/place/textsearch/json?fields=photos,formatted_address,name,rating,opening_hours,geometry,place_id&key=${accessToken}&query=${name}`)       
        return await this.httpService.request({
            url: urlEncode,
            method: 'GET',
            maxRedirects: 1,
            timeout: 5000,
        }).toPromise().then((res) => {
            let data = res.data.results;
            return {
                status: true,
                data: data,
            }
        }).catch((err) => {
            return { status: false };
        });
    }

    async findPlacesById(accessToken: string, placeId: string): Promise<any> {
        let url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,formatted_address,name,rating,opening_hours,geometry,place_id,formatted_phone_number,international_phone_number&key=${accessToken}`              
        return await this.httpService.request({
            url: url,
            method: 'GET',
            maxRedirects: 1,
            timeout: 5000,
        }).toPromise().then((res) => {
            let data = res.data.result;            
            return {
                status: true,
                data: data,
            }
        }).catch((err) => {
            return { status: false };
        });
    }
}
import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty, isIn, isNumber } from 'class-validator';
import { ZoneDistrict } from "@schemas/zones/zoneDistrict.schemas";
const moment = require('moment');
@Injectable()
export class ZoneDistrictService {
    private locale;

    constructor(
        @InjectModel(ZoneDistrict.name) private zoneDistrict: PaginateModel<ZoneDistrict>,
        @Inject(REQUEST) private request: any,
    ) {
        this.locale = this.request.locale == 'vi' ? 'viNon' : this.request.locale;
    }

    async totalZoneDistrict(): Promise<any> {
        return this.zoneDistrict.countDocuments();
    }

    async totalInActiveZoneDistrict(): Promise<any> {
        return this.zoneDistrict.countDocuments({active: false});
    }

    async findAll(query: Record<string, any>): Promise<any> {
        let conditions = {};
        let sort = Object();
        query.orderBy = [
            'name'
        ].indexOf(query.orderBy) != -1 ? `${query.orderBy}.${this.locale}` : query.orderBy;
        sort[query.orderBy] = query.order;

        let projection = {};
    
        if (isNotEmpty(query.selects)) {
            query.selects.split(',').forEach(select => {
                projection[select] = 1;
            });
        }

        if (isNotEmpty(query.zoneProvince)) {
            conditions['zoneProvince'] = query.zoneProvince;
        }

        if (isIn(query['active'], ['true', 'false', true, false])) {
            conditions['active'] = query['active'];
        }

        if (isNotEmpty(query.idNotIn)) {
            conditions['_id'] = {
                $nin: query.idNotIn
            };
        }

        if (isNotEmpty(query.idIn)) {
            conditions['_id'] = {
                $in: query.idIn
            };
        }

        if (isNotEmpty(query.createdFrom) || isNotEmpty(query.createdTo)) {
            let createdFrom = moment(query.createdFrom || '1000-01-01').startOf('day');
            let createdTo = moment(query.createdTo || '3000-01-01').endOf('day');
            conditions[`createdAt`] = {
                $gte: createdFrom,
                $lte: createdTo,
            };
        }

        if(isNotEmpty(query.get)) { 
            let get = parseInt(query.get);
            let result = this.zoneDistrict.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.zoneDistrict.paginate(conditions, {
                select: projection,
                page: query.page,
                limit: query.limit,
                sort: sort,
            });
        }
    }

    async findAllFrontend(query: Record<string, any>): Promise<any> {
        let conditions = {};
        let sort = Object();
        query.orderBy = [
            'name'
        ].indexOf(query.orderBy) != -1 ? `${query.orderBy}.${this.locale}` : query.orderBy;
        sort[query.orderBy] = query.order;

        conditions['active'] = true;

        let projection = {};
    
        if (isNotEmpty(query.selects)) {
            query.selects.split(',').forEach(select => {
                projection[select] = 1;
            });
        }

        if (isNotEmpty(query.zoneProvince)) {
            conditions['zoneProvince'] = query.zoneProvince;
        }

        if (isNotEmpty(query.idNotIn)) {
            conditions['_id'] = {
                $nin: query.idNotIn
            };
        }

        if (isNotEmpty(query.idIn)) {
            conditions['_id'] = {
                $in: query.idIn
            };
        }

        if (isNotEmpty(query.createdFrom) || isNotEmpty(query.createdTo)) {
            let createdFrom = moment(query.createdFrom || '1000-01-01').startOf('day');
            let createdTo = moment(query.createdTo || '3000-01-01').endOf('day');
            conditions[`createdAt`] = {
                $gte: createdFrom,
                $lte: createdTo,
            };
        }

        if(isNotEmpty(query.get)) { 
            let get = parseInt(query.get);
            let result = this.zoneDistrict.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.zoneDistrict.paginate(conditions, {
                select: projection,
                page: query.page || 1,
                limit: query.limit || 50,
                sort: sort,
            });
        }
    }

    async findByConditions(conditions: {}): Promise<ZoneDistrict> {
        return this.zoneDistrict.findOne(conditions).exec();
    }

    async findById(id: string): Promise<ZoneDistrict> {
        return this.zoneDistrict.findById(id).exec();
    }

    async findByNormalId(normalId: number): Promise<ZoneDistrict> {
        return this.zoneDistrict.findOne({
            normalId
        }).exec();
    }

    async findByIdFrontend(id: string): Promise<ZoneDistrict> {
        return this.zoneDistrict.findOne({
            _id: id,
            active: true
        }).exec();
    }

    async create(data: Object): Promise<ZoneDistrict> {
        let district = await new this.zoneDistrict(data).save();
        return district;
    }

    async update(id: string, data: Object): Promise<any> {
        let district = await this.zoneDistrict.findByIdAndUpdate(id, data, {new: true});
        return district;
    }

    async delete(id: string): Promise<any> {
        let district = await this.zoneDistrict.findByIdAndRemove(id);
        return district;
    }

    async deleteManyById(ids: Array<string>): Promise<any> {
        let districts = await this.zoneDistrict.deleteMany({'_id': {$in: ids}});
        return districts;
    }

    async deleteManyByConditions(query: Record<string, any>): Promise<any> {
        let districts = await this.zoneDistrict.deleteMany(query);
        return districts;
    }
}

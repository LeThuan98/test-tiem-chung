import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty, isIn, isNumber } from 'class-validator';
import { ZoneProvince } from "@schemas/zones/zoneProvince.schemas";
const moment = require('moment');
@Injectable()
export class ZoneProvinceService {
    private locale;
    
    constructor(
        @InjectModel(ZoneProvince.name) private zoneProvince: PaginateModel<ZoneProvince>,
        @Inject(REQUEST) private request: any,
    ) {
        this.locale = this.request.locale == 'vi' ? 'viNon' : this.request.locale;
    }

    async totalZoneProvince(): Promise<any> {
        return this.zoneProvince.countDocuments();
    }

    async totalInActiveZoneProvince(): Promise<any> {
        return this.zoneProvince.countDocuments({active: false});
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
            let result = this.zoneProvince.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.zoneProvince.paginate(conditions, {
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
            let result = this.zoneProvince.find(conditions).sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.zoneProvince.paginate(conditions, {
                select: projection,
                page: query.page || 1,
                limit: query.limit || 50,
                sort: sort,
            });
        }
    }

    async findByCondition(conditions: {}): Promise<ZoneProvince> {
        return this.zoneProvince.findOne(conditions).exec();
    }

    async findById(id: string): Promise<ZoneProvince> {
        return this.zoneProvince.findById(id).exec();
    }

    async findByNormalId(normalId: number): Promise<ZoneProvince> {
        return this.zoneProvince.findOne({
            normalId
        }).exec();
    }

    async findByIdFrontend(id: string): Promise<ZoneProvince> {
        return this.zoneProvince.findOne({
            _id: id,
            active: true
        }).exec();
    }

    async create(data: Object): Promise<ZoneProvince> {
        let province = await new this.zoneProvince(data).save();
        return province;
    }

    async update(id: string, data: Object): Promise<any> {
        let province = await this.zoneProvince.findByIdAndUpdate(id, data, {new: true});
        return province;
    }

    async delete(id: string): Promise<any> {
        let province = await this.zoneProvince.findByIdAndRemove(id);
        return province;
    }

    async deleteManyById(ids: Array<string>): Promise<any> {
        let provinces = await this.zoneProvince.deleteMany({'_id': {$in: ids}});
        return provinces;
    }

    async deleteManyByConditions(query: Record<string, any>): Promise<any> {
        let provinces = await this.zoneProvince.deleteMany(query);
        return provinces;
    }
}

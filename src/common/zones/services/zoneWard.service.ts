import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty, isIn, isNumber } from 'class-validator';
import { ZoneWard } from "@schemas/zones/zoneWard.schemas";
const moment = require('moment');
@Injectable()
export class ZoneWardService {
    private locale;

    constructor(
        @InjectModel(ZoneWard.name) private zoneWard: PaginateModel<ZoneWard>,
        @Inject(REQUEST) private request: any,
    ) {
        this.locale = this.request.locale == 'vi' ? 'viNon' : this.request.locale;
    }

    async totalZoneWard(): Promise<any> {
        return this.zoneWard.countDocuments();
    }

    async totalInActiveZoneWard(): Promise<any> {
        return this.zoneWard.countDocuments({active: false});
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

        if (isNotEmpty(query.zoneDistrict)) {
            conditions['zoneDistrict'] = query.zoneDistrict;
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
            let result = this.zoneWard.find(conditions).populate('zoneDistrict').sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.zoneWard.paginate(conditions, {
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

        if (isNotEmpty(query.zoneDistrict)) {
            conditions['zoneDistrict'] = query.zoneDistrict;
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
            let result = this.zoneWard.find(conditions).populate('zoneDistrict').sort(sort).select(projection);
            return isNaN(get) ? result : result.limit(get);
        } else {
            return this.zoneWard.paginate(conditions, {
                select: projection,
                page: query.page || 1,
                limit: query.limit || 50,
                sort: sort,
            });
        }
    }

    async findById(id: string): Promise<ZoneWard> {
        return this.zoneWard.findById(id).exec();
    }

    async findByNormalId(normalId: number): Promise<ZoneWard> {
        return this.zoneWard.findOne({
            normalId
        }).exec();
    }

    async create(data: Object): Promise<ZoneWard> {
        return new this.zoneWard(data).save();
    }

    async update(id: string, data: Object): Promise<any> {
        return this.zoneWard.findByIdAndUpdate(id, data, {new: true});
    }

    async delete(id: string): Promise<any> {
        return this.zoneWard.findByIdAndRemove(id);
    }

    async deleteManyById(ids: Array<string>): Promise<any> {
        return this.zoneWard.deleteMany({'_id': {$in: ids}});
    }

    async deleteManyByConditions(query: Record<string, any>): Promise<any> {
        return this.zoneWard.deleteMany(query);
    }
}

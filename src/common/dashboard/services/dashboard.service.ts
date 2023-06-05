import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { User } from '@src/schemas/user/user.schemas';
import { Customer } from '@src/schemas/customer/customer.schemas';
import { Activity } from '@src/schemas/activities/activity.schema';
import { Role } from '@src/schemas/role.schemas';

const moment = require('moment');
@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(User.name) private user: PaginateModel<User>,
        @InjectModel(Customer.name) private customer: PaginateModel<Customer>,
        @InjectModel(Activity.name) private activity: PaginateModel<Activity>,
        @InjectModel(Role.name) private role: PaginateModel<Role>,
    ) {}


    async statistical(): Promise<any> {
        let rs = await Promise.all([
            this.customer.countDocuments({deletedAt: null}),
            this.user.countDocuments({deletedAt: null}),
            this.role.countDocuments({deletedAt: null}),
        ]);

        return {
            totalCustomer: rs[0],
            totalUser: rs[1],
            totalRole: rs[2],
        }
    }
}

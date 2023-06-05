import { Job } from 'bull';
import { Processor, Process } from '@nestjs/bull';
import { HelperService } from '@src/core/services/helper.service';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import {sleep} from 'sleep-ts';
import { EmailService } from '@common/email/email.service';
var ObjectID = require("mongodb").ObjectID
@Processor('common')
export class CommonConsumerService {
    constructor(
        private helperService: HelperService,
        private emailService: EmailService,
    ) {}

    @Process('sendAnswer')
    async sendAnswer(job: Job<unknown>): Promise<any> {
        this.emailService.sendMail(job.data.email,'Giải đáp thắc mắc','answer',job.data,false);
    }

    async makeid(length) {
        var result = `${new Date().getTime()}`;
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

}

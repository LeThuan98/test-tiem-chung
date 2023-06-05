import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
@Injectable()
export class CommonProducerService {
    constructor(
        @InjectQueue('common') private commonQueue: Queue,
    ) {}

    async sendAnswer(data: Object): Promise<any> {
        const job = await this.commonQueue.add('sendAnswer', data, {
            priority: 1,
            delay: 1000,
            attempts: 0,
            removeOnComplete: true,
        });
    }
}

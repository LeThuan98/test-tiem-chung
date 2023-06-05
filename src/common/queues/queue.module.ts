import { forwardRef, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SchemasModule } from '@schemas/schemas.module';
import { EmailModule } from '@common/email/email.module';
import { CommonProducerService } from './services/common.producer.service';
import { CommonConsumerService } from './services/common.consumer.service';
@Module({
    imports: [
        SchemasModule,
        EmailModule,
        BullModule.forRootAsync({
            useFactory: () => ({
                redis: {
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT),
                    username: process.env.REDIS_USERNAME,
                    password: process.env.REDIS_PASSWORD,
                    keyPrefix: `queue${process.env.REDIS_PREFIX}`,
                }
            }),
            inject: [],
        }),
        BullModule.registerQueue({ name: 'common' }),
    ],
    controllers: [],
    providers: [
        CommonProducerService, CommonConsumerService
    ],
    exports: [
        CommonProducerService, CommonConsumerService
    ]
})
export class QueueModule {
}



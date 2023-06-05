import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { TransformerCustomerService } from './services/transformerCustomer.service';
import { CustomerService } from './services/customer.service';
import { BeCustomerController } from './admin/beCustomer.controller';
import { FeCustomerController } from './frontend/feCustomer.controller';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';


@Module({
    imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot(),],
    controllers: [BeCustomerController, FeCustomerController],
    providers: [CustomerService, TransformerCustomerService],
    exports: [CustomerService, TransformerCustomerService],
})
export class CustomerModule {}

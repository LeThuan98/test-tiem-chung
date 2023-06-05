import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './common/auth/auth.module';
import { UserModule } from './common/users/user.module';
import { RolesModule } from './common/roles/roles.module';
import { CustomerModule } from './common/customer/customer.module';
import { CoresModule } from './core/core.module';
import { SchemasModule } from './schemas/schemas.module';
import { PageModule } from './common/page/page.module';
import { DashboardModule } from './common/dashboard/dashboard.module';
import { SettingModule } from './common/setting/setting.module';
import { ZoneModule } from './common/zones/zone.module';
import { PostModule } from './common/posts/post.module';
import { RecordModule } from './common/VaccinationRecord/record.module';
import { CustomerAuthModule } from './common/auth/customer/customer.module';
import { QuestionModule } from './common/questions/question.module';
import { AskModule } from './common/ask/ask.module';
import { FaqModule } from './common/faq/faq.module';
import { EmailModule } from './common/email/email.module';
import { ObjectVaccinationModule } from './common/object/objectVaccination.module';
import { ObjectPostModule } from './common/objectPost/objectPost.module';
import { UploadModule } from './common/upload/upload.module';
import { VaxScheduleModule } from './common/vaxSchedule/vaxSchedule.module';
import { DiseaseModule } from './common/disease/disease.module';

@Module({
    imports: [
        CoresModule,
        SchemasModule,
        AuthModule,
        CustomerAuthModule,
        UserModule,
        RolesModule,
        CustomerModule,
        PageModule,
        DashboardModule,
        SettingModule,
        UploadModule,
        ZoneModule,
        PostModule,
        RecordModule,
        QuestionModule,
        AskModule,
        FaqModule,
        EmailModule,
        DiseaseModule,
        ObjectVaccinationModule,
        ObjectPostModule,
        VaxScheduleModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

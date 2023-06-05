import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthModule } from './common/auth/auth.module';
import { UserModule } from './common/users/user.module';
import { RolesModule } from './common/roles/roles.module';
import { CustomerModule } from './common/customer/customer.module';
import { CoresModule } from './core/core.module';
import { UserAuthModule } from './common/auth/user/user.module';
import { DashboardModule } from './common/dashboard/dashboard.module';
import { SettingModule } from './common/setting/setting.module';
import { json, urlencoded } from 'body-parser';
import { PostModule } from './common/posts/post.module';
import { PageModule } from './common/page/page.module';
import { RecordModule } from './common/VaccinationRecord/record.module';
import { CustomerAuthModule } from './common/auth/customer/customer.module';
import { QuestionModule } from './common/questions/question.module';
import { AskModule } from './common/ask/ask.module';
import { FaqModule } from './common/faq/faq.module';
import { ValidationPipe } from '@nestjs/common';
import { ObjectVaccinationModule } from './common/object/objectVaccination.module';
import { ObjectPostModule } from './common/objectPost/objectPost.module';
import { ZoneModule } from './common/zones/zone.module';
import { UploadModule } from './common/upload/upload.module';
import { VaxScheduleModule } from './common/vaxSchedule/vaxSchedule.module';
import { DiseaseModule } from './common/disease/disease.module';
const fs = require('fs');

import { join } from 'path';
const bodyParser = require('body-parser');

// async function bootstrap() {

//     /*
//      * Create folder tmp multer
//      */
//     fs.mkdirSync(process.env.PREFIX_UPLOAD_TMP, { recursive: true });
//     console.log(`Create upload tmp folder: ${process.env.PREFIX_UPLOAD_TMP}`);

//     /*
//      * Init app
//      */
//     const app = await NestFactory.create<NestExpressApplication>(AppModule);
//     const config = app.get(ConfigService);

//     app.useStaticAssets(join(__dirname, '..', 'public'));

//     app.use(bodyParser.json({limit: '50mb'}));
//     app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//     /*
//      * CORS
//      */
//     app.enableCors();

//     /*
//      * Global prefix version
//      */
//     let basePath = process.env.BASE_PATH;
//     if(!basePath) basePath = "/";
//     if(basePath != "/" && basePath.charAt(0) != "/") basePath = "/" + basePath + "/";
//     app.setGlobalPrefix(basePath + 'api/v1');

//     /*
//      * Global pipes transform
//      */
//     app.useGlobalPipes(new ValidationPipe({
//         whitelist: true,
//     }));

//     /*
//      * Proxy
//      */
//     app.set('trust proxy', 1);

//     /*
//      * Swagger configurations
//      */
//     if (process.env.NODE_ENV !== 'production') {
//         basePath = basePath.replace(/^\//g, '');
//         new Swagger(app).setup(basePath);
//     }

//     /*
//      * Start app
//      */
//     await app.listen(process.env.NODE_PORT);
//     console.log(`Application is running on: ${await app.getUrl()}`);
//     if (process.env.NODE_ADMIN_MODE == 'true') {
//         console.log(`
//         ****************************
//         ***** ADMIN MODE IS ON *****
//         ****************************`);
//     }
//     // console.log(true ? 1 && false && true : 3);
//     // console.log(true ? 1 || false || true : 3);
// }

async function bootstrap() {
    fs.mkdirSync(process.env.PREFIX_UPLOAD_TMP, { recursive: true });
    console.log(`Create upload tmp folder: ${process.env.PREFIX_UPLOAD_TMP}`);


    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.get(ConfigService);
    app.enableCors();
    app.use(json({ limit: '100mb' }));
    app.use(urlencoded({ limit: '100mb', extended: true }));
    // app.useGlobalPipes(new ValidationPipe());

    app.useStaticAssets(join(__dirname, '..', 'public'));

    app.useGlobalPipes(new ValidationPipe({
        // whitelist: true,
        skipUndefinedProperties: true,
        skipNullProperties: true,
        skipMissingProperties: true,
    }));

    let basePath = process.env.BASE_PATH;
    if(!basePath) basePath = "/";
    if(basePath != "/" && basePath.charAt(0) != "/") basePath = "/" + basePath + "/";
    app.setGlobalPrefix(basePath + 'api/v1');
    new Swagger(app).setup(basePath);

    if (process.env.NODE_ENV !== 'production') {
        basePath = basePath.replace(/^\//g, '');
        new Swagger(app).setup(basePath);
    }

    console.log('process.env.NODE_PORT---->', process.env.NODE_PORT);
    await app.listen(process.env.NODE_PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

class Swagger {
    constructor(private app: NestExpressApplication) {
    }

    /**
     * Register more swagger api here
     */
    setup(basePath = ""): void {
        // Main API
        this.register(undefined, basePath + 'api');

        // The Lab 2020 API
        // this.register([CustomerModule, CustomerAuthModule], 'api/the-lab-2020', 'The lab 2020 API', null, '1.0');
    }

    register(extraModules?: any[], path?: string, title?: string, description?: string, version?: string): void {
        const mainModules = [
            AppModule,
            AuthModule,
            UserAuthModule,
            CustomerAuthModule,
			UserModule,
            RolesModule,
            RolesModule,
            CustomerModule,
            CoresModule,
            DashboardModule,
            SettingModule,
            UploadModule,
            ZoneModule,
            PostModule,
            PageModule,
            RecordModule,
            QuestionModule,
            AskModule,
            FaqModule,
            ObjectVaccinationModule,
            ObjectPostModule,
            VaxScheduleModule,
            DiseaseModule
        ];
        if (extraModules) {
            mainModules.push(...extraModules);
        }

        const siteTitle = title || 'API Hieu-ve-tiem-chung';
        const options = new DocumentBuilder()
        .setTitle(siteTitle)
        .setDescription('API Hieu-ve-tiem-chung description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

        const document = SwaggerModule.createDocument(this.app, options, {
            include: mainModules,
        });
        SwaggerModule.setup(path || 'api', this.app, document, { customSiteTitle: siteTitle });
    }
}

bootstrap();

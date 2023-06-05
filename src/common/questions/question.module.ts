import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { RolesModule } from '../roles/roles.module';
import { TransformerQuestionService } from './services/transformerQuestion.service';
import { QuestionService } from './services/question.service';
import { QuestionController } from './controllers/question.controller';
import { ActivityModule } from '@common/activities/activity.module';
import { FeQuestionController } from './frontend/feQuestion.controller';
import { BeResultController } from './controllers/beResult.controller';
import { ResultService } from './services/result.service';

@Module({
    imports: [SchemasModule, RolesModule, ActivityModule],
    controllers: [QuestionController, FeQuestionController, BeResultController],
    providers: [QuestionService, ResultService, TransformerQuestionService],
    exports: [QuestionService, ResultService, TransformerQuestionService],
})
export class QuestionModule {}

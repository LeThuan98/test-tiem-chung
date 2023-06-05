import { Module } from '@nestjs/common';
import { BePostCategoryController } from './admin/bePostCategory.controller';
import { BePostController } from './admin/bePost.controller';
import { FePostCategoryController } from './frontend/fePostCategory.controller';
import { FePostController } from './frontend/fePost.controller';
import { PostCategoryService } from './services/postCategory.service';
import { PostService } from './services/post.service';
import { TransformerPostService } from './services/transformerPost.service';
import { SchemasModule } from "@schemas/schemas.module";
import { ActivityModule } from '../activities/activity.module';

@Module({
    imports: [SchemasModule, ActivityModule],
    controllers: [BePostCategoryController, BePostController, FePostCategoryController, FePostController],
    providers: [PostService, PostCategoryService, TransformerPostService],
    exports: [PostService, PostCategoryService, TransformerPostService]
})
export class PostModule {
}

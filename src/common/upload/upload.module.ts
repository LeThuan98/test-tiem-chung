import { Module } from '@nestjs/common';
import { BeFileEditorController } from './admin/beFileEditor.controller';
import { BeFileManagerController } from './admin/beFileManager.controller';
import { FeFileManagerController } from './frontend/FeFileManager.controller';

@Module({
    imports: [],
    controllers: [BeFileManagerController, BeFileEditorController, FeFileManagerController],
    providers: [],
})
export class UploadModule {
}

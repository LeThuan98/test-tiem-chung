import { ACL } from '@common/auth/decorators/acl.decorator';
import * as fileHelper from '@core/helpers/file';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { Permissions } from "@core/services/permission.service";
import {
    Controller,
    Get,
    Query,
    UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Frontend/File Manager')
@Controller('filemanagers')
@UseInterceptors(CoreTransformInterceptor)
export class FeFileManagerController {
    constructor(
    ) {}

    @Get('/get-all-file-urls')
    async findAllHasPrefix(): Promise<any> {
        let fileURLs = await fileHelper.getAllLinkFileDO();
        return {
            status: true,
            data: fileURLs
        }
    }
}

import {
    Body, Controller,
    Get, Post, Put,
    Request, UseInterceptors,
    UploadedFiles, Param,
    Query, HttpStatus,
    Delete,
} from '@nestjs/common';
import { ResponseService } from 'src/core/services/response.service';
import { UserAuthService } from 'src/common/auth/user/services/auth.service';
import { HelperService } from 'src/core/services/helper.service';
import { ACL } from 'src/common/auth/decorators/acl.decorator';
import { Permissions } from 'src/core/services/permission.service';
import { UserSecure } from 'src/common/auth/user/decorators/userSecure.decorator';
import { ApiTags, ApiBody, ApiHeader, ApiParam } from '@nestjs/swagger';
import { ActivityInterceptor } from 'src/core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from 'src/core/interceptors/coreTransform.interceptor';
import { HasFile } from 'src/core/decorators/hasFile.decorator';
import { ObjectPostService } from '../services/objectPost.service';
import { TransformerObjectPostService } from '../services/transformerObjectPost.service';
import { BeObjectPostDto } from '../dto/objectPost.dto';
import { saveFileContent } from '@src/core/helpers/content';

@ApiTags('Frontend/ObjectPost')
@Controller('objectpost')
export class FeObjectPostController {
    constructor(
        private objectPostService: ObjectPostService,
        private response: ResponseService,
        private userAuthService: UserAuthService,
        private helperService: HelperService,
        private transformer: TransformerObjectPostService,
    ) {}

    @ApiParam({ name: 'slug', type: String })
    @Get(':slug')
    async detail(@Param('slug') slug) {
        let page = await this.objectPostService.findBySlugFrontend(slug);
        if (!page) return this.response.detailFail();
        await saveFileContent('content', page, 'objectPosts', false);
        return this.response.detailSuccess( await this.transformer.transformPageDetail(page) );
    }

}

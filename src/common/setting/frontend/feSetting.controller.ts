import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { HelperService } from '@core/services/helper.service';
import { SettingService } from '../services/setting.service';
import { TransformerSettingService } from '../services/transformerSetting.service';
import { ResponseService } from '@core/services/response.service';
import { ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
@ApiTags('Frontend/Setting')
@Controller('setting')
@UseInterceptors(CoreTransformInterceptor)
export class FeSettingController {
    constructor(
        private settingService: SettingService,
        private helperService: HelperService,
        private responseService: ResponseService,
        private transformerSettingService: TransformerSettingService,
    ) {}

    @Get()
    async findAll(): Promise<any> {
        let data = {};
        let items = await this.settingService.findAll();
        return this.responseService.fetchListSuccess(this.transformerSettingService.transformSettingList(items));
    }
}

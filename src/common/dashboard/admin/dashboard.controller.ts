import {
    Controller,
    Get,
    UseInterceptors,
} from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { DashboardService } from '../services/dashboard.service';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { Permissions } from '@core/services/permission.service';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { ApiExcludeController, ApiTags} from '@nestjs/swagger';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';

@ApiTags('Admin/Dashboard')
@Controller('admin/dashboard')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@ApiExcludeController()
export class DashboardController {
    constructor(
        private dashboardService: DashboardService,
        private response: ResponseService,
    ) {}

    @Get()
    @ACL(Permissions.dashboard_list)
    async statistical(): Promise<any> {
        return this.response.detailSuccess(
            {docs: await this.dashboardService.statistical()}
        );
    }
}

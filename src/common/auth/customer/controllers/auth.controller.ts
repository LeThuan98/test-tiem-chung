import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Query,
    Request,
    UseInterceptors,
    UploadedFiles,
    Param,
} from '@nestjs/common';
import { TransformerCustomerService } from '@common/customer/services/transformerCustomer.service';
import { ResponseService } from '@core/services/response.service';
import { Customer } from '@schemas/customer/customer.schemas';
import { LoginDto } from '../dto/login.dto';
import { CustomerAuthService } from '../services/auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CoreResponse } from '@core/interfaces/coreResponse.interface';
import { LoginSocialDto } from '../dto/customer.loginSocial.dto';
import { RefreshTokenDto } from '../dto/refreshToken.dto';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { FeCustomerDto } from '../dto/feCustomer.dto';
import { RegistryDto } from '@src/common/auth/customer/dto/registry.dto';
import { CustomerAuth } from '../decorators/customer.decorator';
import { AccessTokenDto } from '../dto/linkAccount.dto';
@ApiTags('Auth/Customer')
@Controller('auth/customer')
// @UseInterceptors(CoreTransformInterceptor)
export class AuthController {
    constructor(
        private authService: CustomerAuthService,
        private transformer: TransformerCustomerService,
        private response: ResponseService,
    ) {}

    @Post('login')
    async login(@Body() dto: LoginDto): Promise<any> {
        let login = await this.authService.login(dto);
        if(!login) return this.response.credentialFail();
        if(login.isNew) return this.response.credentialFail('Try with Google or Facebook.');
        return this.response.detailSuccess({token: login.token, refreshToken: login.refreshToken});
    };

    @Post('login/:social')
    async loginSocial(@Query() query: Record<string, any>, @Body() dto: LoginSocialDto, @Param('social') social: string): Promise<any> {
        let loginSocial = await this.authService.loginSocial(query, dto, social);
        if(!loginSocial) return this.response.credentialFail();
        return this.response.detailSuccess({token: loginSocial.token, refreshToken: loginSocial.refreshToken, isNew: loginSocial.isNew});
    };

    @Post('register')
    @HasFile()
    async registry(@Body() dto: RegistryDto): Promise<any> {
        let registry = await this.authService.registry(dto);
        if (!registry.status) return this.response.createdFail(registry.message);
        return this.response.createdSuccess({token: registry.data.token, refreshToken: registry.data.refreshToken});
    }

    @Post('logout')
    async logout(@Request() req: Record<string, any>): Promise<any> {
        let header = req.headers.authorization;
        let logout = await this.authService.logout(header);
        if (!logout) return this.response.credentialFail();
        return this.response.detailSuccess();
    }

    @Put('refresh')
    async refreshToken(@Body() dto: RefreshTokenDto): Promise<CoreResponse> {
        let refreshToken = await this.authService.refreshToken(dto)
        if (!refreshToken) return this.response.updatedFail();
        return this.response.detailSuccess({ token: refreshToken.token, refreshToken: refreshToken.refreshToken });
    }

    @Put('profiles')
    @ApiBearerAuth()
    async updateProfile(
        @Body() dto: FeCustomerDto,
        @CustomerAuth() customer: Customer,
        @UploadedFiles() files: Record<any, any>,
    ): Promise<any> {
        try {
            let profile = await this.authService.updateProfile(customer.id,dto,files);
            if (!profile) return this.response.updatedFail();
            return this.response.updatedSuccess(this.transformer.transformCustomerDetail(profile,{token: profile.token, refreshToken: profile.refreshToken}));
        } catch (error) {
            return this.response.updatedFail(error.message);
        }
    }

    @Put('profiles/facebook')
    @ApiBearerAuth()
    async linkFacebookAccount(
        @CustomerAuth() customer: Customer,
        @Body() dto: AccessTokenDto,
    ): Promise<any> {
        try {
            let profile = await this.authService.linkFacebook(customer.id,dto);
            if (!profile) return this.response.updatedFail();
            return this.response.updatedSuccess(this.transformer.transformCustomerDetail(profile));
        } catch (error) {
            return this.response.updatedFail(error.message);
        }
    }

    @Put('profiles/google')
    @ApiBearerAuth()
    async linkGoogleAccount(
        @CustomerAuth() customer: Customer,
        @Body() dto: AccessTokenDto,
    ): Promise<any> {
        try {
            let profile = await this.authService.linkGoogle(customer.id,dto);
            if (!profile) return this.response.updatedFail();
            return this.response.updatedSuccess(this.transformer.transformCustomerDetail(profile));
        } catch (error) {
            return this.response.updatedFail(error.message);
        }
    }

    @Get('profiles')
    @ApiBearerAuth()
    async getProfile(@CustomerAuth() customer: Customer): Promise<any> {
        let profile = await this.authService.getProfile(customer.id);
        if (!profile) return this.response.detailFail();
        return this.response.detailSuccess(this.transformer.transformCustomerDetail(profile));
    }
}

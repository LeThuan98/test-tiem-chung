import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { CustomerAuthService } from "@src/common/auth/customer/services/auth.service";
import { HelperService } from "@core/services/helper.service";
@Injectable()
export class JwtCustomerMiddleware implements NestMiddleware {
    constructor(
        private readonly authService: CustomerAuthService,
        private readonly helperService: HelperService,
    ) {}

    async use(req: Record<string, any>, res: Record<string, any>, next: () => void): Promise<any> {
        let token = req.header('Authorization') ? (req.header('Authorization').split(" "))[1] : null;
        if(!token) token = req.query.token || null;
        if(!token) return this.helperService.throwException('Token is missing', HttpStatus.FORBIDDEN);

        let verify          = await this.authService.verifyToken(token);
        req.customer            = verify.customer;
        req.customer.id         = verify.customer._id.toString();
        req.guardAuth       = verify.payload.guard;
        req.expireAtAuth    = verify.payload.expireAt;
        req.tokenAuth       = token;
        return next();
    }
}

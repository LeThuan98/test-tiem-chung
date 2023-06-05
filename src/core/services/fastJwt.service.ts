import { Injectable, HttpStatus } from '@nestjs/common';
import { HelperService } from './helper.service';
const { createSigner, createVerifier } = require('fast-jwt');
@Injectable()
export class FastJwtService {
    constructor(
        private helperService: HelperService,
    ) {}

    async signToken(data: any, jwt: {
        ttl: Number,
        key: string,
        algorithm: string,
    }): Promise<string> {
        let signSync    = createSigner({ 
            key: jwt.key,
            algorithm: jwt.algorithm,
            expiresIn: jwt.ttl,
        });
        return signSync(data);
    }

    async verifyToken(token: string, guard: string, jwt: {
        ttl: Number,
        key: string,
        algorithm: string,
    }, errorCode: number = HttpStatus.FORBIDDEN): Promise<any> {
        let verifySync  = createVerifier({ 
            key: jwt.key,
            algorithm: jwt.algorithm,
            cache: true,
            cacheTTL: jwt.ttl,
        });
        try {
            let payload     = verifySync(token);
            if (payload.guard !== guard) 
                return this.helperService.throwException('Xin vui lòng đăng nhập lại!', errorCode);
            return payload;
        } catch (error) {
            return this.helperService.throwException('Xin vui lòng đăng nhập lại!', errorCode);
        }
    }
}
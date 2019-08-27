import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
@Injectable()
export class AdminGuard implements CanActivate {
    private verifyToken(request): any {
        let token: any = request.headers.authorization.split(' ')[1];
        return jwt.verify(token, process.env.TOKEN_SECRET);
    }

    private validateRequest(request): boolean {
        let data = this.verifyToken(request);
        if (data.scope == 'admin') {
            return true;
        } else {
            return false;
        }
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
}

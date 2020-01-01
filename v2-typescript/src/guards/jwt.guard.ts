import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import 'dotenv/config';

@Injectable()
export class JWTStrategy implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    validateRequest(request: any): any {
        let token: any = request.headers.authorization ? request.headers.authorization.split(' ')[1] : null;
        let decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        request.user = decoded;
        return true;
    }
}

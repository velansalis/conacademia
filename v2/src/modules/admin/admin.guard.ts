import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminGuard implements CanActivate {
    private getTokenData(request): any {
        let token: any = request.headers.authorization.split(' ');
        token[1] = jwt.verify(token[1], 'supersecret');
        return token;
    }

    private isValidToken(request): boolean {
        if (!request.headers.authorization) return false;
        var data = this.getTokenData(request);
        if (data[0] == 'Bearer' && data[1]) return true;
        else return false;
    }

    private isAdmin(request): boolean {
        var data = this.getTokenData(request);
        if (data[1].scope == 'admin') return true;
        else return false;
    }

    private validateRequest(request): boolean {
        return this.isValidToken(request) && this.isAdmin(request);
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
}

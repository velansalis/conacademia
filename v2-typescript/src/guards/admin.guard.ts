import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    private validateRequest(request): boolean {
        let tokendata = request.user;
        return tokendata.scope == 'admin';
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
}

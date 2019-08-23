import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AdminGuard implements CanActivate {
    private getTokenData;
    private isValidToken;
    private isAdmin;
    private validateRequest;
    canActivate(context: ExecutionContext): boolean;
}

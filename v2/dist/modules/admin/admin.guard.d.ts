import { CanActivate, ExecutionContext } from '@nestjs/common';
import 'dotenv/config';
export declare class AdminGuard implements CanActivate {
    private getTokenData;
    private isValidToken;
    private isAdmin;
    private validateRequest;
    canActivate(context: ExecutionContext): boolean;
}

import { CanActivate, ExecutionContext } from '@nestjs/common';
import 'dotenv/config';
export declare class AdminGuard implements CanActivate {
    private verifyToken;
    private validateRequest;
    canActivate(context: ExecutionContext): boolean;
}

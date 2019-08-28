import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AdminGuard implements CanActivate {
    private validateRequest;
    canActivate(context: ExecutionContext): boolean;
}

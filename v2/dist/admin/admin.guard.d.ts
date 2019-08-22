import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AdminGuard implements CanActivate {
    private readonly adminModel;
    constructor(adminModel: any);
    private validateRequest;
    canActivate(context: ExecutionContext): Promise<boolean>;
}

import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class UserGuard implements CanActivate {
    private readonly userModel;
    constructor(userModel: any);
    private validateRequest;
    canActivate(context: ExecutionContext): Promise<boolean>;
}

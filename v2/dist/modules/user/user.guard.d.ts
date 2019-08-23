import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class UserGuard implements CanActivate {
    private readonly userModel;
    constructor(userModel: any);
    private getTokenData;
    private getPivotData;
    private isValidToken;
    private isValidOwner;
    private validateRequest;
    canActivate(context: ExecutionContext): Promise<boolean>;
}

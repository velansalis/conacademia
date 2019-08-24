import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class CourseGuard implements CanActivate {
    private readonly courseModel;
    constructor(courseModel: any);
    private getTokenData;
    private getPivotData;
    private isValidToken;
    private isValidOwner;
    private validateRequest;
    canActivate(context: ExecutionContext): Promise<boolean>;
}

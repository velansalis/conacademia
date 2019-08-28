import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class CourseGuard implements CanActivate {
    private readonly courseModel;
    constructor(courseModel: any);
    private filterRequests;
    private validateRequest;
    canActivate(context: ExecutionContext): Promise<boolean>;
}

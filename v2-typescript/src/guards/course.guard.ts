import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CourseDTO } from '../modules/course/course.dto';

@Injectable()
export class CourseGuard implements CanActivate {
    constructor(@InjectModel('Course') private readonly courseModel) {}

    private async filterRequests(request, username) {
        let method = request.method;
        let pivot = request.params.course_id || request.body.course_id;
        switch (method) {
            case 'POST' :
            case 'DELETE':
                let course: CourseDTO = await this.courseModel
                    .findOne({ course_id: pivot, faculty_incharge: username })
                    .lean()
                    .exec();
                console.log(course);
                if (!course) return false;
        }
        return true;
    }

    private async validateRequest(request): Promise<boolean> {
        let { user } = request;
        if (user.scope == 'admin') return true;
        return await this.filterRequests(request, user.username);
    }

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
}

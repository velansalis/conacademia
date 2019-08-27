import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CourseDTO } from '../modules/course/course.dto';

import * as jwt from 'jsonwebtoken';

@Injectable()
export class CourseGuard implements CanActivate {
    constructor(@InjectModel('Course') private readonly courseModel) {}

    private async validateRequest(request): Promise<boolean> {
        let token: any = request.headers.authorization ? request.headers.authorization.split(' ')[1] : null;
        let tokendata = jwt.verify(token, process.env.TOKEN_SECRET);
        if (tokendata.scope == 'admin') return true;
        let pivot = request.params.courseId || request.body.courseId;

        if (request.method == 'PATCH') {
            let course: CourseDTO = await this.courseModel
                .findOne({ course_id: pivot, owner: tokendata.username })
                .lean()
                .exec();
            if (!course) return false;
        }
        return true;
    }

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
}

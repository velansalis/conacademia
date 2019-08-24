import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { CourseDTO } from './course.dto';

@Injectable()
export class CourseGuard implements CanActivate {
    constructor(@InjectModel('Course') private readonly courseModel) {}

    private getTokenData(request): any {
        let token: any = request.headers.authorization.split(' ');
        token[1] = jwt.verify(token[1], process.env.TOKEN_SECRET);
        return token;
    }

    private getPivotData(request): string {
        return request.params.courseId || request.body.courseId;
    }

    private async isValidToken(request): Promise<boolean> {
        if (!request.headers.authorization) return false;
        var data = this.getTokenData(request);
        if (data[0] == 'Bearer' && data[1]) return true;
        else return false;
    }

    private async isValidOwner(request): Promise<boolean> {
        let data = this.getTokenData(request)[1];
        let pivot = this.getPivotData(request);

        if (['PATCH'].includes(request.method)) {
            if (request.body.designation || request.body.scope)
                throw new HttpException('Designation / scope can not be changed', HttpStatus.BAD_REQUEST);
            let course: CourseDTO = await this.courseModel
                .findOne({ courseId: pivot, owner: data.username })
                .lean()
                .exec();
            if (!course) return false;
        }
        return true;
    }

    private async validateRequest(request): Promise<boolean> {
        return (await this.isValidToken(request)) && (await this.isValidOwner(request));
    }

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
}

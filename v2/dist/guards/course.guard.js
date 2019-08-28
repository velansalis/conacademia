"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
let CourseGuard = class CourseGuard {
    constructor(courseModel) {
        this.courseModel = courseModel;
    }
    async filterRequests(request, username) {
        let method = request.method;
        let pivot = request.params.course_id || request.body.course_id;
        switch (method) {
            case 'PATCH':
                let course = await this.courseModel
                    .findOne({ course_id: pivot, owner: username })
                    .lean()
                    .exec();
                if (!course)
                    return false;
        }
        return true;
    }
    async validateRequest(request) {
        let { user } = request;
        if (user.scope == 'admin')
            return true;
        return await this.filterRequests(request.method, user.username);
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
};
CourseGuard = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Course')),
    __metadata("design:paramtypes", [Object])
], CourseGuard);
exports.CourseGuard = CourseGuard;
//# sourceMappingURL=course.guard.js.map
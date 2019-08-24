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
const jwt = require("jsonwebtoken");
let CourseGuard = class CourseGuard {
    constructor(courseModel) {
        this.courseModel = courseModel;
    }
    getTokenData(request) {
        let token = request.headers.authorization.split(' ');
        token[1] = jwt.verify(token[1], process.env.TOKEN_SECRET);
        return token;
    }
    getPivotData(request) {
        return request.params.courseId || request.body.courseId;
    }
    async isValidToken(request) {
        if (!request.headers.authorization)
            return false;
        var data = this.getTokenData(request);
        if (data[0] == 'Bearer' && data[1])
            return true;
        else
            return false;
    }
    async isValidOwner(request) {
        let data = this.getTokenData(request)[1];
        let pivot = this.getPivotData(request);
        if (['PATCH'].includes(request.method)) {
            if (request.body.designation || request.body.scope)
                throw new common_1.HttpException('Designation / scope can not be changed', common_1.HttpStatus.BAD_REQUEST);
            let course = await this.courseModel
                .findOne({ courseId: pivot, owner: data.username })
                .lean()
                .exec();
            if (!course)
                return false;
        }
        return true;
    }
    async validateRequest(request) {
        return (await this.isValidToken(request)) && (await this.isValidOwner(request));
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
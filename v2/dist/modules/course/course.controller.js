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
const course_service_1 = require("./course.service");
const course_dto_1 = require("./course.dto");
const course_guard_1 = require("../../guards/course.guard");
const admin_guard_1 = require("../../guards/admin.guard");
const jwt_guard_1 = require("../../guards/jwt.guard");
let CourseController = class CourseController {
    constructor(courseService) {
        this.courseService = courseService;
    }
    async getCourse() {
        return { message: 'Getting course' };
    }
    async addCourse(coursedata) {
        let response = await this.courseService.addCourse(coursedata);
        return {
            message: 'Course successfully added',
            data: response,
        };
    }
    async editCourse() {
        return { message: 'Editing course' };
    }
    async deleteCourse(coursedata, courseid) {
        let response = await this.courseService.deleteCourse(coursedata, courseid);
        return {
            message: 'Course successfully deleted',
            data: response,
        };
    }
};
__decorate([
    common_1.UseGuards(jwt_guard_1.JWTStrategy, course_guard_1.CourseGuard),
    common_1.Get(':course_id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getCourse", null);
__decorate([
    common_1.UseGuards(jwt_guard_1.JWTStrategy, admin_guard_1.AdminGuard),
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_dto_1.CourseDTO]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "addCourse", null);
__decorate([
    common_1.UseGuards(jwt_guard_1.JWTStrategy, course_guard_1.CourseGuard),
    common_1.Patch(':course_id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "editCourse", null);
__decorate([
    common_1.UseGuards(jwt_guard_1.JWTStrategy, admin_guard_1.AdminGuard),
    common_1.Delete(':course_id'),
    __param(0, common_1.Body()), __param(1, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "deleteCourse", null);
CourseController = __decorate([
    common_1.Controller('course'),
    __metadata("design:paramtypes", [course_service_1.CourseService])
], CourseController);
exports.CourseController = CourseController;
//# sourceMappingURL=course.controller.js.map
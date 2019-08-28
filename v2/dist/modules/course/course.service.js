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
const bcrypt = require("bcrypt");
let CourseService = class CourseService {
    constructor(userModel, courseModel) {
        this.userModel = userModel;
        this.courseModel = courseModel;
    }
    async addCourse(coursedata) {
        try {
            let user = await this.userModel
                .findOne({ username: coursedata.faculty_incharge })
                .lean()
                .exec();
            if (!user) {
                throw new common_1.HttpException("Faculty Incharge doesn't exists", common_1.HttpStatus.BAD_REQUEST);
            }
            if (user.designation != 'faculty') {
                throw new common_1.HttpException(`${user.username} is not a faculty`, common_1.HttpStatus.BAD_REQUEST);
            }
            let course = await this.courseModel(coursedata).save();
            return course;
        }
        catch (err) {
            throw err;
        }
    }
    async deleteCourse(coursedata, course_id) {
        try {
            let user = await this.userModel
                .findOne({ username: coursedata.username })
                .lean()
                .exec();
            if (!user) {
                throw new common_1.HttpException('Invalid username', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!(await bcrypt.compare(coursedata.password, user.password))) {
                throw new common_1.HttpException('Invalid password', common_1.HttpStatus.BAD_REQUEST);
            }
            let course = await this.courseModel
                .findOneAndDelete({ course_id: course_id })
                .lean()
                .exec();
            return course;
        }
        catch (err) {
            throw err;
        }
    }
};
CourseService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')), __param(1, mongoose_1.InjectModel('Course')),
    __metadata("design:paramtypes", [Object, Object])
], CourseService);
exports.CourseService = CourseService;
//# sourceMappingURL=course.service.js.map
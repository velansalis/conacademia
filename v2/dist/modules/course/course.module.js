"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const course_service_1 = require("./course.service");
const course_controller_1 = require("./course.controller");
const course_schema_1 = require("./course.schema");
const mongoose_1 = require("@nestjs/mongoose");
let CourseModule = class CourseModule {
};
CourseModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: 'Course',
                    schema: course_schema_1.CourseSchema,
                },
            ]),
        ],
        providers: [course_service_1.CourseService],
        controllers: [course_controller_1.CourseController],
    })
], CourseModule);
exports.CourseModule = CourseModule;
//# sourceMappingURL=course.module.js.map
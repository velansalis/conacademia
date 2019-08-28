"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const common_1 = require("@nestjs/common");
const user_module_1 = require("./modules/user/user.module");
const auth_module_1 = require("./auth/auth.module");
const course_module_1 = require("./modules/course/course.module");
const http_exception_1 = require("./globals/http.exception");
const log_interceptor_1 = require("./globals/log.interceptor");
const mongoose_1 = require("@nestjs/mongoose");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI, { dbName: process.env.DATABASE, useNewUrlParser: true }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            course_module_1.CourseModule,
        ],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_1.HttpErrorFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: log_interceptor_1.LogInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_module_1 = require("./modules/user/user.module");
const core_1 = require("@nestjs/core");
const http_exception_1 = require("./filters/http.exception");
const auth_module_1 = require("./modules/auth/auth.module");
const admin_module_1 = require("./modules/admin/admin.module");
const mongo_exception_1 = require("./filters/mongo.exception");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb+srv://velanmax:nmQwk34BCzmElvIw@mcaproject-5bdfh.mongodb.net/conacademia?retryWrites=true&w=majority', { dbName: 'conacademia', useNewUrlParser: true }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            admin_module_1.AdminModule,
        ],
        providers: [
            { provide: core_1.APP_FILTER, useClass: http_exception_1.HttpErrorFilter },
            { provide: core_1.APP_FILTER, useClass: mongo_exception_1.MongoExceptionFilter },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
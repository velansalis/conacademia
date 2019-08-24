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
var _a;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AdminGuard = class AdminGuard {
    constructor(userModel) { }
    getTokenData(request) {
        let token = request.headers.authorization.split(' ');
        token[1] = jwt.verify(token[1], process.env.TOKEN_SECRET);
        return token;
    }
    isValidToken(request) {
        if (!request.headers.authorization)
            return false;
        let data = this.getTokenData(request);
        if (data[0] == 'Bearer' && data[1])
            return true;
        else
            return false;
    }
    isAdmin(request) {
        let data = this.getTokenData(request);
        if (data[1].scope == 'admin')
            return true;
        else
            return false;
    }
    validateRequest(request) {
        return this.isValidToken(request) && this.isAdmin(request);
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
};
AdminGuard = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], AdminGuard);
exports.AdminGuard = AdminGuard;
//# sourceMappingURL=admin.guard.js.map
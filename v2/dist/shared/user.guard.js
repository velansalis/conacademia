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
const jwt = require("jsonwebtoken");
const mongoose_1 = require("@nestjs/mongoose");
let UserGuard = class UserGuard {
    constructor(userModel) {
        this.userModel = userModel;
    }
    getTokenData(request) {
        let token = request.headers.authorization.split(' ');
        token[1] = jwt.verify(token[1], 'supersecret');
        return token;
    }
    getPivotData(request) {
        return request.params.username || request.body.username;
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
        let user;
        let data = this.getTokenData(request)[1];
        let pivot = this.getPivotData(request);
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
            user = await this.userModel
                .findOne({ username: pivot, owner: data.username })
                .lean()
                .exec();
            if (!user)
                return false;
        }
        return true;
    }
    async validateRequest(request) {
        return this.isValidToken(request) && (await this.isValidOwner(request));
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
};
UserGuard = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')),
    __metadata("design:paramtypes", [Object])
], UserGuard);
exports.UserGuard = UserGuard;
//# sourceMappingURL=user.guard.js.map
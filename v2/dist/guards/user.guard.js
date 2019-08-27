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
let UserGuard = class UserGuard {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async validateRequest(request) {
        try {
            let token = request.headers.authorization ? request.headers.authorization.split(' ')[1] : null;
            let tokendata = jwt.verify(token, process.env.TOKEN_SECRET);
            if (tokendata.scope == 'admin')
                return true;
            let pivot = request.params.username || request.body.username;
            if (request.method == 'PATCH') {
                if (request.body.designation || request.body.scope)
                    throw new common_1.HttpException('Designation / scope can not be changed', common_1.HttpStatus.BAD_REQUEST);
                let user = await this.userModel
                    .findOne({ username: pivot, owner: tokendata.username })
                    .lean()
                    .exec();
                if (!user)
                    return false;
            }
            return true;
        }
        catch (err) {
            throw err;
        }
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
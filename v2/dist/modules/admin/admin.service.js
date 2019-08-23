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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
let AdminService = class AdminService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async grant(admindata) {
        try {
            let user = await this.userModel
                .findOne({ username: admindata.username })
                .lean()
                .exec();
            if (!user) {
                throw new common_1.HttpException(`User ${admindata.username} Does not exists.`, common_1.HttpStatus.BAD_REQUEST);
            }
            user = await this.userModel
                .findOneAndUpdate({ username: admindata.username }, { scope: admindata.scope }, { new: true, runValidators: true })
                .lean()
                .exec();
            let { _id, password, owner, __v, token } = user, data = __rest(user, ["_id", "password", "owner", "__v", "token"]);
            return data;
        }
        catch (err) {
            throw err;
        }
    }
};
AdminService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')),
    __metadata("design:paramtypes", [Object])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map
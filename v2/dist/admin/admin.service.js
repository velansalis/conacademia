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
const admin_guard_1 = require("./admin.guard");
let AdminService = class AdminService {
    constructor(adminModel, userModel) {
        this.adminModel = adminModel;
        this.userModel = userModel;
    }
    async addAdmin(admindata) {
        try {
            let user = await this.userModel
                .findOne({ username: admindata.username })
                .lean()
                .exec();
            if (!user) {
                throw new common_1.HttpException(`User ${admindata.username} Does not exists.`, common_1.HttpStatus.BAD_REQUEST);
            }
            admindata.adminId = user._id;
            let admin = new this.adminModel(admindata);
            return await admin.save();
        }
        catch (err) {
            throw err;
        }
    }
    async removeAdmin(admindata) {
        return true;
    }
};
AdminService = __decorate([
    common_1.Injectable(),
    common_1.UseGuards(admin_guard_1.AdminGuard),
    __param(0, mongoose_1.InjectModel('Admin')), __param(1, mongoose_1.InjectModel('User')),
    __metadata("design:paramtypes", [Object, Object])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map
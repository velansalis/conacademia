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
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const http_exception_1 = require("../../globals/http.exception");
const jwt_guard_1 = require("../../guards/jwt.guard");
const user_guard_1 = require("../../guards/user.guard");
const admin_guard_1 = require("../../guards/admin.guard");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUser(username) {
        let response = await this.userService.getUser(username);
        return { data: response };
    }
    async editUser(request, userdata) {
        const username = request.params.username;
        let response = await this.userService.editUser(username, userdata);
        return { data: response };
    }
    async addAdmin(userdata) {
        let data = await this.userService.grantPermission(userdata);
        return {
            message: 'Permissions successfully changed',
            data,
        };
    }
};
__decorate([
    common_1.Get(':username'),
    common_3.UseGuards(jwt_guard_1.JWTStrategy, user_guard_1.UserGuard),
    __param(0, common_2.Param('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    common_1.Patch(':username'),
    common_3.UseGuards(jwt_guard_1.JWTStrategy, user_guard_1.UserGuard),
    __param(0, common_2.Req()), __param(1, common_2.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editUser", null);
__decorate([
    common_1.Post('grant'),
    common_3.UseGuards(jwt_guard_1.JWTStrategy, admin_guard_1.AdminGuard),
    __param(0, common_2.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addAdmin", null);
UserController = __decorate([
    common_3.Controller('user'),
    common_3.UseFilters(http_exception_1.HttpErrorFilter),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map
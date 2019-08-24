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
const user_dto_1 = require("../user/user.dto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv/config");
let AuthService = class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    getToken(data) {
        return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '2h' });
    }
    isTokenValid(data) {
        let isValid = jwt.verify(data, process.env.TOKEN_SECRET);
        return Boolean(isValid);
    }
    async isPasswordValid(plaintext, hashedtext) {
        let valid = await bcrypt.compare(plaintext, hashedtext);
        return Boolean(valid);
    }
    async loginUser(userdata) {
        try {
            let user = await this.userModel.findOne({ username: userdata.username }).exec();
            if (!user) {
                throw new common_1.HttpException('User Does not exists.', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!(await this.isPasswordValid(userdata.password, user.password))) {
                throw new common_1.HttpException('Invalid password.', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!this.isTokenValid(user.token)) {
                user.token = this.getToken({
                    username: userdata.username,
                    designation: user.designation,
                    scope: user.scope,
                });
                await this.userModel.updateOne({ username: userdata.username }, { token: user.token }).exec();
                throw new common_1.HttpException('Access token has expired. Log in to obtain a new one', common_1.HttpStatus.FORBIDDEN);
            }
            return {
                username: user.username,
                designation: user.designation,
                token: user.token,
            };
        }
        catch (err) {
            throw err;
        }
    }
    async registerUser(userdata) {
        try {
            if (userdata.password.length < 8)
                throw new common_1.HttpException('Invalid password', common_1.HttpStatus.BAD_REQUEST);
            let user = await this.userModel.findOne({ username: userdata.username }).exec();
            let count = await this.userModel.count();
            if (!user) {
                userdata.password = await bcrypt.hash(userdata.password, 10);
                userdata.age = Math.floor((new Date() - new Date(userdata.dob).getTime()) / 3.15576e10);
                userdata.owner = userdata.username;
                userdata.scope = count == 0 ? 'admin' : userdata.designation == 'student' ? 'user' : 'course';
                userdata.token = await this.getToken({
                    username: userdata.username,
                    designation: userdata.designation,
                    scope: userdata.scope,
                });
                user = new this.userModel(userdata);
                await user.save();
                let { password, owner, token } = userdata, response = __rest(userdata, ["password", "owner", "token"]);
                return response;
            }
            else {
                throw new common_1.HttpException('Username already exists', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async deleteUser(userdata) {
        try {
            let user = await this.userModel
                .findOne({ username: userdata.username })
                .lean()
                .exec();
            if (!user) {
                throw new common_1.HttpException('User Does not exists.', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!(await this.isPasswordValid(userdata.password, user.password))) {
                throw new common_1.HttpException('Invalid password.', common_1.HttpStatus.BAD_REQUEST);
            }
            user = await this.userModel
                .findOneAndDelete({ username: userdata.username })
                .lean()
                .exec();
            let { password, _id, __v, owner, token, scope } = user, data = __rest(user, ["password", "_id", "__v", "owner", "token", "scope"]);
            return data;
        }
        catch (err) {
            throw err;
        }
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
__decorate([
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "loginUser", null);
__decorate([
    common_1.HttpCode(common_1.HttpStatus.CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDTO]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "registerUser", null);
__decorate([
    common_1.HttpCode(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "deleteUser", null);
__decorate([
    common_1.HttpCode(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "grant", null);
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')),
    __metadata("design:paramtypes", [Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
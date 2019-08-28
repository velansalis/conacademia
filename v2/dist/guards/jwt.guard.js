"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
require("dotenv/config");
let JWTStrategy = class JWTStrategy {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
    validateRequest(request) {
        let token = request.headers.authorization ? request.headers.authorization.split(' ')[1] : null;
        let decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        request.user = decoded;
        return true;
    }
};
JWTStrategy = __decorate([
    common_1.Injectable()
], JWTStrategy);
exports.JWTStrategy = JWTStrategy;
//# sourceMappingURL=jwt.guard.js.map
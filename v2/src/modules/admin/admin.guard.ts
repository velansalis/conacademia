import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.interface';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(@InjectModel('User') userModel: Model<User>) {}

    private getTokenData(request): any {
        let token: any = request.headers.authorization.split(' ');
        token[1] = jwt.verify(token[1], process.env.TOKEN_SECRET);
        return token;
    }

    private isValidToken(request): boolean {
        if (!request.headers.authorization) return false;
        let data = this.getTokenData(request);
        if (data[0] == 'Bearer' && data[1]) return true;
        else return false;
    }

    private isAdmin(request): boolean {
        let data = this.getTokenData(request);
        if (data[1].scope == 'admin') return true;
        else return false;
    }

    private validateRequest(request): boolean {
        return this.isValidToken(request) && this.isAdmin(request);
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
}

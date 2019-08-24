import { CanActivate, ExecutionContext } from '@nestjs/common';
import 'dotenv/config';
import { Model } from 'mongoose';
import { User } from '../user/user.interface';
export declare class AdminGuard implements CanActivate {
    constructor(userModel: Model<User>);
    private getTokenData;
    private isValidToken;
    private isAdmin;
    private validateRequest;
    canActivate(context: ExecutionContext): boolean;
}

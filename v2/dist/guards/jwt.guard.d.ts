import { CanActivate, ExecutionContext } from '@nestjs/common';
import 'dotenv/config';
export declare class JWTStrategy implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
    validateRequest(request: any): any;
}

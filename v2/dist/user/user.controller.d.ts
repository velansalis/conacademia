import { Request } from 'express';
import { UserService } from './user.service';
import { UserDTO } from './types/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(username: string): Promise<Object>;
    editUser(request: Request, userdata: Partial<UserDTO>): Promise<Object>;
}

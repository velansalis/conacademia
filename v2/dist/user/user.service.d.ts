import { Model } from 'mongoose';
import { User } from './types/user.interface';
import { UserDTO } from './types/user.dto';
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    getUser(username: string): Promise<User>;
    editUser(username: string, userdata: Partial<UserDTO>): Promise<User>;
}

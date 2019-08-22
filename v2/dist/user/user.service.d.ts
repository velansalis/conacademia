import { UserDTO } from './user.dto';
import { Model } from 'mongoose';
import { User } from './user.interface';
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    getUser(username: string): Promise<User>;
    editUser(username: string, userdata: Partial<UserDTO>): Promise<User>;
}

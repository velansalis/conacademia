import { Model } from 'mongoose';
import { User } from '../user/types/user.interface';
import { UserDTO } from '../user/types/user.dto';
export declare class AuthService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    private getToken;
    private isPasswordValid;
    loginUser(userdata: Partial<UserDTO>): Promise<object>;
    registerUser(userdata: UserDTO): Promise<object>;
    deleteUser(userdata: Partial<UserDTO>): Promise<object>;
}

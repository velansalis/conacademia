import { UserDTO } from '../user/user.dto';
export declare class AuthService {
    private readonly userModel;
    constructor(userModel: any);
    private getToken;
    private isPasswordValid;
    loginUser(userdata: Partial<UserDTO>): Promise<object>;
    registerUser(userdata: UserDTO): Promise<object>;
    deleteUser(userdata: Partial<UserDTO>): Promise<object>;
}

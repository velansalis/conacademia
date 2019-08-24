import { UserDTO } from '../user/user.dto';
import 'dotenv/config';
export declare class AuthService {
    private readonly userModel;
    constructor(userModel: any);
    private getToken;
    private isTokenValid;
    private isPasswordValid;
    loginUser(userdata: Partial<UserDTO>): Promise<object>;
    registerUser(userdata: UserDTO): Promise<object>;
    deleteUser(userdata: Partial<UserDTO>): Promise<object>;
    grant(admindata: Partial<UserDTO>): Promise<object>;
}

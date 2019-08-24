import { AuthService } from './auth.service';
import { UserDTO } from '../user/user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginUser(userdata: Partial<UserDTO>): Promise<object>;
    register(userdata: UserDTO): Promise<object>;
    delete(userdata: Partial<UserDTO>): Promise<object>;
    addAdmin(userdata: Partial<UserDTO>): Promise<object>;
}

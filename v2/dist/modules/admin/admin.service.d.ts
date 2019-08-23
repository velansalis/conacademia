import { UserDTO } from '../user/user.dto';
export declare class AdminService {
    private readonly userModel;
    constructor(userModel: any);
    grant(admindata: Partial<UserDTO>): Promise<object>;
}

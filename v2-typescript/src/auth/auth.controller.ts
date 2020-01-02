import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '../modules/user/user.dto';

/**
 * This class handles the authentication of the users.
 */
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Handles the login of the user
     * @param userdata Contains username and password as an object
     */
    @Post('login')
    async login(@Body() userdata: Partial<UserDTO>): Promise<object> {
        let response = await this.authService.loginUser(userdata);
        return {
            message: 'Authentication successful',
            data: response,
        };
    }

    /**
     * Handles the registeration of new user to the system.
     * @param userdata Contains username, password, fname, lname, dob of the user
     */
    @Post('register')
    async register(@Body() userdata: UserDTO): Promise<object> {
        let response = await this.authService.registerUser(userdata);
        return {
            message: 'Registeration successful',
            data: response,
        };
    }

    /**
     * Handles the deletion of the already existing user from the system.
     * @param userdata Contains the username and password of the user.
     */
    @Post('terminate')
    async delete(@Body() userdata: Partial<UserDTO>): Promise<object> {
        let response = await this.authService.deleteUser(userdata);
        return {
            message: 'User successfully deleted',
            data: response,
        };
    }
}

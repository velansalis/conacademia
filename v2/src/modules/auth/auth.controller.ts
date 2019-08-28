import { Controller, Post, Body, HttpCode, UseFilters, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/user.dto';
import { HttpErrorFilter } from '../../filters/http.exception';
@Controller('auth')
@UseFilters(HttpErrorFilter)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async loginUser(@Body() userdata: Partial<UserDTO>): Promise<object> {
        let response = await this.authService.loginUser(userdata);
        return {
            message: 'Authentication successful',
            data: response,
        };
    }

    @Post('register')
    async register(@Body() userdata: UserDTO): Promise<object> {
        let response = await this.authService.registerUser(userdata);
        return {
            message: 'Registeration successful',
            data: response,
        };
    }

    @Post('terminate')
    async delete(@Body() userdata: Partial<UserDTO>): Promise<object> {
        let response = await this.authService.deleteUser(userdata);
        return {
            message: 'User successfully deleted',
            data: response,
        };
    }
}

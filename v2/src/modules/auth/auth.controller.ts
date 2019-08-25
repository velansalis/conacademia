import { Controller, Post, Body, HttpCode, UseFilters, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/user.dto';
import { HttpErrorFilter } from '../../filters/http.exception';
@Controller('auth')
@UseFilters(HttpErrorFilter)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() userdata: Partial<UserDTO>): Promise<object> {
        let response = await this.authService.loginUser(userdata);
        return {
            message: 'Authentication successful',
            data: response,
        };
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() userdata: UserDTO): Promise<object> {
        let response = await this.authService.registerUser(userdata);
        return {
            message: 'Registeration successful',
            data: response,
        };
    }

    @Post('terminate')
    @HttpCode(HttpStatus.OK)
    async delete(@Body() userdata: Partial<UserDTO>): Promise<object> {
        let response = await this.authService.deleteUser(userdata);
        return {
            message: 'User successfully deleted',
            data: response,
        };
    }

    @Post('grant')
    async addAdmin(@Body() userdata: Partial<UserDTO>): Promise<object> {
        let data = await this.authService.grant(userdata);
        return {
            message: 'Permissions successfully changed',
            data,
        };
    }
}

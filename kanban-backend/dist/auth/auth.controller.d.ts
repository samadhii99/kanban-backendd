import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginResponse, UserPayload } from './interfaces/auth.interfaces';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<UserPayload>;
    login(req: any): Promise<LoginResponse>;
    getProfile(req: any): Promise<UserPayload>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        success: boolean;
    }>;
}

import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
interface UserPayload {
    id: string;
    email: string;
    fullName: string;
    [key: string]: any;
}
interface LoginResponse {
    access_token: string;
    user: UserPayload;
}
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<UserPayload | null>;
    login(user: UserPayload): Promise<LoginResponse>;
    register(registerDto: RegisterDto): Promise<UserPayload>;
    getProfile(userId: string): Promise<UserPayload>;
    forgotPassword(email: string): Promise<boolean>;
}
export {};

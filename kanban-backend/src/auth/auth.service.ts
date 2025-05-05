import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

// Define interfaces for better type safety
interface UserPayload {
  id: string;
  email: string;
  fullName: string;
  [key: string]: any; // For any additional properties
}

interface LoginResponse {
  access_token: string;
  user: UserPayload;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserPayload | null> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserPayload): Promise<LoginResponse> {
    const payload = {
      email: user.email,
      sub: user.id,
      fullName: user.fullName,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<UserPayload> {
    // Check if user exists
    const userExists = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (userExists) {
      throw new UnauthorizedException('User already exists with this email');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create new user
    const newUser = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    await this.usersRepository.save(newUser);

    // Return user data without password
    const { password, ...result } = newUser;
    return result;
  }

  async getProfile(userId: string): Promise<UserPayload> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  async forgotPassword(email: string): Promise<boolean> {
    // In a real application, you would:
    // 1. Check if the user exists
    // 2. Generate a password reset token
    // 3. Send an email with a reset link
    // 4. Save the token to verify when the user resets their password

    // For this implementation, we'll just check if the user exists
    const user = await this.usersRepository.findOne({ where: { email } });

    // Always return true to prevent email enumeration attacks
    return true;
  }
}
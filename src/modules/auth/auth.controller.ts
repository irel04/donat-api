import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/auth/auth.dto';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: CreateUserDto): Promise<{ message: string; user: User }> {
		const user = await this.authService.createUser(dto);
		return { message: 'User created successfully', user };
	}

}

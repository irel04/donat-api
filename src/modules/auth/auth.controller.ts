import { CreateUserDto } from '@/modules/auth/auth.dto';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/users/user.entity';
import { Body, Controller, Post } from '@nestjs/common';


@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('register')
	async register(@Body() dto: CreateUserDto): Promise<User> {
		const user = await this.authService.createUser(dto);
		return user;
	}

}

import { CreateUserDto, SignInDTO } from '@/modules/auth/auth.dto';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/users/user.entity';
// import { AuthService } from '@/modules/auth/auth.service';
import { UsersService } from '@/modules/users/users.service';
import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
	constructor(private readonly userService: UsersService, private readonly authService: AuthService) { }

	@Post('register')
	async register(@Body() dto: CreateUserDto): Promise<User> {
		const user = await this.userService.createUser(dto);
		return user;
	}

	@Post('sign-in')
	signIn(@Body() dto: SignInDTO): { accessToken: string } {
		// Assuming AuthService is implemented and has a signIn method
		// const token = await this.authService.signIn(dto.email, dto.password);
		// return { accessToken: token };

		this.authService.signIn(dto.email, dto.password);

		// Placeholder for actual sign-in logic
		return { accessToken: 'mocked-access-token' };
	}
}

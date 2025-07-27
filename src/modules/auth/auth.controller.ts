import { CreateUserDto } from '@/modules/auth/auth.dto';
import { User } from '@/modules/users/user.entity';
// import { AuthService } from '@/modules/auth/auth.service';
import { UsersService } from '@/modules/users/users.service';
import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
	constructor(private readonly userService: UsersService) { }

	@Post('register')
	async register(@Body() dto: CreateUserDto): Promise<User> {
		const user = await this.userService.createUser(dto);
		return user;
	}

}

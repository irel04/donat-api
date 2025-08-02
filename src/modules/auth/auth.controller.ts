import { Public } from '@/common/publicDecorator';
import { CreateUserDto, SignInDTO, SignInResponseDTO } from '@/modules/auth/auth.dto';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/users/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { Body, ClassSerializerInterceptor, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
	constructor(private readonly userService: UsersService, private readonly authService: AuthService) { }

	@Public()
	@Post('register')
	async register(@Body() dto: CreateUserDto): Promise<User> {
		const user = await this.userService.createUser(dto);
		return user;
	}

	@Public()
	@Post('sign-in')
	@HttpCode(200)
	signIn(@Body() dto: SignInDTO): Promise<SignInResponseDTO> {
		return this.authService.signIn(dto.email, dto.password);
	}

	


}

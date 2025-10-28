import { Public } from '@/common/decorators/public.decorator';
import { AuthService } from '@/modules/auth/auth.service';
import { CreateUserDto, SignInDTO, SignInResponseDTO } from '@/modules/auth/dto/auth.dto';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { Body, ClassSerializerInterceptor, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({
	path: "auth",
	version: "1"
})
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

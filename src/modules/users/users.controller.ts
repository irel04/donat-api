import { UserParam } from '@/common/decorators/user.decorator';
import { User } from '@/modules/users/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
	
	constructor(
		private service: UsersService,
	){}


	@Get('me')
	getUserById(@UserParam("sub") sub: string): Promise<User | null> {
		return this.service.findByUserId(sub)
	}

}

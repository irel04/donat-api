import { CreateUserDto } from '@/modules/auth/auth.dto';
import { User } from '@/modules/users/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) { }

	createUser(payload: CreateUserDto): Promise<User> {
		const user = this.userRepository.create({
			email: payload.email,
			password: payload.password,
			role: 'user', // Default role, can be changed later
			firstName: payload.firstName,
			lastName: payload.lastName,
		});

		return this.userRepository.save(user);
	}
}

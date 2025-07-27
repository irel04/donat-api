import { CreateUserDto } from '@/modules/auth/auth.dto';
import { User } from '@/modules/users/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {
	constructor (
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	){}

	async createUser(payload: CreateUserDto): Promise<User> {

		// Check if user with the same email already exists
		const existingUser = await this.userRepository.findOne({ where: { email: payload.email } });

		const hashedPassword = await bcrypt.hash(payload.password, 10);

		if (existingUser) throw new BadRequestException('Email already registered');

		const user = this.userRepository.create({
			email: payload.email,
			password: hashedPassword,
			role: payload.role, // Default role, can be changed later
			firstName: payload.firstName,
			lastName: payload.lastName,
		});

		return this.userRepository.save(user);
	}
}

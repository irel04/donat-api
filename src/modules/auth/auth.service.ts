import { Role } from '@/common/decorators/role.decorator';
import { SignInResponseDTO } from '@/modules/auth/auth.dto';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

export interface JWTPayload {
	sub: string
	email: string
	role: Role 
	iat: number
	exp: number
}

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService, // Assuming JwtService is imported and used
	) { }

	private generateAccessToken(payload: Partial<JWTPayload>): Promise<string> {
		return this.jwtService.signAsync(payload);
	}

	private generateRefreshToken(payload: Partial<JWTPayload>): Promise<string> {
		return this.jwtService.signAsync(payload, { expiresIn: '7d' });
	}

	async signIn(userName: string, password: string): Promise<SignInResponseDTO> {
		const user = await this.userService.findOne(userName);
		
		if (!user || !(await bcrypt.compare(password, user.password))){
			throw new UnauthorizedException("Invalid credentials");
		}

		const payload: Partial<JWTPayload> = { sub: user.id, email: user.email, role:  user.role as Role};
		
		return {

			accessToken: await this.generateAccessToken(payload),
			refreshToken: await this.generateRefreshToken(payload),
		};
	}
}


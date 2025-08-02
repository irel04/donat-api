import { IS_PUBLIC_KEY } from '@/common/publicDecorator';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private reflector: Reflector
	) {}

	async canActivate(context: ExecutionContext):  Promise<boolean> {

		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		])

		if(isPublic){
			return true;
		}

		const req = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(req)

		if(!token){
			throw new UnauthorizedException("Invalid or expired token");
		}

		try {
			const payload = await this.jwtService.verifyAsync(
				token,
				{
					secret: this.configService.get<string>("MYSECRET")
				}
			)


			req.user = payload;
		} catch (error) {
			throw new UnauthorizedException("Invalid or expired token");
		}

		return true;

	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === "Bearer" ? token : undefined
	}
}
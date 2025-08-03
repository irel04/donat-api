import { JWTPayload } from '@/modules/auth/auth.service';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';


export const UserParam = createParamDecorator((data: keyof JWTPayload | undefined, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<Request & { user: JWTPayload }>()

	return data ? request.user[data] : request.user;
})
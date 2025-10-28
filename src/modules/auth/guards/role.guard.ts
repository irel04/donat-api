import { Role, ROLES_KEY } from '@/common/decorators/role.decorator';
import { JWTPayload } from '@/modules/auth/auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';



@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector){}

	canActivate(context: ExecutionContext): boolean  {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])

		if(!requiredRoles){
			return true
		}

		const request = context.switchToHttp().getRequest<Request & { user: JWTPayload }>();
		
		return requiredRoles.some(role => request.user.role === role)

	}
}
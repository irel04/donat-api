import { SetMetadata } from '@nestjs/common';


export enum Role {
	User = 'user',
	Admin = 'admin',
	Host = 'host'
}

export const ROLES_KEY = 'roles';

export const Roles 	= (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
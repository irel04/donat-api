import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

	signIn(userName: string, password: string) {
		console.info(userName, password)
		return
	}
}

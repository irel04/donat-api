import { SignInDTO } from '@/modules/auth/auth.dto';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/users/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
	let service: AuthService;

	const resolvedValue: User = {
		id: "1",
		email: "test@example.com",
		password: "hashed_password",
		firstName:"John",
		lastName:"Doe",
		role: "user",
		createdAt: new Date(),
	}

	beforeEach(async () => {

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: JwtService,
					useValue: {
						signAsync: jest.fn().mockImplementation((payload) => {
							return Promise.resolve(`token_${JSON.stringify(payload)}`);
						}),
					},
				},
				{
					provide: UsersService,
					useValue: {
						// Mock methods of UsersService if needed
						findOne: jest.fn().mockResolvedValue(resolvedValue),
					},
				}
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	})

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe("signIn", () => {
		const signinDto: SignInDTO ={
			email: "test@example.com",
			password: "password"
		}

		it("should return access token and refresh token", async () => {

			jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);


			const result = await service.signIn(signinDto.email, signinDto.password);

			expect(result).toHaveProperty('accessToken');
			expect(result).toHaveProperty('refreshToken');


		})
	})
})
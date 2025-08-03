import { CreateUserDto } from '@/modules/auth/auth.dto';
import { User } from '@/modules/users/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { randomUUID } from 'node:crypto';


describe("User Service", () => {
	let service: UsersService;

	let userRepository: jest.Mocked<Partial<Repository<User>>>;

	const resolvedValue: User = {
		id: '1',
		email: 'test@example.com',
		password: 'password123',
		role: 'user',
		firstName: 'John',
		lastName: 'Doe',
		createdAt: new Date(),
	};

	const testingDTO: CreateUserDto = {
		email: "test@example.com",
		firstName: "John",
		lastName: "Doe",
		password: "password123",
		role: "user", // Assuming role is a string, adjust as necessary
	}

	beforeEach(async () => {


		userRepository = {
			findOne: jest.fn().mockImplementation((options: FindOneOptions<User>) => {
				const where = options?.where;

				// Check if 'where' is NOT an array before accessing .email
				if (where && !Array.isArray(where) && where.email === 'test@example.com') {
					return Promise.resolve(resolvedValue);
				}
			}),
			create: jest.fn().mockReturnValue(resolvedValue),
			save: jest.fn().mockResolvedValue(resolvedValue),
			findOneBy: jest.fn().mockResolvedValue(resolvedValue),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersService, {
				provide: getRepositoryToken(User),
				useValue: userRepository,
			}],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("createUser", () => {
		it("check the user with same email", async () => {
			await expect(service.createUser(testingDTO)).rejects.toThrow("Email already registered")
			// expect(userRepository.create).toHaveBeenCalledWith(testingDTO)
	})

	it("should hashed the password before saving", async () => {
		const bcryptSpy = jest.spyOn(bcrypt, 'hash');
		await service.createUser({...testingDTO, email: "john@example.com"});
		expect(bcryptSpy).toHaveBeenCalled();
		expect(bcryptSpy).toHaveBeenCalledWith(testingDTO.password, 10);
		expect(userRepository.save).toHaveBeenCalled();
	})
	})

	describe("findOne", () => {
		it('return user using email', async () => {
			await service.findOne(testingDTO.email);
			expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: testingDTO.email } })
			
		})
	})


	describe("findUserById", () => {
		it('returns user via user id', async () => {
			const id = randomUUID()
			await service.findByUserId(id)
			expect(userRepository.findOneBy).toHaveBeenCalledWith({ id })
		})
	})


})
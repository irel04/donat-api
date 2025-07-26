import { AuthController } from '@/modules/auth/auth.controller';
import { CreateUserDto } from '@/modules/auth/auth.dto';
import { User } from '@/modules/users/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';


describe('AuthController', () => {
  let controller: AuthController;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashed_password',
    role: 'user',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController]
    }).useMocker((token) => {


      if (token === UsersService) {
        return {
          createUser: jest.fn().mockImplementation((dto: CreateUserDto) => {
            if (dto.email === "ben@example.com") {
              throw new BadRequestException("Email already registered");
            }
            return Promise.resolve(mockUser);
          }),
        };
      }

    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const dto = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should register a user and return a success message', async () => {
      const result = await controller.register(dto);
      expect(result).toEqual(mockUser);
    });

    it("should throw error if email is already registered", async () => {
      await expect(controller.register({...dto, email: "ben@example.com"})).rejects.toThrow(new BadRequestException("Email already registered"));
    })

  });
})

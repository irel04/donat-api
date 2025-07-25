import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/users/user.entity';
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


      if (token === AuthService) {
        return {
          createUser: jest.fn().mockResolvedValue(mockUser),
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
  });
})

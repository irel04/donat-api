import { AuthController } from '@/modules/auth/auth.controller';
import { User } from '@/modules/users/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';



describe('AuthController', () => {
  let controller: AuthController;
  let userService: UsersService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'password',
    role: 'user',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
  };

  const mockUserService = {
    createUser: jest.fn(),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>
    (AuthController);

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call userService.createUser with DTO', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user', // Assuming role is a string, adjust as necessary
      };

      mockUserService.createUser.mockResolvedValue(mockUser);

      const registerSpy = jest.spyOn(userService, 'createUser');

      const result =await controller.register(dto);

      expect(registerSpy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });

    it("should hide sensitive data", async () => {
      
    })

    

  });
})

import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/users/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';



describe('AuthController', () => {
  let controller: AuthController;
  let userService: UsersService;
  let authService: AuthService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'password',
    role: 'user',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
  };



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn().mockResolvedValue({
              accessToken: 'token',
              refreshToken: 'token',
            }),
          }
        },
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        }
      ],
    }).compile();

    controller = module.get<AuthController>
      (AuthController);

    userService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
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


      const registerSpy = jest.spyOn(userService, 'createUser');

      const result = await controller.register(dto);

      expect(registerSpy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });


  describe("sign-in", () => {
    it("should call authservice", async () => {

      const signInSpy = jest.spyOn(authService, 'signIn');


      await controller.signIn({ email: "test@example.com", password: "password" });

      expect(signInSpy).toHaveBeenCalled();
    })
  })


})

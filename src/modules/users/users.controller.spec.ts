import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '@/modules/users/users.service';
import { randomUUID } from 'crypto';
import { User } from '@/modules/users/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const id = randomUUID()

  let resolvedUserValue: User;

  beforeEach(async () => {

    resolvedUserValue = {
      createdAt: new Date(),
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      id,
      password: "password",
      role: 'user'
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findByUserId: jest.fn().mockResolvedValue(resolvedUserValue),
          }
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);

    service = module.get<UsersService>(UsersService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('me', () => {
    it('return user details', async () => {
      const id = randomUUID()

      const user = await controller.getUserById(id);

      expect(service.findByUserId).toHaveBeenCalled()
      expect(user).toEqual(resolvedUserValue);
    })
  })
});

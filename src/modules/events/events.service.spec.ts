import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsEntity, EventStatus } from '@/modules/events/events.entity';
import { randomUUID } from 'crypto';
import { User } from '@/modules/users/user.entity';
import { Repository } from 'typeorm';
import { CreateEventDTO } from '@/modules/events/events.dto';

describe('EventsService', () => {
  let service: EventsService;
  let eventsRepository: jest.Mocked<Partial<Repository<EventsEntity>>>;
  const [startDate, endDate] = ["04/05/2026", "04/06/2026"]
  let dummyUser: User;
  let resolvedValue: EventsEntity 
  let eventsPayload: CreateEventDTO;

  
  beforeEach(async () => {
    dummyUser = Object.assign(new User(), {
      id: randomUUID(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword123',
      role: 'admin',
      createdAt: new Date(),
    });

    resolvedValue = {
      id: randomUUID(),
      description: "Fund Raising",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: EventStatus.PENDING,
      user: dummyUser,
      createdAt: new Date(),
      updatedAt: null,
    }

    eventsPayload = {
      description: "Fund Raising",
      startDate,
      endDate
    }


    eventsRepository = {
      create: jest.fn().mockReturnValue(resolvedValue),
      save: jest.fn().mockResolvedValue(resolvedValue)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(EventsEntity),
          useValue: eventsRepository
        }
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("create an event", () => {

    it("should call event repository create and save", async () => {
      await service.createEvent(eventsPayload)
      expect(eventsRepository.create).toHaveBeenCalledWith(eventsPayload)
    })

    it("should call saved and return must be equal to expected", async () => {
      const result = await service.createEvent(eventsPayload)
      expect(eventsRepository.save).toHaveBeenCalled()
      expect(result).toEqual(resolvedValue)
    })


  })
});

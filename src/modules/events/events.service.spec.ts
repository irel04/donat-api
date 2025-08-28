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
  const [startDate, endDate] = ["04-05-2026", "04-06-2026"]
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(EventsEntity),
          useValue: {
            create: jest.fn().mockReturnValue(resolvedValue),
            save: jest.fn().mockResolvedValue(resolvedValue),
            findOne: jest.fn().mockResolvedValue(resolvedValue),
            findOneBy: jest.fn().mockResolvedValue(resolvedValue),
            find: jest.fn().mockResolvedValue([resolvedValue]),
            findAndCount: jest.fn().mockResolvedValue([[resolvedValue], 1])
          }
        }
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventsRepository = module.get<Partial<Repository<EventsEntity>>>(getRepositoryToken(EventsEntity));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("create an event", () => {

    it("should call event repository create and save", async () => {
      await service.createEvent(eventsPayload, dummyUser.id)
      expect(eventsRepository.create).toHaveBeenCalledWith({ ...eventsPayload, status: EventStatus.PENDING, user: { id: dummyUser.id } })
    })

    it("should call saved and return must be equal to expected", async () => {
      const result = await service.createEvent(eventsPayload, dummyUser.id)
      expect(eventsRepository.save).toHaveBeenCalled()
      expect(result).toEqual(resolvedValue)
    })
  })

  describe("get events", () => {
    
    it("should return all events when no params are provided", async () => {
      const result = await service.findAllEvents()
      expect(result).toEqual({
        data: [resolvedValue],
        total: 1
      });
    })

    it("should call with skip and take when limit and offset is provided as param", async () => {
      await service.findAllEvents(10, 1);
      expect(eventsRepository.findAndCount).toHaveBeenCalledWith({ relations: ['user'], skip: 1, take: 10 })
    })
  })

  describe("get events by id", () => {
    it("should call findOne with correct id", async () => {
      await service.findEventById(resolvedValue.id);
      expect(eventsRepository.findOneBy).toHaveBeenCalledWith({
        id: resolvedValue.id
      });
    })

    it("should return event", async () => {
      const result = await service.findEventById(resolvedValue.id);
      expect(result).toEqual(resolvedValue);
    })
  })
});

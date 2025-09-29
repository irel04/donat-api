import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsEntity, EventStatus } from '@/modules/events/events.entity';
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
      id: "user-123",
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword123',
      role: 'admin',
      createdAt: new Date(),
    });

    resolvedValue = {
      id: "event-123",
      description: "Fund Raising",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime: "8:00",
      endTime: "9:00",
      status: EventStatus.PENDING,
      user: dummyUser,
      createdAt: new Date(startDate),
      updatedAt: null,
      isActive: true
    }

    eventsPayload = {
      description: "Fund Raising",
      startDate,
      endDate,
      startTime: "13:00",
      endTime: "14:00"
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
            findAndCount: jest.fn().mockResolvedValue([[resolvedValue], 1]),
            update: jest.fn().mockResolvedValue({
              description: "test-description",
              startDate: "sample date",
              endDate: "end date sample"
            })
          }
        }
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventsRepository = module.get<jest.Mocked<Partial<Repository<EventsEntity>>>>(getRepositoryToken(EventsEntity));

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
    // it("should call findOne with correct id", async () => {
    //   await service.findEventById(resolvedValue.id);
    //   expect(eventsRepository.findOne).toHaveBeenCalledWith({
    //     where: {
    //       id: resolvedValue.id,
    //       isActive: true
    //     }
    //   });
    // })

    it("should return event", async () => {
      const result = await service.findEventById(resolvedValue.id);
      expect(result).toEqual(resolvedValue);
    })
  })

  // describe("get user events", () => {
  //   it("should call findOne with correct user id", async () => {
  //     await service.findEventByUser(dummyUser.id, 10, 1);
  //     expect(eventsRepository.findAndCount).toHaveBeenCalledWith({
  //       where: { user: { id: dummyUser.id } },
  //       skip: 1,
  //       take: 10
  //     });
  //   })
  // })

  describe("edit my own event", () => {
    it("it should call the right parameters", async () => {

      const payload = {
        description: "Change description",
        startDate: "09-13-2025",
        endDate: "09-14-2025"
      };      

      await service.editMyEvent(payload, "event-123", "user-123");

      expect(eventsRepository.update).toHaveBeenCalledWith({
        id: "event-123",
        user: {
          id: "user-123"
        }
      }, payload)
    })

    it("should return null when no event matches the detail", async () => {
    const payload = {
      description: "any",
      startDate,
      endDate
    };

    (eventsRepository.findOneBy as jest.Mock).mockImplementation(() => null);

    const result = await service.editMyEvent(payload, "event-123", "user-irel");
    expect(result).toBe(null)
  })
  }) 


});

import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from '@/modules/events/events.service';
import { EventsEntity, EventStatus } from '@/modules/events/events.entity';
import { User } from '@/modules/users/user.entity';
import { CreateEventDTO, PaginationDTO } from '@/modules/events/events.dto';
import { PaginationMetadata } from '@/common/interceptors/transform.interceptor';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService

  const [startDate, endDate] = ["04-05-2026", "04-06-2026"]
  let dummyUser: User;
  let resolvedValue: EventsEntity;
  let eventsPayload: CreateEventDTO; 
  let resolvedArrayValueWithTotal: { data: EventsEntity[], total: number }

  beforeEach(async () => {
    const fixedDate = new Date("2026-04-05T00:00:00Z");

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
      startDate: fixedDate,
      endDate: fixedDate,
      status: EventStatus.PENDING,
      user: dummyUser,
      createdAt: fixedDate,
      updatedAt: null,
    }

    eventsPayload = {
      description: "Fund Raising",
      startDate,
      endDate
    }

    resolvedArrayValueWithTotal = {
      data: [resolvedValue],
      total: 1
    }


    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
    }).useMocker((token) => {
      if(token === EventsService){
        return {
          createEvent: jest.fn().mockResolvedValue(resolvedValue),
          findAllEvents: jest.fn().mockResolvedValue(resolvedArrayValueWithTotal),
          findEventById: jest.fn().mockResolvedValue(resolvedValue),
          findEventByUser: jest.fn().mockResolvedValue(resolvedArrayValueWithTotal)
        }
      }
    })
    .compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('postEvent', () => {
    it('should call createEvent and return the expected value', async () => {
      const response = await controller.postAnEvent(eventsPayload, dummyUser.id);

      expect(service.createEvent).toHaveBeenCalledWith(eventsPayload, dummyUser.id);
      expect(response).toEqual(resolvedValue)
    })
  })

  describe('findAllEvents', () => {
    it('should call findAllEvents and return the expected value', async () => {
      const query: PaginationDTO = {
        offset: 0,
        limit: 10,
      }
      const response = await controller.getAllEvents(query);

      expect(service.findAllEvents).toHaveBeenCalledWith(query.limit, query.offset);
      expect(response).toMatchObject<{data: EventsEntity[], metadata: PaginationMetadata}>({
        data: [resolvedValue],
        metadata: {
          limit: query.limit,
          offset: query.offset,
          total: resolvedArrayValueWithTotal.total,
          nextPage: null
        }
      });
    })
  })

  describe("findEventById", () => {
    it("should call findEventById with correct id", async () => {
      await controller.getEventById(resolvedValue.id);
      expect(service.findEventById).toHaveBeenCalledWith(resolvedValue.id);
    })

    it("should return event", async () => {
      const result = await controller.getEventById(resolvedValue.id);
      expect(result).toEqual(resolvedValue);
    })
  })

  describe("findEventByUserId", () => {

    const query: PaginationDTO = {
      limit: 10,
      offset: 0
    }

    it("should call findEventByUserId", async () => {
      await controller.getMyEvents(dummyUser.id, query);

      expect(service.findEventByUser).toHaveBeenCalledWith(dummyUser.id, query.limit, query.offset)
    })

    // it("should return event", async () => {
    //   const result = await controller.getMyEvents(dummyUser.id, query);
    //   expect(result).toEqual()
      
    // })
  })
});

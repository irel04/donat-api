import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from '@/modules/events/events.service';
import { EventsEntity, EventStatus } from '@/modules/events/events.entity';
import { User } from '@/modules/users/user.entity';
import { randomUUID } from 'crypto';
import { CreateEventDTO, PaginationDTO } from '@/modules/events/events.dto';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService

  const [startDate, endDate] = ["04-05-2026", "04-06-2026"]
  let dummyUser: User;
  let resolvedValue: EventsEntity;
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
      controllers: [EventsController],
    }).useMocker((token) => {
      if(token === EventsService){
        return {
          createEvent: jest.fn().mockResolvedValue(resolvedValue),
          findAllEvents: jest.fn().mockResolvedValue({
            data: [resolvedValue],
            total: 1
          }),
          findEventById: jest.fn().mockResolvedValue(resolvedValue)
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
      expect(response).toEqual({
        data: [resolvedValue], 
        metadata: {
          offset:0,
          limit: 10,
          total: 1,
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
});

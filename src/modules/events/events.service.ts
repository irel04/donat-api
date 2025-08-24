import { isValidDateFormat, isValidDateRange } from '@/common/utils/date.helper';
import { CreateEventDTO } from '@/modules/events/events.dto';
import { EventsEntity, EventStatus } from '@/modules/events/events.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
	constructor (
		@InjectRepository(EventsEntity)
		private eventsRepository: Repository<EventsEntity>
	){}

	async createEvent(payload: CreateEventDTO, userId: string): Promise<EventsEntity>{

		// Add date validation
		if (!isValidDateFormat(payload.startDate) || !isValidDateFormat(payload.endDate)) {
			throw new BadRequestException('Invalid date format provided(use MM-DD-YYYY format)');
		}

		if(!isValidDateRange(payload.startDate, payload.endDate)){
			throw new BadRequestException('Invalid date range provided');
		}

		const event = this.eventsRepository.create({
			...payload,
			status: EventStatus.PENDING,
			user: { id: userId }
		})

		const savedEvent = await this.eventsRepository.save(event);

		const foundEvent = await this.eventsRepository.findOne
		({
			where: {id: savedEvent.id},
			relations: ['user']
		});
		if (!foundEvent) {
			throw new Error('Event not found after creation');
		}
		
		return foundEvent;
	}
	
	async findAllEvents(limit: number = 20, offset: number = 0): Promise<{ data: EventsEntity[], total: number }> {

			const [data, total] = await this.eventsRepository.findAndCount({
				relations: ['user'],
				skip: offset,
				take: limit
			})


		return { data, total };
	}

	
}

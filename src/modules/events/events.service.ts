import { CreateEventDTO } from '@/modules/events/events.dto';
import { EventsEntity, EventStatus } from '@/modules/events/events.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
	constructor (
		@InjectRepository(EventsEntity)
		private eventsRepository: Repository<EventsEntity>
	){}

	async createEvent(payload: CreateEventDTO, userId: string): Promise<EventsEntity>{


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
}

import { CreateEventDTO } from '@/modules/events/events.dto';
import { EventsEntity } from '@/modules/events/events.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
	constructor (
		@InjectRepository(EventsEntity)
		private eventsRepository: Repository<EventsEntity>
	){}

	async createEvent(payload: CreateEventDTO): Promise<EventsEntity>{
		const event = this.eventsRepository.create(payload)

		return this.eventsRepository.save(event);
	}
}

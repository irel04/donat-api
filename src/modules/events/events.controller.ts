import { Public } from '@/common/decorators/public.decorator';
import { UserParam } from '@/common/decorators/user.decorator';
import { PaginationMetadata } from '@/common/interceptors/transform.interceptor';
import { CreateEventDTO, PaginationDTO } from '@/modules/events/events.dto';
import { EventsService } from '@/modules/events/events.service';
import { Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, Post, Query, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({
	path: "events",
	version: "1"
})
export class EventsController {
	constructor(
		private eventService: EventsService
	){}

	@Post()
	async postAnEvent(@Body() createEventDto: CreateEventDTO, @UserParam("sub") userId: string){
		return this.eventService.createEvent(createEventDto, userId);
	}

	@Public()
	@Get()
	async getAllEvents(@Query() { limit = 20, offset = 0 }: PaginationDTO) {

		const { data, total } = await this.eventService.findAllEvents(limit, offset);

		const metadata: PaginationMetadata = {
			limit,
			offset,
			total,
			nextPage: offset + limit < total ? offset + limit : null
		}

		return {
			data,
			metadata
		};
	}

	@Get('me')
	async getMyEvents(@UserParam("sub") userId: string, @Query() { limit = 20, offset = 0 }: PaginationDTO) {

		const { data, total } = await this.eventService.findEventByUser(userId, limit, offset);

		const metadata: PaginationMetadata = {
			limit,
			offset,
			total,
			nextPage: offset + limit < total ? offset + limit : null
		}

		return {
			data,
			metadata
		};
	}


	@Public()
	@Get(':eventId')
	async getEventById(@Param('eventId') eventId: string) {

		const event = await this.eventService.findEventById(eventId);

		if(!event){
			throw new NotFoundException('Event not found');
		}

		return event;
	}

	
		
}

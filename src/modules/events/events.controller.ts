import { UserParam } from '@/common/decorators/user.decorator';
import { CreateEventDTO } from '@/modules/events/events.dto';
import { EventsService } from '@/modules/events/events.service';
import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('events')
export class EventsController {
	constructor(
		private eventService: EventsService
	){}

	@Post()
	async postAnEvent(@Body() createEventDto: CreateEventDTO, @UserParam("sub") userId: string){
		return this.eventService.createEvent(createEventDto, userId);
	}


}
